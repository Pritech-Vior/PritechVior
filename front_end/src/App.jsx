import { Routes, Route } from "react-router-dom";
import ButtonGradient from "./assets/svg/ButtonGradient";
import Chatbot from "./components/Chatbot";
import HomePage from "./pages/HomePage";
import BlogPage from "./pages/BlogPage";
import BlogPostPage from "./pages/BlogPostPage";
import BlogManagePage from "./pages/BlogManagePage";
import BlogCreatePage from "./pages/BlogCreatePage";
import ArchivePage from "./pages/ArchivePage";
import ArchiveDetailPage from "./pages/ArchiveDetailPage";
import ThinkForgePage from "./pages/ThinkForgePage";
import ViorMartPage from "./pages/ViorMartPage";
import ViorXPage from "./pages/ViorXPage";
import AboutPage from "./pages/AboutPage";
import ScholarPage from "./pages/ScholarPage";
import ContactPage from "./pages/ContactPage";
import ProjectsPage from "./pages/ProjectsPage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";

// Dashboard Imports
import AdminDashboard from "./pages/dashboard/admin/AdminDashboardSimple";
import CEODashboard from "./pages/dashboard/ceo/CEODashboardSimple";
import TreasuryDashboard from "./pages/dashboard/treasury/TreasuryDashboardSimple";
import TrainerDashboard from "./pages/dashboard/trainer/TrainerDashboardSimple";
import StudentDashboard from "./pages/dashboard/student/StudentDashboardSimple";
import ParentDashboard from "./pages/dashboard/parent/ParentDashboardSimple";
import GuestDashboard from "./pages/dashboard/guest/GuestDashboardSimple";
import ClientDashboard from "./pages/dashboard/client/ClientDashboardSimple";
import TechnicianDashboard from "./pages/dashboard/technician/TechnicianDashboardSimple";
import DesignerDashboard from "./pages/dashboard/designer/DesignerDashboardSimple";
import WriterDashboard from "./pages/dashboard/writer/WriterDashboardSimple";
import MultiRoleDashboard from "./pages/dashboard/multirole/MultiRoleDashboard";
import MultiRoleWrapper from "./pages/dashboard/MultiRoleWrapper";

const App = () => {
  return (
    <>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/blog" element={<BlogPage />} />
        <Route path="/blog/:id" element={<BlogPostPage />} />
        <Route path="/blog/manage" element={<BlogManagePage />} />
        <Route path="/blog/create" element={<BlogCreatePage />} />
        <Route path="/archive" element={<ArchivePage />} />
        <Route path="/archive/:id" element={<ArchiveDetailPage />} />
        <Route path="/thinkforge" element={<ThinkForgePage />} />
        <Route path="/viormart" element={<ViorMartPage />} />
        <Route path="/viorx" element={<ViorXPage />} />
        <Route path="/projects" element={<ProjectsPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/scholar" element={<ScholarPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />

        {/* Dashboard Routes */}
        <Route path="/admin/*" element={<AdminDashboard />} />
        <Route path="/ceo/*" element={<CEODashboard />} />
        <Route path="/treasury/*" element={<TreasuryDashboard />} />
        <Route path="/trainer/*" element={<TrainerDashboard />} />
        <Route path="/student/*" element={<StudentDashboard />} />
        <Route path="/parent/*" element={<ParentDashboard />} />
        <Route path="/guest/*" element={<GuestDashboard />} />
        <Route path="/client/*" element={<ClientDashboard />} />
        <Route path="/technician/*" element={<TechnicianDashboard />} />
        <Route path="/designer/*" element={<DesignerDashboard />} />
        <Route path="/writer/*" element={<WriterDashboard />} />
        <Route path="/multirole/*" element={<MultiRoleDashboard />} />

        {/* Demo route for multi-role functionality */}
        <Route path="/demo-multirole/*" element={<MultiRoleWrapper />} />
      </Routes>

      <ButtonGradient />
      <Chatbot />
    </>
  );
};

export default App;
