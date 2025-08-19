import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  User,
  ChevronDown,
  LogIn,
  UserPlus,
  Settings,
  LogOut,
} from "lucide-react";
import Button from "./Button";
import { useAuth } from "../contexts/AuthContext";

const AccountDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const { isAuthenticated, user, logout } = useAuth();

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleLogout = async () => {
    await logout();
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Account Button */}
      <Button
        className="hidden lg:flex px-4 py-2 items-center gap-2"
        onClick={toggleDropdown}
      >
        <span className="flex items-center gap-2">
          {isAuthenticated
            ? user?.first_name || user?.email?.split("@")[0] || "Account"
            : "Account"}
          <User size={18} />
        </span>
        <ChevronDown
          size={16}
          className={`transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </Button>

      {/* Mobile Account Button */}
      <button
        onClick={toggleDropdown}
        className="flex lg:hidden items-center gap-2 font-code text-lg uppercase text-n-1 transition-colors hover:text-color-1 px-4 py-4 md:py-6"
      >
        <span className="flex items-center gap-2">
          {isAuthenticated
            ? user?.first_name || user?.email?.split("@")[0] || "Account"
            : "Account"}
          <User size={18} />
        </span>
        <ChevronDown
          size={16}
          className={`transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-64 bg-n-8 border border-n-6 rounded-lg shadow-xl backdrop-blur-sm z-50 overflow-hidden">
          {/* Background gradient effect */}
          <div className="absolute inset-0 bg-gradient-to-br from-color-1/5 to-color-2/5 pointer-events-none"></div>

          <div className="relative">
            {isAuthenticated ? (
              // Logged in user menu
              <>
                {/* User Info */}
                <div className="px-3 py-3 border-b border-n-6">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 bg-gradient-to-br from-color-1 to-color-2 rounded-full flex items-center justify-center">
                      <User size={16} className="text-white" />
                    </div>
                    <div>
                      <p className="font-medium text-n-1 text-sm">
                        {user?.first_name && user?.last_name
                          ? `${user.first_name} ${user.last_name}`
                          : user?.email?.split("@")[0] || "User"}
                      </p>
                      <p className="text-xs text-n-3">{user?.email}</p>
                    </div>
                  </div>
                </div>

                {/* Menu Items */}
                <div className="py-1">
                  <Link
                    to="/profile"
                    onClick={() => setIsOpen(false)}
                    className="flex items-center gap-2.5 px-3 py-2.5 text-n-1 hover:bg-n-7 hover:text-color-1 transition-colors text-sm"
                  >
                    <User size={16} />
                    <span>Profile</span>
                  </Link>
                  <Link
                    to="/settings"
                    onClick={() => setIsOpen(false)}
                    className="flex items-center gap-2.5 px-3 py-2.5 text-n-1 hover:bg-n-7 hover:text-color-1 transition-colors text-sm"
                  >
                    <Settings size={16} />
                    <span>Settings</span>
                  </Link>
                  <hr className="border-n-6 my-1" />
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-2.5 px-3 py-2.5 text-n-1 hover:bg-n-7 hover:text-red-400 transition-colors w-full text-left text-sm"
                  >
                    <LogOut size={16} />
                    <span>Sign out</span>
                  </button>
                </div>
              </>
            ) : (
              // Guest user menu
              <div className="py-2">
                <div className="px-3 py-2.5 border-b border-n-6">
                  <p className="text-n-1 font-medium text-sm">
                    Welcome to PritechVior
                  </p>
                  <p className="text-xs text-n-3">
                    Sign in to access your account
                  </p>
                </div>

                <div className="px-3 py-3 space-y-2.5">
                  <Link
                    to="/login"
                    onClick={() => setIsOpen(false)}
                    className="flex items-center justify-center gap-2 w-full px-3 py-2.5 bg-gradient-to-r from-color-1 to-color-2 text-white rounded-lg hover:from-color-1/90 hover:to-color-2/90 transition-all font-medium text-sm"
                  >
                    <LogIn size={16} />
                    Sign In
                  </Link>

                  <Link
                    to="/signup"
                    onClick={() => setIsOpen(false)}
                    className="flex items-center justify-center gap-2 w-full px-3 py-2.5 border border-n-6 text-n-1 rounded-lg hover:bg-n-7 hover:border-color-1 transition-all font-medium text-sm"
                  >
                    <UserPlus size={16} />
                    Create Account
                  </Link>
                </div>

                <div className="px-3 py-2.5 border-t border-n-6">
                  <p className="text-xs text-n-4 text-center">
                    New to PritechVior? Join our community
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AccountDropdown;
