import { Phone, Mail } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="text-white py-20 px-8" style={{backgroundColor: '#1C2B3A'}}>
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          <div>
            <div className="mb-6">
              <span className="text-2xl font-light tracking-widest">YANORA</span>
            </div>
            <p className="text-sm font-light leading-relaxed" style={{color: '#A0A7B5'}}>
              {t('footer.tagline')}
            </p>
          </div>

          <div>
            <h3 className="text-sm font-normal mb-6 tracking-wide">{t('footer.contact')}</h3>
            <div className="space-y-4">
              <a
                href="tel:+8617891972388"
                className="flex items-center gap-3 text-sm font-light hover:text-white transition group"
                style={{color: '#A0A7B5'}}
              >
                <Phone className="w-4 h-4 group-hover:scale-110 transition" />
                <span>+86 178 9197 2388</span>
              </a>
              <a
                href="mailto:yanora@gmail.com"
                className="flex items-center gap-3 text-sm font-light hover:text-white transition group"
                style={{color: '#A0A7B5'}}
              >
                <Mail className="w-4 h-4 group-hover:scale-110 transition" />
                <span>yanora@gmail.com</span>
              </a>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-normal mb-6 tracking-wide">{t('footer.support')}</h3>
            <div className="space-y-3">
              <a
                href="/faq"
                className="flex items-center gap-2 text-sm font-light hover:text-white transition"
                style={{color: '#A0A7B5'}}
              >
                <span>{t('footer.faq')}</span>
              </a>
              <a
                href="/after-sales"
                className="flex items-center gap-2 text-sm font-light hover:text-white transition"
                style={{color: '#A0A7B5'}}
              >
                <span>{t('footer.afterSales')}</span>
              </a>
              <a
                href="/booking"
                className="flex items-center gap-2 text-sm font-light hover:text-white transition"
                style={{color: '#A0A7B5'}}
              >
                <span>{t('footer.bookConsult')}</span>
              </a>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-normal mb-6 tracking-wide">{t('footer.legal')}</h3>
            <div className="space-y-3">
              <a
                href="/privacy-policy"
                className="flex items-center gap-2 text-sm font-light hover:text-white transition"
                style={{color: '#A0A7B5'}}
              >
                <span>{t('footer.privacy')}</span>
              </a>
              <a
                href="/terms-of-service"
                className="flex items-center gap-2 text-sm font-light hover:text-white transition"
                style={{color: '#A0A7B5'}}
              >
                <span>{t('footer.terms')}</span>
              </a>
            </div>
          </div>
        </div>

        <div className="border-t pt-8 text-center text-xs font-light" style={{borderColor: '#2A3F54', color: '#718096'}}>
          <p>&copy; {new Date().getFullYear()} YANORA. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
