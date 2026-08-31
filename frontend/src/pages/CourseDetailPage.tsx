import React, { useEffect, useMemo, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
    AlertCircle,
    ArrowRight,
    BookOpenCheck,
    CalendarDays,
    CheckCircle2,
    Clock,
    GraduationCap,
    Laptop,
    Target,
    Users,
    X,
} from 'lucide-react';
import Navbar from '../components/NavBar';
import Footer from '../components/Footer';
import { courseApi } from '../services/course.api';
import type { Course, Syllabus, Chapter } from '../services/course.api';
import { registrationApi } from '../services/registration.api';
import type { RegistrationForm } from '../services/registration.api';
import FloatingContact from '../components/FloatingContact';
import { paymentApi } from '../services/payment.api';
import type { CoursePaymentOrder } from '../services/payment.api';

const fallbackDifficulties = [
    'Không biết bắt đầu từ đâu, học nhiều nguồn nhưng thiếu một lộ trình rõ ràng.',
    'Dễ mất gốc khi kiến thức nền tảng chưa chắc và không có người sửa lỗi kịp thời.',
    'Học trước quên sau vì thiếu hệ thống bài tập, thực hành và kiểm tra định kỳ.',
    'Khó duy trì động lực khi không nhìn thấy tiến bộ qua từng giai đoạn học.',
];

const fallbackSolutions = [
    'Lộ trình học được chia nhỏ theo từng buổi, giúp học viên biết chính xác hôm nay cần đạt gì.',
    'Giảng viên hướng dẫn, sửa lỗi và củng cố kiến thức nền trước khi chuyển sang phần nâng cao.',
    'Nội dung kết hợp lý thuyết, thực hành, bài tập và đánh giá để học viên nhớ lâu hơn.',
    'Theo dõi tiến độ theo khóa học, lớp học và từng buổi để phụ huynh/học viên dễ nắm bắt.',
];

const formatCurrency = (value: number) =>
    new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND',
        maximumFractionDigits: 0,
    }).format(value);

const CourseDetailPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [course, setCourse] = useState<Course | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [isRegistering, setIsRegistering] = useState<boolean>(false);
    const [isCreatingPayment, setIsCreatingPayment] = useState<boolean>(false);
    const [paymentOrder, setPaymentOrder] = useState<CoursePaymentOrder | null>(null);
    const [paymentError, setPaymentError] = useState<string>('');

    const [formData, setFormData] = useState<RegistrationForm>({
        courseId: id ? Number(id) || 0 : 0,
        contactName: '',
        contactEmail: '',
        contactPhone: '',
        note: '',
    });

    useEffect(() => {
        if (id) {
            setFormData((current) => ({
                ...current,
                courseId: Number(id) || 0,
            }));
        }
    }, [id]);

    useEffect(() => {
        window.scrollTo(0, 0);

        const fetchDetail = async () => {
            if (!id) return;
            try {
                setIsLoading(true);
                const data = await courseApi.getCourseById(id);
                setCourse(data);
            } catch (error) {
                console.error('Lỗi tải chi tiết khóa học:', error);
                setCourse(null);
            } finally {
                setIsLoading(false);
            }
        };

        fetchDetail();
    }, [id]);

    const sortedSyllabus = useMemo<(Syllabus | Chapter)[]>(() => {
        return [...(course?.syllabus || [])].sort((a, b) => {
            const orderA = a.orderIndex ?? 0;
            const orderB = b.orderIndex ?? 0;
            return orderA - orderB;
        });
    }, [course?.syllabus]);

    const finalPrice = useMemo(() => Number(course?.discountPrice ?? course?.price ?? 0), [course]);

    const overviewItems = useMemo(() => {
        if (!course) return [];

        return [
            {
                id: 'target',
                label: 'Đối tượng',
                value: course.target || 'Cập nhật theo năng lực học viên',
                icon: <Target size={22} />,
            },
            {
                id: 'quantity',
                label: 'Số lượng',
                value:
                    course.sessionCount && Number(course.sessionCount) > 0
                        ? `${course.sessionCount} buổi`
                        : sortedSyllabus.length > 0
                            ? `${sortedSyllabus.length} chương`
                            : 'Theo lộ trình',
                icon: <BookOpenCheck size={22} />,
            },
            {
                id: 'frequency',
                label: 'Tần suất',
                value: course.frequency || 'Theo lịch khai giảng',
                icon: <CalendarDays size={22} />,
            },
            {
                id: 'format',
                label: 'Hình thức',
                value: course.format || 'Online/Offline',
                icon: <Laptop size={22} />,
            },
            {
                id: 'duration',
                label: 'Thời lượng',
                value: course.lessonDuration || course.duration || 'Đang cập nhật',
                icon: <Clock size={22} />,
            },
            {
                id: 'classSize',
                label: 'Sĩ số',
                value: course.classSize || 'Lớp nhỏ, dễ tương tác',
                icon: <Users size={22} />,
            },
        ];
    }, [course, sortedSyllabus.length]);

    const handleSubmit = async () => {
        if (!formData.contactName.trim() || !formData.contactPhone.trim() || !formData.contactEmail.trim()) {
            alert('Vui lòng điền đầy đủ thông tin!');
            return;
        }

        try {
            setIsRegistering(true);
            await registrationApi.registerForCourse(formData);
            alert('Đăng ký thành công!');
            setFormData((prev) => ({
                ...prev,
                contactName: '',
                contactEmail: '',
                contactPhone: '',
                note: '',
            }));
        } catch (error) {
            alert('Đăng ký thất bại, vui lòng thử lại!');
        } finally {
            setIsRegistering(false);
        }
    };

    const handleCreatePayment = async () => {
        if (!course) return;

        const currentUser = localStorage.getItem('user');
        if (!currentUser) {
            alert('Bạn cần đăng nhập để thanh toán.');
            navigate('/login');
            return;
        }

        try {
            setIsCreatingPayment(true);
            setPaymentError('');
            const order = await paymentApi.createCoursePaymentLink(course.id);
            setPaymentOrder(order);
        } catch (error: unknown) {
            const err = error as { response?: { data?: { message?: string } } };
            const message = err?.response?.data?.message || 'Không thể tạo thanh toán. Vui lòng thử lại.';
            setPaymentError(message);
        } finally {
            setIsCreatingPayment(false);
        }
    };

    if (isLoading) {
        return (
            <div className="page-wrapper">
                <Navbar />
                <div className="container" style={{ paddingTop: '150px', textAlign: 'center', height: '100vh' }}>
                    <h2>Đang tải thông tin khóa học...</h2>
                </div>
            </div>
        );
    }

    if (!course) {
        return (
            <div className="page-wrapper">
                <Navbar />
                <div className="container" style={{ paddingTop: '150px', textAlign: 'center', height: '100vh' }}>
                    <h2>Không tìm thấy khóa học!</h2>
                    <Link to="/" className="btn btn-primary mt-1">Quay về trang chủ</Link>
                </div>
            </div>
        );
    }

    return (
        <div className="page-wrapper">
            <Navbar />

            <section
                style={{
                    background: 'linear-gradient(135deg, #0F172A 0%, #1E293B 48%, #E5664B 100%)',
                    color: 'white',
                    paddingTop: '140px',
                    paddingBottom: '70px',
                    overflow: 'hidden',
                }}
            >
                <div className="container">
                    <div
                        style={{
                            display: 'grid',
                            gridTemplateColumns: 'minmax(0, 1.1fr) minmax(280px, 0.9fr)',
                            gap: '44px',
                            alignItems: 'center',
                        }}
                    >
                        <div>
                            <div style={{ fontSize: '0.95rem', color: 'rgba(255,255,255,0.72)', marginBottom: '22px' }}>
                                <Link to="/" style={{ color: 'rgba(255,255,255,0.78)' }}>Trang chủ</Link>
                                <span style={{ margin: '0 10px' }}>/</span>
                                <span>Khóa học</span>
                            </div>

                            <span
                                style={{
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: '8px',
                                    background: 'rgba(255,255,255,0.14)',
                                    border: '1px solid rgba(255,255,255,0.22)',
                                    borderRadius: '999px',
                                    padding: '9px 14px',
                                    fontWeight: 700,
                                    fontSize: '0.85rem',
                                    textTransform: 'uppercase',
                                }}
                            >
                                <GraduationCap size={16} />
                                Khóa học
                            </span>

                            <h1
                                style={{
                                    fontSize: 'clamp(2.3rem, 5vw, 4.4rem)',
                                    lineHeight: 1.05,
                                    margin: '24px 0 18px',
                                    maxWidth: '760px',
                                }}
                            >
                                {course.title}
                            </h1>
                            <p style={{ fontSize: '1.15rem', lineHeight: 1.8, color: 'rgba(255,255,255,0.84)', maxWidth: '720px' }}>
                                {course.shortDesc}
                            </p>

                            <a
                                href="#course-registration"
                                className="btn btn-primary"
                                style={{
                                    marginTop: '30px',
                                    background: '#fff',
                                    color: '#E5664B',
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: '10px',
                                }}
                            >
                                Nhận tư vấn lộ trình
                                <ArrowRight size={18} />
                            </a>
                        </div>

                        <div
                            style={{
                                borderRadius: '28px',
                                overflow: 'hidden',
                                border: '1px solid rgba(255,255,255,0.18)',
                                boxShadow: '0 28px 80px rgba(0,0,0,0.28)',
                                background: 'rgba(255,255,255,0.08)',
                            }}
                        >
                            <img
                                src={course.imageUrl}
                                alt={course.title}
                                style={{ width: '100%', aspectRatio: '4 / 3', objectFit: 'cover', display: 'block' }}
                            />
                        </div>
                    </div>
                </div>
            </section>

            <section style={{ padding: '72px 0', background: '#F5F7FA' }}>
                <div className="container">
                    <div className="course-detail-grid" style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 2fr) minmax(320px, 0.9fr)', gap: '40px', alignItems: 'start' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '34px' }}>
                            <section style={{ background: 'white', padding: '34px', borderRadius: '24px', boxShadow: 'var(--shadow-sm)', border: '1px solid #E5E7EB' }}>
                                <p style={{ color: '#E5664B', fontWeight: 800, textTransform: 'uppercase', fontSize: '0.82rem', letterSpacing: '0.08em', marginBottom: '10px' }}>
                                    Overview
                                </p>
                                <h2 style={{ fontSize: '2rem', color: '#1F2937', marginBottom: '10px' }}>
                                    Thông tin khóa học
                                </h2>
                                <p style={{ color: '#6B7280', lineHeight: 1.75, marginBottom: '28px' }}>
                                    Các thông tin cốt lõi giúp học viên và phụ huynh nắm nhanh mục tiêu, hình thức học và nhịp học của khóa.
                                </p>

                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
                                    {overviewItems.map((item) => (
                                        <div
                                            key={item.id}
                                            style={{
                                                display: 'flex',
                                                gap: '14px',
                                                alignItems: 'flex-start',
                                                padding: '18px',
                                                borderRadius: '18px',
                                                background: '#F9FAFB',
                                                border: '1px solid #EEF0F3',
                                            }}
                                        >
                                            <div style={{ color: '#E5664B', background: '#FFF1ED', borderRadius: '14px', padding: '10px', display: 'flex' }}>
                                                {item.icon}
                                            </div>
                                            <div>
                                                <p style={{ color: '#6B7280', fontSize: '0.82rem', fontWeight: 800, textTransform: 'uppercase', marginBottom: '5px' }}>
                                                    {item.label}
                                                </p>
                                                <p style={{ color: '#1F2937', fontWeight: 500, lineHeight: 1.35 }}>
                                                    {item.value}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </section>

                            <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '22px' }}>
                                <div style={{ background: '#111827', color: 'white', padding: '30px', borderRadius: '24px' }}>
                                    <p style={{ color: '#FCA5A5', fontWeight: 800, textTransform: 'uppercase', fontSize: '0.82rem', letterSpacing: '0.08em', marginBottom: '10px' }}>
                                        Khó khăn thường gặp
                                    </p>
                                    <h2 style={{ fontSize: '1.8rem', marginBottom: '22px' }}>Trước khi có lộ trình rõ ràng</h2>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                        {fallbackDifficulties.map((item, idx) => (
                                            <div key={idx} style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                                                <span style={{ width: '26px', height: '26px', borderRadius: '999px', background: 'rgba(239,68,68,0.14)', color: '#FCA5A5', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                                    <X size={15} />
                                                </span>
                                                <p style={{ lineHeight: 1.65, color: 'rgba(255,255,255,0.82)' }}>{item}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div style={{ background: 'white', padding: '30px', borderRadius: '24px', border: '1px solid #E5E7EB', boxShadow: 'var(--shadow-sm)' }}>
                                    <p style={{ color: '#E5664B', fontWeight: 800, textTransform: 'uppercase', fontSize: '0.82rem', letterSpacing: '0.08em', marginBottom: '10px' }}>
                                        Giải pháp từ khóa học
                                    </p>
                                    <h2 style={{ fontSize: '1.8rem', color: '#1F2937', marginBottom: '22px' }}>Học theo hệ thống, tiến bộ theo từng buổi</h2>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                        {fallbackSolutions.map((item, idx) => (
                                            <div key={idx} style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                                                <span style={{ width: '26px', height: '26px', borderRadius: '999px', background: '#ECFDF3', color: '#16A34A', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                                    <CheckCircle2 size={16} />
                                                </span>
                                                <p style={{ lineHeight: 1.65, color: '#4B5563' }}>{item}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </section>

                            <section style={{ background: 'white', padding: '34px', borderRadius: '24px', boxShadow: 'var(--shadow-sm)', border: '1px solid #E5E7EB' }}>
                                <p style={{ color: '#E5664B', fontWeight: 800, textTransform: 'uppercase', fontSize: '0.82rem', letterSpacing: '0.08em', marginBottom: '10px' }}>
                                    Educational Roadmap
                                </p>
                                <h2 style={{ fontSize: '2rem', color: '#1F2937', marginBottom: '10px' }}>
                                    Lộ trình đào tạo
                                </h2>
                                <p style={{ color: '#6B7280', lineHeight: 1.75, marginBottom: '24px' }}>
                                    Nội dung được sắp xếp theo thứ tự học để học viên dễ theo dõi mục tiêu của từng buổi.
                                </p>

                                {sortedSyllabus.length > 0 ? (
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                        {sortedSyllabus.map((item: any, index: number) => {
                                            // 🟢 Helper parse danh sách bài học từ lessons hoặc description
                                            const getLessonsList = (): any[] => {
                                                const rawData = item.lessons || item.description;
                                                if (Array.isArray(rawData)) return rawData;
                                                if (typeof rawData === 'string') {
                                                    try {
                                                        const parsed = JSON.parse(rawData);
                                                        return Array.isArray(parsed) ? parsed : [];
                                                    } catch {
                                                        // Nếu description thực sự là văn bản mô tả thông thường
                                                        return [];
                                                    }
                                                }
                                                return [];
                                            };

                                            const lessons = getLessonsList();
                                            // Kiểm tra xem description có phải là văn bản thường không (không chứa cấu trúc JSON)
                                            const isNormalTextDescription =
                                                typeof item.description === 'string' &&
                                                !item.description.trim().startsWith('[');

                                            return (
                                                <div
                                                    key={item.id ?? index}
                                                    style={{
                                                        display: 'grid',
                                                        gridTemplateColumns: '64px minmax(0, 1fr) 28px',
                                                        gap: '16px',
                                                        alignItems: 'start',
                                                        padding: '18px',
                                                        borderRadius: '18px',
                                                        border: '1px solid #E5E7EB',
                                                        background: index % 2 === 0 ? '#FFFFFF' : '#FAFAFA',
                                                    }}
                                                >
                                                    <div style={{ color: '#E5664B', fontWeight: 900, fontSize: '1.35rem', paddingTop: '2px' }}>
                                                        {String(index + 1).padStart(2, '0')}
                                                    </div>

                                                    <div>
                                                        <h3 style={{ color: '#1F2937', fontSize: '1.05rem', fontWeight: 700, lineHeight: 1.45, marginBottom: '8px' }}>
                                                            {item.title}
                                                        </h3>

                                                        {/* 🟢 Trường hợp 1: Nếu description là văn bản mô tả thông thường */}
                                                        {isNormalTextDescription && (
                                                            <p style={{ color: '#6B7280', lineHeight: 1.6, marginBottom: '8px', fontSize: '0.95rem' }}>
                                                                {item.description}
                                                            </p>
                                                        )}

                                                        {/* 🟢 Trường hợp 2: Render danh sách bài học đã parse */}
                                                        {lessons.length > 0 ? (
                                                            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginTop: '6px' }}>
                                                                {lessons.map((lesson: any, lessonIdx: number) => (
                                                                    <div
                                                                        key={lesson.id || lessonIdx}
                                                                        style={{
                                                                            display: 'flex',
                                                                            alignItems: 'center',
                                                                            justifyContent: 'space-between',
                                                                            fontSize: '0.9rem',
                                                                            color: '#4B5563',
                                                                            padding: '4px 0',
                                                                            borderBottom: lessonIdx !== lessons.length - 1 ? '1px dashed #F3F4F6' : 'none'
                                                                        }}
                                                                    >
                                                                        <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                                            <span style={{ color: '#9CA3AF' }}>•</span> {lesson.title}
                                                                        </span>
                                                                        {lesson.isPreview && (
                                                                            <span style={{ fontSize: '0.75rem', background: '#EFF6FF', color: '#2563EB', padding: '2px 8px', borderRadius: '12px', fontWeight: 600 }}>
                                                                                Học thử
                                                                            </span>
                                                                        )}
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        ) : (
                                                            !isNormalTextDescription && (
                                                                <p style={{ color: '#9CA3AF', fontSize: '0.875rem', fontStyle: 'italic', margin: 0 }}>
                                                                    Chưa có bài học nào trong chương này.
                                                                </p>
                                                            )
                                                        )}
                                                    </div>

                                                    <div style={{ paddingTop: '4px' }}>
                                                        <ArrowRight size={20} color="#E5664B" />
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                ) : (
                                    <div style={{ padding: '22px', borderRadius: '18px', background: '#F9FAFB', color: '#6B7280', display: 'flex', gap: '12px', alignItems: 'center' }}>
                                        <AlertCircle size={20} color="#E5664B" />
                                        Lộ trình khóa học đang được cập nhật.
                                    </div>
                                )}
                            </section>
                        </div>

                        <div className="course-sidebar" id="course-registration">
                            <div className="registration-box" style={{ background: 'white', padding: '30px', borderRadius: 'var(--radius)', position: 'sticky', top: '100px', boxShadow: 'var(--shadow-lg)' }}>
                                {course.discountPrice ? (
                                    <div style={{ marginBottom: '8px' }}>
                                        <p style={{ margin: 0, textDecoration: 'line-through', color: '#9CA3AF', fontSize: '1rem' }}>
                                            {formatCurrency(Number(course.price || 0))}
                                        </p>
                                        <h3 style={{ fontSize: '1.8rem', color: 'var(--secondary-color)', margin: '4px 0 0' }}>
                                            {formatCurrency(finalPrice)}
                                        </h3>
                                    </div>
                                ) : (
                                    <h3 style={{ fontSize: '1.8rem', color: 'var(--secondary-color)', marginBottom: '10px' }}>
                                        {formatCurrency(finalPrice)}
                                    </h3>
                                )}
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '30px', color: 'var(--text-light)' }}>
                                    <span><Clock size={13} color='#e15f41' /> Thời lượng: <strong>{course.duration}</strong></span>
                                    <span><Laptop size={13} color='#e15f41' /> Hình thức: <strong>{course.format}</strong></span>
                                </div>

                                <button
                                    type="button"
                                    className="btn btn-primary"
                                    onClick={handleCreatePayment}
                                    disabled={isCreatingPayment}
                                    style={{ width: '100%', marginBottom: '14px' }}
                                >
                                    {isCreatingPayment ? 'Đang tạo mã QR...' : 'Thanh toán ngay bằng QR'}
                                </button>

                                {paymentError && (
                                    <p style={{ color: '#DC2626', fontSize: '0.9rem', marginBottom: '14px' }}>
                                        {paymentError}
                                    </p>
                                )}

                                {paymentOrder?.qrCode && (
                                    <div style={{ border: '1px solid #E5E7EB', borderRadius: '14px', padding: '14px', marginBottom: '20px', textAlign: 'center' }}>
                                        <p style={{ fontSize: '0.85rem', color: '#6B7280', margin: '0 0 10px' }}>
                                            Quét mã QR để thanh toán
                                        </p>
                                        <img
                                            src={paymentOrder.qrCode}
                                            alt="PayOS QR"
                                            style={{ width: '100%', maxWidth: '260px', borderRadius: '10px', marginBottom: '10px' }}
                                        />
                                        <p style={{ fontSize: '0.8rem', color: '#6B7280', marginBottom: '10px' }}>
                                            Mã đơn: <strong>{paymentOrder.orderCode}</strong>
                                        </p>
                                        {paymentOrder.checkoutUrl && (
                                            <a href={paymentOrder.checkoutUrl} target="_blank" rel="noreferrer" className="btn btn-outline" style={{ width: '100%' }}>
                                                Mở trang thanh toán
                                            </a>
                                        )}
                                    </div>
                                )}

                                <h4 style={{ marginBottom: '15px' }}>Đăng ký tư vấn khóa học</h4>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                                    <input
                                        type="text"
                                        placeholder="Họ tên phụ huynh/học sinh"
                                        value={formData.contactName}
                                        onChange={(e) => setFormData({ ...formData, contactName: e.target.value })}
                                        style={{ padding: '12px', borderRadius: '4px', border: '1px solid var(--border-color)', outline: 'none' }}
                                    />
                                    <input
                                        type="text"
                                        placeholder="Số điện thoại liên hệ"
                                        value={formData.contactPhone}
                                        onChange={(e) => setFormData({ ...formData, contactPhone: e.target.value })}
                                        style={{ padding: '12px', borderRadius: '4px', border: '1px solid var(--border-color)', outline: 'none' }}
                                    />
                                    <input
                                        type="email"
                                        placeholder="Email"
                                        value={formData.contactEmail}
                                        onChange={(e) => setFormData({ ...formData, contactEmail: e.target.value })}
                                        style={{ padding: '12px', borderRadius: '4px', border: '1px solid var(--border-color)', outline: 'none' }}
                                    />

                                    <button
                                        type="button"
                                        className="btn btn-primary"
                                        onClick={handleSubmit}
                                        disabled={isRegistering}
                                        style={{ width: '100%', marginTop: '10px' }}
                                    >
                                        {isRegistering ? 'Đang xử lý...' : 'Đăng ký ngay'}
                                    </button>
                                </div>
                                <p style={{ fontSize: '0.85rem', color: 'var(--text-light)', textAlign: 'center', marginTop: '15px' }}>
                                    Hoặc liên hệ Hotline: <strong style={{ color: 'var(--primary-color)' }}>1900 5555</strong>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            <FloatingContact />
            <Footer />
        </div>
    );
};

export default CourseDetailPage;