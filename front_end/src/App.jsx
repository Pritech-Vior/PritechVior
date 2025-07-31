import { Routes, Route } from "react-router-dom";
import ButtonGradient from "./assets/svg/ButtonGradient";
import HomePage from "./pages/HomePage";
import BlogPage from "./pages/BlogPage";
import ArchivePage from "./pages/ArchivePage";
import ThinkForgePage from "./pages/ThinkForgePage";
import ViorMartPage from "./pages/ViorMartPage";
import ViorXPage from "./pages/ViorXPage";

const App = () => {
  return (
    <>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/blog" element={<BlogPage />} />
        <Route path="/archive" element={<ArchivePage />} />
        <Route path="/thinkforge" element={<ThinkForgePage />} />
        <Route path="/viormart" element={<ViorMartPage />} />
        <Route path="/viorx" element={<ViorXPage />} />
      </Routes>

      <ButtonGradient />
    </>
  );
};

export default App;
