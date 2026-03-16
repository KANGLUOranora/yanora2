import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useState, useEffect } from 'react';
import CTASection from './CTASection';
import Footer from './Footer';
import Navbar from './Navbar';
import WhyYanoraSection from './WhyYanoraSection';
import { supabase } from '../lib/supabase';
import { useLanguage } from '../contexts/LanguageContext';

interface DetailedCase {
  id: string;
  title: string;
  title_en: string;
  description: string;
  description_en: string;
  before_image_url: string;
  after_image_url: string;
  category: string;
  display_order: number;
}

function BodySculptingPage() {
  const navigate = useNavigate();
  const { t, language } = useLanguage();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [activeService, setActiveService] = useState<'waist' | 'breast' | 'liposuction' | 'abdomen' | 'buttocks'>('waist');
  const [detailedCases, setDetailedCases] = useState<DetailedCase[]>([]);
  const [loading, setLoading] = useState(true);

  const images = [
    '/Gemini_Generated_Image_94iwds94iwds94iw.png',
    '/Gemini_Generated_Image_iubeodiubeodiube.png',
    '/Gemini_Generated_Image_u1lac1u1lac1u1la.png'
  ];

  const services = [
    { key: 'waist' as const, title: t('bodySculpting.services.waist.title'), subtitle: t('bodySculpting.services.waist.desc') },
    { key: 'breast' as const, title: t('bodySculpting.services.breast.title'), subtitle: t('bodySculpting.services.breast.desc') },
    { key: 'liposuction' as const, title: t('bodySculpting.services.liposuction.title'), subtitle: t('bodySculpting.services.liposuction.desc') },
    { key: 'abdomen' as const, title: t('bodySculpting.services.abdomen.title'), subtitle: t('bodySculpting.services.abdomen.desc') },
    { key: 'buttocks' as const, title: t('bodySculpting.services.buttocks.title'), subtitle: t('bodySculpting.services.buttocks.desc') },
  ];

  const getServiceDetails = (serviceKey: typeof activeService) => {
    return {
      title: t(`bodySculpting.details.${serviceKey}.title`),
      description: t(`bodySculpting.details.${serviceKey}.desc`),
      techniques: t(`bodySculpting.details.${serviceKey}.techniques`) as string[],
      images: serviceKey === 'waist' ? [
        '/Angle Waist/2a6b439daae1e27416b467611fc7e188.jpg',
        '/Angle Waist/72f183535a14195c0e2e2e283017fd0a.jpg',
        '/Angle Waist/8764420f754e09bc51c6b8e447a03f38.jpg',
        '/Angle Waist/a992010cb07d5f0d9e8e9a4ebe8c4bf5.jpg'
      ] : serviceKey === 'breast' ? [
        '/breast/1.jpg',
        '/breast/2.jpg',
        '/breast/3.jpg',
        '/breast/4.jpg'
      ] : serviceKey === 'liposuction' ? [
        '/liposuctiom/1.jpg',
        '/liposuctiom/2.jpg',
        '/liposuctiom/3.jpg',
        '/liposuctiom/4.jpg'
      ] : serviceKey === 'abdomen' ? [
        '/Abdominoplasty/1.jpg',
        '/Abdominoplasty/2.jpg',
        '/Abdominoplasty/3.jpg',
        '/Abdominoplasty/4.jpg'
      ] : [
        '/bbl/1.jpg',
        '/bbl/2.jpg',
        '/bbl/3.jpg',
        '/bbl/4.jpg'
      ]
    };
  };

  // Fetch detailed cases from database
  useEffect(() => {
    const fetchDetailedCases = async () => {
      try {
        const { data, error } = await supabase
          .from('detailed_cases')
          .select('*')
          .eq('show_in_body', true)
          .eq('is_published', true)
          .order('display_order', { ascending: true });

        if (error) throw error;
        setDetailedCases(data || []);
      } catch (error) {
        console.error('Error fetching detailed cases:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDetailedCases();
  }, []);

  return (
    <div className="min-h-screen bg-white relative">
      {/* Mobile Watermark */}
      <div className="md:hidden fixed bottom-6 right-6 z-10 pointer-events-none">
        <span className="text-6xl font-light tracking-wider opacity-20" style={{color: '#1F1F1F'}}>
          YANORA
        </span>
      </div>

      <Navbar />

      <section className="py-16 md:py-24 px-6 md:px-12 bg-gradient-to-b from-white to-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-3xl md:text-4xl font-light mb-6 tracking-wide" style={{color: '#1F1F1F'}}>
              {t('bodySculpting.hero.title')}
            </h1>
            <p className="text-base md:text-lg mb-8 leading-relaxed" style={{color: '#6B7280'}}>
              {t('bodySculpting.hero.subtitle')}
            </p>
            <button
              onClick={() => navigate('/booking')}
              className="px-10 py-3 text-white text-sm transition tracking-wider"
              style={{backgroundColor: '#1C2B3A'}}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#101D29'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#1C2B3A'}
            >
              {t('bodySculpting.hero.cta')}
            </button>
          </div>

          <div className="hidden md:flex items-end justify-center gap-0 mb-16">
            <img
              src="/Gemini_Generated_Image_94iwds94iwds94iw.png"
              alt={`${t('bodySculpting.hero.title')} 1`}
              className="h-[500px] object-contain"
              style={{
                filter: 'brightness(1.1) contrast(1.05)',
                mixBlendMode: 'darken'
              }}
            />
            <img
              src="/Gemini_Generated_Image_iubeodiubeodiube.png"
              alt={`${t('bodySculpting.hero.title')} 2`}
              className="h-[500px] object-contain"
              style={{
                filter: 'brightness(1.1) contrast(1.05)',
                mixBlendMode: 'darken'
              }}
            />
            <img
              src="/Gemini_Generated_Image_u1lac1u1lac1u1la.png"
              alt={`${t('bodySculpting.hero.title')} 3`}
              className="h-[500px] object-contain"
              style={{
                filter: 'brightness(1.1) contrast(1.05)',
                mixBlendMode: 'darken'
              }}
            />
          </div>

          <div className="md:hidden mb-12">
            <div className="relative overflow-hidden">
              <div
                className="flex transition-transform duration-300 ease-out"
                style={{ transform: `translateX(-${currentSlide * 100}%)` }}
                onTouchStart={(e) => {
                  const touch = e.touches[0];
                  const startX = touch.clientX;

                  const handleTouchMove = (moveEvent: TouchEvent) => {
                    const currentX = moveEvent.touches[0].clientX;
                    const diff = startX - currentX;

                    if (Math.abs(diff) > 50) {
                      if (diff > 0 && currentSlide < images.length - 1) {
                        setCurrentSlide(currentSlide + 1);
                      } else if (diff < 0 && currentSlide > 0) {
                        setCurrentSlide(currentSlide - 1);
                      }
                      document.removeEventListener('touchmove', handleTouchMove);
                    }
                  };

                  document.addEventListener('touchmove', handleTouchMove);
                  document.addEventListener('touchend', () => {
                    document.removeEventListener('touchmove', handleTouchMove);
                  }, { once: true });
                }}
              >
                {images.map((src, index) => (
                  <div key={index} className="w-full flex-shrink-0 flex justify-center items-center px-4">
                    <img
                      src={src}
                      alt={`${t('bodySculpting.hero.title')} ${index + 1}`}
                      className="w-full max-w-md object-contain"
                      style={{
                        filter: 'brightness(1.1) contrast(1.05)',
                        mixBlendMode: 'darken',
                        height: 'auto'
                      }}
                    />
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-center gap-2 mt-6">
              {images.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className="w-2 h-2 rounded-full transition-all duration-300"
                  style={{
                    backgroundColor: currentSlide === index ? '#1F1F1F' : '#D1D5DB'
                  }}
                  aria-label={`${t('bodySculpting.hero.title')} ${index + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 md:py-28 px-6 md:px-12 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="mb-16 text-center">
            <h2 className="text-2xl md:text-3xl font-light mb-4 tracking-wide" style={{color: '#1F1F1F'}}>
              {t('bodySculpting.services.title')}
            </h2>
            <p className="text-sm md:text-base font-light" style={{color: '#6B7280'}}>
              {t('bodySculpting.services.subtitle')}
            </p>
          </div>

          {/* Service Cards */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-6 mb-16">
            {services.map((service) => (
              <button
                key={service.key}
                onClick={() => setActiveService(service.key)}
                className="p-6 md:p-8 border transition-all duration-300 text-center"
                style={{
                  backgroundColor: activeService === service.key ? '#1C2B3A' : 'white',
                  borderColor: activeService === service.key ? '#1C2B3A' : '#E5E7EB',
                  color: activeService === service.key ? 'white' : '#1F1F1F'
                }}
                onMouseEnter={(e) => {
                  if (activeService !== service.key) {
                    e.currentTarget.style.borderColor = '#1C2B3A';
                    e.currentTarget.style.transform = 'translateY(-4px)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (activeService !== service.key) {
                    e.currentTarget.style.borderColor = '#E5E7EB';
                    e.currentTarget.style.transform = 'translateY(0)';
                  }
                }}
              >
                <h3 className="text-base md:text-lg font-normal mb-2">
                  {service.title}
                </h3>
                <p className="text-xs md:text-sm font-light opacity-80">
                  {service.subtitle}
                </p>
              </button>
            ))}
          </div>

          <div className="bg-gray-50 p-8 md:p-12 border" style={{borderColor: '#E5E7EB'}}>
            <div className="max-w-4xl mx-auto">
              <h3 className="text-xl md:text-2xl font-light mb-4" style={{color: '#1F1F1F'}}>
                {getServiceDetails(activeService).title}
              </h3>
              <p className="text-sm md:text-base mb-8 leading-relaxed" style={{color: '#6B7280'}}>
                {getServiceDetails(activeService).description}
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {getServiceDetails(activeService).techniques.map((technique, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-3 p-4 bg-white border"
                    style={{borderColor: '#E5E7EB'}}
                  >
                    <span className="mt-1 text-sm" style={{color: '#1C2B3A'}}>●</span>
                    <span className="text-sm md:text-base" style={{color: '#4B5563'}}>{technique}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="bg-white p-8 md:p-12 border mt-8" style={{borderColor: '#E5E7EB'}}>
            <div className="max-w-6xl mx-auto">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {getServiceDetails(activeService).images.map((image, index) => (
                  <div
                    key={index}
                    className="bg-gray-50 border overflow-hidden"
                    style={{borderColor: '#E5E7EB'}}
                  >
                    <img
                      src={image}
                      alt={`${getServiceDetails(activeService).title} ${index + 1}`}
                      className="w-full h-48 object-cover transition-transform duration-300 hover:scale-105"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 md:py-28 px-6 md:px-12 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="mb-16 text-center">
            <h2 className="text-2xl md:text-3xl font-light mb-4 tracking-wide" style={{color: '#1F1F1F'}}>
              {t('bodySculpting.cases.title')}
            </h2>
            <p className="text-sm md:text-base font-light" style={{color: '#6B7280'}}>
              {t('bodySculpting.cases.subtitle')}
            </p>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <p className="text-base" style={{color: '#6B7280'}}>{t('bodySculpting.cases.loading')}</p>
            </div>
          ) : detailedCases.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-base" style={{color: '#6B7280'}}>{t('bodySculpting.cases.empty')}</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
              {detailedCases.map((caseStudy) => (
                <div key={caseStudy.id} className="bg-white shadow-lg overflow-hidden">
                  <div className="grid grid-cols-2 gap-0">
                    <div className="relative aspect-[3/4]">
                      <img
                        src={caseStudy.before_image_url}
                        alt={`${language === 'zh' ? caseStudy.title : caseStudy.title_en} - ${t('bodySculpting.cases.before')}`}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-60 text-white text-center py-2 text-sm md:text-base font-light">
                        {t('bodySculpting.cases.before')}
                      </div>
                    </div>
                    <div className="relative aspect-[3/4]">
                      <img
                        src={caseStudy.after_image_url}
                        alt={`${language === 'zh' ? caseStudy.title : caseStudy.title_en} - ${t('bodySculpting.cases.after')}`}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-60 text-white text-center py-2 text-sm md:text-base font-light">
                        {t('bodySculpting.cases.after')}
                      </div>
                    </div>
                  </div>
                  <div className="p-4 md:p-6 lg:p-8">
                    <h3 className="text-base md:text-lg lg:text-xl font-light mb-2 md:mb-3" style={{color: '#1F1F1F'}}>
                      {language === 'zh' ? caseStudy.title : caseStudy.title_en}
                    </h3>
                    <p className="text-xs md:text-sm lg:text-base leading-relaxed" style={{color: '#6B7280'}}>
                      {language === 'zh' ? caseStudy.description : caseStudy.description_en}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      <WhyYanoraSection />

      <CTASection />

      <Footer />
    </div>
  );
}

export default BodySculptingPage;
