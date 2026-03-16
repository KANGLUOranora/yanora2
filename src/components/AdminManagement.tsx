import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { UserPlus, CreditCard as Edit2, Trash2, Check, X } from 'lucide-react';

interface Admin {
  id: string;
  email: string;
  role: 'admin' | 'super_admin';
  is_active: boolean;
  created_at: string;
}

function AdminManagement() {
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentUserRole, setCurrentUserRole] = useState<string>('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingAdmin, setEditingAdmin] = useState<Admin | null>(null);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    role: 'admin' as 'admin' | 'super_admin',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    checkCurrentUserRole();
    fetchAdmins();
  }, []);

  const checkCurrentUserRole = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data } = await supabase
      .from('admins')
      .select('role')
      .eq('id', user.id)
      .maybeSingle();

    if (data) {
      setCurrentUserRole(data.role);
    }
  };

  const fetchAdmins = async () => {
    try {
      const { data, error } = await supabase
        .from('admins')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setAdmins(data || []);
    } catch (error) {
      console.error('Error fetching admins:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            role: formData.role,
          },
        },
      });

      if (authError) throw authError;

      if (authData.user) {
        const { error: insertError } = await supabase
          .from('admins')
          .insert({
            id: authData.user.id,
            email: formData.email,
            role: formData.role,
            is_active: true,
          });

        if (insertError) throw insertError;

        setSuccess('管理员添加成功');
        setShowAddModal(false);
        setFormData({ email: '', password: '', role: 'admin' });
        fetchAdmins();
      }
    } catch (err: any) {
      setError(err.message || '添加管理员失败');
    }
  };

  const handleUpdateAdmin = async (adminId: string, updates: Partial<Admin>) => {
    try {
      const { error } = await supabase
        .from('admins')
        .update(updates)
        .eq('id', adminId);

      if (error) throw error;

      setSuccess('管理员信息已更新');
      fetchAdmins();
    } catch (err: any) {
      setError(err.message || '更新失败');
    }
  };

  const handleToggleActive = async (admin: Admin) => {
    await handleUpdateAdmin(admin.id, { is_active: !admin.is_active });
  };

  const handleUpdateRole = async (admin: Admin) => {
    const newRole = admin.role === 'admin' ? 'super_admin' : 'admin';
    await handleUpdateAdmin(admin.id, { role: newRole });
  };

  if (currentUserRole !== 'super_admin') {
    return (
      <div className="text-center py-12">
        <p style={{color: '#6B7280'}}>您没有权限访问此页面</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="text-center py-12">
        <p style={{color: '#6B7280'}}>加载中...</p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-2xl font-light mb-2" style={{color: '#1F1F1F'}}>管理员管理</h2>
          <p className="text-sm" style={{color: '#6B7280'}}>管理系统管理员账户</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-black text-white text-sm transition hover:opacity-80"
        >
          <UserPlus className="w-4 h-4" />
          添加管理员
        </button>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 text-sm">
          {error}
        </div>
      )}

      {success && (
        <div className="mb-4 p-3 bg-green-50 border border-green-200 text-green-600 text-sm">
          {success}
        </div>
      )}

      <div className="bg-white border" style={{borderColor: '#E5E7EB'}}>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead style={{backgroundColor: '#F9FAFB'}}>
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium" style={{color: '#6B7280'}}>
                  邮箱
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium" style={{color: '#6B7280'}}>
                  角色
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium" style={{color: '#6B7280'}}>
                  状态
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium" style={{color: '#6B7280'}}>
                  创建时间
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium" style={{color: '#6B7280'}}>
                  操作
                </th>
              </tr>
            </thead>
            <tbody className="divide-y" style={{borderColor: '#E5E7EB'}}>
              {admins.map((admin) => (
                <tr key={admin.id}>
                  <td className="px-6 py-4 text-sm" style={{color: '#1F1F1F'}}>
                    {admin.email}
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <span
                      className="px-2 py-1 text-xs rounded"
                      style={{
                        backgroundColor: admin.role === 'super_admin' ? '#DBEAFE' : '#F3F4F6',
                        color: admin.role === 'super_admin' ? '#1E40AF' : '#6B7280',
                      }}
                    >
                      {admin.role === 'super_admin' ? '超级管理员' : '普通管理员'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <span
                      className="px-2 py-1 text-xs rounded"
                      style={{
                        backgroundColor: admin.is_active ? '#D1FAE5' : '#FEE2E2',
                        color: admin.is_active ? '#065F46' : '#991B1B',
                      }}
                    >
                      {admin.is_active ? '激活' : '禁用'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm" style={{color: '#6B7280'}}>
                    {new Date(admin.created_at).toLocaleDateString('zh-CN')}
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleUpdateRole(admin)}
                        className="p-1 hover:bg-gray-100 rounded transition"
                        title="切换角色"
                      >
                        <Edit2 className="w-4 h-4" style={{color: '#6B7280'}} />
                      </button>
                      <button
                        onClick={() => handleToggleActive(admin)}
                        className={`p-1 rounded transition ${
                          admin.is_active ? 'hover:bg-red-50' : 'hover:bg-green-50'
                        }`}
                        title={admin.is_active ? '禁用' : '激活'}
                      >
                        {admin.is_active ? (
                          <X className="w-4 h-4" style={{color: '#DC2626'}} />
                        ) : (
                          <Check className="w-4 h-4" style={{color: '#059669'}} />
                        )}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white p-6 max-w-md w-full">
            <h3 className="text-xl font-light mb-4" style={{color: '#1F1F1F'}}>
              添加新管理员
            </h3>

            <form onSubmit={handleAddAdmin} className="space-y-4">
              <div>
                <label className="block text-sm mb-2" style={{color: '#4B5563'}}>
                  邮箱
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-2 border focus:outline-none focus:border-gray-400"
                  style={{borderColor: '#D1D5DB'}}
                  required
                />
              </div>

              <div>
                <label className="block text-sm mb-2" style={{color: '#4B5563'}}>
                  密码
                </label>
                <input
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full px-4 py-2 border focus:outline-none focus:border-gray-400"
                  style={{borderColor: '#D1D5DB'}}
                  minLength={6}
                  required
                />
              </div>

              <div>
                <label className="block text-sm mb-2" style={{color: '#4B5563'}}>
                  角色
                </label>
                <select
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value as 'admin' | 'super_admin' })}
                  className="w-full px-4 py-2 border focus:outline-none focus:border-gray-400"
                  style={{borderColor: '#D1D5DB'}}
                >
                  <option value="admin">普通管理员</option>
                  <option value="super_admin">超级管理员</option>
                </select>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowAddModal(false);
                    setFormData({ email: '', password: '', role: 'admin' });
                    setError('');
                  }}
                  className="flex-1 px-4 py-2 border text-sm transition hover:bg-gray-50"
                  style={{borderColor: '#D1D5DB', color: '#6B7280'}}
                >
                  取消
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-black text-white text-sm transition hover:opacity-80"
                >
                  添加
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminManagement;
