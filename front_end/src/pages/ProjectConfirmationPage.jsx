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

const ProjectConfirmationPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { formData, requestData, isCustomization, estimatedCost, userType } =
    location.state || {};

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [referenceNumber, setReferenceNumber] = useState("");

  useEffect(() => {
    if (!formData && !requestData) {
      navigate("/project-request");
      return;
    }

    // Generate reference number
    const ref = `PV-${userType?.toUpperCase()}-${Date.now()
      .toString()
      .slice(-6)}`;
    setReferenceNumber(ref);

    document.title = "Project Request Confirmation - PRITECH VIOR";
  }, [formData, requestData, navigate, userType]);

  const data = isCustomization
    ? requestData
    : { formData, estimatedCost, userType };
  const projectInfo = isCustomization ? data.baseProject : null;
  const finalFormData = isCustomization ? data.customizations : data.formData;

  const handleSubmit = async () => {
    setIsSubmitting(true);

    try {
      // Here you would typically send the data to your backend
      const submissionData = {
        referenceNumber,
        timestamp: new Date().toISOString(),
        userType,
        estimatedCost,
        isCustomization,
        ...(isCustomization
          ? {
              baseProject: projectInfo,
              customizations: finalFormData,
            }
          : {
              projectData: finalFormData,
            }),
      };

      console.log("Submitting project request:", submissionData);

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000));

      setIsSubmitted(true);
    } catch (error) {
      console.error("Submission error:", error);
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

  if (isSubmitted) {
    return (
      <>
        <Header />
        <Section className="pt-[4.75rem] lg:pt-[5.25rem]">
          <div className="container relative z-1">
            <div className="max-w-3xl mx-auto text-center">
              <div className="w-20 h-20 bg-green-400/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle2 className="w-12 h-12 text-green-400" />
              </div>

              <h2 className="h2 mb-4">Request Submitted Successfully!</h2>
              <p className="body-1 text-n-4 mb-8">
                Your project request has been received and is being reviewed by
                our team.
              </p>

              <div className="bg-n-7 rounded-xl border border-n-6 p-6 mb-8">
                <h3 className="h5 mb-4">Reference Number</h3>
                <div className="bg-n-8 rounded-lg p-4 mb-4">
                  <span className="text-2xl font-mono font-bold text-color-1">
                    {referenceNumber}
                  </span>
                </div>
                <p className="text-n-4 text-sm">
                  Please save this reference number for tracking your project
                  request.
                </p>
              </div>

              <div className="space-y-4 mb-8">
                <div className="flex items-center justify-center text-n-3">
                  <Mail className="w-5 h-5 mr-2" />
                  <span>
                    Confirmation email sent to {finalFormData?.contactEmail}
                  </span>
                </div>
                <div className="flex items-center justify-center text-n-3">
                  <Clock className="w-5 h-5 mr-2" />
                  <span>Expected response time: 24-48 hours</span>
                </div>
              </div>

              <div className="flex flex-wrap justify-center gap-4">
                <SimpleButton onClick={generatePDF} variant="secondary">
                  <Download className="w-4 h-4 mr-2" />
                  Download PDF
                </SimpleButton>
                <SimpleButton onClick={() => navigate("/")}>
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Home
                </SimpleButton>
                <SimpleButton onClick={() => navigate("/project-request")}>
                  New Request
                  <ArrowRight className="w-4 h-4 ml-2" />
                </SimpleButton>
              </div>
            </div>
          </div>
        </Section>
        <Footer />
      </>
    );
  }

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
                title="Confirm Your Project Request"
              />
            </div>
            <p className="body-1 max-w-3xl mx-auto text-n-2">
              Please review your project details before submitting your request
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="grid lg:grid-cols-3 gap-8">
              {/* Main Content */}
              <div className="lg:col-span-2 space-y-8">
                {/* Project Summary */}
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
                        {finalFormData?.projectTitle || projectInfo?.title}
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
                        {finalFormData?.projectCategory ||
                          projectInfo?.category}
                      </p>
                    </div>

                    <div>
                      <h4 className="text-sm font-medium text-n-2 mb-1">
                        Description
                      </h4>
                      <p className="text-n-3">
                        {finalFormData?.projectDescription ||
                          finalFormData?.customDescription ||
                          projectInfo?.description}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Technical Details */}
                <div className="bg-n-7 rounded-xl border border-n-6 p-6">
                  <h3 className="h5 mb-6">Technical Specifications</h3>

                  <div className="space-y-4">
                    {finalFormData?.selectedTechStack && (
                      <div>
                        <h4 className="text-sm font-medium text-n-2 mb-2">
                          Technology Stack
                        </h4>
                        <p className="text-n-3">
                          {finalFormData.selectedTechStack}
                        </p>
                      </div>
                    )}

                    {(finalFormData?.customTechnologies?.length > 0 ||
                      finalFormData?.technologyChanges?.length > 0) && (
                      <div>
                        <h4 className="text-sm font-medium text-n-2 mb-2">
                          Additional Technologies
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {(
                            finalFormData.customTechnologies ||
                            finalFormData.technologyChanges ||
                            []
                          ).map((tech, index) => (
                            <span
                              key={index}
                              className="px-2 py-1 bg-n-6 text-n-3 rounded text-sm"
                            >
                              {tech}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {finalFormData?.databaseRequired && (
                      <div>
                        <h4 className="text-sm font-medium text-n-2 mb-1">
                          Database
                        </h4>
                        <p className="text-n-3">{finalFormData.databaseType}</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Features */}
                <div className="bg-n-7 rounded-xl border border-n-6 p-6">
                  <h3 className="h5 mb-6">Features & Functionality</h3>

                  <div className="space-y-4">
                    {(finalFormData?.coreFeatures?.length > 0 ||
                      projectInfo?.features) && (
                      <div>
                        <h4 className="text-sm font-medium text-n-2 mb-2">
                          Core Features
                        </h4>
                        <div className="grid md:grid-cols-2 gap-2">
                          {(
                            finalFormData?.coreFeatures ||
                            projectInfo?.features ||
                            []
                          ).map((feature, index) => (
                            <div
                              key={index}
                              className="flex items-center text-sm text-n-3"
                            >
                              <CheckCircle2 className="w-3 h-3 text-green-400 mr-2 flex-shrink-0" />
                              {feature}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {finalFormData?.additionalFeatures?.length > 0 && (
                      <div>
                        <h4 className="text-sm font-medium text-n-2 mb-2">
                          Additional Features
                        </h4>
                        <div className="grid md:grid-cols-2 gap-2">
                          {finalFormData.additionalFeatures.map(
                            (feature, index) => (
                              <div
                                key={index}
                                className="flex items-center text-sm text-n-3"
                              >
                                <CheckCircle2 className="w-3 h-3 text-color-1 mr-2 flex-shrink-0" />
                                {feature}
                              </div>
                            )
                          )}
                        </div>
                      </div>
                    )}

                    {finalFormData?.userRoles?.length > 0 && (
                      <div>
                        <h4 className="text-sm font-medium text-n-2 mb-2">
                          User Roles
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {finalFormData.userRoles.map((role, index) => (
                            <span
                              key={index}
                              className="px-2 py-1 bg-color-1/20 text-color-1 rounded text-sm"
                            >
                              {role}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Academic Information (for students) */}
                {userType === "student" && (
                  <div className="bg-n-7 rounded-xl border border-n-6 p-6">
                    <h3 className="h5 mb-6">Academic Information</h3>

                    <div className="grid md:grid-cols-2 gap-4">
                      {finalFormData?.course && (
                        <div>
                          <h4 className="text-sm font-medium text-n-2 mb-1">
                            Course
                          </h4>
                          <p className="text-n-3">{finalFormData.course}</p>
                        </div>
                      )}

                      {finalFormData?.projectType && (
                        <div>
                          <h4 className="text-sm font-medium text-n-2 mb-1">
                            Project Type
                          </h4>
                          <p className="text-n-3">
                            {finalFormData.projectType}
                          </p>
                        </div>
                      )}
                    </div>

                    {finalFormData?.researchComponents?.length > 0 && (
                      <div className="mt-4">
                        <h4 className="text-sm font-medium text-n-2 mb-2">
                          Research Components
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {finalFormData.researchComponents.map(
                            (component, index) => (
                              <span
                                key={index}
                                className="px-2 py-1 bg-green-400/20 text-green-400 rounded text-sm"
                              >
                                {component}
                              </span>
                            )
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Support Services */}
                {finalFormData?.selectedServices?.length > 0 && (
                  <div className="bg-n-7 rounded-xl border border-n-6 p-6">
                    <h3 className="h5 mb-6">Selected Support Services</h3>

                    <div className="space-y-3">
                      {finalFormData.selectedServices.map(
                        (serviceId, index) => (
                          <div
                            key={index}
                            className="flex items-center justify-between p-3 bg-n-8 rounded-lg"
                          >
                            <span className="text-n-2">{serviceId}</span>
                            <span className="text-color-1 font-medium text-sm">
                              Included
                            </span>
                          </div>
                        )
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                {/* Cost Breakdown */}
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

                {/* Timeline */}
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

                {/* Contact Information */}
                <div className="bg-n-7 rounded-xl border border-n-6 p-6">
                  <h3 className="h6 mb-4">Contact Information</h3>

                  <div className="space-y-3">
                    {finalFormData?.contactEmail && (
                      <div className="flex items-center text-sm">
                        <Mail className="w-4 h-4 text-color-1 mr-2 flex-shrink-0" />
                        <span className="text-n-3 break-all">
                          {finalFormData.contactEmail}
                        </span>
                      </div>
                    )}

                    {finalFormData?.contactPhone && (
                      <div className="flex items-center text-sm">
                        <Phone className="w-4 h-4 text-color-1 mr-2 flex-shrink-0" />
                        <span className="text-n-3">
                          {finalFormData.contactPhone}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Reference Number Preview */}
                <div className="bg-n-7 rounded-xl border border-n-6 p-6">
                  <h3 className="h6 mb-4 flex items-center">
                    <FileText className="w-5 h-5 mr-2 text-color-1" />
                    Reference Number
                  </h3>

                  <div className="bg-n-8 rounded-lg p-3">
                    <span className="font-mono text-color-1 font-bold">
                      {referenceNumber}
                    </span>
                  </div>

                  <p className="text-n-4 text-xs mt-2">
                    Save this number for tracking your request
                  </p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
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

            {/* Additional Notes */}
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
