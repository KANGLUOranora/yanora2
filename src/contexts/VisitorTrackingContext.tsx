import { createContext, useContext, useEffect, useState, useRef } from 'react';
import { supabase } from '../lib/supabase';
import { useLocation } from 'react-router-dom';

interface VisitorTrackingContextType {
  sessionId: string | null;
  trackPageView: (path: string, title: string) => Promise<void>;
  trackAction: (actionType: string, elementData?: any) => Promise<void>;
}

const VisitorTrackingContext = createContext<VisitorTrackingContextType | undefined>(undefined);

// Generate a unique visitor ID (stored in localStorage)
function getVisitorId(): string {
  let visitorId = localStorage.getItem('visitor_id');
  if (!visitorId) {
    visitorId = `visitor_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    localStorage.setItem('visitor_id', visitorId);
  }
  return visitorId;
}

// Detect device type
function getDeviceType(): string {
  const width = window.innerWidth;
  if (width < 768) return 'mobile';
  if (width < 1024) return 'tablet';
  return 'desktop';
}

// Parse user agent for browser and OS
function getBrowserInfo() {
  const userAgent = navigator.userAgent;
  let browser = 'Unknown';
  let os = 'Unknown';

  // Detect browser
  if (userAgent.indexOf('Firefox') > -1) browser = 'Firefox';
  else if (userAgent.indexOf('Chrome') > -1) browser = 'Chrome';
  else if (userAgent.indexOf('Safari') > -1) browser = 'Safari';
  else if (userAgent.indexOf('Edge') > -1) browser = 'Edge';

  // Detect OS
  if (userAgent.indexOf('Win') > -1) os = 'Windows';
  else if (userAgent.indexOf('Mac') > -1) os = 'macOS';
  else if (userAgent.indexOf('Linux') > -1) os = 'Linux';
  else if (userAgent.indexOf('Android') > -1) os = 'Android';
  else if (userAgent.indexOf('iOS') > -1) os = 'iOS';

  return { browser, os };
}

export function VisitorTrackingProvider({ children }: { children: React.ReactNode }) {
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [currentPageViewId, setCurrentPageViewId] = useState<string | null>(null);
  const location = useLocation();
  const pageStartTime = useRef<Date>(new Date());
  const scrollDepth = useRef<number>(0);
  const clickedElements = useRef<any[]>([]);

  // Initialize session
  useEffect(() => {
    initializeSession();
    trackScrollDepth();
    trackClicks();

    // Update session end time when user leaves
    const handleBeforeUnload = () => {
      endCurrentPageView();
      endSession();
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, []);

  // Track page changes
  useEffect(() => {
    if (sessionId) {
      endCurrentPageView();
      trackPageView(location.pathname, document.title);
    }
  }, [location.pathname, sessionId]);

  async function initializeSession() {
    const visitorId = getVisitorId();
    const { browser, os } = getBrowserInfo();

    const { data: user } = await supabase.auth.getUser();

    const { data, error } = await supabase
      .from('visitor_sessions')
      .insert({
        visitor_id: visitorId,
        user_id: user?.user?.id || null,
        user_agent: navigator.userAgent,
        referrer: document.referrer || null,
        landing_page: location.pathname,
        device_type: getDeviceType(),
        browser,
        os,
      })
      .select()
      .single();

    if (data && !error) {
      setSessionId(data.id);
    }
  }

  async function trackPageView(path: string, title: string) {
    if (!sessionId) return;

    pageStartTime.current = new Date();
    scrollDepth.current = 0;
    clickedElements.current = [];

    const { data, error } = await supabase
      .from('page_views')
      .insert({
        session_id: sessionId,
        page_url: window.location.href,
        page_path: path,
        page_title: title,
        view_start: new Date().toISOString(),
      })
      .select()
      .single();

    if (data && !error) {
      setCurrentPageViewId(data.id);

      // Update session page view count
      await supabase.rpc('increment_page_views', { session_uuid: sessionId });
    }
  }

  async function endCurrentPageView() {
    if (!currentPageViewId || !sessionId) return;

    const viewEnd = new Date();
    const durationSeconds = Math.floor((viewEnd.getTime() - pageStartTime.current.getTime()) / 1000);

    await supabase
      .from('page_views')
      .update({
        view_end: viewEnd.toISOString(),
        duration_seconds: durationSeconds,
        scroll_depth_percent: scrollDepth.current,
        clicked_elements: clickedElements.current,
      })
      .eq('id', currentPageViewId);

    // Update session total duration
    await supabase.rpc('update_session_duration', {
      session_uuid: sessionId,
      additional_seconds: durationSeconds
    });
  }

  async function endSession() {
    if (!sessionId) return;

    await supabase
      .from('visitor_sessions')
      .update({
        session_end: new Date().toISOString(),
      })
      .eq('id', sessionId);
  }

  async function trackAction(actionType: string, elementData?: any) {
    if (!sessionId) return;

    await supabase
      .from('visitor_actions')
      .insert({
        session_id: sessionId,
        page_view_id: currentPageViewId,
        action_type: actionType,
        element_id: elementData?.id || null,
        element_class: elementData?.className || null,
        element_text: elementData?.text || null,
        action_data: elementData || null,
      });
  }

  function trackScrollDepth() {
    const handleScroll = () => {
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      const scrollTop = window.scrollY;
      const depth = Math.min(100, Math.round(((scrollTop + windowHeight) / documentHeight) * 100));

      if (depth > scrollDepth.current) {
        scrollDepth.current = depth;
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }

  function trackClicks() {
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const elementInfo = {
        tag: target.tagName,
        id: target.id || null,
        className: target.className || null,
        text: target.textContent?.substring(0, 100) || null,
        href: (target as HTMLAnchorElement).href || null,
      };

      clickedElements.current.push(elementInfo);

      // Track important clicks (buttons, links)
      if (target.tagName === 'BUTTON' || target.tagName === 'A') {
        trackAction('click', elementInfo);
      }
    };

    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }

  return (
    <VisitorTrackingContext.Provider value={{ sessionId, trackPageView, trackAction }}>
      {children}
    </VisitorTrackingContext.Provider>
  );
}

export function useVisitorTracking() {
  const context = useContext(VisitorTrackingContext);
  if (context === undefined) {
    throw new Error('useVisitorTracking must be used within a VisitorTrackingProvider');
  }
  return context;
}
