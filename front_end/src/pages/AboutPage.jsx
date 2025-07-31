import React from "react";
import { Users, Target, Eye, Heart, Building, User, Briefcase, DollarSign, Code, ShoppingBag, GraduationCap, HeadphonesIcon } from "lucide-react";
import { check } from "../assets";
import Section from "../components/Section";
import Heading from "../components/Heading";
import Button from "../components/Button";
import Header from "../components/Header";
import Footer from "../components/Footer";

const AboutPage = () => {
  const values = [
    {
      icon: <Code className="w-8 h-8 text-color-1" />,
      title: "Innovation",
      description: "Pushing boundaries with cutting-edge technology solutions"
    },
    {
      icon: <Heart className="w-8 h-8 text-color-1" />,
      title: "Integrity", 
      description: "Building trust through transparent and ethical practices"
    },
    {
      icon: <Users className="w-8 h-8 text-color-1" />,
      title: "Collaboration",
      description: "Fostering teamwork and partnerships for greater impact"
    },
    {
      icon: <Target className="w-8 h-8 text-color-1" />,
      title: "Excellence",
      description: "Delivering exceptional quality in everything we do"
    },
    {
      icon: <Building className="w-8 h-8 text-color-1" />,
      title: "Accessibility", 
      description: "Making technology solutions available to all communities"
    }
  ];

  const OrganizationNode = ({ icon, title, subtitle, children, level = 0, isSpecial = false, childCount = 0, isLast = false }) => {
    const childrenArray = React.Children.toArray(children);
    
    return (
      <div className={`flex flex-col items-center ${level > 0 ? 'mt-12' : ''} relative`}>
        {/* Connection point touching top border of card */}
        {level > 0 && (
          <>
            {/* Curved connection line touching top border */}
            <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 w-1 h-8">
              <svg width="4" height="32" className="absolute">
                <path 
                  d="M2,0 Q2,8 2,16 Q2,24 2,32" 
                  stroke="url(#gradient1)" 
                  strokeWidth="3" 
                  fill="none"
                  strokeLinecap="round"
                />
                <defs>
                  <linearGradient id="gradient1" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#0ea5e9" />
                    <stop offset="100%" stopColor="#3b82f6" />
                  </linearGradient>
                </defs>
              </svg>
            </div>
            {/* Connection knot on card border */}
            <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-3 h-3 bg-color-1 rounded-full border-2 border-white z-30 shadow-lg"></div>
          </>
        )}
        
        <div className={`
          relative ${isSpecial ? 'bg-n-6 border-color-1' : 'bg-n-7'} 
          rounded-xl p-3 border-2 ${isSpecial ? 'border-color-1' : 'border-n-6'} 
          hover:border-color-1 transition-all duration-300 shadow-lg hover:shadow-xl
          ${level === 0 ? 'w-56 h-28 min-w-[200px] bg-n-6 border-color-1' : 
            level === 1 ? 'w-48 h-24 min-w-[180px]' : 
            'w-44 h-20 min-w-[160px]'}
          max-w-[250px] z-20 relative
        `}>
          {/* Connection point touching bottom border of card */}
          {childrenArray.length > 0 && (
            <>
              {/* Connection knot on bottom border */}
              <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-3 h-3 bg-color-2 rounded-full border-2 border-white z-30 shadow-lg"></div>
              
              {/* Arrow pointing down from bottom border */}
              <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 z-30">
                <div className="w-0 h-0 border-l-4 border-r-4 border-t-6 border-l-transparent border-r-transparent border-t-color-2 drop-shadow-sm"></div>
              </div>
            </>
          )}
          
          {/* Add subtle accent for special divisions */}
          {isSpecial && level > 0 && (
            <div className="absolute top-0 right-0 w-3 h-3 bg-color-1 rounded-bl-lg"></div>
          )}
          
          <div className="flex flex-col items-center justify-center h-full text-center px-2">
            <div className="flex items-center gap-2 mb-2">
              {icon}
              <span className={`font-bold text-white leading-tight ${
                level === 0 ? 'text-sm' : 
                level === 1 ? 'text-xs' : 'text-[11px]'
              }`}>
                {title}
              </span>
            </div>
            {subtitle && (
              <span className={`text-n-3 text-center leading-tight px-1 ${
                level === 0 ? 'text-xs' : 
                level === 1 ? 'text-[10px]' : 'text-[9px]'
              }`}>
                {subtitle}
              </span>
            )}
          </div>
        </div>
        
        {childrenArray.length > 0 && (
          <div className="relative mt-12 w-full">
            {/* Curved main vertical line from bottom border */}
            <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 w-1 h-8">
              <svg width="4" height="32" className="absolute">
                <path 
                  d="M2,0 Q2,8 2,16 Q2,24 2,32" 
                  stroke="url(#gradient2)" 
                  strokeWidth="3" 
                  fill="none"
                  strokeLinecap="round"
                />
                <defs>
                  <linearGradient id="gradient2" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#3b82f6" />
                    <stop offset="100%" stopColor="#0ea5e9" />
                  </linearGradient>
                </defs>
              </svg>
            </div>
            
            {/* Curved horizontal distribution line for multiple children */}
            {childrenArray.length > 1 && (
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 flex items-center justify-center">
                <svg 
                  width={Math.min(childrenArray.length * 200, 800)} 
                  height="8"
                  className="absolute"
                >
                  <path 
                    d={`M20,4 Q${Math.min(childrenArray.length * 100, 400)},1 ${Math.min(childrenArray.length * 200 - 20, 780)},4`}
                    stroke="url(#gradient3)" 
                    strokeWidth="3" 
                    fill="none"
                    strokeLinecap="round"
                  />
                  <defs>
                    <linearGradient id="gradient3" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#0ea5e9" />
                      <stop offset="50%" stopColor="#3b82f6" />
                      <stop offset="100%" stopColor="#0ea5e9" />
                    </linearGradient>
                  </defs>
                </svg>
              </div>
            )}
            
            {/* Connection knots on horizontal curved line */}
            {childrenArray.length > 1 && (
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 flex justify-between items-center"
                   style={{ 
                     width: `${Math.min(childrenArray.length * 200, 800)}px`,
                     paddingLeft: '20px',
                     paddingRight: '20px'
                   }}>
                {childrenArray.map((_, index) => (
                  <div key={index} className="relative">
                    <div className="w-2 h-2 bg-color-1 rounded-full border border-white shadow-sm"></div>
                    {/* Curved drop line from knot to child card */}
                    <div className="absolute top-2 left-1/2 transform -translate-x-1/2 w-1">
                      <svg width="4" height="24" className="absolute">
                        <path 
                          d="M2,0 Q1,6 2,12 Q3,18 2,24" 
                          stroke="url(#gradient4)" 
                          strokeWidth="2" 
                          fill="none"
                          strokeLinecap="round"
                        />
                        <defs>
                          <linearGradient id="gradient4" x1="0%" y1="0%" x2="0%" y2="100%">
                            <stop offset="0%" stopColor="#0ea5e9" />
                            <stop offset="100%" stopColor="#3b82f6" />
                          </linearGradient>
                        </defs>
                      </svg>
                    </div>
                  </div>
                ))}
              </div>
            )}
            
            {/* Children container */}
            <div className="flex justify-center gap-6 lg:gap-8 flex-wrap relative">
              {childrenArray.map((child, index) => (
                <div key={index} className="relative flex flex-col items-center">
                  {/* Single child gets direct curved connection */}
                  {childrenArray.length === 1 && (
                    <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 w-1">
                      <svg width="4" height="32" className="absolute">
                        <path 
                          d="M2,0 Q1,8 2,16 Q3,24 2,32" 
                          stroke="url(#gradient5)" 
                          strokeWidth="3" 
                          fill="none"
                          strokeLinecap="round"
                        />
                        <defs>
                          <linearGradient id="gradient5" x1="0%" y1="0%" x2="0%" y2="100%">
                            <stop offset="0%" stopColor="#3b82f6" />
                            <stop offset="100%" stopColor="#0ea5e9" />
                          </linearGradient>
                        </defs>
                      </svg>
                    </div>
                  )}
                  {child}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="pt-[4.75rem] lg:pt-[5.25rem] overflow-hidden">
      <Header />
      
      <Section className="pt-[12rem] -mt-[5.25rem]" id="about">
        <div className="container relative">
          <Heading
            className="md:max-w-md lg:max-w-2xl text-center mx-auto"
            title="About PRITECH VIOR"
            text="Empowering Africa through innovative technology solutions and digital transformation"
          />

          {/* Mission, Vision, Values */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-20">
            {/* Mission */}
            <div className="bg-gradient-to-br from-color-1/10 to-color-2/10 rounded-2xl p-8 border border-color-1/20">
              <div className="flex items-center gap-3 mb-4">
                <Target className="w-8 h-8 text-color-1" />
                <h3 className="text-2xl font-bold text-n-1">Mission</h3>
              </div>
              <p className="text-n-4 text-sm mb-4 font-medium">Why we exist</p>
              <p className="text-n-2">
                To provide innovative IT solutions that empower individuals and organizations across Africa through cutting-edge technology, education, and digital transformation.
              </p>
            </div>

            {/* Vision */}
            <div className="bg-gradient-to-br from-color-2/10 to-color-1/10 rounded-2xl p-8 border border-color-1/20">
              <div className="flex items-center gap-3 mb-4">
                <Eye className="w-8 h-8 text-color-2" />
                <h3 className="text-2xl font-bold text-n-1">Vision</h3>
              </div>
              <p className="text-n-4 text-sm mb-4 font-medium">Where we're going</p>
              <p className="text-n-2">
                To be Africa's leading hub for transformative tech solutions and digital education, fostering innovation and technological advancement across the continent.
              </p>
            </div>

            {/* Values Preview */}
            <div className="bg-gradient-to-br from-n-7 to-n-8 rounded-2xl p-8 border border-n-6">
              <div className="flex items-center gap-3 mb-4">
                <Heart className="w-8 h-8 text-color-1" />
                <h3 className="text-2xl font-bold text-n-1">Values</h3>
              </div>
              <p className="text-n-4 text-sm mb-4 font-medium">How we operate</p>
              <p className="text-n-2">
                Our core principles guide every decision and action we take in our mission to transform Africa's tech landscape.
              </p>
            </div>
          </div>

          {/* Core Values Detailed */}
          <div className="mb-20">
            <h2 className="text-3xl font-bold text-n-1 text-center mb-12">Our Core Values</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
              {values.map((value, index) => (
                <div key={index} className="bg-n-7 rounded-xl p-6 border border-n-6 hover:border-color-1 transition-all duration-300 text-center">
                  <div className="flex justify-center mb-4">{value.icon}</div>
                  <h4 className="text-lg font-semibold text-n-1 mb-3">{value.title}</h4>
                  <p className="text-n-3 text-sm">{value.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Organizational Structure */}
          <div className="mb-16">
            <h2 className="text-2xl font-bold text-n-1 text-center mb-8">
              PRITECH VIOR Organizational Structure
            </h2>
            
            <div className="bg-n-8 rounded-2xl p-4 border border-n-6 overflow-x-auto relative">
              {/* CEO Level */}
              <div className="flex justify-center mb-4">
                <div className="bg-n-6 border-2 border-color-1 rounded-xl p-3 w-48 text-center">
                  <div className="flex flex-col items-center gap-1">
                    <User className="w-5 h-5 text-color-1" />
                    <div>
                      <h3 className="font-bold text-white text-xs mb-0.5">CEO / Founder</h3>
                      <p className="text-n-3 text-[10px]">Oversees vision, mission & operations</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Management Level */}
              <div className="mb-4">
                <div className="flex justify-center gap-3 flex-wrap">
                  <div className="bg-n-7 border border-n-6 rounded-xl p-2 w-36 text-center hover:border-color-1 transition-all">
                    <div className="flex flex-col items-center gap-1">
                      <Briefcase className="w-3 h-3 text-color-1" />
                      <div>
                        <h4 className="font-bold text-white text-[10px] mb-0.5">Operations Manager</h4>
                        <p className="text-n-3 text-[9px]">Day-to-day coordination</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-n-7 border border-n-6 rounded-xl p-2 w-36 text-center hover:border-color-1 transition-all">
                    <div className="flex flex-col items-center gap-1">
                      <Code className="w-3 h-3 text-color-1" />
                      <div>
                        <h4 className="font-bold text-white text-[10px] mb-0.5">Technical Director</h4>
                        <p className="text-n-3 text-[9px]">Software & systems lead</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-n-7 border border-n-6 rounded-xl p-2 w-36 text-center hover:border-color-1 transition-all">
                    <div className="flex flex-col items-center gap-1">
                      <Target className="w-3 h-3 text-color-1" />
                      <div>
                        <h4 className="font-bold text-white text-[10px] mb-0.5">Business Dev. Lead</h4>
                        <p className="text-n-3 text-[9px]">Partnerships & marketing</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-n-7 border border-n-6 rounded-xl p-2 w-36 text-center hover:border-color-1 transition-all">
                    <div className="flex flex-col items-center gap-1">
                      <DollarSign className="w-3 h-3 text-color-1" />
                      <div>
                        <h4 className="font-bold text-white text-[10px] mb-0.5">Finance & Admin Lead</h4>
                        <p className="text-n-3 text-[9px]">Treasury & procurement</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Department Level */}
              <div className="mb-4">
                <div className="flex justify-center gap-3 flex-wrap">
                  <div className="bg-n-7 border border-n-6 rounded-xl p-2 w-32 text-center hover:border-color-1 transition-all">
                    <div className="flex flex-col items-center gap-1">
                      <Users className="w-3 h-3 text-color-1" />
                      <div>
                        <h4 className="font-bold text-white text-[10px] mb-0.5">Project Manager</h4>
                        <p className="text-n-3 text-[8px]">Student project officers</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-n-7 border border-n-6 rounded-xl p-2 w-32 text-center hover:border-color-1 transition-all">
                    <div className="flex flex-col items-center gap-1">
                      <Code className="w-3 h-3 text-color-1" />
                      <div>
                        <h4 className="font-bold text-white text-[10px] mb-0.5">Software Engineers</h4>
                        <p className="text-n-3 text-[8px]">System & app developers</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-n-7 border border-n-6 rounded-xl p-2 w-32 text-center hover:border-color-1 transition-all">
                    <div className="flex flex-col items-center gap-1">
                      <Target className="w-3 h-3 text-color-1" />
                      <div>
                        <h4 className="font-bold text-white text-[10px] mb-0.5">Marketing Team</h4>
                        <p className="text-n-3 text-[8px]">UI/UX & branding</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-n-7 border border-n-6 rounded-xl p-2 w-32 text-center hover:border-color-1 transition-all">
                    <div className="flex flex-col items-center gap-1">
                      <DollarSign className="w-3 h-3 text-color-1" />
                      <div>
                        <h4 className="font-bold text-white text-[10px] mb-0.5">Treasury Officer</h4>
                        <p className="text-n-3 text-[8px]">Procurement officer</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Special Divisions - Connected separately */}
              <div className="border-t-2 border-color-1 pt-3">
                <h3 className="text-sm font-bold text-color-1 text-center mb-3">Special Divisions / Units</h3>
                
                <div className="flex justify-center gap-3 flex-wrap">
                  <div className="bg-n-6 border-2 border-color-1 rounded-xl p-2 w-32 text-center hover:shadow-lg transition-all relative">
                    <div className="absolute top-0 right-0 w-1.5 h-1.5 bg-color-1 rounded-bl-lg"></div>
                    <div className="flex flex-col items-center gap-1">
                      <GraduationCap className="w-3 h-3 text-color-1" />
                      <div>
                        <h4 className="font-bold text-white text-[10px] mb-0.5">E-Learning Unit</h4>
                        <p className="text-n-3 text-[8px]">Education platform</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-n-6 border-2 border-color-1 rounded-xl p-2 w-32 text-center hover:shadow-lg transition-all relative">
                    <div className="absolute top-0 right-0 w-1.5 h-1.5 bg-color-1 rounded-bl-lg"></div>
                    <div className="flex flex-col items-center gap-1">
                      <ShoppingBag className="w-3 h-3 text-color-1" />
                      <div>
                        <h4 className="font-bold text-white text-[10px] mb-0.5">PritechShop</h4>
                        <p className="text-n-3 text-[8px]">E-commerce platform</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-n-6 border-2 border-color-1 rounded-xl p-2 w-32 text-center hover:shadow-lg transition-all relative">
                    <div className="absolute top-0 right-0 w-1.5 h-1.5 bg-color-1 rounded-bl-lg"></div>
                    <div className="flex flex-col items-center gap-1">
                      <GraduationCap className="w-3 h-3 text-color-1" />
                      <div>
                        <h4 className="font-bold text-white text-[10px] mb-0.5">ViorScholar</h4>
                        <p className="text-n-3 text-[8px]">Academic resources</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-n-6 border-2 border-color-1 rounded-xl p-2 w-32 text-center hover:shadow-lg transition-all relative">
                    <div className="absolute top-0 right-0 w-1.5 h-1.5 bg-color-1 rounded-bl-lg"></div>
                    <div className="flex flex-col items-center gap-1">
                      <HeadphonesIcon className="w-3 h-3 text-color-1" />
                      <div>
                        <h4 className="font-bold text-white text-[10px] mb-0.5">Customer Support</h4>
                        <p className="text-n-3 text-[8px]">Support services</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Key Leadership Roles */}
          <div className="mb-20">
            <h2 className="text-3xl font-bold text-n-1 text-center mb-12">Key Roles & Responsibilities</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                {
                  role: "CEO / Founder",
                  responsibility: "Oversees the entire vision, mission, and operations of the organization.",
                  icon: <User className="w-6 h-6 text-color-1" />
                },
                {
                  role: "Operations Manager", 
                  responsibility: "Coordinates day-to-day activities across all divisions and ensures smooth workflow.",
                  icon: <Briefcase className="w-6 h-6 text-color-1" />
                },
                {
                  role: "Technical Director",
                  responsibility: "Leads software development, systems architecture, and technological innovations.",
                  icon: <Code className="w-6 h-6 text-color-1" />
                },
                {
                  role: "Business Development Lead",
                  responsibility: "Expands partnerships, outreach, marketing strategies, and brand development.",
                  icon: <Target className="w-6 h-6 text-color-1" />
                },
                {
                  role: "Finance & Admin Lead",
                  responsibility: "Oversees all treasury operations, payroll, and procurement activities.",
                  icon: <DollarSign className="w-6 h-6 text-color-1" />
                },
                {
                  role: "Division Heads",
                  responsibility: "Manage their respective modules (E-Learning, Shop, Scholar) with dedicated teams.",
                  icon: <Building className="w-6 h-6 text-color-1" />
                }
              ].map((item, index) => (
                <div key={index} className="bg-n-7 rounded-xl p-6 border border-n-6 hover:border-color-1 transition-all duration-300">
                  <div className="flex items-center gap-3 mb-4">
                    {item.icon}
                    <h4 className="text-lg font-semibold text-n-1">{item.role}</h4>
                  </div>
                  <p className="text-n-3 text-sm leading-relaxed">{item.responsibility}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Call to Action */}
          <div className="text-center">
            <div className="bg-gradient-to-r from-color-1/10 to-color-2/10 rounded-2xl p-8 border border-color-1/20">
              <h3 className="text-2xl font-semibold text-n-1 mb-4">
                Join Our Mission
              </h3>
              <p className="text-n-3 mb-6 max-w-2xl mx-auto">
                Be part of Africa's digital transformation. Whether you're looking for innovative solutions or want to contribute to our growing ecosystem, we're here to collaborate.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button href="#contact">Get In Touch</Button>
                <Button className="bg-transparent border border-color-1 text-color-1 hover:bg-color-1 hover:text-white" href="#careers">
                  Join Our Team
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

export default AboutPage;
