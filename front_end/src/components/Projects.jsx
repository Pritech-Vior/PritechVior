import React from "react";
import Section from "./Section";
import Heading from "./Heading";
import Button from "./Button";
import { projects } from "../constants";
import { check } from "../assets";
import { 
  Code, 
  Smartphone, 
  Building, 
  CheckCircle, 
  Clock, 
  AlertCircle 
} from "lucide-react";

const statusIcons = {
  "Completed": CheckCircle,
  "In Development": Clock,
  "Planning": AlertCircle,
};

const statusColors = {
  "Completed": "text-green-400",
  "In Development": "text-blue-400", 
  "Planning": "text-yellow-400",
};

const categoryIcons = {
  "Academic Project": Code,
  "Business Solution": Smartphone,
  "Enterprise Solution": Building,
};

const Projects = () => {
  return (
    <Section className="overflow-hidden" id="projects">
      <div className="container relative z-2">
        <Heading
          tag="Our Project Portfolio"
          title="Showcasing Innovation in IT Solutions"
        />

        <div className="relative grid gap-6 md:grid-cols-3 lg:gap-8 max-w-6xl mx-auto">
          {projects.map((project) => {
            const StatusIcon = statusIcons[project.status];
            const CategoryIcon = categoryIcons[project.category];
            
            return (
              <div
                key={project.id}
                className="relative p-0.5 bg-gradient-to-b from-color-1 to-color-2 rounded-3xl group hover:from-color-2 hover:to-color-1 transition-all duration-300"
              >
                <div className="relative bg-n-8 rounded-[1.4375rem] p-8 min-h-[28rem] flex flex-col">
                  {/* Header */}
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                      {CategoryIcon && (
                        <div className="w-10 h-10 bg-n-6 rounded-xl flex items-center justify-center">
                          <CategoryIcon size={20} className="text-color-1" />
                        </div>
                      )}
                      <div>
                        <h4 className="h6 text-n-1 mb-1">{project.title}</h4>
                        <p className="caption text-n-4">{project.category}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      {StatusIcon && (
                        <StatusIcon 
                          size={16} 
                          className={statusColors[project.status]} 
                        />
                      )}
                      <span className={`caption ${statusColors[project.status]}`}>
                        {project.status}
                      </span>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="body-2 text-n-3 mb-6">
                    {project.description}
                  </p>

                  {/* Technologies */}
                  <div className="flex-1">
                    <h6 className="h6 text-n-1 mb-4">Key Technologies & Features</h6>
                    <ul className="space-y-3">
                      {project.technologies.map((tech, index) => (
                        <li key={index} className="flex items-start gap-3">
                          <img 
                            src={check} 
                            width={16} 
                            height={16} 
                            alt="check" 
                            className="mt-1 flex-shrink-0"
                          />
                          <span className="body-2 text-n-4 leading-relaxed">
                            {tech}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* CTA Button */}
                  <div className="mt-8 pt-6 border-t border-n-6">
                    <Button 
                      className="w-full" 
                      href="#contact"
                      white={project.id === "1"}
                    >
                      {project.status === "Completed" ? "View Details" : "Get Started"}
                    </Button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="flex justify-center mt-12">
          <Button href="#contact">
            Start Your Project
          </Button>
        </div>
      </div>
    </Section>
  );
};

export default Projects;
