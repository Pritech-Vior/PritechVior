import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  Star,
  Clock,
  DollarSign,
  CheckCircle2,
  Users,
  Code,
  Database,
  Smartphone,
  Globe,
  Cpu,
  Palette,
  ShoppingCart,
  BookOpen,
  Briefcase,
  ExternalLink,
  Heart,
  Share2,
  Download,
  Play,
} from "lucide-react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Section from "../components/Section";
import Heading from "../components/Heading";
import SimpleButton from "../components/SimpleButton";
import { projectTemplates } from "../constants/projectData";

const ProjectDetailPage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [selectedUserType, setSelectedUserType] = useState("student");
  const [isLiked, setIsLiked] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    // Find project by slug (convert title to slug format)
    const foundProject = projectTemplates.find(
      (p) =>
        p.title
          .toLowerCase()
          .replace(/\s+/g, "-")
          .replace(/[^\w-]/g, "") === slug
    );

    if (foundProject) {
      setProject(foundProject);
      document.title = `${foundProject.title} - PRITECH VIOR`;
    } else {
      navigate("/projects");
    }
  }, [slug, navigate]);

  const categoryIcons = {
    "Web Development": Globe,
    "Mobile Development": Smartphone,
    "Desktop Applications": Cpu,
    "Database Systems": Database,
    "E-Commerce": ShoppingCart,
    "E-Learning": BookOpen,
    "Management Systems": Briefcase,
    "UI/UX Design": Palette,
  };

  const getPriceRange = (project, userType) => {
    const basePrice = project.estimatedPrice;
    if (userType === "student") {
      return `TSH ${(basePrice * 0.7).toLocaleString()} - ${(
        basePrice * 0.8
      ).toLocaleString()}`;
    } else if (userType === "business") {
      return `TSH ${(basePrice * 1.2).toLocaleString()} - ${(
        basePrice * 1.5
      ).toLocaleString()}`;
    }
    return `TSH ${basePrice.toLocaleString()} - ${(
      basePrice * 1.2
    ).toLocaleString()}`;
  };

  const handleCustomizeProject = () => {
    navigate("/project-request/customize", {
      state: {
        project,
        userType: selectedUserType,
        requestType: "existing",
      },
    });
  };

  const handleNewProject = () => {
    navigate("/project-request/new", {
      state: {
        userType: selectedUserType,
        requestType: "new",
      },
    });
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case "Beginner":
        return "text-green-400 bg-green-400/10";
      case "Intermediate":
        return "text-yellow-400 bg-yellow-400/10";
      case "Advanced":
        return "text-red-400 bg-red-400/10";
      default:
        return "text-n-1 bg-n-6/10";
    }
  };

  const getUserTypeColor = (type) => {
    switch (type) {
      case "student":
        return "text-green-400 bg-green-400/10";
      case "client":
        return "text-blue-400 bg-blue-400/10";
      case "business":
        return "text-purple-400 bg-purple-400/10";
      default:
        return "text-n-1 bg-n-6/10";
    }
  };

  if (!project) {
    return (
      <>
        <Header />
        <Section className="pt-[4.75rem] lg:pt-[5.25rem]">
          <div className="container text-center">
            <h2 className="h2 mb-4">Project Not Found</h2>
            <p className="body-1 text-n-4 mb-6">
              The project you are looking for does not exist.
            </p>
            <SimpleButton onClick={() => navigate("/projects")}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Projects
            </SimpleButton>
          </div>
        </Section>
        <Footer />
      </>
    );
  }

  const CategoryIcon = categoryIcons[project.category] || Code;

  return (
    <>
      <Header />
      <Section className="pt-[4.75rem] lg:pt-[5.25rem] overflow-hidden">
        <div className="container relative z-1">
          {/* Breadcrumb */}
          <div className="mb-8">
            <nav className="flex items-center space-x-2 text-sm text-n-4">
              <button
                onClick={() => navigate("/")}
                className="hover:text-color-1"
              >
                Home
              </button>
              <span>/</span>
              <button
                onClick={() => navigate("/projects")}
                className="hover:text-color-1"
              >
                Projects
              </button>
              <span>/</span>
              <span className="text-n-2">{project.title}</span>
            </nav>
          </div>

          {/* Project Header */}
          <div className="max-w-6xl mx-auto mb-12">
            <div className="grid lg:grid-cols-3 gap-8">
              {/* Main Content */}
              <div className="lg:col-span-2">
                <div className="flex items-start justify-between mb-6">
                  <div className="flex items-center">
                    <CategoryIcon className="w-12 h-12 text-color-1 mr-4" />
                    <div>
                      <h1 className="h2 mb-2">{project.title}</h1>
                      <div className="flex items-center space-x-4">
                        <span className="text-sm px-3 py-1 bg-color-1/20 text-color-1 rounded-full">
                          {project.category}
                        </span>
                        <span
                          className={`text-sm px-3 py-1 rounded-full ${getDifficultyColor(
                            project.difficulty
                          )}`}
                        >
                          {project.difficulty}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => setIsLiked(!isLiked)}
                      className={`p-2 rounded-full border transition-colors ${
                        isLiked
                          ? "border-red-400 bg-red-400/10 text-red-400"
                          : "border-n-6 hover:border-n-4 text-n-4"
                      }`}
                    >
                      <Heart
                        className={`w-5 h-5 ${isLiked ? "fill-current" : ""}`}
                      />
                    </button>
                    <button className="p-2 rounded-full border border-n-6 hover:border-n-4 text-n-4">
                      <Share2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                <p className="body-1 text-n-3 mb-8">{project.description}</p>

                {/* Tabs */}
                <div className="border-b border-n-6 mb-8">
                  <nav className="flex space-x-8">
                    {[
                      { id: "overview", label: "Overview" },
                      { id: "features", label: "Features" },
                      { id: "technologies", label: "Technologies" },
                      { id: "support", label: "Support Services" },
                    ].map(({ id, label }) => (
                      <button
                        key={id}
                        onClick={() => setActiveTab(id)}
                        className={`py-4 px-2 border-b-2 font-medium text-sm transition-colors ${
                          activeTab === id
                            ? "border-color-1 text-color-1"
                            : "border-transparent text-n-4 hover:text-n-2"
                        }`}
                      >
                        {label}
                      </button>
                    ))}
                  </nav>
                </div>

                {/* Tab Content */}
                <div className="mb-8">
                  {activeTab === "overview" && (
                    <div className="space-y-6">
                      <div>
                        <h3 className="h5 mb-4">Project Overview</h3>
                        <p className="text-n-3 mb-4">{project.description}</p>

                        <div className="grid md:grid-cols-2 gap-6">
                          <div className="bg-n-7 rounded-xl p-6 border border-n-6">
                            <h4 className="h6 mb-3">Project Specifications</h4>
                            <div className="space-y-2 text-sm">
                              <div className="flex justify-between">
                                <span className="text-n-4">Timeline:</span>
                                <span className="text-n-2">
                                  {project.timeline}
                                </span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-n-4">Difficulty:</span>
                                <span className="text-n-2">
                                  {project.difficulty}
                                </span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-n-4">Category:</span>
                                <span className="text-n-2">
                                  {project.category}
                                </span>
                              </div>
                            </div>
                          </div>

                          <div className="bg-n-7 rounded-xl p-6 border border-n-6">
                            <h4 className="h6 mb-3">Suitable For</h4>
                            <div className="space-y-2">
                              {project.suitableFor.map((type) => (
                                <div key={type} className="flex items-center">
                                  <CheckCircle2 className="w-4 h-4 text-green-400 mr-2" />
                                  <span className="text-n-3 capitalize">
                                    {type}s
                                  </span>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {activeTab === "features" && (
                    <div>
                      <h3 className="h5 mb-6">Project Features</h3>
                      <div className="grid md:grid-cols-2 gap-4">
                        {project.features.map((feature, index) => (
                          <div
                            key={index}
                            className="flex items-start p-4 bg-n-7 rounded-lg border border-n-6"
                          >
                            <CheckCircle2 className="w-5 h-5 text-green-400 mr-3 mt-0.5 flex-shrink-0" />
                            <span className="text-n-2">{feature}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {activeTab === "technologies" && (
                    <div>
                      <h3 className="h5 mb-6">Technology Stack</h3>
                      <div className="grid md:grid-cols-2 gap-6">
                        <div>
                          <h4 className="h6 mb-4">Core Technologies</h4>
                          <div className="space-y-2">
                            {project.technologies.map((tech, index) => (
                              <div
                                key={index}
                                className="flex items-center p-3 bg-n-7 rounded-lg border border-n-6"
                              >
                                <Code className="w-4 h-4 text-color-1 mr-3" />
                                <span className="text-n-2">{tech}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div>
                          <h4 className="h6 mb-4">Additional Information</h4>
                          <div className="space-y-4">
                            <div className="bg-n-7 rounded-lg p-4 border border-n-6">
                              <h5 className="text-sm font-medium text-n-2 mb-2">
                                Development Environment
                              </h5>
                              <p className="text-n-4 text-sm">
                                Modern development setup with version control,
                                testing frameworks, and deployment pipelines.
                              </p>
                            </div>

                            <div className="bg-n-7 rounded-lg p-4 border border-n-6">
                              <h5 className="text-sm font-medium text-n-2 mb-2">
                                Documentation
                              </h5>
                              <p className="text-n-4 text-sm">
                                Comprehensive technical documentation, user
                                guides, and API documentation included.
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {activeTab === "support" && (
                    <div>
                      <h3 className="h5 mb-6">Available Support Services</h3>

                      {project.supportServices && (
                        <div className="grid md:grid-cols-2 gap-4 mb-8">
                          {Object.entries(project.supportServices)
                            .filter(([_, available]) => available)
                            .map(([service, _]) => (
                              <div
                                key={service}
                                className="flex items-center p-4 bg-n-7 rounded-lg border border-n-6"
                              >
                                <CheckCircle2 className="w-5 h-5 text-green-400 mr-3" />
                                <span className="text-n-2 capitalize">
                                  {service.replace(/([A-Z])/g, " $1").trim()}
                                </span>
                              </div>
                            ))}
                        </div>
                      )}

                      <div className="bg-n-7 rounded-xl p-6 border border-n-6">
                        <h4 className="h6 mb-4">
                          Academic Support (For Students)
                        </h4>
                        <p className="text-n-4 mb-4">
                          Special support packages available for academic
                          projects including proposal writing, defense
                          preparation, and comprehensive documentation.
                        </p>
                        <div className="grid md:grid-cols-3 gap-4">
                          {[
                            "Proposal Writing",
                            "Implementation Support",
                            "Defense Preparation",
                          ].map((service) => (
                            <div
                              key={service}
                              className="text-center p-3 bg-n-8 rounded-lg"
                            >
                              <h5 className="text-sm font-medium text-n-2 mb-1">
                                {service}
                              </h5>
                              <p className="text-xs text-green-400">
                                Available
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                {/* User Type Selection */}
                <div className="bg-n-7 rounded-xl border border-n-6 p-6">
                  <h3 className="h6 mb-4">I am a...</h3>
                  <div className="space-y-3">
                    {[
                      {
                        type: "student",
                        label: "Student",
                        desc: "Academic project with student pricing",
                      },
                      {
                        type: "client",
                        label: "Individual Client",
                        desc: "Personal or small business project",
                      },
                      {
                        type: "business",
                        label: "Business",
                        desc: "Enterprise solution",
                      },
                    ].map(({ type, label, desc }) => (
                      <button
                        key={type}
                        onClick={() => setSelectedUserType(type)}
                        className={`w-full p-4 rounded-lg border transition-all duration-300 text-left ${
                          selectedUserType === type
                            ? "border-color-1 bg-color-1/10"
                            : "border-n-6 hover:border-n-4 hover:bg-n-8/50"
                        }`}
                      >
                        <h4 className="font-medium text-n-1 mb-1">{label}</h4>
                        <p className="text-n-4 text-sm">{desc}</p>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Pricing */}
                <div className="bg-gradient-to-r from-color-1/10 to-color-2/10 rounded-xl border border-color-1/20 p-6">
                  <h3 className="h6 mb-4 flex items-center">
                    <DollarSign className="w-5 h-5 mr-2 text-color-1" />
                    Pricing for {selectedUserType}s
                  </h3>

                  <div className="text-center mb-4">
                    <div className="text-2xl font-bold text-color-1 mb-1">
                      {getPriceRange(project, selectedUserType)}
                    </div>
                    <p className="text-n-4 text-sm">Estimated project cost</p>
                  </div>

                  {selectedUserType === "student" && (
                    <div className="bg-green-400/10 border border-green-400/20 rounded-lg p-3 mb-4">
                      <p className="text-green-400 text-sm font-medium">
                        ✓ 25% Student discount applied
                      </p>
                    </div>
                  )}

                  <div className="space-y-2 text-sm text-n-4 mb-6">
                    <div className="flex items-center">
                      <CheckCircle2 className="w-4 h-4 text-green-400 mr-2" />
                      Full source code included
                    </div>
                    <div className="flex items-center">
                      <CheckCircle2 className="w-4 h-4 text-green-400 mr-2" />
                      Complete documentation
                    </div>
                    <div className="flex items-center">
                      <CheckCircle2 className="w-4 h-4 text-green-400 mr-2" />3
                      months support
                    </div>
                  </div>

                  <SimpleButton
                    className="w-full mb-3"
                    onClick={handleCustomizeProject}
                  >
                    Customize This Project
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </SimpleButton>

                  <SimpleButton
                    className="w-full"
                    variant="secondary"
                    onClick={handleNewProject}
                  >
                    Start New Project Instead
                  </SimpleButton>
                </div>

                {/* Project Stats */}
                <div className="bg-n-7 rounded-xl border border-n-6 p-6">
                  <h3 className="h6 mb-4">Project Information</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <Clock className="w-4 h-4 text-color-1 mr-2" />
                        <span className="text-n-4 text-sm">Timeline</span>
                      </div>
                      <span className="text-n-2 text-sm">
                        {project.timeline}
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <Users className="w-4 h-4 text-color-1 mr-2" />
                        <span className="text-n-4 text-sm">Difficulty</span>
                      </div>
                      <span className="text-n-2 text-sm">
                        {project.difficulty}
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <Star className="w-4 h-4 text-color-1 mr-2" />
                        <span className="text-n-4 text-sm">Rating</span>
                      </div>
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-3 h-3 ${
                              i < 4
                                ? "text-yellow-400 fill-current"
                                : "text-n-6"
                            }`}
                          />
                        ))}
                        <span className="text-n-4 text-xs ml-1">(4.0)</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Course Alignment (for students) */}
                {selectedUserType === "student" && project.courseAlignment && (
                  <div className="bg-n-7 rounded-xl border border-n-6 p-6">
                    <h3 className="h6 mb-4">Course Alignment</h3>
                    <div className="space-y-2">
                      {project.courseAlignment.map((course, index) => (
                        <div key={index} className="flex items-center">
                          <CheckCircle2 className="w-4 h-4 text-green-400 mr-2" />
                          <span className="text-n-3 text-sm">{course}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Quick Actions */}
                <div className="bg-n-7 rounded-xl border border-n-6 p-6">
                  <h3 className="h6 mb-4">Quick Actions</h3>
                  <div className="space-y-3">
                    <button className="w-full flex items-center justify-between p-3 bg-n-8 rounded-lg hover:bg-n-6/50 transition-colors">
                      <span className="text-n-2 text-sm">View Demo</span>
                      <Play className="w-4 h-4 text-color-1" />
                    </button>

                    <button className="w-full flex items-center justify-between p-3 bg-n-8 rounded-lg hover:bg-n-6/50 transition-colors">
                      <span className="text-n-2 text-sm">
                        Download Brochure
                      </span>
                      <Download className="w-4 h-4 text-color-1" />
                    </button>

                    <button className="w-full flex items-center justify-between p-3 bg-n-8 rounded-lg hover:bg-n-6/50 transition-colors">
                      <span className="text-n-2 text-sm">
                        View Similar Projects
                      </span>
                      <ExternalLink className="w-4 h-4 text-color-1" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Related Projects */}
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-8">
              <h2 className="h3 mb-4">Related Projects</h2>
              <p className="body-1 text-n-4">
                Explore other projects in the {project.category} category
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {projectTemplates
                .filter(
                  (p) => p.category === project.category && p.id !== project.id
                )
                .slice(0, 3)
                .map((relatedProject) => {
                  const RelatedIcon =
                    categoryIcons[relatedProject.category] || Code;
                  return (
                    <div
                      key={relatedProject.id}
                      className="group p-6 bg-n-7 rounded-xl border border-n-6 hover:border-color-1 hover:bg-n-6/50 transition-all duration-300 cursor-pointer"
                      onClick={() =>
                        navigate(
                          `/project/${relatedProject.title
                            .toLowerCase()
                            .replace(/\s+/g, "-")
                            .replace(/[^\w-]/g, "")}`
                        )
                      }
                    >
                      <div className="flex items-start justify-between mb-4">
                        <RelatedIcon className="w-8 h-8 text-color-1 flex-shrink-0" />
                        <span className="text-xs px-2 py-1 bg-color-1/20 text-color-1 rounded-full">
                          {relatedProject.difficulty}
                        </span>
                      </div>

                      <h3 className="h6 mb-2 group-hover:text-color-1 transition-colors">
                        {relatedProject.title}
                      </h3>

                      <p className="body-2 text-n-4 mb-4 line-clamp-2">
                        {relatedProject.description}
                      </p>

                      <div className="flex items-center justify-between text-sm">
                        <span className="text-n-4">
                          {relatedProject.timeline}
                        </span>
                        <span className="text-green-400 font-medium">
                          TSH {relatedProject.estimatedPrice.toLocaleString()}
                        </span>
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
        </div>
      </Section>
      <Footer />
    </>
  );
};

export default ProjectDetailPage;
