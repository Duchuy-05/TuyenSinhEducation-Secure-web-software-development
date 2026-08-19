export const mockInstructorData = {
    user: {
        name: "Đinh Văn Lộc",
        avatar: "https://ui-avatars.com/api/?name=Dinh+Loc&background=1F2937&color=fff",
        email: "dinhvanloc@example.com",
        title: "Chuyên gia Marketing & Thiết kế"
    },
    statistics: {
        totalClasses: 24,
        totalStudents: 1250,
        activeClasses: 18,
        completedClasses: 6
    },
    classes: [
        {
            id: "CLS-001",
            className: "Lớp Canva K34",
            courseName: "21 Ngày Thành Thạo Canva",
            thumbnail: "https://images.unsplash.com/photo-1626785774573-4b799315345d?auto=format&fit=crop&q=80&w=800",
            status: "Đang học", // Đang học, Sắp khai giảng, Đã kết thúc
            schedule: "Thứ 2 - Thứ 6 | 19:00 - 21:00",
            progress: 72,
            stats: {
                students: 35,
                lessons: 18,
                tests: 5
            }
        },
        {
            id: "CLS-002",
            className: "Digital Marketing Tốc Chiến K12",
            courseName: "Digital Marketing Toàn Diện Tăng Trưởng Doanh Số",
            thumbnail: "https://images.unsplash.com/photo-1432888117426-1d5ac087068b?auto=format&fit=crop&q=80&w=800",
            status: "Đang học",
            schedule: "Thứ 3 - Thứ 5 - Thứ 7 | 20:00 - 22:00",
            progress: 45,
            stats: {
                students: 85,
                lessons: 65,
                tests: 12
            }
        },
        {
            id: "CLS-003",
            className: "Khởi Nghiệp Thực Chiến K05",
            courseName: "Khởi Nghiệp Kinh Doanh Online Từ Số 0",
            thumbnail: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=800",
            status: "Sắp khai giảng",
            schedule: "Thứ 7 - CN | 09:00 - 11:30",
            progress: 0,
            stats: {
                students: 120,
                lessons: 50,
                tests: 8
            }
        },
        {
            id: "CLS-004",
            className: "Lớp Canva K33",
            courseName: "21 Ngày Thành Thạo Canva",
            thumbnail: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?auto=format&fit=crop&q=80&w=800",
            status: "Đã kết thúc",
            schedule: "Thứ 2 - Thứ 6 | 19:00 - 21:00",
            progress: 100,
            stats: {
                students: 42,
                lessons: 21,
                tests: 5
            }
        }
    ],
    upcomingSessions: [
        {
            id: "US-01",
            className: "Lớp Canva K34",
            time: "19:00 hôm nay"
        },
        {
            id: "US-02",
            className: "Digital Marketing Tốc Chiến K12",
            time: "20:00 hôm nay"
        },
        {
            id: "US-03",
            className: "Khởi Nghiệp Thực Chiến K05",
            time: "09:00 ngày mai"
        }
    ],
    recentActivities: [
        {
            id: "ACT-01",
            user: "Nguyễn Văn A",
            action: "nộp bài tập",
            target: "Bài 15: Thiết kế banner Facebook",
            time: "10 phút trước"
        },
        {
            id: "ACT-02",
            user: "Trần Văn B",
            action: "hoàn thành bài kiểm tra",
            target: "Kiểm tra giữa khóa",
            time: "1 giờ trước"
        },
        {
            id: "ACT-03",
            user: "Lê Thị C",
            action: "tham gia lớp học",
            target: "Lớp Canva K34",
            time: "3 giờ trước"
        }
    ],
    topCourses: [
        { id: "C-01", name: "ReactJS Masterclass", rating: 4.9, students: 840 },
        { id: "C-02", name: "Canva For Business", rating: 4.8, students: 620 },
        { id: "C-03", name: "AI For Beginners", rating: 4.7, students: 530 },
        { id: "C-04", name: "UI/UX Design", rating: 4.6, students: 410 },
        { id: "C-05", name: "Java Spring Boot", rating: 4.5, students: 380 }
    ],
    notifications: [
        { id: "N-01", title: "Học viên mới đăng ký", time: "5 phút trước", unread: true },
        { id: "N-02", title: "Khóa học được đánh giá 5 sao", time: "1 giờ trước", unread: true },
        { id: "N-03", title: "Lớp học Canva K34 sắp bắt đầu", time: "3 giờ trước", unread: false }
    ],
    recentReviews: [
        { id: "R-01", studentName: "Nguyễn Văn A", rating: 5.0, content: "Khóa học rất dễ hiểu và thực tế, giảng viên nhiệt tình hỗ trợ. Rất đáng tiền!", course: "ReactJS Masterclass", time: "Hôm qua" },
        { id: "R-02", studentName: "Trần Thị B", rating: 4.5, content: "Bài giảng chi tiết, tuy nhiên phần nâng cao hơi nhanh. Mong thầy có thêm bài tập phụ.", course: "Canva For Business", time: "2 ngày trước" },
        { id: "R-03", studentName: "Lê Minh C", rating: 5.0, content: "Tuyệt vời! Áp dụng được ngay vào công việc.", course: "AI For Beginners", time: "3 ngày trước" }
    ],
    studentChats: [
        {
            id: "STU-01",
            name: "Nguyễn Văn A",
            avatar: "https://ui-avatars.com/api/?name=Nguyen+Van+A&background=random",
            className: "ReactJS K15",
            status: "online",
            unread: 2,
            lastMessage: "Em đã hoàn thành bài tập rồi ạ.",
            lastMessageTime: "10 phút trước",
            profile: {
                attendance: 95,
                progress: 72,
                assignments: "8/10",
                averageScore: 8.9,
                lessonsCompleted: "18 / 25",
                classes: [
                    { name: "ReactJS K15", status: "Đang học" },
                    { name: "JavaScript K10", status: "Hoàn thành" }
                ],
                timeline: [
                    { action: "Nộp bài tập React Hooks", time: "Hôm nay 09:30" },
                    { action: "Hoàn thành kiểm tra số 3", time: "Hôm qua 15:00" },
                    { action: "Tham gia lớp học trực tuyến", time: "2 ngày trước" }
                ]
            },
            messages: [
                { id: "M1", sender: "student", text: "Thầy ơi em chưa hiểu phần React Hooks ở đoạn useEffect.", time: "10:15 AM" },
                { id: "M2", sender: "teacher", text: "Chào em, em đang vướng ở dependency array đúng không?", time: "10:20 AM" },
                { id: "M3", sender: "student", text: "Dạ vâng ạ, nó cứ bị gọi API vô hạn lần.", time: "10:21 AM" },
                { id: "M4", sender: "teacher", text: "Em xem lại bài số 5 nhé, thầy có giải thích khá kỹ cách truyền [] để gọi 1 lần.", time: "10:25 AM" },
                { id: "M5", sender: "student", text: "Vâng để em xem lại. Em cảm ơn thầy.", time: "10:30 AM" },
                { id: "M6", sender: "student", text: "Em đã hoàn thành bài tập rồi ạ.", time: "10:45 AM", seen: true }
            ]
        },
        {
            id: "STU-02",
            name: "Trần Thị B",
            avatar: "https://ui-avatars.com/api/?name=Tran+Thi+B&background=random",
            className: "Canva K34",
            status: "offline",
            unread: 0,
            lastMessage: "Cảm ơn thầy ạ.",
            lastMessageTime: "2 giờ trước",
            profile: {
                attendance: 80,
                progress: 50,
                assignments: "5/10",
                averageScore: 7.5,
                lessonsCompleted: "10 / 20",
                classes: [
                    { name: "Canva K34", status: "Đang học" }
                ],
                timeline: [
                    { action: "Xem video bài giảng 10", time: "Hôm qua" }
                ]
            },
            messages: [
                { id: "M1", sender: "student", text: "Thầy xem giúp em banner này màu đã ổn chưa ạ?", time: "08:00 AM" },
                { id: "M2", sender: "teacher", text: "Em thử đổi màu cam sáng hơn một chút để nổi bật chữ nhé.", time: "08:15 AM" },
                { id: "M3", sender: "student", text: "Cảm ơn thầy ạ.", time: "08:20 AM", seen: true }
            ]
        },
        {
            id: "STU-03",
            name: "Lê Minh C",
            avatar: "https://ui-avatars.com/api/?name=Le+Minh+C&background=random",
            className: "AI Beginner K07",
            status: "online",
            unread: 1,
            lastMessage: "Em muốn xin phép nghỉ học hôm nay ạ.",
            lastMessageTime: "Vừa xong",
            profile: {
                attendance: 100,
                progress: 30,
                assignments: "3/10",
                averageScore: 9.0,
                lessonsCompleted: "5 / 15",
                classes: [
                    { name: "AI Beginner K07", status: "Đang học" }
                ],
                timeline: [
                    { action: "Hoàn thành bài tập số 2", time: "Sáng nay" }
                ]
            },
            messages: [
                { id: "M1", sender: "student", text: "Em muốn xin phép nghỉ học hôm nay ạ.", time: "10:50 AM" }
            ]
        }
    ]
};
