import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';
import Navbar from './Navbar';
import Footer from './Footer';
import { useLanguage } from '../contexts/LanguageContext';

function LoginPage() {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        if (error.message.includes('Invalid login credentials')) {
          setError('登录失败：邮箱或密码错误，如果您还没有注册，请先注册账号');
        } else if (error.message.includes('Email not confirmed')) {
          setError('请先确认您的邮箱地址');
        } else {
          setError(error.message || t.loginPage.errorDefault);
        }
        throw error;
      }

      if (data.user) {
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('id')
          .eq('id', data.user.id)
          .maybeSingle();

        if (profileError) {
          console.error('Profile check error:', profileError);
        }

        if (!profile) {
          await supabase.auth.signOut();
          setError('账户数据异常，请联系客服或重新注册');
          return;
        }

        navigate('/');
      }
    } catch (err: any) {
      console.error('Login error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <div className="flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-light tracking-widest mb-3" style={{color: '#1F1F1F'}}>
            YANORA
          </h1>
          <p className="text-sm tracking-wide" style={{color: '#6B7280'}}>
            {t.loginPage.title}
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          {error && (
            <div className="p-4 text-sm border" style={{backgroundColor: '#FEF2F2', borderColor: '#FEE2E2', color: '#DC2626'}}>
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-normal mb-3 tracking-wide" style={{color: '#1F1F1F'}}>
              {t.loginPage.email}
            </label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5" style={{color: '#9CA3AF'}} />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full pl-12 pr-5 py-4 border text-sm tracking-wide transition focus:outline-none focus:border-gray-900"
                style={{borderColor: '#D1D5DB', color: '#1F1F1F'}}
                placeholder={t.loginPage.emailPlaceholder}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-normal mb-3 tracking-wide" style={{color: '#1F1F1F'}}>
              {t.loginPage.password}
            </label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5" style={{color: '#9CA3AF'}} />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full pl-12 pr-12 py-4 border text-sm tracking-wide transition focus:outline-none focus:border-gray-900"
                style={{borderColor: '#D1D5DB', color: '#1F1F1F'}}
                placeholder={t.loginPage.passwordPlaceholder}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 transform -translate-y-1/2"
              >
                {showPassword ? (
                  <EyeOff className="w-5 h-5" style={{color: '#9CA3AF'}} />
                ) : (
                  <Eye className="w-5 h-5" style={{color: '#9CA3AF'}} />
                )}
              </button>
            </div>
          </div>

          <div className="pt-4">
            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 text-white text-sm font-light transition tracking-wider disabled:opacity-50"
              style={{backgroundColor: '#1C2B3A'}}
              onMouseEnter={(e) => !loading && (e.currentTarget.style.backgroundColor = '#101D29')}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#1C2B3A'}
            >
              {loading ? t.loginPage.loginButtonLoading : t.loginPage.loginButton}
            </button>
          </div>
        </form>

        <div className="mt-8 text-center space-y-4">
          <p className="text-sm tracking-wide" style={{color: '#6B7280'}}>
            {t.loginPage.noAccount}{' '}
            <Link to="/register" className="transition" style={{color: '#1F1F1F'}} onMouseEnter={(e) => e.currentTarget.style.textDecoration = 'underline'} onMouseLeave={(e) => e.currentTarget.style.textDecoration = 'none'}>
              {t.loginPage.signUp}
            </Link>
          </p>
          <Link to="/" className="block text-sm transition tracking-wide" style={{color: '#6B7280'}}>
            {t.loginPage.backToHome}
          </Link>
        </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default LoginPage;
