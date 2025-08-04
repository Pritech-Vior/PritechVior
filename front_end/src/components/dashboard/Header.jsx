import React from "react";
import { Bell, Search, User, ChevronDown } from "lucide-react";

const Header = ({ title, userRole = "student", onMenuToggle }) => {
  return (
    <header className="h-16 bg-n-8 border-b border-n-6 px-6 flex items-center justify-between">
      {/* Left Side */}
      <div className="flex items-center gap-4">
        <button
          onClick={onMenuToggle}
          className="lg:hidden p-2 rounded-lg hover:bg-n-7 transition-colors"
        >
          <div className="w-5 h-5 flex flex-col justify-center gap-1">
            <div className="h-0.5 bg-n-3 rounded-full"></div>
            <div className="h-0.5 bg-n-3 rounded-full"></div>
            <div className="h-0.5 bg-n-3 rounded-full"></div>
          </div>
        </button>
        
        <div>
          <h1 className="text-xl font-semibold text-n-1">{title}</h1>
          <p className="text-n-4 text-sm capitalize">{userRole} Dashboard</p>
        </div>
      </div>

      {/* Right Side */}
      <div className="flex items-center gap-4">
        {/* Search */}
        <div className="hidden md:flex relative">
          <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-n-4" />
          <input
            type="text"
            placeholder="Search..."
            className="pl-10 pr-4 py-2 bg-n-7 border border-n-6 rounded-lg text-n-1 placeholder-n-4 focus:outline-none focus:ring-2 focus:ring-color-1/50 focus:border-color-1 w-64"
          />
        </div>

        {/* Notifications */}
        <button className="relative p-2 rounded-lg hover:bg-n-7 transition-colors">
          <Bell size={20} className="text-n-3" />
          <div className="absolute -top-1 -right-1 w-3 h-3 bg-color-1 rounded-full flex items-center justify-center">
            <span className="text-white text-xs font-bold">3</span>
          </div>
        </button>

        {/* User Menu */}
        <div className="flex items-center gap-2 cursor-pointer hover:bg-n-7 rounded-lg p-2 transition-colors">
          <div className="w-8 h-8 bg-gradient-to-r from-color-1 to-color-2 rounded-full flex items-center justify-center">
            <User size={16} className="text-white" />
          </div>
          <div className="hidden sm:block text-left">
            <p className="text-n-1 font-medium text-sm">John Doe</p>
            <p className="text-n-4 text-xs">{userRole}</p>
          </div>
          <ChevronDown size={16} className="text-n-4" />
        </div>
      </div>
    </header>
  );
};

export default Header;
