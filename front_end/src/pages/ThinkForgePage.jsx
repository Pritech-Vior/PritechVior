import { BookOpen, Users, Clock, Star, Award, Play, Search, Filter } from "lucide-react";
import Section from "../components/Section";
import Heading from "../components/Heading";
import Button from "../components/Button";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { courses } from "../constants";
import { useState } from "react";

const ThinkForgePage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedLevel, setSelectedLevel] = useState("All");

  const categories = ["All", "Programming", "Design", "Business", "Marketing", "Data Science", "Web Development"];
  const levels = ["All", "Beginner", "Intermediate", "Advanced"];

  const filteredCourses = courses.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         course.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         course.instructor.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "All" || course.category === selectedCategory;
    const matchesLevel = selectedLevel === "All" || course.level === selectedLevel;
    return matchesSearch && matchesCategory && matchesLevel;
  });
  const CourseCard = ({ course }) => (
    <div className="bg-n-7 rounded-xl p-6 border border-n-6 hover:border-color-1 transition-colors">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-xl font-semibold text-n-1 mb-2">{course.title}</h3>
          <p className="text-n-3 text-sm mb-3">{course.description}</p>
          <div className="flex flex-wrap gap-2 mb-4">
            <span className="px-3 py-1 bg-color-1/20 text-color-1 rounded-full text-xs">
              {course.category}
            </span>
            <span className="px-3 py-1 bg-n-6 text-n-2 rounded-full text-xs">
              {course.level}
            </span>
          </div>
        </div>
        {course.featured && (
          <div className="bg-color-2 text-white px-2 py-1 rounded text-xs font-semibold">
            Featured
          </div>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
        <div className="flex items-center gap-2 text-n-3">
          <Clock size={16} />
          {course.duration}
        </div>
        <div className="flex items-center gap-2 text-n-3">
          <Users size={16} />
          {course.enrolled} enrolled
        </div>
        <div className="flex items-center gap-2 text-n-3">
          <Star size={16} />
          {course.rating} rating
        </div>
        <div className="flex items-center gap-2 text-n-3">
          <BookOpen size={16} />
          {course.modules} modules
        </div>
      </div>

      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-n-1 font-semibold">{course.instructor}</span>
          <span className="text-color-1 font-bold text-lg">{course.price}</span>
        </div>
        <p className="text-n-4 text-xs">{course.projects} hands-on projects included</p>
      </div>

      <Button className="w-full" href={`#enroll-${course.id}`}>
        <Play size={16} className="mr-2" />
        Enroll Now
      </Button>
    </div>
  );

  return (
    <div className="pt-[4.75rem] lg:pt-[5.25rem] overflow-hidden">
      <Header />
      
      <Section className="pt-[12rem] -mt-[5.25rem]" id="thinkforge">
        <div className="container relative">
          <Heading
            className="md:max-w-md lg:max-w-2xl text-center mx-auto"
            title="ThinkForge Academy"
            text="Master new skills with our comprehensive online courses designed for professionals, students, and entrepreneurs looking to excel in the digital age."
          />

          {/* Search and Filter Section */}
          <div className="mb-12">
            <div className="flex flex-col lg:flex-row gap-4 mb-6">
              <div className="relative flex-1">
                <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-n-4" />
                <input
                  type="text"
                  placeholder="Search courses by title, description, or instructor..."
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
                  {categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
                <select
                  value={selectedLevel}
                  onChange={(e) => setSelectedLevel(e.target.value)}
                  className="px-4 py-3 bg-n-7 border border-n-6 rounded-lg text-n-1 focus:border-color-1 focus:outline-none transition-colors"
                >
                  {levels.map(level => (
                    <option key={level} value={level}>{level}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="text-center text-n-3">
              Found {filteredCourses.length} course{filteredCourses.length !== 1 ? 's' : ''} 
              {selectedCategory !== "All" && ` in ${selectedCategory}`}
              {selectedLevel !== "All" && ` at ${selectedLevel} level`}
            </div>
          </div>

          {/* Featured Courses */}
          <div className="mb-12">
            <h2 className="text-2xl font-semibold text-n-1 mb-6">Featured Courses</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {filteredCourses.filter(course => course.featured).map((course) => (
                <CourseCard key={course.id} course={course} />
              ))}
            </div>
          </div>

          {/* All Courses */}
          <div>
            <h2 className="text-2xl font-semibold text-n-1 mb-6">All Courses</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCourses.map((course) => (
                <CourseCard key={course.id} course={course} />
              ))}
            </div>

            {filteredCourses.length === 0 && (
              <div className="text-center py-12">
                <BookOpen size={64} className="mx-auto text-n-4 mb-4" />
                <h3 className="text-xl font-semibold text-n-1 mb-2">No courses found</h3>
                <p className="text-n-3">Try adjusting your search terms, category, or level filter.</p>
              </div>
            )}
          </div>

          {/* Learning Paths */}
          <div className="mt-16">
            <h2 className="text-2xl font-semibold text-n-1 mb-6 text-center">Learning Paths</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-n-7 rounded-xl p-6 border border-n-6 hover:border-color-1 transition-colors">
                <BookOpen size={32} className="text-color-1 mb-4" />
                <h3 className="text-xl font-semibold text-n-1 mb-3">Full-Stack Developer</h3>
                <p className="text-n-3 text-sm mb-4">
                  Complete journey from frontend to backend development with modern technologies.
                </p>
                <ul className="text-n-4 text-sm space-y-1 mb-4">
                  <li>• MERN Stack Development</li>
                  <li>• Database Design</li>
                  <li>• API Development</li>
                  <li>• Deployment & DevOps</li>
                </ul>
                <Button className="w-full">Start Learning Path</Button>
              </div>

              <div className="bg-n-7 rounded-xl p-6 border border-n-6 hover:border-color-1 transition-colors">
                <Award size={32} className="text-color-1 mb-4" />
                <h3 className="text-xl font-semibold text-n-1 mb-3">Digital Marketing Pro</h3>
                <p className="text-n-3 text-sm mb-4">
                  Master digital marketing strategies for the Tanzanian and African market.
                </p>
                <ul className="text-n-4 text-sm space-y-1 mb-4">
                  <li>• Social Media Marketing</li>
                  <li>• Content Strategy</li>
                  <li>• Analytics & SEO</li>
                  <li>• Local Market Insights</li>
                </ul>
                <Button className="w-full">Start Learning Path</Button>
              </div>

              <div className="bg-n-7 rounded-xl p-6 border border-n-6 hover:border-color-1 transition-colors">
                <Users size={32} className="text-color-1 mb-4" />
                <h3 className="text-xl font-semibold text-n-1 mb-3">Mobile Developer</h3>
                <p className="text-n-3 text-sm mb-4">
                  Build cross-platform mobile applications for Android and iOS.
                </p>
                <ul className="text-n-4 text-sm space-y-1 mb-4">
                  <li>• React Native Development</li>
                  <li>• Mobile UI/UX Design</li>
                  <li>• App Store Deployment</li>
                  <li>• Performance Optimization</li>
                </ul>
                <Button className="w-full">Start Learning Path</Button>
              </div>
            </div>
          </div>

          {/* Instructor Application */}
          <div className="text-center mt-16">
            <div className="bg-gradient-to-r from-color-1/10 to-color-2/10 rounded-2xl p-8 border border-color-1/20">
              <h3 className="text-2xl font-semibold text-n-1 mb-4">
                Become an Instructor
              </h3>
              <p className="text-n-3 mb-6 max-w-2xl mx-auto">
                Share your expertise and help shape the next generation of tech professionals. Join our instructor community and create impactful courses.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Button href="#contact">Apply to Teach</Button>
                <Button className="border border-n-4 text-n-1 hover:bg-n-7" href="#instructor-info">
                  Learn More
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

export default ThinkForgePage;
