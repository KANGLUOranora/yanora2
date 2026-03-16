import { useEffect, useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';

interface SplashScreenProps {
  onComplete: () => void;
}

function SplashScreen({ onComplete }: SplashScreenProps) {
  const { t } = useLanguage();
  const [fadeOut, setFadeOut] = useState(false);
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    setTimeout(() => setShowContent(true), 100);

    const timer1 = setTimeout(() => {
      setFadeOut(true);
    }, 2000);

    const timer2 = setTimeout(() => {
      onComplete();
    }, 2800);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, [onComplete]);

  return (
    <div
      className={`fixed inset-0 z-[9999] flex flex-col items-center justify-center transition-opacity duration-800 ${
        fadeOut ? 'opacity-0' : 'opacity-100'
      }`}
      style={{
        backgroundColor: '#1C2B3A',
        touchAction: 'none',
        overscrollBehavior: 'none'
      }}
    >
      <div className="relative w-full h-full flex flex-col items-center justify-center px-4 sm:px-6 md:px-8 overflow-hidden">
        {/* Background animated gradient */}
        <div
          className="absolute inset-0 opacity-20"
          style={{
            background: 'radial-gradient(circle at center, rgba(255,255,255,0.1) 0%, transparent 70%)',
            animation: 'breathe 4s ease-in-out infinite'
          }}
        />

        {/* Main content */}
        <div className="relative z-10 flex flex-col items-center">
          {/* Image with enhanced animation */}
          <div
            className={`mb-6 sm:mb-8 md:mb-12 transition-all duration-1000 ${
              showContent ? 'opacity-100 scale-100' : 'opacity-0 scale-90'
            }`}
            style={{
              animation: showContent ? 'floatIn 1.8s cubic-bezier(0.16, 1, 0.3, 1) forwards' : 'none',
              willChange: 'transform, opacity'
            }}
          >
            <div className="relative">
              {/* Glow effect */}
              <div
                className="absolute inset-0 rounded-full blur-2xl"
                style={{
                  background: 'radial-gradient(circle, rgba(255,255,255,0.3) 0%, transparent 70%)',
                  animation: 'glow 3s ease-in-out infinite'
                }}
              />

              {/* Image container */}
              <div className="relative w-56 h-56 sm:w-72 sm:h-72 md:w-[28rem] md:h-[28rem] lg:w-[32rem] lg:h-[32rem] rounded-full overflow-hidden shadow-2xl"
                style={{
                  border: '3px solid rgba(255, 255, 255, 0.15)',
                  boxShadow: '0 20px 60px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(255, 255, 255, 0.1)'
                }}
              >
                <img
                  src="/start/1.jpg"
                  alt="YANORA"
                  className="w-full h-full object-cover"
                  style={{
                    animation: 'zoomIn 1.8s cubic-bezier(0.16, 1, 0.3, 1) forwards'
                  }}
                />
              </div>
            </div>
          </div>

          {/* Brand name with staggered animation */}
          <div
            className={`text-center transition-all duration-1000 delay-300 ${
              showContent ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
            style={{
              animation: showContent ? 'slideUp 1.5s cubic-bezier(0.16, 1, 0.3, 1) 0.4s forwards' : 'none',
              opacity: 0,
              willChange: 'transform, opacity'
            }}
          >
            <h1
              className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-light tracking-[0.3em] mb-3 sm:mb-4 md:mb-6 text-white"
              style={{
                textShadow: '0 4px 30px rgba(0, 0, 0, 0.5), 0 0 20px rgba(255, 255, 255, 0.1)',
                letterSpacing: '0.25em'
              }}
            >
              YANORA
            </h1>

            {/* Decorative line */}
            <div
              className="w-24 sm:w-32 md:w-48 h-px mx-auto mb-3 sm:mb-4 md:mb-6"
              style={{
                background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.5), transparent)',
                animation: 'expandLine 1.2s ease-out 1s forwards',
                transform: 'scaleX(0)'
              }}
            />

            <p
              className="text-lg sm:text-xl md:text-3xl lg:text-4xl font-light tracking-wide text-white px-4 whitespace-pre-line text-center"
              style={{
                textShadow: '0 2px 20px rgba(0, 0, 0, 0.4)',
                animation: 'fadeIn 1.5s ease-out 1.2s forwards',
                opacity: 0
              }}
            >
              {t('splash.tagline')}
            </p>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes floatIn {
          0% {
            opacity: 0;
            transform: scale(0.7) translateY(-30px);
          }
          60% {
            opacity: 1;
            transform: scale(1.05) translateY(0);
          }
          100% {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }

        @keyframes zoomIn {
          0% {
            transform: scale(1.2);
            opacity: 0;
          }
          100% {
            transform: scale(1);
            opacity: 1;
          }
        }

        @keyframes slideUp {
          0% {
            opacity: 0;
            transform: translateY(40px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fadeIn {
          0% {
            opacity: 0;
          }
          100% {
            opacity: 1;
          }
        }

        @keyframes expandLine {
          0% {
            transform: scaleX(0);
            opacity: 0;
          }
          100% {
            transform: scaleX(1);
            opacity: 1;
          }
        }

        @keyframes glow {
          0%, 100% {
            opacity: 0.3;
            transform: scale(1);
          }
          50% {
            opacity: 0.5;
            transform: scale(1.1);
          }
        }

        @keyframes breathe {
          0%, 100% {
            transform: scale(1);
            opacity: 0.2;
          }
          50% {
            transform: scale(1.1);
            opacity: 0.3;
          }
        }

        /* Prevent scrolling during splash */
        body:has(.splash-screen-active) {
          overflow: hidden;
          position: fixed;
          width: 100%;
          height: 100%;
        }
      `}</style>
    </div>
  );
}

export default SplashScreen;
