import React from "react";
import { benefits } from "../constants";
import Heading from "./Heading";
import Section from "./Section";
import Arrow from "../assets/svg/Arrow";
import { GradientLight } from "./design/Benefits";
import ClipPath from "../assets/svg/ClipPath";
import { 
  Settings, 
  Brain, 
  GraduationCap, 
  ShoppingCart, 
  MessageSquare, 
  Database 
} from "lucide-react";

const iconComponents = {
  Settings,
  Brain,
  GraduationCap,
  ShoppingCart,
  MessageSquare,
  Database,
};

const Benefits = () => {
  return (
    <Section id="solutions">
      <div className="container relative z-2 max-w-7xl mx-auto">
        <Heading
          className="md:max-w-3xl lg:max-w-4xl mx-auto text-center"
          title="Complete IT Solutions for Modern Businesses"
          text="Comprehensive technology services tailored for Tanzanian enterprises, startups, and academic institutions"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 mb-10">
          {benefits.map((item) => (
            <div
              className="block relative p-0.5 bg-no-repeat bg-[length:100%_100%] group hover:scale-[1.02] transition-transform duration-300"
              style={{
                backgroundImage: `url(${item.backgroundUrl})`,
              }}
              key={item.id}
            >
              <div className="relative z-2 flex flex-col min-h-[26rem] p-6 lg:p-8 pointer-events-none">
                <div className="flex items-center gap-3 mb-4">
                  {item.icon && iconComponents[item.icon] && (
                    <div className="w-12 h-12 bg-n-6 rounded-xl flex items-center justify-center flex-shrink-0">
                      {React.createElement(iconComponents[item.icon], {
                        size: 24,
                        className: "text-color-1"
                      })}
                    </div>
                  )}
                  <h5 className="h6 lg:h5 text-n-1 leading-tight">{item.title}</h5>
                </div>
                
                <p className="body-2 mb-6 text-n-3 flex-1">{item.text}</p>
                
                <div className="flex items-center mt-auto pt-4 border-t border-n-6/20">
                  <img
                    src={item.iconUrl}
                    width={32}
                    height={32}
                    alt={item.title}
                    className="opacity-30"
                  />
                  <p className="ml-auto font-code text-xs font-bold text-n-1 uppercase tracking-wider pointer-events-auto cursor-pointer hover:text-color-1 transition-colors">
                    Learn More
                  </p>
                  <Arrow />
                </div>
              </div>

              {item.light && <GradientLight />}

              <div
                className="absolute inset-0.5 bg-n-8"
                style={{ clipPath: "url(#benefits)" }}
              >
                <div className="absolute inset-0 opacity-0 transition-opacity hover:opacity-10">
                  {item.imageUrl && (
                    <img
                      src={item.imageUrl}
                      width={380}
                      height={362}
                      alt={item.title}
                      className="w-full h-full object-cover"
                    />
                  )}
                </div>
              </div>

              <ClipPath />
            </div>
          ))}
        </div>
      </div>
    </Section>
  );
};

export default Benefits;
