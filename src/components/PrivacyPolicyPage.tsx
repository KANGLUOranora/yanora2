import Navbar from './Navbar';
import Footer from './Footer';
import { Shield, Lock, Eye, UserCheck, Database, Mail } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

function PrivacyPolicyPage() {
  const { t, language } = useLanguage();

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
              <Shield className="w-8 h-8" style={{color: '#1C2B3A'}} />
              <h1 className="text-4xl font-light tracking-wide" style={{color: '#1F1F1F'}}>
                {t('privacyPolicy.title')}
              </h1>
            </div>
            <p className="text-sm" style={{color: '#6B7280'}}>
              {t('privacyPolicy.lastUpdated')}：{new Date().toLocaleDateString(language === 'zh' ? 'zh-CN' : 'en-US')}
            </p>
          </div>

          <div className="space-y-12">
            <section>
              <div className="flex items-center gap-3 mb-4">
                <Eye className="w-6 h-6" style={{color: '#1C2B3A'}} />
                <h2 className="text-2xl font-light" style={{color: '#1F1F1F'}}>
                  {t('privacyPolicy.infoCollection.title')}
                </h2>
              </div>
              <div className="space-y-4 text-sm leading-relaxed" style={{color: '#4B5563'}}>
                <p>
                  {t('privacyPolicy.infoCollection.intro')}
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  {t('privacyPolicy.infoCollection.items').map((item: string, index: number) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>
              </div>
            </section>

            <section>
              <div className="flex items-center gap-3 mb-4">
                <Database className="w-6 h-6" style={{color: '#1C2B3A'}} />
                <h2 className="text-2xl font-light" style={{color: '#1F1F1F'}}>
                  {t('privacyPolicy.infoUsage.title')}
                </h2>
              </div>
              <div className="space-y-4 text-sm leading-relaxed" style={{color: '#4B5563'}}>
                <p>
                  {t('privacyPolicy.infoUsage.intro')}
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  {t('privacyPolicy.infoUsage.items').map((item: string, index: number) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>
              </div>
            </section>

            <section>
              <div className="flex items-center gap-3 mb-4">
                <Lock className="w-6 h-6" style={{color: '#1C2B3A'}} />
                <h2 className="text-2xl font-light" style={{color: '#1F1F1F'}}>
                  {t('privacyPolicy.infoProtection.title')}
                </h2>
              </div>
              <div className="space-y-4 text-sm leading-relaxed" style={{color: '#4B5563'}}>
                <p>
                  {t('privacyPolicy.infoProtection.intro')}
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  {t('privacyPolicy.infoProtection.items').map((item: string, index: number) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>
              </div>
            </section>

            <section>
              <div className="flex items-center gap-3 mb-4">
                <UserCheck className="w-6 h-6" style={{color: '#1C2B3A'}} />
                <h2 className="text-2xl font-light" style={{color: '#1F1F1F'}}>
                  {t('privacyPolicy.yourRights.title')}
                </h2>
              </div>
              <div className="space-y-4 text-sm leading-relaxed" style={{color: '#4B5563'}}>
                <p>
                  {t('privacyPolicy.yourRights.intro')}
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  {t('privacyPolicy.yourRights.items').map((item: string, index: number) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>
              </div>
            </section>

            <section>
              <div className="flex items-center gap-3 mb-4">
                <Mail className="w-6 h-6" style={{color: '#1C2B3A'}} />
                <h2 className="text-2xl font-light" style={{color: '#1F1F1F'}}>
                  {t('privacyPolicy.contact.title')}
                </h2>
              </div>
              <div className="space-y-4 text-sm leading-relaxed" style={{color: '#4B5563'}}>
                <p>
                  {t('privacyPolicy.contact.intro')}
                </p>
                <div className="bg-gray-50 p-6 rounded-lg space-y-3">
                  <p className="flex items-center gap-2">
                    <span className="font-medium" style={{color: '#1F1F1F'}}>{t('privacyPolicy.contact.email')}：</span>
                    <a href="mailto:yanora@gmail.com" className="hover:underline" style={{color: '#1C2B3A'}}>
                      yanora@gmail.com
                    </a>
                  </p>
                  <p className="flex items-center gap-2">
                    <span className="font-medium" style={{color: '#1F1F1F'}}>{t('privacyPolicy.contact.phone')}：</span>
                    <a href="tel:+8617891972388" className="hover:underline" style={{color: '#1C2B3A'}}>
                      +86 178 9197 2388
                    </a>
                  </p>
                </div>
              </div>
            </section>

            <section className="border-t pt-8" style={{borderColor: '#E5E7EB'}}>
              <p className="text-sm leading-relaxed" style={{color: '#6B7280'}}>
                {t('privacyPolicy.updates')}
              </p>
            </section>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default PrivacyPolicyPage;
