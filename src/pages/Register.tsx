import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Package, Mail, Lock, User, Eye, EyeOff, Star, Shield, Zap } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../App';

function FloatingOrb({ className, delay = '0s', size = 'w-64 h-64' }: { className: string; delay?: string; size?: string }) {
  return (
    <div className={`absolute rounded-full blur-3xl opacity-20 animate-float ${size} ${className}`}
      style={{ animationDelay: delay, animationDuration: '8s' }} />
  );
}

export default function Register() {
  const navigate = useNavigate();
  const { register, user } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  if (user) {
    navigate('/');
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !password) {
      toast.error('Please fill in all fields');
      return;
    }
    if (password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }
    setLoading(true);
    try {
      await register(name, email, password);
      toast.success('Account created successfully!');
      navigate('/');
    } catch (err: any) {
      toast.error(err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex relative overflow-hidden bg-slate-50 dark:bg-slate-950">
      {/* Background Orbs */}
      <FloatingOrb className="bg-accent-500 top-20 -left-20" />
      <FloatingOrb className="bg-slate-400 bottom-20 -right-20" delay="2s" size="w-96 h-96" />
      <FloatingOrb className="bg-amber-500 top-1/2 left-2/3" delay="4s" size="w-48 h-48" />

      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiMwMDAiIGZpbGwtb3BhY2l0eT0iMC4wMyI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMiIvPjwvZz48L2c+PC9zdmc+')]" />
      <div className="dark:hidden absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wMyI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMiIvPjwvZz48L2c+PC9zdmc+')]" />

      <div className="relative w-full flex">
        {/* Left Brand Panel - Desktop */}
        <div className="hidden lg:flex w-1/2 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 dark:from-black dark:via-slate-950 dark:to-black items-center justify-center p-12 relative overflow-hidden">
          <div className="absolute inset-0">
            <div className="absolute top-10 left-10 w-72 h-72 bg-accent-500/10 rounded-full blur-3xl animate-float-slow" />
            <div className="absolute bottom-20 right-20 w-80 h-80 bg-white/5 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }} />
            <div className="absolute top-1/2 left-1/3 w-48 h-48 bg-amber-500/10 rounded-full blur-3xl animate-pulse-glow" />
          </div>

          <div className="relative text-center max-w-md">
            <div className="flex justify-center mb-8">
              <div className="h-20 w-20 rounded-2xl bg-white/10 backdrop-blur-sm flex items-center justify-center border border-white/20 shadow-2xl group hover:scale-110 transition-transform duration-500">
                <Package className="h-10 w-10 text-accent-400 transition-transform duration-300 group-hover:rotate-[-10deg]" />
              </div>
            </div>
            <h1 className="text-4xl font-bold text-white mb-4">Join ShopPro</h1>
            <p className="text-white/60 text-lg leading-relaxed">
              Create your account and unlock a world of premium products, exclusive deals, and seamless shopping.
            </p>
            <div className="mt-10 space-y-4">
              {[
                { icon: Zap, text: 'Fast & secure checkout' },
                { icon: Shield, text: 'Your data is protected' },
                { icon: Star, text: 'Premium shopping experience' },
              ].map(({ icon: Icon, text }) => (
                <div key={text} className="flex items-center space-x-3 text-white/70">
                  <div className="h-8 w-8 rounded-lg bg-white/10 flex items-center justify-center">
                    <Icon className="h-4 w-4 text-accent-400" />
                  </div>
                  <span className="text-sm">{text}</span>
                </div>
              ))}
            </div>
            <div className="mt-12 pt-8 border-t border-white/10">
              <p className="text-white/40 text-sm">Already have an account?</p>
              <Link to="/login" className="inline-flex items-center mt-2 text-accent-400 hover:text-accent-300 font-medium transition-colors">
                Sign In
              </Link>
            </div>
          </div>
        </div>

        {/* Right Form Panel */}
        <div className="w-full lg:w-1/2 flex items-center justify-center p-4 sm:p-8 lg:p-12">
          <div className="w-full max-w-md">
            {/* Mobile Logo */}
            <div className="lg:hidden text-center mb-8">
              <div className="h-14 w-14 rounded-2xl bg-slate-900 dark:bg-white flex items-center justify-center mx-auto mb-4 shadow-xl">
                <Package className="h-7 w-7 text-white dark:text-slate-900" />
              </div>
              <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Create Account</h1>
              <p className="text-slate-500 dark:text-slate-400 mt-1">Join us and start shopping</p>
            </div>

            <div className="bg-white dark:bg-slate-800/80 backdrop-blur-xl rounded-3xl border border-slate-200 dark:border-slate-700/50 p-8 shadow-2xl shadow-slate-200/50 dark:shadow-black/20">
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-1">
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Full Name</label>
                  <div className="relative group">
                    <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-accent-500/20 to-amber-500/20 opacity-0 group-focus-within:opacity-100 transition-opacity blur-xl" />
                    <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-accent-500 transition-colors z-10" />
                    <input type="text" value={name} onChange={(e) => setName(e.target.value)}
                      className="relative w-full pl-10 pr-4 py-3 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-sm focus:ring-2 focus:ring-accent-500 focus:border-accent-500 outline-none transition-all placeholder:text-slate-400"
                      placeholder="John Doe" />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Email</label>
                  <div className="relative group">
                    <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-accent-500/20 to-amber-500/20 opacity-0 group-focus-within:opacity-100 transition-opacity blur-xl" />
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-accent-500 transition-colors z-10" />
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                      className="relative w-full pl-10 pr-4 py-3 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-sm focus:ring-2 focus:ring-accent-500 focus:border-accent-500 outline-none transition-all placeholder:text-slate-400"
                      placeholder="you@example.com" />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Password</label>
                  <div className="relative group">
                    <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-accent-500/20 to-amber-500/20 opacity-0 group-focus-within:opacity-100 transition-opacity blur-xl" />
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-accent-500 transition-colors z-10" />
                    <input type={showPassword ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)}
                      className="relative w-full pl-10 pr-10 py-3 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-sm focus:ring-2 focus:ring-accent-500 focus:border-accent-500 outline-none transition-all placeholder:text-slate-400"
                      placeholder="••••••••" />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors z-10">
                      {showPassword ? <EyeOff className="h-4 w-4 text-slate-400" /> : <Eye className="h-4 w-4 text-slate-400" />}
                    </button>
                  </div>
                </div>

                <button type="submit" disabled={loading}
                  className="relative w-full py-3 bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-semibold rounded-xl hover:bg-slate-800 dark:hover:bg-slate-100 disabled:opacity-50 transition-all duration-200 shadow-lg active:scale-[0.98] overflow-hidden group">
                  <span className="absolute inset-0 bg-gradient-to-r from-accent-500/20 to-amber-500/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                  <span className="relative">{loading ? 'Creating Account...' : 'Create Account'}</span>
                </button>
              </form>

              <div className="mt-6">
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-slate-200 dark:border-slate-700" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-white dark:bg-slate-800 px-3 text-slate-500">or continue with</span>
                  </div>
                </div>

                <div className="mt-4 grid grid-cols-2 gap-3">
                  {['Google', 'GitHub'].map((provider) => (
                    <button key={provider} type="button"
                      className="flex items-center justify-center px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors text-sm font-medium text-slate-700 dark:text-slate-300">
                      {provider}
                    </button>
                  ))}
                </div>
              </div>

              <div className="mt-6 text-center lg:hidden">
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Already have an account?{' '}
                  <Link to="/login" className="text-slate-900 dark:text-white hover:text-accent-500 dark:hover:text-accent-400 font-medium transition-colors">Sign in</Link>
                </p>
              </div>

              <p className="mt-4 text-xs text-slate-400 text-center">
                By signing up, you agree to our{' '}
                <a href="#" className="underline hover:text-slate-600 dark:hover:text-slate-300">Terms</a> and{' '}
                <a href="#" className="underline hover:text-slate-600 dark:hover:text-slate-300">Privacy Policy</a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
