import React, { useEffect, useState } from "react";
import {
  Folder,
  Star,
  ExternalLink,
  Calendar,
  User,
  Tag,
  Building,
  Search,
  Loader2,
} from "lucide-react";
import { projectsService } from "../services/projectsService";
import Section from "../components/Section";
import Heading from "../components/Heading";
import SimpleButton from "../components/SimpleButton";
import Header from "../components/Header";
import Footer from "../components/Footer";

const ProjectsPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [projects, setProjects] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const statuses = [
    "All",
    "Planning",
    "In Progress",
    "Review",
    "Completed",
    "On Hold",
    "Cancelled",
  ];

  // Load data from API
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);

        // Load projects and categories in parallel
        const [projectsData, categoriesData] = await Promise.all([
          projectsService.getProjects(),
          projectsService.getProjectCategories(),
        ]);

        setProjects(projectsData.results || projectsData);

        // Build categories list
        const categoryList = ["All"];
        if (categoriesData.results || categoriesData) {
          const apiCategories = (categoriesData.results || categoriesData)
            .filter((cat) => cat.is_active)
            .map((cat) => cat.name);
          categoryList.push(...apiCategories);
        }
        setCategories(categoryList);
      } catch (err) {
        console.error("Error loading projects data:", err);
        setError("Failed to load projects. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const filteredProjects = projects.filter((project) => {
    const matchesSearch =
      project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (project.client &&
        project.client.username &&
        project.client.username
          .toLowerCase()
          .includes(searchTerm.toLowerCase()));
    const matchesCategory =
      selectedCategory === "All" ||
      (project.category && project.category.name === selectedCategory);
    const matchesStatus =
      selectedStatus === "All" ||
      project.status === selectedStatus.toLowerCase().replace(" ", "_");
    return matchesSearch && matchesCategory && matchesStatus;
  });

  useEffect(() => {
    // Update page title and meta description for SEO
    document.title =
      "Project Portfolio - PritechVior | Professional Development Services";

    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute(
        "content",
        "Explore our diverse project portfolio featuring web development, mobile applications, and enterprise solutions. Professional development services in Tanzania."
      );
    }

    // Add structured data for better SEO
    const structuredData = {
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      name: "Project Portfolio",
      description: "Professional software development projects and solutions",
      url: "https://pritechvior.com/projects",
      mainEntity: {
        "@type": "ItemList",
        itemListElement: projects.map((project, index) => ({
          "@type": "CreativeWork",
          position: index + 1,
          name: project.title,
          description: project.description,
          url: `/project/${project.slug}`,
        })),
      },
    };

    const script = document.createElement("script");
    script.type = "application/ld+json";
    script.textContent = JSON.stringify(structuredData);
    document.head.appendChild(script);

    return () => {
      document.head.removeChild(script);
    };
  }, [projects]);

  return (
    <div className="pt-[4.75rem] lg:pt-[5.25rem] overflow-hidden">
      <Header />

      <Section className="pt-[12rem] -mt-[5.25rem]" id="projects">
        <div className="container relative">
          <Heading
            className="md:max-w-md lg:max-w-2xl text-center mx-auto"
            title="Our Project Portfolio"
            text="Discover our diverse range of projects spanning web development, mobile applications, and enterprise solutions. Each project showcases our commitment to quality, innovation, and client satisfaction."
          />

          {/* CTA Banner */}
          <div className="text-center mb-12">
            <div className="bg-gradient-to-r from-color-1/10 to-color-2/10 rounded-xl border border-color-1/20 p-8 max-w-4xl mx-auto">
              <h3 className="h4 mb-4">Need a Custom Project?</h3>
              <p className="body-1 text-n-3 mb-6">
                Whether you need a completely new solution or want to customize
                one of our existing projects, we&apos;re here to help bring your
                ideas to life.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <SimpleButton
                  href="/project-request"
                  className="bg-color-1 hover:bg-color-1/90"
                >
                  Request Custom Project
                </SimpleButton>
                <SimpleButton href="/project-request" white>
                  Browse Project Templates
                </SimpleButton>
              </div>
            </div>
          </div>

          {/* Search and Filter Section */}
          <div className="mb-12">
            <div className="flex flex-col lg:flex-row gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-n-4 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search projects..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-n-7 border border-n-6 rounded-lg text-n-1 placeholder-n-4 focus:border-color-1 focus:outline-none transition-colors"
                />
              </div>
              <div className="flex gap-4">
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
          {loading ? (
            <div className="flex justify-center items-center py-20">
              <Loader2 className="w-8 h-8 text-color-1 animate-spin" />
              <span className="ml-2 text-n-3">Loading projects...</span>
            </div>
          ) : error ? (
            <div className="text-center py-20">
              <p className="text-red-400 mb-4">{error}</p>
              <SimpleButton onClick={() => window.location.reload()}>
                Try Again
              </SimpleButton>
            </div>
          ) : (
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
                          <span className="text-n-4 text-sm">
                            {project.created_at
                              ? new Date(project.created_at).getFullYear()
                              : "N/A"}
                          </span>
                        </div>
                      </div>
                    </div>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        project.status === "completed"
                          ? "bg-green-500/20 text-green-400"
                          : project.status === "in_progress"
                          ? "bg-blue-500/20 text-blue-400"
                          : project.status === "review"
                          ? "bg-purple-500/20 text-purple-400"
                          : project.status === "planning"
                          ? "bg-yellow-500/20 text-yellow-400"
                          : project.status === "on_hold"
                          ? "bg-orange-500/20 text-orange-400"
                          : "bg-red-500/20 text-red-400"
                      }`}
                    >
                      {project.status
                        ?.replace("_", " ")
                        .replace(/\b\w/g, (l) => l.toUpperCase()) || "Unknown"}
                    </span>
                  </div>

                  <p className="text-n-3 mb-4 leading-relaxed">
                    {project.description}
                  </p>

                  <div className="flex flex-wrap gap-2 mb-6">
                    {project.category && (
                      <div className="flex items-center gap-2 px-3 py-1 bg-color-1/10 rounded-full">
                        <Tag className="w-4 h-4 text-color-1" />
                        <span className="text-color-1 text-sm font-medium">
                          {project.category.name}
                        </span>
                      </div>
                    )}
                    {project.client && (
                      <div className="flex items-center gap-2 px-3 py-1 bg-n-6 rounded-full">
                        <User className="w-4 h-4 text-n-3" />
                        <span className="text-n-3 text-sm">
                          {project.client.first_name && project.client.last_name
                            ? `${project.client.first_name} ${project.client.last_name}`
                            : project.client.username}
                        </span>
                      </div>
                    )}
                    {project.user_type && (
                      <div className="flex items-center gap-2 px-3 py-1 bg-n-6 rounded-full">
                        <Building className="w-4 h-4 text-n-3" />
                        <span className="text-n-3 text-sm capitalize">
                          {project.user_type}
                        </span>
                      </div>
                    )}
                  </div>

                  {project.technologies && project.technologies.length > 0 && (
                    <div className="mb-6">
                      <h4 className="text-sm font-medium text-n-2 mb-2">
                        Technologies:
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {project.technologies.map((tech) => (
                          <span
                            key={tech.id || tech.name}
                            className="px-2 py-1 bg-color-2/10 text-color-2 text-xs rounded-md"
                          >
                            {tech.name}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {project.progress_percentage !== undefined && (
                    <div className="mb-6">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-n-3">Progress</span>
                        <span className="text-sm text-n-2">
                          {project.progress_percentage}%
                        </span>
                      </div>
                      <div className="w-full bg-n-6 rounded-full h-2">
                        <div
                          className="bg-gradient-to-r from-color-1 to-color-2 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${project.progress_percentage}%` }}
                        ></div>
                      </div>
                    </div>
                  )}

                  <div className="flex gap-4">
                    {project.live_demo_url && (
                      <SimpleButton
                        className="flex-1"
                        href={project.live_demo_url}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <ExternalLink className="w-4 h-4 mr-2" />
                        View Demo
                      </SimpleButton>
                    )}
                    <SimpleButton className="flex-1" href="/contact" white>
                      Contact Us
                    </SimpleButton>
                  </div>
                </div>
              ))}
            </div>
          )}

          {filteredProjects.length === 0 && !loading && !error && (
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
                onClick={() => setSelectedCategory("Web Development")}
              >
                <User className="w-12 h-12 text-color-1 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-n-1 mb-3">
                  Web Development
                </h3>
                <p className="text-n-3 text-sm">
                  Modern web applications, responsive websites, and progressive
                  web apps built with the latest technologies.
                </p>
                <p className="text-color-1 text-xs mt-2 font-medium">
                  {
                    projects.filter(
                      (p) => p.category?.name === "Web Development"
                    ).length
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
                  E-Commerce Solutions
                </h3>
                <p className="text-n-3 text-sm">
                  Online stores, marketplace platforms, and custom e-commerce
                  solutions for businesses of all sizes.
                </p>
                <p className="text-color-1 text-xs mt-2 font-medium">
                  {
                    projects.filter((p) => p.category?.name === "E-Commerce")
                      .length
                  }{" "}
                  projects
                </p>
              </div>

              <div
                className="bg-gradient-to-br from-n-7 to-n-8 rounded-2xl p-8 border border-n-6 text-center cursor-pointer hover:border-color-1 transition-colors"
                onClick={() => setSelectedCategory("Mobile Development")}
              >
                <Star className="w-12 h-12 text-color-1 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-n-1 mb-3">
                  Mobile Development
                </h3>
                <p className="text-n-3 text-sm">
                  Cross-platform mobile apps, native iOS and Android
                  applications for modern businesses.
                </p>
                <p className="text-color-1 text-xs mt-2 font-medium">
                  {
                    projects.filter(
                      (p) => p.category?.name === "Mobile Development"
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
                enterprise system, we&apos;re here to bring your ideas to life
                with cutting-edge technology.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <SimpleButton href="/contact">Start Your Project</SimpleButton>
                <SimpleButton
                  className="bg-transparent border border-color-1 text-color-1 hover:bg-color-1 hover:text-white"
                  href="/about"
                >
                  Learn More About Us
                </SimpleButton>
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
