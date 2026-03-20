import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { BarChart3, Users, Eye, TrendingUp, Calendar, Monitor, Smartphone, Tablet } from 'lucide-react';

interface PageView {
  id: string;
  page_path: string;
  page_title: string;
  user_id: string | null;
  session_id: string;
  referrer: string | null;
  device_type: string;
  visited_at: string;
}

interface PageStats {
  path: string;
  title: string;
  views: number;
  uniqueVisitors: number;
}

interface DeviceStats {
  desktop: number;
  mobile: number;
  tablet: number;
}

export default function AnalyticsManagement() {
  const [pageViews, setPageViews] = useState<PageView[]>([]);
  const [pageStats, setPageStats] = useState<PageStats[]>([]);
  const [deviceStats, setDeviceStats] = useState<DeviceStats>({ desktop: 0, mobile: 0, tablet: 0 });
  const [totalViews, setTotalViews] = useState(0);
  const [uniqueVisitors, setUniqueVisitors] = useState(0);
  const [dateRange, setDateRange] = useState<'today' | 'week' | 'month' | 'all'>('week');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, [dateRange]);

  const getDateFilter = () => {
    const now = new Date();
    switch (dateRange) {
      case 'today':
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        return today.toISOString();
      case 'week':
        const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        return weekAgo.toISOString();
      case 'month':
        const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        return monthAgo.toISOString();
      default:
        return null;
    }
  };

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const dateFilter = getDateFilter();

      let query = supabase
        .from('page_analytics')
        .select('*')
        .order('visited_at', { ascending: false });

      if (dateFilter) {
        query = query.gte('visited_at', dateFilter);
      }

      const { data, error } = await query;

      if (error) throw error;

      setPageViews(data || []);
      calculateStats(data || []);
    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (views: PageView[]) => {
    setTotalViews(views.length);

    const uniqueSessions = new Set(views.map(v => v.session_id));
    setUniqueVisitors(uniqueSessions.size);

    const pathMap = new Map<string, { title: string; views: number; sessions: Set<string> }>();
    views.forEach(view => {
      const existing = pathMap.get(view.page_path);
      if (existing) {
        existing.views++;
        existing.sessions.add(view.session_id);
      } else {
        pathMap.set(view.page_path, {
          title: view.page_title || view.page_path,
          views: 1,
          sessions: new Set([view.session_id])
        });
      }
    });

    const stats: PageStats[] = Array.from(pathMap.entries()).map(([path, data]) => ({
      path,
      title: data.title,
      views: data.views,
      uniqueVisitors: data.sessions.size
    }));

    stats.sort((a, b) => b.views - a.views);
    setPageStats(stats.slice(0, 10));

    const devices = { desktop: 0, mobile: 0, tablet: 0 };
    views.forEach(view => {
      if (view.device_type === 'desktop') devices.desktop++;
      else if (view.device_type === 'mobile') devices.mobile++;
      else if (view.device_type === 'tablet') devices.tablet++;
    });
    setDeviceStats(devices);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12">
        <div className="text-gray-500">加载中...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold text-gray-800">访问统计</h2>
        <div className="flex gap-2">
          <button
            onClick={() => setDateRange('today')}
            className={`px-4 py-2 text-sm rounded-lg transition ${
              dateRange === 'today'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            今天
          </button>
          <button
            onClick={() => setDateRange('week')}
            className={`px-4 py-2 text-sm rounded-lg transition ${
              dateRange === 'week'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            近7天
          </button>
          <button
            onClick={() => setDateRange('month')}
            className={`px-4 py-2 text-sm rounded-lg transition ${
              dateRange === 'month'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            近30天
          </button>
          <button
            onClick={() => setDateRange('all')}
            className={`px-4 py-2 text-sm rounded-lg transition ${
              dateRange === 'all'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            全部
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-2">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Eye className="w-6 h-6 text-blue-600" />
            </div>
          </div>
          <div className="text-2xl font-bold text-gray-800">{totalViews}</div>
          <div className="text-sm text-gray-500">总浏览量</div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-2">
            <div className="p-2 bg-green-100 rounded-lg">
              <Users className="w-6 h-6 text-green-600" />
            </div>
          </div>
          <div className="text-2xl font-bold text-gray-800">{uniqueVisitors}</div>
          <div className="text-sm text-gray-500">独立访客</div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-2">
            <div className="p-2 bg-purple-100 rounded-lg">
              <BarChart3 className="w-6 h-6 text-purple-600" />
            </div>
          </div>
          <div className="text-2xl font-bold text-gray-800">{pageStats.length}</div>
          <div className="text-sm text-gray-500">访问页面数</div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-2">
            <div className="p-2 bg-orange-100 rounded-lg">
              <TrendingUp className="w-6 h-6 text-orange-600" />
            </div>
          </div>
          <div className="text-2xl font-bold text-gray-800">
            {uniqueVisitors > 0 ? (totalViews / uniqueVisitors).toFixed(1) : '0'}
          </div>
          <div className="text-sm text-gray-500">平均访问页数</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">设备类型分布</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Monitor className="w-5 h-5 text-gray-600" />
                <span className="text-gray-700">桌面端</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-32 bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full"
                    style={{
                      width: `${totalViews > 0 ? (deviceStats.desktop / totalViews) * 100 : 0}%`
                    }}
                  ></div>
                </div>
                <span className="text-gray-700 font-semibold w-12 text-right">
                  {deviceStats.desktop}
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Smartphone className="w-5 h-5 text-gray-600" />
                <span className="text-gray-700">移动端</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-32 bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-green-600 h-2 rounded-full"
                    style={{
                      width: `${totalViews > 0 ? (deviceStats.mobile / totalViews) * 100 : 0}%`
                    }}
                  ></div>
                </div>
                <span className="text-gray-700 font-semibold w-12 text-right">
                  {deviceStats.mobile}
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Tablet className="w-5 h-5 text-gray-600" />
                <span className="text-gray-700">平板端</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-32 bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-purple-600 h-2 rounded-full"
                    style={{
                      width: `${totalViews > 0 ? (deviceStats.tablet / totalViews) * 100 : 0}%`
                    }}
                  ></div>
                </div>
                <span className="text-gray-700 font-semibold w-12 text-right">
                  {deviceStats.tablet}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">热门页面 Top 10</h3>
          <div className="space-y-3 max-h-64 overflow-y-auto">
            {pageStats.map((stat, index) => (
              <div key={stat.path} className="flex items-center justify-between py-2 border-b border-gray-100">
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <span className="text-gray-500 font-semibold w-6">{index + 1}</span>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-gray-800 truncate">{stat.title}</div>
                    <div className="text-xs text-gray-500 truncate">{stat.path}</div>
                  </div>
                </div>
                <div className="flex items-center gap-4 ml-4">
                  <div className="text-right">
                    <div className="text-sm font-semibold text-gray-800">{stat.views}</div>
                    <div className="text-xs text-gray-500">浏览</div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-semibold text-blue-600">{stat.uniqueVisitors}</div>
                    <div className="text-xs text-gray-500">访客</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800">最近访问记录</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  访问时间
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  页面
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  设备类型
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  来源
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {pageViews.slice(0, 50).map((view) => (
                <tr key={view.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {formatDate(view.visited_at)}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    <div className="font-medium">{view.page_title || view.page_path}</div>
                    <div className="text-xs text-gray-500">{view.page_path}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <div className="flex items-center gap-2">
                      {view.device_type === 'desktop' && <Monitor className="w-4 h-4 text-gray-600" />}
                      {view.device_type === 'mobile' && <Smartphone className="w-4 h-4 text-gray-600" />}
                      {view.device_type === 'tablet' && <Tablet className="w-4 h-4 text-gray-600" />}
                      <span className="capitalize">{view.device_type}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">
                    {view.referrer || '直接访问'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
