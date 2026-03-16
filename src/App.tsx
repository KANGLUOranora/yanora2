import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { supabase } from './lib/supabase';
import { User } from '@supabase/supabase-js';
import { LogOut, User as UserIcon, Menu, X } from 'lucide-react';
import ImageCompareSlider from './components/ImageCompareSlider';
import CaseStudiesSection from './components/CaseStudiesSection';
import ServicesSection from './components/ServicesSection';
import MobileTestimonialCarousel from './components/MobileTestimonialCarousel';
import LanguageSelector from './components/LanguageSelector';
import Footer from './components/Footer';
import SplashScreen from './components/SplashScreen';
import AnimatedSection from './components/AnimatedSection';
import { useLanguage } from './contexts/LanguageContext';

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
  const [expandedEthnicity, setExpandedEthnicity] = useState<string | null>(null);
  const [showSplash, setShowSplash] = useState(true);
  const [hasShownSplash, setHasShownSplash] = useState(false);
  const [detailedCases, setDetailedCases] = useState<DetailedCaseComparison[]>([]);

  useEffect(() => {
    const splashShown = sessionStorage.getItem('splashShown');
    if (splashShown === 'true') {
      setShowSplash(false);
      setHasShownSplash(true);
    }
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

  if (showSplash && !hasShownSplash) {
    return <SplashScreen onComplete={handleSplashComplete} />;
  }

  return (
    <div className="min-h-screen bg-white">
      <nav className="sticky top-0 bg-white z-50 py-6">
        <div className="max-w-7xl mx-auto px-6 md:px-12 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xl font-light tracking-widest" style={{color: '#1F1F1F'}}>YANORA</span>
          </div>

          <button
            className="md:hidden"
            onClick={() => setShowMobileMenu(true)}
          >
            <Menu className="w-6 h-6" style={{color: '#1F1F1F'}} />
          </button>

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
              className="text-sm text-white px-6 py-2 transition"
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

      <section className="pt-8 pb-20 md:py-40 px-6 md:px-12">
        <AnimatedSection animation="fade-up" className="max-w-5xl mx-auto text-center">
          {/* 移动端 */}
          <div className="md:hidden">
            <div className="flex flex-col items-center px-4">
              {/* 主标题 */}
              <h1 className="text-4xl font-light mb-2" style={{color: '#2C3E50', letterSpacing: '-0.02em'}}>
                {t.hero.title1}
              </h1>

              {/* 副标题 */}
              <h2 className="text-3xl font-light mb-8" style={{color: '#95A5A6', letterSpacing: '-0.01em'}}>
                {t.hero.title1Part2}
              </h2>

              {/* 描述文字 */}
              <div className="max-w-md mb-6">
                <p className="text-base leading-relaxed font-light" style={{color: '#5D6D7E', letterSpacing: '0.01em'}}>
                  {t.hero.title2Mobile}
                </p>
              </div>

              {/* CTA 按钮 */}
              <button
                onClick={() => navigate('/booking')}
                className="w-full max-w-md py-3 text-white text-lg font-light shadow-lg hover:shadow-xl transition-all flex items-center justify-between px-8"
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
                <span className="text-xl">→</span>
              </button>
            </div>
          </div>

          {/* 桌面端 */}
          <div className="hidden md:block">
            <div className="space-y-6">
              {/* 主标题 */}
              <h1 className="text-8xl font-light" style={{color: '#2C3E50', letterSpacing: '-0.02em'}}>
                {t.hero.title1}
              </h1>

              {/* 副标题 */}
              <h2 className="text-7xl font-light mb-16" style={{color: '#95A5A6', letterSpacing: '-0.01em'}}>
                {t.hero.title1Part2}
              </h2>

              {/* 描述文字 */}
              <div className="max-w-3xl mx-auto mb-12 pt-8">
                <p className="text-lg leading-relaxed font-light" style={{color: '#5D6D7E', letterSpacing: '0.01em'}}>
                  {t.hero.title2}
                </p>
              </div>

              {/* CTA 按钮 */}
              <div className="max-w-4xl mx-auto">
                <button
                  onClick={() => navigate('/booking')}
                  className="w-full py-4 text-white text-2xl font-light shadow-lg hover:shadow-xl transition-all flex items-center justify-between px-12"
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
                  <div className="flex items-center gap-4">
                    <div className="w-px h-8" style={{backgroundColor: 'rgba(255,255,255,0.3)'}}></div>
                    <span className="text-3xl">→</span>
                  </div>
                </button>
              </div>
            </div>
          </div>
        </AnimatedSection>
      </section>

      {/* 桌面端服务展示 */}
      <section className="hidden md:block py-12 px-12">
        <AnimatedSection animation="scale-in" className="w-4/5 mx-auto">
          <div className="p-8 flex flex-row gap-8 rounded-3xl border-4" style={{minHeight: '320px', borderColor: '#B9CBDC'}}>
            <div className="w-3/5 grid grid-cols-2 gap-6">
              <div className="aspect-[3/4] rounded-2xl overflow-hidden" >
                <ImageCompareSlider
                  beforeImage="/24a1e5e820d6d721e7aa3970ae648b43.jpg "
                  afterImage="/68744e766a6b63d88f86d714366bcd31.jpg"
                  beforeLabel="术前"
                  afterLabel="术后"
                  initialPosition={50}
                />
              </div>
              <div className="aspect-[3/4] rounded-2xl overflow-hidden" >
                <ImageCompareSlider
                  beforeImage="/5ef6dae25777256ca4e3fafedffbbea9.jpg"
                  afterImage="/c324214cb2a62d16d00510d9652c0f60.jpg"
                  beforeLabel="术前"
                  afterLabel="术后"
                  initialPosition={50}
                />
              </div>
            </div>

            <div className="w-2/5 flex flex-col justify-center space-y-10 pl-6">
              <div className="border-l-4 pl-6" style={{borderColor: '#B9CBDC'}}>
                <h3 className="text-lg font-light leading-relaxed tracking-wide" style={{color: '#1F1F1F'}}>{t.nav.facialContour}</h3>
              </div>
              <div className="border-l-4 pl-6" style={{borderColor: '#B9CBDC'}}>
                <h3 className="text-lg font-light leading-relaxed tracking-wide" style={{color: '#1F1F1F'}}>{t.nav.bodySculpting}</h3>
              </div>
              <div className="border-l-4 pl-6" style={{borderColor: '#B9CBDC'}}>
                <h3 className="text-lg font-light leading-relaxed tracking-wide" style={{color: '#1F1F1F'}}>{t.nav.facialRejuvenation}</h3>
              </div>
            </div>
          </div>
        </AnimatedSection>
      </section>

      {/* 移动端服务展示 */}
      <section className="md:hidden py-8">
        <AnimatedSection animation="scale-in" className="w-full px-4">
          <div className="p-1 flex flex-col gap-3 rounded-2xl border-[3px]" style={{borderColor: '#B9CBDC'}}>
            <div className="flex flex-col gap-3">
              <div className="aspect-[3/4] rounded-lg overflow-hidden">
                <ImageCompareSlider
                  beforeImage="/24a1e5e820d6d721e7aa3970ae648b43.jpg"
                  afterImage="/68744e766a6b63d88f86d714366bcd31.jpg"
                  beforeLabel="术前"
                  afterLabel="术后"
                  initialPosition={50}
                />
              </div>
              <div className="aspect-[3/4] rounded-lg overflow-hidden">
                <ImageCompareSlider
                  beforeImage="/5ef6dae25777256ca4e3fafedffbbea9.jpg"
                  afterImage="/c324214cb2a62d16d00510d9652c0f60.jpg"
                  beforeLabel="术前"
                  afterLabel="术后"
                  initialPosition={50}
                />
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <div
                className="px-4 py-3 rounded-lg"
                style={{
                  backgroundColor: '#F5F8FA',
                  border: '1.5px solid #B9CBDC'
                }}
              >
                <h3 className="text-sm font-normal text-center" style={{color: '#1F1F1F'}}>{t.nav.facialContour}</h3>
              </div>
              <div
                className="px-4 py-3 rounded-lg"
                style={{
                  backgroundColor: '#F5F8FA',
                  border: '1.5px solid #B9CBDC'
                }}
              >
                <h3 className="text-sm font-normal text-center" style={{color: '#1F1F1F'}}>{t.nav.bodySculpting}</h3>
              </div>
              <div
                className="px-4 py-3 rounded-lg"
                style={{
                  backgroundColor: '#F5F8FA',
                  border: '1.5px solid #B9CBDC'
                }}
              >
                <h3 className="text-sm font-normal text-center" style={{color: '#1F1F1F'}}>{t.nav.facialRejuvenation}</h3>
              </div>
            </div>
          </div>
        </AnimatedSection>
      </section>

      <section className="py-12 md:py-24 px-6 md:px-12 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="hidden md:block">
            <AnimatedSection animation="fade-up">
              <h2 className="text-3xl font-light text-center mb-20 tracking-wide" style={{color: '#1F1F1F'}}>{t.advantages.title}</h2>
            </AnimatedSection>

            <AnimatedSection animation="fade-up" delay={200}>
              <div className="relative">
                <div className="absolute top-1/2 left-0 right-0 h-0.5" style={{backgroundColor: '#B9CBDC', transform: 'translateY(-50%)'}}></div>

                <div className="grid grid-cols-5 gap-8 relative">
                  {[
                    { num: '1', title: t.advantages.advantage1 },
                    { num: '2', title: t.advantages.advantage2 },
                    { num: '3', title: t.advantages.advantage3 },
                    { num: '4', title: t.advantages.advantage4 },
                    { num: '5', title: t.advantages.advantage5 }
                  ].map((item) => (
                    <div key={item.num} className="text-center relative">
                      <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 text-white text-xl font-light relative z-10" style={{backgroundColor: '#1C2B3A'}}>
                        {item.num}
                      </div>
                      <h3 className="text-sm font-normal tracking-wide px-2" style={{color: '#1F1F1F'}}>{item.title}</h3>
                    </div>
                  ))}
                </div>
              </div>
            </AnimatedSection>
          </div>

          <AnimatedSection animation="scale-in" className="md:hidden max-w-md mx-auto">
            <div className="rounded-3xl p-6" style={{backgroundColor: '#B9CBDC'}}>
              <div className="flex justify-center mb-4">
                <div className="w-12 h-12 rounded-full flex items-center justify-center bg-white">
                  <svg className="w-6 h-6" style={{color: '#B9CBDC'}} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              </div>

              <h2 className="text-2xl font-light text-center mb-5 text-white">{t.advantages.title}</h2>

              <div className="rounded-2xl p-4 space-y-0" style={{backgroundColor: 'rgba(255,255,255,0.2)'}}>
                {[
                  { num: '1', title: t.advantages.advantage1 },
                  { num: '2', title: t.advantages.advantage2 },
                  { num: '3', title: t.advantages.advantage3 },
                  { num: '4', title: t.advantages.advantage4 },
                  { num: '5', title: t.advantages.advantage5 }
                ].map((item, index, array) => (
                  <div key={item.num}>
                    <div className="flex items-start gap-3 py-2">
                      <div className="w-8 h-8 rounded-full flex items-center justify-center bg-white flex-shrink-0 text-sm font-light" style={{color: '#6B7280'}}>
                        {item.num}
                      </div>
                      <div className="flex-1 pt-1">
                        <h3 className="text-sm font-light text-white">{item.title}</h3>
                      </div>
                    </div>
                    {index < array.length - 1 && (
                      <div className="flex justify-center py-0">
                        <svg className="w-4 h-4 text-white opacity-40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      <section className="py-12 md:py-24 px-4 md:px-12 bg-white">
        <div className="max-w-6xl mx-auto">
          <AnimatedSection animation="fade-up" className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-light mb-4 tracking-wide" style={{color: '#1F1F1F'}}>
              {t.ethnicity.title}
            </h2>
            <p className="text-sm md:text-base leading-relaxed tracking-wide" style={{color: '#4B5563'}}>
              {t.ethnicity.subtitle}
            </p>
          </AnimatedSection>

          <div className="border-4 p-4 md:p-24 relative overflow-hidden bg-white" style={{borderColor: '#B9CBDC'}}>
            <div className="absolute top-0 right-0 w-64 h-64 opacity-5 rounded-full -mr-32 -mt-32" style={{backgroundColor: '#B9CBDC'}}></div>
            <div className="absolute bottom-0 left-0 w-48 h-48 opacity-5 rounded-full -ml-24 -mb-24" style={{backgroundColor: '#B9CBDC'}}></div>

            <div className="relative z-10">
            <div className="hidden md:grid md:grid-cols-3 gap-6 md:gap-16 mb-6 md:mb-16">
              {[
                {
                  ethnicity: t.ethnicity.black,
                  image: '/black_facial_features/1_(1).png',
                  features: {
                    bone: t.ethnicity.blackBone,
                    soft: t.ethnicity.blackSoft
                  }
                },
                {
                  ethnicity: t.ethnicity.asian,
                  image: '/east_asian_facial_features/1_(2).png',
                  features: {
                    bone: t.ethnicity.asianBone,
                    soft: t.ethnicity.asianSoft
                  }
                },
                {
                  ethnicity: t.ethnicity.white,
                  image: '/white_facial_features/3.png',
                  features: {
                    bone: t.ethnicity.whiteBone,
                    soft: t.ethnicity.whiteSoft
                  }
                }
              ].map((item) => (
                <div key={item.ethnicity} className="text-center">
                  <div className="w-full aspect-[3/4] overflow-hidden mb-4 bg-gray-100">
                    <img src={item.image} alt={`${item.ethnicity}面部特征`} className="w-full h-full object-contain" />
                  </div>
                  <button
                    onClick={() => setExpandedEthnicity(expandedEthnicity === item.ethnicity ? null : item.ethnicity)}
                    className="text-sm font-normal tracking-wide mb-3 transition-colors duration-200 hover:opacity-70"
                    style={{color: '#1F1F1F'}}
                  >
                    {item.ethnicity} {expandedEthnicity === item.ethnicity ? '▲' : '▼'}
                  </button>

                  <div
                    className="overflow-hidden transition-all duration-300 ease-in-out"
                    style={{
                      maxHeight: expandedEthnicity === item.ethnicity ? '500px' : '0',
                      opacity: expandedEthnicity === item.ethnicity ? 1 : 0
                    }}
                  >
                    <div className="text-left space-y-3 px-4 py-2">
                      <div>
                        <h4 className="text-xs font-medium mb-1" style={{color: '#1F1F1F'}}>1. {t.ethnicity.boneFeatures}</h4>
                        <p className="text-xs leading-relaxed" style={{color: '#6B7280'}}>{item.features.bone}</p>
                      </div>
                      <div>
                        <h4 className="text-xs font-medium mb-1" style={{color: '#1F1F1F'}}>2. {t.ethnicity.softTissue}</h4>
                        <p className="text-xs leading-relaxed" style={{color: '#6B7280'}}>{item.features.soft}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="md:hidden mb-6">
              <div className="space-y-4">
                {[
                  {
                    ethnicity: t.ethnicity.black,
                    image: '/black_facial_features/1_(1).png',
                    features: {
                      bone: t.ethnicity.blackBone,
                      soft: t.ethnicity.blackSoft
                    }
                  },
                  {
                    ethnicity: t.ethnicity.asian,
                    image: '/east_asian_facial_features/1_(2).png',
                    features: {
                      bone: t.ethnicity.asianBone,
                      soft: t.ethnicity.asianSoft
                    }
                  },
                  {
                    ethnicity: t.ethnicity.white,
                    image: '/white_facial_features/3.png',
                    features: {
                      bone: t.ethnicity.whiteBone,
                      soft: t.ethnicity.whiteSoft
                    }
                  }
                ].map((item) => (
                  <div key={item.ethnicity} className="bg-white p-3 rounded-lg border border-gray-200">
                    <div className="flex gap-3 mb-2">
                      <div className="w-20 aspect-[3/4] overflow-hidden bg-gray-100 flex-shrink-0">
                        <img src={item.image} alt={`${item.ethnicity}面部特征`} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1">
                        <button
                          onClick={() => setExpandedEthnicity(expandedEthnicity === item.ethnicity ? null : item.ethnicity)}
                          className="text-sm font-normal tracking-wide transition-colors duration-200 hover:opacity-70 flex items-center justify-between w-full"
                          style={{color: '#1F1F1F'}}
                        >
                          <span>{item.ethnicity}</span>
                          <span className="text-xs">{expandedEthnicity === item.ethnicity ? '▲' : '▼'}</span>
                        </button>
                      </div>
                    </div>

                    <div
                      className="overflow-hidden transition-all duration-300 ease-in-out"
                      style={{
                        maxHeight: expandedEthnicity === item.ethnicity ? '500px' : '0',
                        opacity: expandedEthnicity === item.ethnicity ? 1 : 0
                      }}
                    >
                      <div className="text-left space-y-2 pt-2 border-t border-gray-100">
                        <div>
                          <h4 className="text-xs font-medium mb-1" style={{color: '#1F1F1F'}}>1. {t.ethnicity.boneFeatures}</h4>
                          <p className="text-xs leading-relaxed" style={{color: '#6B7280'}}>{item.features.bone}</p>
                        </div>
                        <div>
                          <h4 className="text-xs font-medium mb-1" style={{color: '#1F1F1F'}}>2. {t.ethnicity.softTissue}</h4>
                          <p className="text-xs leading-relaxed" style={{color: '#6B7280'}}>{item.features.soft}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <p className="text-center text-sm tracking-wide mt-8" style={{color: '#6B7280'}}>
              {t.ethnicity.cta}
            </p>
            </div>
          </div>
        </div>
      </section>

      <section className="w-full relative bg-white">
        <div className="max-w-7xl mx-auto py-12 md:py-20 px-4">
          <div className="text-center mb-8 md:mb-16">
            <h2 className="text-xl md:text-2xl font-light mb-3 tracking-wide" style={{color: '#1F2937'}}>
              {t.analysis.title}
            </h2>
            <p className="text-sm md:text-base font-light tracking-wide" style={{color: '#6B7280'}}>
              {t.analysis.subtitle}
            </p>
          </div>
        </div>

        {/* Desktop Layout - Keep Original */}
        <div className="hidden md:block w-full relative bg-white">
          <img
            src="/56315efc544d966bb744e9a52c7de1f4.png"
            alt="Professional portrait"
            className="w-full h-auto object-cover"
          />

          <div className="absolute inset-0 pointer-events-none">
            <div className="max-w-7xl mx-auto h-full relative px-4">
              <img
                src="/Gemini_Generated_Image_lv6nndlv6nndlv6n.png"
                alt="Analysis 1"
                className="absolute left-8 top-[15%] w-48 md:w-64 h-auto rounded-lg shadow-2xl float-left-1"
              />
              <img
                src="/Gemini_Generated_Image_pf7kappf7kappf7k.png"
                alt="Analysis 2"
                className="absolute left-12 bottom-[20%] w-48 md:w-64 h-auto rounded-lg shadow-2xl float-left-2"
              />
              <img
                src="/Gemini_Generated_Image_a16ssqa16ssqa16s.png"
                alt="Analysis 3"
                className="absolute right-8 top-[20%] w-48 md:w-64 h-auto rounded-lg shadow-2xl float-right-1"
              />
              <img
                src="/Gemini_Generated_Image_fv9uk0fv9uk0fv9u.png"
                alt="Analysis 4"
                className="absolute right-12 bottom-[15%] w-48 md:w-64 h-auto rounded-lg shadow-2xl float-right-2"
              />
            </div>
          </div>
        </div>

        {/* Mobile Layout - New Design */}
        <div className="md:hidden w-full">
          <div className="px-4">
            <img
              src="/fb607f9eb3218f6c04e8d1dbaa76f126.jpg"
              alt="Professional portrait"
              className="w-full h-auto object-cover rounded-lg mb-6"
            />

            <div className="rounded-2xl p-4 mb-6 flex items-center gap-4" style={{backgroundColor: '#F5F8FA'}}>
              <div className="flex-shrink-0 w-24">
                <img
                  src="/ecd4dea6a9aeb8932f049b884f734919.jpg"
                  alt={t.facialAnalysis.foreheadTitle}
                  className="w-full h-auto object-cover rounded-lg"
                />
              </div>
              <div className="flex-1">
                <p className={`leading-relaxed ${language === 'en' ? 'text-[0.6875rem]' : 'text-xs'}`} style={{color: '#6B7280'}}>
                  {t.facialAnalysis.foreheadDesc}
                </p>
              </div>
            </div>

            <div className="rounded-2xl p-4 mb-6 flex items-center gap-4" style={{backgroundColor: '#F5F8FA'}}>
              <div className="flex-shrink-0 w-24">
                <img
                  src="/0b9a6dc4116a99bdcba731e6384301b3.jpg"
                  alt={t.facialAnalysis.outerContourTitle}
                  className="w-full h-auto object-cover rounded-lg"
                />
              </div>
              <div className="flex-1">
                <p className={`leading-relaxed ${language === 'en' ? 'text-[0.6875rem]' : 'text-xs'}`} style={{color: '#6B7280'}}>
                  {t.facialAnalysis.outerContourDesc}
                </p>
              </div>
            </div>

            <div className="rounded-2xl p-4 mb-6 flex items-center gap-4" style={{backgroundColor: '#F5F8FA'}}>
              <div className="flex-shrink-0 w-24">
                <img
                  src="/e9d22fcf270788298cf5cc46aa47e5e6.jpg"
                  alt={t.facialAnalysis.innerContourTitle}
                  className="w-full h-auto object-cover rounded-lg"
                />
              </div>
              <div className="flex-1">
                <p className={`leading-relaxed ${language === 'en' ? 'text-[0.6875rem]' : 'text-xs'}`} style={{color: '#6B7280'}}>
                  {t.facialAnalysis.innerContourDesc}
                </p>
              </div>
            </div>

           
          </div>
        </div>

      </section>

      <section className="py-12 md:py-24 px-4 md:px-8" style={{backgroundColor: '#F9FAFB'}}>
        <div className="max-w-7xl mx-auto rounded-3xl p-6 md:p-8" style={{backgroundColor: '#FFFFFF'}}>
          <AnimatedSection animation="fade-up">
            <h2 className="text-2xl md:text-3xl font-light text-center mb-3 tracking-wide" style={{color: '#1F1F1F'}}>
              {t.facialFold.title}
            </h2>
            <p className="text-sm md:text-base text-center mb-8 md:mb-12 tracking-wide" style={{color: '#6B7280'}}>
              {t.facialFold.subtitle}
            </p>
          </AnimatedSection>

          <div className="grid grid-cols-2 gap-4 md:gap-8">
            <AnimatedSection animation="fade-left" delay={100} className="space-y-3 md:space-y-4">
              <h3 className="text-sm md:text-lg font-medium text-center" style={{color: '#1F1F1F'}}>{t.facialFold.lowFold}</h3>
              <div className="rounded-2xl overflow-hidden" style={{backgroundColor: '#F5F8FA'}}>
                <img
                  src="/c902ff4b95da45684c7afeaa83488729.jpg"
                  alt={t.facialFold.youngState}
                  className="w-full h-auto object-cover"
                />
              </div>
              <div className="rounded-2xl overflow-hidden flex items-center justify-center p-4 md:p-6" style={{backgroundColor: '#F5F8FA'}}>
                <img
                  src="/Gemini_Generated_Image_ig76luig76luig76.png"
                  alt={t.facialFold.diagram3d}
                  className="w-auto h-20 md:h-40 object-contain"
                />
              </div>
            </AnimatedSection>
            <AnimatedSection animation="fade-right" delay={100} className="space-y-3 md:space-y-4">
              <h3 className="text-sm md:text-lg font-medium text-center" style={{color: '#1F1F1F'}}>{t.facialFold.highFold}</h3>
              <div className="rounded-2xl overflow-hidden" style={{backgroundColor: '#F5F8FA'}}>
                <img
                  src="/6ddd0ec9ec91d3e5b3bc59d068c2a2b5.jpg"
                  alt={t.facialFold.youngState}
                  className="w-full h-auto object-cover"
                />
              </div>
              <div className="rounded-2xl overflow-hidden flex items-center justify-center p-4 md:p-6" style={{backgroundColor: '#F5F8FA'}}>
                <img
                  src="/Gemini_Generated_Image_x86obtx86obtx86o.png"
                  alt={t.facialFold.diagram3d}
                  className="w-auto h-20 md:h-40 object-contain"
                />
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* ========================================
          手术计划展示区块
          Section: 获取你的手术计划
          功能：展示手术前后对比照片及手术步骤流程
          布局：移动端和桌面端采用不同布局
      ========================================== */}
      <section className="py-8 md:py-24 px-6 md:px-12 bg-white">
        <div className="max-w-6xl mx-auto">
          {/* 标题和副标题 */}
          <AnimatedSection animation="fade-up">
            <h2 className="text-2xl md:text-3xl font-light text-center mb-3 tracking-wide" style={{color: '#1F1F1F'}}>{t.plan.title}</h2>
            <p className="text-sm text-center mb-8 md:mb-16 tracking-wide" style={{color: '#6B7280'}}>
              {t.plan.subtitle}
            </p>
          </AnimatedSection>

          {/* ========================================
              移动端布局 - 紧凑版设计
              特点：上下排列，先展示术前术后照片，再展示步骤列表
          ========================================== */}
          <div className="md:hidden">
            <div className="flex flex-col gap-6 mb-8">
              {/* 术前术后照片对比区 - 横向排列 */}
              <div className="flex justify-center gap-6">
                {/* 术前照片 */}
                <div className="overflow-hidden relative w-40 rounded-2xl" style={{backgroundColor: '#F3F4F6'}}>
                  <img
                    src="/540f310b1f9b5244da98c950465274f4.png"
                    alt={t.plan.before}
                    className="h-56 w-full object-cover"
                  />
                  {/* BEFORE标签 */}
                  <div className="absolute bottom-2 left-2 bg-white px-2 py-0.5 rounded">
                    <span className="text-xs text-gray-600">{t.plan.beforeLabel}</span>
                  </div>
                </div>

                {/* 术后照片 */}
                <div className="overflow-hidden relative w-40 rounded-2xl" style={{backgroundColor: '#F3F4F6'}}>
                  <img
                    src="/7f2a85b5a678c2f472ee7c56c64a6039.png"
                    alt={t.plan.after}
                    className="h-56 w-full object-cover"
                  />
                  {/* AFTER标签 */}
                  <div className="absolute bottom-2 left-2 bg-white px-2 py-0.5 rounded">
                    <span className="text-xs text-gray-600">{t.plan.afterLabel}</span>
                  </div>
                </div>
              </div>

              {/* 手术步骤列表 - 纵向排列 */}
              <div className="max-w-md mx-auto rounded-3xl p-6" style={{
                backgroundColor: '#F5F8FA'
              }}>
                {[
                  { num: '01', title: t.plan.step1 }, // 获取专家面部分析
                  { num: '02', title: t.plan.step2 }, // 你最美的样子
                  { num: '03', title: t.plan.step3 }, // 获取你的专属焕颜方案
                  { num: '04', title: t.plan.step4 }  // 见证显著效果
                ].map((item, index, array) => (
                  <div key={item.num}>
                    {/* 步骤卡片 - 长条边框 */}
                    <div
                      className="rounded-2xl px-6 py-3"
                      style={{
                        border: '1px solid #E5E7EB',
                        backgroundColor: '#FFFFFF'
                      }}
                    >
                      {/* 步骤编号 */}
                      <div className="text-center mb-1">
                        <span className="text-base font-light tracking-wider" style={{color: '#A0A7B5'}}>
                          {item.num} /
                        </span>
                      </div>
                      {/* 步骤标题 */}
                      <h3 className="text-base font-normal text-center leading-snug" style={{color: '#1F1F1F'}}>
                        {item.title}
                      </h3>
                    </div>

                    {/* 箭头分隔符 - 不在最后一个步骤显示 */}
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
            </div>
          </div>

          {/* ========================================
              桌面端布局 - 精美设计
              特点：上下两层布局
              上层：术前术后照片横向排列，带有装饰性边框
              下层：4个步骤横向一行排列
          ========================================== */}
          <div className="hidden md:flex md:flex-col md:items-center">
            {/* 术前术后照片区 - 带有SVG装饰边框 */}
            <div className="relative flex gap-32 flex-shrink-0 mb-12">
              {/* SVG装饰边框 - 在两张照片周围绘制矩形边框 */}
              <svg className="absolute inset-0 w-full h-full" style={{ overflow: 'visible' }}>
                <path
                  d="M 20,20 L 420,20 L 420,524 L 20,524 L 20,20 M 548,20 L 948,20 L 948,524 L 548,524 L 548,20"
                  fill="none"
                  stroke="#D1D5DB"
                  strokeWidth="2"
                />
              </svg>

              {/* 术前照片容器 */}
              <div className="overflow-hidden relative rounded-2xl" style={{width: '400px', backgroundColor: '#F3F4F6'}}>
                <img
                  src="/540f310b1f9b5244da98c950465274f4.png"
                  alt={t.plan.before}
                  className="w-full object-cover"
                  style={{height: '500px'}}
                />
                {/* BEFORE标签 - 左下角 */}
                <div className="absolute bottom-4 left-4 bg-white px-3 py-1.5 shadow rounded">
                  <span className="text-xs font-medium text-gray-700">{t.plan.beforeLabel}</span>
                </div>
              </div>

              {/* 术后照片容器 */}
              <div className="overflow-hidden relative rounded-2xl" style={{width: '400px', backgroundColor: '#F3F4F6'}}>
                <img
                  src="/7f2a85b5a678c2f472ee7c56c64a6039.png"
                  alt={t.plan.after}
                  className="w-full object-cover"
                  style={{height: '500px'}}
                />
                {/* AFTER标签 - 左下角 */}
                <div className="absolute bottom-4 left-4 bg-white px-3 py-1.5 shadow rounded">
                  <span className="text-xs font-medium text-gray-700">{t.plan.afterLabel}</span>
                </div>
              </div>
            </div>

            {/* 手术步骤区 - 单行横向排列，背景为白色 */}
            <div className="flex gap-16 justify-center bg-white rounded-2xl px-12 py-8">
              {[
                { num: '01', title: t.plan.step1 }, // 获取专家面部分析
                { num: '02', title: t.plan.step2 }, // 你最美的样子
                { num: '03', title: t.plan.step3 }, // 获取你的专属焕颜方案
                { num: '04', title: t.plan.step4 }  // 见证显著效果
              ].map((item) => (
                <div key={item.num} className="flex flex-col items-center text-center">
                  {/* 步骤编号 - 大号灰色数字 */}
                  <div className="text-4xl font-extralight mb-2" style={{color: '#D1D5DB'}}>{item.num} /</div>
                  {/* 步骤标题 */}
                  <h3 className="text-base font-normal leading-snug" style={{color: '#1F1F1F'}}>{item.title}</h3>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Combined Section - Advantages and Common Concerns */}
      <section className="py-12 md:py-20 px-4 md:px-8" style={{backgroundColor: '#F9FAFB'}}>
        <div className="max-w-6xl mx-auto">
          <AnimatedSection animation="fade-up">
            <h2 className="text-2xl md:text-3xl font-light text-center mb-4 tracking-wide" style={{color: '#1F1F1F'}}>
              {t.concerns.title}
            </h2>
            <div className="w-16 h-px mx-auto mb-12 md:mb-16" style={{backgroundColor: '#B9CBDC'}}></div>
          </AnimatedSection>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
            {/* Issue 1 */}
            <AnimatedSection animation="fade-up" delay={100}>
              <div
                className="group relative overflow-hidden rounded-2xl transition-all duration-500 hover:shadow-2xl"
                style={{backgroundColor: '#F5F8FA'}}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-4px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                <div className="p-4 md:p-5">
                  <div className="flex items-start gap-3">
                    <div
                      className="flex-shrink-0 w-9 h-9 rounded-full flex items-center justify-center text-white text-sm font-light transition-all duration-300 group-hover:scale-110"
                      style={{backgroundColor: '#1C2B3A'}}
                    >
                      01
                    </div>
                    <div className="flex-1">
                      <h3 className="text-base md:text-lg font-normal mb-1.5 tracking-wide" style={{color: '#1F1F1F'}}>
                        {t.concerns.issue1Title}
                      </h3>
                      <p className="text-xs md:text-sm leading-relaxed" style={{color: '#6B7280'}}>
                        {t.concerns.issue1Desc}
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

            {/* Issue 2 */}
            <AnimatedSection animation="fade-up" delay={200}>
              <div
                className="group relative overflow-hidden rounded-2xl transition-all duration-500 hover:shadow-2xl"
                style={{backgroundColor: '#F5F8FA'}}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-4px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                <div className="p-4 md:p-5">
                  <div className="flex items-start gap-3">
                    <div
                      className="flex-shrink-0 w-9 h-9 rounded-full flex items-center justify-center text-white text-sm font-light transition-all duration-300 group-hover:scale-110"
                      style={{backgroundColor: '#1C2B3A'}}
                    >
                      02
                    </div>
                    <div className="flex-1">
                      <h3 className="text-base md:text-lg font-normal mb-1.5 tracking-wide" style={{color: '#1F1F1F'}}>
                        {t.concerns.issue2Title}
                      </h3>
                      <p className="text-xs md:text-sm leading-relaxed" style={{color: '#6B7280'}}>
                        {t.concerns.issue2Desc}
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

            {/* Issue 3 */}
            <AnimatedSection animation="fade-up" delay={300}>
              <div
                className="group relative overflow-hidden rounded-2xl transition-all duration-500 hover:shadow-2xl"
                style={{backgroundColor: '#F5F8FA'}}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-4px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                <div className="p-4 md:p-5">
                  <div className="flex items-start gap-3">
                    <div
                      className="flex-shrink-0 w-9 h-9 rounded-full flex items-center justify-center text-white text-sm font-light transition-all duration-300 group-hover:scale-110"
                      style={{backgroundColor: '#1C2B3A'}}
                    >
                      03
                    </div>
                    <div className="flex-1">
                      <h3 className="text-base md:text-lg font-normal mb-1.5 tracking-wide" style={{color: '#1F1F1F'}}>
                        {t.concerns.issue3Title}
                      </h3>
                      <p className="text-xs md:text-sm leading-relaxed" style={{color: '#6B7280'}}>
                        {t.concerns.issue3Desc}
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

            {/* Issue 4 */}
            <AnimatedSection animation="fade-up" delay={400}>
              <div
                className="group relative overflow-hidden rounded-2xl transition-all duration-500 hover:shadow-2xl"
                style={{backgroundColor: '#F5F8FA'}}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-4px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                <div className="p-4 md:p-5">
                  <div className="flex items-start gap-3">
                    <div
                      className="flex-shrink-0 w-9 h-9 rounded-full flex items-center justify-center text-white text-sm font-light transition-all duration-300 group-hover:scale-110"
                      style={{backgroundColor: '#1C2B3A'}}
                    >
                      04
                    </div>
                    <div className="flex-1">
                      <h3 className="text-base md:text-lg font-normal mb-1.5 tracking-wide" style={{color: '#1F1F1F'}}>
                        {t.concerns.issue4Title}
                      </h3>
                      <p className="text-xs md:text-sm leading-relaxed" style={{color: '#6B7280'}}>
                        {t.concerns.issue4Desc}
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
          </div>

        </div>
      </section>

      <section className="py-8 md:py-24 px-3 md:px-12 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl md:text-4xl font-light text-center mb-6 md:mb-8" style={{color: '#1F2937'}}>
            {detailedCases.length > 0 ? (language === 'zh' ? detailedCases[0].title_zh : detailedCases[0].title_en) : t.realCases.title}
          </h2>

          {detailedCases.length > 0 ? (
            <>
              {/* Desktop layout - cases side by side */}
              <div className="hidden md:grid md:grid-cols-2 gap-8 lg:gap-12">
                {detailedCases.map((caseItem) => (
                  <div key={caseItem.id} className="bg-white overflow-hidden" style={{border: '2px solid #E5E7EB'}}>
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

      <section className="py-12 md:py-24 relative overflow-hidden bg-white">
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
                  <img src="/Gemini_Generated_Image_bo54dwbo54dwbo54.png" alt="全球客户分布地图" className="w-full h-full object-cover" />
                </div>
              </div>
            </div>
          </div>

          {/* Mobile map - responsive */}
          <div className="md:hidden px-4 mb-8 bg-white">
            <div className="w-full overflow-hidden bg-white">
              <img src="/Gemini_Generated_Image_bo54dwbo54dwbo54.png" alt="全球客户分布地图" className="w-full h-auto object-contain bg-white" />
            </div>
          </div>

          {/* Desktop and Mobile testimonials - unified carousel */}
          <div className="w-full">
            <MobileTestimonialCarousel />
          </div>
        </div>
      </section>

      <section className="py-12 md:py-24 px-4 md:px-12 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="p-8 md:p-16 relative overflow-hidden" style={{backgroundColor: '#1C2B3A'}}>
            <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full -mr-32 -mt-32"></div>
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-white opacity-5 rounded-full -ml-24 -mb-24"></div>

            <div className="relative">
              <h2 className="text-2xl md:text-3xl font-light text-white mb-8 md:mb-12 tracking-wide">{t.journey.title}</h2>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8 mb-8 md:mb-12">
                {[
                  t.journey.step1,
                  t.journey.step2,
                  t.journey.step3,
                  t.journey.step4
                ].map((step, index) => (
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
                  {t.journey.cta}
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}

export default App;
