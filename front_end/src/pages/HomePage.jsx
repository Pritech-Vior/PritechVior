import Header from "../components/Header";
import Hero from "../components/Hero";
import Benefits from "../components/Benefits";
import Collaboration from "../components/Collaboration";
import Services from "../components/Services";
import Projects from "../components/Projects";
import Roadmap from "../components/Roadmap";
import About from "../components/About";
import Contact from "../components/Contact";
import Footer from "../components/Footer";

const HomePage = () => {
  return (
    <div className="pt-[4.75rem] lg:pt-[5.25rem] overflow-hidden">
      <Header />
      <Hero />
      <Benefits />
      <Collaboration />
      <Services />
      <Projects />
      <Roadmap />
      <About />
      <Contact />
      <Footer />
    </div>
  );
};

export default HomePage;
