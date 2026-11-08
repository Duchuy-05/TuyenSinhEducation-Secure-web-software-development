export const landingContent = {
  hero: {
    title: 'Khóa học về công nghệ',
    description: 'Chọn lộ trình phù hợp, học qua dự án và nhận hỗ trợ từ giảng viên trong suốt quá trình học.',
    primaryCta: { label: 'Khám phá khóa học', href: '/danh-muc-khoa-hoc' },
    secondaryCta: { label: 'Nhận tư vấn', href: '/lien-he' },
    mediaAlt: 'Khóa học công nghệ thực hành tại Đức Huy Education',
  },
  contact: {
    phone: '0926008221',
    email: 'huyntd.23810310127@epu.edu.vn',
  },
  courseGoals: [
    { value: 'beginner', label: 'Bắt đầu lập trình', queryValue: 'beginner' },
    { value: 'frontend', label: 'Frontend', queryValue: 'frontend' },
    { value: 'backend', label: 'Backend', queryValue: 'backend' },
    { value: 'ui-ux', label: 'Thiết kế UI/UX', queryValue: 'ui-ux' },
  ] as const,
  learningPaths: [
    { id: 'beginner', title: 'Bắt đầu lập trình', entry: 'Người mới làm quen với công nghệ', courses: ['Nền tảng lập trình', 'Dự án đầu tiên'], outcome: 'Hoàn thành một dự án có thể trình bày.' },
    { id: 'frontend', title: 'Frontend', entry: 'Đã biết kiến thức cơ bản', courses: ['HTML & CSS', 'React'], outcome: 'Xây dựng giao diện web đáp ứng.' },
    { id: 'backend', title: 'Backend', entry: 'Muốn phát triển dịch vụ web', courses: ['Node.js', 'Cơ sở dữ liệu'], outcome: 'Tạo API cho sản phẩm web.' },
    { id: 'ui-ux', title: 'Thiết kế UI/UX', entry: 'Quan tâm đến trải nghiệm sản phẩm', courses: ['Nghiên cứu người dùng', 'Thiết kế giao diện'], outcome: 'Hoàn thiện case study thiết kế.' },
  ],
  faqs: [] as readonly { id: string; question: string; answer: string; verified: true }[],
} as const;
