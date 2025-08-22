import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { 
  Plus, 
  Search, 
  Filter, 
  ChevronDown, 
  Star, 
  Clock, 
  DollarSign, 
  User, 
  Building, 
  GraduationCap,
  Code,
  Database,
  Smartphone,
  Globe,
  Cpu,
  Palette,
  ShoppingCart,
  BookOpen,
  Briefcase,
  ArrowRight,
  CheckCircle2
} from "lucide-react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Section from "../components/Section";
import Heading from "../components/Heading";
import Button from "../components/Button";
import { projectTemplates, projectCategories, servicePackages } from "../constants/projectData";

const ProjectRequestPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [requestType, setRequestType] = useState("new"); // "new" or "existing"
  const [userType, setUserType] = useState("student"); // "student", "client", "business"
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedProject, setSelectedProject] = useState(null);
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    document.title = "Request Project - PRITECH VIOR | Custom Software Development";
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute("content", "Request custom software development projects. Choose from existing templates or describe your unique requirements. Student discounts available.");
    }
  }, []);

  const categoryIcons = {
    "Web Development": Globe,
    "Mobile Development": Smartphone,
    "Desktop Applications": Cpu,
    "Database Systems": Database,
    "E-Commerce": ShoppingCart,
    "E-Learning": BookOpen,
    "Management Systems": Briefcase,
    "UI/UX Design": Palette,
    "Final Year Projects": GraduationCap,
    "Mini Projects": Code
  };

  const filteredProjects = projectTemplates.filter(project => {
    const matchesSearch = project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         project.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "All" || project.category === selectedCategory;
    const matchesUserType = project.suitableFor.includes(userType);
    return matchesSearch && matchesCategory && matchesUserType;
  });

  const handleProjectSelect = (project) => {
    setSelectedProject(project);
    navigate("/project-request/customize", { 
      state: { 
        project, 
        userType, 
        requestType: "existing" 
      } 
    });
  };

  const handleNewProjectRequest = () => {
    navigate("/project-request/new", { 
      state: { 
        userType, 
        requestType: "new" 
      } 
    });
  };

  const getUserTypeColor = (type) => {
    switch(type) {
      case "student": return "text-green-400 bg-green-400/10";
      case "client": return "text-blue-400 bg-blue-400/10";
      case "business": return "text-purple-400 bg-purple-400/10";
      default: return "text-n-1 bg-n-6/10";
    }
  };

  const getPriceRange = (project, userType) => {
    const basePrice = project.estimatedPrice;
    if (userType === "student") {
      return `TSH ${(basePrice * 0.7).toLocaleString()} - ${(basePrice * 0.8).toLocaleString()}`;
    } else if (userType === "business") {
      return `TSH ${(basePrice * 1.2).toLocaleString()} - ${(basePrice * 1.5).toLocaleString()}`;
    }
    return `TSH ${basePrice.toLocaleString()} - ${(basePrice * 1.2).toLocaleString()}`;
  };

  return (
    <>
      <Header />
      <Section className="pt-[4.75rem] lg:pt-[5.25rem] overflow-hidden">
        <div className="container relative z-1">
          {/* Header Section */}
          <div className="max-w-[50rem] mx-auto mb-12 lg:mb-16 text-center">
            <Heading
              className="md:max-w-md lg:max-w-2xl"
              title="Request Your Custom Project"
            />
            <p className="body-1 max-w-3xl mx-auto mb-6 text-n-2 lg:mb-8">
              Whether you need a completely new solution or want to customize an existing project, 
              we're here to bring your ideas to life with professional development services.
            </p>
          </div>

          {/* User Type Selection */}
          <div className="max-w-4xl mx-auto mb-12">
            <div className="text-center mb-6">
              <h3 className="h4 mb-4">I am a...</h3>
              <div className="flex flex-wrap justify-center gap-4">
                {[
                  { type: "student", label: "Student", icon: GraduationCap, desc: "Academic projects with student pricing" },
                  { type: "client", label: "Individual Client", icon: User, desc: "Personal or small business projects" },
                  { type: "business", label: "Business", icon: Building, desc: "Enterprise solutions and systems" }
                ].map(({ type, label, icon: Icon, desc }) => (
                  <button
                    key={type}
                    onClick={() => setUserType(type)}
                    className={`p-6 rounded-xl border transition-all duration-300 min-w-[200px] ${
                      userType === type 
                        ? "border-color-1 bg-color-1/10 shadow-lg" 
                        : "border-n-6 hover:border-n-4 hover:bg-n-7/50"
                    }`}
                  >
                    <Icon className={`w-8 h-8 mx-auto mb-3 ${userType === type ? "text-color-1" : "text-n-4"}`} />
                    <h4 className="h6 mb-2">{label}</h4>
                    <p className="body-2 text-n-4">{desc}</p>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Request Type Selection */}
          <div className="max-w-6xl mx-auto mb-12">
            <div className="grid md:grid-cols-2 gap-8">
              {/* New Project Card */}
              <div className={`p-8 rounded-xl border-2 transition-all duration-300 cursor-pointer ${
                requestType === "new" 
                  ? "border-color-1 bg-color-1/5 shadow-lg" 
                  : "border-n-6 hover:border-n-4 hover:bg-n-7/30"
              }`} onClick={() => setRequestType("new")}>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center">
                    <Plus className="w-8 h-8 text-color-1 mr-3" />
                    <h3 className="h4">New Custom Project</h3>
                  </div>
                  <CheckCircle2 className={`w-6 h-6 ${requestType === "new" ? "text-color-1" : "text-n-6"}`} />
                </div>
                <p className="body-1 text-n-3 mb-6">
                  Describe your unique requirements and we'll build a completely custom solution from scratch.
                </p>
                <ul className="space-y-2 mb-6">
                  <li className="flex items-center text-n-4">
                    <CheckCircle2 className="w-4 h-4 text-green-400 mr-2" />
                    Fully customized to your needs
                  </li>
                  <li className="flex items-center text-n-4">
                    <CheckCircle2 className="w-4 h-4 text-green-400 mr-2" />
                    Technology stack of your choice
                  </li>
                  <li className="flex items-center text-n-4">
                    <CheckCircle2 className="w-4 h-4 text-green-400 mr-2" />
                    Complete ownership of source code
                  </li>
                </ul>
                <Button 
                  className="w-full" 
                  onClick={handleNewProjectRequest}
                  disabled={requestType !== "new"}
                >
                  Start New Project
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>

              {/* Existing Project Card */}
              <div className={`p-8 rounded-xl border-2 transition-all duration-300 cursor-pointer ${
                requestType === "existing" 
                  ? "border-color-1 bg-color-1/5 shadow-lg" 
                  : "border-n-6 hover:border-n-4 hover:bg-n-7/30"
              }`} onClick={() => setRequestType("existing")}>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center">
                    <Star className="w-8 h-8 text-color-1 mr-3" />
                    <h3 className="h4">Customize Existing Project</h3>
                  </div>
                  <CheckCircle2 className={`w-6 h-6 ${requestType === "existing" ? "text-color-1" : "text-n-6"}`} />
                </div>
                <p className="body-1 text-n-3 mb-6">
                  Choose from our proven project templates and customize them to match your specific requirements.
                </p>
                <ul className="space-y-2 mb-6">
                  <li className="flex items-center text-n-4">
                    <CheckCircle2 className="w-4 h-4 text-green-400 mr-2" />
                    Faster development timeline
                  </li>
                  <li className="flex items-center text-n-4">
                    <CheckCircle2 className="w-4 h-4 text-green-400 mr-2" />
                    Proven architecture and features
                  </li>
                  <li className="flex items-center text-n-4">
                    <CheckCircle2 className="w-4 h-4 text-green-400 mr-2" />
                    Cost-effective solution
                  </li>
                </ul>
                <Button 
                  className="w-full" 
                  onClick={() => setRequestType("existing")}
                  white={requestType !== "existing"}
                >
                  Browse Templates
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </div>
          </div>

          {/* Project Templates Section - Only show when "existing" is selected */}
          {requestType === "existing" && (
            <>
              {/* Search and Filter Bar */}
              <div className="max-w-6xl mx-auto mb-8">
                <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
                  <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-n-4 w-5 h-5" />
                    <input
                      type="text"
                      placeholder="Search project templates..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 bg-n-7 border border-n-6 rounded-lg text-n-1 placeholder-n-4 focus:border-color-1 focus:outline-none"
                    />
                  </div>
                  
                  <div className="flex gap-4">
                    <div className="relative">
                      <select
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                        className="appearance-none bg-n-7 border border-n-6 rounded-lg px-4 py-3 pr-10 text-n-1 focus:border-color-1 focus:outline-none min-w-[180px]"
                      >
                        <option value="All">All Categories</option>
                        {projectCategories.map(category => (
                          <option key={category} value={category}>{category}</option>
                        ))}
                      </select>
                      <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-n-4 w-5 h-5 pointer-events-none" />
                    </div>
                  </div>
                </div>

                {/* User Type Badge */}
                <div className="mt-4 flex items-center justify-center">
                  <span className={`px-4 py-2 rounded-full text-sm font-medium ${getUserTypeColor(userType)}`}>
                    {userType === "student" && "Student Pricing Applied"}
                    {userType === "client" && "Individual Client Rates"}
                    {userType === "business" && "Enterprise Pricing"}
                  </span>
                </div>
              </div>

              {/* Project Templates Grid */}
              <div className="max-w-6xl mx-auto">
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredProjects.map((project) => {
                    const IconComponent = categoryIcons[project.category] || Code;
                    return (
                      <div
                        key={project.id}
                        className="group p-6 bg-n-7 rounded-xl border border-n-6 hover:border-color-1 hover:bg-n-6/50 transition-all duration-300 cursor-pointer"
                        onClick={() => handleProjectSelect(project)}
                      >
                        <div className="flex items-start justify-between mb-4">
                          <IconComponent className="w-8 h-8 text-color-1 flex-shrink-0" />
                          <div className="flex items-center space-x-2">
                            <span className="text-xs px-2 py-1 bg-color-1/20 text-color-1 rounded-full">
                              {project.difficulty}
                            </span>
                          </div>
                        </div>

                        <h3 className="h6 mb-2 group-hover:text-color-1 transition-colors">
                          {project.title}
                        </h3>
                        
                        <p className="body-2 text-n-4 mb-4 line-clamp-3">
                          {project.description}
                        </p>

                        <div className="space-y-2 mb-4">
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-n-4">Timeline:</span>
                            <span className="text-n-2">{project.timeline}</span>
                          </div>
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-n-4">Price Range:</span>
                            <span className="text-green-400 font-medium">
                              {getPriceRange(project, userType)}
                            </span>
                          </div>
                        </div>

                        <div className="flex flex-wrap gap-1 mb-4">
                          {project.technologies.slice(0, 3).map((tech, index) => (
                            <span
                              key={index}
                              className="text-xs px-2 py-1 bg-n-6 text-n-3 rounded"
                            >
                              {tech}
                            </span>
                          ))}
                          {project.technologies.length > 3 && (
                            <span className="text-xs px-2 py-1 bg-n-6 text-n-3 rounded">
                              +{project.technologies.length - 3} more
                            </span>
                          )}
                        </div>

                        <Button className="w-full" white>
                          Customize This Project
                          <ArrowRight className="w-4 h-4 ml-2" />
                        </Button>
                      </div>
                    );
                  })}
                </div>

                {filteredProjects.length === 0 && (
                  <div className="text-center py-12">
                    <Search className="w-16 h-16 text-n-4 mx-auto mb-4" />
                    <h3 className="h5 mb-2">No projects found</h3>
                    <p className="body-1 text-n-4 mb-6">
                      Try adjusting your search criteria or browse all categories.
                    </p>
                    <Button onClick={() => {
                      setSearchTerm("");
                      setSelectedCategory("All");
                    }}>
                      Clear Filters
                    </Button>
                  </div>
                )}
              </div>
            </>
          )}

          {/* Service Packages Preview */}
          {userType === "student" && (
            <div className="max-w-6xl mx-auto mt-16">
              <div className="text-center mb-8">
                <h3 className="h4 mb-4">Special Student Support Packages</h3>
                <p className="body-1 text-n-4">
                  Comprehensive support for your academic journey from proposal to publication
                </p>
              </div>
              
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {servicePackages.student.map((pkg) => (
                  <div key={pkg.id} className="p-6 bg-n-7 rounded-xl border border-n-6">
                    <div className="flex items-center mb-4">
                      <GraduationCap className="w-6 h-6 text-color-1 mr-2" />
                      <h4 className="h6">{pkg.name}</h4>
                    </div>
                    <p className="body-2 text-n-4 mb-4">{pkg.description}</p>
                    <div className="text-2xl font-bold text-color-1 mb-4">
                      TSH {pkg.price.toLocaleString()}
                    </div>
                    <ul className="space-y-2">
                      {pkg.features.slice(0, 4).map((feature, index) => (
                        <li key={index} className="flex items-center text-sm text-n-4">
                          <CheckCircle2 className="w-4 h-4 text-green-400 mr-2 flex-shrink-0" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </Section>
      <Footer />
    </>
  );
};

export default ProjectRequestPage;
