import { useCallback, useEffect, useRef, useState } from 'react';
import { BookOpen, LogOut, Menu, UserRound, X } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { authApi } from '../services/api';
import { useDismissibleLayer } from './landing/useDismissibleLayer';

interface StoredUser { name?: string; fullName?: string; email?: string }

const links = [
  { label: 'Khóa học', href: '/danh-muc-khoa-hoc' },
  { label: 'Lộ trình', href: '/#learning-paths' },
  { label: 'Giảng viên', href: '/#teachers' },
  { label: 'Liên hệ', href: '/lien-he' },
];

const SCROLL_SURFACE_THRESHOLD = 8;

const readStoredUser = (): StoredUser | null => {
  const value = localStorage.getItem('user');
  if (!value) return null;
  try { return JSON.parse(value) as StoredUser; }
  catch { localStorage.removeItem('user'); return null; }
};

const Navbar = () => {
  const [user, setUser] = useState<StoredUser | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(() => window.scrollY > SCROLL_SURFACE_THRESHOLD);
  const navigate = useNavigate();
  const mobileTriggerRef = useRef<HTMLButtonElement>(null);
  const mobileLayerRef = useRef<HTMLDivElement>(null);
  const accountTriggerRef = useRef<HTMLButtonElement>(null);
  const accountLayerRef = useRef<HTMLDivElement>(null);
  useEffect(() => setUser(readStoredUser()), []);
  useEffect(() => {
    const updateScrollSurface = () => setIsScrolled(window.scrollY > SCROLL_SURFACE_THRESHOLD);
    updateScrollSurface();
    window.addEventListener('scroll', updateScrollSurface, { passive: true });
    return () => window.removeEventListener('scroll', updateScrollSurface);
  }, []);
  const closeMobile = useCallback(() => setMobileOpen(false), []);
  const closeAccount = useCallback(() => setAccountOpen(false), []);
  useDismissibleLayer({ open: mobileOpen, onClose: closeMobile, triggerRef: mobileTriggerRef, layerRef: mobileLayerRef, lockScroll: true, trapFocus: true });
  useDismissibleLayer({ open: accountOpen, onClose: closeAccount, triggerRef: accountTriggerRef, layerRef: accountLayerRef });

  const handleLogout = async () => {
    try { await authApi.logout(); }
    catch (error) { console.error('Không thể gọi API đăng xuất:', error); }
    localStorage.removeItem('user');
    setUser(null);
    navigate('/login');
  };

  const fullName = user?.name || user?.fullName || 'Người dùng';
  const nameParts = fullName.trim().split(/\s+/);
  const initial = nameParts[nameParts.length - 1]?.charAt(0).toUpperCase() || 'U';

  return (
    <header className={`site-header${isScrolled ? ' site-header--scrolled' : ''}`}>
      <nav className="page-frame navbar" aria-label="Điều hướng chính">
        <Link to="/" className="logo" aria-label="Đức Huy Education — Trang chủ" onClick={() => window.scrollTo(0, 0)}><span>Đức Huy</span> Education</Link>
        <ul className="nav-links" aria-label="Liên kết chính">
          {links.map((item) => <li key={item.href}><Link to={item.href}>{item.label}</Link></li>)}
        </ul>
        <div className="nav-actions">
          <Link to="/danh-muc-khoa-hoc" className="button button-primary nav-course-cta">Khám phá khóa học</Link>
          {user ? (
            <div className="account-menu">
              <button ref={accountTriggerRef} type="button" className="account-trigger" aria-label={`Tài khoản của ${fullName}`} aria-expanded={accountOpen} aria-haspopup="menu" onClick={() => setAccountOpen((value) => !value)}>{initial}</button>
              {accountOpen && (
                <div ref={accountLayerRef} role="menu" className="account-popover">
                  <div className="account-summary"><strong>{fullName}</strong>{user.email && <span>{user.email}</span>}</div>
                  <Link role="menuitem" to="/my-courses" onClick={closeAccount}><BookOpen aria-hidden="true" size={18} /> Khóa học của tôi</Link>
                  <button role="menuitem" type="button" onClick={handleLogout}><LogOut aria-hidden="true" size={18} /> Đăng xuất</button>
                </div>
              )}
            </div>
          ) : (
            <div className="auth-links"><Link to="/login" className="login-link">Đăng nhập</Link><Link to="/register" className="button button-secondary">Đăng ký</Link></div>
          )}
          <button ref={mobileTriggerRef} type="button" className="mobile-menu-trigger" aria-label={mobileOpen ? 'Đóng menu' : 'Mở menu'} aria-expanded={mobileOpen} onClick={() => setMobileOpen((value) => !value)}>{mobileOpen ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}</button>
        </div>
      </nav>
      {mobileOpen && (
        <div className="mobile-nav-backdrop">
          <div ref={mobileLayerRef} className="mobile-nav" role="dialog" aria-label="Menu chính" aria-modal="true">
            <div className="mobile-nav-heading"><span>Menu</span><UserRound aria-hidden="true" /></div>
            <nav aria-label="Điều hướng di động">{links.map((item) => <Link key={item.href} to={item.href} onClick={closeMobile}>{item.label}</Link>)}</nav>
            <Link to="/danh-muc-khoa-hoc" className="button button-primary" onClick={closeMobile}>Khám phá khóa học</Link>
            {!user && <Link to="/login" onClick={closeMobile}>Đăng nhập</Link>}
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
