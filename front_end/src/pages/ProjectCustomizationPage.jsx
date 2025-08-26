import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Edit3,
  Plus,
  X,
  DollarSign,
  Clock,
  User,
  Building,
  GraduationCap,
  Star,
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
  supportServices,
  hardwareRequirements,
} from "../constants/projectData";

const ProjectCustomizationPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { project, userType } = location.state || {};

  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 4;

  const [customizations, setCustomizations] = useState({
    // Basic customizations
    projectTitle: project?.title || "",
    customDescription: "",
    keepOriginalFeatures: true,

    // Feature modifications
    additionalFeatures: [],
    removeFeatures: [],
    modifyFeatures: [],

    // Technical changes
    technologyChanges: [],
    databaseChanges: "",
    hostingPreferences: "",

    // Academic customizations (for students)
    courseAlignment: "",
    projectType: "",
    researchComponents: [],
    academicRequirements: "",

    // Budget and timeline
    budgetExpectation: "",
    timelinePreference: "",
    priority: "standard",

    // Support services
    selectedServices: [],
    hardwareNeeds: [],

    // Contact and additional info
    contactEmail: "",
    contactPhone: "",
    additionalNotes: "",
    urgency: "normal",
  });

  const [estimatedCost, setEstimatedCost] = useState(0);

  useEffect(() => {
    if (!project) {
      navigate("/project-request");
      return;
    }
    calculateCustomizationCost();
  }, [project, navigate, customizations, userType]);

  const calculateCustomizationCost = () => {
    if (!project) return;

    let baseCost = project.estimatedPrice;

    // Additional features cost (20% per major feature)
    const additionalFeatureCost =
      customizations.additionalFeatures.length * (baseCost * 0.2);

    // Technology changes cost
    const technologyChangeCost =
      customizations.technologyChanges.length * 200000;

    // Service costs
    const serviceCosts = customizations.selectedServices.reduce(
      (total, serviceId) => {
        const service = supportServices[serviceId];
        return total + (service ? service.price : 0);
      },
      0
    );

    // Hardware costs
    const hardwareCosts = customizations.hardwareNeeds.reduce(
      (total, hardwareId) => {
        const hardware = hardwareRequirements.find((h) => h.id === hardwareId);
        return total + (hardware ? hardware.price : 0);
      },
      0
    );

    // Apply user type multiplier
    let multiplier = 1;
    if (userType === "student") multiplier = 0.75;
    if (userType === "business") multiplier = 1.3;

    // Priority multiplier
    if (customizations.priority === "high") multiplier *= 1.2;
    if (customizations.priority === "urgent") multiplier *= 1.5;

    const totalCost =
      (baseCost +
        additionalFeatureCost +
        technologyChangeCost +
        serviceCosts +
        hardwareCosts) *
      multiplier;
    setEstimatedCost(totalCost);
  };

  const handleInputChange = (field, value) => {
    setCustomizations((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleArrayToggle = (field, value) => {
    setCustomizations((prev) => ({
      ...prev,
      [field]: prev[field].includes(value)
        ? prev[field].filter((item) => item !== value)
        : [...prev[field], value],
    }));
  };

  const addCustomItem = (field, value) => {
    if (value && !customizations[field].includes(value)) {
      setCustomizations((prev) => ({
        ...prev,
        [field]: [...prev[field], value],
      }));
    }
  };

  const removeCustomItem = (field, value) => {
    setCustomizations((prev) => ({
      ...prev,
      [field]: prev[field].filter((item) => item !== value),
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
    const requestData = {
      baseProject: project,
      customizations,
      userType,
      estimatedCost,
    };

    console.log("Customization Request Data:", requestData);
    navigate("/project-request/confirmation", {
      state: {
        requestData,
        isCustomization: true,
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
        return renderProjectOverview();
      case 2:
        return renderFeatureCustomizations();
      case 3:
        return renderTechnicalCustomizations();
      case 4:
        return renderBudgetAndServices();
      default:
        return null;
    }
  };

  const renderProjectOverview = () => {
    const CategoryIcon =
      categoryIcons[project?.category?.name || project?.category] || Code;

    return (
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h3 className="h4 mb-4">Project Overview & Basic Customizations</h3>
          <p className="body-1 text-n-4">
            Review the base project and make initial customizations
          </p>
        </div>

        {/* Original Project Display */}
        <div className="bg-n-7 rounded-xl border border-n-6 p-6 mb-8">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center">
              <CategoryIcon className="w-8 h-8 text-color-1 mr-3" />
              <div>
                <h4 className="h5 mb-1">{project?.title || project?.name}</h4>
                <span className="text-sm px-3 py-1 bg-color-1/20 text-color-1 rounded-full">
                  {project?.category?.name || project?.category}
                </span>
              </div>
            </div>
            <div className="text-right">
              <div className="flex items-center text-n-4 text-sm mb-1">
                <Clock className="w-4 h-4 mr-1" />
                {project?.timeline ||
                  project?.estimated_duration ||
                  "2-4 weeks"}
              </div>
              <div className="flex items-center text-green-400 text-sm">
                <DollarSign className="w-4 h-4 mr-1" />
                Base: TSH{" "}
                {(() => {
                  const price =
                    project?.estimatedPrice ||
                    project?.estimated_price ||
                    project?.price ||
                    50000;
                  return typeof price === "number"
                    ? price.toLocaleString()
                    : parseFloat(price || 0).toLocaleString();
                })()}
              </div>
            </div>
          </div>

          <p className="text-n-3 mb-4">{project?.description}</p>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h5 className="text-sm font-medium text-n-2 mb-2">
                Technologies
              </h5>
              <div className="flex flex-wrap gap-1">
                {project?.technologies?.map((tech, index) => (
                  <span
                    key={index}
                    className="text-xs px-2 py-1 bg-n-6 text-n-3 rounded"
                  >
                    {tech?.name || tech}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <h5 className="text-sm font-medium text-n-2 mb-2">
                Core Features
              </h5>
              <div className="space-y-1">
                {project?.features?.slice(0, 4).map((feature, index) => (
                  <div
                    key={index}
                    className="flex items-center text-sm text-n-4"
                  >
                    <CheckCircle2 className="w-3 h-3 text-green-400 mr-2 flex-shrink-0" />
                    {feature}
                  </div>
                ))}
                {project?.features?.length > 4 && (
                  <p className="text-xs text-n-4">
                    +{project.features.length - 4} more features...
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Basic Customizations */}
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-n-2 mb-2">
              Custom Project Title
            </label>
            <input
              type="text"
              value={customizations.projectTitle}
              onChange={(e) =>
                handleInputChange("projectTitle", e.target.value)
              }
              placeholder={`Enter custom title or keep "${project?.title}"`}
              className="w-full px-4 py-3 bg-n-8 border border-n-6 rounded-lg text-n-1 placeholder-n-4 focus:border-color-1 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-n-2 mb-2">
              Additional Requirements Description
            </label>
            <textarea
              value={customizations.customDescription}
              onChange={(e) =>
                handleInputChange("customDescription", e.target.value)
              }
              placeholder="Describe how you want to customize this project to meet your specific needs..."
              rows={4}
              className="w-full px-4 py-3 bg-n-8 border border-n-6 rounded-lg text-n-1 placeholder-n-4 focus:border-color-1 focus:outline-none resize-vertical"
            />
          </div>

          {userType === "student" && (
            <div className="bg-n-7 p-6 rounded-xl border border-n-6">
              <h4 className="h6 mb-4">Academic Alignment</h4>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-n-2 mb-2">
                    Course/Program
                  </label>
                  <select
                    value={customizations.courseAlignment}
                    onChange={(e) =>
                      handleInputChange("courseAlignment", e.target.value)
                    }
                    className="w-full px-4 py-3 bg-n-8 border border-n-6 rounded-lg text-n-1 focus:border-color-1 focus:outline-none"
                  >
                    <option value="">Select your course</option>
                    <option value="Computer Science">Computer Science</option>
                    <option value="Information Technology">
                      Information Technology
                    </option>
                    <option value="Software Engineering">
                      Software Engineering
                    </option>
                    <option value="Computer Engineering">
                      Computer Engineering
                    </option>
                    <option value="Information Systems">
                      Information Systems
                    </option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-n-2 mb-2">
                    Project Type
                  </label>
                  <select
                    value={customizations.projectType}
                    onChange={(e) =>
                      handleInputChange("projectType", e.target.value)
                    }
                    className="w-full px-4 py-3 bg-n-8 border border-n-6 rounded-lg text-n-1 focus:border-color-1 focus:outline-none"
                  >
                    <option value="">Select project type</option>
                    <option value="Final Year Project">
                      Final Year Project
                    </option>
                    <option value="Mini Project">Mini Project</option>
                    <option value="Course Assignment">Course Assignment</option>
                    <option value="Research Project">Research Project</option>
                  </select>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderFeatureCustomizations = () => (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <h3 className="h4 mb-4">Feature Customizations</h3>
        <p className="body-1 text-n-4">
          Add, modify, or remove features to match your requirements
        </p>
      </div>

      <div className="space-y-8">
        {/* Keep Original Features */}
        <div className="bg-n-7 p-6 rounded-xl border border-n-6">
          <div className="flex items-center mb-4">
            <input
              type="checkbox"
              id="keepOriginal"
              checked={customizations.keepOriginalFeatures}
              onChange={(e) =>
                handleInputChange("keepOriginalFeatures", e.target.checked)
              }
              className="w-4 h-4 text-color-1 bg-n-8 border-n-6 rounded focus:ring-color-1"
            />
            <label htmlFor="keepOriginal" className="ml-2 font-medium text-n-2">
              Keep all original features from the base project
            </label>
          </div>
          <p className="text-n-4 text-sm">
            Uncheck this if you want to remove some of the original features
          </p>
        </div>

        {/* Additional Features */}
        <div>
          <h4 className="h6 mb-4">Additional Features You Need</h4>
          <div className="grid md:grid-cols-2 gap-3 mb-4">
            {[
              "Advanced User Permissions",
              "Multi-language Support",
              "API Integration",
              "Advanced Reporting",
              "Real-time Notifications",
              "Social Media Integration",
              "Advanced Search & Filters",
              "Data Import/Export",
              "Backup & Recovery",
              "Advanced Security Features",
              "Mobile App Version",
              "Email Marketing Integration",
              "Customer Support Chat",
              "Analytics Dashboard",
              "Custom Branding",
              "Third-party Integrations",
            ].map((feature) => (
              <label
                key={feature}
                className="flex items-center p-3 rounded-lg border border-n-6 hover:bg-n-7/50 cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={customizations.additionalFeatures.includes(feature)}
                  onChange={() =>
                    handleArrayToggle("additionalFeatures", feature)
                  }
                  className="w-4 h-4 text-color-1 bg-n-8 border-n-6 rounded focus:ring-color-1"
                />
                <span className="ml-3 text-n-2 text-sm">{feature}</span>
              </label>
            ))}
          </div>

          {/* Custom Feature Input */}
          <div>
            <label className="block text-sm font-medium text-n-2 mb-2">
              Custom Additional Features
            </label>
            <div className="flex flex-wrap gap-2 mb-3">
              {customizations.additionalFeatures
                .filter(
                  (feature) =>
                    ![
                      "Advanced User Permissions",
                      "Multi-language Support",
                      "API Integration",
                      "Advanced Reporting",
                      "Real-time Notifications",
                      "Social Media Integration",
                      "Advanced Search & Filters",
                      "Data Import/Export",
                      "Backup & Recovery",
                      "Advanced Security Features",
                      "Mobile App Version",
                      "Email Marketing Integration",
                      "Customer Support Chat",
                      "Analytics Dashboard",
                      "Custom Branding",
                      "Third-party Integrations",
                    ].includes(feature)
                )
                .map((feature) => (
                  <span
                    key={feature}
                    className="inline-flex items-center px-3 py-1 bg-color-1/20 text-color-1 rounded-full text-sm"
                  >
                    {feature}
                    <button
                      onClick={() =>
                        removeCustomItem("additionalFeatures", feature)
                      }
                      className="ml-2 text-color-1/70 hover:text-color-1"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
            </div>
            <input
              type="text"
              placeholder="Enter custom feature (press Enter to add)"
              onKeyPress={(e) => {
                if (e.key === "Enter" && e.target.value.trim()) {
                  addCustomItem("additionalFeatures", e.target.value.trim());
                  e.target.value = "";
                }
              }}
              className="w-full px-4 py-3 bg-n-8 border border-n-6 rounded-lg text-n-1 placeholder-n-4 focus:border-color-1 focus:outline-none"
            />
          </div>
        </div>

        {/* Feature Modifications */}
        <div>
          <h4 className="h6 mb-4">Feature Modifications</h4>
          <textarea
            value={customizations.modifyFeatures.join("\n")}
            onChange={(e) =>
              handleInputChange(
                "modifyFeatures",
                e.target.value.split("\n").filter((f) => f.trim())
              )
            }
            placeholder="Describe how you want to modify existing features (one modification per line)&#10;Example: Change user dashboard to show different metrics&#10;Example: Modify reporting to include custom date ranges"
            rows={4}
            className="w-full px-4 py-3 bg-n-8 border border-n-6 rounded-lg text-n-1 placeholder-n-4 focus:border-color-1 focus:outline-none resize-vertical"
          />
        </div>

        {/* Remove Features */}
        {!customizations.keepOriginalFeatures && (
          <div>
            <h4 className="h6 mb-4">Features to Remove</h4>
            <div className="space-y-2">
              {project?.features?.map((feature, index) => (
                <label
                  key={index}
                  className="flex items-center p-3 rounded-lg border border-n-6 hover:bg-n-7/50 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={customizations.removeFeatures.includes(feature)}
                    onChange={() =>
                      handleArrayToggle("removeFeatures", feature)
                    }
                    className="w-4 h-4 text-red-400 bg-n-8 border-n-6 rounded focus:ring-red-400"
                  />
                  <span className="ml-3 text-n-2 text-sm">{feature}</span>
                </label>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );

  const renderTechnicalCustomizations = () => (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <h3 className="h4 mb-4">Technical Customizations</h3>
        <p className="body-1 text-n-4">
          Modify technical specifications and requirements
        </p>
      </div>

      <div className="space-y-6">
        {/* Current Technologies Display */}
        <div className="bg-n-7 p-6 rounded-xl border border-n-6">
          <h4 className="h6 mb-3">Current Technology Stack</h4>
          <div className="flex flex-wrap gap-2">
            {project?.technologies?.map((tech, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-n-6 text-n-3 rounded text-sm"
              >
                {tech?.name || tech}
              </span>
            ))}
          </div>
        </div>

        {/* Technology Changes */}
        <div>
          <h4 className="h6 mb-4">Technology Changes/Additions</h4>
          <div className="flex flex-wrap gap-2 mb-3">
            {customizations.technologyChanges.map((tech) => (
              <span
                key={tech}
                className="inline-flex items-center px-3 py-1 bg-color-1/20 text-color-1 rounded-full text-sm"
              >
                {tech}
                <button
                  onClick={() => removeCustomItem("technologyChanges", tech)}
                  className="ml-2 text-color-1/70 hover:text-color-1"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
          </div>
          <input
            type="text"
            placeholder="Add technology change or requirement (press Enter)"
            onKeyPress={(e) => {
              if (e.key === "Enter" && e.target.value.trim()) {
                addCustomItem("technologyChanges", e.target.value.trim());
                e.target.value = "";
              }
            }}
            className="w-full px-4 py-3 bg-n-8 border border-n-6 rounded-lg text-n-1 placeholder-n-4 focus:border-color-1 focus:outline-none"
          />
          <p className="text-n-4 text-sm mt-2">
            Examples: "Replace MySQL with PostgreSQL", "Add Redis for caching",
            "Implement GraphQL API"
          </p>
        </div>

        {/* Database Preferences */}
        <div>
          <h4 className="h6 mb-4">Database Preferences</h4>
          <textarea
            value={customizations.databaseChanges}
            onChange={(e) =>
              handleInputChange("databaseChanges", e.target.value)
            }
            placeholder="Describe any database-related changes or preferences..."
            rows={3}
            className="w-full px-4 py-3 bg-n-8 border border-n-6 rounded-lg text-n-1 placeholder-n-4 focus:border-color-1 focus:outline-none resize-vertical"
          />
        </div>

        {/* Hosting Preferences */}
        <div>
          <h4 className="h6 mb-4">Hosting & Deployment Preferences</h4>
          <div className="grid md:grid-cols-2 gap-4 mb-4">
            {[
              "Cloud Hosting (AWS/Google Cloud)",
              "VPS Hosting",
              "Shared Hosting",
              "Dedicated Server",
              "cPanel Hosting",
              "Docker Deployment",
              "Custom Domain Setup",
              "SSL Certificate Setup",
            ].map((option) => (
              <label
                key={option}
                className="flex items-center p-3 rounded-lg border border-n-6 hover:bg-n-7/50 cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={customizations.hostingPreferences.includes(option)}
                  onChange={() =>
                    handleArrayToggle("hostingPreferences", option)
                  }
                  className="w-4 h-4 text-color-1 bg-n-8 border-n-6 rounded focus:ring-color-1"
                />
                <span className="ml-3 text-n-2 text-sm">{option}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Research Components (for students) */}
        {userType === "student" && (
          <div className="bg-n-7 p-6 rounded-xl border border-n-6">
            <h4 className="h6 mb-4">Research Components Needed</h4>
            <div className="grid md:grid-cols-2 gap-3 mb-4">
              {[
                "Literature Review",
                "Data Collection Methods",
                "Statistical Analysis",
                "Performance Testing",
                "User Experience Study",
                "Comparative Analysis",
                "Algorithm Optimization",
                "Security Assessment",
              ].map((component) => (
                <label
                  key={component}
                  className="flex items-center p-3 rounded-lg border border-n-6 hover:bg-n-7/50 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={customizations.researchComponents.includes(
                      component
                    )}
                    onChange={() =>
                      handleArrayToggle("researchComponents", component)
                    }
                    className="w-4 h-4 text-color-1 bg-n-8 border-n-6 rounded focus:ring-color-1"
                  />
                  <span className="ml-3 text-n-2 text-sm">{component}</span>
                </label>
              ))}
            </div>

            <textarea
              value={customizations.academicRequirements}
              onChange={(e) =>
                handleInputChange("academicRequirements", e.target.value)
              }
              placeholder="Describe specific academic requirements, research questions, or methodologies needed..."
              rows={3}
              className="w-full px-4 py-3 bg-n-8 border border-n-6 rounded-lg text-n-1 placeholder-n-4 focus:border-color-1 focus:outline-none resize-vertical"
            />
          </div>
        )}
      </div>
    </div>
  );

  const renderBudgetAndServices = () => (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <h3 className="h4 mb-4">Budget, Timeline & Support Services</h3>
        <p className="body-1 text-n-4">
          Set your budget expectations and choose additional services
        </p>
      </div>

      <div className="space-y-8">
        {/* Budget and Timeline */}
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-n-2 mb-2">
              Budget Expectation (TSH)
            </label>
            <select
              value={customizations.budgetExpectation}
              onChange={(e) =>
                handleInputChange("budgetExpectation", e.target.value)
              }
              className="w-full px-4 py-3 bg-n-8 border border-n-6 rounded-lg text-n-1 focus:border-color-1 focus:outline-none"
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
                  <option value="2000000-5000000">2M - 5M</option>
                  <option value="5000000-10000000">5M - 10M</option>
                  <option value="10000000-20000000">10M - 20M</option>
                  <option value="20000000+">20M+</option>
                </>
              ) : (
                <>
                  <option value="10000000-20000000">10M - 20M</option>
                  <option value="20000000-50000000">20M - 50M</option>
                  <option value="50000000-100000000">50M - 100M</option>
                  <option value="100000000+">100M+</option>
                </>
              )}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-n-2 mb-2">
              Timeline Preference
            </label>
            <select
              value={customizations.timelinePreference}
              onChange={(e) =>
                handleInputChange("timelinePreference", e.target.value)
              }
              className="w-full px-4 py-3 bg-n-8 border border-n-6 rounded-lg text-n-1 focus:border-color-1 focus:outline-none"
            >
              <option value="">Select timeline</option>
              <option value="2-4 weeks">2-4 weeks</option>
              <option value="1-2 months">1-2 months</option>
              <option value="3-4 months">3-4 months</option>
              <option value="6+ months">6+ months</option>
            </select>
          </div>
        </div>

        {/* Priority Level */}
        <div>
          <h4 className="h6 mb-4">Project Priority</h4>
          <div className="grid grid-cols-3 gap-4">
            {[
              {
                id: "standard",
                label: "Standard",
                desc: "Normal development pace",
                multiplier: "1x",
              },
              {
                id: "high",
                label: "High Priority",
                desc: "Faster delivery",
                multiplier: "1.2x",
              },
              {
                id: "urgent",
                label: "Urgent",
                desc: "Rush delivery",
                multiplier: "1.5x",
              },
            ].map(({ id, label, desc, multiplier }) => (
              <button
                key={id}
                onClick={() => handleInputChange("priority", id)}
                className={`p-4 rounded-lg border transition-all duration-300 ${
                  customizations.priority === id
                    ? "border-color-1 bg-color-1/10 text-color-1"
                    : "border-n-6 hover:border-n-4 text-n-4"
                }`}
              >
                <h5 className="font-medium mb-1">{label}</h5>
                <p className="text-xs opacity-70 mb-2">{desc}</p>
                <span className="text-xs font-mono">{multiplier} cost</span>
              </button>
            ))}
          </div>
        </div>

        {/* Support Services */}
        <div>
          <h4 className="h6 mb-4">
            {userType === "student"
              ? "Academic Support Services"
              : "Additional Services"}
          </h4>
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
                      checked={customizations.selectedServices.includes(key)}
                      onChange={() =>
                        handleArrayToggle("selectedServices", key)
                      }
                      className="w-4 h-4 text-color-1 bg-n-8 border-n-6 rounded focus:ring-color-1"
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
          <h4 className="h6 mb-4">Hardware Requirements (Optional)</h4>
          <div className="space-y-3">
            {hardwareRequirements.map((hardware) => (
              <label
                key={hardware.id}
                className="flex items-center justify-between p-4 rounded-lg border border-n-6 hover:bg-n-7/50 cursor-pointer"
              >
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={customizations.hardwareNeeds.includes(hardware.id)}
                    onChange={() =>
                      handleArrayToggle("hardwareNeeds", hardware.id)
                    }
                    className="w-4 h-4 text-color-1 bg-n-8 border-n-6 rounded focus:ring-color-1"
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
          <div className="grid md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-n-2 mb-2">
                Email Address *
              </label>
              <input
                type="email"
                value={customizations.contactEmail}
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
                value={customizations.contactPhone}
                onChange={(e) =>
                  handleInputChange("contactPhone", e.target.value)
                }
                placeholder="+255 XXX XXX XXX"
                className="w-full px-4 py-3 bg-n-8 border border-n-6 rounded-lg text-n-1 placeholder-n-4 focus:border-color-1 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-n-2 mb-2">
              Additional Notes
            </label>
            <textarea
              value={customizations.additionalNotes}
              onChange={(e) =>
                handleInputChange("additionalNotes", e.target.value)
              }
              placeholder="Any additional information or special requirements..."
              rows={3}
              className="w-full px-4 py-3 bg-n-8 border border-n-6 rounded-lg text-n-1 placeholder-n-4 focus:border-color-1 focus:outline-none resize-vertical"
            />
          </div>
        </div>

        {/* Cost Summary */}
        <div className="bg-gradient-to-r from-color-1/10 to-color-2/10 p-6 rounded-xl border border-color-1/20">
          <h4 className="h6 mb-4 flex items-center">
            <DollarSign className="w-5 h-5 mr-2 text-color-1" />
            Customization Cost Summary
          </h4>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-n-4">Base Project Cost:</span>
              <span className="text-n-2">
                TSH{" "}
                {(() => {
                  const price =
                    project?.estimatedPrice ||
                    project?.estimated_price ||
                    project?.price ||
                    50000;
                  return typeof price === "number"
                    ? price.toLocaleString()
                    : parseFloat(price || 0).toLocaleString();
                })()}
              </span>
            </div>
            {customizations.additionalFeatures.length > 0 && (
              <div className="flex justify-between">
                <span className="text-n-4">Additional Features:</span>
                <span className="text-n-2">
                  + TSH{" "}
                  {(() => {
                    const basePrice =
                      project?.estimatedPrice ||
                      project?.estimated_price ||
                      project?.price ||
                      50000;
                    const price =
                      typeof basePrice === "number"
                        ? basePrice
                        : parseFloat(basePrice || 0);
                    return (
                      customizations.additionalFeatures.length *
                      price *
                      0.2
                    ).toLocaleString();
                  })()}
                </span>
              </div>
            )}
            {customizations.selectedServices.length > 0 && (
              <div className="flex justify-between">
                <span className="text-n-4">Support Services:</span>
                <span className="text-n-2">
                  + TSH{" "}
                  {customizations.selectedServices
                    .reduce((total, serviceId) => {
                      const service = supportServices[serviceId];
                      return total + (service ? service.price : 0);
                    }, 0)
                    .toLocaleString()}
                </span>
              </div>
            )}
            <div className="border-t border-n-6 pt-2 mt-2">
              <div className="flex justify-between font-bold">
                <span className="text-n-2">Estimated Total:</span>
                <span className="text-color-1 text-lg">
                  TSH {estimatedCost.toLocaleString()}
                </span>
              </div>
              {userType === "student" && (
                <p className="text-green-400 text-xs mt-1">
                  ✓ Student discount (25%) applied
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const getStepTitle = (step) => {
    const stepTitles = {
      1: "Project Overview",
      2: "Feature Customizations",
      3: "Technical Changes",
      4: "Budget & Services",
    };
    return stepTitles[step];
  };

  const UserTypeIcon = getUserTypeIcon();

  if (!project) {
    return (
      <>
        <Header />
        <Section className="pt-[4.75rem] lg:pt-[5.25rem]">
          <div className="container text-center">
            <h2 className="h2 mb-4">Project Not Found</h2>
            <p className="body-1 text-n-4 mb-6">
              Please select a project to customize.
            </p>
            <SimpleButton onClick={() => navigate("/project-request")}>
              Back to Project Request
            </SimpleButton>
          </div>
        </Section>
        <Footer />
      </>
    );
  }

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
                title="Customize Your Project"
              />
            </div>
            <p className="body-1 max-w-3xl mx-auto text-n-2">
              Modify the selected project template to perfectly match your
              requirements
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
          <div className="max-w-4xl mx-auto">
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
                  Step {currentStep} of {totalSteps}
                </span>
              </div>

              {currentStep === totalSteps ? (
                <SimpleButton
                  onClick={handleSubmit}
                  className="bg-color-1 hover:bg-color-1/90"
                >
                  Submit Customization
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
          {currentStep >= 2 && (
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

export default ProjectCustomizationPage;
