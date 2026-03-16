import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ChevronLeft, ChevronRight } from 'lucide-react';
import { useState } from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import ImageCompareSlider from './ImageCompareSlider';
import CTASection from './CTASection';
import ServiceCasesSection from './ServiceCasesSection';
import WhyYanoraSection from './WhyYanoraSection';
import { useLanguage } from '../contexts/LanguageContext';

function FacialContourPage() {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [activeFeature, setActiveFeature] = useState<'nose' | 'eyes' | 'lips'>('nose');

  const noseTypes = [
    { id: 1, image: '/nose/00afd0b54910a9b6108263ef92983555.jpg' },
    { id: 2, image: '/nose/075396851531cb3d8f8820559f7c29e8.jpg' },
    { id: 3, image: '/nose/2ac0b0e6dad8f9b7fe78a012030f3c42.jpg' },
    { id: 4, image: '/nose/9283f8549223b7615dc96b4db3382b81.jpg' },
    { id: 5, image: '/nose/da8fd3dd4d7755ac81e6f918a3c57f6d.jpg' },
  ];

  const eyeTypes = [
    { id: 1, image: '/e10862d0ad29bb40d6ffda2f5782db49.jpg' },
    { id: 2, image: '/e7e3dea04d581a82271b810ab7b33eab.jpg' },
    { id: 3, image: '/5ceb11519ac27ce1cd3ec0b5b6612e9d.jpg' },
  ];

  const lipTypes = [
    { id: 1, image: '/mouth_features/Gemini_Generated_Image_wo4l20wo4l20wo4l_(1).png' },
    { id: 2, image: '/mouth_features/Gemini_Generated_Image_b6lk02b6lk02b6lk.png' },
  ];

  const getCurrentTypes = () => {
    switch (activeFeature) {
      case 'nose': return noseTypes;
      case 'eyes': return eyeTypes;
      case 'lips': return lipTypes;
      default: return noseTypes;
    }
  };

  const cases = [
    {
      id: 1,
      parts: t('facialContour.cases[0].parts'),
      description: t('facialContour.cases[0].desc'),
      before: '🖼️',
      after: '🖼️'
    },
    {
      id: 2,
      parts: t('facialContour.cases[1].parts'),
      description: t('facialContour.cases[1].desc'),
      before: '🖼️',
      after: '🖼️'
    },
    {
      id: 3,
      parts: t('facialContour.cases[2].parts'),
      description: t('facialContour.cases[2].desc'),
      before: '🖼️',
      after: '🖼️'
    },
  ];

  return (
    <div className="min-h-screen bg-white relative">
      {/* Mobile Watermark */}
      <div className="md:hidden fixed bottom-6 right-6 z-10 pointer-events-none">
        <span className="text-6xl font-light tracking-wider opacity-20" style={{color: '#1F1F1F'}}>
          YANORA
        </span>
      </div>

      <Navbar />
      {/* Hero Section - Core Value Statement */}
      <section className="py-16 md:py-20 px-6 md:px-12 bg-white md:bg-[#FAFAFA]">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-3xl md:text-5xl font-light mb-6 leading-relaxed tracking-wide" style={{color: '#1F1F1F'}}>
            {t('facialContour.hero.title')}
          </h1>
          <p className="text-sm md:text-base font-light leading-relaxed mb-8 max-w-2xl mx-auto whitespace-pre-line" style={{color: '#4B5563'}}>
            {t('facialContour.hero.subtitle')}
          </p>
          <button
            onClick={() => navigate('/booking')}
            className="px-8 py-3 text-sm md:text-base font-light tracking-wide transition-all duration-300 hover:opacity-80"
            style={{
              backgroundColor: '#1C2B3A',
              color: '#FFFFFF'
            }}
          >
            {t('facialContour.hero.cta')}
          </button>
        </div>
      </section>

      {/* Facial Contour Section - Bone & Soft Tissue */}
      <section id="facial-contour-section" className="py-8 md:py-12 px-6 md:px-12 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="mb-16 text-center">
            <div className="flex justify-center mb-16">
              <div className="w-full md:w-3/4 lg:w-3/5 relative bg-white p-8">
                <img
                  src="/Gemini_Generated_Image_qvpx6jqvpx6jqvpx.png"
                  alt="面部轮廓示例"
                  className="w-full h-auto object-contain"
                  style={{
                    filter: 'brightness(1.1)',
                    mixBlendMode: 'multiply'
                  }}
                />

                {/* {t('facialContour.anatomy.forehead')}标注 - 左侧 */}
                <div className="absolute" style={{top: '18%', left: '10%'}}>
                  <div className="relative">
                    {/* 点 - 桌面端显示 */}
                    <div className="hidden md:block absolute w-2.5 h-2.5 bg-white border-2 rounded-full" style={{borderColor: '#1C2B3A', left: '-5px', top: '-5px'}}></div>
                    {/* 线条 - 桌面端显示 */}
                    <div className="hidden md:block absolute w-20 h-0.5" style={{backgroundColor: '#1C2B3A', top: '-1px', right: '0'}}></div>
                    {/* 浮动文字框 - 桌面端 */}
                    <div
                      className="hidden md:block absolute px-4 py-2 bg-white border shadow-lg"
                      style={{
                        borderColor: '#1C2B3A',
                        right: '84px',
                        top: '-16px',
                        minWidth: '80px',
                        animation: 'floatUpDown 3s ease-in-out infinite'
                      }}
                    >
                      <p className="text-sm font-light whitespace-nowrap" style={{color: '#1F1F1F'}}>{t('facialContour.anatomy.forehead')}</p>
                    </div>
                    {/* 移动端标签 */}
                    <div
                      className="md:hidden px-2 py-1 bg-white border shadow-lg"
                      style={{
                        borderColor: '#1C2B3A',
                        transform: 'translate(-100%, -50%)',
                        animation: 'floatUpDown 3s ease-in-out infinite'
                      }}
                    >
                      <p className="text-xs font-light whitespace-nowrap" style={{color: '#1F1F1F'}}>{t('facialContour.anatomy.forehead')}</p>
                    </div>
                  </div>
                </div>

                {/* {t('facialContour.anatomy.cheekbone')}标注 - 右侧 */}
                <div className="absolute" style={{top: '31%', right: '8%'}}>
                  <div className="relative">
                    {/* 点 - 桌面端显示 */}
                    <div className="hidden md:block absolute w-2.5 h-2.5 bg-white border-2 rounded-full" style={{borderColor: '#1C2B3A', right: '-5px', top: '-5px'}}></div>
                    {/* 线条 - 桌面端显示 */}
                    <div className="hidden md:block absolute w-20 h-0.5" style={{backgroundColor: '#1C2B3A', top: '-1px', left: '0'}}></div>
                    {/* 浮动文字框 - 桌面端 */}
                    <div
                      className="hidden md:block absolute px-4 py-2 bg-white border shadow-lg"
                      style={{
                        borderColor: '#1C2B3A',
                        left: '84px',
                        top: '-16px',
                        minWidth: '80px',
                        animation: 'floatUpDown 3s ease-in-out infinite 0.5s'
                      }}
                    >
                      <p className="text-sm font-light whitespace-nowrap" style={{color: '#1F1F1F'}}>{t('facialContour.anatomy.cheekbone')}</p>
                    </div>
                    {/* 移动端标签 */}
                    <div
                      className="md:hidden px-2 py-1 bg-white border shadow-lg"
                      style={{
                        borderColor: '#1C2B3A',
                        transform: 'translate(0%, -50%)',
                        animation: 'floatUpDown 3s ease-in-out infinite 0.5s'
                      }}
                    >
                      <p className="text-xs font-light whitespace-nowrap" style={{color: '#1F1F1F'}}>{t('facialContour.anatomy.cheekbone')}</p>
                    </div>
                  </div>
                </div>

                {/* {t('facialContour.anatomy.chin')}标注 - 左侧 */}
                <div className="absolute" style={{top: '56%', left: '9%'}}>
                  <div className="relative">
                    {/* 点 - 桌面端显示 */}
                    <div className="hidden md:block absolute w-2.5 h-2.5 bg-white border-2 rounded-full" style={{borderColor: '#1C2B3A', left: '-5px', top: '-5px'}}></div>
                    {/* 线条 - 桌面端显示 */}
                    <div className="hidden md:block absolute w-20 h-0.5" style={{backgroundColor: '#1C2B3A', top: '-1px', right: '0'}}></div>
                    {/* 浮动文字框 - 桌面端 */}
                    <div
                      className="hidden md:block absolute px-4 py-2 bg-white border shadow-lg"
                      style={{
                        borderColor: '#1C2B3A',
                        right: '84px',
                        top: '-16px',
                        minWidth: '90px',
                        animation: 'floatUpDown 3s ease-in-out infinite 1s'
                      }}
                    >
                      <p className="text-sm font-light whitespace-nowrap" style={{color: '#1F1F1F'}}>{t('facialContour.anatomy.chin')}</p>
                    </div>
                    {/* 移动端标签 */}
                    <div
                      className="md:hidden px-2 py-1 bg-white border shadow-lg"
                      style={{
                        borderColor: '#1C2B3A',
                        transform: 'translate(-100%, -50%)',
                        animation: 'floatUpDown 3s ease-in-out infinite 1s'
                      }}
                    >
                      <p className="text-xs font-light whitespace-nowrap" style={{color: '#1F1F1F'}}>{t('facialContour.anatomy.chin')}</p>
                    </div>
                  </div>
                </div>

                {/* {t('facialContour.anatomy.jawline')}标注 - 右侧 */}
                <div className="absolute" style={{top: '50%', right: '8%'}}>
                  <div className="relative">
                    {/* 点 - 桌面端显示 */}
                    <div className="hidden md:block absolute w-2.5 h-2.5 bg-white border-2 rounded-full" style={{borderColor: '#1C2B3A', right: '-5px', top: '-5px'}}></div>
                    {/* 线条 - 桌面端显示 */}
                    <div className="hidden md:block absolute w-20 h-0.5" style={{backgroundColor: '#1C2B3A', top: '-1px', left: '0'}}></div>
                    {/* 浮动文字框 - 桌面端 */}
                    <div
                      className="hidden md:block absolute px-4 py-2 bg-white border shadow-lg"
                      style={{
                        borderColor: '#1C2B3A',
                        left: '84px',
                        top: '-16px',
                        minWidth: '80px',
                        animation: 'floatUpDown 3s ease-in-out infinite 1.5s'
                      }}
                    >
                      <p className="text-sm font-light whitespace-nowrap" style={{color: '#1F1F1F'}}>{t('facialContour.anatomy.jawline')}</p>
                    </div>
                    {/* 移动端标签 */}
                    <div
                      className="md:hidden px-2 py-1 bg-white border shadow-lg"
                      style={{
                        borderColor: '#1C2B3A',
                        transform: 'translate(0%, -50%)',
                        animation: 'floatUpDown 3s ease-in-out infinite 1.5s'
                      }}
                    >
                      <p className="text-xs font-light whitespace-nowrap" style={{color: '#1F1F1F'}}>{t('facialContour.anatomy.jawline')}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
            {[
              { icon: '□', title: t('facialContour.services.forehead.title'), subtitle: t('facialContour.services.forehead.desc'), image: '/face courtus/forehead.jpg' },
              { icon: '□', title: t('facialContour.services.cheekbone.title'), subtitle: t('facialContour.services.cheekbone.desc'), image: '/face courtus/cheekbone.jpg' },
              { icon: '□', title: t('facialContour.services.jawline.title'), subtitle: t('facialContour.services.jawline.desc'), image: '/face courtus/jawline.jpg' },
              { icon: '□', title: t('facialContour.services.chin.title'), subtitle: t('facialContour.services.chin.desc'), image: '/face courtus/chin.jpg' },
            ].map((item, index) => (
              <div
                key={index}
                className="border transition-all duration-300 overflow-hidden"
                style={{borderColor: '#E5E7EB'}}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = '#1C2B3A';
                  e.currentTarget.style.transform = 'translateY(-4px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = '#E5E7EB';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                {item.image ? (
                  <div className="w-full aspect-square overflow-hidden">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ) : (
                  <div className="w-full aspect-square flex items-center justify-center text-5xl" style={{color: '#1C2B3A'}}>
                    {item.icon}
                  </div>
                )}
                <div className="text-center p-6 md:p-8">
                  <h3 className="text-base md:text-lg font-normal mb-2" style={{color: '#1F1F1F'}}>
                    {item.title}
                  </h3>
                  <p className="text-xs md:text-sm font-light" style={{color: '#6B7280'}}>
                    {item.subtitle}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Facial Features Section */}
      <section className="py-20 md:py-28 px-6 md:px-12 bg-white md:bg-[#FAFAFA]">
        <div className="max-w-7xl mx-auto">
          <div className="mb-16 text-center">
            <h2 className="text-2xl md:text-3xl font-light mb-4 tracking-wide" style={{color: '#1F1F1F'}}>
              {t('facialContour.services.title')}
            </h2>
            <p className="text-sm md:text-base font-light" style={{color: '#6B7280'}}>
              {t('facialContour.services.subtitle')}
            </p>
          </div>

          {/* Feature Tabs */}
          <div className="flex flex-wrap gap-3 md:gap-4 mb-12 justify-center">
            {[
              { key: 'nose' as const, label: t('facialContour.features.nose') },
              { key: 'eyes' as const, label: t('facialContour.features.eyes') },
              { key: 'lips' as const, label: t('facialContour.features.lips') },
            ].map((feature) => (
              <button
                key={feature.key}
                onClick={() => setActiveFeature(feature.key)}
                className="px-8 md:px-10 py-3 md:py-4 text-sm md:text-base transition-all duration-300 border"
                style={{
                  backgroundColor: activeFeature === feature.key ? '#1C2B3A' : 'white',
                  color: activeFeature === feature.key ? 'white' : '#6B7280',
                  borderColor: activeFeature === feature.key ? '#1C2B3A' : '#D1D5DB',
                }}
                onMouseEnter={(e) => {
                  if (activeFeature !== feature.key) {
                    e.currentTarget.style.borderColor = '#1C2B3A';
                  }
                }}
                onMouseLeave={(e) => {
                  if (activeFeature !== feature.key) {
                    e.currentTarget.style.borderColor = '#D1D5DB';
                  }
                }}
              >
                {feature.label}
              </button>
            ))}
          </div>

          {/* Feature Types Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {getCurrentTypes().map((type) => (
              <div
                key={type.id}
                className="bg-white border transition-all duration-300 overflow-hidden w-full"
                style={{borderColor: '#E5E7EB', maxWidth: '400px', margin: '0 auto'}}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'scale(1.02)';
                  e.currentTarget.style.boxShadow = '0 10px 30px rgba(0,0,0,0.1)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'scale(1)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                <div className="w-full aspect-square overflow-hidden">
                  <img
                    src={type.image}
                    alt={activeFeature === 'nose' ? 'Nose type' : activeFeature === 'eyes' ? 'Eye type' : 'Lip type'}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <ServiceCasesSection serviceType="facial" />

      <WhyYanoraSection />

      <CTASection />

      <Footer />
    </div>
  );
}

export default FacialContourPage;
