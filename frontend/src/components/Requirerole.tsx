import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';

interface RequireRoleProps {
    allowedRoles: string[];
    children: React.ReactNode;
}

const RequireRole: React.FC<RequireRoleProps> = ({ allowedRoles, children }) => {
    const location = useLocation();

    const userStr = localStorage.getItem('user');

    let user: any = null;
    try {
        user = userStr ? JSON.parse(userStr) : null;
    } catch {
        user = null;
    }

    // Chưa đăng nhập hoặc dữ liệu user bị hỏng -> bắt đăng nhập lại
    if (!user) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    // Đã đăng nhập nhưng role không được phép -> chặn truy cập
    if (!allowedRoles.includes(user.role)) {
        alert('Bạn không có quyền truy cập trang này!');
        return <Navigate to="/" replace />;
    }

    return <>{children}</>;
};

export default RequireRole;
