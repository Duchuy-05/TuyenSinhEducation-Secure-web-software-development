import type { Teacher } from '../services/teacher.api';

export const mockTeachers: Teacher[] = [
    {
        id: 1,
        fullName: 'Nguyễn Văn A',
        email: 'nguyenvana@example.com',
        phone: '0901234567',
        specialization: 'Giảng viên Scratch & Python',
        bio: 'Thạc sĩ Khoa học Máy tính. Có nhiều kinh nghiệm giảng dạy lập trình cho trẻ em và người mới bắt đầu.',
        avatarUrl: 'https://i.pravatar.cc/150?img=11',
        title: 'Thạc sĩ Khoa học Máy tính',
        company: 'Trường Đại học Bách Khoa Hà Nội',
        experience: '5 năm kinh nghiệm giảng dạy lập trình cho trẻ em và người mới bắt đầu.'
    },
    {
        id: 2,
        fullName: 'Trần Thị B',
        email: 'tranthib@example.com',
        phone: '0987654321',
        specialization: 'Senior Frontend Developer',
        bio: 'Chuyên gia về ReactJS, VueJS và UI/UX Design. Thường xuyên chia sẻ kiến thức tại các hội thảo công nghệ lớn.',
        avatarUrl: 'https://i.pravatar.cc/150?img=5',
        title: 'Senior Frontend Developer',
        company: 'Công ty TNHH Công nghệ Đức Huy',
        experience: '7 năm kinh nghiệm phát triển ứng dụng web với ReactJS và VueJS.'
    },
    {
        id: 3,
        fullName: 'Lê Hoàng C',
        email: 'lehoangc@example.com',
        phone: '0912345678',
        specialization: 'Chuyên gia Data Science',
        bio: 'Nghiên cứu sinh ngành AI. Giảng viên thỉnh giảng tại Đại học Bách Khoa Hà Nội.',
        avatarUrl: 'https://i.pravatar.cc/150?img=68',
        title: 'Nghiên cứu sinh ngành AI',
        company: 'Đại học Công nghệ, Đại học Quốc gia Hà Nội',
        experience: '3 năm kinh nghiệm nghiên cứu và giảng dạy về trí tuệ nhân tạo và khoa học dữ liệu.'
    },
    {
        id: 4,
        fullName: 'Phạm Minh D',
        email: 'phamminhd@example.com',
        phone: '0934567890',
        specialization: 'Software Architect',
        bio: 'Tác giả của nhiều khóa học System Design nổi tiếng. Đam mê xây dựng các hệ thống chịu tải cao.',
        avatarUrl: 'https://i.pravatar.cc/150?img=33',
        title: 'Software Architect',
        company: 'Công ty TNHH Giải pháp FPT Software',
        experience: '10 năm kinh nghiệm thiết kế và triển khai các hệ thống phần mềm quy mô lớn.'
    }
];
