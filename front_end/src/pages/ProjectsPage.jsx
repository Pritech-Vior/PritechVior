import React, { useEffect } from "react";
import { Folder, Star, ExternalLink, Calendar, User, Tag } from "lucide-react";
import { projects } from "../constants";
import Section from "../components/Section";
import Heading from "../components/Heading";
import Button from "../components/Button";
import Header from "../components/Header";
import Footer from "../components/Footer";

const ProjectsPage = () => {
  useEffect(() => {
    // Update page title and meta description for SEO
    document.title = "Projects - PRITECH VIOR | Software Development & IT Solutions";
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute("content", "Explore our software development projects, academic solutions, and enterprise systems. From student management systems to e-commerce platforms and ERP solutions.");
    }
    
    // Add breadcrumb schema
    const breadcrumbSchema = {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": [
        {
          "@type": "ListItem",
          "position": 1,
          "name": "Home",
          "item": "https://pritechvior.com/"
        },
        {
          "@type": "ListItem", 
          "position": 2,
          "name": "Projects",
          "item": "https://pritechvior.com/projects"
        }
      ]
    };
    
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.text = JSON.stringify(breadcrumbSchema);
    document.head.appendChild(script);
    
    return () => {
      document.head.removeChild(script);
    };
  }, []);

  return (
    <div className="pt-[4.75rem] lg:pt-[5.25rem] overflow-hidden">
      <Header />
      
      <Section className="pt-[12rem] -mt-[5.25rem]" id="projects">
        <div className="container relative">
          <Heading
            className="md:max-w-md lg:max-w-2xl text-center mx-auto"
            title="Our Projects"
            text="Discover our portfolio of innovative software solutions, from academic projects to enterprise systems"
          />

          {/* Projects Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
            {projects.map((project) => (
              <div key={project.id} className="bg-n-7 rounded-xl p-6 border border-n-6 hover:border-color-1 transition-all duration-300">
                <div className="flex items-start justify-between mb-4">
                  <Folder className="w-8 h-8 text-color-1" />
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    project.status === 'Completed' ? 'bg-green-500/20 text-green-400' :
                    project.status === 'In Development' ? 'bg-blue-500/20 text-blue-400' :
                    'bg-yellow-500/20 text-yellow-400'
                  }`}>
                    {project.status}
                  </span>
                </div>
                
                <h3 className="text-xl font-bold text-n-1 mb-2">{project.title}</h3>
                <p className="text-n-3 text-sm mb-4">{project.description}</p>
                
                <div className="flex items-center gap-2 mb-4">
                  <Tag className="w-4 h-4 text-color-2" />
                  <span className="text-n-4 text-sm">{project.category}</span>
                </div>
                
                <div className="space-y-2 mb-6">
                  {project.technologies.slice(0, 3).map((tech, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <Star className="w-3 h-3 text-color-1" />
                      <span className="text-n-3 text-xs">{tech}</span>
                    </div>
                  ))}
                  {project.technologies.length > 3 && (
                    <span className="text-color-1 text-xs">+{project.technologies.length - 3} more features</span>
                  )}
                </div>
                
                <Button className="w-full" href="#contact">
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Get This Solution
                </Button>
              </div>
            ))}
          </div>

          {/* Project Categories */}
          <div className="mb-20">
            <h2 className="text-3xl font-bold text-n-1 text-center mb-12">Project Categories</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-gradient-to-br from-color-1/10 to-color-2/10 rounded-2xl p-8 border border-color-1/20 text-center">
                <User className="w-12 h-12 text-color-1 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-n-1 mb-3">Academic Projects</h3>
                <p className="text-n-3 text-sm">
                  Final year projects, student management systems, and educational solutions for universities and colleges.
                </p>
              </div>
              
              <div className="bg-gradient-to-br from-color-2/10 to-color-1/10 rounded-2xl p-8 border border-color-1/20 text-center">
                <Folder className="w-12 h-12 text-color-2 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-n-1 mb-3">Business Solutions</h3>
                <p className="text-n-3 text-sm">
                  E-commerce platforms, POS systems, and custom web applications for small to medium enterprises.
                </p>
              </div>
              
              <div className="bg-gradient-to-br from-n-7 to-n-8 rounded-2xl p-8 border border-n-6 text-center">
                <Star className="w-12 h-12 text-color-1 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-n-1 mb-3">Enterprise Systems</h3>
                <p className="text-n-3 text-sm">
                  Large-scale ERP systems, microservices architecture, and enterprise-grade solutions.
                </p>
              </div>
            </div>
          </div>

          {/* Call to Action */}
          <div className="text-center">
            <div className="bg-gradient-to-r from-color-1/10 to-color-2/10 rounded-2xl p-8 border border-color-1/20">
              <h3 className="text-2xl font-semibold text-n-1 mb-4">
                Need a Custom Solution?
              </h3>
              <p className="text-n-3 mb-6 max-w-2xl mx-auto">
                Whether you need an academic project, business solution, or enterprise system, 
                we're here to bring your ideas to life with cutting-edge technology.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button href="#contact">Start Your Project</Button>
                <Button className="bg-transparent border border-color-1 text-color-1 hover:bg-color-1 hover:text-white" href="/about">
                  Learn More About Us
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

export default ProjectsPage;
