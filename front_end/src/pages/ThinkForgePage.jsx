import { BookOpen, Users, Clock, Star, Award, Play } from "lucide-react";
import Section from "../components/Section";
import Heading from "../components/Heading";
import Button from "../components/Button";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { courses } from "../constants";

const ThinkForgePage = () => {
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

          {/* Featured Courses */}
          <div className="mb-12">
            <h2 className="text-2xl font-semibold text-n-1 mb-6">Featured Courses</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {courses.filter(course => course.featured).map((course) => (
                <CourseCard key={course.id} course={course} />
              ))}
            </div>
          </div>

          {/* All Courses */}
          <div>
            <h2 className="text-2xl font-semibold text-n-1 mb-6">All Courses</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {courses.map((course) => (
                <CourseCard key={course.id} course={course} />
              ))}
            </div>
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
