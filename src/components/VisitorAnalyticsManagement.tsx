import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Users, MousePointer, Clock, Globe, ChevronDown, ChevronUp, Search } from 'lucide-react';

interface VisitorSession {
  id: string;
  visitor_id: string;
  user_id: string | null;
  landing_page: string;
  session_start: string;
  session_end: string | null;
  total_page_views: number;
  total_duration_seconds: number;
  device_type: string;
  browser: string | null;
  os: string | null;
  country: string | null;
  city: string | null;
  referrer: string | null;
}

interface PageView {
  id: string;
  page_path: string;
  page_title: string | null;
  view_start: string;
  view_end: string | null;
  duration_seconds: number | null;
  scroll_depth_percent: number | null;
}

interface VisitorAction {
  id: string;
  action_type: string;
  element_text: string | null;
  created_at: string;
}

export default function VisitorAnalyticsManagement() {
  const [sessions, setSessions] = useState<VisitorSession[]>([]);
  const [selectedSession, setSelectedSession] = useState<string | null>(null);
  const [pageViews, setPageViews] = useState<PageView[]>([]);
  const [actions, setActions] = useState<VisitorAction[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [stats, setStats] = useState({
    totalSessions: 0,
    activeSessions: 0,
    avgDuration: 0,
    totalPageViews: 0,
  });

  useEffect(() => {
    fetchSessions();
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const { data: sessionsData } = await supabase
        .from('visitor_sessions')
        .select('total_duration_seconds, total_page_views, session_end');

      if (sessionsData) {
        const totalSessions = sessionsData.length;
        const activeSessions = sessionsData.filter(s => !s.session_end).length;
        const avgDuration = sessionsData.reduce((sum, s) => sum + (s.total_duration_seconds || 0), 0) / totalSessions;
        const totalPageViews = sessionsData.reduce((sum, s) => sum + (s.total_page_views || 0), 0);

        setStats({
          totalSessions,
          activeSessions,
          avgDuration: Math.round(avgDuration),
          totalPageViews,
        });
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const fetchSessions = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('visitor_sessions')
        .select('*')
        .order('session_start', { ascending: false })
        .limit(50);

      if (error) throw error;
      setSessions(data || []);
    } catch (error) {
      console.error('Error fetching sessions:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchSessionDetails = async (sessionId: string) => {
    try {
      const { data: pageViewsData } = await supabase
        .from('page_views')
        .select('*')
        .eq('session_id', sessionId)
        .order('view_start', { ascending: true });

      const { data: actionsData } = await supabase
        .from('visitor_actions')
        .select('*')
        .eq('session_id', sessionId)
        .order('created_at', { ascending: true });

      setPageViews(pageViewsData || []);
      setActions(actionsData || []);
    } catch (error) {
      console.error('Error fetching session details:', error);
    }
  };

  const toggleSessionDetails = (sessionId: string) => {
    if (selectedSession === sessionId) {
      setSelectedSession(null);
      setPageViews([]);
      setActions([]);
    } else {
      setSelectedSession(sessionId);
      fetchSessionDetails(sessionId);
    }
  };

  const formatDuration = (seconds: number | null) => {
    if (!seconds) return '0s';
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return mins > 0 ? `${mins}m ${secs}s` : `${secs}s`;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const filteredSessions = sessions.filter(session =>
    session.visitor_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    session.landing_page.toLowerCase().includes(searchTerm.toLowerCase()) ||
    session.device_type?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-600">加载中...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-light" style={{ color: '#1F1F1F' }}>
          访客行为分析
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white border p-6" style={{ borderColor: '#E5E7EB' }}>
          <div className="flex items-center gap-3 mb-2">
            <Users className="w-5 h-5" style={{ color: '#1C2B3A' }} />
            <span className="text-sm" style={{ color: '#6B7280' }}>总访问次数</span>
          </div>
          <div className="text-3xl font-light" style={{ color: '#1F1F1F' }}>
            {stats.totalSessions}
          </div>
        </div>

        <div className="bg-white border p-6" style={{ borderColor: '#E5E7EB' }}>
          <div className="flex items-center gap-3 mb-2">
            <Globe className="w-5 h-5" style={{ color: '#1C2B3A' }} />
            <span className="text-sm" style={{ color: '#6B7280' }}>当前在线</span>
          </div>
          <div className="text-3xl font-light" style={{ color: '#1F1F1F' }}>
            {stats.activeSessions}
          </div>
        </div>

        <div className="bg-white border p-6" style={{ borderColor: '#E5E7EB' }}>
          <div className="flex items-center gap-3 mb-2">
            <Clock className="w-5 h-5" style={{ color: '#1C2B3A' }} />
            <span className="text-sm" style={{ color: '#6B7280' }}>平均停留</span>
          </div>
          <div className="text-3xl font-light" style={{ color: '#1F1F1F' }}>
            {formatDuration(stats.avgDuration)}
          </div>
        </div>

        <div className="bg-white border p-6" style={{ borderColor: '#E5E7EB' }}>
          <div className="flex items-center gap-3 mb-2">
            <MousePointer className="w-5 h-5" style={{ color: '#1C2B3A' }} />
            <span className="text-sm" style={{ color: '#6B7280' }}>总页面浏览</span>
          </div>
          <div className="text-3xl font-light" style={{ color: '#1F1F1F' }}>
            {stats.totalPageViews}
          </div>
        </div>
      </div>

      <div className="bg-white border" style={{ borderColor: '#E5E7EB' }}>
        <div className="p-4 border-b" style={{ borderColor: '#E5E7EB' }}>
          <div className="flex items-center gap-3">
            <Search className="w-5 h-5" style={{ color: '#6B7280' }} />
            <input
              type="text"
              placeholder="搜索访客ID、着陆页或设备类型..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1 outline-none text-sm"
              style={{ color: '#1F1F1F' }}
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  访客
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  着陆页
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  访问时间
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  停留时长
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  页面浏览
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  设备
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  状态
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  详情
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredSessions.map((session) => (
                <>
                  <tr key={session.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm" style={{ color: '#1F1F1F' }}>
                        {session.visitor_id.substring(0, 20)}...
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm" style={{ color: '#6B7280' }}>
                        {session.landing_page}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm" style={{ color: '#6B7280' }}>
                        {formatDate(session.session_start)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm" style={{ color: '#1F1F1F' }}>
                        {formatDuration(session.total_duration_seconds)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm" style={{ color: '#1F1F1F' }}>
                        {session.total_page_views}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm" style={{ color: '#6B7280' }}>
                        {session.device_type} / {session.browser}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 py-1 text-xs rounded ${
                          session.session_end
                            ? 'bg-gray-100 text-gray-800'
                            : 'bg-green-100 text-green-800'
                        }`}
                      >
                        {session.session_end ? '已结束' : '在线'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        onClick={() => toggleSessionDetails(session.id)}
                        className="text-sm flex items-center gap-1 transition"
                        style={{ color: '#1C2B3A' }}
                      >
                        {selectedSession === session.id ? (
                          <>
                            <ChevronUp className="w-4 h-4" />
                            收起
                          </>
                        ) : (
                          <>
                            <ChevronDown className="w-4 h-4" />
                            展开
                          </>
                        )}
                      </button>
                    </td>
                  </tr>

                  {selectedSession === session.id && (
                    <tr>
                      <td colSpan={8} className="px-6 py-4 bg-gray-50">
                        <div className="space-y-4">
                          <div>
                            <h4 className="text-sm font-medium mb-2" style={{ color: '#1F1F1F' }}>
                              浏览页面列表
                            </h4>
                            <div className="bg-white border rounded p-3" style={{ borderColor: '#E5E7EB' }}>
                              {pageViews.length > 0 ? (
                                <div className="space-y-2">
                                  {pageViews.map((pv, idx) => (
                                    <div key={pv.id} className="flex items-center justify-between text-sm py-2 border-b last:border-b-0" style={{ borderColor: '#E5E7EB' }}>
                                      <div className="flex items-center gap-3">
                                        <span className="text-xs px-2 py-1 bg-gray-100 rounded" style={{ color: '#6B7280' }}>
                                          {idx + 1}
                                        </span>
                                        <div>
                                          <div style={{ color: '#1F1F1F' }}>{pv.page_path}</div>
                                          <div className="text-xs" style={{ color: '#6B7280' }}>
                                            {formatDate(pv.view_start)}
                                          </div>
                                        </div>
                                      </div>
                                      <div className="flex items-center gap-4">
                                        <div className="text-xs" style={{ color: '#6B7280' }}>
                                          停留: {formatDuration(pv.duration_seconds)}
                                        </div>
                                        <div className="text-xs" style={{ color: '#6B7280' }}>
                                          滚动: {pv.scroll_depth_percent || 0}%
                                        </div>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              ) : (
                                <div className="text-sm text-center py-4" style={{ color: '#6B7280' }}>
                                  暂无页面浏览记录
                                </div>
                              )}
                            </div>
                          </div>

                          <div>
                            <h4 className="text-sm font-medium mb-2" style={{ color: '#1F1F1F' }}>
                              用户交互记录
                            </h4>
                            <div className="bg-white border rounded p-3" style={{ borderColor: '#E5E7EB' }}>
                              {actions.length > 0 ? (
                                <div className="space-y-2">
                                  {actions.map((action) => (
                                    <div key={action.id} className="flex items-center justify-between text-sm py-2 border-b last:border-b-0" style={{ borderColor: '#E5E7EB' }}>
                                      <div className="flex items-center gap-3">
                                        <MousePointer className="w-4 h-4" style={{ color: '#6B7280' }} />
                                        <div>
                                          <div style={{ color: '#1F1F1F' }}>
                                            {action.action_type}
                                          </div>
                                          {action.element_text && (
                                            <div className="text-xs" style={{ color: '#6B7280' }}>
                                              {action.element_text}
                                            </div>
                                          )}
                                        </div>
                                      </div>
                                      <div className="text-xs" style={{ color: '#6B7280' }}>
                                        {formatDate(action.created_at)}
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              ) : (
                                <div className="text-sm text-center py-4" style={{ color: '#6B7280' }}>
                                  暂无交互记录
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </>
              ))}
            </tbody>
          </table>

          {filteredSessions.length === 0 && (
            <div className="text-center py-12" style={{ color: '#6B7280' }}>
              暂无访客数据
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
