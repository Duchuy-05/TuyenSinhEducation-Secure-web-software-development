export const mockStudentData = {
    user: {
        name: "Nguyễn Văn Học Viên",
        avatar: "https://ui-avatars.com/api/?name=Hoc+Vien&background=E5664B&color=fff",
        email: "hocvien@example.com"
    },
    statistics: {
        totalCourses: 12,
        inProgress: 3,
        completed: 9,
        certificates: 5
    },
    courses: [
        {
            id: "C001",
            title: "21 Ngày Thành Thạo Canva Thiết Kế Chuyên Nghiệp",
            category: "Thiết kế",
            thumbnail: "https://images.unsplash.com/photo-1626785774573-4b799315345d?auto=format&fit=crop&q=80&w=800",
            status: "Đang học", // Đang học, Hoàn thành, Chưa bắt đầu
            progress: 45,
            instructor: {
                name: "Richdad Loc (Đinh Văn Lộc)",
                avatar: "https://ui-avatars.com/api/?name=Richdad+Loc&background=1F2937&color=fff"
            },
            stats: {
                lessons: 42,
                duration: "12h 30m",
                students: 1250
            }
        },
        {
            id: "C002",
            title: "Tư Duy Lập Trình Với Scratch Cho Trẻ Em",
            category: "Lập trình",
            thumbnail: "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?auto=format&fit=crop&q=80&w=800",
            status: "Hoàn thành",
            progress: 100,
            instructor: {
                name: "GV. Nguyễn Tuấn Anh",
                avatar: "https://ui-avatars.com/api/?name=Tuan+Anh&background=1F2937&color=fff"
            },
            stats: {
                lessons: 28,
                duration: "8h 15m",
                students: 850
            }
        },
        {
            id: "C003",
            title: "Digital Marketing Toàn Diện Tăng Trưởng Doanh Số",
            category: "Marketing",
            thumbnail: "https://images.unsplash.com/photo-1432888117426-1d5ac087068b?auto=format&fit=crop&q=80&w=800",
            status: "Đang học",
            progress: 10,
            instructor: {
                name: "GV. Trần Thị B",
                avatar: "https://ui-avatars.com/api/?name=Tran+B&background=1F2937&color=fff"
            },
            stats: {
                lessons: 65,
                duration: "24h 00m",
                students: 3200
            }
        },
        {
            id: "C004",
            title: "Ứng Dụng AI Trong Xử Lý Công Việc Hàng Ngày",
            category: "AI",
            thumbnail: "https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&q=80&w=800",
            status: "Chưa bắt đầu",
            progress: 0,
            instructor: {
                name: "GV. Lê Thông Minh",
                avatar: "https://ui-avatars.com/api/?name=Le+Minh&background=1F2937&color=fff"
            },
            stats: {
                lessons: 15,
                duration: "4h 45m",
                students: 540
            }
        },
        {
            id: "C005",
            title: "Khởi Nghiệp Kinh Doanh Online Từ Số 0",
            category: "Kinh doanh",
            thumbnail: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=800",
            status: "Hoàn thành",
            progress: 100,
            instructor: {
                name: "Richdad Loc (Đinh Văn Lộc)",
                avatar: "https://ui-avatars.com/api/?name=Richdad+Loc&background=1F2937&color=fff"
            },
            stats: {
                lessons: 50,
                duration: "18h 20m",
                students: 4100
            }
        }
    ]
};
