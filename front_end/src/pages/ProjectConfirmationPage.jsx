import React from "react";
import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  CheckCircle2,
  ArrowLeft,
  ArrowRight,
  Mail,
  Phone,
  Calendar,
  DollarSign,
  User,
  Building,
  GraduationCap,
  FileText,
  Clock,
  Star,
  Download,
  Send,
} from "lucide-react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Section from "../components/Section";
import Heading from "../components/Heading";
import SimpleButton from "../components/SimpleButton";
import projectsService from "../services/projectsService";
import { useAuth } from "../contexts/AuthContext";

const ProjectConfirmationPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, user } = useAuth();
  const {
    formData,
    requestId,
    requestData,
    isCustomization,
    estimatedCost,
    userType,
  } = location.state || {};

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [referenceNumber, setReferenceNumber] = useState("");
  const [projectRequest, setProjectRequest] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!formData && !requestData && !requestId) {
      navigate("/project-request");
      return;
    }

    // If we have a requestId, fetch the project request details from backend
    if (requestId && !projectRequest) {
      fetchProjectRequest();
    }

    // Check if user is authenticated for submitting requests
    if (!isAuthenticated) {
      // Allow viewing the confirmation page but will redirect when trying to submit
      console.log("User not authenticated, will require login for submission");
    }

    // Generate reference number based on request ID or timestamp
    const ref = requestId
      ? `PV-${requestId.toString().padStart(6, "0")}`
      : `PV-${(userType || "REQ")?.toUpperCase()}-${Date.now()
          .toString()
          .slice(-6)}`;
    setReferenceNumber(ref);

    document.title = "Project Request Confirmation - PRITECH VIOR";
  }, [
    formData,
    requestData,
    requestId,
    navigate,
    userType,
    isAuthenticated,
    projectRequest,
  ]);

  const fetchProjectRequest = async () => {
    setLoading(true);
    try {
      const response = await projectsService.getProjectRequest(requestId);
      setProjectRequest(response);

      // If we successfully fetched the request, mark as submitted
      if (response.id) {
        setIsSubmitted(true);
      }
    } catch (error) {
      console.error("Failed to fetch project request:", error);
      // If we can't fetch the request, redirect back to form
      navigate("/project-request");
    } finally {
      setLoading(false);
    }
  };

  // Determine the data source based on what's available
  const data =
    projectRequest ||
    (isCustomization ? requestData : { formData, estimatedCost, userType });
  const projectInfo = isCustomization ? data.baseProject : null;
  const finalFormData = projectRequest
    ? {
        projectTitle: projectRequest.title,
        projectDescription: projectRequest.description,
        contactEmail: projectRequest.contact_email,
        contactPhone: projectRequest.contact_phone,
        selectedTechStack: projectRequest.technology_notes,
        coreFeatures: projectRequest.features_required || [],
        additionalFeatures: projectRequest.additional_features
          ? projectRequest.additional_features.split(", ")
          : [],
        budget: projectRequest.budget_range,
        preferredDeadline: projectRequest.preferred_deadline,
        timelineFlexibility: projectRequest.timeline_flexibility,
        additionalNotes: projectRequest.client_notes,
        userType: projectRequest.user_type,
        requestType: projectRequest.request_type,
        academicLevel: projectRequest.academic_level,
        institution: projectRequest.institution,
        requirements: projectRequest.requirements,
      }
    : isCustomization
    ? data.customizations
    : formData;

  // Calculate estimated cost for display
  const baseEstimate = 50000; // Base cost in TSH
  const studentDiscount = userType === "student" ? 0.25 : 0;
  const finalEstimate = baseEstimate * (1 - studentDiscount);

  const handleSubmit = async () => {
    // Check authentication before submitting
    if (!isAuthenticated) {
      // Redirect to login page
      alert("Please login to submit your project request.");
      navigate("/login", {
        state: {
          returnUrl: "/project-confirmation",
          returnState: {
            formData,
            requestData,
            isCustomization,
            estimatedCost,
            userType,
          },
        },
      });
      return;
    }

    // Validate required fields
    const title =
      finalFormData?.title ||
      finalFormData?.projectTitle ||
      projectInfo?.title ||
      "";
    const description =
      finalFormData?.description ||
      finalFormData?.projectDescription ||
      finalFormData?.customDescription ||
      projectInfo?.description ||
      "";

    if (!title.trim()) {
      alert("Project Title is required. Please go back and enter a title.");
      return;
    }
    if (!description.trim()) {
      alert(
        "Project Description is required. Please go back and enter a description."
      );
      return;
    }

    setIsSubmitting(true);

    try {
      // Prepare data for backend API
      const submissionData = {
        // Basic Information
        title,
        description,
        requirements: finalFormData?.additionalRequirements || "",

        // Request Details
        request_type: isCustomization ? "template" : "new",
        user_type: userType || "client",

        // Academic Information (for students)
        academic_level: finalFormData?.academicLevel || "",
        institution: finalFormData?.institution || "",

        // Template Customization (if applicable)
        template: isCustomization ? projectInfo?.id : null,
        customizations: isCustomization ? finalFormData : {},

        // Technical Requirements
        technology_notes: finalFormData?.selectedTechStack || "",

        // Project Scope
        features_required: [
          ...(finalFormData?.coreFeatures || []),
          ...(finalFormData?.additionalFeatures || []),
        ],
        additional_features:
          finalFormData?.additionalFeatures?.join(", ") || "",

        // Timeline & Budget
        budget_range: estimatedCost || "",
        preferred_deadline: finalFormData?.preferredDeadline || null,
        timeline_flexibility: finalFormData?.timelineFlexibility || "flexible",

        // Client Information
        contact_phone: finalFormData?.phone || "",
        contact_email: finalFormData?.email || "",

        // Estimated cost
        estimated_cost: estimatedCost
          ? parseFloat(estimatedCost.replace(/[^\d.]/g, ""))
          : null,

        // Notes
        client_notes:
          finalFormData?.specialRequirements || finalFormData?.notes || "",

        // Reference number for tracking (frontend generated)
        reference_number: referenceNumber,
      };

      console.log("Submitting project request:", submissionData);

      // Submit to backend
      const response = await projectsService.createProjectRequest(
        submissionData
      );

      console.log("Backend response:", response);

      setIsSubmitted(true);
    } catch (error) {
      console.error("Submission error:", error);
      // Optionally show error message to user
      alert("Failed to submit project request. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const generatePDF = () => {
    // Here you would typically generate a PDF with the project details
    console.log("Generating PDF for reference:", referenceNumber);
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

  const getUserTypeColor = () => {
    switch (userType) {
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

  const formatCurrency = (amount) => {
    return `TSH ${amount?.toLocaleString() || "0"}`;
  };

  // Confirmation page UI
  if (isSubmitted) {
    return (
      <>
        <Header />
        <Section className="pt-[4.75rem] lg:pt-[5.25rem] overflow-hidden">
          <div className="container relative z-1">
            <div className="max-w-[50rem] mx-auto mb-12 text-center">
              <div className="flex items-center justify-center mb-4">
                {React.createElement(getUserTypeIcon(), {
                  className: "w-8 h-8 text-color-1 mr-3",
                })}
                <Heading
                  className="md:max-w-md lg:max-w-2xl"
                  title="Confirm Your Project Request"
                />
              </div>
              <p className="body-1 max-w-3xl mx-auto text-n-2">
                Please review your project details before submitting your
                request
              </p>
            </div>
            <div className="max-w-4xl mx-auto">
              <div className="grid lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-8">
                  <div className="bg-n-7 rounded-xl border border-n-6 p-6">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="h5">Project Summary</h3>
                      <span
                        className={`px-3 py-1 rounded-full text-sm ${getUserTypeColor()}`}
                      >
                        {userType?.charAt(0).toUpperCase() + userType?.slice(1)}{" "}
                        Project
                      </span>
                    </div>
                    <div className="space-y-4">
                      <div>
                        <h4 className="text-sm font-medium text-n-2 mb-1">
                          Project Title
                        </h4>
                        <p className="text-n-1">
                          {finalFormData?.title ||
                            finalFormData?.projectTitle ||
                            projectInfo?.title ||
                            "Untitled Project"}
                        </p>
                      </div>
                      {isCustomization && (
                        <div>
                          <h4 className="text-sm font-medium text-n-2 mb-1">
                            Base Template
                          </h4>
                          <p className="text-n-3">{projectInfo?.title}</p>
                        </div>
                      )}
                      <div>
                        <h4 className="text-sm font-medium text-n-2 mb-1">
                          Category
                        </h4>
                        <p className="text-n-1">
                          {finalFormData?.course_category ||
                            finalFormData?.projectCategory ||
                            projectInfo?.category?.name ||
                            projectInfo?.category ||
                            "General"}
                        </p>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-n-2 mb-1">
                          Description
                        </h4>
                        <p className="text-n-3">
                          {finalFormData?.description ||
                            finalFormData?.projectDescription ||
                            finalFormData?.customDescription ||
                            projectInfo?.description ||
                            "No description provided"}
                        </p>
                      </div>
                      {finalFormData?.requirements && (
                        <div>
                          <h4 className="text-sm font-medium text-n-2 mb-1">
                            Requirements
                          </h4>
                          <p className="text-n-3">
                            {finalFormData.requirements}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                  {userType === "student" && (
                    <div className="bg-n-7 rounded-xl border border-n-6 p-6">
                      <h3 className="h5 mb-6">Academic Information</h3>
                      <div className="grid md:grid-cols-2 gap-4">
                        {(finalFormData?.course_category ||
                          finalFormData?.course) && (
                          <div>
                            <h4 className="text-sm font-medium text-n-2 mb-1">
                              Course Category
                            </h4>
                            <p className="text-n-3">
                              {finalFormData.course_category ||
                                finalFormData.course}
                            </p>
                          </div>
                        )}
                        {(finalFormData?.academic_level ||
                          finalFormData?.academicLevel) && (
                          <div>
                            <h4 className="text-sm font-medium text-n-2 mb-1">
                              Academic Level
                            </h4>
                            <p className="text-n-3 capitalize">
                              {finalFormData.academic_level ||
                                finalFormData.academicLevel}
                            </p>
                          </div>
                        )}
                      </div>
                      {finalFormData?.institution && (
                        <div className="mt-4">
                          <h4 className="text-sm font-medium text-n-2 mb-1">
                            Institution
                          </h4>
                          <p className="text-n-3">
                            {finalFormData.institution}
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
                <div className="space-y-6">
                  <div className="bg-gradient-to-r from-color-1/10 to-color-2/10 rounded-xl border border-color-1/20 p-6">
                    <h3 className="h5 mb-6 flex items-center">
                      <DollarSign className="w-5 h-5 mr-2 text-color-1" />
                      Cost Estimate
                    </h3>
                    <div className="space-y-3">
                      <div className="flex justify-between text-sm">
                        <span className="text-n-4">Base Cost:</span>
                        <span className="text-n-2">
                          {formatCurrency(
                            isCustomization
                              ? projectInfo?.estimatedPrice
                              : estimatedCost
                          )}
                        </span>
                      </div>
                      {userType === "student" && (
                        <div className="flex justify-between text-sm">
                          <span className="text-green-400">
                            Student Discount:
                          </span>
                          <span className="text-green-400">-25%</span>
                        </div>
                      )}
                      <div className="border-t border-n-6 pt-3">
                        <div className="flex justify-between font-bold">
                          <span className="text-n-1">Total Estimate:</span>
                          <span className="text-color-1 text-lg">
                            {formatCurrency(estimatedCost)}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="mt-4 p-3 bg-n-8 rounded-lg">
                      <p className="text-n-4 text-xs">
                        This is a preliminary estimate. Final pricing will be
                        provided after detailed consultation.
                      </p>
                    </div>
                  </div>
                  <div className="bg-n-7 rounded-xl border border-n-6 p-6">
                    <h3 className="h6 mb-4 flex items-center">
                      <Calendar className="w-5 h-5 mr-2 text-color-1" />
                      Project Timeline
                    </h3>
                    <div className="space-y-3 text-sm">
                      <div className="flex justify-between">
                        <span className="text-n-4">Estimated Duration:</span>
                        <span className="text-n-2">
                          {finalFormData?.timeline ||
                            projectInfo?.timeline ||
                            "To be determined"}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-n-4">Priority:</span>
                        <span className="text-n-2 capitalize">
                          {finalFormData?.priority || "Standard"}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="bg-n-7 rounded-xl border border-n-6 p-6">
                    <h3 className="h6 mb-4">Contact Information</h3>
                    <div className="space-y-3">
                      {(finalFormData?.contact_email ||
                        finalFormData?.contactEmail) && (
                        <div className="flex items-center text-sm">
                          <Mail className="w-4 h-4 text-color-1 mr-2 flex-shrink-0" />
                          <span className="text-n-3 break-all">
                            {finalFormData.contact_email ||
                              finalFormData.contactEmail}
                          </span>
                        </div>
                      )}
                      {(finalFormData?.contact_phone ||
                        finalFormData?.contactPhone) && (
                        <div className="flex items-center text-sm">
                          <Phone className="w-4 h-4 text-color-1 mr-2 flex-shrink-0" />
                          <span className="text-n-3">
                            {finalFormData.contact_phone ||
                              finalFormData.contactPhone}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex justify-between items-center mt-12 pt-8 border-t border-n-6">
                <SimpleButton onClick={() => navigate(-1)} variant="secondary">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Edit
                </SimpleButton>
                <div className="flex gap-4">
                  <SimpleButton onClick={generatePDF} variant="secondary">
                    <Download className="w-4 h-4 mr-2" />
                    Download Summary
                  </SimpleButton>
                  {/* No submit button after submission */}
                </div>
              </div>
              {finalFormData?.additionalNotes && (
                <div className="bg-n-7 rounded-xl border border-n-6 p-6 mt-8">
                  <h3 className="h6 mb-4">Additional Notes</h3>
                  <p className="text-n-3 whitespace-pre-wrap">
                    {finalFormData.additionalNotes}
                  </p>
                </div>
              )}
            </div>
          </div>
        </Section>
        <Footer />
      </>
    );
  }

  // Show confirmation details and allow user to submit
  return (
    <>
      <Header />
      <Section className="pt-[4.75rem] lg:pt-[5.25rem] overflow-hidden">
        <div className="container relative z-1">
          <div className="max-w-[50rem] mx-auto mb-12 text-center">
            <div className="flex items-center justify-center mb-4">
              {React.createElement(getUserTypeIcon(), {
                className: "w-8 h-8 text-color-1 mr-3",
              })}
              <Heading
                className="md:max-w-md lg:max-w-2xl"
                title="Confirm Your Project Request"
              />
            </div>
            <p className="body-1 max-w-3xl mx-auto text-n-2">
              Please review your project details before submitting your request
            </p>
          </div>
          <div className="max-w-4xl mx-auto">
            <div className="grid lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-8">
                <div className="bg-n-7 rounded-xl border border-n-6 p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="h5">Project Summary</h3>
                    <span
                      className={`px-3 py-1 rounded-full text-sm ${getUserTypeColor()}`}
                    >
                      {userType?.charAt(0).toUpperCase() + userType?.slice(1)}{" "}
                      Project
                    </span>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <h4 className="text-sm font-medium text-n-2 mb-1">
                        Project Title
                      </h4>
                      <p className="text-n-1">
                        {finalFormData?.title ||
                          finalFormData?.projectTitle ||
                          projectInfo?.title ||
                          "Untitled Project"}
                      </p>
                    </div>
                    {isCustomization && (
                      <div>
                        <h4 className="text-sm font-medium text-n-2 mb-1">
                          Base Template
                        </h4>
                        <p className="text-n-3">{projectInfo?.title}</p>
                      </div>
                    )}
                    <div>
                      <h4 className="text-sm font-medium text-n-2 mb-1">
                        Category
                      </h4>
                      <p className="text-n-1">
                        {finalFormData?.course_category ||
                          finalFormData?.projectCategory ||
                          projectInfo?.category?.name ||
                          projectInfo?.category ||
                          "General"}
                      </p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-n-2 mb-1">
                        Description
                      </h4>
                      <p className="text-n-3">
                        {finalFormData?.description ||
                          finalFormData?.projectDescription ||
                          finalFormData?.customDescription ||
                          projectInfo?.description ||
                          "No description provided"}
                      </p>
                    </div>
                    {finalFormData?.requirements && (
                      <div>
                        <h4 className="text-sm font-medium text-n-2 mb-1">
                          Requirements
                        </h4>
                        <p className="text-n-3">{finalFormData.requirements}</p>
                      </div>
                    )}
                  </div>
                </div>
                {userType === "student" && (
                  <div className="bg-n-7 rounded-xl border border-n-6 p-6">
                    <h3 className="h5 mb-6">Academic Information</h3>
                    <div className="grid md:grid-cols-2 gap-4">
                      {(finalFormData?.course_category ||
                        finalFormData?.course) && (
                        <div>
                          <h4 className="text-sm font-medium text-n-2 mb-1">
                            Course Category
                          </h4>
                          <p className="text-n-3">
                            {finalFormData.course_category ||
                              finalFormData.course}
                          </p>
                        </div>
                      )}
                      {(finalFormData?.academic_level ||
                        finalFormData?.academicLevel) && (
                        <div>
                          <h4 className="text-sm font-medium text-n-2 mb-1">
                            Academic Level
                          </h4>
                          <p className="text-n-3 capitalize">
                            {finalFormData.academic_level ||
                              finalFormData.academicLevel}
                          </p>
                        </div>
                      )}
                    </div>
                    {finalFormData?.institution && (
                      <div className="mt-4">
                        <h4 className="text-sm font-medium text-n-2 mb-1">
                          Institution
                        </h4>
                        <p className="text-n-3">{finalFormData.institution}</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
              <div className="space-y-6">
                <div className="bg-gradient-to-r from-color-1/10 to-color-2/10 rounded-xl border border-color-1/20 p-6">
                  <h3 className="h5 mb-6 flex items-center">
                    <DollarSign className="w-5 h-5 mr-2 text-color-1" />
                    Cost Estimate
                  </h3>
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-n-4">Base Cost:</span>
                      <span className="text-n-2">
                        {formatCurrency(
                          isCustomization
                            ? projectInfo?.estimatedPrice
                            : estimatedCost
                        )}
                      </span>
                    </div>
                    {userType === "student" && (
                      <div className="flex justify-between text-sm">
                        <span className="text-green-400">
                          Student Discount:
                        </span>
                        <span className="text-green-400">-25%</span>
                      </div>
                    )}
                    <div className="border-t border-n-6 pt-3">
                      <div className="flex justify-between font-bold">
                        <span className="text-n-1">Total Estimate:</span>
                        <span className="text-color-1 text-lg">
                          {formatCurrency(estimatedCost)}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="mt-4 p-3 bg-n-8 rounded-lg">
                    <p className="text-n-4 text-xs">
                      This is a preliminary estimate. Final pricing will be
                      provided after detailed consultation.
                    </p>
                  </div>
                </div>
                <div className="bg-n-7 rounded-xl border border-n-6 p-6">
                  <h3 className="h6 mb-4 flex items-center">
                    <Calendar className="w-5 h-5 mr-2 text-color-1" />
                    Project Timeline
                  </h3>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-n-4">Estimated Duration:</span>
                      <span className="text-n-2">
                        {finalFormData?.timeline ||
                          projectInfo?.timeline ||
                          "To be determined"}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-n-4">Priority:</span>
                      <span className="text-n-2 capitalize">
                        {finalFormData?.priority || "Standard"}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="bg-n-7 rounded-xl border border-n-6 p-6">
                  <h3 className="h6 mb-4">Contact Information</h3>
                  <div className="space-y-3">
                    {(finalFormData?.contact_email ||
                      finalFormData?.contactEmail) && (
                      <div className="flex items-center text-sm">
                        <Mail className="w-4 h-4 text-color-1 mr-2 flex-shrink-0" />
                        <span className="text-n-3 break-all">
                          {finalFormData.contact_email ||
                            finalFormData.contactEmail}
                        </span>
                      </div>
                    )}
                    {(finalFormData?.contact_phone ||
                      finalFormData?.contactPhone) && (
                      <div className="flex items-center text-sm">
                        <Phone className="w-4 h-4 text-color-1 mr-2 flex-shrink-0" />
                        <span className="text-n-3">
                          {finalFormData.contact_phone ||
                            finalFormData.contactPhone}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
            <div className="flex justify-between items-center mt-12 pt-8 border-t border-n-6">
              <SimpleButton onClick={() => navigate(-1)} variant="secondary">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Edit
              </SimpleButton>
              <div className="flex gap-4">
                <SimpleButton onClick={generatePDF} variant="secondary">
                  <Download className="w-4 h-4 mr-2" />
                  Download Summary
                </SimpleButton>
                <SimpleButton
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="bg-color-1 hover:bg-color-1/90 min-w-[150px]"
                >
                  {isSubmitting ? (
                    <div className="flex items-center">
                      <div className="w-4 h-4 border-2 border-n-8 border-t-transparent rounded-full animate-spin mr-2" />
                      Submitting...
                    </div>
                  ) : (
                    <>
                      <Send className="w-4 h-4 mr-2" />
                      Submit Request
                    </>
                  )}
                </SimpleButton>
              </div>
            </div>
            {finalFormData?.additionalNotes && (
              <div className="bg-n-7 rounded-xl border border-n-6 p-6 mt-8">
                <h3 className="h6 mb-4">Additional Notes</h3>
                <p className="text-n-3 whitespace-pre-wrap">
                  {finalFormData.additionalNotes}
                </p>
              </div>
            )}
          </div>
        </div>
      </Section>
      <Footer />
    </>
  );
};

export default ProjectConfirmationPage;
