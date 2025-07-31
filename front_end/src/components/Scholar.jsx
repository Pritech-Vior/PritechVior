import { useState } from "react";
import { 
  GraduationCap, 
  BookOpen, 
  Users, 
  Award, 
  Download, 
  Star,
  Clock,
  DollarSign,
  Code,
  FileText,
  User,
  ExternalLink
} from "lucide-react";
import Section from "./Section";
import Heading from "./Heading";
import Button from "./Button";
import { scholarResources, studentStories, academicResources } from "../constants";

const Scholar = () => {
  const [activeTab, setActiveTab] = useState("services");

  const TabButton = ({ id, label, icon: Icon, isActive, onClick }) => (
    <button
      onClick={() => onClick(id)}
      className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all ${
        isActive
          ? "bg-color-1 text-white shadow-lg"
          : "bg-n-7 text-n-3 hover:bg-n-6 hover:text-n-1"
      }`}
    >
      <Icon size={20} />
      {label}
    </button>
  );

  const ServiceCard = ({ resource }) => (
    <div className="bg-n-7 rounded-xl p-6 border border-n-6 hover:border-color-1 transition-colors">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-xl font-semibold text-n-1 mb-2">{resource.title}</h3>
          <p className="text-n-3 text-sm mb-3">{resource.description}</p>
          <div className="flex flex-wrap gap-2 mb-4">
            <span className="px-3 py-1 bg-color-1/20 text-color-1 rounded-full text-xs">
              {resource.category}
            </span>
            <span className="px-3 py-1 bg-n-6 text-n-2 rounded-full text-xs">
              {resource.difficulty}
            </span>
          </div>
        </div>
        {resource.featured && (
          <div className="bg-color-2 text-white px-2 py-1 rounded text-xs font-semibold">
            Featured
          </div>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
        <div className="flex items-center gap-2 text-n-3">
          <Clock size={16} />
          {resource.duration}
        </div>
        <div className="flex items-center gap-2 text-n-3">
          <DollarSign size={16} />
          {resource.price}
        </div>
        <div className="flex items-center gap-2 text-n-3">
          <Star size={16} />
          {resource.rating} Rating
        </div>
        <div className="flex items-center gap-2 text-n-3">
          <Users size={16} />
          {resource.studentsHelped} Helped
        </div>
      </div>

      <div className="mb-4">
        <h4 className="text-n-1 font-medium mb-2">What's Included:</h4>
        <ul className="text-n-3 text-sm space-y-1">
          {resource.features.slice(0, 4).map((feature, index) => (
            <li key={index} className="flex items-start gap-2">
              <div className="w-1 h-1 bg-color-1 rounded-full mt-2 flex-shrink-0"></div>
              {feature}
            </li>
          ))}
          {resource.features.length > 4 && (
            <li className="text-color-1 text-xs">+{resource.features.length - 4} more features</li>
          )}
        </ul>
      </div>

      <div className="flex flex-wrap gap-2 mb-4">
        {resource.technologies.map((tech, index) => (
          <span key={index} className="px-2 py-1 bg-n-6 text-n-2 rounded text-xs">
            {tech}
          </span>
        ))}
      </div>

      <Button className="w-full" href="#contact">
        Get Started
      </Button>
    </div>
  );

  const StudentStoryCard = ({ story }) => (
    <div className="bg-n-7 rounded-xl p-6 border border-n-6">
      <div className="flex items-center gap-4 mb-4">
        <div className="w-12 h-12 bg-gradient-to-r from-color-1 to-color-2 rounded-full flex items-center justify-center">
          <User size={24} className="text-white" />
        </div>
        <div>
          <h3 className="text-n-1 font-semibold">{story.name}</h3>
          <p className="text-n-3 text-sm">{story.course} • {story.year}</p>
          <p className="text-n-4 text-xs">{story.university}</p>
        </div>
        <div className="ml-auto">
          <div className="bg-color-2 text-white px-2 py-1 rounded text-xs font-semibold">
            Grade: {story.grade}
          </div>
        </div>
      </div>

      <div className="mb-4">
        <h4 className="text-n-1 font-medium mb-1">Project:</h4>
        <p className="text-n-3 text-sm">{story.project}</p>
      </div>

      <blockquote className="text-n-2 italic mb-4 border-l-2 border-color-1 pl-4">
        "{story.testimonial}"
      </blockquote>

      <div className="flex justify-end">
        <a 
          href={story.linkedIn}
          className="flex items-center gap-2 text-color-1 hover:text-color-2 transition-colors text-sm"
        >
          <ExternalLink size={16} />
          Connect on LinkedIn
        </a>
      </div>
    </div>
  );

  const ResourceCard = ({ resource }) => (
    <div className="bg-n-7 rounded-xl p-6 border border-n-6 hover:border-color-1 transition-colors">
      <div className="flex items-center gap-3 mb-3">
        <FileText size={24} className="text-color-1" />
        <div>
          <h3 className="text-n-1 font-semibold">{resource.title}</h3>
          <p className="text-n-3 text-sm">{resource.type}</p>
        </div>
        {resource.free && (
          <div className="ml-auto bg-green-500 text-white px-2 py-1 rounded text-xs font-semibold">
            FREE
          </div>
        )}
      </div>

      <p className="text-n-3 text-sm mb-4">{resource.description}</p>

      <div className="grid grid-cols-3 gap-4 mb-4 text-xs text-n-4">
        <div>Size: {resource.size}</div>
        <div>Pages: {resource.pages}</div>
        <div>Downloads: {resource.downloads}</div>
      </div>

      <div className="flex items-center justify-between">
        <span className="px-3 py-1 bg-color-1/20 text-color-1 rounded-full text-xs">
          {resource.category}
        </span>
        <Button className="px-4 py-2 text-sm" href="#download">
          <Download size={16} className="mr-2" />
          Download
        </Button>
      </div>
    </div>
  );

  return (
    <Section className="pt-[12rem] -mt-[5.25rem]" id="viored">
      <div className="container relative">
        <Heading
          className="md:max-w-md lg:max-w-2xl text-center mx-auto"
          title="PritechVior ViorEd"
          text="Comprehensive academic support for students at all levels. From final year projects to research assistance and career mentorship."
        />

        {/* Navigation Tabs */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          <TabButton
            id="services"
            label="Academic Services"
            icon={GraduationCap}
            isActive={activeTab === "services"}
            onClick={setActiveTab}
          />
          <TabButton
            id="stories"
            label="Success Stories"
            icon={Award}
            isActive={activeTab === "stories"}
            onClick={setActiveTab}
          />
          <TabButton
            id="resources"
            label="Free Resources"
            icon={BookOpen}
            isActive={activeTab === "resources"}
            onClick={setActiveTab}
          />
        </div>

        {/* Tab Content */}
        <div className="min-h-[600px]">
          {activeTab === "services" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {scholarResources.map((resource) => (
                <ServiceCard key={resource.id} resource={resource} />
              ))}
            </div>
          )}

          {activeTab === "stories" && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {studentStories.map((story) => (
                <StudentStoryCard key={story.id} story={story} />
              ))}
            </div>
          )}

          {activeTab === "resources" && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {academicResources.map((resource) => (
                <ResourceCard key={resource.id} resource={resource} />
              ))}
            </div>
          )}
        </div>

        {/* Call to Action */}
        <div className="text-center mt-16">
          <div className="bg-gradient-to-r from-color-1/10 to-color-2/10 rounded-2xl p-8 border border-color-1/20">
            <h3 className="text-2xl font-semibold text-n-1 mb-4">
              Ready to Excel in Your Academic Journey?
            </h3>
            <p className="text-n-3 mb-6 max-w-2xl mx-auto">
              Join hundreds of students who have achieved academic success with our comprehensive support services. 
              Get personalized assistance for your projects, research, and career development.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button href="#contact">
                Start Your Project
              </Button>
              <Button className="border border-n-4 text-n-1 hover:bg-n-7" href="#contact">
                Schedule Consultation
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Section>
  );
};

export default Scholar;
