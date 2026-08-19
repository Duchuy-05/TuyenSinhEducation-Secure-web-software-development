import React, { useState, useRef, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios, { AxiosError } from 'axios';

declare global {
  interface ImportMeta {
    env: Record<string, string>;
  }
}

const VerifyEmail = () => {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const navigate = useNavigate();
  const location = useLocation();
  
  // Lấy email từ RegisterPage truyền sang. Nếu không có thì trả về trang Register.
  const email = location.state?.email;

  useEffect(() => {
    if (!email) {
      navigate('/register');
    }
  }, [email, navigate]);

  const handleOtpChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Kiểm tra xem ký tự nhập vào có phải là số không
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value.substring(value.length - 1);
    setOtp(newOtp);

    // Tự động focus ô tiếp theo
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const otpString = otp.join('');
    if (otpString.length < 6) {
      return setErrorMessage('Vui lòng nhập đủ 6 số xác nhận.');
    }

    setIsLoading(true);
    setErrorMessage('');
    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/auth/verify-otp`, {
        email: email,
        otp: otpString
      });
      alert(response.data.message || 'Xác thực tài khoản thành công!');
      navigate('/login'); // Thành công thì về trang Đăng nhập
    } catch (error) {
      const axiosError = error as AxiosError<{ message: string }>;
      console.log('Error response:', axiosError.response);
      setErrorMessage(axiosError.response?.data?.message || 'Mã xác nhận không hợp lệ hoặc đã hết hạn.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 via-white to-orange-100 px-4 font-sans">
      <div className="bg-white rounded-3xl shadow-[0_8px_30px_rgba(249,115,22,0.12)] border border-orange-500/10 max-w-md w-full px-8 py-12 text-center transition-all duration-300">
        
        {/* Icon Lá thư màu cam */}
        <div className="w-16 h-16 bg-orange-50 rounded-full flex items-center justify-center mx-auto mb-6 border-2 border-orange-300">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-8 h-8 text-orange-600">
            <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
          </svg>
        </div>
        
        <h2 className="text-3xl font-extrabold mb-3 bg-gradient-to-r from-orange-600 to-orange-500 bg-clip-text text-transparent">Verify Your Email</h2>
        <p className="text-gray-500 text-[0.95rem] leading-relaxed mb-8">
          Chúng tôi đã gửi mã 6 chữ số đến email<br />
          <strong className="text-orange-600">{email}</strong>
        </p>

        {errorMessage && (
          <div className="mb-6 p-3 rounded-lg bg-red-50 text-red-600 text-sm text-center font-medium border border-red-100">
            {errorMessage}
          </div>
        )}

        <form onSubmit={handleVerifyOtp}>
          <div className="flex gap-3 justify-center mb-8">
            {otp.map((data, index) => (
              <input
                key={index}
                type="text"
                maxLength={1}
                className="w-[50px] h-[60px] bg-gray-50 border border-gray-200 rounded-xl text-center text-2xl font-bold text-gray-800 transition-all duration-200 focus:outline-none focus:bg-white focus:border-orange-500 focus:ring-[3px] focus:ring-orange-500/20"
                value={data}
                onChange={(e) => handleOtpChange(index, e)}
                onKeyDown={(e) => handleOtpKeyDown(index, e)}
                ref={(el) => { if (el) inputRefs.current[index] = el; }}
                autoFocus={index === 0} // Tự động trỏ chuột vào ô đầu tiên
              />
            ))}
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full p-4 text-white font-bold text-base rounded-xl border-none cursor-pointer transition-all duration-200 shadow-[0_10px_15px_-3px_rgba(249,115,22,0.3)] bg-gradient-to-r from-orange-500 to-orange-600 enabled:hover:from-orange-600 enabled:hover:to-orange-700 enabled:hover:-translate-y-0.5 disabled:bg-orange-300 disabled:bg-none disabled:cursor-not-allowed disabled:shadow-none disabled:translate-y-0"
          >
            {isLoading ? 'Verifying...' : 'Verify Account'}
          </button>
        </form>

        <button
          type="button"
          onClick={() => navigate('/register')}
          className="mt-6 bg-transparent border-none text-gray-400 text-[0.9rem] font-semibold cursor-pointer transition-colors duration-200 hover:text-orange-600"
        >
          &lt; Back to Sign Up
        </button>

      </div>
    </div>
  );
};

export default VerifyEmail;