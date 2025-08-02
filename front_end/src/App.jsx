import { Routes, Route } from "react-router-dom";
import ButtonGradient from "./assets/svg/ButtonGradient";
import Chatbot from "./components/Chatbot";
import HomePage from "./pages/HomePage";
import BlogPage from "./pages/BlogPage";
import BlogPostPage from "./pages/BlogPostPage";
import BlogManagePage from "./pages/BlogManagePage";
import BlogCreatePage from "./pages/BlogCreatePage";
import ArchivePage from "./pages/ArchivePage";
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
      </Routes>

      <ButtonGradient />
      <Chatbot />
    </>
  );
};

export default App;
