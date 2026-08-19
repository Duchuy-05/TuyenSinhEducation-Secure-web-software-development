import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import CourseDetailPage from './pages/CourseDetailPage';
import ScratchCoursePage from './pages/ScratchCoursePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ContactPage from './pages/ContactPage';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminLayout from './pages/admin/AdminLayout';
import AdminTeachers from './pages/admin/AdminTeachers';
import AdminCourses from './pages/admin/AdminCourses';
import AdminRegistrations from './pages/admin/AdminRegistrations';
import AdminPost from './pages/admin/AdminPost';
import AdminClassStudents from './pages/admin/AdminClassStudents';
import VerifyEmail from './pages/VerifyEmail';
import CourseEditorPage from './pages/instructor/course-builder/CourseEditorPage';
import PostList from './pages/Post/PostList';
import CreatePost from './pages/admin/CreatePost';
import PostDetail from './pages/Post/PostDetail';
import StudentLayout from './layouts/StudentLayout';
import MyCoursesPage from './pages/student/MyCoursesPage';
import InstructorLayout from './layouts/InstructorLayout';
import ProtectedRoute from './components/ProtectedRoute';
import InstructorDashboardPage from './pages/instructor/InstructorDashboardPage';
import InstructorCoursesPage from './pages/instructor/InstructorCoursesPage';
// import InstructorCourseDetailPage from './pages/instructor/InstructorCourseDetailPage';
import InstructorClassesPage from './pages/instructor/InstructorClassesPage';
import InstructorCreateClassPage from './pages/instructor/InstructorCreateClassPage';
import InstructorStudentsPage from './pages/instructor/InstructorStudentsPage';
import StudentDashboard from './pages/student/StudentDashboard';
import StudentOrdersCourses from './pages/student/StudentOrdersCourses';
import StudentSetting from './pages/student/StudentSetting';
import StudentClasses from './pages/student/StudentClasses';
import StudentContactInstructor from './pages/student/StudentContactInstructor';
import StudentSchedulePage from './pages/student/StudentSchedulePage';
import StudentAnnouncementsPage from './pages/student/StudentAnnouncementsPage';
import './styles/LandingPage.css';
import CourseCatalogPage from './pages/courseCatalog/CourseCatalogPage';
import EditPost from './pages/admin/EditPost';
function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Đường dẫn trang chủ */}
        <Route path="/" element={<LandingPage />} />

        {/* Trang khóa học Scratch (đặt trước route động để ưu tiên match) */}
        <Route path="/khoa-hoc/scratch-tu-duy" element={<ScratchCoursePage />} />

        {/* Đường dẫn trang chi tiết khóa học chung */}
        <Route path="/khoa-hoc/:id" element={<CourseDetailPage />} />

        {/* Đường dẫn trang đăng nhập */}
        <Route path="/login" element={<LoginPage />} />

        {/* Đường dẫn trang đăng ký */}
        <Route path="/register" element={<RegisterPage />} />
        {/* Trang liên hệ */}
        <Route path="/lien-he" element={<ContactPage />} />

        <Route path="/posts" element={<PostList />} />
        <Route path="/posts/:slug" element={<PostDetail />} />

        <Route path="/hehe" element={<CreatePost />} />
        <Route path="/danh-muc-khoa-hoc" element={<CourseCatalogPage />} />

        <Route path="/admin" element={
          <ProtectedRoute allowedRoles={['admin']}>
            <AdminLayout />
          </ProtectedRoute>
        }>
          {/* Tự động điều hướng /admin sang /admin/dashboard (Tùy chọn) */}
          <Route index element={<AdminDashboard />} />

          {/* Các trang con nằm trong khung Layout */}
          <Route path="dashboard" element={<AdminDashboard />} />

          <Route path="teachers" element={<AdminTeachers />} />

          <Route path="courses" element={<AdminCourses />} />

          <Route path="registrations" element={<AdminRegistrations />} />

          <Route path="posts" element={<AdminPost />} />

          <Route path="posts/create" element={<CreatePost />} />

          <Route path="posts/edit/:id" element={<EditPost />} />

          <Route path="class-students" element={<AdminClassStudents />} />

        </Route>
        {/* Trang xác thực email */}
        <Route path="/verify-email" element={<VerifyEmail />} />



        {/* Các route dành cho Học viên (Student Dashboard) */}
        <Route element={
          <ProtectedRoute allowedRoles={['student']}>
            <StudentLayout />
          </ProtectedRoute>
        }>
          {/* Dashboard học viên / My Courses */}
          <Route path="/my-courses" element={<MyCoursesPage />} />
          {/* <Route path="/my-courses/:id" element={<StudentCoursesDetailPage />} /> */}
          <Route path="/dashboard" element={<StudentDashboard />} />
          <Route path="/orders" element={<StudentOrdersCourses />} />
          <Route path="/settings" element={<StudentSetting />} />
          <Route path="/classes" element={<StudentClasses />} />
          <Route path="/schedule" element={<StudentSchedulePage />} />
          <Route path="/announcements" element={<StudentAnnouncementsPage />} />
          <Route path="/ask-teacher" element={<StudentContactInstructor />} />
        </Route>
        {/* Các trang sau sẽ được phát triển sau */}

        {/* Các route dành cho Giảng viên (Instructor Dashboard) */}
        <Route element={
          <ProtectedRoute allowedRoles={['teacher']}>
            <InstructorLayout />
          </ProtectedRoute>
        }>
          <Route path="/instructor" element={<InstructorDashboardPage />} />
          <Route path="/instructor/courses" element={<InstructorCoursesPage />} />
          <Route path="/instructor/course-builder/:courseId" element={<CourseEditorPage />} />
          {/* <Route path="/instructor/courses/:id" element={<InstructorCourseDetailPage />} /> */}
          <Route path="/instructor/my-class" element={<InstructorClassesPage />} />
          <Route path="/my-class/create" element={<InstructorCreateClassPage />} />
          <Route path="/instructor/students" element={<InstructorStudentsPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
