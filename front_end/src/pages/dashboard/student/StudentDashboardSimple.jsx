import React, { useState } from "react";
import { 
  BookOpen, 
  Award, 
  Clock, 
  TrendingUp,
  Play,
  CheckCircle,
  Calendar,
  Target,
  Star,
  MessageCircle,
  Download,
  Search,
  Filter,
  Plus,
  BarChart3,
  Users,
  Globe,
  Bookmark,
  FileText,
  Video,
  Headphones,
  Monitor
} from "lucide-react";
import DashboardLayout from "../../../components/dashboard/DashboardLayout";

const StudentDashboard = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [searchQuery, setSearchQuery] = useState("");

  const studentStats = [
    {
      title: "Enrolled Courses",
      value: "12",
      change: "+3 this month",
      changeType: "positive",
      icon: BookOpen,
      color: "blue"
    },
    {
      title: "Completed",
      value: "8",
      change: "67% completion",
      changeType: "positive",
      icon: CheckCircle,
      color: "green"
    },
    {
      title: "Study Hours",
      value: "156h",
      change: "+12h this week",
      changeType: "positive",
      icon: Clock,
      color: "purple"
    },
    {
      title: "Achievements",
      value: "24",
      change: "+2 new badges",
      changeType: "positive",
      icon: Award,
      color: "yellow"
    }
  ];

  const currentCourses = [
    {
      id: 1,
      title: "Advanced React Development",
      instructor: "Dr. Sarah Johnson",
      progress: 75,
      totalLessons: 24,
      completedLessons: 18,
      nextLesson: "React Hooks Deep Dive",
      dueDate: "Dec 15, 2024",
      level: "Advanced",
      category: "Programming",
      thumbnail: "/api/placeholder/150/100",
      rating: 4.8
    },
    {
      id: 2,
      title: "Digital Marketing Fundamentals",
      instructor: "Mark Thompson",
      progress: 45,
      totalLessons: 16,
      completedLessons: 7,
      nextLesson: "Social Media Strategy",
      dueDate: "Dec 20, 2024",
      level: "Beginner",
      category: "Marketing",
      thumbnail: "/api/placeholder/150/100",
      rating: 4.6
    },
    {
      id: 3,
      title: "Data Science with Python",
      instructor: "Prof. Lisa Chen",
      progress: 92,
      totalLessons: 32,
      completedLessons: 29,
      nextLesson: "Final Project",
      dueDate: "Dec 10, 2024",
      level: "Intermediate",
      category: "Data Science",
      thumbnail: "/api/placeholder/150/100",
      rating: 4.9
    }
  ];

  const recentAchievements = [
    { id: 1, title: "Course Completion Expert", description: "Completed 5 courses", icon: Award, date: "2 days ago", type: "milestone" },
    { id: 2, title: "Study Streak", description: "7 days consecutive learning", icon: Target, date: "1 week ago", type: "streak" },
    { id: 3, title: "Top Performer", description: "Scored 95% in Data Analytics", icon: Star, date: "2 weeks ago", type: "performance" },
    { id: 4, title: "Community Helper", description: "Helped 10 fellow students", icon: Users, date: "3 weeks ago", type: "community" }
  ];

  const upcomingDeadlines = [
    { id: 1, course: "Data Science with Python", task: "Final Project Submission", date: "Dec 10", priority: "high" },
    { id: 2, course: "Advanced React Development", task: "Module 4 Quiz", date: "Dec 12", priority: "medium" },
    { id: 3, course: "Digital Marketing", task: "Campaign Analysis", date: "Dec 18", priority: "low" },
    { id: 4, course: "UI/UX Design", task: "Design Portfolio", date: "Dec 22", priority: "medium" }
  ];

  const recommendedCourses = [
    { title: "Machine Learning Basics", instructor: "Dr. AI Expert", rating: 4.7, students: "12.5k", price: "$49" },
    { title: "Full Stack JavaScript", instructor: "Code Master", rating: 4.8, students: "8.2k", price: "$79" },
    { title: "Advanced CSS Animations", instructor: "Design Pro", rating: 4.6, students: "5.1k", price: "$39" },
    { title: "Project Management", instructor: "PM Guru", rating: 4.9, students: "15.3k", price: "$59" }
  ];

  const learningResources = [
    { type: "video", title: "React Best Practices", duration: "15 min", category: "Programming" },
    { type: "article", title: "Marketing Trends 2024", duration: "8 min read", category: "Marketing" },
    { type: "podcast", title: "Data Science Career Path", duration: "45 min", category: "Career" },
    { type: "webinar", title: "Future of AI", duration: "1 hour", category: "Technology" }
  ];

  const getStatColor = (color) => {
    const colors = {
      blue: "from-blue-500 to-blue-600",
      green: "from-green-500 to-green-600",
      purple: "from-purple-500 to-purple-600",
      yellow: "from-yellow-500 to-yellow-600"
    };
    return colors[color] || colors.blue;
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "high": return "bg-red-500/10 text-red-400 border-red-500/20";
      case "medium": return "bg-yellow-500/10 text-yellow-400 border-yellow-500/20";
      case "low": return "bg-green-500/10 text-green-400 border-green-500/20";
      default: return "bg-n-7 text-n-3 border-n-6";
    }
  };

  const getLevelColor = (level) => {
    switch (level) {
      case "Beginner": return "bg-green-500/10 text-green-400";
      case "Intermediate": return "bg-yellow-500/10 text-yellow-400";
      case "Advanced": return "bg-red-500/10 text-red-400";
      default: return "bg-n-7 text-n-3";
    }
  };

  const getResourceIcon = (type) => {
    switch (type) {
      case "video": return Video;
      case "article": return FileText;
      case "podcast": return Headphones;
      case "webinar": return Monitor;
      default: return FileText;
    }
  };

  return (
    <DashboardLayout title="Student Dashboard" userRole="student">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-n-1">Learning Hub</h1>
            <p className="text-n-3 mt-1">Continue your learning journey and track your progress</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative">
              <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-n-4" />
              <input
                type="text"
                placeholder="Search courses..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-n-7 border border-n-6 rounded-lg pl-10 pr-4 py-2 text-n-1 text-sm w-64"
              />
            </div>
            <button className="bg-gradient-to-r from-color-1 to-color-2 text-white px-4 py-2 rounded-lg flex items-center gap-2 text-sm">
              <Plus size={16} />
              Browse Courses
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {studentStats.map((stat, index) => (
            <div key={index} className="bg-n-8 rounded-xl p-6 border border-n-6">
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${getStatColor(stat.color)} flex items-center justify-center`}>
                  <stat.icon size={20} className="text-white" />
                </div>
                <span className="text-green-400 text-sm">{stat.change}</span>
              </div>
              <h3 className="text-2xl font-bold text-n-1 mb-1">{stat.value}</h3>
              <p className="text-n-4 text-sm">{stat.title}</p>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex gap-1 bg-n-7 p-1 rounded-lg w-fit">
          {["overview", "courses", "progress", "resources"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                activeTab === tab 
                  ? "bg-gradient-to-r from-color-1 to-color-2 text-white" 
                  : "text-n-3 hover:text-n-1"
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        <div className="lg:flex lg:gap-6">
          {/* Main Content */}
          <div className="lg:flex-1 space-y-6">
            {activeTab === "overview" && (
              <>
                <div className="bg-n-8 rounded-xl p-6 border border-n-6">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-semibold text-n-1">Continue Learning</h2>
                    <button className="text-color-1 text-sm hover:text-color-2">View All</button>
                  </div>
                  <div className="space-y-4">
                    {currentCourses.slice(0, 2).map((course) => (
                      <div key={course.id} className="p-4 bg-n-7 rounded-lg">
                        <div className="flex items-start gap-4">
                          <div className="w-16 h-12 bg-gradient-to-r from-color-1 to-color-2 rounded-lg flex items-center justify-center">
                            <BookOpen size={20} className="text-white" />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-start justify-between mb-2">
                              <div>
                                <h3 className="text-n-1 font-medium">{course.title}</h3>
                                <p className="text-n-4 text-sm">by {course.instructor}</p>
                              </div>
                              <span className={`px-2 py-1 rounded text-xs ${getLevelColor(course.level)}`}>
                                {course.level}
                              </span>
                            </div>
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-4">
                                <span className="text-n-3 text-sm">{course.completedLessons}/{course.totalLessons} lessons</span>
                                <span className="text-n-1 font-semibold">{course.progress}%</span>
                              </div>
                              <button className="bg-gradient-to-r from-color-1 to-color-2 text-white px-4 py-2 rounded-lg text-sm flex items-center gap-2">
                                <Play size={14} />
                                Continue
                              </button>
                            </div>
                            <div className="w-full bg-n-6 rounded-full h-2 mt-3">
                              <div 
                                className="bg-gradient-to-r from-color-1 to-color-2 h-2 rounded-full transition-all duration-300"
                                style={{ width: `${course.progress}%` }}
                              ></div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-n-8 rounded-xl p-6 border border-n-6">
                  <h2 className="text-lg font-semibold text-n-1 mb-4">Recent Achievements</h2>
                  <div className="space-y-3">
                    {recentAchievements.map((achievement) => (
                      <div key={achievement.id} className="flex items-center gap-3 p-3 bg-n-7 rounded-lg">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-r from-color-1 to-color-2 flex items-center justify-center">
                          <achievement.icon size={16} className="text-white" />
                        </div>
                        <div className="flex-1">
                          <h3 className="text-n-1 font-medium text-sm">{achievement.title}</h3>
                          <p className="text-n-4 text-xs">{achievement.description}</p>
                        </div>
                        <span className="text-n-5 text-xs">{achievement.date}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}

            {activeTab === "courses" && (
              <div className="space-y-4">
                {currentCourses.map((course) => (
                  <div key={course.id} className="bg-n-8 rounded-xl p-6 border border-n-6">
                    <div className="flex items-start gap-4">
                      <div className="w-20 h-16 bg-gradient-to-r from-color-1 to-color-2 rounded-lg flex items-center justify-center">
                        <BookOpen size={24} className="text-white" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <h3 className="text-lg font-semibold text-n-1">{course.title}</h3>
                            <p className="text-n-4 text-sm">by {course.instructor}</p>
                            <div className="flex items-center gap-2 mt-1">
                              <span className={`px-2 py-1 rounded text-xs ${getLevelColor(course.level)}`}>
                                {course.level}
                              </span>
                              <span className="text-n-4 text-xs">•</span>
                              <span className="text-n-4 text-xs">{course.category}</span>
                              <span className="text-n-4 text-xs">•</span>
                              <div className="flex items-center gap-1">
                                <Star size={12} className="text-yellow-400 fill-current" />
                                <span className="text-n-4 text-xs">{course.rating}</span>
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-2xl font-bold text-n-1">{course.progress}%</div>
                            <div className="text-n-4 text-sm">Complete</div>
                          </div>
                        </div>
                        <div className="space-y-3">
                          <div className="w-full bg-n-6 rounded-full h-2">
                            <div 
                              className="bg-gradient-to-r from-color-1 to-color-2 h-2 rounded-full transition-all duration-300"
                              style={{ width: `${course.progress}%` }}
                            ></div>
                          </div>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                              <span className="text-n-3 text-sm">{course.completedLessons}/{course.totalLessons} lessons</span>
                              <span className="text-n-4 text-sm">Next: {course.nextLesson}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-n-5 text-sm">Due: {course.dueDate}</span>
                              <button className="bg-gradient-to-r from-color-1 to-color-2 text-white px-4 py-2 rounded-lg text-sm flex items-center gap-2">
                                <Play size={14} />
                                Continue
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeTab === "progress" && (
              <div className="bg-n-8 rounded-xl p-6 border border-n-6">
                <h2 className="text-lg font-semibold text-n-1 mb-4">Learning Analytics</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
                  <div className="text-center p-4 bg-n-7 rounded-lg">
                    <div className="text-3xl font-bold text-color-1 mb-2">156h</div>
                    <div className="text-n-3 text-sm">Total Study Time</div>
                  </div>
                  <div className="text-center p-4 bg-n-7 rounded-lg">
                    <div className="text-3xl font-bold text-green-400 mb-2">87%</div>
                    <div className="text-n-3 text-sm">Average Score</div>
                  </div>
                </div>
                <div className="h-64 bg-n-7 rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <BarChart3 size={48} className="text-n-4 mx-auto mb-2" />
                    <p className="text-n-4">Progress Analytics</p>
                    <p className="text-n-5 text-sm">Weekly learning progress and performance metrics</p>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "resources" && (
              <div className="bg-n-8 rounded-xl p-6 border border-n-6">
                <h2 className="text-lg font-semibold text-n-1 mb-4">Learning Resources</h2>
                <div className="space-y-3">
                  {learningResources.map((resource, index) => {
                    const ResourceIcon = getResourceIcon(resource.type);
                    return (
                      <div key={index} className="flex items-center gap-3 p-4 bg-n-7 rounded-lg hover:bg-n-6 transition-colors cursor-pointer">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-r from-color-1 to-color-2 flex items-center justify-center">
                          <ResourceIcon size={16} className="text-white" />
                        </div>
                        <div className="flex-1">
                          <h3 className="text-n-1 font-medium">{resource.title}</h3>
                          <div className="flex items-center gap-3 mt-1">
                            <span className="text-n-4 text-sm">{resource.duration}</span>
                            <span className="text-n-5 text-sm">•</span>
                            <span className="text-n-4 text-sm">{resource.category}</span>
                          </div>
                        </div>
                        <button className="text-color-1 hover:text-color-2">
                          <Play size={16} />
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:w-80 lg:flex-shrink-0 space-y-6 mt-6 lg:mt-0">
            {/* Upcoming Deadlines */}
            <div className="bg-n-8 rounded-xl p-6 border border-n-6">
              <h2 className="text-lg font-semibold text-n-1 mb-4">Upcoming Deadlines</h2>
              <div className="space-y-3">
                {upcomingDeadlines.map((deadline) => (
                  <div key={deadline.id} className="p-3 bg-n-7 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-n-1 text-sm font-medium">{deadline.task}</h3>
                      <span className={`px-2 py-1 rounded text-xs border ${getPriorityColor(deadline.priority)}`}>
                        {deadline.priority}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-n-4 text-xs">{deadline.course}</span>
                      <span className="text-n-1 text-xs font-medium">{deadline.date}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recommended Courses */}
            <div className="bg-n-8 rounded-xl p-6 border border-n-6">
              <h2 className="text-lg font-semibold text-n-1 mb-4">Recommended for You</h2>
              <div className="space-y-4">
                {recommendedCourses.map((course, index) => (
                  <div key={index} className="p-3 bg-n-7 rounded-lg">
                    <h3 className="text-n-1 text-sm font-medium mb-2">{course.title}</h3>
                    <p className="text-n-4 text-xs mb-2">by {course.instructor}</p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="flex items-center gap-1">
                          <Star size={12} className="text-yellow-400 fill-current" />
                          <span className="text-n-4 text-xs">{course.rating}</span>
                        </div>
                        <span className="text-n-5 text-xs">•</span>
                        <span className="text-n-4 text-xs">{course.students}</span>
                      </div>
                      <span className="text-color-1 font-semibold text-sm">{course.price}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-n-8 rounded-xl p-6 border border-n-6">
              <h2 className="text-lg font-semibold text-n-1 mb-4">Quick Actions</h2>
              <div className="space-y-2">
                {[
                  { title: "Download Certificates", icon: Download },
                  { title: "Study Calendar", icon: Calendar },
                  { title: "Discussion Forums", icon: MessageCircle },
                  { title: "Bookmarked Content", icon: Bookmark }
                ].map((action, index) => (
                  <button key={index} className="w-full flex items-center gap-3 p-3 text-left rounded-lg bg-n-7 hover:bg-n-6 transition-colors">
                    <action.icon size={16} className="text-color-1" />
                    <span className="text-n-1 text-sm">{action.title}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default StudentDashboard;
