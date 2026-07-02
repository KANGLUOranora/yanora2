import { useEffect, useMemo, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import BookingDesktop from './booking/BookingDesktop';
import BookingMobile from './booking/BookingMobile';
import { useLanguage } from '../contexts/LanguageContext';

export interface BookingFormData {
  name: string;
  firstName?: string;
  lastName?: string;
  email: string;
  phone: string;
  preferred_date: string;
  service_type: string;
  message: string;
}

export type BookingStep = 'form' | 'payment' | 'success';
export type BookingFlowStep = 'photos' | 'details';

export interface BookingServiceOption {
  id: string;
  name: string;
  nameEn: string;
  description: string;
  descriptionEn: string;
  price: number;
  selected: boolean;
  recommended?: boolean;
}

function BookingPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { language } = useLanguage();
  const incomingFacePhotos = ((location.state as { facePhotos?: File[] } | null)?.facePhotos || []).slice(0, 3);
  const [step, setStep] = useState<BookingStep>('form');
  const [bookingId, setBookingId] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [flowStep, setFlowStep] = useState<BookingFlowStep>('photos');
  const [facePhotos, setFacePhotos] = useState<File[]>(incomingFacePhotos);
  const [facePhotoPreviews, setFacePhotoPreviews] = useState<string[]>(() =>
    incomingFacePhotos.map((file) => URL.createObjectURL(file))
  );
  const facePhotoPreviewsRef = useRef(facePhotoPreviews);
  const [serviceOptions, setServiceOptions] = useState<BookingServiceOption[]>([
    {
      id: 'facial-analysis',
      name: '基础面部分析',
      nameEn: 'Basic Facial Analysis',
      description: '先判断面部比例、支撑和轮廓转折，再进入预约沟通。',
      descriptionEn: 'Read proportion, support, and contour transitions before the consultation.',
      price: 20,
      selected: true,
      recommended: true
    },
    {
      id: 'injection-consult',
      name: '注射调整咨询',
      nameEn: 'Injection Adjustment Consultation',
      description: '适合判断填充、轮廓固定或年轻化优先级。',
      descriptionEn: 'For filler, contour support, and rejuvenation priority planning.',
      price: 50,
      selected: false
    },
    {
      id: 'surgery-consult',
      name: '手术方案咨询',
      nameEn: 'Surgical Consultation',
      description: '适合判断鼻部、轮廓、提升等手术方向。',
      descriptionEn: 'For rhinoplasty, contouring, lifting, and surgical direction planning.',
      price: 60,
      selected: false
    },
    {
      id: 'lifetime-vip',
      name: '终身 VIP 服务',
      nameEn: 'Lifetime VIP Service',
      description: '长期面部管理与医生匹配建议。',
      descriptionEn: 'Long-term face management and doctor matching.',
      price: 200,
      selected: false
    }
  ]);
  const [formData, setFormData] = useState<BookingFormData>({
    name: '',
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    preferred_date: '',
    service_type: '面部轮廓',
    message: ''
  });

  const selectedServices = useMemo(
    () => serviceOptions.filter((service) => service.selected),
    [serviceOptions]
  );

  const totalAmount = useMemo(
    () => selectedServices.reduce((sum, service) => sum + service.price, 0),
    [selectedServices]
  );

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const nextFiles = Array.from(e.target.files || []);
    const nextPreviews = nextFiles.map((file) => URL.createObjectURL(file));

    setFacePhotos((current) => {
      const merged = [...current, ...nextFiles];
      return merged.slice(0, 3);
    });
    setFacePhotoPreviews((current) => {
      const merged = [...current, ...nextPreviews].slice(0, 3);
      nextPreviews.slice(Math.max(0, 3 - current.length)).forEach((previewUrl) => URL.revokeObjectURL(previewUrl));
      return merged;
    });
    e.target.value = '';
  };

  useEffect(() => {
    facePhotoPreviewsRef.current = facePhotoPreviews;
  }, [facePhotoPreviews]);

  useEffect(() => {
    return () => {
      facePhotoPreviewsRef.current.forEach((previewUrl) => URL.revokeObjectURL(previewUrl));
    };
  }, []);

  const handleContinueToDetails = () => {
    if (facePhotos.length < 3) {
      setError(language === 'zh' ? '请先上传正面、左 45°、右 45° 三张面部照片。' : 'Please upload front, left 45°, and right 45° face photos first.');
      return;
    }

    setError('');
    setFlowStep('details');
  };

  const handleBackToPhotos = () => {
    setError('');
    setFlowStep('photos');
  };

  const toggleService = (id: string) => {
    setServiceOptions((current) =>
      current.map((service) =>
        service.id === id ? { ...service, selected: !service.selected } : service
      )
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (facePhotos.length < 3) {
      setFlowStep('photos');
      setError(language === 'zh' ? '请先完成 STEP 01，上传三张面部照片。' : 'Please complete STEP 01 by uploading three face photos first.');
      return;
    }

    setLoading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      const newBookingId = crypto.randomUUID();
      const plannedPhotoPaths = facePhotos.map((file, index) => {
        const extension = file.name.split('.').pop() || 'jpg';
        return `${newBookingId}/${index + 1}-${Date.now()}.${extension}`;
      });

      const fullName = formData.firstName && formData.lastName
        ? `${formData.lastName}${formData.firstName}`
        : formData.name;

      const bookingData = {
        id: newBookingId,
        name: fullName,
        email: formData.email,
        phone: formData.phone,
        preferred_date: formData.preferred_date || null,
        preferred_time: null,
        service_type: formData.service_type,
        message: formData.message,
        user_id: user?.id || null,
        status: 'pending',
        payment_status: 'pending',
        consultation_fee: totalAmount,
        total_amount: totalAmount,
        face_photo_urls: plannedPhotoPaths,
        selected_services: selectedServices.map((service) => ({
          id: service.id,
          name: language === 'zh' ? service.name : service.nameEn,
          nameEn: service.nameEn,
          price: service.price
        }))
      };

      const { data, error: insertError } = await supabase
        .from('bookings')
        .insert([bookingData])
        .select()
        .single();

      if (insertError) throw insertError;

      if (data) {
        await Promise.all(
          facePhotos.map(async (file, index) => {
            const { error: uploadError } = await supabase.storage
              .from('booking-face-photos')
              .upload(plannedPhotoPaths[index], file, { upsert: true });

            if (uploadError) throw uploadError;
          })
        );

        navigate(`/payment?booking_id=${data.id}`);
      } else {
        throw new Error('预订创建成功，但无法获取预订ID');
      }
    } catch (err: any) {
      setError(err.message || '提交失败，请重试');
    } finally {
      setLoading(false);
    }
  };

  const handlePayment = async (method: string) => {
    setLoading(true);
    setError('');

    try {
      const { data: { user } } = await supabase.auth.getUser();

      const paymentData = {
        booking_id: bookingId,
        user_id: user?.id || null,
        amount: 500,
        currency: 'CNY',
        payment_method: method,
        status: 'completed'
      };

      const { error: paymentError } = await supabase
        .from('payments')
        .insert([paymentData]);

      if (paymentError) throw paymentError;

      const { error: updateError } = await supabase
        .from('bookings')
        .update({
          payment_status: 'paid',
          payment_method: method,
          payment_completed_at: new Date().toISOString()
        })
        .eq('id', bookingId);

      if (updateError) throw updateError;

      setStep('success');
    } catch (err: any) {
      setError(err.message || '支付失败，请重试');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const commonProps = {
    step,
    formData,
    loading,
    error,
    flowStep,
    handleSubmit,
    handleChange,
    handlePayment,
    navigate,
    facePhotos,
    facePhotoPreviews,
    handlePhotoChange,
    handleContinueToDetails,
    handleBackToPhotos,
    serviceOptions,
    toggleService,
    totalAmount
  };

  return (
    <>
      <div className="hidden md:block">
        <BookingDesktop {...commonProps} />
      </div>
      <div className="md:hidden">
        <BookingMobile {...commonProps} />
      </div>
    </>
  );
}

export default BookingPage;
