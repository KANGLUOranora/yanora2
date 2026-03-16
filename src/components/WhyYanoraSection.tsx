import AnimatedSection from './AnimatedSection';
import { useLanguage } from '../contexts/LanguageContext';

function WhyYanoraSection() {
  const { t } = useLanguage();

  const features = [
    {
      id: 1,
      image: '/choose/1.jpg',
      title: t('whyYanora.feature1Title'),
      description: t('whyYanora.feature1Desc')
    },
    {
      id: 2,
      image: '/choose/2.jpg',
      title: t('whyYanora.feature2Title'),
      description: t('whyYanora.feature2Desc')
    },
    {
      id: 3,
      image: '/choose/3.jpg',
      title: t('whyYanora.feature3Title'),
      description: t('whyYanora.feature3Desc')
    }
  ];

  return (
    <section className="py-12 md:py-24 px-4 md:px-8 bg-white">
      <div className="max-w-7xl mx-auto">
        <AnimatedSection animation="fade-up">
          <h2 className="text-2xl md:text-4xl font-light text-center mb-12 md:mb-16 tracking-wide" style={{color: '#1F1F1F'}}>
            {t('whyYanora.title')}
          </h2>
        </AnimatedSection>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
          {features.map((feature, index) => (
            <AnimatedSection
              key={feature.id}
              animation="fade-up"
              delay={index * 100}
              className="flex flex-col items-center"
            >
              <div className="w-full rounded-2xl overflow-hidden" style={{backgroundColor: '#F5F8FA'}}>
                <img
                  src={feature.image}
                  alt={feature.title}
                  className="w-full h-auto object-cover"
                />
              </div>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  );
}

export default WhyYanoraSection;
