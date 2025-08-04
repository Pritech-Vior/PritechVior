import React from "react";
import { Link, useLocation } from "react-router-dom";
import { 
  Home, 
  User, 
  BookOpen, 
  GraduationCap, 
  Users, 
  Settings, 
  LogOut, 
  ShoppingBag,
  FileText,
  Award,
  MessageSquare,
  BarChart3,
  Calendar,
  CreditCard,
  Bell,
  Menu,
  X,
  ChevronLeft,
  ChevronRight
} from "lucide-react";

const Sidebar = ({ userRole = "student", collapsed = false, onToggle, userRoles = [] }) => {
  const location = useLocation();
  const hasMultipleRoles = userRoles.length > 1;

  const menuItems = {
    ceo: [
      { icon: Home, label: "Executive Dashboard", path: "/ceo" },
      { icon: BarChart3, label: "Company Analytics", path: "/ceo/analytics" },
      { icon: Users, label: "Department Overview", path: "/ceo/departments" },
      { icon: CreditCard, label: "Financial Overview", path: "/ceo/finance" },
      { icon: BookOpen, label: "Strategic Goals", path: "/ceo/goals" },
      { icon: FileText, label: "Reports", path: "/ceo/reports" },
      { icon: MessageSquare, label: "Executive Messages", path: "/ceo/messages" },
      { icon: Settings, label: "Company Settings", path: "/ceo/settings" },
    ],
    treasury: [
      { icon: Home, label: "Treasury Dashboard", path: "/treasury" },
      { icon: CreditCard, label: "Financial Management", path: "/treasury/finance" },
      { icon: BarChart3, label: "Revenue Analytics", path: "/treasury/revenue" },
      { icon: FileText, label: "Financial Reports", path: "/treasury/reports" },
      { icon: ShoppingBag, label: "Payment Processing", path: "/treasury/payments" },
      { icon: Users, label: "Budget Management", path: "/treasury/budget" },
      { icon: Calendar, label: "Financial Calendar", path: "/treasury/calendar" },
      { icon: Settings, label: "Treasury Settings", path: "/treasury/settings" },
    ],
    admin: [
      { icon: Home, label: "Dashboard", path: "/admin" },
      { icon: Users, label: "Users Management", path: "/admin/users" },
      { icon: BookOpen, label: "Courses Management", path: "/admin/courses" },
      { icon: ShoppingBag, label: "Shop Management", path: "/admin/shop" },
      { icon: FileText, label: "Content Management", path: "/admin/content" },
      { icon: BarChart3, label: "Analytics", path: "/admin/analytics" },
      { icon: CreditCard, label: "Payments", path: "/admin/payments" },
      { icon: Settings, label: "Settings", path: "/admin/settings" },
    ],
    trainer: [
      { icon: Home, label: "Dashboard", path: "/trainer" },
      { icon: BookOpen, label: "Training Programs", path: "/trainer/programs" },
      { icon: Users, label: "Trainees", path: "/trainer/trainees" },
      { icon: FileText, label: "Content Creation", path: "/trainer/content" },
      { icon: BarChart3, label: "Analytics", path: "/trainer/analytics" },
      { icon: Calendar, label: "Training Schedule", path: "/trainer/schedule" },
      { icon: MessageSquare, label: "Messages", path: "/trainer/messages" },
      { icon: Settings, label: "Settings", path: "/trainer/settings" },
    ],
    student: [
      { icon: Home, label: "Dashboard", path: "/student" },
      { icon: BookOpen, label: "My Courses", path: "/student/courses" },
      { icon: GraduationCap, label: "Progress", path: "/student/progress" },
      { icon: Award, label: "Certificates", path: "/student/certificates" },
      { icon: Calendar, label: "Schedule", path: "/student/schedule" },
      { icon: MessageSquare, label: "Messages", path: "/student/messages" },
      { icon: CreditCard, label: "Payments", path: "/student/payments" },
      { icon: Settings, label: "Settings", path: "/student/settings" },
    ],
    parent: [
      { icon: Home, label: "Dashboard", path: "/parent" },
      { icon: Users, label: "My Children", path: "/parent/children" },
      { icon: BarChart3, label: "Progress Reports", path: "/parent/progress" },
      { icon: Calendar, label: "Schedule", path: "/parent/schedule" },
      { icon: CreditCard, label: "Payments", path: "/parent/payments" },
      { icon: MessageSquare, label: "Messages", path: "/parent/messages" },
      { icon: Bell, label: "Notifications", path: "/parent/notifications" },
      { icon: Settings, label: "Settings", path: "/parent/settings" },
    ],
    guest: [
      { icon: Home, label: "Explore Courses", path: "/guest" },
      { icon: BookOpen, label: "Browse Courses", path: "/guest/browse" },
      { icon: Calendar, label: "Free Events", path: "/guest/events" },
      { icon: Award, label: "Learning Paths", path: "/guest/paths" },
      { icon: Users, label: "Success Stories", path: "/guest/stories" },
      { icon: MessageSquare, label: "Contact Support", path: "/guest/support" },
      { icon: Settings, label: "Get Started", path: "/guest/register" },
    ],
    client: [
      { icon: Home, label: "Dashboard", path: "/client" },
      { icon: FileText, label: "My Projects", path: "/client/projects" },
      { icon: MessageSquare, label: "Project Requests", path: "/client/requests" },
      { icon: BarChart3, label: "Progress Reports", path: "/client/reports" },
      { icon: CreditCard, label: "Billing", path: "/client/billing" },
      { icon: Calendar, label: "Meetings", path: "/client/meetings" },
      { icon: Users, label: "Team Collaboration", path: "/client/team" },
      { icon: Settings, label: "Settings", path: "/client/settings" },
    ],
    technician: [
      { icon: Home, label: "Dashboard", path: "/technician" },
      { icon: Users, label: "System Monitoring", path: "/technician/monitoring" },
      { icon: Bell, label: "Alerts & Issues", path: "/technician/alerts" },
      { icon: BookOpen, label: "Maintenance Tasks", path: "/technician/maintenance" },
      { icon: BarChart3, label: "Performance Reports", path: "/technician/reports" },
      { icon: Calendar, label: "Scheduled Jobs", path: "/technician/schedule" },
      { icon: MessageSquare, label: "Support Tickets", path: "/technician/support" },
      { icon: Settings, label: "System Settings", path: "/technician/settings" },
    ],
    designer: [
      { icon: Home, label: "Dashboard", path: "/designer" },
      { icon: FileText, label: "Design Projects", path: "/designer/projects" },
      { icon: BookOpen, label: "Asset Library", path: "/designer/assets" },
      { icon: Users, label: "Client Reviews", path: "/designer/reviews" },
      { icon: BarChart3, label: "Portfolio Analytics", path: "/designer/analytics" },
      { icon: Calendar, label: "Design Schedule", path: "/designer/schedule" },
      { icon: MessageSquare, label: "Creative Feedback", path: "/designer/feedback" },
      { icon: Settings, label: "Design Settings", path: "/designer/settings" },
    ],
    writer: [
      { icon: Home, label: "Dashboard", path: "/writer" },
      { icon: FileText, label: "Writing Projects", path: "/writer/projects" },
      { icon: BookOpen, label: "Content Ideas", path: "/writer/ideas" },
      { icon: BarChart3, label: "Analytics & Goals", path: "/writer/analytics" },
      { icon: Users, label: "Client Feedback", path: "/writer/feedback" },
      { icon: Calendar, label: "Writing Schedule", path: "/writer/schedule" },
      { icon: MessageSquare, label: "Editorial Messages", path: "/writer/messages" },
      { icon: Settings, label: "Writing Settings", path: "/writer/settings" },
    ]
  };

  const currentMenuItems = menuItems[userRole] || menuItems.student;

  return (
    <div className={`h-screen bg-gradient-to-b from-n-8 to-n-8/95 border-r border-n-6/50 flex flex-col shadow-xl backdrop-blur-sm transition-all duration-300 ${
      collapsed ? 'w-16' : 'w-64'
    }`}>
      {/* Header */}
      <div className={`flex items-center p-4 border-b border-n-6/50 flex-shrink-0 relative ${collapsed ? 'justify-center' : 'justify-between'}`}>
        <div className={`flex items-center gap-3 ${collapsed ? 'justify-center' : ''}`}>
          <div className="w-8 h-8 bg-gradient-to-r from-color-1 to-color-2 rounded-lg flex items-center justify-center shadow-lg">
            <span className="text-white font-bold text-sm">PV</span>
          </div>
          {!collapsed && (
            <div>
              <h2 className="text-n-1 font-semibold text-sm">PritechVior</h2>
              <p className="text-n-4 text-xs capitalize">{userRole} Portal</p>
            </div>
          )}
        </div>
        
        {/* Collapse/Expand Button */}
        <button
          onClick={onToggle}
          className={`rounded-lg hover:bg-n-7/50 transition-all duration-200 group hover:scale-105 ${
            collapsed 
              ? 'absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-6 bg-n-7 border border-n-6 shadow-lg z-20' 
              : 'p-2'
          }`}
          title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed ? (
            <ChevronRight size={14} className="text-n-3 group-hover:text-color-1 transition-colors" />
          ) : (
            <ChevronLeft size={18} className="text-n-3 group-hover:text-color-1 transition-colors" />
          )}
        </button>
      </div>

      {/* Navigation */}
      <nav className="p-4 space-y-2 flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-n-6 scrollbar-track-transparent">
        {currentMenuItems.map((item, index) => {
          const isActive = location.pathname === item.path;
          const Icon = item.icon;
          
          return (
            <div key={index} className="relative group">
              <Link
                to={item.path}
                onClick={() => {
                  // Close mobile menu on link click
                  if (window.innerWidth < 1024) {
                    onToggle();
                  }
                }}
                className={`flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-300 relative overflow-hidden ${
                  isActive 
                    ? 'bg-gradient-to-r from-color-1/20 to-color-2/20 border border-color-1/30 text-color-1 shadow-lg' 
                    : 'text-n-3 hover:text-n-1 hover:bg-n-7/80 hover:shadow-md hover:scale-[1.02]'
                } ${collapsed ? 'justify-center' : ''}`}
              >
                {/* Cool active indicator line */}
                {isActive && (
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-gradient-to-b from-color-1 to-color-2 rounded-r-full shadow-lg animate-pulse" />
                )}
                
                {/* Background highlight for active state */}
                {isActive && (
                  <div className="absolute inset-0 bg-gradient-to-r from-color-1/5 to-color-2/5 rounded-xl" />
                )}
                
                <div className={`flex items-center justify-center relative z-10 ${
                  isActive ? 'text-color-1' : 'text-n-3 group-hover:text-color-1'
                } transition-all duration-300 ${collapsed ? 'w-6 h-6' : ''} ${isActive ? 'ml-2' : ''}`}>
                  <Icon size={collapsed ? 20 : 18} strokeWidth={isActive ? 2.5 : 2} />
                </div>
                {!collapsed && (
                  <span className="font-medium text-sm transition-all duration-300 relative z-10">{item.label}</span>
                )}
                {isActive && !collapsed && (
                  <>
                    {/* Bottom underline indicator */}
                    <div className="absolute bottom-0 left-3 right-3 h-0.5 bg-gradient-to-r from-color-1 to-color-2 rounded-full animate-pulse" />
                    {/* Right side dot indicator */}
                    <div className="absolute right-3 w-2 h-2 bg-color-1 rounded-full animate-pulse relative z-10" />
                  </>
                )}
              </Link>
              
              {/* Tooltip for collapsed state */}
              {collapsed && (
                <>
                  <div className="absolute left-16 top-1/2 -translate-y-1/2 bg-n-7 text-n-1 px-3 py-2 rounded-lg text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none whitespace-nowrap shadow-lg border border-n-6 z-50">
                    {item.label}
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1 w-2 h-2 bg-n-7 border-l border-b border-n-6 rotate-45" />
                  </div>
                  {/* Active indicator for collapsed state */}
                  {isActive && (
                    <div className="absolute -right-1 top-1/2 -translate-y-1/2 w-1 h-6 bg-gradient-to-b from-color-1 to-color-2 rounded-l-full shadow-lg" />
                  )}
                </>
              )}
            </div>
          );
        })}
      </nav>

      {/* Multi-Role Navigation */}
      {hasMultipleRoles && (
        <div className="px-4 py-3 border-t border-n-6/50">
          {!collapsed ? (
            <div>
              <h3 className="text-n-4 text-xs font-semibold uppercase tracking-wider mb-3">Other Roles</h3>
              <div className="space-y-1">
                {userRoles.filter(role => role !== userRole).slice(0, 3).map((role) => (
                  <Link
                    key={role}
                    to={`/${role}`}
                    className="flex items-center gap-3 px-3 py-2 rounded-lg text-n-3 hover:text-n-1 hover:bg-n-7/50 transition-all duration-300 group"
                  >
                    <div className="w-6 h-6 bg-gradient-to-r from-color-1/50 to-color-2/50 rounded-md flex items-center justify-center">
                      <span className="text-white font-bold text-xs">{role.charAt(0).toUpperCase()}</span>
                    </div>
                    <span className="text-sm capitalize">{role}</span>
                  </Link>
                ))}
                {userRoles.length > 4 && (
                  <Link
                    to="/multirole"
                    className="flex items-center gap-3 px-3 py-2 rounded-lg text-color-1 hover:bg-color-1/10 transition-all duration-300"
                  >
                    <div className="w-6 h-6 bg-gradient-to-r from-color-1 to-color-2 rounded-md flex items-center justify-center">
                      <Users size={12} className="text-white" />
                    </div>
                    <span className="text-sm font-medium">View All Roles</span>
                  </Link>
                )}
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2">
              {userRoles.filter(role => role !== userRole).slice(0, 2).map((role) => (
                <Link
                  key={role}
                  to={`/${role}`}
                  className="w-8 h-8 bg-gradient-to-r from-color-1/30 to-color-2/30 rounded-lg flex items-center justify-center hover:scale-110 transition-all duration-300 group"
                  title={`Switch to ${role}`}
                >
                  <span className="text-white font-bold text-xs">{role.charAt(0).toUpperCase()}</span>
                </Link>
              ))}
              {userRoles.length > 3 && (
                <Link
                  to="/multirole"
                  className="w-8 h-8 bg-gradient-to-r from-color-1 to-color-2 rounded-lg flex items-center justify-center hover:scale-110 transition-all duration-300"
                  title="Multi-Role Dashboard"
                >
                  <Users size={14} className="text-white" />
                </Link>
              )}
            </div>
          )}
        </div>
      )}

      {/* User Info & Logout */}
      <div className="p-4 border-t border-n-6 flex-shrink-0">
        <div className={`flex items-center gap-3 mb-3 ${collapsed ? 'justify-center' : ''}`}>
          <div className="w-8 h-8 bg-gradient-to-r from-color-1 to-color-2 rounded-full flex items-center justify-center shadow-lg">
            <User size={16} className="text-white" />
          </div>
          {!collapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-n-1 font-medium text-sm truncate">John Doe</p>
              <p className="text-n-4 text-xs truncate">john@example.com</p>
            </div>
          )}
        </div>
        
        <button 
          className={`flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-n-4 hover:text-red-400 hover:bg-red-500/10 transition-all duration-300 group ${
            collapsed ? 'justify-center' : ''
          }`}
          title={collapsed ? 'Logout' : ''}
        >
          <LogOut size={16} className="group-hover:scale-110 transition-transform duration-300" />
          {!collapsed && <span className="text-sm font-medium">Logout</span>}
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
