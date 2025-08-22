import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Plus,
  X,
  Upload,
  FileText,
  DollarSign,
  Clock,
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
} from "lucide-react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Section from "../components/Section";
import Heading from "../components/Heading";
import SimpleButton from "../components/SimpleButton";
import {
  technologyStacks,
  courseCategories,
  projectTypes,
  supportServices,
  hardwareRequirements,
} from "../constants/projectData";

const NewProjectRequestPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { userType } = location.state || { userType: "student" };

  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = userType === "student" ? 6 : 5;

  const [formData, setFormData] = useState({
    // Basic Information
    projectTitle: "",
    projectDescription: "",
    projectCategory: "",
    userType: userType,

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

  useEffect(() => {
    calculateEstimatedCost();
  }, [formData, userType]);

  const calculateEstimatedCost = () => {
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

    // Add service costs
    const serviceCosts = formData.selectedServices.reduce(
      (total, serviceId) => {
        const service = supportServices[serviceId];
        return total + (service ? service.price : 0);
      },
      0
    );

    // Add hardware costs
    const hardwareCosts = formData.hardwareNeeds.reduce((total, hardwareId) => {
      const hardware = hardwareRequirements.find((h) => h.id === hardwareId);
      return total + (hardware ? hardware.price : 0);
    }, 0);

    // Apply user type multiplier
    let multiplier = 1;
    if (userType === "student") multiplier = 0.75; // 25% discount
    if (userType === "business") multiplier = 1.3; // 30% premium

    const totalCost = (baseCost + serviceCosts + hardwareCosts) * multiplier;
    setEstimatedCost(totalCost);
  };

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

  const handleSubmit = () => {
    // Here you would typically send the data to your backend
    console.log("Project Request Data:", formData);
    navigate("/project-request/confirmation", {
      state: {
        formData,
        estimatedCost,
        userType,
      },
    });
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
                    {projectTypes.student.map((type) => (
                      <option key={type} value={type}>
                        {type}
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

      case 3:
        return renderTechnicalRequirements();

      case 4:
        return renderFeaturesAndFunctionality();

      case 5:
        return renderBudgetAndTimeline();

      case 6:
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
            {technologyStacks
              .filter((stack) => stack.suitable.includes(userType))
              .map((stack) => (
                <div
                  key={stack.id}
                  onClick={() =>
                    handleInputChange("selectedTechStack", stack.id)
                  }
                  className={`p-4 rounded-lg border cursor-pointer transition-all duration-300 ${
                    formData.selectedTechStack === stack.id
                      ? "border-color-1 bg-color-1/10"
                      : "border-n-6 hover:border-n-4 hover:bg-n-7/50"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-n-1 mb-1">
                        {stack.name}
                      </h4>
                      <div className="flex flex-wrap gap-1">
                        {stack.technologies.map((tech, index) => (
                          <span
                            key={index}
                            className="text-xs px-2 py-1 bg-n-6 text-n-3 rounded"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>
                    <CheckCircle2
                      className={`w-5 h-5 ${
                        formData.selectedTechStack === stack.id
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
            {Object.entries(supportServices)
              .filter(([key]) => {
                if (userType === "student") return true;
                return ![
                  "proposal",
                  "defense",
                  "dataCollection",
                  "publication",
                  "bookWriting",
                ].includes(key);
              })
              .map(([key, service]) => (
                <label
                  key={key}
                  className="flex items-center justify-between p-4 rounded-lg border border-n-6 hover:bg-n-7/50 cursor-pointer"
                >
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.selectedServices.includes(key)}
                      onChange={() =>
                        handleArrayToggle("selectedServices", key)
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
                      TSH {service.price.toLocaleString()}
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
            {hardwareRequirements.map((hardware) => (
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
                    <div className="flex flex-wrap gap-1 mt-1">
                      {hardware.specifications.map((spec, index) => (
                        <span
                          key={index}
                          className="text-xs px-2 py-1 bg-n-6 text-n-3 rounded"
                        >
                          {spec}
                        </span>
                      ))}
                    </div>
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
                  className="bg-color-1 hover:bg-color-1/90"
                >
                  Submit Request
                  <CheckCircle2 className="w-4 h-4 ml-2" />
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
