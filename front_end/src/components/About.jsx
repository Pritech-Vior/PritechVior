import React from "react";
import Section from "./Section";
import Heading from "./Heading";
import { 
  Users, 
  Award, 
  Target, 
  Lightbulb,
  CheckCircle
} from "lucide-react";

const About = () => {
  const statistics = [
    { number: "50+", label: "Projects Completed", icon: CheckCircle },
    { number: "30+", label: "Happy Clients", icon: Users },
    { number: "3+", label: "Years Experience", icon: Award },
    { number: "24/7", label: "Support Available", icon: Target },
  ];

  const values = [
    {
      icon: Lightbulb,
      title: "Innovation",
      description: "We leverage cutting-edge technologies to deliver innovative solutions that drive business growth."
    },
    {
      icon: Users,
      title: "Partnership", 
      description: "We work closely with our clients as trusted partners to understand and exceed their expectations."
    },
    {
      icon: Target,
      title: "Excellence",
      description: "We maintain the highest standards of quality in every project we undertake."
    },
    {
      icon: Award,
      title: "Local Expertise",
      description: "Deep understanding of the Tanzanian market with global technology standards."
    }
  ];

  return (
    <Section id="about">
      <div className="container">
        <Heading
          className="md:max-w-3xl lg:max-w-4xl mx-auto text-center"
          title="About PritechVior"
          text="Leading IT innovation company in Tanzania, delivering world-class technology solutions for businesses, institutions, and individuals."
        />

        {/* Statistics */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {statistics.map((stat, index) => {
            const IconComponent = stat.icon;
            return (
              <div key={index} className="text-center p-6 bg-n-7 rounded-2xl">
                <div className="w-12 h-12 bg-gradient-to-r from-color-1 to-color-2 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <IconComponent size={24} className="text-white" />
                </div>
                <div className="h2 text-n-1 mb-2">{stat.number}</div>
                <p className="body-2 text-n-4">{stat.label}</p>
              </div>
            );
          })}
        </div>

        {/* Mission & Vision */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          <div className="bg-n-7 rounded-3xl p-8">
            <h3 className="h3 text-n-1 mb-6">Our Mission</h3>
            <p className="body-1 text-n-3 leading-relaxed">
              To empower Tanzanian businesses and institutions with innovative IT solutions 
              that drive digital transformation, enhance productivity, and create sustainable 
              competitive advantages in the global marketplace.
            </p>
          </div>

          <div className="bg-n-7 rounded-3xl p-8">
            <h3 className="h3 text-n-1 mb-6">Our Vision</h3>
            <p className="body-1 text-n-3 leading-relaxed">
              To become East Africa's leading IT innovation hub, recognized for delivering 
              world-class technology solutions that bridge the gap between local needs and 
              global technological advancement.
            </p>
          </div>
        </div>

        {/* Core Values */}
        <div>
          <h3 className="h3 text-n-1 text-center mb-12">Our Core Values</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => {
              const IconComponent = value.icon;
              return (
                <div key={index} className="text-center group">
                  <div className="w-16 h-16 bg-n-6 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:bg-gradient-to-r group-hover:from-color-1 group-hover:to-color-2 transition-all duration-300">
                    <IconComponent size={28} className="text-n-1" />
                  </div>
                  <h5 className="h5 text-n-1 mb-3">{value.title}</h5>
                  <p className="body-2 text-n-4 leading-relaxed">{value.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </Section>
  );
};

export default About;
