import { useState, useEffect, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  X,
  DollarSign,
  User,
  Building,
  GraduationCap,
  Database,
  Smartphone,
  Globe,
  Cpu,
  Palette,
  ShoppingCart,
  BookOpen,
  Briefcase,
  Loader2,
} from "lucide-react";
import { toast } from "react-hot-toast";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Section from "../components/Section";
import Heading from "../components/Heading";
import SimpleButton from "../components/SimpleButton";
import { projectsService } from "../services/projectsService";

const NewProjectRequestPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { userType } = location.state || { userType: "student" };

  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = userType === "student" ? 8 : 7; // Added template selection step

  // Backend data
  const [categories, setCategories] = useState([]);
  const [technologies, setTechnologies] = useState([]);
  const [servicePackages, setServicePackages] = useState([]);
  const [courseCategories, setCourseCategories] = useState([]);
  const [requestableProjects, setRequestableProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    // Basic Information
    projectTitle: "",
    projectDescription: "",
    projectCategory: "",
    userType: userType,
    selectedTemplate: "", // Selected project template ID

    // Student-specific fields
    course: "",
    projectType: "",
    isResearchBased: false,
    needsAcademicSupport: false,

    // Technical Requirements
    selectedTechStack: "",
    customTechnologies: [],
    databaseRequired: false,
    databaseType: "",
    hostingRequired: false,

    // Features and Functionality
    coreFeatures: [],
    additionalFeatures: [],
    userRoles: [],

    // Budget and Timeline
    budgetRange: "",
    timeline: "",
    priority: "standard",

    // Support Services
    selectedServices: [],
    hardwareNeeds: [],

    // Contact and Project Details
    contactEmail: "",
    contactPhone: "",
    projectUrgency: "normal",
    additionalNotes: "",
    attachments: [],
  });

  const [estimatedCost, setEstimatedCost] = useState(0);

  // Load backend data
  useEffect(() => {
    const loadBackendData = async () => {
      try {
        setLoading(true);

        const [
          categoriesData,
          technologiesData,
          servicePackagesData,
          courseCategoriesData,
          requestableProjectsData,
        ] = await Promise.all([
          projectsService.getProjectCategories(),
          projectsService.getTechnologyStacks(),
          projectsService.getServicePackages(userType),
          userType === "student"
            ? projectsService.getCourseCategories()
            : Promise.resolve([]),
          projectsService.getRequestableProjects(),
        ]);

        setCategories(categoriesData.results || categoriesData);
        setTechnologies(technologiesData.results || technologiesData);
        setServicePackages(servicePackagesData.results || servicePackagesData);
        setCourseCategories(
          courseCategoriesData.results || courseCategoriesData
        );
        setRequestableProjects(
          requestableProjectsData.results || requestableProjectsData
        );
      } catch (error) {
        console.error("Error loading backend data:", error);
        toast.error("Failed to load form data. Please refresh the page.");
      } finally {
        setLoading(false);
      }
    };

    loadBackendData();
  }, [userType]);

  const calculateEstimatedCost = useCallback(() => {
    let baseCost = 0;

    // Base cost by category and complexity
    const categoryCosts = {
      "Web Development": 1500000,
      "Mobile Development": 2500000,
      "Desktop Applications": 2000000,
      "Database Systems": 1800000,
      "E-Commerce": 3500000,
      "E-Learning": 4000000,
      "Management Systems": 2500000,
      "UI/UX Design": 800000,
    };

    baseCost = categoryCosts[formData.projectCategory] || 2000000;

    // Add service costs from backend data
    const serviceCosts = formData.selectedServices.reduce(
      (total, serviceId) => {
        const service = servicePackages.find((s) => s.id === serviceId);
        return total + (service ? parseInt(service.price) : 0);
      },
      0
    );

    // Add hardware costs (static for now)
    const hardwareList = [
      { id: "laptop", price: 50000 },
      { id: "server", price: 25000 },
      { id: "software", price: 15000 },
    ];
    const hardwareCosts = formData.hardwareNeeds.reduce((total, hardwareId) => {
      const hardware = hardwareList.find((h) => h.id === hardwareId);
      return total + (hardware ? hardware.price : 0);
    }, 0);

    // Apply user type multiplier
    let multiplier = 1;
    if (userType === "student") multiplier = 0.75; // 25% discount
    if (userType === "business") multiplier = 1.3; // 30% premium

    const totalCost = (baseCost + serviceCosts + hardwareCosts) * multiplier;
    setEstimatedCost(totalCost);
  }, [formData, userType, servicePackages]);

  useEffect(() => {
    calculateEstimatedCost();
  }, [calculateEstimatedCost]);

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleArrayToggle = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: prev[field].includes(value)
        ? prev[field].filter((item) => item !== value)
        : [...prev[field], value],
    }));
  };

  const addCustomTechnology = (tech) => {
    if (tech && !formData.customTechnologies.includes(tech)) {
      setFormData((prev) => ({
        ...prev,
        customTechnologies: [...prev.customTechnologies, tech],
      }));
    }
  };

  const removeCustomTechnology = (tech) => {
    setFormData((prev) => ({
      ...prev,
      customTechnologies: prev.customTechnologies.filter((t) => t !== tech),
    }));
  };

  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    try {
      setSubmitting(true);

      // Format the data for the backend
      const requestData = projectsService.formatProjectRequestData(
        {
          title: formData.projectTitle,
          description: formData.projectDescription,
          requirements: formData.specificRequirements,
          additionalFeatures: formData.additionalFeatures.join(", "),
          budget: formData.budgetRange,
          deadline: formData.timeline,
          timelineFlexibility: "flexible", // Default value
          phone: formData.contactPhone,
          email: formData.contactEmail,
          technologies: formData.technologies,
          features: formData.coreFeatures,
          academicLevel: formData.academicLevel,
          institution: formData.institution,
          courseCategory: formData.courseCategory,
          servicePackage: formData.selectedServices[0], // Assuming first selected service
          technologyNotes: formData.additionalNotes,
        },
        userType
      );

      // Submit the project request
      const response = await projectsService.createProjectRequest(requestData);

      toast.success("Project request submitted successfully!");

      // Navigate to confirmation page with the response data
      navigate("/project-request/confirmation", {
        state: {
          formData,
          estimatedCost,
          userType,
          requestId: response.id || response.request_id,
        },
      });
    } catch (error) {
      console.error("Error submitting project request:", error);
      toast.error("Failed to submit project request. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const getUserTypeIcon = () => {
    switch (userType) {
      case "student":
        return GraduationCap;
      case "client":
        return User;
      case "business":
        return Building;
      default:
        return User;
    }
  };

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

  const renderStepContent = () => {
    if (loading) {
      return (
        <div className="max-w-3xl mx-auto text-center py-12">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-color-1" />
          <p className="text-n-4">Loading project requirements...</p>
        </div>
      );
    }

    switch (currentStep) {
      case 1:
        return (
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-8">
              <h3 className="h4 mb-4">Project Basic Information</h3>
              <p className="body-1 text-n-4">
                Tell us about your project vision and requirements
              </p>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-n-2 mb-2">
                  Project Title *
                </label>
                <input
                  type="text"
                  value={formData.projectTitle}
                  onChange={(e) =>
                    handleInputChange("projectTitle", e.target.value)
                  }
                  placeholder="Enter your project title"
                  className="w-full px-4 py-3 bg-n-7 border border-n-6 rounded-lg text-n-1 placeholder-n-4 focus:border-color-1 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-n-2 mb-2">
                  Project Category *
                </label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {Object.keys(categoryIcons).map((category) => {
                    const Icon = categoryIcons[category];
                    return (
                      <button
                        key={category}
                        onClick={() =>
                          handleInputChange("projectCategory", category)
                        }
                        className={`p-4 rounded-lg border transition-all duration-300 ${
                          formData.projectCategory === category
                            ? "border-color-1 bg-color-1/10 text-color-1"
                            : "border-n-6 hover:border-n-4 text-n-4"
                        }`}
                      >
                        <Icon className="w-6 h-6 mx-auto mb-2" />
                        <span className="text-xs font-medium">{category}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-n-2 mb-2">
                  Project Description *
                </label>
                <textarea
                  value={formData.projectDescription}
                  onChange={(e) =>
                    handleInputChange("projectDescription", e.target.value)
                  }
                  placeholder="Describe your project in detail. What problem does it solve? What are the main features you envision?"
                  rows={6}
                  className="w-full px-4 py-3 bg-n-7 border border-n-6 rounded-lg text-n-1 placeholder-n-4 focus:border-color-1 focus:outline-none resize-vertical"
                />
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="bg-n-7 p-8 rounded-xl border border-n-6">
            <h3 className="h4 mb-4">Project Templates (Optional)</h3>
            <p className="text-n-3 mb-6">
              Choose from our existing projects as a starting point, or start
              from scratch.
            </p>

            <div className="space-y-4">
              <div>
                <label className="flex items-center p-4 rounded-lg border border-n-6 hover:bg-n-6/50 cursor-pointer">
                  <input
                    type="radio"
                    name="templateChoice"
                    value=""
                    checked={formData.selectedTemplate === ""}
                    onChange={() => handleInputChange("selectedTemplate", "")}
                    className="w-4 h-4 text-color-1 bg-n-7 border-n-6 focus:ring-color-1"
                  />
                  <div className="ml-3">
                    <span className="text-n-2 font-medium">
                      Start from scratch
                    </span>
                    <p className="text-n-4 text-sm">
                      Create a completely custom project
                    </p>
                  </div>
                </label>
              </div>

              {requestableProjects.length > 0 && (
                <div className="space-y-3">
                  <h4 className="text-n-2 font-medium">
                    Use existing project as template:
                  </h4>
                  {requestableProjects.map((project) => (
                    <label
                      key={project.id}
                      className="flex items-start p-4 rounded-lg border border-n-6 hover:bg-n-6/50 cursor-pointer"
                    >
                      <input
                        type="radio"
                        name="templateChoice"
                        value={project.id}
                        checked={formData.selectedTemplate === project.id}
                        onChange={() =>
                          handleInputChange("selectedTemplate", project.id)
                        }
                        className="w-4 h-4 text-color-1 bg-n-7 border-n-6 focus:ring-color-1 mt-1"
                      />
                      <div className="ml-3 flex-1">
                        <span className="text-n-2 font-medium">
                          {project.title}
                        </span>
                        <p className="text-n-4 text-sm mt-1">
                          {project.description}
                        </p>
                        <div className="flex items-center gap-4 mt-2">
                          <div className="flex items-center gap-2">
                            <span className="w-2 h-2 bg-color-1 rounded-full"></span>
                            <span className="text-n-4 text-xs">
                              {project.category?.name}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="w-2 h-2 bg-color-2 rounded-full"></span>
                            <span className="text-n-4 text-xs">
                              {project.user_type}
                            </span>
                          </div>
                          {project.budget && (
                            <div className="flex items-center gap-2">
                              <span className="w-2 h-2 bg-n-4 rounded-full"></span>
                              <span className="text-n-4 text-xs">
                                TSH {parseInt(project.budget).toLocaleString()}
                              </span>
                            </div>
                          )}
                        </div>
                        {project.technologies &&
                          project.technologies.length > 0 && (
                            <div className="flex flex-wrap gap-1 mt-2">
                              {project.technologies.slice(0, 3).map((tech) => (
                                <span
                                  key={tech.id}
                                  className="text-xs px-2 py-1 bg-n-6 text-n-3 rounded"
                                >
                                  {tech.name}
                                </span>
                              ))}
                              {project.technologies.length > 3 && (
                                <span className="text-xs px-2 py-1 bg-n-6 text-n-3 rounded">
                                  +{project.technologies.length - 3} more
                                </span>
                              )}
                            </div>
                          )}
                      </div>
                    </label>
                  ))}
                </div>
              )}

              {requestableProjects.length === 0 && (
                <div className="text-center py-8 text-n-4">
                  <p>No project templates available at the moment.</p>
                  <p className="text-sm">
                    You can still create a custom project from scratch.
                  </p>
                </div>
              )}
            </div>
          </div>
        );

      case 3:
        return userType === "student" ? (
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-8">
              <h3 className="h4 mb-4">Academic Information</h3>
              <p className="body-1 text-n-4">
                Help us understand your academic requirements
              </p>
            </div>

            <div className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-n-2 mb-2">
                    Course/Program *
                  </label>
                  <select
                    value={formData.course}
                    onChange={(e) =>
                      handleInputChange("course", e.target.value)
                    }
                    className="w-full px-4 py-3 bg-n-7 border border-n-6 rounded-lg text-n-1 focus:border-color-1 focus:outline-none"
                  >
                    <option value="">Select your course</option>
                    {courseCategories.student.map((course) => (
                      <option key={course} value={course}>
                        {course}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-n-2 mb-2">
                    Project Type *
                  </label>
                  <select
                    value={formData.projectType}
                    onChange={(e) =>
                      handleInputChange("projectType", e.target.value)
                    }
                    className="w-full px-4 py-3 bg-n-7 border border-n-6 rounded-lg text-n-1 focus:border-color-1 focus:outline-none"
                  >
                    <option value="">Select project type</option>
                    {categories
                      .filter(
                        (cat) =>
                          cat.user_type === userType || cat.user_type === "all"
                      )
                      .map((category) => (
                        <option key={category.id} value={category.name}>
                          {category.name}
                        </option>
                      ))}
                  </select>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="researchBased"
                    checked={formData.isResearchBased}
                    onChange={(e) =>
                      handleInputChange("isResearchBased", e.target.checked)
                    }
                    className="w-4 h-4 text-color-1 bg-n-7 border-n-6 rounded focus:ring-color-1"
                  />
                  <label htmlFor="researchBased" className="ml-2 text-n-2">
                    This is a research-based project requiring data collection
                    and analysis
                  </label>
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="academicSupport"
                    checked={formData.needsAcademicSupport}
                    onChange={(e) =>
                      handleInputChange(
                        "needsAcademicSupport",
                        e.target.checked
                      )
                    }
                    className="w-4 h-4 text-color-1 bg-n-7 border-n-6 rounded focus:ring-color-1"
                  />
                  <label htmlFor="academicSupport" className="ml-2 text-n-2">
                    I need academic support (proposal writing, defense
                    preparation, etc.)
                  </label>
                </div>
              </div>
            </div>
          </div>
        ) : (
          // Skip to technical requirements for non-students
          renderTechnicalRequirements()
        );

      case 4:
        return (
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-8">
              <h3 className="h4 mb-4">Choose a Project Template (Optional)</h3>
              <p className="body-1 text-n-4">
                Start with one of our existing projects or create from scratch
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div
                onClick={() => handleInputChange("selectedTemplate", null)}
                className={`p-6 rounded-xl border cursor-pointer transition-all duration-300 ${
                  !formData.selectedTemplate
                    ? "border-color-1 bg-color-1/10"
                    : "border-n-6 hover:border-n-4 hover:bg-n-7/50"
                }`}
              >
                <div className="text-center">
                  <div className="w-16 h-16 bg-n-6 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl">✨</span>
                  </div>
                  <h4 className="font-medium text-n-1 mb-2">
                    Start from Scratch
                  </h4>
                  <p className="text-sm text-n-4">
                    Create a completely custom project based on your
                    requirements
                  </p>
                </div>
              </div>

              {requestableProjects.map((project) => (
                <div
                  key={project.id}
                  onClick={() =>
                    handleInputChange("selectedTemplate", project.id)
                  }
                  className={`p-6 rounded-xl border cursor-pointer transition-all duration-300 ${
                    formData.selectedTemplate === project.id
                      ? "border-color-1 bg-color-1/10"
                      : "border-n-6 hover:border-n-4 hover:bg-n-7/50"
                  }`}
                >
                  <h4 className="font-medium text-n-1 mb-2">{project.title}</h4>
                  <p className="text-sm text-n-4 mb-4 line-clamp-3">
                    {project.description}
                  </p>
                  <div className="flex items-center justify-between text-xs text-n-3">
                    <span>{project.category?.name}</span>
                    <span className="text-color-1">Customize</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case 5:
        return renderTechnicalRequirements();

      case 6:
        return renderFeaturesAndFunctionality();

      case 7:
        return renderBudgetAndTimeline();

      case 8:
        return renderSupportServices();

      default:
        return null;
    }
  };

  const renderTechnicalRequirements = () => (
    <div className="max-w-3xl mx-auto">
      <div className="text-center mb-8">
        <h3 className="h4 mb-4">Technical Requirements</h3>
        <p className="body-1 text-n-4">
          Choose the technology stack and technical specifications
        </p>
      </div>

      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-n-2 mb-3">
            Technology Stack *
          </label>
          <div className="space-y-3">
            {technologies
              .filter(
                (tech) =>
                  tech.user_type === userType || tech.user_type === "all"
              )
              .map((tech) => (
                <div
                  key={tech.id}
                  onClick={() =>
                    handleInputChange("selectedTechStack", tech.id)
                  }
                  className={`p-4 rounded-lg border cursor-pointer transition-all duration-300 ${
                    formData.selectedTechStack === tech.id
                      ? "border-color-1 bg-color-1/10"
                      : "border-n-6 hover:border-n-4 hover:bg-n-7/50"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-n-1 mb-1">{tech.name}</h4>
                      <p className="text-sm text-n-3 mb-2">
                        {tech.description}
                      </p>
                    </div>
                    <CheckCircle2
                      className={`w-5 h-5 ${
                        formData.selectedTechStack === tech.id
                          ? "text-color-1"
                          : "text-n-6"
                      }`}
                    />
                  </div>
                </div>
              ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-n-2 mb-2">
            Additional Technologies
          </label>
          <div className="flex flex-wrap gap-2 mb-3">
            {formData.customTechnologies.map((tech) => (
              <span
                key={tech}
                className="inline-flex items-center px-3 py-1 bg-color-1/20 text-color-1 rounded-full text-sm"
              >
                {tech}
                <button
                  onClick={() => removeCustomTechnology(tech)}
                  className="ml-2 text-color-1/70 hover:text-color-1"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
          </div>
          <input
            type="text"
            placeholder="Add custom technology (press Enter)"
            onKeyPress={(e) => {
              if (e.key === "Enter") {
                addCustomTechnology(e.target.value);
                e.target.value = "";
              }
            }}
            className="w-full px-4 py-3 bg-n-7 border border-n-6 rounded-lg text-n-1 placeholder-n-4 focus:border-color-1 focus:outline-none"
          />
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <div className="flex items-center mb-3">
              <input
                type="checkbox"
                id="databaseRequired"
                checked={formData.databaseRequired}
                onChange={(e) =>
                  handleInputChange("databaseRequired", e.target.checked)
                }
                className="w-4 h-4 text-color-1 bg-n-7 border-n-6 rounded focus:ring-color-1"
              />
              <label htmlFor="databaseRequired" className="ml-2 text-n-2">
                Database Required
              </label>
            </div>
            {formData.databaseRequired && (
              <select
                value={formData.databaseType}
                onChange={(e) =>
                  handleInputChange("databaseType", e.target.value)
                }
                className="w-full px-4 py-3 bg-n-7 border border-n-6 rounded-lg text-n-1 focus:border-color-1 focus:outline-none"
              >
                <option value="">Select database type</option>
                <option value="MySQL">MySQL</option>
                <option value="PostgreSQL">PostgreSQL</option>
                <option value="MongoDB">MongoDB</option>
                <option value="SQLite">SQLite</option>
                <option value="Firebase">Firebase</option>
              </select>
            )}
          </div>

          <div>
            <div className="flex items-center">
              <input
                type="checkbox"
                id="hostingRequired"
                checked={formData.hostingRequired}
                onChange={(e) =>
                  handleInputChange("hostingRequired", e.target.checked)
                }
                className="w-4 h-4 text-color-1 bg-n-7 border-n-6 rounded focus:ring-color-1"
              />
              <label htmlFor="hostingRequired" className="ml-2 text-n-2">
                Hosting & Deployment Required
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderFeaturesAndFunctionality = () => (
    <div className="max-w-3xl mx-auto">
      <div className="text-center mb-8">
        <h3 className="h4 mb-4">Features & Functionality</h3>
        <p className="body-1 text-n-4">
          Define the core features and user roles for your project
        </p>
      </div>

      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-n-2 mb-3">
            Core Features (Select all that apply)
          </label>
          <div className="grid md:grid-cols-2 gap-3">
            {[
              "User Authentication",
              "Admin Dashboard",
              "Database Management",
              "File Upload/Download",
              "Search Functionality",
              "Reporting System",
              "Email Notifications",
              "Payment Integration",
              "API Integration",
              "Real-time Updates",
              "Mobile Responsive",
              "Data Analytics",
            ].map((feature) => (
              <label
                key={feature}
                className="flex items-center p-3 rounded-lg border border-n-6 hover:bg-n-7/50 cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={formData.coreFeatures.includes(feature)}
                  onChange={() => handleArrayToggle("coreFeatures", feature)}
                  className="w-4 h-4 text-color-1 bg-n-7 border-n-6 rounded focus:ring-color-1"
                />
                <span className="ml-3 text-n-2">{feature}</span>
              </label>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-n-2 mb-3">
            User Roles & Access Levels
          </label>
          <div className="grid md:grid-cols-3 gap-3">
            {[
              "Administrator",
              "Regular User",
              "Guest User",
              "Manager",
              "Employee",
              "Customer",
              "Vendor",
              "Moderator",
            ].map((role) => (
              <label
                key={role}
                className="flex items-center p-3 rounded-lg border border-n-6 hover:bg-n-7/50 cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={formData.userRoles.includes(role)}
                  onChange={() => handleArrayToggle("userRoles", role)}
                  className="w-4 h-4 text-color-1 bg-n-7 border-n-6 rounded focus:ring-color-1"
                />
                <span className="ml-3 text-n-2 text-sm">{role}</span>
              </label>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-n-2 mb-2">
            Additional Feature Requirements
          </label>
          <textarea
            value={formData.additionalFeatures.join("\n")}
            onChange={(e) =>
              handleInputChange(
                "additionalFeatures",
                e.target.value.split("\n").filter((f) => f.trim())
              )
            }
            placeholder="Describe any specific features or functionality you need (one per line)"
            rows={4}
            className="w-full px-4 py-3 bg-n-7 border border-n-6 rounded-lg text-n-1 placeholder-n-4 focus:border-color-1 focus:outline-none resize-vertical"
          />
        </div>
      </div>
    </div>
  );

  const renderBudgetAndTimeline = () => (
    <div className="max-w-3xl mx-auto">
      <div className="text-center mb-8">
        <h3 className="h4 mb-4">Budget & Timeline</h3>
        <p className="body-1 text-n-4">
          Set your budget expectations and project timeline
        </p>
      </div>

      <div className="space-y-6">
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-n-2 mb-2">
              Budget Range (TSH) *
            </label>
            <select
              value={formData.budgetRange}
              onChange={(e) => handleInputChange("budgetRange", e.target.value)}
              className="w-full px-4 py-3 bg-n-7 border border-n-6 rounded-lg text-n-1 focus:border-color-1 focus:outline-none"
            >
              <option value="">Select budget range</option>
              {userType === "student" ? (
                <>
                  <option value="25000-100000">25K - 100K</option>
                  <option value="100000-300000">100K - 300K</option>
                  <option value="300000-500000">300K - 500K</option>
                  <option value="500000+">500K+</option>
                </>
              ) : userType === "client" ? (
                <>
                  <option value="1000000-2000000">1M - 2M</option>
                  <option value="2000000-5000000">2M - 5M</option>
                  <option value="5000000-10000000">5M - 10M</option>
                  <option value="10000000+">10M+</option>
                </>
              ) : (
                <>
                  <option value="5000000-10000000">5M - 10M</option>
                  <option value="10000000-20000000">10M - 20M</option>
                  <option value="20000000-50000000">20M - 50M</option>
                  <option value="50000000+">50M+</option>
                </>
              )}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-n-2 mb-2">
              Project Timeline *
            </label>
            <select
              value={formData.timeline}
              onChange={(e) => handleInputChange("timeline", e.target.value)}
              className="w-full px-4 py-3 bg-n-7 border border-n-6 rounded-lg text-n-1 focus:border-color-1 focus:outline-none"
            >
              <option value="">Select timeline</option>
              <option value="1-2 weeks">1-2 weeks</option>
              <option value="3-4 weeks">3-4 weeks</option>
              <option value="1-2 months">1-2 months</option>
              <option value="3-4 months">3-4 months</option>
              <option value="6+ months">6+ months</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-n-2 mb-3">
            Project Priority
          </label>
          <div className="grid grid-cols-3 gap-3">
            {[
              {
                id: "standard",
                label: "Standard",
                desc: "Normal development pace",
              },
              {
                id: "high",
                label: "High Priority",
                desc: "Faster delivery, higher cost",
              },
              {
                id: "urgent",
                label: "Urgent",
                desc: "Rush delivery, premium pricing",
              },
            ].map(({ id, label, desc }) => (
              <button
                key={id}
                onClick={() => handleInputChange("priority", id)}
                className={`p-4 rounded-lg border transition-all duration-300 ${
                  formData.priority === id
                    ? "border-color-1 bg-color-1/10 text-color-1"
                    : "border-n-6 hover:border-n-4 text-n-4"
                }`}
              >
                <h4 className="font-medium mb-1">{label}</h4>
                <p className="text-xs opacity-70">{desc}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Cost Estimation Display */}
        <div className="bg-n-7 p-6 rounded-xl border border-n-6">
          <div className="flex items-center justify-between mb-4">
            <h4 className="h6 flex items-center">
              <DollarSign className="w-5 h-5 mr-2 text-color-1" />
              Estimated Project Cost
            </h4>
            <span className="text-2xl font-bold text-color-1">
              TSH {estimatedCost.toLocaleString()}
            </span>
          </div>
          <p className="text-n-4 text-sm">
            This is a preliminary estimate based on your requirements. Final
            pricing will be provided after detailed consultation.
          </p>
          {userType === "student" && (
            <p className="text-green-400 text-sm mt-2">
              ✓ Student discount (25%) applied
            </p>
          )}
        </div>
      </div>
    </div>
  );

  const renderSupportServices = () => (
    <div className="max-w-3xl mx-auto">
      <div className="text-center mb-8">
        <h3 className="h4 mb-4">Support Services & Hardware</h3>
        <p className="body-1 text-n-4">
          {userType === "student"
            ? "Select academic support services you need"
            : "Choose additional services and hardware requirements"}
        </p>
      </div>

      <div className="space-y-6">
        {/* Support Services */}
        <div>
          <label className="block text-sm font-medium text-n-2 mb-3">
            {userType === "student"
              ? "Academic Support Services"
              : "Additional Services"}
          </label>
          <div className="space-y-3">
            {servicePackages
              .filter(
                (service) =>
                  service.user_type === userType || service.user_type === "all"
              )
              .map((service) => (
                <label
                  key={service.id}
                  className="flex items-center justify-between p-4 rounded-lg border border-n-6 hover:bg-n-7/50 cursor-pointer"
                >
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.selectedServices.includes(service.id)}
                      onChange={() =>
                        handleArrayToggle("selectedServices", service.id)
                      }
                      className="w-4 h-4 text-color-1 bg-n-7 border-n-6 rounded focus:ring-color-1"
                    />
                    <div className="ml-3">
                      <span className="text-n-2 font-medium">
                        {service.name}
                      </span>
                      <p className="text-n-4 text-sm">{service.description}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-color-1 font-medium">
                      TSH {parseInt(service.price).toLocaleString()}
                    </span>
                    <p className="text-n-4 text-xs">{service.timeline}</p>
                  </div>
                </label>
              ))}
          </div>
        </div>

        {/* Hardware Requirements */}
        <div>
          <label className="block text-sm font-medium text-n-2 mb-3">
            Hardware Requirements (Optional)
          </label>
          <div className="space-y-3">
            {[
              {
                id: "laptop",
                name: "Laptop/Computer",
                description: "Development workstation",
                price: 50000,
              },
              {
                id: "server",
                name: "Server Access",
                description: "Cloud server for deployment",
                price: 25000,
              },
              {
                id: "software",
                name: "Software Licenses",
                description: "Professional development tools",
                price: 15000,
              },
            ].map((hardware) => (
              <label
                key={hardware.id}
                className="flex items-center justify-between p-4 rounded-lg border border-n-6 hover:bg-n-7/50 cursor-pointer"
              >
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.hardwareNeeds.includes(hardware.id)}
                    onChange={() =>
                      handleArrayToggle("hardwareNeeds", hardware.id)
                    }
                    className="w-4 h-4 text-color-1 bg-n-7 border-n-6 rounded focus:ring-color-1"
                  />
                  <div className="ml-3">
                    <span className="text-n-2 font-medium">
                      {hardware.name}
                    </span>
                    <p className="text-n-4 text-sm">{hardware.description}</p>
                  </div>
                </div>
                <span className="text-color-1 font-medium">
                  TSH {hardware.price.toLocaleString()}
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* Contact Information */}
        <div className="bg-n-7 p-6 rounded-xl border border-n-6">
          <h4 className="h6 mb-4">Contact Information</h4>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-n-2 mb-2">
                Email Address *
              </label>
              <input
                type="email"
                value={formData.contactEmail}
                onChange={(e) =>
                  handleInputChange("contactEmail", e.target.value)
                }
                placeholder="your.email@example.com"
                className="w-full px-4 py-3 bg-n-8 border border-n-6 rounded-lg text-n-1 placeholder-n-4 focus:border-color-1 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-n-2 mb-2">
                Phone Number
              </label>
              <input
                type="tel"
                value={formData.contactPhone}
                onChange={(e) =>
                  handleInputChange("contactPhone", e.target.value)
                }
                placeholder="+255 XXX XXX XXX"
                className="w-full px-4 py-3 bg-n-8 border border-n-6 rounded-lg text-n-1 placeholder-n-4 focus:border-color-1 focus:outline-none"
              />
            </div>
          </div>

          <div className="mt-4">
            <label className="block text-sm font-medium text-n-2 mb-2">
              Additional Notes
            </label>
            <textarea
              value={formData.additionalNotes}
              onChange={(e) =>
                handleInputChange("additionalNotes", e.target.value)
              }
              placeholder="Any additional information, special requirements, or questions you have..."
              rows={4}
              className="w-full px-4 py-3 bg-n-8 border border-n-6 rounded-lg text-n-1 placeholder-n-4 focus:border-color-1 focus:outline-none resize-vertical"
            />
          </div>
        </div>
      </div>
    </div>
  );

  const getStepTitle = (step) => {
    const stepTitles = {
      1: "Basic Information",
      2: userType === "student" ? "Academic Details" : "Technical Requirements",
      3:
        userType === "student"
          ? "Technical Requirements"
          : "Features & Functionality",
      4:
        userType === "student"
          ? "Features & Functionality"
          : "Budget & Timeline",
      5: userType === "student" ? "Budget & Timeline" : "Support & Contact",
      6: "Support & Contact",
    };
    return stepTitles[step];
  };

  const UserTypeIcon = getUserTypeIcon();

  return (
    <>
      <Header />
      <Section className="pt-[4.75rem] lg:pt-[5.25rem] overflow-hidden">
        <div className="container relative z-1">
          {/* Header */}
          <div className="max-w-[50rem] mx-auto mb-12 text-center">
            <div className="flex items-center justify-center mb-4">
              <UserTypeIcon className="w-8 h-8 text-color-1 mr-3" />
              <Heading
                className="md:max-w-md lg:max-w-2xl"
                title="New Project Request"
              />
            </div>
            <p className="body-1 max-w-3xl mx-auto text-n-2">
              {userType === "student"
                ? "Tell us about your academic project and get comprehensive support from proposal to defense"
                : "Describe your project requirements and get a custom solution built for your needs"}
            </p>
          </div>

          {/* Progress Bar */}
          <div className="max-w-4xl mx-auto mb-12">
            <div className="flex items-center justify-between mb-6">
              {Array.from({ length: totalSteps }, (_, i) => i + 1).map(
                (step) => (
                  <div key={step} className="flex items-center">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium transition-all duration-300 ${
                        step <= currentStep
                          ? "bg-color-1 text-n-8"
                          : "bg-n-6 text-n-4"
                      }`}
                    >
                      {step < currentStep ? (
                        <CheckCircle2 className="w-5 h-5" />
                      ) : (
                        step
                      )}
                    </div>
                    {step < totalSteps && (
                      <div
                        className={`h-0.5 w-16 mx-2 transition-all duration-300 ${
                          step < currentStep ? "bg-color-1" : "bg-n-6"
                        }`}
                      />
                    )}
                  </div>
                )
              )}
            </div>
            <div className="text-center">
              <h3 className="h5 text-color-1 mb-1">
                Step {currentStep} of {totalSteps}
              </h3>
              <p className="text-n-4">{getStepTitle(currentStep)}</p>
            </div>
          </div>

          {/* Form Content */}
          <div className="mb-12">{renderStepContent()}</div>

          {/* Navigation Buttons */}
          <div className="max-w-3xl mx-auto">
            <div className="flex justify-between items-center">
              <SimpleButton
                onClick={prevStep}
                disabled={currentStep === 1}
                variant="secondary"
                className={
                  currentStep === 1 ? "opacity-50 cursor-not-allowed" : ""
                }
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Previous
              </SimpleButton>

              <div className="text-center">
                <span className="text-n-4 text-sm">
                  Page {currentStep} of {totalSteps}
                </span>
              </div>

              {currentStep === totalSteps ? (
                <SimpleButton
                  onClick={handleSubmit}
                  disabled={submitting}
                  className="bg-color-1 hover:bg-color-1/90 disabled:opacity-50"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      Submit Request
                      <CheckCircle2 className="w-4 h-4 ml-2" />
                    </>
                  )}
                </SimpleButton>
              ) : (
                <SimpleButton
                  onClick={nextStep}
                  className="bg-color-1 hover:bg-color-1/90"
                >
                  Next Step
                  <ArrowRight className="w-4 h-4 ml-2" />
                </SimpleButton>
              )}
            </div>
          </div>

          {/* Cost Preview (Sticky) */}
          {currentStep >= 3 && (
            <div className="fixed bottom-6 right-6 bg-n-8 border border-color-1 rounded-lg p-4 shadow-lg z-50">
              <div className="flex items-center">
                <DollarSign className="w-5 h-5 text-color-1 mr-2" />
                <div>
                  <p className="text-xs text-n-4">Estimated Cost</p>
                  <p className="font-bold text-color-1">
                    TSH {estimatedCost.toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </Section>
      <Footer />
    </>
  );
};

export default NewProjectRequestPage;
