import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { Check, Loader2 } from 'lucide-react';
import Footer from './Footer';
import { useLanguage } from '../contexts/LanguageContext';

interface Service {
  name: string;
  nameEn: string;
  price: number;
  selected: boolean;
}

interface BookingDetails {
  id: string;
  name: string;
  email: string;
  service_type: string;
  consultation_fee: number;
  selected_services: Service[];
}

declare global {
  interface Window {
    paypal: any;
  }
}

export default function PaymentPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const bookingId = searchParams.get('booking_id');
  const { t, language } = useLanguage();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [bookingDetails, setBookingDetails] = useState<BookingDetails | null>(null);
  const [paymentProcessing, setPaymentProcessing] = useState(false);
  const [paypalReady, setPaypalReady] = useState(false);
  const [availableServices, setAvailableServices] = useState<Service[]>([
    { name: t('paymentPage.lifetimeVip'), nameEn: 'Lifetime VIP Service', price: 200, selected: false },
    { name: t('paymentPage.injectionConsult'), nameEn: 'Injection Adjustment Consultation', price: 50, selected: false },
    { name: t('paymentPage.surgeryConsult'), nameEn: 'Surgical Consultation', price: 60, selected: false },
    { name: t('paymentPage.facialAnalysis'), nameEn: 'Basic Facial Analysis', price: 20, selected: false },
  ]);

  useEffect(() => {
    if (!bookingId) {
      navigate('/booking');
      return;
    }
    loadBookingDetails();
  }, [bookingId]);

  useEffect(() => {
    // 检查PayPal SDK是否加载
    if (window.paypal) {
      setPaypalReady(true);
      if (calculateTotal() > 0) {
        initializePayPalButtons();
      }
    } else {
      const checkPayPal = setInterval(() => {
        if (window.paypal) {
          setPaypalReady(true);
          if (calculateTotal() > 0) {
            initializePayPalButtons();
          }
          clearInterval(checkPayPal);
        }
      }, 100);
      return () => clearInterval(checkPayPal);
    }
  }, [availableServices]);

  const loadBookingDetails = async () => {
    try {
      const { data, error } = await supabase
        .from('bookings')
        .select('*')
        .eq('id', bookingId)
        .maybeSingle();

      if (error) throw error;
      if (!data) {
        setError(language === 'zh' ? '预约信息不存在' : 'Booking information does not exist');
        return;
      }

      setBookingDetails({
        id: data.id,
        name: data.name,
        email: data.email,
        service_type: data.service_type,
        consultation_fee: data.consultation_fee || 500,
        selected_services: data.selected_services || []
      });

      if (data.selected_services && data.selected_services.length > 0) {
        const updatedServices = availableServices.map(service => {
          const isSelected = data.selected_services.some(
            (s: Service) => s.name === service.name
          );
          return { ...service, selected: isSelected };
        });
        setAvailableServices(updatedServices);
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const toggleService = (index: number) => {
    const updated = [...availableServices];
    updated[index].selected = !updated[index].selected;
    setAvailableServices(updated);
  };

  const calculateTotal = () => {
    const servicesTotal = availableServices
      .filter(s => s.selected)
      .reduce((sum, s) => sum + s.price, 0);
    return servicesTotal;
  };

  const initializePayPalButtons = () => {
    const totalAmount = calculateTotal();
    
    if (totalAmount <= 0) return;

    // 清空之前的按钮
    const container = document.getElementById('paypal-button-container');
    if (container) {
      container.innerHTML = '';
    }

    window.paypal.Buttons({
      createOrder: async (data: any, actions: any) => {
        try {
          setPaymentProcessing(true);
          // 调用 Supabase Edge Function 创建订单
          const { data: responseData, error } = await supabase.functions.invoke('create-paypal-order', {
            body: {
              amount: totalAmount,
              currency: 'USD',
              bookingId: bookingId,
              services: availableServices.filter(s => s.selected),
            },
          });

          if (error) {
            throw new Error(error.message || 'Failed to create PayPal order');
          }

          return responseData.id;
        } catch (err: any) {
          setError(err.message);
          setPaymentProcessing(false);
          throw err;
        }
      },
      onApprove: async (data: any, actions: any) => {
        try {
          // 调用 Supabase Edge Function 捕获订单
          const { data: captureData, error } = await supabase.functions.invoke('capture-paypal-order', {
            body: {
              orderId: data.orderID,
              bookingId: bookingId,
              services: availableServices.filter(s => s.selected),
              amount: totalAmount,
            },
          });

          if (error) {
            throw new Error(error.message || 'Payment capture failed');
          }

          if (captureData.success) {
            // 发送确认邮件
            try {
              await supabase.functions.invoke('send-booking-confirmation', {
                body: {
                  bookingId: bookingId,
                  email: bookingDetails?.email,
                  name: bookingDetails?.name
                }
              });
            } catch (emailError) {
              console.error('Email notification failed:', emailError);
            }

            navigate(`/booking/success?booking_id=${bookingId}`);
          }
        } catch (err: any) {
          setError(err.message || 'Payment failed');
          setPaymentProcessing(false);
        }
      },
      onError: (err: any) => {
        setError('Payment failed. Please try again.');
        setPaymentProcessing(false);
        console.error('PayPal error:', err);
      },
    }).render('#paypal-button-container');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-lg" style={{ color: '#6B7280' }}>{t('paymentPage.loading')}</div>
      </div>
    );
  }

  if (error && !bookingDetails) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={() => navigate('/booking')}
            className="px-6 py-2 text-white transition"
            style={{ backgroundColor: '#1C2B3A' }}
          >
            {t('paymentPage.backToBooking')}
          </button>
        </div>
      </div>
    );
  }

  const isMobile = window.innerWidth < 768;
  const totalAmount = calculateTotal();

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#F9FAFB' }}>
      <div className={`${isMobile ? 'px-4 py-8' : 'max-w-2xl mx-auto px-12 py-16'}`}>
        <h1 className={`${isMobile ? 'text-2xl' : 'text-3xl'} font-light text-center mb-12 tracking-wide`} style={{ color: '#1F1F1F' }}>
          {t('paymentPage.title')}
        </h1>

        <div className="space-y-3 mb-12">
          {availableServices.map((service, index) => (
            <label
              key={index}
              className="bg-white border p-5 flex items-center justify-between cursor-pointer hover:shadow-md transition-all"
              style={{ borderColor: service.selected ? '#1C2B3A' : '#E5E7EB' }}
            >
              <div className="flex items-center gap-4">
                <input
                  type="checkbox"
                  checked={service.selected}
                  onChange={() => toggleService(index)}
                  className="w-5 h-5 accent-gray-900"
                />
                <div>
                  <div className="text-sm font-normal tracking-wide" style={{ color: '#1F1F1F' }}>
                    {language === 'zh' ? service.name : service.nameEn}
                  </div>
                </div>
              </div>
              <span className="text-lg font-light" style={{ color: '#1F1F1F' }}>
                ${service.price}
              </span>
            </label>
          ))}
        </div>

        {totalAmount > 0 && (
          <div className="bg-white border p-6 mb-8" style={{ borderColor: '#E5E7EB' }}>
            <div className="flex justify-between items-center">
              <span className="text-lg font-normal tracking-wide" style={{ color: '#1F1F1F' }}>{t('paymentPage.total')}</span>
              <span className="text-2xl font-light" style={{ color: '#1F1F1F' }}>${totalAmount}</span>
            </div>
          </div>
        )}

        {totalAmount > 0 && (
          <div className="mb-8">
            <h2 className="text-lg font-normal mb-4 tracking-wide" style={{ color: '#1F1F1F' }}>
              {t('paymentPage.paymentMethod')}
            </h2>
            
            {paymentProcessing && (
              <div className="flex items-center justify-center gap-2 p-4 bg-blue-50 border border-blue-200 rounded mb-4">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span className="text-sm" style={{ color: '#1F1F1F' }}>Processing payment...</span>
              </div>
            )}

            {!paypalReady && (
              <div className="flex items-center justify-center gap-2 p-4 bg-yellow-50 border border-yellow-200 rounded mb-4">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span className="text-sm" style={{ color: '#1F1F1F' }}>Loading PayPal...</span>
              </div>
            )}

            {paypalReady && (
              <div id="paypal-button-container" className="mb-4"></div>
            )}
          </div>
        )}

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-600 text-sm">
            {error}
          </div>
        )}

        <div className="text-center pt-8">
          <button
            onClick={() => navigate('/')}
            className="text-xl font-light tracking-widest transition"
            style={{ color: '#1F1F1F' }}
          >
            YANORA
          </button>
        </div>
      </div>
      <Footer />
    </div>
  );
}
