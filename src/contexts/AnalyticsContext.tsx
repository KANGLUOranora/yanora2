import React, { createContext, useContext, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useAuth } from './AuthContext';

interface AnalyticsContextType {
  trackPageView: (path: string, title?: string) => Promise<void>;
}

const AnalyticsContext = createContext<AnalyticsContextType | undefined>(undefined);

function getSessionId(): string {
  let sessionId = sessionStorage.getItem('analytics_session_id');
  if (!sessionId) {
    sessionId = `session_${Date.now()}_${Math.random().toString(36).substring(2)}`;
    sessionStorage.setItem('analytics_session_id', sessionId);
  }
  return sessionId;
}

function getDeviceType(): string {
  const ua = navigator.userAgent;
  if (/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(ua)) {
    return 'tablet';
  }
  if (/Mobile|Android|iP(hone|od)|IEMobile|BlackBerry|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/.test(ua)) {
    return 'mobile';
  }
  return 'desktop';
}

export function AnalyticsProvider({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const { user } = useAuth();

  const trackPageView = async (path: string, title?: string) => {
    try {
      const sessionId = getSessionId();
      const deviceType = getDeviceType();
      const pageTitle = title || document.title;

      await supabase.from('page_analytics').insert({
        page_path: path,
        page_title: pageTitle,
        user_id: user?.id || null,
        session_id: sessionId,
        referrer: document.referrer || null,
        user_agent: navigator.userAgent,
        device_type: deviceType,
        visited_at: new Date().toISOString(),
      });
    } catch (error) {
      console.error('Failed to track page view:', error);
    }
  };

  useEffect(() => {
    trackPageView(location.pathname + location.search);
  }, [location.pathname, location.search]);

  return (
    <AnalyticsContext.Provider value={{ trackPageView }}>
      {children}
    </AnalyticsContext.Provider>
  );
}

export function useAnalytics() {
  const context = useContext(AnalyticsContext);
  if (context === undefined) {
    throw new Error('useAnalytics must be used within an AnalyticsProvider');
  }
  return context;
}
