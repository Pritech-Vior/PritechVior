import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";

const ViorXPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect to Scholar page since ViorX content is now there
    navigate("/scholar", { replace: true });
  }, [navigate]);

  return (
    <div className="pt-[4.75rem] lg:pt-[5.25rem] overflow-hidden">
      <Header />
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-n-1 mb-4">Redirecting to Scholar...</h2>
          <p className="text-n-3">ViorX content has been moved to the Scholar page.</p>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ViorXPage;
