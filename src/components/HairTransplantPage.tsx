import { useNavigate } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import CTASection from './CTASection';
import ServiceCasesSection from './ServiceCasesSection';
import WhyYanoraSection from './WhyYanoraSection';
import { useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';

function HairTransplantPage() {
  const navigate = useNavigate();
  const { t, language } = useLanguage();
  const [activeService, setActiveService] = useState<'fueShort' | 'fueLong'>('fueShort');

  const translations = language === 'zh' ? {
    tier1Methods: [
      { title: '营养补充', desc: '均衡饮食，补充蛋白质、维生素和微量元素' },
      { title: '压力管理', desc: '保证充足睡眠，减少焦虑和精神压力' },
    ],
    tier2Methods: [
      { title: '外用药物', desc: '局部刺激毛囊生长，改善头皮血液循环' },
      { title: '口服药物', desc: '抑制DHT生成，延缓脱发进程' },
    ],
    tier3Methods: [
      { title: 'FUE技术', desc: '单个毛囊提取种植，无痕迹，恢复快' },
      { title: 'FUT技术', desc: '条状取发，适合大面积脱发' },
    ],
    scenarios: [
      { condition: '急性短期脱发（如产后、压力大）', solution: '首选第一层，通常可自愈。' },
      { condition: '慢性进行性脱发（如雄激素性脱发）', solution: '早期以第二层为主，若效果不佳再考虑第三层。' },
      { condition: '毛囊未坏死', solution: '可采用第二层药物治疗。' },
      { condition: '毛囊已坏死', solution: '只能靠第三层手术解决。' },
    ],
    fueShortFeatures: ['适合大面积脱发', '毛囊存活率高达95%以上', '术后3-5天即可正常工作', '无痕迹自然美观'],
    fueLongFeatures: ['无需剃发，保持发型', '隐私性强，术后不易察觉', '即刻见效', '适合商务人士'],
  } : {
    tier1Methods: [
      { title: 'Nutritional Supplementation', desc: 'Balanced diet, supplement protein, vitamins, and trace elements' },
      { title: 'Stress Management', desc: 'Ensure adequate sleep, reduce anxiety and mental stress' },
    ],
    tier2Methods: [
      { title: 'Topical Medications', desc: 'Locally stimulate hair follicle growth, improve scalp blood circulation' },
      { title: 'Oral Medications', desc: 'Inhibit DHT production, delay hair loss progression' },
    ],
    tier3Methods: [
      { title: 'FUE Technique', desc: 'Individual follicle extraction and planting, no trace, fast recovery' },
      { title: 'FUT Technique', desc: 'Strip harvesting, suitable for large-area hair loss' },
    ],
    scenarios: [
      { condition: 'Acute short-term hair loss (such as postpartum, stress)', solution: 'First choice is tier one, usually self-healing.' },
      { condition: 'Chronic progressive hair loss (such as androgenetic alopecia)', solution: 'Early focus on tier two, consider tier three if ineffective.' },
      { condition: 'Hair follicles not necrotic', solution: 'Can use tier two medication treatment.' },
      { condition: 'Hair follicles necrotic', solution: 'Can only be solved by tier three surgery.' },
    ],
    fueShortFeatures: ['Suitable for large-area hair loss', 'Follicle survival rate up to 95%+', 'Resume normal work in 3-5 days post-op', 'No trace, natural & beautiful'],
    fueLongFeatures: ['No shaving required, maintain hairstyle', 'High privacy, unnoticeable after surgery', 'Immediate results', 'Suitable for business professionals'],
  };

  return (
    <div className="min-h-screen bg-white relative">
      {/* Mobile Watermark */}
      <div className="md:hidden fixed bottom-6 right-6 z-10 pointer-events-none">
        <span className="text-6xl font-light tracking-wider opacity-20" style={{color: '#1F1F1F'}}>
          YANORA
        </span>
      </div>

      <Navbar />

      <section className="py-16 md:py-20 px-6 md:px-12 bg-white">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-3xl md:text-5xl font-light mb-6 leading-relaxed tracking-wide" style={{color: '#1F1F1F'}}>
            {t('hairTransplant.hero.title')}
          </h1>
          <p className="text-sm md:text-base font-light leading-relaxed mb-8 max-w-2xl mx-auto" style={{color: '#4B5563'}}>
            {t('hairTransplant.hero.subtitle')}
          </p>
          <button
            onClick={() => navigate('/booking')}
            className="px-8 py-3 text-sm md:text-base font-light tracking-wide transition-all duration-300 hover:opacity-80"
            style={{
              backgroundColor: '#1C2B3A',
              color: '#FFFFFF'
            }}
          >
            {t('hairTransplant.hero.cta')}
          </button>

          <div className="mt-12 flex justify-center">
            <img
              src="/Gemini_Generated_Image_qvpx6jqvpx6jqvpx.png"
              alt="植发效果展示"
              className="w-full max-w-3xl h-auto object-contain"
              style={{
                filter: 'brightness(1.05)',
              }}
            />
          </div>
        </div>
      </section>

      <section className="py-20 px-6 md:px-12" style={{backgroundColor: '#F9FAFB'}}>
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-light mb-6 tracking-wide" style={{color: '#1F1F1F'}}>
              {t('hairTransplant.education.whyTitle')}
            </h2>
            <p className="text-base md:text-lg max-w-3xl mx-auto leading-relaxed" style={{color: '#6B7280'}}>
              {t('hairTransplant.education.whyDesc')}
            </p>
          </div>

          <div className="bg-white p-8 md:p-12 mb-12 shadow-sm">
            <h3 className="text-2xl font-light mb-8 tracking-wide" style={{color: '#1F1F1F'}}>
              {t('hairTransplant.education.cycleTitle')}
            </h3>
            <p className="text-base mb-8 leading-relaxed" style={{color: '#6B7280'}}>
              {t('hairTransplant.education.cycleDesc')}
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-6" style={{backgroundColor: '#F9FAFB'}}>
                <h4 className="text-lg font-normal mb-3" style={{color: '#1C2B3A'}}>
                  {t('hairTransplant.education.phases.growth.title')}
                </h4>
                <p className="text-sm leading-relaxed" style={{color: '#6B7280'}}>
                  {t('hairTransplant.education.phases.growth.desc')}
                </p>
              </div>
              <div className="p-6" style={{backgroundColor: '#F9FAFB'}}>
                <h4 className="text-lg font-normal mb-3" style={{color: '#1C2B3A'}}>
                  {t('hairTransplant.education.phases.regression.title')}
                </h4>
                <p className="text-sm leading-relaxed" style={{color: '#6B7280'}}>
                  {t('hairTransplant.education.phases.regression.desc')}
                </p>
              </div>
              <div className="p-6" style={{backgroundColor: '#F9FAFB'}}>
                <h4 className="text-lg font-normal mb-3" style={{color: '#1C2B3A'}}>
                  {t('hairTransplant.education.phases.resting.title')}
                </h4>
                <p className="text-sm leading-relaxed" style={{color: '#6B7280'}}>
                  {t('hairTransplant.education.phases.resting.desc')}
                </p>
              </div>
            </div>
            <p className="text-sm mt-8 p-4" style={{backgroundColor: '#FEF3C7', color: '#92400E'}}>
              {t('hairTransplant.education.normalLoss')}
            </p>
          </div>

          <div className="bg-white p-8 md:p-12 shadow-sm">
            <h3 className="text-2xl font-light mb-8 tracking-wide" style={{color: '#1F1F1F'}}>
              {t('hairTransplant.education.causesTitle')}
            </h3>
            <div className="space-y-6">
              <div className="pb-6 border-b" style={{borderColor: '#E5E7EB'}}>
                <h4 className="text-lg font-normal mb-3 flex items-center gap-2" style={{color: '#1F1F1F'}}>
                  <span className="w-2 h-2 rounded-full" style={{backgroundColor: '#1C2B3A'}} />
                  {t('hairTransplant.education.causes.androgenic.title')}
                </h4>
                <p className="text-sm leading-relaxed ml-4" style={{color: '#6B7280'}}>
                  {t('hairTransplant.education.causes.androgenic.desc')}
                </p>
              </div>
              <div className="pb-6 border-b" style={{borderColor: '#E5E7EB'}}>
                <h4 className="text-lg font-normal mb-3 flex items-center gap-2" style={{color: '#1F1F1F'}}>
                  <span className="w-2 h-2 rounded-full" style={{backgroundColor: '#1C2B3A'}} />
                  {t('hairTransplant.education.causes.stress.title')}
                </h4>
                <p className="text-sm leading-relaxed ml-4" style={{color: '#6B7280'}}>
                  {t('hairTransplant.education.causes.stress.desc')}
                </p>
              </div>
              <div className="pb-6 border-b" style={{borderColor: '#E5E7EB'}}>
                <h4 className="text-lg font-normal mb-3 flex items-center gap-2" style={{color: '#1F1F1F'}}>
                  <span className="w-2 h-2 rounded-full" style={{backgroundColor: '#1C2B3A'}} />
                  {t('hairTransplant.education.causes.nutrition.title')}
                </h4>
                <p className="text-sm leading-relaxed ml-4" style={{color: '#6B7280'}}>
                  {t('hairTransplant.education.causes.nutrition.desc')}
                </p>
              </div>
              <div className="pb-6 border-b" style={{borderColor: '#E5E7EB'}}>
                <h4 className="text-lg font-normal mb-3 flex items-center gap-2" style={{color: '#1F1F1F'}}>
                  <span className="w-2 h-2 rounded-full" style={{backgroundColor: '#1C2B3A'}} />
                  {t('hairTransplant.education.causes.postpartum.title')}
                </h4>
                <p className="text-sm leading-relaxed ml-4" style={{color: '#6B7280'}}>
                  {t('hairTransplant.education.causes.postpartum.desc')}
                </p>
              </div>
              <div>
                <h4 className="text-lg font-normal mb-3 flex items-center gap-2" style={{color: '#1F1F1F'}}>
                  <span className="w-2 h-2 rounded-full" style={{backgroundColor: '#1C2B3A'}} />
                  {t('hairTransplant.education.causes.medical.title')}
                </h4>
                <p className="text-sm leading-relaxed ml-4" style={{color: '#6B7280'}}>
                  {t('hairTransplant.education.causes.medical.desc')}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 px-6 md:px-12">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-light mb-6 tracking-wide" style={{color: '#1F1F1F'}}>
              {t('hairTransplant.treatment.title')}
            </h2>
            <p className="text-base md:text-lg max-w-3xl mx-auto leading-relaxed" style={{color: '#6B7280'}}>
              {t('hairTransplant.treatment.subtitle')}
            </p>
          </div>

          <div className="space-y-8">
            <div className="bg-white border-l-4 p-8 md:p-12 shadow-sm" style={{borderColor: '#1C2B3A'}}>
              <div className="flex items-start gap-4 mb-4">
                <div className="flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center text-white text-xl font-light" style={{backgroundColor: '#1C2B3A'}}>
                  1
                </div>
                <div>
                  <h3 className="text-2xl font-light mb-2 tracking-wide" style={{color: '#1F1F1F'}}>
                    {t('hairTransplant.treatment.tier1.title')}
                  </h3>
                  <p className="text-sm mb-4" style={{color: '#6B7280'}}>
                    {t('hairTransplant.treatment.tier1.suitable')}
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 ml-16">
                {translations.tier1Methods.map((method, index) => (
                  <div key={index} className="p-4" style={{backgroundColor: '#F9FAFB'}}>
                    <h4 className="text-base font-normal mb-2" style={{color: '#1F1F1F'}}>{method.title}</h4>
                    <p className="text-sm" style={{color: '#6B7280'}}>{method.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white border-l-4 p-8 md:p-12 shadow-sm" style={{borderColor: '#1C2B3A'}}>
              <div className="flex items-start gap-4 mb-4">
                <div className="flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center text-white text-xl font-light" style={{backgroundColor: '#1C2B3A'}}>
                  2
                </div>
                <div>
                  <h3 className="text-2xl font-light mb-2 tracking-wide" style={{color: '#1F1F1F'}}>
                    {t('hairTransplant.treatment.tier2.title')}
                  </h3>
                  <p className="text-sm mb-4" style={{color: '#6B7280'}}>
                    {t('hairTransplant.treatment.tier2.suitable')}
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 ml-16">
                {translations.tier2Methods.map((method, index) => (
                  <div key={index} className="p-4" style={{backgroundColor: '#F9FAFB'}}>
                    <h4 className="text-base font-normal mb-2" style={{color: '#1F1F1F'}}>{method.title}</h4>
                    <p className="text-sm" style={{color: '#6B7280'}}>{method.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white border-l-4 p-8 md:p-12 shadow-sm" style={{borderColor: '#1C2B3A'}}>
              <div className="flex items-start gap-4 mb-4">
                <div className="flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center text-white text-xl font-light" style={{backgroundColor: '#1C2B3A'}}>
                  3
                </div>
                <div>
                  <h3 className="text-2xl font-light mb-2 tracking-wide" style={{color: '#1F1F1F'}}>
                    {t('hairTransplant.treatment.tier3.title')}
                  </h3>
                  <p className="text-sm mb-4" style={{color: '#6B7280'}}>
                    {t('hairTransplant.treatment.tier3.suitable')}
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 ml-16">
                {translations.tier3Methods.map((method, index) => (
                  <div key={index} className="p-4" style={{backgroundColor: '#F9FAFB'}}>
                    <h4 className="text-base font-normal mb-2" style={{color: '#1F1F1F'}}>{method.title}</h4>
                    <p className="text-sm" style={{color: '#6B7280'}}>{method.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 px-6 md:px-12" style={{backgroundColor: '#F9FAFB'}}>
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-light mb-6 tracking-wide" style={{color: '#1F1F1F'}}>
              {t('hairTransplant.treatment.selectionTitle')}
            </h2>
          </div>

          <div className="bg-white p-8 md:p-12 shadow-sm">
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center text-white font-light" style={{backgroundColor: '#1C2B3A'}}>
                  1
                </div>
                <div>
                  <h3 className="text-lg font-normal mb-2" style={{color: '#1F1F1F'}}>{t('hairTransplant.treatment.step1')}</h3>
                  <p className="text-sm leading-relaxed" style={{color: '#6B7280'}}>
                    {t('hairTransplant.treatment.step1Desc')}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center text-white font-light" style={{backgroundColor: '#1C2B3A'}}>
                  2
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-normal mb-4" style={{color: '#1F1F1F'}}>{t('hairTransplant.treatment.step2')}</h3>
                  <div className="space-y-4">
                    {translations.scenarios.map((scenario, index) => (
                      <div key={index} className="pl-4 border-l-2" style={{borderColor: '#D1D5DB'}}>
                        <p className="text-sm font-normal mb-1" style={{color: '#1F1F1F'}}>
                          {scenario.condition}
                        </p>
                        <p className="text-sm" style={{color: '#6B7280'}}>
                          {scenario.solution}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 px-6 md:px-12">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-light mb-6 tracking-wide" style={{color: '#1F1F1F'}}>
              {t('hairTransplant.services.title')}
            </h2>
            <p className="text-base md:text-lg max-w-3xl mx-auto leading-relaxed" style={{color: '#6B7280'}}>
              {t('hairTransplant.services.subtitle')}
            </p>
          </div>

          {/* Service Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mb-16">
            {[
              { key: 'fueShort' as const, title: t('hairTransplant.services.fueShort.title'), subtitle: t('hairTransplant.services.fueShort.desc') },
              { key: 'fueLong' as const, title: t('hairTransplant.services.fueLong.title'), subtitle: t('hairTransplant.services.fueLong.desc') },
            ].map((service) => (
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

          {/* Service Details */}
          <div className="bg-gray-50 p-8 md:p-12 border" style={{borderColor: '#E5E7EB'}}>
            <div className="max-w-4xl mx-auto">
              <h3 className="text-xl md:text-2xl font-light mb-4" style={{color: '#1F1F1F'}}>
                {activeService === 'fueShort' && t('hairTransplant.details.fueShort.title')}
                {activeService === 'fueLong' && t('hairTransplant.details.fueLong.title')}
              </h3>
              <p className="text-sm md:text-base mb-8 leading-relaxed" style={{color: '#6B7280'}}>
                {activeService === 'fueShort' && t('hairTransplant.details.fueShort.desc')}
                {activeService === 'fueLong' && t('hairTransplant.details.fueLong.desc')}
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {activeService === 'fueShort' && translations.fueShortFeatures.map((feature, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-3 p-4 bg-white border"
                    style={{borderColor: '#E5E7EB'}}
                  >
                    <span className="mt-1 text-sm" style={{color: '#1C2B3A'}}>●</span>
                    <span className="text-sm md:text-base" style={{color: '#4B5563'}}>{feature}</span>
                  </div>
                ))}
                {activeService === 'fueLong' && translations.fueLongFeatures.map((feature, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-3 p-4 bg-white border"
                    style={{borderColor: '#E5E7EB'}}
                  >
                    <span className="mt-1 text-sm" style={{color: '#1C2B3A'}}>●</span>
                    <span className="text-sm md:text-base" style={{color: '#4B5563'}}>{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Images Section */}
          <div className="bg-white p-8 md:p-12 border mt-8" style={{borderColor: '#E5E7EB'}}>
            <div className="max-w-6xl mx-auto">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {activeService === 'fueShort' && [
                  '/hair/1.jpg',
                  '/hair/2.jpg',
                  '/hair/3.jpg',
                  '/hair/4.jpg'
                ].map((image, index) => (
                  <div
                    key={index}
                    className="bg-gray-50 border overflow-hidden"
                    style={{borderColor: '#E5E7EB'}}
                  >
                    <img
                      src={image}
                      alt={`FUE短发植发 案例 ${index + 1}`}
                      className="w-full h-48 object-cover transition-transform duration-300 hover:scale-105"
                    />
                  </div>
                ))}
                {activeService === 'fueLong' && [
                  '/hair/1.jpg',
                  '/hair/2.jpg',
                  '/hair/3.jpg',
                  '/hair/4.jpg'
                ].map((image, index) => (
                  <div
                    key={index}
                    className="bg-gray-50 border overflow-hidden"
                    style={{borderColor: '#E5E7EB'}}
                  >
                    <img
                      src={image}
                      alt={`FUE长发植发 案例 ${index + 1}`}
                      className="w-full h-48 object-cover transition-transform duration-300 hover:scale-105"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>


      <ServiceCasesSection serviceType="hair" />

      <WhyYanoraSection />

      <CTASection />

      <Footer />
    </div>
  );
}

export default HairTransplantPage;
