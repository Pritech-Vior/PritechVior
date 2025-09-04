import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import authService from "../services/authService";
import {
  Plus,
  Search,
  ChevronDown,
  Star,
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
  CheckCircle2,
  Loader2,
  X,
  Send,
} from "lucide-react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Section from "../components/Section";
import Heading from "../components/Heading";
import SimpleButton from "../components/SimpleButton";
import { projectsService } from "../services/projectsService";
import { toast } from "react-hot-toast";

const ProjectRequestPage = () => {
  const navigate = useNavigate();
  const [requestType, setRequestType] = useState("new"); // "new" or "existing"
  const [userType, setUserType] = useState("student"); // "student", "client", "business"
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  // Backend data state
  const [projectTemplates, setProjectTemplates] = useState([]);
  const [projectCategories, setProjectCategories] = useState([]);
  const [courseCategories, setCourseCategories] = useState([]);
  const [servicePackages, setServicePackages] = useState({
    student: [],
    business: [],
    enterprise: [],
  });
  const [loading, setLoading] = useState(true);

  // Form state for new project requests
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    requirements: "",
    budget_range: "",
    preferred_deadline: "",
    contact_email: "",
    contact_phone: "",
    client_notes: "",
    // Student-specific fields
    course_category: "",
    academic_level: "",
    institution: "",
  });

  // Remove mandatory authentication
  useEffect(() => {
    // Only fetch backend data if authenticated, but do not redirect
    if (authService.isAuthenticated()) {
      const loadData = async () => {
        try {
          setLoading(true);

          // Load project templates from ProjectTemplate model
          const templatesResponse = await projectsService.getProjectTemplates();

          // Ensure we have an array
          if (Array.isArray(templatesResponse)) {
            setProjectTemplates(templatesResponse);
          } else if (
            templatesResponse?.results &&
            Array.isArray(templatesResponse.results)
          ) {
            // Handle paginated response
            setProjectTemplates(templatesResponse.results);
          } else {
            setProjectTemplates([]);
          }

          // Load categories (use backend data or fallback to defaults)
          try {
            const categoriesResponse = await projectsService.getCategories();

            // Ensure we have an array
            if (Array.isArray(categoriesResponse)) {
              setProjectCategories(categoriesResponse);
            } else if (
              categoriesResponse?.results &&
              Array.isArray(categoriesResponse.results)
            ) {
              // Handle paginated response
              setProjectCategories(categoriesResponse.results);
            } else {
              // Fallback categories if API doesn't exist yet
              setProjectCategories([
                { id: 1, name: "Web Development" },
                { id: 2, name: "Mobile Development" },
                { id: 3, name: "Desktop Applications" },
                { id: 4, name: "Database Systems" },
                { id: 5, name: "E-Commerce" },
                { id: 6, name: "E-Learning" },
                { id: 7, name: "Management Systems" },
                { id: 8, name: "UI/UX Design" },
                { id: 9, name: "Final Year Projects" },
                { id: 10, name: "Mini Projects" },
              ]);
            }
          } catch (error) {
            // Fallback categories if API doesn't exist yet
            setProjectCategories([
              { id: 1, name: "Web Development" },
              { id: 2, name: "Mobile Development" },
              { id: 3, name: "Desktop Applications" },
              { id: 4, name: "Database Systems" },
              { id: 5, name: "E-Commerce" },
              { id: 6, name: "E-Learning" },
              { id: 7, name: "Management Systems" },
              { id: 8, name: "UI/UX Design" },
              { id: 9, name: "Final Year Projects" },
              { id: 10, name: "Mini Projects" },
            ]);
          }

          // Load course categories from backend
          try {
            const courseCategoriesResponse =
              await projectsService.getCourseCategories();

            // Ensure we have an array
            if (Array.isArray(courseCategoriesResponse)) {
              setCourseCategories(courseCategoriesResponse);
            } else if (
              courseCategoriesResponse?.results &&
              Array.isArray(courseCategoriesResponse.results)
            ) {
              // Handle paginated response
              setCourseCategories(courseCategoriesResponse.results);
            } else {
              setCourseCategories([]);
              toast.error("No course categories found from backend.");
            }
          } catch (error) {
            console.error("Error loading course categories:", error);
            setCourseCategories([]);
            toast.error("Failed to load course categories from backend.");
          }

          // Load service packages from backend
          try {
            const servicePackagesResponse =
              await projectsService.getServicePackages();

            // Group by user type
            const groupedPackages = {
              student: [],
              business: [],
              enterprise: [],
            };

            // Handle paginated response or direct array
            const servicePackagesArray = Array.isArray(servicePackagesResponse)
              ? servicePackagesResponse
              : servicePackagesResponse?.results || [];

            if (Array.isArray(servicePackagesArray)) {
              servicePackagesArray.forEach((pkg) => {
                const userType = pkg.user_type?.toLowerCase() || "student";

                if (userType === "student") {
                  groupedPackages.student.push({
                    id: pkg.id,
                    name: pkg.name,
                    description: pkg.description,
                    price: `TSH ${parseFloat(pkg.price).toLocaleString()}`,
                    features: pkg.features || [],
                    isPopular: pkg.is_popular || false,
                  });
                } else if (
                  userType === "business" ||
                  userType === "individual client"
                ) {
                  groupedPackages.business.push({
                    id: pkg.id,
                    name: pkg.name,
                    description: pkg.description,
                    price: `TSH ${parseFloat(pkg.price).toLocaleString()}`,
                    features: pkg.features || [],
                    isPopular: pkg.is_popular || false,
                  });
                } else if (userType === "enterprise") {
                  groupedPackages.enterprise.push({
                    id: pkg.id,
                    name: pkg.name,
                    description: pkg.description,
                    price: `TSH ${parseFloat(pkg.price).toLocaleString()}`,
                    features: pkg.features || [],
                    isPopular: pkg.is_popular || false,
                  });
                }
              });
            }

            setServicePackages(groupedPackages);
          } catch (error) {
            console.error("Error loading service packages:", error);
            // Use empty arrays instead of fallback data to see the real issue
            setServicePackages({
              student: [],
              business: [],
              enterprise: [],
            });
          }
        } catch (error) {
          console.error("Error loading data:", error);
          toast.error("Failed to load project data");
          // Fallback to empty arrays
          setProjectTemplates([]);
          setProjectCategories([]);
        } finally {
          setLoading(false);
        }
      };

      loadData();
    }
    // If not authenticated, still allow access and show form
  }, []);

  useEffect(() => {
    document.title =
      "Request Project - PRITECH VIOR | Custom Software Development";
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute(
        "content",
        "Request custom software development projects. Choose from existing templates or describe your unique requirements. Student discounts available."
      );
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
    "Mini Projects": Code,
  };

  const filteredProjects = Array.isArray(projectTemplates)
    ? projectTemplates.filter((project) => {
        const matchesSearch =
          project.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          project.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          project.description?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory =
          selectedCategory === "All" ||
          project.category === selectedCategory ||
          project.category?.name === selectedCategory;
        // For backend projects, we'll assume they're suitable for all user types since they're requestable
        const matchesUserType = true; // All requestable projects are suitable for requests
        return matchesSearch && matchesCategory && matchesUserType;
      })
    : [];

  const handleProjectSelect = (project) => {
    navigate("/project-request/customize", {
      state: {
        project,
        userType,
        requestType: "existing",
      },
    });
  };

  const handleNewProjectRequest = () => {
    setShowForm(true);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      // Prepare data for backend API (do not submit yet)
      // Find IDs for select fields
      const selectedCourseCategory = courseCategories.find(
        (cat) =>
          cat.id?.toString() === formData.course_category?.toString() ||
          cat.name === formData.course_category
      );
      const selectedServicePackage = [
        ...(servicePackages.student || []),
        ...(servicePackages.business || []),
        ...(servicePackages.enterprise || []),
      ].find(
        (pkg) =>
          pkg.id?.toString() === formData.service_package?.toString() ||
          pkg.name === formData.service_package
      );
      const selectedTemplate = projectTemplates.find(
        (tpl) =>
          tpl.id?.toString() === formData.template?.toString() ||
          tpl.name === formData.template
      );
      // preferred_technologies should be array of IDs
      const preferredTechIds = Array.isArray(formData.preferred_technologies)
        ? formData.preferred_technologies.map((tech) =>
            typeof tech === "object" && tech.id ? tech.id : tech
          )
        : [];

      const payload = {
        title: formData.title,
        description: formData.description,
        requirements: formData.requirements || "",
        request_type: "new",
        user_type: userType,
        budget_range: formData.budget_range || "",
        preferred_deadline: formData.preferred_deadline || null,
        timeline_flexibility: formData.timeline_flexibility || "flexible",
        contact_phone: formData.contact_phone || "",
        contact_email: formData.contact_email || "",
        client_notes: formData.client_notes || "",
        course_category: selectedCourseCategory
          ? selectedCourseCategory.id
          : null,
        academic_level: formData.academic_level || "",
        institution: formData.institution || "",
        template: selectedTemplate ? selectedTemplate.id : null,
        customizations: formData.customizations || "",
        preferred_technologies: preferredTechIds,
        technology_notes: formData.technology_notes || "",
        features_required: formData.features_required || "",
        additional_features: formData.additional_features || "",
        service_package: selectedServicePackage
          ? selectedServicePackage.id
          : null,
      };

      // Instead of submitting, navigate to confirmation page for review
      navigate("/project-request/confirmation", {
        state: {
          formData: payload,
          userType: userType,
        },
      });
    } catch (error) {
      console.error("Form error:", error);
      toast.error(error.message || "Failed to prepare project request.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
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

  const getPriceRange = (project, userType) => {
    // If project has explicit price_range, use it
    if (project.price_range) {
      return project.price_range;
    }

    // Try to get base price from various possible fields
    const basePrice =
      project.estimatedPrice ||
      project.estimated_price ||
      project.price ||
      50000;

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
              Whether you need a completely new solution or want to customize an
              existing project, we're here to bring your ideas to life with
              professional development services.
            </p>
          </div>

          {/* User Type Selection */}
          <div className="max-w-4xl mx-auto mb-12">
            <div className="text-center mb-6">
              <h3 className="h4 mb-4">I am a...</h3>
              <div className="flex flex-wrap justify-center gap-4">
                {[
                  {
                    type: "student",
                    label: "Student",
                    icon: GraduationCap,
                    desc: "Academic projects with student pricing",
                  },
                  {
                    type: "client",
                    label: "Individual Client",
                    icon: User,
                    desc: "Personal or small business projects",
                  },
                  {
                    type: "business",
                    label: "Business",
                    icon: Building,
                    desc: "Enterprise solutions and systems",
                  },
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
                    <Icon
                      className={`w-8 h-8 mx-auto mb-3 ${
                        userType === type ? "text-color-1" : "text-n-4"
                      }`}
                    />
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
              <div
                className={`p-8 rounded-xl border-2 transition-all duration-300 cursor-pointer ${
                  requestType === "new"
                    ? "border-color-1 bg-color-1/5 shadow-lg"
                    : "border-n-6 hover:border-n-4 hover:bg-n-7/30"
                }`}
                onClick={() => setRequestType("new")}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center">
                    <Plus className="w-8 h-8 text-color-1 mr-3" />
                    <h3 className="h4">New Custom Project</h3>
                  </div>
                  <CheckCircle2
                    className={`w-6 h-6 ${
                      requestType === "new" ? "text-color-1" : "text-n-6"
                    }`}
                  />
                </div>
                <p className="body-1 text-n-3 mb-6">
                  Describe your unique requirements and we'll build a completely
                  custom solution from scratch.
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
                <SimpleButton
                  className="w-full"
                  onClick={handleNewProjectRequest}
                  disabled={requestType !== "new"}
                >
                  Start New Project
                  <ArrowRight className="w-4 h-4 ml-2" />
                </SimpleButton>
              </div>

              {/* Existing Project Card */}
              <div
                className={`p-8 rounded-xl border-2 transition-all duration-300 cursor-pointer ${
                  requestType === "existing"
                    ? "border-color-1 bg-color-1/5 shadow-lg"
                    : "border-n-6 hover:border-n-4 hover:bg-n-7/30"
                }`}
                onClick={() => setRequestType("existing")}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center">
                    <Star className="w-8 h-8 text-color-1 mr-3" />
                    <h3 className="h4">Customize Existing Project</h3>
                  </div>
                  <CheckCircle2
                    className={`w-6 h-6 ${
                      requestType === "existing" ? "text-color-1" : "text-n-6"
                    }`}
                  />
                </div>
                <p className="body-1 text-n-3 mb-6">
                  Choose from our proven project templates and customize them to
                  match your specific requirements.
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
                <SimpleButton
                  className="w-full"
                  onClick={() => setRequestType("existing")}
                  variant={requestType !== "existing" ? "secondary" : "primary"}
                >
                  Browse Templates
                  <ArrowRight className="w-4 h-4 ml-2" />
                </SimpleButton>
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
                        {Array.isArray(projectCategories) &&
                          projectCategories.map((category) => (
                            <option
                              key={category.id || category.name || category}
                              value={category.name || category}
                            >
                              {category.name || category}
                            </option>
                          ))}
                      </select>
                      <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-n-4 w-5 h-5 pointer-events-none" />
                    </div>
                  </div>
                </div>

                {/* User Type Badge */}
                <div className="mt-4 flex items-center justify-center">
                  <span
                    className={`px-4 py-2 rounded-full text-sm font-medium ${getUserTypeColor(
                      userType
                    )}`}
                  >
                    {userType === "student" && "Student Pricing Applied"}
                    {userType === "client" && "Individual Client Rates"}
                    {userType === "business" && "Enterprise Pricing"}
                  </span>
                </div>
              </div>

              {/* Project Templates Grid */}
              <div className="max-w-6xl mx-auto">
                {loading ? (
                  <div className="flex justify-center items-center py-12">
                    <Loader2 className="w-8 h-8 animate-spin text-color-1" />
                    <span className="ml-2 text-n-3">Loading templates...</span>
                  </div>
                ) : filteredProjects.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 mx-auto mb-4 bg-n-6 rounded-full flex items-center justify-center">
                      <Code className="w-8 h-8 text-n-4" />
                    </div>
                    <h3 className="text-xl font-semibold text-n-2 mb-2">
                      No templates found
                    </h3>
                    <p className="text-n-4 mb-6">
                      {searchTerm || selectedCategory !== "All"
                        ? "Try adjusting your search criteria or browse all templates"
                        : "No project templates are currently available"}
                    </p>
                    <SimpleButton
                      onClick={() => {
                        setSearchTerm("");
                        setSelectedCategory("All");
                      }}
                      variant="secondary"
                    >
                      Clear Filters
                    </SimpleButton>
                  </div>
                ) : (
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredProjects.map((project) => {
                      const categoryName =
                        project.category?.name || project.category || "General";
                      const IconComponent = categoryIcons[categoryName] || Code;
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
                                {project.difficulty ||
                                  project.complexity ||
                                  "Medium"}
                              </span>
                            </div>
                          </div>

                          <h3 className="h6 mb-2 group-hover:text-color-1 transition-colors">
                            {project.name || project.title}
                          </h3>

                          <p className="body-2 text-n-4 mb-4 line-clamp-3">
                            {project.description}
                          </p>

                          <div className="space-y-2 mb-4">
                            <div className="flex items-center justify-between text-sm">
                              <span className="text-n-4">Timeline:</span>
                              <span className="text-n-2">
                                {project.timeline ||
                                  project.estimated_duration ||
                                  "2-4 weeks"}
                              </span>
                            </div>
                            <div className="flex items-center justify-between text-sm">
                              <span className="text-n-4">Price Range:</span>
                              <span className="text-green-400 font-medium">
                                {project.price_range ||
                                  getPriceRange(project, userType)}
                              </span>
                            </div>
                          </div>

                          <div className="flex flex-wrap gap-1 mb-4">
                            {(project.technologies || [])
                              .slice(0, 3)
                              .map((tech, index) => (
                                <span
                                  key={index}
                                  className="text-xs px-2 py-1 bg-n-6 text-n-3 rounded"
                                >
                                  {tech.name || tech}
                                </span>
                              ))}
                            {(project.technologies || []).length > 3 && (
                              <span className="text-xs px-2 py-1 bg-n-6 text-n-3 rounded">
                                +{(project.technologies || []).length - 3} more
                              </span>
                            )}
                          </div>

                          <SimpleButton className="w-full" variant="secondary">
                            Customize This Project
                            <ArrowRight className="w-4 h-4 ml-2" />
                          </SimpleButton>
                        </div>
                      );
                    })}
                  </div>
                )}

                {!loading && filteredProjects.length === 0 && (
                  <div className="text-center py-12">
                    <Search className="w-16 h-16 text-n-4 mx-auto mb-4" />
                    <h3 className="h5 mb-2">No projects found</h3>
                    <p className="body-1 text-n-4 mb-6">
                      Try adjusting your search criteria or browse all
                      categories.
                    </p>
                    <SimpleButton
                      onClick={() => {
                        setSearchTerm("");
                        setSelectedCategory("All");
                      }}
                    >
                      Clear Filters
                    </SimpleButton>
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
                  Comprehensive support for your academic journey from proposal
                  to publication
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
                {servicePackages.student &&
                servicePackages.student.length > 0 ? (
                  servicePackages.student.map((pkg, index) => (
                    <div
                      key={pkg.id || `student-package-${index}`}
                      className="p-6 bg-n-7 rounded-xl border border-n-6"
                    >
                      <div className="flex items-center mb-4">
                        <GraduationCap className="w-6 h-6 text-color-1 mr-2" />
                        <h4 className="h6">{pkg.name}</h4>
                      </div>
                      <p className="body-2 text-n-4 mb-4">{pkg.description}</p>
                      <div className="text-2xl font-bold text-color-1 mb-4">
                        {pkg.price}
                      </div>
                      <ul className="space-y-2">
                        {pkg.features &&
                          pkg.features.length > 0 &&
                          pkg.features
                            .slice(0, 4)
                            .map((feature, featureIndex) => (
                              <li
                                key={`${pkg.id}-feature-${featureIndex}`}
                                className="flex items-center text-sm text-n-4"
                              >
                                <CheckCircle2 className="w-4 h-4 text-green-400 mr-2 flex-shrink-0" />
                                {feature}
                              </li>
                            ))}
                      </ul>
                    </div>
                  ))
                ) : (
                  <div className="col-span-full text-center py-8">
                    <p className="text-n-4">
                      {loading
                        ? "Loading packages..."
                        : `No student packages available (${
                            servicePackages.student?.length || 0
                          } found)`}
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </Section>

      {/* Project Request Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-n-8 rounded-2xl border border-n-6 p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-n-1">
                New Project Request
              </h2>
              <button
                onClick={() => setShowForm(false)}
                className="p-2 hover:bg-n-7 rounded-lg transition-colors"
              >
                <X className="w-6 h-6 text-n-4" />
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="space-y-6">
              {/* Project Title */}
              <div>
                <label className="block text-sm font-medium text-n-2 mb-2">
                  Project Title *
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => handleInputChange("title", e.target.value)}
                  className="w-full px-4 py-3 bg-n-7 border border-n-6 rounded-lg text-n-1 placeholder-n-4 focus:border-color-1 focus:outline-none"
                  placeholder="Enter your project title"
                />
              </div>

              {/* Project Description */}
              <div>
                <label className="block text-sm font-medium text-n-2 mb-2">
                  Project Description *
                </label>
                <textarea
                  required
                  rows={4}
                  value={formData.description}
                  onChange={(e) =>
                    handleInputChange("description", e.target.value)
                  }
                  className="w-full px-4 py-3 bg-n-7 border border-n-6 rounded-lg text-n-1 placeholder-n-4 focus:border-color-1 focus:outline-none resize-none"
                  placeholder="Describe what you want to build..."
                />
              </div>

              {/* Student-specific fields */}
              {userType === "student" && (
                <>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-n-2 mb-2">
                        Course Category
                      </label>
                      <select
                        value={formData.course_category}
                        onChange={(e) =>
                          handleInputChange("course_category", e.target.value)
                        }
                        className="w-full px-4 py-3 bg-n-7 border border-n-6 rounded-lg text-n-1 focus:border-color-1 focus:outline-none"
                      >
                        <option value="">Select course category</option>
                        {Array.isArray(courseCategories) &&
                        courseCategories.length > 0
                          ? courseCategories.map((category) => (
                              <option
                                key={category.id || category.name || category}
                                value={category.name || category}
                              >
                                {category.name || category}
                              </option>
                            ))
                          : null}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-n-2 mb-2">
                        Academic Level
                      </label>
                      <select
                        value={formData.academic_level}
                        onChange={(e) =>
                          handleInputChange("academic_level", e.target.value)
                        }
                        className="w-full px-4 py-3 bg-n-7 border border-n-6 rounded-lg text-n-1 focus:border-color-1 focus:outline-none"
                      >
                        <option value="">Select academic level</option>
                        <option value="diploma">Diploma</option>
                        <option value="undergraduate">Undergraduate</option>
                        <option value="graduate">Graduate</option>
                        <option value="phd">PhD</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-n-2 mb-2">
                      Institution
                    </label>
                    <input
                      type="text"
                      value={formData.institution}
                      onChange={(e) =>
                        handleInputChange("institution", e.target.value)
                      }
                      className="w-full px-4 py-3 bg-n-7 border border-n-6 rounded-lg text-n-1 placeholder-n-4 focus:border-color-1 focus:outline-none"
                      placeholder="University of Dar es Salaam, UDSM, etc."
                    />
                  </div>
                </>
              )}

              {/* Requirements */}
              <div>
                <label className="block text-sm font-medium text-n-2 mb-2">
                  Specific Requirements
                </label>
                <textarea
                  rows={3}
                  value={formData.requirements}
                  onChange={(e) =>
                    handleInputChange("requirements", e.target.value)
                  }
                  className="w-full px-4 py-3 bg-n-7 border border-n-6 rounded-lg text-n-1 placeholder-n-4 focus:border-color-1 focus:outline-none resize-none"
                  placeholder="Any specific technical requirements or constraints..."
                />
              </div>

              {/* Budget Range */}
              <div>
                <label className="block text-sm font-medium text-n-2 mb-2">
                  Budget Range
                </label>
                <select
                  value={formData.budget_range}
                  onChange={(e) =>
                    handleInputChange("budget_range", e.target.value)
                  }
                  className="w-full px-4 py-3 bg-n-7 border border-n-6 rounded-lg text-n-1 focus:border-color-1 focus:outline-none"
                >
                  <option value="">Select budget range</option>
                  <option value="TSH 50,000 - TSH 100,000">
                    TSH 50,000 - TSH 100,000
                  </option>
                  <option value="TSH 100,000 - TSH 200,000">
                    TSH 100,000 - TSH 200,000
                  </option>
                  <option value="TSH 200,000 - TSH 300,000">
                    TSH 200,000 - TSH 300,000
                  </option>
                  <option value="TSH 300,000 - TSH 400,000">
                    TSH 300,000 - TSH 400,000
                  </option>
                  <option value="TSH 400,000 - TSH 500,000">
                    TSH 400,000 - TSH 500,000
                  </option>
                  <option value="Over TSH 500,000">Over TSH 500,000</option>
                </select>
              </div>

              {/* Preferred Deadline */}
              <div>
                <label className="block text-sm font-medium text-n-2 mb-2">
                  Preferred Deadline
                </label>
                <input
                  type="date"
                  value={formData.preferred_deadline}
                  onChange={(e) =>
                    handleInputChange("preferred_deadline", e.target.value)
                  }
                  className="w-full px-4 py-3 bg-n-7 border border-n-6 rounded-lg text-n-1 focus:border-color-1 focus:outline-none"
                />
              </div>

              {/* Contact Information */}
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-n-2 mb-2">
                    Contact Email
                  </label>
                  <input
                    type="email"
                    value={formData.contact_email}
                    onChange={(e) =>
                      handleInputChange("contact_email", e.target.value)
                    }
                    className="w-full px-4 py-3 bg-n-7 border border-n-6 rounded-lg text-n-1 placeholder-n-4 focus:border-color-1 focus:outline-none"
                    placeholder="your.email@example.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-n-2 mb-2">
                    Contact Phone
                  </label>
                  <input
                    type="tel"
                    value={formData.contact_phone}
                    onChange={(e) =>
                      handleInputChange("contact_phone", e.target.value)
                    }
                    className="w-full px-4 py-3 bg-n-7 border border-n-6 rounded-lg text-n-1 placeholder-n-4 focus:border-color-1 focus:outline-none"
                    placeholder="+255 XXX XXX XXX"
                  />
                </div>
              </div>

              {/* Additional Notes */}
              <div>
                <label className="block text-sm font-medium text-n-2 mb-2">
                  Additional Notes
                </label>
                <textarea
                  rows={3}
                  value={formData.client_notes}
                  onChange={(e) =>
                    handleInputChange("client_notes", e.target.value)
                  }
                  className="w-full px-4 py-3 bg-n-7 border border-n-6 rounded-lg text-n-1 placeholder-n-4 focus:border-color-1 focus:outline-none resize-none"
                  placeholder="Any additional information or questions..."
                />
              </div>

              {/* User Type Display */}
              <div className="bg-n-7 rounded-lg p-4 border border-n-6">
                <div className="flex items-center">
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${getUserTypeColor(
                      userType
                    )}`}
                  >
                    {userType.charAt(0).toUpperCase() + userType.slice(1)}{" "}
                    Project
                  </span>
                  <span className="ml-3 text-n-4 text-sm">
                    {userType === "student" &&
                      "Student pricing will be applied"}
                    {userType === "client" && "Individual client rates"}
                    {userType === "business" && "Enterprise pricing"}
                  </span>
                </div>
              </div>

              {/* Form Actions */}
              <div className="flex gap-4 pt-4">
                <SimpleButton
                  type="button"
                  onClick={() => setShowForm(false)}
                  variant="secondary"
                  className="flex-1"
                >
                  Cancel
                </SimpleButton>
                <SimpleButton
                  type="submit"
                  disabled={submitting}
                  className="bg-color-1 hover:bg-color-1/90 min-w-[150px]"
                >
                  {submitting ? (
                    <div className="flex items-center">
                      <Loader2 className="w-4 h-4 animate-spin mr-2" />
                      Preparing...
                    </div>
                  ) : (
                    <>
                      <Send className="w-4 h-4 mr-2" />
                      Review & Confirm
                    </>
                  )}
                </SimpleButton>
              </div>
            </form>
          </div>
        </div>
      )}

      <Footer />
    </>
  );
};

export default ProjectRequestPage;
