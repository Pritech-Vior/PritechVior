import { Users, Target, Eye, Heart, Building, User, Briefcase, DollarSign, Code, ShoppingBag, GraduationCap, HeadphonesIcon } from "lucide-react";
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

  const OrganizationNode = ({ icon, title, subtitle, children, level = 0, isSpecial = false }) => (
    <div className={`flex flex-col items-center ${level > 0 ? 'mt-8' : ''}`}>
      <div className={`
        relative ${isSpecial ? 'bg-n-6 border-color-1' : 'bg-n-7'} 
        rounded-xl p-3 border-2 ${isSpecial ? 'border-color-1' : 'border-n-6'} 
        hover:border-color-1 transition-all duration-300 shadow-lg hover:shadow-xl
        ${level === 0 ? 'w-56 h-28 min-w-[200px] bg-n-6 border-color-1' : 
          level === 1 ? 'w-48 h-24 min-w-[180px]' : 
          'w-44 h-20 min-w-[160px]'}
        max-w-[250px]
      `}>
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
      {children && (
        <div className="relative mt-6">
          {/* Connecting lines */}
          <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-6 w-px h-6 bg-color-1"></div>
          <div className="flex justify-center gap-4 flex-wrap">
            {children}
          </div>
        </div>
      )}
    </div>
  );

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
          <div className="mb-20">
            <h2 className="text-3xl font-bold text-n-1 text-center mb-12">
              PRITECH VIOR Organizational Structure
            </h2>
            
            <div className="bg-n-8 rounded-3xl p-6 lg:p-8 border border-n-6 overflow-x-auto">
              {/* CEO Level */}
              <div className="flex justify-center mb-12">
                <OrganizationNode
                  icon={<User className="w-6 h-6 text-white" />}
                  title="CEO / Founder"
                  subtitle="Oversees vision, mission & operations"
                  level={0}
                />
              </div>

              {/* Management Level */}
              <div className="flex justify-center gap-4 lg:gap-6 mb-12 flex-wrap">
                <OrganizationNode
                  icon={<Briefcase className="w-4 h-4 text-white" />}
                  title="Operations Manager"
                  subtitle="Day-to-day coordination"
                  level={1}
                />
                <OrganizationNode
                  icon={<Code className="w-4 h-4 text-white" />}
                  title="Technical Director"
                  subtitle="Software & systems lead"
                  level={1}
                />
                <OrganizationNode
                  icon={<Target className="w-4 h-4 text-white" />}
                  title="Business Dev. Lead"
                  subtitle="Partnerships & marketing"
                  level={1}
                />
                <OrganizationNode
                  icon={<DollarSign className="w-4 h-4 text-white" />}
                  title="Finance & Admin Lead"
                  subtitle="Treasury & procurement"
                  level={1}
                />
              </div>

              {/* Department Level */}
              <div className="flex justify-center gap-3 lg:gap-4 mb-12 flex-wrap">
                <OrganizationNode
                  icon={<Users className="w-3 h-3 text-white" />}
                  title="Project Manager"
                  subtitle="Student project officers"
                  level={2}
                />
                <OrganizationNode
                  icon={<Code className="w-3 h-3 text-white" />}
                  title="Software Engineers"
                  subtitle="System & app developers"
                  level={2}
                />
                <OrganizationNode
                  icon={<Target className="w-3 h-3 text-white" />}
                  title="Marketing Team"
                  subtitle="UI/UX & branding"
                  level={2}
                />
                <OrganizationNode
                  icon={<DollarSign className="w-3 h-3 text-white" />}
                  title="Treasury Officer"
                  subtitle="Procurement officer"
                  level={2}
                />
              </div>

              {/* Special Divisions */}
              <div className="border-t-2 border-color-1 pt-8">
                <h3 className="text-xl font-bold text-color-1 text-center mb-8">Special Divisions / Units</h3>
                <div className="flex justify-center gap-3 lg:gap-4 flex-wrap">
                  <OrganizationNode
                    icon={<GraduationCap className="w-4 h-4 text-white" />}
                    title="E-Learning Unit"
                    subtitle="Education platform"
                    level={2}
                    isSpecial={true}
                  />
                  <OrganizationNode
                    icon={<ShoppingBag className="w-4 h-4 text-white" />}
                    title="PritechShop"
                    subtitle="E-commerce platform"
                    level={2}
                    isSpecial={true}
                  />
                  <OrganizationNode
                    icon={<GraduationCap className="w-4 h-4 text-white" />}
                    title="ViorScholar"
                    subtitle="Academic resources"
                    level={2}
                    isSpecial={true}
                  />
                  <OrganizationNode
                    icon={<HeadphonesIcon className="w-4 h-4 text-white" />}
                    title="Customer Support"
                    subtitle="Support services"
                    level={2}
                    isSpecial={true}
                  />
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
