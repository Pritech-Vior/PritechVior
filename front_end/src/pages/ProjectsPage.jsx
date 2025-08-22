import React, { useEffect, useState } from "react";
import {
  Folder,
  Star,
  ExternalLink,
  Calendar,
  User,
  Tag,
  Building,
  Clock,
  Search,
  Filter,
} from "lucide-react";
import { projects } from "../constants";
import Section from "../components/Section";
import Heading from "../components/Heading";
import Button from "../components/Button";
import Header from "../components/Header";
import Footer from "../components/Footer";

const ProjectsPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedStatus, setSelectedStatus] = useState("All");

  const categories = [
    "All",
    "E-Learning",
    "E-Commerce",
    "Management System",
    "Academic Project",
    "Web Application",
    "Enterprise",
  ];
  const statuses = ["All", "Completed", "In Production", "In Development"];

  const filteredProjects = projects.filter((project) => {
    const matchesSearch =
      project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.client.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCategory === "All" || project.category === selectedCategory;
    const matchesStatus =
      selectedStatus === "All" || project.status === selectedStatus;
    return matchesSearch && matchesCategory && matchesStatus;
  });
  useEffect(() => {
    // Update page title and meta description for SEO
    document.title =
      "Projects - PRITECH VIOR | Software Development & IT Solutions";
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute(
        "content",
        "Explore our portfolio of innovative software solutions including ThinkForge e-learning platform, ViorMart e-commerce system, and enterprise management solutions."
      );
    }

    // Add breadcrumb schema
    const breadcrumbSchema = {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "Home",
          item: "https://pritechvior.co.tz/",
        },
        {
          "@type": "ListItem",
          position: 2,
          name: "Projects",
          item: "https://pritechvior.co.tz/projects",
        },
      ],
    };

    const script = document.createElement("script");
    script.type = "application/ld+json";
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
            title="Our Project Portfolio"
            text="Discover innovative software solutions we've developed for clients across Tanzania and beyond"
          />

          {/* Call to Action Section */}
          <div className="text-center mb-12">
            <div className="bg-gradient-to-r from-color-1/10 to-color-2/10 rounded-xl border border-color-1/20 p-8 max-w-4xl mx-auto">
              <h3 className="h4 mb-4">Need a Custom Project?</h3>
              <p className="body-1 text-n-3 mb-6">
                Whether you need a completely new solution or want to customize
                one of our existing projects, we're here to help bring your
                ideas to life.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Button
                  href="/project-request"
                  className="bg-color-1 hover:bg-color-1/90"
                >
                  Request Custom Project
                </Button>
                <Button href="/project-request" white>
                  Browse Project Templates
                </Button>
              </div>
            </div>
          </div>

          {/* Search and Filter Section */}
          <div className="mb-12">
            <div className="flex flex-col lg:flex-row gap-4 mb-6">
              <div className="relative flex-1">
                <Search
                  size={20}
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-n-4"
                />
                <input
                  type="text"
                  placeholder="Search projects by name, description, or client..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-n-7 border border-n-6 rounded-lg text-n-1 placeholder-n-4 focus:border-color-1 focus:outline-none transition-colors"
                />
              </div>
              <div className="flex items-center gap-3">
                <Filter size={20} className="text-n-4" />
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="px-4 py-3 bg-n-7 border border-n-6 rounded-lg text-n-1 focus:border-color-1 focus:outline-none transition-colors"
                >
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="px-4 py-3 bg-n-7 border border-n-6 rounded-lg text-n-1 focus:border-color-1 focus:outline-none transition-colors"
                >
                  {statuses.map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="text-center text-n-3">
              Found {filteredProjects.length} project
              {filteredProjects.length !== 1 ? "s" : ""}
              {selectedCategory !== "All" && ` in ${selectedCategory}`}
              {selectedStatus !== "All" && ` with status: ${selectedStatus}`}
            </div>
          </div>

          {/* Projects Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-20">
            {filteredProjects.map((project) => (
              <div
                key={project.id}
                className="bg-n-7 rounded-xl p-8 border border-n-6 hover:border-color-1 transition-all duration-300 group"
              >
                <div className="flex items-start justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <Folder className="w-10 h-10 text-color-1" />
                    <div>
                      <h3 className="text-xl font-bold text-n-1 group-hover:text-color-1 transition-colors">
                        {project.title}
                      </h3>
                      <div className="flex items-center gap-2 mt-1">
                        <Calendar className="w-4 h-4 text-n-4" />
                        <span className="text-n-4 text-sm">{project.year}</span>
                      </div>
                    </div>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      project.status === "Completed"
                        ? "bg-green-500/20 text-green-400"
                        : project.status === "In Production"
                        ? "bg-blue-500/20 text-blue-400"
                        : "bg-yellow-500/20 text-yellow-400"
                    }`}
                  >
                    {project.status}
                  </span>
                </div>

                <p className="text-n-3 mb-4 leading-relaxed">
                  {project.description}
                </p>

                <div className="flex flex-wrap gap-2 mb-6">
                  <div className="flex items-center gap-2 px-3 py-1 bg-color-1/10 rounded-full">
                    <Tag className="w-4 h-4 text-color-1" />
                    <span className="text-color-1 text-sm font-medium">
                      {project.category}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 px-3 py-1 bg-n-6 rounded-full">
                    <Building className="w-4 h-4 text-n-3" />
                    <span className="text-n-3 text-sm">{project.client}</span>
                  </div>
                </div>

                <div className="mb-6">
                  <h4 className="text-n-1 font-semibold mb-3">
                    Key Technologies:
                  </h4>
                  <div className="grid grid-cols-1 gap-2">
                    {project.technologies.slice(0, 4).map((tech, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <Star className="w-3 h-3 text-color-2" />
                        <span className="text-n-3 text-sm">{tech}</span>
                      </div>
                    ))}
                    {project.technologies.length > 4 && (
                      <span className="text-color-1 text-sm ml-5">
                        +{project.technologies.length - 4} more features
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex gap-3">
                  {project.link && project.link !== "#" ? (
                    <Button className="flex-1" href={project.link}>
                      <ExternalLink className="w-4 h-4 mr-2" />
                      View Project
                    </Button>
                  ) : (
                    <Button className="flex-1" href="/contact">
                      <ExternalLink className="w-4 h-4 mr-2" />
                      Get Similar Solution
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>

          {filteredProjects.length === 0 && (
            <div className="text-center py-12 mb-20">
              <Folder size={64} className="mx-auto text-n-4 mb-4" />
              <h3 className="text-xl font-semibold text-n-1 mb-2">
                No projects found
              </h3>
              <p className="text-n-3">
                Try adjusting your search terms, category, or status filter.
              </p>
            </div>
          )}

          {/* Project Categories */}
          <div className="mb-20">
            <h2 className="text-3xl font-bold text-n-1 text-center mb-12">
              Project Categories
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div
                className="bg-gradient-to-br from-color-1/10 to-color-2/10 rounded-2xl p-8 border border-color-1/20 text-center cursor-pointer hover:border-color-1 transition-colors"
                onClick={() => setSelectedCategory("Academic Project")}
              >
                <User className="w-12 h-12 text-color-1 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-n-1 mb-3">
                  Academic Projects
                </h3>
                <p className="text-n-3 text-sm">
                  Final year projects, student management systems, and
                  educational solutions for universities and colleges.
                </p>
                <p className="text-color-1 text-xs mt-2 font-medium">
                  {
                    projects.filter((p) => p.category.includes("Academic"))
                      .length
                  }{" "}
                  projects
                </p>
              </div>

              <div
                className="bg-gradient-to-br from-color-2/10 to-color-1/10 rounded-2xl p-8 border border-color-1/20 text-center cursor-pointer hover:border-color-1 transition-colors"
                onClick={() => setSelectedCategory("E-Commerce")}
              >
                <Folder className="w-12 h-12 text-color-2 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-n-1 mb-3">
                  Business Solutions
                </h3>
                <p className="text-n-3 text-sm">
                  E-commerce platforms, POS systems, and custom web applications
                  for small to medium enterprises.
                </p>
                <p className="text-color-1 text-xs mt-2 font-medium">
                  {
                    projects.filter(
                      (p) =>
                        p.category.includes("E-Commerce") ||
                        p.category.includes("Web Application")
                    ).length
                  }{" "}
                  projects
                </p>
              </div>

              <div
                className="bg-gradient-to-br from-n-7 to-n-8 rounded-2xl p-8 border border-n-6 text-center cursor-pointer hover:border-color-1 transition-colors"
                onClick={() => setSelectedCategory("Enterprise")}
              >
                <Star className="w-12 h-12 text-color-1 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-n-1 mb-3">
                  Enterprise Systems
                </h3>
                <p className="text-n-3 text-sm">
                  Large-scale ERP systems, microservices architecture, and
                  enterprise-grade solutions.
                </p>
                <p className="text-color-1 text-xs mt-2 font-medium">
                  {
                    projects.filter(
                      (p) =>
                        p.category.includes("Enterprise") ||
                        p.category.includes("Management")
                    ).length
                  }{" "}
                  projects
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
                Whether you need an academic project, business solution, or
                enterprise system, we're here to bring your ideas to life with
                cutting-edge technology.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button href="/contact">Start Your Project</Button>
                <Button
                  className="bg-transparent border border-color-1 text-color-1 hover:bg-color-1 hover:text-white"
                  href="/about"
                >
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
