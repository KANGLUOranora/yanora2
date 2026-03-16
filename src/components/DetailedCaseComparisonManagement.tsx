import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Upload, Plus, CreditCard as Edit2, Trash2, Save, X } from 'lucide-react';

interface DetailedCaseComparison {
  id: string;
  title_zh: string;
  title_en: string;
  before_image_url: string;
  after_image_url: string;
  timeline_months: number;
  feature1_title_zh: string;
  feature1_title_en: string;
  feature1_desc_zh: string;
  feature1_desc_en: string;
  feature2_title_zh: string;
  feature2_title_en: string;
  feature2_desc_zh: string;
  feature2_desc_en: string;
  feature3_title_zh: string;
  feature3_title_en: string;
  feature3_desc_zh: string;
  feature3_desc_en: string;
  display_order: number;
  is_active: boolean;
}

interface FormData {
  title_zh: string;
  title_en: string;
  before_image_url: string;
  after_image_url: string;
  timeline_months: number;
  feature1_title_zh: string;
  feature1_title_en: string;
  feature1_desc_zh: string;
  feature1_desc_en: string;
  feature2_title_zh: string;
  feature2_title_en: string;
  feature2_desc_zh: string;
  feature2_desc_en: string;
  feature3_title_zh: string;
  feature3_title_en: string;
  feature3_desc_zh: string;
  feature3_desc_en: string;
  display_order: number;
  is_active: boolean;
}

export default function DetailedCaseComparisonManagement() {
  const [cases, setCases] = useState<DetailedCaseComparison[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [uploadingBefore, setUploadingBefore] = useState(false);
  const [uploadingAfter, setUploadingAfter] = useState(false);

  const [formData, setFormData] = useState<FormData>({
    title_zh: '真实案例对比',
    title_en: 'Real Case Comparisons',
    before_image_url: '',
    after_image_url: '',
    timeline_months: 6,
    feature1_title_zh: '',
    feature1_title_en: '',
    feature1_desc_zh: '',
    feature1_desc_en: '',
    feature2_title_zh: '',
    feature2_title_en: '',
    feature2_desc_zh: '',
    feature2_desc_en: '',
    feature3_title_zh: '',
    feature3_title_en: '',
    feature3_desc_zh: '',
    feature3_desc_en: '',
    display_order: 0,
    is_active: true
  });

  useEffect(() => {
    fetchCases();
  }, []);

  const fetchCases = async () => {
    try {
      const { data, error } = await supabase
        .from('detailed_case_comparisons')
        .select('*')
        .order('display_order', { ascending: true });

      if (error) throw error;
      setCases(data || []);
    } catch (error) {
      console.error('Error fetching cases:', error);
      alert('获取案例失败');
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (file: File, type: 'before' | 'after') => {
    try {
      if (type === 'before') setUploadingBefore(true);
      else setUploadingAfter(true);

      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('case-comparisons')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data } = supabase.storage
        .from('case-comparisons')
        .getPublicUrl(filePath);

      if (type === 'before') {
        setFormData({ ...formData, before_image_url: data.publicUrl });
      } else {
        setFormData({ ...formData, after_image_url: data.publicUrl });
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      alert('上传图片失败');
    } finally {
      if (type === 'before') setUploadingBefore(false);
      else setUploadingAfter(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.before_image_url || !formData.after_image_url) {
      alert('请上传前后对比图片');
      return;
    }

    try {
      if (editingId) {
        const { error } = await supabase
          .from('detailed_case_comparisons')
          .update(formData)
          .eq('id', editingId);

        if (error) throw error;
        alert('更新成功');
      } else {
        const { error } = await supabase
          .from('detailed_case_comparisons')
          .insert([formData]);

        if (error) throw error;
        alert('添加成功');
      }

      resetForm();
      fetchCases();
    } catch (error) {
      console.error('Error saving case:', error);
      alert('保存失败');
    }
  };

  const handleEdit = (caseItem: DetailedCaseComparison) => {
    setFormData({
      title_zh: caseItem.title_zh,
      title_en: caseItem.title_en,
      before_image_url: caseItem.before_image_url,
      after_image_url: caseItem.after_image_url,
      timeline_months: caseItem.timeline_months,
      feature1_title_zh: caseItem.feature1_title_zh,
      feature1_title_en: caseItem.feature1_title_en,
      feature1_desc_zh: caseItem.feature1_desc_zh,
      feature1_desc_en: caseItem.feature1_desc_en,
      feature2_title_zh: caseItem.feature2_title_zh,
      feature2_title_en: caseItem.feature2_title_en,
      feature2_desc_zh: caseItem.feature2_desc_zh,
      feature2_desc_en: caseItem.feature2_desc_en,
      feature3_title_zh: caseItem.feature3_title_zh,
      feature3_title_en: caseItem.feature3_title_en,
      feature3_desc_zh: caseItem.feature3_desc_zh,
      feature3_desc_en: caseItem.feature3_desc_en,
      display_order: caseItem.display_order,
      is_active: caseItem.is_active
    });
    setEditingId(caseItem.id);
    setShowAddForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('确定要删除这个案例吗？')) return;

    try {
      const { error } = await supabase
        .from('detailed_case_comparisons')
        .delete()
        .eq('id', id);

      if (error) throw error;
      alert('删除成功');
      fetchCases();
    } catch (error) {
      console.error('Error deleting case:', error);
      alert('删除失败');
    }
  };

  const resetForm = () => {
    setFormData({
      title_zh: '真实案例对比',
      title_en: 'Real Case Comparisons',
      before_image_url: '',
      after_image_url: '',
      timeline_months: 6,
      feature1_title_zh: '',
      feature1_title_en: '',
      feature1_desc_zh: '',
      feature1_desc_en: '',
      feature2_title_zh: '',
      feature2_title_en: '',
      feature2_desc_zh: '',
      feature2_desc_en: '',
      feature3_title_zh: '',
      feature3_title_en: '',
      feature3_desc_zh: '',
      feature3_desc_en: '',
      display_order: 0,
      is_active: true
    });
    setEditingId(null);
    setShowAddForm(false);
  };

  if (loading) {
    return <div className="text-center py-8">加载中...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold" style={{color: '#1F2937'}}>详细案例对比管理</h2>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="flex items-center gap-2 px-4 py-2 text-white rounded-lg hover:opacity-90 transition-opacity"
          style={{backgroundColor: '#9DB4C8'}}
        >
          {showAddForm ? <X size={20} /> : <Plus size={20} />}
          {showAddForm ? '取消' : '添加案例'}
        </button>
      </div>

      {showAddForm && (
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold mb-4" style={{color: '#1F2937'}}>
            {editingId ? '编辑案例' : '添加新案例'}
          </h3>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium mb-2" style={{color: '#1F2937'}}>
                  标题（中文）
                </label>
                <input
                  type="text"
                  value={formData.title_zh}
                  onChange={(e) => setFormData({ ...formData, title_zh: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2" style={{color: '#1F2937'}}>
                  Title (English)
                </label>
                <input
                  type="text"
                  value={formData.title_en}
                  onChange={(e) => setFormData({ ...formData, title_en: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium mb-2" style={{color: '#1F2937'}}>
                  术前照片
                </label>
                <div className="space-y-2">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => e.target.files?.[0] && handleImageUpload(e.target.files[0], 'before')}
                    className="w-full"
                    disabled={uploadingBefore}
                  />
                  {uploadingBefore && <p className="text-sm text-gray-500">上传中...</p>}
                  {formData.before_image_url && (
                    <img src={formData.before_image_url} alt="Before" className="w-full h-48 object-cover rounded" />
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2" style={{color: '#1F2937'}}>
                  术后照片
                </label>
                <div className="space-y-2">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => e.target.files?.[0] && handleImageUpload(e.target.files[0], 'after')}
                    className="w-full"
                    disabled={uploadingAfter}
                  />
                  {uploadingAfter && <p className="text-sm text-gray-500">上传中...</p>}
                  {formData.after_image_url && (
                    <img src={formData.after_image_url} alt="After" className="w-full h-48 object-cover rounded" />
                  )}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium mb-2" style={{color: '#1F2937'}}>
                  恢复时间（月）
                </label>
                <input
                  type="number"
                  value={formData.timeline_months}
                  onChange={(e) => setFormData({ ...formData, timeline_months: parseInt(e.target.value) })}
                  className="w-full px-4 py-2 border rounded-lg"
                  required
                  min="1"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2" style={{color: '#1F2937'}}>
                  显示顺序
                </label>
                <input
                  type="number"
                  value={formData.display_order}
                  onChange={(e) => setFormData({ ...formData, display_order: parseInt(e.target.value) })}
                  className="w-full px-4 py-2 border rounded-lg"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2" style={{color: '#1F2937'}}>
                  状态
                </label>
                <select
                  value={formData.is_active ? 'active' : 'inactive'}
                  onChange={(e) => setFormData({ ...formData, is_active: e.target.value === 'active' })}
                  className="w-full px-4 py-2 border rounded-lg"
                >
                  <option value="active">激活</option>
                  <option value="inactive">停用</option>
                </select>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="text-lg font-medium" style={{color: '#1F2937'}}>特征 1</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="标题（中文）"
                  value={formData.feature1_title_zh}
                  onChange={(e) => setFormData({ ...formData, feature1_title_zh: e.target.value })}
                  className="px-4 py-2 border rounded-lg"
                  required
                />
                <input
                  type="text"
                  placeholder="Title (English)"
                  value={formData.feature1_title_en}
                  onChange={(e) => setFormData({ ...formData, feature1_title_en: e.target.value })}
                  className="px-4 py-2 border rounded-lg"
                  required
                />
                <textarea
                  placeholder="描述（中文）"
                  value={formData.feature1_desc_zh}
                  onChange={(e) => setFormData({ ...formData, feature1_desc_zh: e.target.value })}
                  className="px-4 py-2 border rounded-lg"
                  rows={2}
                  required
                />
                <textarea
                  placeholder="Description (English)"
                  value={formData.feature1_desc_en}
                  onChange={(e) => setFormData({ ...formData, feature1_desc_en: e.target.value })}
                  className="px-4 py-2 border rounded-lg"
                  rows={2}
                  required
                />
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="text-lg font-medium" style={{color: '#1F2937'}}>特征 2</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="标题（中文）"
                  value={formData.feature2_title_zh}
                  onChange={(e) => setFormData({ ...formData, feature2_title_zh: e.target.value })}
                  className="px-4 py-2 border rounded-lg"
                  required
                />
                <input
                  type="text"
                  placeholder="Title (English)"
                  value={formData.feature2_title_en}
                  onChange={(e) => setFormData({ ...formData, feature2_title_en: e.target.value })}
                  className="px-4 py-2 border rounded-lg"
                  required
                />
                <textarea
                  placeholder="描述（中文）"
                  value={formData.feature2_desc_zh}
                  onChange={(e) => setFormData({ ...formData, feature2_desc_zh: e.target.value })}
                  className="px-4 py-2 border rounded-lg"
                  rows={2}
                  required
                />
                <textarea
                  placeholder="Description (English)"
                  value={formData.feature2_desc_en}
                  onChange={(e) => setFormData({ ...formData, feature2_desc_en: e.target.value })}
                  className="px-4 py-2 border rounded-lg"
                  rows={2}
                  required
                />
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="text-lg font-medium" style={{color: '#1F2937'}}>特征 3</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="标题（中文）"
                  value={formData.feature3_title_zh}
                  onChange={(e) => setFormData({ ...formData, feature3_title_zh: e.target.value })}
                  className="px-4 py-2 border rounded-lg"
                  required
                />
                <input
                  type="text"
                  placeholder="Title (English)"
                  value={formData.feature3_title_en}
                  onChange={(e) => setFormData({ ...formData, feature3_title_en: e.target.value })}
                  className="px-4 py-2 border rounded-lg"
                  required
                />
                <textarea
                  placeholder="描述（中文）"
                  value={formData.feature3_desc_zh}
                  onChange={(e) => setFormData({ ...formData, feature3_desc_zh: e.target.value })}
                  className="px-4 py-2 border rounded-lg"
                  rows={2}
                  required
                />
                <textarea
                  placeholder="Description (English)"
                  value={formData.feature3_desc_en}
                  onChange={(e) => setFormData({ ...formData, feature3_desc_en: e.target.value })}
                  className="px-4 py-2 border rounded-lg"
                  rows={2}
                  required
                />
              </div>
            </div>

            <div className="flex gap-4">
              <button
                type="submit"
                className="flex items-center gap-2 px-6 py-2 text-white rounded-lg hover:opacity-90 transition-opacity"
                style={{backgroundColor: '#9DB4C8'}}
              >
                <Save size={20} />
                保存
              </button>
              <button
                type="button"
                onClick={resetForm}
                className="px-6 py-2 border rounded-lg hover:bg-gray-50 transition-colors"
              >
                取消
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="grid gap-6">
        {cases.map((caseItem) => (
          <div
            key={caseItem.id}
            className="bg-white p-6 rounded-lg shadow-md"
          >
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-semibold" style={{color: '#1F2937'}}>
                  {caseItem.title_zh} / {caseItem.title_en}
                </h3>
                <p className="text-sm text-gray-500">
                  顺序: {caseItem.display_order} | 恢复时间: {caseItem.timeline_months}个月 |
                  状态: {caseItem.is_active ? '激活' : '停用'}
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleEdit(caseItem)}
                  className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                >
                  <Edit2 size={20} />
                </button>
                <button
                  onClick={() => handleDelete(caseItem.id)}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <Trash2 size={20} />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <p className="text-sm font-medium mb-2">术前</p>
                <img src={caseItem.before_image_url} alt="Before" className="w-full h-48 object-cover rounded" />
              </div>
              <div>
                <p className="text-sm font-medium mb-2">术后</p>
                <img src={caseItem.after_image_url} alt="After" className="w-full h-48 object-cover rounded" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div>
                <p className="font-medium">{caseItem.feature1_title_zh}</p>
                <p className="text-gray-600">{caseItem.feature1_desc_zh}</p>
              </div>
              <div>
                <p className="font-medium">{caseItem.feature2_title_zh}</p>
                <p className="text-gray-600">{caseItem.feature2_desc_zh}</p>
              </div>
              <div>
                <p className="font-medium">{caseItem.feature3_title_zh}</p>
                <p className="text-gray-600">{caseItem.feature3_desc_zh}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {cases.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          暂无案例，点击"添加案例"按钮创建第一个案例
        </div>
      )}
    </div>
  );
}
