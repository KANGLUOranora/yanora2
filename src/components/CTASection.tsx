import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';

function CTASection() {
  const navigate = useNavigate();
  const { t } = useLanguage();

  const steps = [
    t('journey.step1'),
    t('journey.step2'),
    t('journey.step3'),
    t('journey.step4')
  ];

  return (
    <section className="py-12 md:py-24 px-4 md:px-12 bg-white">
      <div className="max-w-6xl mx-auto">
        <div className="p-8 md:p-16 relative overflow-hidden" style={{backgroundColor: '#1C2B3A'}}>
          <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full -mr-32 -mt-32"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white opacity-5 rounded-full -ml-24 -mb-24"></div>

          <div className="relative">
            <h2 className="text-2xl md:text-3xl font-light text-white mb-8 md:mb-12 tracking-wide">
              {t('journey.title')}
            </h2>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8 mb-8 md:mb-12">
              {steps.map((step, index) => (
                <div key={index} className="bg-white bg-opacity-10 backdrop-blur-sm p-6 md:p-8 text-white">
                  <div className="text-xl md:text-2xl font-light mb-2 md:mb-3">{index + 1}</div>
                  <div className="text-xs md:text-sm font-light tracking-wide">{step}</div>
                </div>
              ))}
            </div>

            <div className="flex justify-center">
              <button
                onClick={() => navigate('/booking')}
                className="px-8 md:px-10 py-2.5 md:py-3 bg-white text-xs md:text-sm font-light transition tracking-wider"
                style={{color: '#1C2B3A'}}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#F3F4F6'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#FFFFFF'}
              >
                {t('journey.cta')}
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default CTASection;
