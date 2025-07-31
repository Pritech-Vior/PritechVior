import React from "react";
import { GraduationCap, BookOpen, Users, Award, Lightbulb, Target, ArrowRight, ExternalLink } from "lucide-react";
import Section from "../components/Section";
import Heading from "../components/Heading";
import Button from "../components/Button";
import Header from "../components/Header";
import Footer from "../components/Footer";

const ScholarPage = () => {
  const mainServices = [
    {
      icon: <Lightbulb className="w-8 h-8 text-color-1" />,
      title: "Project Design & Development",
      description: "Complete end-to-end project development from concept to deployment. Perfect for final year projects, academic research, and innovative solutions.",
      features: [
        "Project ideation and planning",
        "System architecture design", 
        "Full-stack development",
        "Database design & implementation",
        "Testing and quality assurance",
        "Documentation and presentation"
      ],
      price: "Starting from 300,000 TZS",
      duration: "3-6 months"
    },
    {
      icon: <BookOpen className="w-8 h-8 text-color-1" />,
      title: "Research & Mini Projects",
      description: "Comprehensive research support and mini-project development for academic excellence and skill building.",
      features: [
        "Research methodology guidance",
        "Literature review and analysis",
        "Data collection and analysis",
        "Academic writing support",
        "Mini-project development",
        "Presentation preparation"
      ],
      price: "Starting from 150,000 TZS",
      duration: "2-8 weeks"
    },
    {
      icon: <Target className="w-8 h-8 text-color-1" />,
      title: "Programs Advisory",
      description: "Strategic academic and career guidance to help you make informed decisions about your educational journey.",
      features: [
        "Academic program selection",
        "Career pathway planning",
        "Industry trends analysis",
        "Skill gap assessment",
        "Professional mentorship",
        "Portfolio development"
      ],
      price: "Starting from 50,000 TZS",
      duration: "Ongoing support"
    }
  ];

  const additionalFeatures = [
    {
      icon: <Users className="w-6 h-6 text-color-1" />,
      title: "Study Groups & Collaboration",
      description: "Connect with fellow scholars and collaborate on academic projects"
    },
    {
      icon: <Award className="w-6 h-6 text-color-1" />,
      title: "Scholarships & Funding",
      description: "Access information about scholarships and funding opportunities"
    },
    {
      icon: <GraduationCap className="w-6 h-6 text-color-1" />,
      title: "Certification Programs",
      description: "Earn industry-recognized certifications through our partner programs"
    }
  ];

  return (
    <div className="pt-[4.75rem] lg:pt-[5.25rem] overflow-hidden">
      <Header />
      
      {/* SEO Meta Tags */}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebPage",
          "name": "ViorScholar - Academic Resources & Scholarships",
          "description": "Access comprehensive academic resources, scholarships, and mentorship programs for African students.",
          "url": "https://pritechvior.co.tz/scholar",
          "breadcrumb": {
            "@type": "BreadcrumbList",
            "itemListElement": [
              {
                "@type": "ListItem",
                "position": 1,
                "name": "Home",
                "item": "https://pritechvior.co.tz/"
              },
              {
                "@type": "ListItem",  
                "position": 2,
                "name": "ViorScholar",
                "item": "https://pritechvior.co.tz/scholar"
              }
            ]
          }
        })}
      </script>
      
      <Section className="pt-[12rem] -mt-[5.25rem]" id="scholar">
        <div className="container relative">
          <Heading
            className="md:max-w-md lg:max-w-2xl text-center mx-auto mb-16"
            title="ViorScholar"
            text="Empowering students with comprehensive project development, research support, and academic advisory services"
          />

          {/* Main Services */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
            {mainServices.map((service, index) => (
              <div key={index} className="bg-n-7 rounded-xl p-8 border border-n-6 hover:border-color-1 transition-all duration-300 group">
                <div className="flex items-center gap-4 mb-6">
                  {service.icon}
                  <h3 className="text-xl font-semibold text-n-1">{service.title}</h3>
                </div>
                <p className="text-n-3 leading-relaxed mb-6">{service.description}</p>
                
                <div className="space-y-3 mb-6">
                  {service.features.map((feature, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 bg-color-1 rounded-full"></div>
                      <span className="text-sm text-n-4">{feature}</span>
                    </div>
                  ))}
                </div>
                
                <div className="border-t border-n-6 pt-4">
                  <div className="flex justify-center items-center mb-4">
                    <span className="text-n-4 text-sm">{service.duration}</span>
                  </div>
                  <Button className="w-full" href="/contact">
                    Get Started <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </div>
            ))}
          </div>

          {/* Additional Features */}
          <div className="bg-gradient-to-r from-color-1/5 to-color-2/5 rounded-2xl p-8 mb-16 border border-color-1/10">
            <h3 className="text-2xl font-semibold text-n-1 mb-8 text-center">Additional Academic Support</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {additionalFeatures.map((feature, index) => (
                <div key={index} className="text-center">
                  <div className="w-12 h-12 bg-n-7 rounded-xl flex items-center justify-center mx-auto mb-4 border border-color-1/20">
                    {feature.icon}
                  </div>
                  <h4 className="text-lg font-semibold text-n-1 mb-2">{feature.title}</h4>
                  <p className="text-n-3 text-sm">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* ThinkForge Integration */}
          <div className="bg-n-7 rounded-2xl p-8 border border-n-6 mb-16">
            <div className="flex flex-col lg:flex-row items-center gap-8">
              <div className="flex-1">
                <h3 className="text-2xl font-semibold text-n-1 mb-4">
                  Enhance Your Learning with ThinkForge
                </h3>
                <p className="text-n-3 mb-6">
                  Take your academic journey to the next level with our comprehensive e-learning platform. 
                  Access structured courses, interactive content, and certification programs designed to complement your studies.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-color-1 rounded-full"></div>
                    <span className="text-n-4 text-sm">Interactive Learning Modules</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-color-1 rounded-full"></div>
                    <span className="text-n-4 text-sm">Industry Certifications</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-color-1 rounded-full"></div>
                    <span className="text-n-4 text-sm">Progress Tracking</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-color-1 rounded-full"></div>
                    <span className="text-n-4 text-sm">Expert Instructors</span>
                  </div>
                </div>
                <Button href="/thinkforge">
                  Explore ThinkForge <ExternalLink className="w-4 h-4 ml-2" />
                </Button>
              </div>
              <div className="flex-shrink-0">
                <div className="w-64 h-48 bg-gradient-to-br from-color-1/10 to-color-2/10 rounded-xl flex items-center justify-center border border-color-1/20">
                  <BookOpen className="w-20 h-20 text-color-1" />
                </div>
              </div>
            </div>
          </div>

          {/* Call to Action */}
          <div className="text-center">
            <div className="bg-gradient-to-r from-color-1/10 to-color-2/10 rounded-2xl p-8 border border-color-1/20">
              <h3 className="text-2xl font-semibold text-n-1 mb-4">
                Ready to Excel in Your Academic Journey?
              </h3>
              <p className="text-n-3 mb-6 max-w-2xl mx-auto">
                Join thousands of successful students who have achieved academic excellence with ViorScholar. 
                Get personalized support for your projects, research, and career planning.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button href="/contact">
                  Start Your Project <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
                <Button href="/thinkforge" white>
                  Explore Courses <ExternalLink className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </Section>

      <Footer />
    </div>
  );
};

export default ScholarPage;
