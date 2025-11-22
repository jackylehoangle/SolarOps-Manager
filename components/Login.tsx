import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Zap, Lock, User } from 'lucide-react';

const Login: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState(''); // Mock password
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      // For demo: password is just '123' or empty
      const success = await login(username);
      if (success) {
        navigate('/');
      } else {
        setError('Tên đăng nhập không đúng.');
      }
    } catch (err) {
      setError('Đã xảy ra lỗi đăng nhập');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden">
        <div className="bg-emerald-600 p-8 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-emerald-500 rounded-full mb-4 shadow-inner text-white">
            <Zap size={32} />
          </div>
          <h1 className="text-2xl font-bold text-white">SolarOps Manager</h1>
          <p className="text-emerald-100 mt-2">Hệ thống quản trị doanh nghiệp Solar</p>
        </div>
        
        <div className="p-8">
          <form onSubmit={handleLogin} className="space-y-6">
            {error && (
              <div className="bg-red-50 text-red-600 text-sm p-3 rounded-lg border border-red-100">
                {error}
              </div>
            )}
            
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Tên đăng nhập</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={20} />
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all"
                  placeholder="Nhập tài khoản..."
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Mật khẩu</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={20} />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all"
                  placeholder="Mật khẩu bất kỳ"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 rounded-xl transition-colors shadow-lg shadow-emerald-200 disabled:opacity-70"
            >
              {isSubmitting ? 'Đang xử lý...' : 'Đăng nhập hệ thống'}
            </button>

            <div className="mt-6 text-xs text-slate-500 bg-slate-50 p-4 rounded-lg border border-slate-100">
              <p className="font-semibold mb-2 text-slate-700">Tài khoản Demo:</p>
              <div className="grid grid-cols-2 gap-2">
                 <div className="col-span-2 bg-emerald-50 p-1 rounded border border-emerald-100 text-center mb-1">
                    <span className="font-bold text-emerald-700">admin</span> <span className="text-emerald-600">- Full quyền Test</span>
                 </div>
                 <div>
                    <span className="font-bold">ceo</span> <br/> (Giám đốc)
                 </div>
                 <div>
                    <span className="font-bold">sales_manager</span> <br/> (TP Kinh doanh)
                 </div>
                 <div>
                    <span className="font-bold">sales_staff_1</span> <br/> (NV Sale)
                 </div>
                 <div>
                    <span className="font-bold">accountant</span> <br/> (Kế toán)
                 </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;