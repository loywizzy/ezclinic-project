import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: call API, handle auth...
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-gray-100">
      {/* Mobile Logo */}
      <div className="md:hidden w-full bg-blue-500 text-white flex items-center justify-center py-6">
        <h2 className="text-5xl font-bold">LOGO</h2>
      </div>

      {/* Form */}
      <div className="flex flex-col justify-center items-center w-full md:w-1/2 p-8">
        <div className="w-full max-w-md bg-white rounded-xl shadow-md p-8">
          <h1 className="text-3xl font-bold text-blue-600 mb-4 text-center">
            ยินดีต้อนรับ
          </h1>
          <p className="mb-6 text-gray-500 text-center">
            กรอกอีเมลและรหัสผ่านเพื่อเข้าสู่ระบบ
          </p>
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="email"
              placeholder="example@gmail.com"
              className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-300 focus:outline-none"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="รหัสผ่าน"
              className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-300 focus:outline-none"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <div className="flex items-center">
              <input
                id="showPassword"
                type="checkbox"
                checked={showPassword}
                onChange={() => setShowPassword(!showPassword)}
                className="mr-2"
              />
              <label htmlFor="showPassword" className="text-gray-600">
                ดูรหัสผ่าน
              </label>
            </div>
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white py-3 rounded-lg hover:scale-105 transition-transform shadow-md font-semibold"
            >
              เข้าสู่ระบบ
            </button>
          </form>
          <p className="text-xs text-gray-400 mt-6 text-center">version 1.0.0</p>
          <p className="text-xs text-gray-300 text-center">
            © 2025, Made with SmartCarePro
          </p>
        </div>
      </div>

      {/* Desktop Logo */}
      <div className="hidden md:flex w-1/2 bg-blue-500 text-white items-center justify-center">
        <h2 className="text-5xl font-bold">LOGO</h2>
      </div>
    </div>
  );
}
