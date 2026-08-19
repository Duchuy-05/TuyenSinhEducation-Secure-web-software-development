import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // States xử lý logic
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  const handleChange = (e : React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMessage('');

    // 1. Validate Mật khẩu (Tối thiểu 6 ký tự, 1 chữ hoa, 1 ký tự đặc biệt)
    const passwordRegex = /^(?=.*[A-Z])(?=.*[!@#$%^&*(),.?":{}|<>]).{6,}$/;
    if (!passwordRegex.test(formData.password)) {
      setErrorMessage('Mật khẩu phải tối thiểu 6 ký tự, gồm chữ hoa và ký tự đặc biệt!');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setErrorMessage('Mật khẩu xác nhận không khớp!');
      return;
    }

    setIsLoading(true);
    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/auth/register`, {
        name: formData.name,
        email: formData.email,
        password: formData.password
      });

      navigate('/verify-email', { state: { email: formData.email } });

    } catch (error : any) {
      if (error.response && error.response.data) {
        setErrorMessage(error.response.data.message);
      } else {
        setErrorMessage('Lỗi kết nối server. Vui lòng thử lại sau.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 via-white to-orange-100 px-4 font-sans">
      <div className="bg-white/80 backdrop-blur-2xl rounded-3xl shadow-[0_8px_30px_rgba(0,0,0,0.04)] border border-white/50 overflow-hidden max-w-md w-full p-8 transition-all duration-500 hover:shadow-[0_8px_30px_rgba(249,115,22,0.15)]">

        <div className="text-center mb-6">
          <h1 className="text-3xl font-extrabold mb-2 bg-gradient-to-r from-orange-600 to-orange-400 bg-clip-text text-transparent">Create Your Account</h1>
        </div>

        {errorMessage && (
          <div className="mb-4 p-3 rounded-lg bg-red-50 text-red-600 text-sm text-center font-medium border border-red-100">
            {errorMessage}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="block text-sm font-semibold text-gray-700">Full Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Your full name"
              className="w-full box-border px-4 py-3 rounded-xl bg-gray-50/50 border border-gray-200 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-orange-500/40 focus:border-orange-500 focus:bg-white"
              required
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="block text-sm font-semibold text-gray-700">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="email@gmail.com"
              className="w-full box-border px-4 py-3 rounded-xl bg-gray-50/50 border border-gray-200 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-orange-500/40 focus:border-orange-500 focus:bg-white"
              required
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="block text-sm font-semibold text-gray-700">Password</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Password"
                className="w-full box-border px-4 py-3 pr-12 rounded-xl bg-gray-50/50 border border-gray-200 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-orange-500/40 focus:border-orange-500 focus:bg-white"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-1 text-gray-400 bg-transparent border-none cursor-pointer transition-colors duration-200 flex items-center justify-center hover:text-orange-500 [&>svg]:w-5 [&>svg]:h-5"
              >
                {showPassword ? (
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                )}
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-0.5 mb-0 leading-snug italic">Mật khẩu phải tối thiểu 6 ký tự, gồm chữ hoa và ký tự đặc biệt!</p>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="block text-sm font-semibold text-gray-700">Confirm Password</label>
            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Confirm Password"
                className="w-full box-border px-4 py-3 pr-12 rounded-xl bg-gray-50/50 border border-gray-200 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-orange-500/40 focus:border-orange-500 focus:bg-white"
                required
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-1 text-gray-400 bg-transparent border-none cursor-pointer transition-colors duration-200 flex items-center justify-center hover:text-orange-500 [&>svg]:w-5 [&>svg]:h-5"
              >
                {showConfirmPassword ? (
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                )}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full px-4 py-3.5 text-white font-bold rounded-xl border-none mt-2 cursor-pointer transition-all duration-200 shadow-[0_10px_15px_-3px_rgba(249,115,22,0.3)] bg-gradient-to-r from-orange-500 to-orange-600 enabled:hover:from-orange-600 enabled:hover:to-orange-700 enabled:hover:-translate-y-0.5 disabled:bg-orange-400 disabled:bg-none disabled:cursor-not-allowed disabled:shadow-none disabled:translate-y-0"
          >
            {isLoading ? 'Signing Up...' : 'Sign Up'}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-gray-600">
          Already have an account?{' '}
          <Link to="/login" className="font-bold text-orange-600 no-underline underline-offset-4 transition-colors duration-200 hover:text-orange-700 hover:underline">
            Sign in now
          </Link>
        </div>

      </div>
    </div>
  );
};

export default RegisterPage;