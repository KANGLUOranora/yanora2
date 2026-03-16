import Navbar from './Navbar';
import Footer from './Footer';
import { Headphones, MessageCircle, Phone, Mail } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

function AfterSalesPage() {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-white relative">
      {/* Mobile Watermark */}
      <div className="md:hidden fixed bottom-6 right-6 z-10 pointer-events-none">
        <span className="text-6xl font-light tracking-wider opacity-20" style={{color: '#1F1F1F'}}>
          YANORA
        </span>
      </div>

      <Navbar />

      <div className="pt-24 pb-20 px-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Headphones className="w-8 h-8" style={{color: '#1C2B3A'}} />
              <h1 className="text-4xl font-light tracking-wide" style={{color: '#1F1F1F'}}>
                {t('afterSalesPage.title')}
              </h1>
            </div>
            <p className="text-sm max-w-2xl mx-auto" style={{color: '#6B7280'}}>
              {t('afterSalesPage.subtitle')}
            </p>
          </div>

          <div className="space-y-12">
            <section>
              <div className="flex items-center gap-3 mb-6">
                <MessageCircle className="w-6 h-6" style={{color: '#1C2B3A'}} />
                <h2 className="text-2xl font-light" style={{color: '#1F1F1F'}}>
                  {t('afterSalesPage.contactTitle')}
                </h2>
              </div>
              <div className="bg-gray-50 p-8 rounded-lg">
                <p className="text-sm mb-6 leading-relaxed" style={{color: '#4B5563'}}>
                  {t('afterSalesPage.contactIntro')}
                </p>
                <div className="space-y-4">
                  <a
                    href="tel:+8617891972388"
                    className="flex items-center gap-4 p-4 bg-white border hover:shadow-md transition group"
                    style={{borderColor: '#E5E7EB'}}
                  >
                    <div className="w-12 h-12 rounded-full flex items-center justify-center group-hover:scale-110 transition" style={{backgroundColor: '#1C2B3A'}}>
                      <Phone className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <p className="text-xs mb-1" style={{color: '#6B7280'}}>{t('afterSalesPage.phoneLabel')}</p>
                      <p className="text-base font-medium" style={{color: '#1F1F1F'}}>+86 178 9197 2388</p>
                    </div>
                  </a>

                  <a
                    href="mailto:yanora@gmail.com"
                    className="flex items-center gap-4 p-4 bg-white border hover:shadow-md transition group"
                    style={{borderColor: '#E5E7EB'}}
                  >
                    <div className="w-12 h-12 rounded-full flex items-center justify-center group-hover:scale-110 transition" style={{backgroundColor: '#1C2B3A'}}>
                      <Mail className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <p className="text-xs mb-1" style={{color: '#6B7280'}}>{t('afterSalesPage.emailLabel')}</p>
                      <p className="text-base font-medium" style={{color: '#1F1F1F'}}>yanora@gmail.com</p>
                    </div>
                  </a>
                </div>

                <div className="mt-6 pt-6 border-t" style={{borderColor: '#E5E7EB'}}>
                  <p className="text-xs" style={{color: '#6B7280'}}>
                    {t('afterSalesPage.serviceHours')}
                  </p>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default AfterSalesPage;
