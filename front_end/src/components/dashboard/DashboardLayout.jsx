import React, { useState } from "react";
import { Menu, X, Users, ChevronDown } from "lucide-react";
import { Link } from "react-router-dom";
import pritechviorLogo from "../../assets/pritechvior-logo.svg";
import Sidebar from "./Sidebar";

const DashboardLayout = ({ children, title, userRole = "student", userRoles = [] }) => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [roleDropdownOpen, setRoleDropdownOpen] = useState(false);

  const handleSidebarToggle = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  const handleMobileMenuToggle = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  // Role configurations
  const roleConfigs = {
    client: { title: "Client Manager", color: "from-blue-500 to-blue-600" },
    designer: { title: "Creative Designer", color: "from-purple-500 to-purple-600" },
    technician: { title: "Technical Developer", color: "from-green-500 to-green-600" },
    writer: { title: "Content Writer", color: "from-yellow-500 to-yellow-600" },
    admin: { title: "Administrator", color: "from-red-500 to-red-600" },
    ceo: { title: "Chief Executive", color: "from-indigo-500 to-indigo-600" },
    treasury: { title: "Treasury Manager", color: "from-emerald-500 to-emerald-600" },
    trainer: { title: "Trainer", color: "from-orange-500 to-orange-600" },
    student: { title: "Student", color: "from-teal-500 to-teal-600" },
    parent: { title: "Parent", color: "from-pink-500 to-pink-600" },
    guest: { title: "Guest", color: "from-gray-500 to-gray-600" }
  };

  const currentRoleConfig = roleConfigs[userRole] || roleConfigs.student;
  const hasMultipleRoles = userRoles.length > 1;

  return (
    <div className="min-h-screen bg-n-8 flex">
      {/* Mobile Sidebar Overlay */}
      {mobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Desktop Sidebar - Fixed positioning */}
      <div className={`hidden lg:flex lg:flex-col lg:fixed lg:inset-y-0 lg:left-0 lg:z-50 transition-all duration-300 ${
        sidebarCollapsed ? 'lg:w-16' : 'lg:w-64'
      }`}>
        <Sidebar 
          userRole={userRole} 
          collapsed={sidebarCollapsed} 
          onToggle={handleSidebarToggle}
          userRoles={userRoles}
        />
      </div>

      {/* Mobile Sidebar */}
      <div className={`lg:hidden fixed inset-y-0 left-0 z-50 transform transition-transform duration-300 ${
        mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <Sidebar 
          userRole={userRole} 
          collapsed={false} 
          onToggle={() => setMobileMenuOpen(false)}
          userRoles={userRoles}
        />
      </div>
      
      {/* Main Content - Properly positioned next to sidebar */}
      <div className={`flex-1 flex flex-col min-h-screen transition-all duration-300 ${
        sidebarCollapsed ? 'lg:ml-16' : 'lg:ml-64'
      }`}>
        {/* Mobile Header */}
        <div className="lg:hidden bg-n-8 border-b border-n-6 p-4 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-3">
            <button
              onClick={handleMobileMenuToggle}
              className="p-2 rounded-lg hover:bg-n-7 transition-all duration-200 group"
            >
              {mobileMenuOpen ? (
                <X size={20} className="text-n-3 group-hover:text-color-1 transition-colors" />
              ) : (
                <Menu size={20} className="text-n-3 group-hover:text-color-1 transition-colors" />
              )}
            </button>
            <div className={`w-8 h-8 bg-gradient-to-r ${currentRoleConfig.color} rounded-lg flex items-center justify-center shadow-lg p-1`}>
              <img 
                src={pritechviorLogo} 
                alt="PritechVior Logo" 
                className="w-full h-full object-contain"
              />
            </div>
            <div>
              <h2 className="text-n-1 font-semibold text-sm">PritechVior</h2>
              <p className="text-n-4 text-xs">
                {userRoles?.length > 1 ? 'Staff Portal' : `${currentRoleConfig.title}`}
              </p>
            </div>
          </div>
          
          {/* Mobile Role Switcher */}
          {hasMultipleRoles && (
            <div className="relative">
              <button
                onClick={() => setRoleDropdownOpen(!roleDropdownOpen)}
                className="flex items-center gap-2 p-2 bg-n-7 rounded-lg hover:bg-n-6 transition-colors"
              >
                <Users size={16} className="text-n-3" />
                <ChevronDown size={14} className="text-n-3" />
              </button>
              
              {roleDropdownOpen && (
                <div className="absolute right-0 top-full mt-2 w-48 bg-n-8 border border-n-6 rounded-lg shadow-xl z-50">
                  <div className="p-2">
                    <p className="text-n-4 text-xs px-2 py-1">Switch Role</p>
                    {userRoles.map((role) => (
                      <Link
                        key={role}
                        to={role === userRole ? '#' : `/${role}`}
                        onClick={() => setRoleDropdownOpen(false)}
                        className={`block px-3 py-2 rounded-lg text-sm transition-colors ${
                          role === userRole 
                            ? 'bg-color-1/10 text-color-1' 
                            : 'text-n-1 hover:bg-n-7'
                        }`}
                      >
                        {roleConfigs[role]?.title || role}
                      </Link>
                    ))}
                    <div className="border-t border-n-6 mt-2 pt-2">
                      <Link
                        to="/multirole"
                        onClick={() => setRoleDropdownOpen(false)}
                        className="block px-3 py-2 rounded-lg text-sm text-color-1 hover:bg-n-7 transition-colors"
                      >
                        Multi-Role Dashboard
                      </Link>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Desktop Header - Only show when has multiple roles */}
        {hasMultipleRoles && (
          <div className="hidden lg:block bg-n-8/50 border-b border-n-6/50 p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`w-8 h-8 bg-gradient-to-r ${currentRoleConfig.color} rounded-lg flex items-center justify-center`}>
                  <span className="text-white font-bold text-xs">
                    {userRole.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div>
                  <h3 className="text-n-1 font-medium">{currentRoleConfig.title}</h3>
                  <p className="text-n-4 text-xs">Active Role</p>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <span className="text-n-4 text-sm">Other Roles:</span>
                {userRoles.filter(role => role !== userRole).map((role) => (
                  <Link
                    key={role}
                    to={`/${role}`}
                    className={`w-8 h-8 bg-gradient-to-r ${roleConfigs[role]?.color || 'from-gray-500 to-gray-600'} rounded-lg flex items-center justify-center hover:scale-110 transition-transform`}
                    title={roleConfigs[role]?.title || role}
                  >
                    <span className="text-white font-bold text-xs">
                      {role.charAt(0).toUpperCase()}
                    </span>
                  </Link>
                ))}
                <Link
                  to="/multirole"
                  className="px-3 py-1 bg-gradient-to-r from-color-1 to-color-2 text-white rounded-lg text-sm hover:shadow-lg transition-all"
                >
                  Multi-Role
                </Link>
              </div>
            </div>
          </div>
        )}
        
        {/* Page Content - Takes remaining space */}
        <main className="flex-1 p-4 lg:py-6 lg:pl-0 lg:pr-0 overflow-auto">
          <div className="w-full max-w-full">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
