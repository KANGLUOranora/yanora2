import { useNavigate } from 'react-router-dom';
import { ChangeEvent, CSSProperties, UIEvent, useEffect, useRef, useState } from 'react';
import { supabase } from './lib/supabase';
import { User } from '@supabase/supabase-js';
import { LogOut, User as UserIcon, Menu, X } from 'lucide-react';
import ImageCompareSlider from './components/ImageCompareSlider';
import CaseStudiesSection from './components/CaseStudiesSection';
import MobileTestimonialCarousel from './components/MobileTestimonialCarousel';
import LanguageSelector from './components/LanguageSelector';
import Footer from './components/Footer';
import SplashScreen from './components/SplashScreen';
import AnimatedSection from './components/AnimatedSection';
import { useLanguage } from './contexts/LanguageContext';

type FacePhotoSlot = 'front' | 'left45' | 'right45';

interface FacePhotoDraft {
  file: File;
  previewUrl: string;
}

const facePhotoSlots: Array<{
  id: FacePhotoSlot;
  titleZh: string;
  titleEn: string;
  descZh: string;
  descEn: string;
}> = [
  { id: 'front', titleZh: '姝ｉ潰', titleEn: 'Front', descZh: '闈㈠悜鍓嶆柟', descEn: 'Face forward' },
  { id: 'left45', titleZh: '左 45°', titleEn: 'Left 45°', descZh: '轻微转向', descEn: 'Turn slightly' },
  { id: 'right45', titleZh: '右 45°', titleEn: 'Right 45°', descZh: '轻微转向', descEn: 'Turn slightly' }
];

interface Profile {
  avatar_url: string | null;
  email: string;
}

interface DetailedCaseComparison {
  id: string;
  title_zh: string;
  title_en: string;
  before_image_url: string;
  after_image_url: string;
  timeline_months: number;
  feature1_title_zh: string;
  feature1_title_en: string;
  feature1_desc_zh: string;
  feature1_desc_en: string;
  feature2_title_zh: string;
  feature2_title_en: string;
  feature2_desc_zh: string;
  feature2_desc_en: string;
  feature3_title_zh: string;
  feature3_title_en: string;
  feature3_desc_zh: string;
  feature3_desc_en: string;
  display_order: number;
  is_active: boolean;
}

function App() {
  const navigate = useNavigate();
  const { t, language } = useLanguage();
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showProjectsMenu, setShowProjectsMenu] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showMobileProjects, setShowMobileProjects] = useState(false);
  const [hasScrolledMobileNav, setHasScrolledMobileNav] = useState(false);
  const [showUploadLoginPrompt, setShowUploadLoginPrompt] = useState(false);
  const [activePriority, setActivePriority] = useState(0);
  const [analysisScrollCue, setAnalysisScrollCue] = useState('18%');
  const [showSplash, setShowSplash] = useState(true);
  const [hasShownSplash, setHasShownSplash] = useState(false);
  const [detailedCases, setDetailedCases] = useState<DetailedCaseComparison[]>([]);
  const facePhotoInputRef = useRef<HTMLInputElement | null>(null);
  const foldCardSliderRef = useRef<HTMLDivElement | null>(null);
  const activeFacePhotoSlotRef = useRef<FacePhotoSlot>('front');
  const [homeFacePhotos, setHomeFacePhotos] = useState<Record<FacePhotoSlot, FacePhotoDraft | null>>({
    front: null,
    left45: null,
    right45: null
  });
  const homeFacePhotosRef = useRef(homeFacePhotos);
  const priorityCases = [
    {
      number: '01',
      wanted: ['\u9686\u9f3b', '\u9f3b\u7ffc\u7f29\u5c0f'],
      wantedEn: ['Rhinoplasty', 'Alar reduction'],
      diagnosis: '\u7709\u5f13\u4e0d\u7acb\u4f53\u3001\u9762\u4e2d\u51f9\u9677\u65f6\uff0c\u5148\u63d0\u5347\u7709\u5f13\u7acb\u4f53\u5ea6\uff0c\u518d\u5efa\u7acb\u9762\u4e2d\u652f\u6491\u3002',
      diagnosisEn: 'When the brow ridge is flat and the midface lacks support, structure should come before nasal refinement.',
      label: '\u5148\u505a\u7ed3\u6784',
      labelEn: 'Structure first'
    },
    {
      number: '02',
      wanted: ['\u586b\u5145', '\u6cd5\u4ee4\u7eb9'],
      wantedEn: ['Filler', 'Nasolabial folds'],
      diagnosis: '\u771f\u6b63\u9700\u8981\u4f18\u5148\u6062\u590d\u4e2d\u9762\u652f\u6491\uff0c\u800c\u4e0d\u662f\u76f4\u63a5\u586b\u5145\u5c40\u90e8\u7eb9\u8def\u3002',
      diagnosisEn: 'The priority is rebuilding midface support, rather than filling the visible crease directly.',
      label: '\u5148\u770b\u652f\u6491',
      labelEn: 'Support first'
    },
    {
      number: '03',
      wanted: ['\u7626\u8138\u9488', '\u4e0b\u988c\u7ebf'],
      wantedEn: ['Face slimming', 'Jawline contour'],
      diagnosis: '\u5982\u679c\u95ee\u9898\u6765\u81ea\u4e0b\u5ead\u6bd4\u4f8b\u4e0e\u8f6f\u7ec4\u7ec7\u677e\u5f1b\uff0c\u5e94\u5148\u505a\u8f6e\u5ed3\u79e9\u5e8f\u4e0e\u63d0\u5347\u3002',
      diagnosisEn: 'If the issue comes from lower-face proportion and soft-tissue laxity, contour order and lift come first.',
      label: '\u5148\u5b9a\u6bd4\u4f8b',
      labelEn: 'Proportion first'
    }
  ];
  const orderPrinciples = [
    {
      number: '01',
      title: '\u9634\u5f71',
      titleEn: 'Shadow',
      copy: '\u9ad8\u7ea7\u611f\u4e0d\u662f\u628a\u9762\u90e8\u505a\u6ee1\uff0c\u800c\u662f\u8ba9\u8be5\u6709\u8f6c\u6298\u7684\u4f4d\u7f6e\u5f62\u6210\u5e72\u51c0\u9634\u5f71\u3002',
      copyEn: 'Refinement is not fullness. It comes from clean transitions where shadow should naturally exist.'
    },
    {
      number: '02',
      title: '\u6bd4\u4f8b',
      titleEn: 'Proportion',
      copy: '\u4e94\u5b98\u9700\u8981\u56de\u5230\u4e0a\u4e2d\u4e0b\u5ead\u3001\u5185\u5916\u8f6e\u5ed3\u4e4b\u95f4\u7684\u5173\u7cfb\u91cc\uff0c\u5355\u70b9\u53d8\u7f8e\u4e0d\u7b49\u4e8e\u6574\u4f53\u53d8\u7f8e\u3002',
      copyEn: 'Features have to return to the relationship between facial thirds and inner-to-outer contours.'
    },
    {
      number: '03',
      title: '\u81ea\u7136',
      titleEn: 'Naturalness',
      copy: '\u597d\u7684\u6539\u53d8\u4e0d\u4f1a\u62b9\u6389\u4e2a\u4eba\u7279\u5f81\uff0c\u800c\u662f\u8ba9\u539f\u672c\u7684\u6c14\u8d28\u66f4\u6e05\u6670\u3001\u66f4\u7a33\u5b9a\u3002',
      copyEn: 'A good change does not erase identity. It makes the original temperament clearer and more stable.'
    }
  ];
  useEffect(() => {
    const splashShown = sessionStorage.getItem('splashShown');
    if (splashShown === 'true') {
      setShowSplash(false);
      setHasShownSplash(true);
    }
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setHasScrolledMobileNav(window.scrollY > 12);
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        loadProfile(session.user.id);
      }
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        loadProfile(session.user.id);
      } else {
        setProfile(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    fetchDetailedCases();
  }, []);

  useEffect(() => {
    const slideToNextCard = () => {
      const slider = foldCardSliderRef.current ?? document.querySelector<HTMLDivElement>('.yanora-fold-card-slider');
      if (!slider) return;

      const cards = Array.from(slider.querySelectorAll<HTMLElement>('.yanora-fold-carousel-card'));
      if (cards.length < 2) return;

      const currentIndex = cards.reduce((closestIndex, card, index) => {
        const currentDistance = Math.abs(card.offsetLeft - slider.scrollLeft);
        const closestDistance = Math.abs(cards[closestIndex].offsetLeft - slider.scrollLeft);
        return currentDistance < closestDistance ? index : closestIndex;
      }, 0);
      const nextCard = cards[(currentIndex + 1) % cards.length];

      slider.scrollTo({
        left: nextCard.offsetLeft,
        behavior: 'smooth'
      });
    };

    const intervalId = window.setInterval(slideToNextCard, 5000);
    return () => window.clearInterval(intervalId);
  }, []);

  const fetchDetailedCases = async () => {
    try {
      const { data, error } = await supabase
        .from('detailed_case_comparisons')
        .select('*')
        .eq('is_active', true)
        .order('display_order', { ascending: true });

      if (error) throw error;
      setDetailedCases(data || []);
    } catch (error) {
      console.error('Error fetching detailed cases:', error);
    }
  };

  const loadProfile = async (userId: string) => {
    const { data, error } = await supabase
      .from('profiles')
      .select('avatar_url, email')
      .eq('id', userId)
      .maybeSingle();

    if (data) {
      setProfile(data);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setShowUserMenu(false);
    navigate('/');
  };

  const handleSplashComplete = () => {
    setShowSplash(false);
    setHasShownSplash(true);
    sessionStorage.setItem('splashShown', 'true');
  };

  const handleFacePhotoUploadStart = (slot: FacePhotoSlot) => {
    if (!user) {
      setShowUploadLoginPrompt(true);
      return;
    }

    activeFacePhotoSlotRef.current = slot;
    facePhotoInputRef.current?.click();
  };

  const handleFacePhotoSelected = (event: ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];

    if (selectedFile) {
      const slot = activeFacePhotoSlotRef.current;

      setHomeFacePhotos((current) => {
        if (current[slot]?.previewUrl) {
          URL.revokeObjectURL(current[slot].previewUrl);
        }

        return {
          ...current,
          [slot]: {
            file: selectedFile,
            previewUrl: URL.createObjectURL(selectedFile)
          }
        };
      });
    }

    event.target.value = '';
  };

  const selectedHomeFacePhotos = facePhotoSlots
    .map((slot) => homeFacePhotos[slot.id])
    .filter((photo): photo is FacePhotoDraft => Boolean(photo));

  const handleAnalysisReadingScroll = (event: UIEvent<HTMLDivElement>) => {
    const { scrollLeft, scrollWidth, clientWidth } = event.currentTarget;
    const maxScroll = scrollWidth - clientWidth;
    const progress = maxScroll > 0 ? scrollLeft / maxScroll : 0;
    setAnalysisScrollCue(`${18 + progress * 64}%`);
  };

  const handleFacePhotoSubmit = () => {
    if (!user) {
      setShowUploadLoginPrompt(true);
      return;
    }

    if (selectedHomeFacePhotos.length < 3) return;

    navigate('/booking', {
      state: {
        facePhotos: selectedHomeFacePhotos.map((photo) => photo.file)
      }
    });
  };

  useEffect(() => {
    homeFacePhotosRef.current = homeFacePhotos;
  }, [homeFacePhotos]);

  useEffect(() => {
    return () => {
      Object.values(homeFacePhotosRef.current).forEach((photo) => {
        if (photo?.previewUrl) URL.revokeObjectURL(photo.previewUrl);
      });
    };
  }, []);

  const renderFacePhotoUploadPanel = (isMobile = false) => (
    <div className={`yanora-plan-upload-panel${isMobile ? ' yanora-plan-upload-panel-mobile' : ''}`}>
      <div className="yanora-plan-upload-info">
        <div className="yanora-plan-upload-head">
          <span>{language === 'zh' ? '\u4e0a\u4f20\u9762\u90e8\u7167\u7247' : 'Upload Face Photos'}</span>
          <strong>{language === 'zh' ? '\u4e09\u5f20\u7167\u7247\u5efa\u7acb\u521d\u6b65\u5224\u65ad' : 'Three views for initial assessment'}</strong>
        </div>
        <p className="yanora-plan-upload-note">
          {language === 'zh'
            ? '\u4e0a\u4f20\u6b63\u9762\u4e0e\u4e24\u4fa7 45\u00b0 \u7167\u7247\uff0c\u5e2e\u52a9\u6211\u4eec\u5148\u5224\u65ad\u6bd4\u4f8b\u3001\u652f\u6491\u548c\u8f6e\u5ed3\u8f6c\u6298\u3002'
            : 'Upload front and two 45\u00b0 photos so we can read proportion, support, and contour first.'}
        </p>
      </div>

      <div className="yanora-plan-upload-grid">
        {facePhotoSlots.map((item, index) => {
          const photo = homeFacePhotos[item.id];
          const title = language === 'zh' ? item.titleZh : item.titleEn;
          const desc = language === 'zh' ? item.descZh : item.descEn;

          return (
            <button
              key={item.id}
              type="button"
              className={`yanora-plan-upload-card${photo ? ' yanora-plan-upload-card-filled' : ''}`}
              onClick={() => handleFacePhotoUploadStart(item.id)}
            >
              <span className="yanora-plan-upload-index">{String(index + 1).padStart(2, '0')}</span>
              <span className="yanora-plan-upload-media">
                {photo ? (
                  <img src={photo.previewUrl} alt={title} className="yanora-plan-upload-preview" />
                ) : (
                  <span className="yanora-plan-upload-face" aria-hidden="true">
                    <span></span>
                  </span>
                )}
              </span>
              <span className="yanora-plan-upload-copy">
                <strong>{title}</strong>
                <small>{desc}</small>
              </span>
              <em>{photo ? (language === 'zh' ? '\u66f4\u6362\u7167\u7247' : 'Change photo') : (language === 'zh' ? '\u70b9\u51fb\u4e0a\u4f20' : 'Tap to upload')}</em>
            </button>
          );
        })}
      </div>
      <button
        type="button"
        className="yanora-plan-upload-submit"
        disabled={selectedHomeFacePhotos.length < 3}
        onClick={handleFacePhotoSubmit}
      >
        {language === 'zh' ? '\u63d0\u4ea4\u7167\u7247' : 'Submit Photos'}
      </button>
    </div>
  );
  if (showSplash && !hasShownSplash) {
    return <SplashScreen onComplete={handleSplashComplete} />;
  }

  return (
    <div className="min-h-screen bg-white">
      <nav className={`yanora-main-nav yanora-mobile-nav sticky top-0 bg-white z-50 py-6 ${hasScrolledMobileNav ? 'yanora-mobile-nav-scrolled' : ''}`}>
        <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xl font-light tracking-widest" style={{color: '#1F1F1F'}}>YANORA</span>
          </div>

          <div className="yanora-mobile-nav-actions md:hidden">
            <button
              type="button"
              className="yanora-mobile-nav-cta"
              onClick={() => navigate('/booking')}
            >
              {language === 'zh' ? '开始分析' : 'Start Analysis'}
            </button>
            <button
              className="yanora-mobile-menu-button"
              onClick={() => setShowMobileMenu(true)}
              aria-label="Open menu"
            >
              <Menu className="w-5 h-5" style={{color: '#1F1F1F'}} />
            </button>
          </div>

          <div className="hidden md:flex items-center gap-12">
            <a href="#home" className="text-sm transition" style={{color: '#6B7280'}} onMouseEnter={(e) => e.currentTarget.style.color = '#1F1F1F'} onMouseLeave={(e) => e.currentTarget.style.color = '#6B7280'}>{t.nav.home}</a>

            <div
              className="relative"
              onMouseEnter={() => setShowProjectsMenu(true)}
              onMouseLeave={() => setShowProjectsMenu(false)}
            >
              <a href="#projects" className="text-sm transition" style={{color: '#6B7280'}} onMouseEnter={(e) => e.currentTarget.style.color = '#1F1F1F'} onMouseLeave={(e) => e.currentTarget.style.color = '#6B7280'}>{t.nav.projects}</a>

              {showProjectsMenu && (
                <>
                  <div className="absolute left-0 right-0" style={{top: '100%', height: '20px'}} />
                  <div
                    className="fixed left-0 right-0 shadow-2xl"
                    style={{backgroundColor: '#1C2B3A', height: '480px', top: '80px'}}
                    onMouseEnter={() => setShowProjectsMenu(true)}
                    onMouseLeave={() => setShowProjectsMenu(false)}
                  >
                    <div className="max-w-7xl mx-auto px-16 h-full relative">
                      <div className="flex flex-col justify-center gap-4 h-full py-24" style={{maxWidth: '500px'}}>
                        <button
                          onClick={() => navigate('/facial-contour')}
                          className="text-left px-8 py-5 transition-all duration-300 border border-white border-opacity-20"
                          style={{color: 'white', backgroundColor: 'transparent'}}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.15)';
                            e.currentTarget.style.transform = 'scale(1.02)';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = 'transparent';
                            e.currentTarget.style.transform = 'scale(1)';
                          }}
                        >
                          <span className="text-lg font-light tracking-wider">{t.nav.facialContour}</span>
                        </button>
                        <button
                          onClick={() => navigate('/body-sculpting')}
                          className="text-left px-8 py-5 transition-all duration-300 border border-white border-opacity-20"
                          style={{color: 'white', backgroundColor: 'transparent'}}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.15)';
                            e.currentTarget.style.transform = 'scale(1.02)';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = 'transparent';
                            e.currentTarget.style.transform = 'scale(1)';
                          }}
                        >
                          <span className="text-lg font-light tracking-wider">{t.nav.bodySculpting}</span>
                        </button>
                        <button
                          onClick={() => navigate('/injection-lifting')}
                          className="text-left px-8 py-5 transition-all duration-300 border border-white border-opacity-20"
                          style={{color: 'white', backgroundColor: 'transparent'}}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.15)';
                            e.currentTarget.style.transform = 'scale(1.02)';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = 'transparent';
                            e.currentTarget.style.transform = 'scale(1)';
                          }}
                        >
                          <span className="text-lg font-light tracking-wider">{t.nav.facialRejuvenation}</span>
                        </button>
                        <button
                          onClick={() => navigate('/hair-transplant')}
                          className="text-left px-8 py-5 transition-all duration-300 border border-white border-opacity-20"
                          style={{color: 'white', backgroundColor: 'transparent'}}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.15)';
                            e.currentTarget.style.transform = 'scale(1.02)';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = 'transparent';
                            e.currentTarget.style.transform = 'scale(1)';
                          }}
                        >
                          <span className="text-lg font-light tracking-wider">{t.nav.hairTransplant}</span>
                        </button>
                        {/* Temporarily hidden - Dental page */}
                        {/* <button
                          onClick={() => navigate('/dental')}
                          className="text-left px-8 py-5 transition-all duration-300 border border-white border-opacity-20"
                          style={{color: 'white', backgroundColor: 'transparent'}}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.15)';
                            e.currentTarget.style.transform = 'scale(1.02)';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = 'transparent';
                            e.currentTarget.style.transform = 'scale(1)';
                          }}
                        >
                          <span className="text-lg font-light tracking-wider">{t.nav.dental}</span>
                        </button> */}
                      </div>

                      <div className="absolute bottom-8 right-16">
                        <span className="text-6xl font-extralight tracking-widest" style={{color: 'rgba(255,255,255,0.3)'}}>YANORA</span>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>

            <button onClick={() => navigate('/cases')} className="text-sm transition" style={{color: '#6B7280'}} onMouseEnter={(e) => e.currentTarget.style.color = '#1F1F1F'} onMouseLeave={(e) => e.currentTarget.style.color = '#6B7280'}>{t.nav.cases}</button>
            <button onClick={() => navigate('/faq')} className="text-sm transition" style={{color: '#6B7280'}} onMouseEnter={(e) => e.currentTarget.style.color = '#1F1F1F'} onMouseLeave={(e) => e.currentTarget.style.color = '#6B7280'}>{t.nav.faq}</button>
          </div>

          <div className="hidden md:flex items-center gap-4">
            <LanguageSelector />
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center gap-2 transition"
                >
                  {profile?.avatar_url ? (
                    <img
                      src={profile.avatar_url}
                      alt="Avatar"
                      className="w-10 h-10 rounded-full object-cover border-2"
                      style={{borderColor: '#1C2B3A'}}
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full flex items-center justify-center text-white" style={{backgroundColor: '#1C2B3A'}}>
                      <UserIcon className="w-5 h-5" />
                    </div>
                  )}
                </button>

                {showUserMenu && (
                  <div className="absolute right-0 mt-2 w-56 bg-white border shadow-lg" style={{borderColor: '#D1D5DB'}}>
                    <div className="px-4 py-3 border-b" style={{borderColor: '#E5E7EB'}}>
                      <p className="text-sm font-normal" style={{color: '#1F1F1F'}}>{profile?.email || user.email}</p>
                    </div>
                    <button
                      onClick={handleLogout}
                      className="w-full px-4 py-3 text-left text-sm flex items-center gap-2 transition"
                      style={{color: '#6B7280'}}
                      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#F3F4F6'}
                      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                    >
                      <LogOut className="w-4 h-4" />
                      {t.nav.logout}
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={() => navigate('/login')}
                className="text-sm transition px-4 py-2"
                style={{color: '#6B7280'}}
              >
                {t.nav.login}
              </button>
            )}
            <button
              onClick={() => navigate('/booking')}
              className="yanora-nav-book-button text-sm text-white px-6 py-2 transition"
              style={{backgroundColor: '#1C2B3A'}}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#101D29'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#1C2B3A'}
            >
              {t.nav.bookNow}
            </button>
          </div>
        </div>
      </nav>

      <div
        className={`fixed top-0 right-0 h-full w-80 shadow-2xl transform transition-transform duration-300 ease-in-out z-50 ${
          showMobileMenu ? 'translate-x-0' : 'translate-x-full'
        }`}
        style={{backgroundColor: '#1C2B3A'}}
      >
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between p-6 border-b border-white border-opacity-20">
            <span className="text-xl font-light tracking-widest text-white">YANORA</span>
            <button onClick={() => setShowMobileMenu(false)}>
              <X className="w-6 h-6 text-white" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto py-6">
            <LanguageSelector isMobile={true} />

            <a
              href="#home"
              onClick={() => setShowMobileMenu(false)}
              className="block px-6 py-4 text-white text-sm transition-all border-b border-white border-opacity-10"
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.1)'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
            >
              {t.nav.home}
            </a>

            <div className="border-b border-white border-opacity-10">
              <button
                onClick={() => setShowMobileProjects(!showMobileProjects)}
                className="w-full text-left px-6 py-4 text-white text-sm transition-all"
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.1)'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
              >
                {t.nav.projects}
              </button>
              {showMobileProjects && (
                <div className="bg-black bg-opacity-20">
                  <button
                    onClick={() => {
                      navigate('/facial-contour');
                      setShowMobileMenu(false);
                    }}
                    className="w-full text-left px-10 py-3 text-white text-sm transition-all border-l-2 border-white border-opacity-30"
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.1)'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                  >
                    {t.nav.facialContour}
                  </button>
                  <button
                    onClick={() => {
                      navigate('/body-sculpting');
                      setShowMobileMenu(false);
                    }}
                    className="w-full text-left px-10 py-3 text-white text-sm transition-all border-l-2 border-white border-opacity-30"
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.1)'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                  >
                    {t.nav.bodySculpting}
                  </button>
                  <button
                    onClick={() => {
                      navigate('/injection-lifting');
                      setShowMobileMenu(false);
                    }}
                    className="w-full text-left px-10 py-3 text-white text-sm transition-all border-l-2 border-white border-opacity-30"
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.1)'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                  >
                    {t.nav.facialRejuvenation}
                  </button>
                  <button
                    onClick={() => {
                      navigate('/hair-transplant');
                      setShowMobileMenu(false);
                    }}
                    className="w-full text-left px-10 py-3 text-white text-sm transition-all border-l-2 border-white border-opacity-30"
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.1)'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                  >
                    {t.nav.hairTransplant}
                  </button>
                  {/* Temporarily hidden - Dental page */}
                  {/* <button
                    onClick={() => {
                      navigate('/dental');
                      setShowMobileMenu(false);
                    }}
                    className="w-full text-left px-10 py-3 text-white text-sm transition-all border-l-2 border-white border-opacity-30"
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.1)'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                  >
                    {t.nav.dental}
                  </button> */}
                </div>
              )}
            </div>

            <button
              onClick={() => {
                navigate('/cases');
                setShowMobileMenu(false);
              }}
              className="w-full text-left px-6 py-4 text-white text-sm transition-all border-b border-white border-opacity-10"
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.1)'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
            >
              {t.nav.cases}
            </button>

            <button
              onClick={() => {
                navigate('/faq');
                setShowMobileMenu(false);
              }}
              className="w-full text-left px-6 py-4 text-white text-sm transition-all border-b border-white border-opacity-10"
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.1)'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
            >
              {t.nav.faq}
            </button>
          </div>

          <div className="p-6 border-t border-white border-opacity-20">
            <button
              onClick={() => {
                navigate('/booking');
                setShowMobileMenu(false);
              }}
              className="w-full py-3 text-white text-sm transition mb-3 border border-white border-opacity-40"
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.15)'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
            >
              {t.nav.bookNow}
            </button>

            {user ? (
              <div>
                <div className="px-4 py-3 mb-2 border-b border-white border-opacity-20">
                  <p className="text-sm text-white">{profile?.email || user.email}</p>
                </div>
                <button
                  onClick={() => {
                    handleLogout();
                    setShowMobileMenu(false);
                  }}
                  className="w-full px-4 py-3 text-left text-sm flex items-center gap-2 text-white transition"
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.1)'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                >
                  <LogOut className="w-4 h-4" />
                  {t.nav.logout}
                </button>
              </div>
            ) : (
              <button
                onClick={() => {
                  navigate('/login');
                  setShowMobileMenu(false);
                }}
                className="w-full py-3 text-white text-sm transition border border-white border-opacity-40"
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.15)'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
              >
                {t.nav.login}
              </button>
            )}
          </div>
        </div>
      </div>

      {showMobileMenu && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setShowMobileMenu(false)}
        />
      )}

      <section className="yanora-hero-section md:px-0">
        <AnimatedSection animation="fade-up" className="md:max-w-none md:mx-0 md:text-left">
          {/* 缁夎濮╃粩?*/}
          <div className="yanora-mobile-hero md:hidden">
            <div className="yanora-mobile-hero-image" aria-hidden="true"></div>
            <div className="yanora-mobile-hero-softlight" aria-hidden="true"></div>
            <div className="relative z-10 px-7 pt-[7.25rem] pb-6 min-h-[100svh] flex flex-col">
              <div className="yanora-mobile-hero-copy mt-auto max-w-[19.25rem] translate-y-5">
              {/* 娑撶粯鐖ｆ０?*/}
              <h1 className="text-[2.72rem] leading-[1.02] font-light mb-1.5" style={{color: '#2C3E50', letterSpacing: '0'}}>
                {t.hero.title1}
              </h1>

              {/* 閸擃垱鐖ｆ０?*/}
              <h2 className="text-[2.05rem] leading-[1.08] font-light mb-6" style={{color: '#95A5A6', letterSpacing: '0'}}>
                {t.hero.title1Part2}
              </h2>

              <div className="w-10 h-px mb-6" style={{backgroundColor: '#B9975B'}}></div>

              {/* 閹诲繗鍫弬鍥х摟 */}
              <div className="max-w-[16.5rem] mb-7">
                <p className="text-[0.95rem] leading-[1.8] font-light" style={{color: '#5D6D7E', letterSpacing: '0.01em'}}>
                  {t.hero.title2Mobile}
                </p>
              </div>

              {/* CTA 閹稿鎸?*/}
              <button
                onClick={() => navigate('/booking')}
                className="yanora-mobile-hero-button w-full max-w-[15.5rem] py-3 text-white text-[0.78rem] font-light shadow-lg hover:shadow-xl transition-all flex items-center justify-between px-5"
                style={{backgroundColor: '#1C2B3A'}}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#152230';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#1C2B3A';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                <span>{t.hero.cta}</span>
                <span className="text-base">&rarr;</span>
              </button>
              </div>

              <button
                type="button"
                onClick={() => document.getElementById('mobile-next-panel')?.scrollIntoView({ behavior: 'smooth', block: 'start' })}
                className="yanora-mobile-explore-more mt-10 text-center w-full"
                aria-label="Explore more"
              >
                <div className="mx-auto mb-2 w-3 h-3 border-r border-b rotate-45" style={{borderColor: '#B9975B'}}></div>
                <div className="text-[0.64rem] tracking-[0.32em]" style={{color: '#5D6D7E'}}>EXPLORE MORE</div>
              </button>
            </div>
          </div>

          {/* 濡楀矂娼扮粩?*/}
          <div className="yanora-desktop-hero hidden md:block">
            <div className="yanora-desktop-hero-bg" aria-hidden="true"></div>
            <div className="yanora-desktop-hero-wash" aria-hidden="true"></div>
            <div className="yanora-desktop-hero-content">
              <div className="yanora-desktop-hero-copy">
              {/* 娑撶粯鐖ｆ０?*/}
              <h1 className="yanora-desktop-hero-title font-light" style={{color: '#1C2B3A'}}>
                {t.hero.title1}
              </h1>

              {/* 閸擃垱鐖ｆ０?*/}
              <h2 className="yanora-desktop-hero-subtitle font-light">
                {t.hero.title1Part2}
              </h2>
              <div className="yanora-desktop-hero-rule"></div>

              {/* 閹诲繗鍫弬鍥х摟 */}
              <div className="yanora-desktop-hero-description">
                <p className="font-light">
                  {t.hero.title2}
                </p>
              </div>

              {/* CTA 閹稿鎸?*/}
              <div className="yanora-desktop-hero-actions">
                <button
                  onClick={() => navigate('/booking')}
                  className="yanora-desktop-hero-primary font-light transition-all flex items-center justify-between"
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#152230';
                    e.currentTarget.style.transform = 'translateY(-2px)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = '#1C2B3A';
                    e.currentTarget.style.transform = 'translateY(0)';
                  }}
                >
                  <span>{t.hero.cta}</span>
                  <span>&rarr;</span>
                </button>
                <button
                  type="button"
                  onClick={() => document.getElementById('mobile-next-panel')?.scrollIntoView({ behavior: 'smooth', block: 'start' })}
                  className="yanora-desktop-hero-secondary"
                >
                  <span>EXPLORE MORE</span>
                  <span>&rarr;</span>
                </button>
              </div>
              </div>
              <button
                type="button"
                className="yanora-desktop-video-cue"
                onClick={() => document.getElementById('mobile-next-panel')?.scrollIntoView({ behavior: 'smooth', block: 'start' })}
              >
                <span className="yanora-desktop-video-dot">▶</span>
                <span>FACE ANALYSIS</span>
              </button>
              <div className="yanora-desktop-hero-metrics" aria-hidden="true">
                <div>
                  <strong>FACE</strong>
                  <span>ANALYSIS</span>
                </div>
                <div>
                  <strong>AI</strong>
                  <span>PRIORITY</span>
                </div>
                <div>
                  <strong>ONE</strong>
                  <span>FACE-FIRST PLAN</span>
                </div>
              </div>
            </div>
          </div>
        </AnimatedSection>
      </section>

      <section id="mobile-next-panel" className="yanora-priority-section yanora-mobile-next-panel px-5 md:px-12 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="yanora-priority-console">
            <div className="yanora-priority-console-intro">
              <div>
                <p className="yanora-priority-eyebrow mb-4" style={{color: '#6F8998'}}>YANORA PRIORITY</p>
                <h2 className="yanora-priority-title font-light" style={{color: '#1C2B3A'}}>
                  {language === 'zh' ? '真正的问题，往往不是用户以为的问题。' : 'The real issue is often not the one clients expect.'}
                </h2>
              </div>
            </div>

            <div className="yanora-priority-slider">
              <div className="yanora-priority-controls flex items-center justify-between mb-5">
                <div className="flex items-center gap-2">
                  {priorityCases.map((item, index) => (
                    <button
                      key={item.number}
                      type="button"
                      onClick={() => setActivePriority(index)}
                      className={`yanora-priority-tab ${activePriority === index ? 'is-active' : ''}`}
                      aria-label={`View priority ${item.number}`}
                    >
                      {index + 1}
                    </button>
                  ))}
                  <div className="yanora-priority-progress" style={{'--active-step': activePriority} as React.CSSProperties}></div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    className="yanora-priority-nav"
                    onClick={() => setActivePriority((activePriority + priorityCases.length - 1) % priorityCases.length)}
                    aria-label="Previous priority"
                  >
                    &larr;
                  </button>
                  <button
                    type="button"
                    className="yanora-priority-nav"
                    onClick={() => setActivePriority((activePriority + 1) % priorityCases.length)}
                    aria-label="Next priority"
                  >
                    &rarr;
                  </button>
                </div>
              </div>

              <div className="yanora-priority-window">
                <div className="yanora-priority-track" style={{transform: `translateX(-${activePriority * 100}%)`}}>
                  {priorityCases.map((item) => (
                    <div key={item.number} className="yanora-priority-slide">
                      <div className="yanora-priority-row grid grid-cols-[1fr_4.25rem_1.12fr] md:grid-cols-[1fr_7rem_1.1fr] items-stretch gap-3 md:gap-7">
                        <div className="yanora-priority-wanted p-5 md:p-6">
                          <div className="yanora-priority-project-list">
                            {(language === 'zh' ? item.wanted : item.wantedEn).map((word) => (
                              <div key={word} className="yanora-priority-project font-light" style={{color: '#1C2B3A'}}>
                                <span>{word}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className="yanora-priority-arrow flex flex-col items-center justify-center gap-3">
                          <div className="yanora-priority-orbit">
                            <span></span>
                          </div>
                          <div className="w-12 md:w-16 h-px" style={{backgroundColor: '#B9CBDC'}}></div>
                          <div className="yanora-priority-arrow-label text-center" style={{color: '#6F8998'}}>YANORA<br />{language === 'zh' ? '鍒ゆ柇' : 'READ'}</div>
                        </div>

                        <div className="yanora-priority-answer p-5 md:p-7">
                          <div className="yanora-priority-kicker mb-5" style={{color: '#B9CBDC'}}>{language === 'zh' ? '搴旇浼樺厛' : 'Priority first'}</div>
                          <p className="yanora-priority-diagnosis font-light" style={{color: '#FFFFFF'}}>
                            {language === 'zh' ? item.diagnosis : item.diagnosisEn}
                          </p>
                          <div className="yanora-priority-label mt-6" style={{color: '#B9CBDC'}}>{language === 'zh' ? item.label : item.labelEn}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="yanora-order-section px-5 md:px-12 bg-white">
        <AnimatedSection animation="fade-up" delay={120} className="max-w-7xl mx-auto">
          <div className="yanora-order-shell">
            <div className="yanora-order-copy">
              <p className="yanora-order-eyebrow">YANORA FACIAL ORDER</p>
              <h2 className="yanora-order-title font-light" style={{color: '#1C2B3A'}}>
                {language === 'zh' ? '高级感，来自面部秩序的平衡。' : 'Refinement comes from the balance of facial order.'}
              </h2>
              <p className="yanora-order-subcopy">
                {language === 'zh'
                  ? '让光影、比例和自然感回到正确位置。'
                  : 'Bring shadow, proportion, and naturalness back into place.'}
              </p>

              <div className="yanora-order-principles">
                {orderPrinciples.map((item, index) => (
                  <div key={item.number} className="yanora-order-principle" style={{animationDelay: `${index * 140}ms`}}>
                    <span className="yanora-order-principle-index">{item.number}</span>
                    <div>
                      <h3 className="yanora-order-principle-title font-light" style={{color: '#1C2B3A'}}>
                        {language === 'zh' ? item.title : item.titleEn}
                      </h3>
                      <p className="yanora-order-principle-copy">
                        {language === 'zh' ? item.copy : item.copyEn}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="yanora-order-visual" aria-hidden="true">
              <div className="yanora-order-grid"></div>
              <div className="yanora-order-scan"></div>
              <div className="yanora-order-face-glow"></div>
              <img
                src="/yanora-facial-order-portrait.png"
                alt=""
                className="yanora-order-portrait"
              />
              <svg className="yanora-order-map" viewBox="0 0 1000 1000" fill="none">
                <path className="yanora-order-arc yanora-order-arc-forehead" d="M266 302C335 235 419 205 500 205C581 205 665 235 734 302" />
                <path className="yanora-order-center-line" d="M500 205V740" />
                <path className="yanora-order-arc yanora-order-arc-midface" d="M252 492C316 575 421 602 500 602C579 602 684 575 748 492" />
                <path className="yanora-order-arc yanora-order-arc-chin" d="M350 706C396 748 458 768 500 768C542 768 604 748 650 706" />
                <circle className="yanora-order-node yanora-order-node-a" cx="500" cy="205" r="12" />
                <circle className="yanora-order-node yanora-order-node-b" cx="252" cy="492" r="11" />
                <circle className="yanora-order-node yanora-order-node-c" cx="748" cy="492" r="11" />
                <circle className="yanora-order-node yanora-order-node-d" cx="500" cy="602" r="12" />
                <circle className="yanora-order-node yanora-order-node-e" cx="500" cy="768" r="12" />
              </svg>

              <div className="yanora-order-meter yanora-order-meter-a">
                <span>{language === 'zh' ? '闃村奖杞姌' : 'Shadow plane'}</span>
                <strong>82%</strong>
              </div>
              <div className="yanora-order-meter yanora-order-meter-b">
                <span>{language === 'zh' ? '姣斾緥绉╁簭' : 'Proportion order'}</span>
                <strong>01:1.18</strong>
              </div>
              <div className="yanora-order-meter yanora-order-meter-c">
                <span>{language === 'zh' ? '鑷劧淇濈暀' : 'Identity kept'}</span>
                <strong>HIGH</strong>
              </div>
            </div>
          </div>
        </AnimatedSection>
      </section>

      <section className="yanora-advantages-section py-12 md:py-24 px-4 md:px-12 bg-white">
        <div className="max-w-7xl mx-auto">
          <AnimatedSection animation="fade-up">
            <div className="mb-10 md:mb-16 grid grid-cols-1 md:grid-cols-[0.9fr_1.1fr] gap-6 md:gap-12 items-end">
              <div>
                <p className="text-xs tracking-[0.28em] mb-4" style={{color: '#8B98A8'}}>WHY YANORA</p>
                <h2 className="text-3xl md:text-5xl font-light leading-tight" style={{color: '#1F1F1F'}}>{t.advantages.title}</h2>
              </div>
              <h3 className="text-2xl md:text-4xl font-light leading-tight whitespace-pre-line md:text-right" style={{color: '#1F1F1F'}}>
                {t.comparison.title}
              </h3>
            </div>
          </AnimatedSection>

          <div
            className="yanora-advantages-panel relative overflow-hidden border p-4 md:p-8 lg:p-10"
            style={{
              borderColor: '#DDE5EC',
              backgroundColor: '#F7FAFC'
            }}
          >
            <div className="absolute left-[38%] top-8 bottom-8 hidden lg:block w-px" style={{backgroundColor: '#DDE5EC'}}></div>
            <div className="absolute left-[38%] top-1/2 hidden lg:flex -translate-x-1/2 -translate-y-1/2 w-20 h-20 rounded-full items-center justify-center bg-white z-20" style={{border: '1px solid #DDE5EC', color: '#B9CBDC'}}>
              <span className="text-2xl font-serif italic">VS</span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-[0.72fr_1.28fr] gap-8 lg:gap-14">
              <AnimatedSection animation="fade-up" delay={100}>
                <div className="relative min-h-[520px]">
                  <div className="mb-6">
                    <div className="text-xs tracking-[0.32em] mb-2" style={{color: '#8B98A8'}}>{t.comparison.traditionalLabel}</div>
                    <div className="text-2xl md:text-3xl font-light" style={{color: '#6B7280'}}>Project-first</div>
                  </div>

                  <div className="relative h-[440px]">
                    {t.comparison.traditionalItems.map((item: { title: string; subtitle: string }, index: number) => (
                      <div
                        key={item.title}
                        className="yanora-stack-card absolute left-0 right-0 p-5 md:p-6 bg-white border shadow-sm transition-transform duration-500"
                        style={{
                          top: `${index * 72}px`,
                          borderColor: '#DDE5EC',
                          transform: `translateX(${index % 2 === 0 ? 0 : 18}px) rotate(${index % 2 === 0 ? -1.2 : 1.1}deg)`,
                          opacity: 1 - index * 0.09,
                          zIndex: 10 - index
                        }}
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <h3 className="text-base md:text-lg font-light mb-2" style={{color: '#6B7280'}}>{item.title}</h3>
                            <p className="text-xs tracking-[0.08em]" style={{color: '#A0A7B5'}}>{item.subtitle}</p>
                          </div>
                          <span className="text-xl leading-none" style={{color: '#C8D2DB'}}>X</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </AnimatedSection>

              <AnimatedSection animation="fade-up" delay={180}>
                <div className="yanora-face-first-panel relative overflow-hidden min-h-[560px] p-6 md:p-8 lg:p-10" style={{backgroundColor: '#1C2B3A'}}>
                  <div className="absolute right-8 top-8 text-[7rem] md:text-[10rem] font-serif italic leading-none select-none" style={{color: 'rgba(255,255,255,0.045)'}}>Y</div>

                  <div className="relative z-10">
                    <div className="yanora-face-first-head flex items-start justify-between gap-6 mb-10 pb-6 border-b" style={{borderColor: 'rgba(255,255,255,0.14)'}}>
                      <div>
                        <div className="text-xs tracking-[0.32em] mb-2" style={{color: '#B9CBDC'}}>{t.comparison.yanoraLabel}</div>
                        <div className="text-2xl md:text-4xl font-light text-white">Face-first</div>
                      </div>
                      <div className="hidden md:block text-right text-xs tracking-[0.2em]" style={{color: 'rgba(255,255,255,0.44)'}}>
                        ANALYSE<br />THEN ACT
                      </div>
                    </div>

                    <div className="yanora-face-first-list relative">
                      <div className="absolute left-[15px] top-4 bottom-4 w-px" style={{backgroundColor: 'rgba(185,203,220,0.34)'}}></div>
                      {t.comparison.yanoraItems.map((item: { title: string; subtitle: string }, index: number) => (
                        <div key={item.title} className="yanora-face-first-item relative grid grid-cols-[32px_1fr] gap-5 pb-8 last:pb-0">
                          <div className="yanora-method-node relative z-10 w-8 h-8 rounded-full flex items-center justify-center text-[11px]" style={{backgroundColor: '#B9CBDC', color: '#1C2B3A', boxShadow: '0 0 22px rgba(185,203,220,0.45)'}}>
                            {index + 1}
                          </div>
                          <div className="yanora-face-first-content grid grid-cols-1 md:grid-cols-[0.82fr_1fr] gap-3 md:gap-8 pb-8 border-b last:border-b-0" style={{borderColor: 'rgba(255,255,255,0.12)'}}>
                            <h3 className="yanora-face-first-title text-xl md:text-2xl font-light leading-snug text-white">{item.title}</h3>
                            <p className="yanora-face-first-subtitle text-sm leading-relaxed" style={{color: 'rgba(255,255,255,0.56)'}}>{item.subtitle}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </AnimatedSection>
            </div>
          </div>
        </div>
      </section>

      <section className="yanora-analysis-unified-section w-full relative">
        <div className="yanora-analysis-board max-w-7xl mx-auto px-4 md:px-10">
          <div className="yanora-analysis-board-copy">
            <p className="yanora-analysis-board-eyebrow">YANORA ANALYSIS</p>
            <h2>{t.analysis.title}</h2>
            <p>{t.analysis.subtitle}</p>
          </div>

          <div className="yanora-analysis-board-portrait">
            <img
              src="/56315efc544d966bb744e9a52c7de1f4.png"
              alt="Professional portrait"
            />
          </div>

          <div className="yanora-analysis-dimension-list">
            {[
              t.analysis.dimension1,
              t.analysis.dimension2,
              t.analysis.dimension3,
              t.analysis.dimension4,
              language === 'zh' ? '\u6298\u53e0\u5ea6\u4e0e\u5e74\u8f7b\u6001\u7ef4\u5ea6' : 'Fold Degree & Youthfulness',
              language === 'zh' ? '\u5fc3\u7406\u8bc9\u6c42\u4e0e\u98ce\u683c\u7ef4\u5ea6' : 'Psychological Needs & Style'
            ].map((dimension, index) => (
              <div key={dimension}>
                <span>{String(index + 1).padStart(2, '0')}</span>
                <strong>{dimension}</strong>
              </div>
            ))}
          </div>

          <div
            className="yanora-analysis-reading-grid"
            onScroll={handleAnalysisReadingScroll}
            style={{ '--yanora-analysis-cue-x': analysisScrollCue } as CSSProperties}
          >
            {[
              { title: t.facialAnalysis.foreheadTitle, desc: t.facialAnalysis.foreheadDesc, image: '/yanora-analysis-forehead.png' },
              { title: t.facialAnalysis.outerContourTitle, desc: t.facialAnalysis.outerContourDesc, image: '/yanora-analysis-outer-contour.png' },
              { title: t.facialAnalysis.innerContourTitle, desc: t.facialAnalysis.innerContourDesc, image: '/yanora-analysis-inner-contour.png' }
            ].map((item) => (
              <article key={item.title} className="yanora-analysis-reading-card">
                <img src={item.image} alt={item.title} />
                <div>
                  <h3>{item.title}</h3>
                  <p>{item.desc}</p>
                </div>
              </article>
            ))}
          </div>
        </div>

        <div className="px-4 md:px-8 pb-12 md:pb-24">
          <div
            ref={foldCardSliderRef}
            className="yanora-fold-card-slider max-w-7xl mx-auto"
            aria-label={language === 'zh' ? '面部年轻态治疗卡片' : 'Facial treatment cards'}
          >
        <div className="yanora-fold-analysis-panel yanora-fold-carousel-card p-5 md:p-8">
          <AnimatedSection animation="fade-up">
            <div className="yanora-fold-analysis-head mb-8 md:mb-12">
              <div>
                <p className="yanora-fold-analysis-eyebrow">
                  {language === 'zh' ? '年轻态结构证据' : 'YOUTHFUL STRUCTURE EVIDENCE'}
                </p>
                <h2 className="text-2xl md:text-5xl font-light tracking-wide leading-tight" style={{color: '#1F1F1F'}}>
                  {t.facialFold.title}
                </h2>
                <p className="mt-4 max-w-2xl text-sm md:text-base leading-relaxed" style={{color: '#6B7280'}}>
                  {t.facialFold.subtitle}
                </p>
              </div>
            </div>

          </AnimatedSection>

          <div className="yanora-fold-visual-grid grid grid-cols-2 gap-4 md:gap-8">
            <AnimatedSection animation="fade-left" delay={100} className="space-y-3 md:space-y-4">
              <div className="yanora-fold-photo rounded-2xl overflow-hidden" style={{backgroundColor: '#F5F8FA'}}>
                <img
                  src="/c902ff4b95da45684c7afeaa83488729.jpg"
                  alt={t.facialFold.youngState}
                  className="w-full h-auto object-cover"
                />
                <div className="yanora-fold-scan"></div>
                <div className="yanora-fold-attached-label yanora-fold-attached-label-low">{t.facialFold.lowFold}</div>
              </div>
              <div className="yanora-fold-diagram rounded-2xl overflow-hidden flex items-center justify-center p-4 md:p-6" style={{backgroundColor: '#F5F8FA'}}>
                <img
                  src="/Gemini_Generated_Image_ig76luig76luig76.png"
                  alt={t.facialFold.diagram3d}
                  className="w-auto h-20 md:h-40 object-contain"
                />
                <div className="yanora-fold-ring"></div>
                <div className="yanora-fold-depth-line yanora-fold-depth-line-a"></div>
                <div className="yanora-fold-depth-line yanora-fold-depth-line-b"></div>
              </div>
            </AnimatedSection>
            <AnimatedSection animation="fade-right" delay={100} className="space-y-3 md:space-y-4">
              <div className="yanora-fold-photo yanora-fold-photo-high rounded-2xl overflow-hidden" style={{backgroundColor: '#F5F8FA'}}>
                <img
                  src="/6ddd0ec9ec91d3e5b3bc59d068c2a2b5.jpg"
                  alt={t.facialFold.youngState}
                  className="w-full h-auto object-cover"
                />
                <div className="yanora-fold-scan"></div>
                <div className="yanora-fold-attached-label yanora-fold-attached-label-high">{t.facialFold.highFold}</div>
              </div>
              <div className="yanora-fold-diagram yanora-fold-diagram-high rounded-2xl overflow-hidden flex items-center justify-center p-4 md:p-6" style={{backgroundColor: '#F5F8FA'}}>
                <img
                  src="/Gemini_Generated_Image_x86obtx86obtx86o.png"
                  alt={t.facialFold.diagram3d}
                  className="w-auto h-20 md:h-40 object-contain"
                />
                <div className="yanora-fold-ring"></div>
                <div className="yanora-fold-depth-line yanora-fold-depth-line-a"></div>
                <div className="yanora-fold-depth-line yanora-fold-depth-line-b"></div>
              </div>
            </AnimatedSection>
          </div>
          <div className="yanora-fold-head-metrics" aria-hidden="true">
            <div>
              <span>{language === 'zh' ? '瑙傚療缁村害' : 'READING'}</span>
              <strong>{language === 'zh' ? '年轻态' : 'Youthfulness'}</strong>
            </div>
            <div>
              <span>{language === 'zh' ? '鍒嗘瀽閲嶇偣' : 'FOCUS'}</span>
              <strong>{language === 'zh' ? '鏄庢殫杞姌' : 'Light Plane'}</strong>
            </div>
            <div>
              <span>{language === 'zh' ? '鍒ゆ柇鍏崇郴' : 'RELATION'}</span>
              <strong>{language === 'zh' ? '鏀拺 / 姣斾緥' : 'Support / Ratio'}</strong>
            </div>
          </div>
        </div>
        {[
          {
            eyebrow: '02',
            title: language === 'zh' ? '\u9762\u90e8\u63d0\u5347' : 'Facial Lift',
            subtitle: language === 'zh'
              ? '\u8bc4\u4f30\u9762\u90e8\u677e\u5f1b\u3001\u7ec4\u7ec7\u4e0b\u79fb\u4e0e\u652f\u6491\u5173\u7cfb\uff0c\u660e\u786e\u63d0\u5347\u65b9\u5411\u548c\u5c42\u6b21\u3002'
              : 'Evaluates laxity, tissue descent, and support to define the lifting direction and treatment layer.',
            points: language === 'zh'
              ? ['\u677e\u5f1b\u4e0b\u5782', '\u4e2d\u4e0b\u9762\u90e8\u652f\u6491', '\u8f6e\u5ed3\u7ebf\u6062\u590d']
              : ['Laxity', 'Mid-lower face support', 'Jawline recovery']
          },
          {
            eyebrow: '03',
            title: language === 'zh' ? '\u62c9\u76ae' : 'Rhytidectomy',
            subtitle: language === 'zh'
              ? '\u4ece\u76ae\u80a4\u3001\u7b4b\u819c\u4e0e\u6df1\u5c42\u7ec4\u7ec7\u7684\u5173\u7cfb\u51fa\u53d1\uff0c\u5339\u914d\u66f4\u7a33\u5b9a\u7684\u5e74\u8f7b\u5316\u8def\u5f84\u3002'
              : 'Maps the relationship between skin, fascia, and deeper tissue for a more stable rejuvenation path.',
            points: language === 'zh'
              ? ['\u7b4b\u819c\u5c42\u6b21', '\u76ae\u80a4\u5197\u4f59', '\u672f\u540e\u7a33\u5b9a\u5ea6']
              : ['SMAS layer', 'Skin redundancy', 'Result stability']
          },
          {
            eyebrow: '04',
            title: language === 'zh' ? '\u624b\u672f' : 'Surgery',
            subtitle: language === 'zh'
              ? '\u7ed3\u5408\u9762\u90e8\u6bd4\u4f8b\u3001\u6062\u590d\u5468\u671f\u4e0e\u4e2a\u4eba\u8bc9\u6c42\uff0c\u5f62\u6210\u4e2a\u6027\u5316\u624b\u672f\u8bbe\u8ba1\u3002'
              : 'Combines facial proportion, recovery timing, and personal goals into a tailored surgical plan.',
            points: language === 'zh'
              ? ['\u672f\u5f0f\u9009\u62e9', '\u6062\u590d\u8ba1\u5212', '\u98ce\u9669\u6c9f\u901a']
              : ['Procedure choice', 'Recovery plan', 'Risk discussion']
          }
        ].map((card) => (
          <article key={card.title} className="yanora-fold-carousel-card yanora-fold-topic-card">
            <div>
              <span>{card.eyebrow}</span>
              <h3>{card.title}</h3>
              <p>{card.subtitle}</p>
            </div>
            <ul>
              {card.points.map((point) => (
                <li key={point}>{point}</li>
              ))}
            </ul>
          </article>
        ))}
          </div>
        </div>
      </section>

      {/* ========================================
          閹靛婀崇拋鈥冲灊鐏炴洜銇氶崠鍝勬健
          Section: 閼惧嘲褰囨担鐘垫畱閹靛婀崇拋鈥冲灊
          閸旂喕鍏橀敍姘潔缁€鐑樺閺堫垰澧犻崥搴☆嚠濮ｆ梻鍙庨悧鍥у挤閹靛婀冲銉╊€冨ù浣衡柤
          鐢啫鐪敍姘毙╅崝銊ь伂閸滃本顢戦棃銏㈩伂闁插洨鏁ゆ稉宥呮倱鐢啫鐪?
      ========================================== */}
      <section className="yanora-plan-section py-8 md:py-24 px-6 md:px-12 bg-white">
        <div className="max-w-6xl mx-auto">
          {/* 閺嶅洭顣介崪灞藉閺嶅洭顣?*/}
          <AnimatedSection animation="fade-up">
            <h2 className="text-2xl md:text-3xl font-light text-center mb-3 tracking-wide" style={{color: '#1F1F1F'}}>{t.plan.title}</h2>
            <p className="text-sm text-center mb-8 md:mb-16 tracking-wide" style={{color: '#6B7280'}}>
              {t.plan.subtitle}
            </p>
          </AnimatedSection>

          {/* ========================================
              缁夎濮╃粩顖氱鐏炩偓 - 缁毖冨櫨閻楀牐顔曠拋?
              閻楀湱鍋ｉ敍姘瑐娑撳甯撻崚妤嬬礉閸忓牆鐫嶇粈鐑樻钩閸撳秵婀抽崥搴ｅ弾閻楀浄绱濋崘宥呯潔缁€鐑橆劄妤犮倕鍨悰?
          ========================================== */}
          <div className="md:hidden">
            <div className="yanora-plan-mobile-shell flex flex-col gap-6 mb-8">
              {/* 閺堫垰澧犻張顖氭倵閻撗呭鐎佃鐦崠?- 濡亜鎮滈幒鎺戝灙 */}
              <div className="yanora-plan-mobile-flow flex justify-center gap-6">
                {/* 閺堫垰澧犻悡褏澧?*/}
                <div className="yanora-plan-mobile-frame relative w-40">
                  <span className="yanora-plan-corner yanora-plan-corner-tl"></span>
                  <span className="yanora-plan-corner yanora-plan-corner-br"></span>
                  <div className="yanora-plan-mobile-photo overflow-hidden relative rounded-2xl" style={{backgroundColor: '#F3F4F6'}}>
                    <img
                      src="/540f310b1f9b5244da98c950465274f4.png"
                      alt={t.plan.before}
                      className="h-56 w-full object-cover"
                    />
                    {/* BEFORE閺嶅洨顒?*/}
                    <div className="absolute bottom-2 left-2 bg-white px-2 py-0.5 rounded">
                      <span className="text-xs text-gray-600">{t.plan.beforeLabel}</span>
                    </div>
                  </div>
                </div>

                <div className="yanora-plan-mobile-connector" aria-hidden="true">
                  <span>→</span>
                </div>

                {/* 閺堫垰鎮楅悡褏澧?*/}
                <div className="yanora-plan-mobile-frame relative w-40">
                  <span className="yanora-plan-corner yanora-plan-corner-tl"></span>
                  <span className="yanora-plan-corner yanora-plan-corner-br"></span>
                  <div className="yanora-plan-mobile-photo overflow-hidden relative rounded-2xl" style={{backgroundColor: '#F3F4F6'}}>
                    <img
                      src="/7f2a85b5a678c2f472ee7c56c64a6039.png"
                      alt={t.plan.after}
                      className="h-56 w-full object-cover"
                    />
                    {/* AFTER閺嶅洨顒?*/}
                    <div className="absolute bottom-2 left-2 bg-white px-2 py-0.5 rounded">
                      <span className="text-xs text-gray-600">{t.plan.afterLabel}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* 閹靛婀冲銉╊€冮崚妤勩€?- 缁鹃潧鎮滈幒鎺戝灙 */}
              <div className="yanora-plan-mobile-steps max-w-md mx-auto rounded-3xl p-6" style={{
                backgroundColor: '#F5F8FA'
              }}>
                {[
                  { num: '01', title: t.plan.step1 }, // 閼惧嘲褰囨稉鎾愁啀闂堛垽鍎撮崚鍡樼€?
                  { num: '02', title: t.plan.step2 }, // 娴ｇ姵娓剁紘搴ｆ畱閺嶅嘲鐡?
                  { num: '03', title: t.plan.step3 }, // 閼惧嘲褰囨担鐘垫畱娑撴挸鐫橀悞鏇㈩杹閺傝顢?
                  { num: '04', title: t.plan.step4 }  // 鐟欎浇鐦夐弰鎹愭啿閺佸牊鐏?
                ].map((item, index, array) => (
                  <div key={item.num}>
                    {/* 濮濄儵顎冮崡锛勫 - 闂€鎸庢蒋鏉堣顢?*/}
                    <div
                      className="rounded-2xl px-6 py-3"
                      style={{
                        border: '1px solid #E5E7EB',
                        backgroundColor: '#FFFFFF'
                      }}
                    >
                      <h3 className="yanora-plan-step-title text-base font-normal text-center leading-snug" style={{color: '#1F1F1F'}}>
                        <span className="yanora-plan-step-badge" style={{animationDelay: `${index * 180}ms`}}>
                          <span className="yanora-plan-step-num">{item.num}</span>
                          <span className="yanora-plan-step-check">✓</span>
                        </span>
                        <span>{item.title}</span>
                      </h3>
                    </div>

                    {/* 缁狀厼銇旈崚鍡涙缁?- 娑撳秴婀張鈧崥搴濈娑擃亝顒炴銈嗘▔缁€?*/}
                    {index < array.length - 1 && (
                      <div className="flex justify-center py-1">
                        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                          <path
                            d="M10 2L10 16M10 16L5 11M10 16L15 11"
                            stroke="#C7CFDA"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </div>
                    )}
                  </div>
                ))}
              </div>
              {renderFacePhotoUploadPanel(true)}
            </div>
          </div>

          {/* ========================================
              濡楀矂娼扮粩顖氱鐏炩偓 - 缁墽绶ㄧ拋鎹愵吀
              閻楀湱鍋ｉ敍姘瑐娑撳琚辩仦鍌氱鐏炩偓
              娑撳﹤鐪伴敍姘钩閸撳秵婀抽崥搴ｅ弾閻楀洦铆閸氭垶甯撻崚妤嬬礉鐢附婀佺憗鍛淬偘閹嗙珶濡?
              娑撳鐪伴敍?娑擃亝顒炴銈喢崥鎴滅鐞涘本甯撻崚?
          ========================================== */}
          <div className="yanora-plan-desktop hidden md:flex md:flex-col md:items-center">
            {/* 閺堫垰澧犻張顖氭倵閻撗呭閸?- 鐢附婀丼VG鐟佸懘銈版潏瑙勵攱 */}
            <div className="yanora-plan-desktop-visual relative flex gap-32 flex-shrink-0 mb-12">
              {/* SVG鐟佸懘銈版潏瑙勵攱 - 閸︺劋琚卞鐘靛弾閻楀洤鎳嗛崶瀵哥帛閸掑墎鐓╄ぐ銏ｇ珶濡?*/}
              <svg className="absolute inset-0 w-full h-full" style={{ overflow: 'visible' }}>
                <path
                  d="M 20,20 L 420,20 L 420,524 L 20,524 L 20,20 M 548,20 L 948,20 L 948,524 L 548,524 L 548,20"
                  fill="none"
                  stroke="#D1D5DB"
                  strokeWidth="2"
                />
              </svg>

              {/* 閺堫垰澧犻悡褏澧栫€圭懓娅?*/}
              <div className="yanora-plan-desktop-frame overflow-hidden relative rounded-2xl" style={{width: '400px', backgroundColor: '#F3F4F6'}}>
                <img
                  src="/540f310b1f9b5244da98c950465274f4.png"
                  alt={t.plan.before}
                  className="w-full object-cover"
                  style={{height: '500px'}}
                />
                {/* BEFORE閺嶅洨顒?- 瀹革缚绗呯憴?*/}
                <div className="absolute bottom-4 left-4 bg-white px-3 py-1.5 shadow rounded">
                  <span className="text-xs font-medium text-gray-700">{t.plan.beforeLabel}</span>
                </div>
              </div>

              {/* 閺堫垰鎮楅悡褏澧栫€圭懓娅?*/}
              <div className="yanora-plan-desktop-frame overflow-hidden relative rounded-2xl" style={{width: '400px', backgroundColor: '#F3F4F6'}}>
                <img
                  src="/7f2a85b5a678c2f472ee7c56c64a6039.png"
                  alt={t.plan.after}
                  className="w-full object-cover"
                  style={{height: '500px'}}
                />
                {/* AFTER閺嶅洨顒?- 瀹革缚绗呯憴?*/}
                <div className="absolute bottom-4 left-4 bg-white px-3 py-1.5 shadow rounded">
                  <span className="text-xs font-medium text-gray-700">{t.plan.afterLabel}</span>
                </div>
              </div>
            </div>

            <div className="yanora-plan-desktop-process">
              <div className="yanora-plan-desktop-steps flex gap-16 justify-center bg-white rounded-2xl px-12 py-8">
                {[
                  { num: '01', title: t.plan.step1 },
                  { num: '02', title: t.plan.step2 },
                  { num: '03', title: t.plan.step3 },
                  { num: '04', title: t.plan.step4 }
                ].map((item, index) => (
                  <div key={item.num} className="yanora-plan-step-confirm">
                    <span className="yanora-plan-step-badge" style={{animationDelay: `${index * 180}ms`}}>
                      <span className="yanora-plan-step-num">{item.num}</span>
                      <span className="yanora-plan-step-check">✓</span>
                    </span>
                    <h3 className="yanora-plan-step-copy">{item.title}</h3>
                  </div>
                ))}
              </div>

              {renderFacePhotoUploadPanel()}
            </div>
          </div>
        </div>
      </section>

      <input
        ref={facePhotoInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFacePhotoSelected}
      />

      {showUploadLoginPrompt && (
        <div className="yanora-upload-login-modal" role="dialog" aria-modal="true" aria-labelledby="upload-login-title">
          <div className="yanora-upload-login-backdrop" onClick={() => setShowUploadLoginPrompt(false)}></div>
          <div className="yanora-upload-login-dialog">
            <button
              type="button"
              className="yanora-upload-login-close"
              onClick={() => setShowUploadLoginPrompt(false)}
              aria-label="Close"
            >
              ×
            </button>
            <p className="yanora-upload-login-eyebrow">YANORA FACE ANALYSIS</p>
            <h3 id="upload-login-title">
              {language === 'zh' ? '请先登录或注册，再上传面部照片' : 'Please log in or register before uploading photos'}
            </h3>
            <p>
              {language === 'zh'
                ? '登录后，我们会把你的面部照片用于生成专属分析与预约方案。'
                : 'After logging in, your photos can be used to prepare your personal analysis and booking flow.'}
            </p>
            <div className="yanora-upload-login-actions">
              <button
                type="button"
                onClick={() => {
                  setShowUploadLoginPrompt(false);
                  navigate('/login');
                }}
              >
                {language === 'zh' ? '鐧诲綍' : 'Log in'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowUploadLoginPrompt(false);
                  navigate('/register');
                }}
              >
                {language === 'zh' ? '娉ㄥ唽' : 'Register'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Common Concerns */}
      <section className="yanora-concerns-section py-12 md:py-20 px-4 md:px-8" style={{backgroundColor: '#F9FAFB'}}>
        <div className="max-w-6xl mx-auto">
          <AnimatedSection animation="fade-up">
            <h2 className="text-2xl md:text-4xl font-light text-center mb-4 tracking-wide leading-tight whitespace-pre-line" style={{color: '#1F1F1F'}}>
              {t.concerns.title}
            </h2>
            <p className="max-w-3xl mx-auto text-center text-sm md:text-base leading-relaxed mb-8" style={{color: '#6B7280'}}>
              {t.concerns.subtitle}
            </p>
            <div className="w-16 h-px mx-auto mb-10 md:mb-12" style={{backgroundColor: '#B9CBDC'}}></div>
          </AnimatedSection>

          <AnimatedSection animation="scale-in" delay={120}>
            <div className="yanora-concerns-compare-panel mb-10 md:mb-14">
              <div className="yanora-concerns-compare-grid">
                <div className="yanora-concerns-compare-frame">
                  <ImageCompareSlider
                    beforeImage="/24a1e5e820d6d721e7aa3970ae648b43.jpg"
                    afterImage="/68744e766a6b63d88f86d714366bcd31.jpg"
                    beforeLabel={language === 'zh' ? '鏈墠' : 'Before'}
                    afterLabel={language === 'zh' ? '鏈悗' : 'After'}
                    initialPosition={50}
                  />
                </div>
                <div className="yanora-concerns-compare-frame">
                  <ImageCompareSlider
                    beforeImage="/5ef6dae25777256ca4e3fafedffbbea9.jpg"
                    afterImage="/c324214cb2a62d16d00510d9652c0f60.jpg"
                    beforeLabel={language === 'zh' ? '鏈墠' : 'Before'}
                    afterLabel={language === 'zh' ? '鏈悗' : 'After'}
                    initialPosition={50}
                  />
                </div>
              </div>
            </div>
          </AnimatedSection>

          <div className="yanora-concerns-issue-grid grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
            {[
              { num: '01', title: t.concerns.issue1Title, desc: t.concerns.issue1Desc },
              { num: '02', title: t.concerns.issue2Title, desc: t.concerns.issue2Desc },
              { num: '03', title: t.concerns.issue3Title, desc: t.concerns.issue3Desc },
              { num: '04', title: t.concerns.issue4Title, desc: t.concerns.issue4Desc },
              { num: '05', title: t.concerns.issue5Title, desc: t.concerns.issue5Desc },
              { num: '06', title: t.concerns.issue6Title, desc: t.concerns.issue6Desc }
            ].map((issue, index) => (
              <AnimatedSection key={issue.num} animation="fade-up" delay={(index + 1) * 100}>
                <div
                  className="group relative h-full overflow-hidden rounded-lg transition-all duration-500 hover:shadow-xl"
                  style={{backgroundColor: '#F5F8FA', border: '1px solid #E5E7EB'}}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-4px)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                  }}
                >
                  <div className="p-5 md:p-6">
                    <div className="flex items-start gap-4">
                      <div
                        className="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-light transition-all duration-300 group-hover:scale-110"
                        style={{backgroundColor: '#1C2B3A'}}
                      >
                        {issue.num}
                      </div>
                      <div className="flex-1">
                        <h3 className="text-base md:text-lg font-normal mb-2 leading-snug tracking-wide" style={{color: '#1F1F1F'}}>
                          {issue.title}
                        </h3>
                        <p className="text-xs md:text-sm leading-relaxed" style={{color: '#6B7280'}}>
                          {issue.desc}
                        </p>
                      </div>
                    </div>
                    <div
                      className="absolute bottom-0 left-0 h-1 transition-all duration-500 w-0 group-hover:w-full"
                      style={{backgroundColor: '#B9CBDC'}}
                    ></div>
                  </div>
                </div>
              </AnimatedSection>
            ))}
          </div>

        </div>
      </section>

      <section className="yanora-real-cases-section py-8 md:py-24 px-3 md:px-12 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl md:text-4xl font-light text-center mb-6 md:mb-8" style={{color: '#1F2937'}}>
            {detailedCases.length > 0 ? (language === 'zh' ? detailedCases[0].title_zh : detailedCases[0].title_en) : t.realCases.title}
          </h2>

          {detailedCases.length > 0 ? (
            <>
              {/* Desktop layout - cases side by side */}
              <div className="hidden md:grid md:grid-cols-2 gap-8 lg:gap-12">
                {detailedCases.map((caseItem) => (
                  <div key={caseItem.id} className="yanora-real-case-card bg-white overflow-hidden" style={{border: '2px solid #E5E7EB'}}>
                    <div className="grid grid-cols-2 gap-0">
                      <div className="aspect-[4/5] overflow-hidden">
                        <img
                          src={caseItem.before_image_url}
                          alt={t.realCases.before}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="aspect-[4/5] overflow-hidden">
                        <img
                          src={caseItem.after_image_url}
                          alt={t.realCases.after}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </div>

                    <div className="px-6 py-6 flex flex-col justify-between h-full" style={{backgroundColor: '#FAFBFC'}}>
                      <div className="text-center">
                        <p className="text-sm font-medium mb-2 leading-tight" style={{color: '#1F2937'}}>
                          {language === 'zh' ? caseItem.feature1_title_zh : caseItem.feature1_title_en}
                        </p>
                        <p className="text-xs leading-relaxed mb-3" style={{color: '#6B7280'}}>
                          {language === 'zh' ? caseItem.feature1_desc_zh : caseItem.feature1_desc_en}
                        </p>
                        <div className="w-full h-px mx-auto" style={{backgroundColor: '#B9CBDC'}}></div>
                      </div>

                      <div className="text-center">
                        <p className="text-sm font-medium mb-2 leading-tight" style={{color: '#1F2937'}}>
                          {language === 'zh' ? caseItem.feature2_title_zh : caseItem.feature2_title_en}
                        </p>
                        <p className="text-xs leading-relaxed mb-3" style={{color: '#6B7280'}}>
                          {language === 'zh' ? caseItem.feature2_desc_zh : caseItem.feature2_desc_en}
                        </p>
                        <div className="w-full h-px mx-auto" style={{backgroundColor: '#B9CBDC'}}></div>
                      </div>

                      <div className="text-center">
                        <p className="text-sm font-medium mb-2 leading-tight" style={{color: '#1F2937'}}>
                          {language === 'zh' ? caseItem.feature3_title_zh : caseItem.feature3_title_en}
                        </p>
                        <p className="text-xs leading-relaxed" style={{color: '#6B7280'}}>
                          {language === 'zh' ? caseItem.feature3_desc_zh : caseItem.feature3_desc_en}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Mobile layout - new design inspired by reference */}
              <div className="md:hidden space-y-6">
                {detailedCases.map((caseItem) => (
                  <div key={caseItem.id} className="bg-white overflow-hidden" style={{borderColor: '#B9CBDC', border: '3px solid #B9CBDC'}}>
                    {/* Before/After Images */}
                    <div className="grid grid-cols-2 gap-0">
                      <div className="aspect-[4/5] overflow-hidden">
                        <img
                          src={caseItem.before_image_url}
                          alt={t.realCases.before}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="aspect-[4/5] overflow-hidden">
                        <img
                          src={caseItem.after_image_url}
                          alt={t.realCases.after}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </div>

                    {/* Timeline */}
                    <div className="relative py-4" style={{backgroundColor: '#F8F9FA'}}>
                      <div className="absolute left-0 right-0 top-1/2 h-px" style={{backgroundColor: '#D1D5DB', transform: 'translateY(-50%)'}}></div>
                      <div className="relative text-center">
                        <span className="inline-block px-5 py-1.5 text-xs font-medium rounded-full" style={{backgroundColor: '#1C2B3A', color: 'white'}}>
                          {caseItem.timeline_months} {t.realCases.months}
                        </span>
                      </div>
                    </div>

                    {/* Features list */}
                    <div className="px-5" style={{backgroundColor: '#FAFBFC', display: 'grid', gridTemplateRows: '1fr 1fr 1fr', height: '100%'}}>
                      <div className="text-center flex flex-col justify-center items-center py-2">
                        <h3 className="text-sm font-medium mb-2 leading-tight" style={{color: '#1F1F1F'}}>
                          {language === 'zh' ? caseItem.feature1_title_zh : caseItem.feature1_title_en}
                        </h3>
                        <p className="text-xs leading-relaxed mb-2" style={{color: '#6B7280'}}>
                          {language === 'zh' ? caseItem.feature1_desc_zh : caseItem.feature1_desc_en}
                        </p>
                        <div className="w-full h-px" style={{backgroundColor: '#B9CBDC'}}></div>
                      </div>

                      <div className="text-center flex flex-col justify-center items-center py-2">
                        <h3 className="text-sm font-medium mb-2 leading-tight" style={{color: '#1F1F1F'}}>
                          {language === 'zh' ? caseItem.feature2_title_zh : caseItem.feature2_title_en}
                        </h3>
                        <p className="text-xs leading-relaxed mb-2" style={{color: '#6B7280'}}>
                          {language === 'zh' ? caseItem.feature2_desc_zh : caseItem.feature2_desc_en}
                        </p>
                        <div className="w-full h-px" style={{backgroundColor: '#B9CBDC'}}></div>
                      </div>

                      <div className="text-center flex flex-col justify-center items-center py-2">
                        <h3 className="text-sm font-medium mb-2 leading-tight" style={{color: '#1F1F1F'}}>
                          {language === 'zh' ? caseItem.feature3_title_zh : caseItem.feature3_title_en}
                        </h3>
                        <p className="text-xs leading-relaxed" style={{color: '#6B7280'}}>
                          {language === 'zh' ? caseItem.feature3_desc_zh : caseItem.feature3_desc_en}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="text-center py-12 text-gray-500">
              {language === 'zh' ? '暂无案例数据' : 'No case data available'}
            </div>
          )}
        </div>
      </section>

      <AnimatedSection animation="fade-up">
        <CaseStudiesSection />
      </AnimatedSection>

      <section className="yanora-testimonials-section py-12 md:py-24 relative overflow-hidden bg-white">
        <div className="relative">
          {/* Mobile title */}
          <AnimatedSection animation="fade-up" className="md:hidden">
            <h2 className="text-2xl font-light text-center mb-3 tracking-wide px-6" style={{color: '#1F1F1F'}}>
              {t.testimonials.title}
            </h2>
            <p className="text-sm text-center mb-2" style={{color: '#6B7280'}}>{t.testimonials.mapTitle}</p>
            <p className="text-xs text-center mb-6" style={{color: '#6B7280'}}>{t.testimonials.mapSubtitle}</p>
            <div className="w-20 h-px mx-auto mb-8" style={{backgroundColor: '#A0A7B5'}}></div>
          </AnimatedSection>

          {/* Desktop title */}
          <AnimatedSection animation="fade-up" className="hidden md:block">
            <h2 className="text-3xl font-light text-center mb-4 tracking-wide px-12" style={{color: '#1F1F1F'}}>
              {t.testimonials.title}
            </h2>
            <div className="w-20 h-px mx-auto mb-6" style={{backgroundColor: '#A0A7B5'}}></div>
          </AnimatedSection>

          {/* Desktop map with text on left */}
          <div className="hidden md:block max-w-7xl mx-auto mb-8 px-12">
            <div className="grid grid-cols-12 gap-6 items-center">
              <div className="col-span-3">
                <h3 className="text-2xl font-bold text-gray-800 mb-2">{t.testimonials.mapTitle}</h3>
                <p className="text-sm text-gray-600">{t.testimonials.mapSubtitle}</p>
              </div>
              <div className="col-span-9 col-start-4">
                <div className="w-full h-[36rem] overflow-hidden">
                  <img src="/Gemini_Generated_Image_bo54dwbo54dwbo54.png" alt="YANORA global map" className="w-full h-full object-cover" />
                </div>
              </div>
            </div>
          </div>

          {/* Mobile map - responsive */}
          <div className="md:hidden px-4 mb-8 bg-white">
            <div className="w-full overflow-hidden bg-white">
              <img src="/Gemini_Generated_Image_bo54dwbo54dwbo54.png" alt="YANORA global map" className="w-full h-auto object-contain bg-white" />
            </div>
          </div>

          {/* Desktop and Mobile testimonials - unified carousel */}
          <div className="w-full">
            <MobileTestimonialCarousel />
          </div>
        </div>
      </section>

      <section className="yanora-journey-section">
        <div className="yanora-journey-cta-shell">
          <div className="yanora-journey-cta-copy">
            <p>{language === 'zh' ? 'YANORA JOURNEY' : 'YANORA JOURNEY'}</p>
            <h2>{t.journey.title}</h2>
            <button type="button" onClick={() => navigate('/booking')}>
              <span>{t.journey.cta}</span>
              <span>&rarr;</span>
            </button>
          </div>

          <div className="yanora-journey-steps">
            {[t.journey.step1, t.journey.step2, t.journey.step3, t.journey.step4].map((step, index) => (
              <article key={step} className="yanora-journey-step-card">
                <span>{String(index + 1).padStart(2, '0')}</span>
                <p>{step}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
      <Footer />
    </div>
  )
}

export default App;
