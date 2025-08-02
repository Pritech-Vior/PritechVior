import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Eye, EyeOff, Mail, Lock, ArrowLeft } from "lucide-react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Section from "../components/Section";
import Button from "../components/Button";

const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle login logic here
    console.log("Login data:", formData);
  };

  return (
    <div className="pt-[4.75rem] lg:pt-[5.25rem] overflow-hidden">
      <Header />
      
      <Section className="pt-[12rem] -mt-[5.25rem]" id="login">
        <div className="container relative z-1">
          <div className="flex items-center justify-center min-h-screen -mt-[12rem] pt-[12rem] px-4">
            <div className="w-full max-w-sm">
              {/* Back Link */}
              <Link 
                to="/" 
                className="inline-flex items-center gap-2 text-n-3 hover:text-color-1 transition-colors mb-6 font-code text-sm"
              >
                <ArrowLeft size={16} />
                Back to Home
              </Link>

              {/* Login Form */}
              <div className="relative">
                {/* Background gradient effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-color-1/10 to-color-2/10 rounded-xl blur-2xl -z-1"></div>
                
                <div className="relative bg-n-8 border border-n-6 rounded-xl p-6 backdrop-blur-sm">
                  <div className="text-center mb-6">
                    <h1 className="h4 mb-3">Welcome Back</h1>
                    <p className="body-2 text-n-4 text-sm">
                      Sign in to your PritechVior account
                    </p>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Email Field */}
                    <div>
                      <label className="block text-sm font-medium text-n-1 mb-1.5">
                        Email Address
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Mail className="h-4 w-4 text-n-4" />
                        </div>
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          className="block w-full pl-9 pr-4 py-2.5 bg-n-7 border border-n-6 rounded-lg text-n-1 placeholder-n-4 focus:outline-none focus:ring-2 focus:ring-color-1/50 focus:border-color-1 transition-colors text-sm"
                          placeholder="Enter your email"
                          required
                        />
                      </div>
                    </div>

                    {/* Password Field */}
                    <div>
                      <label className="block text-sm font-medium text-n-1 mb-1.5">
                        Password
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Lock className="h-4 w-4 text-n-4" />
                        </div>
                        <input
                          type={showPassword ? "text" : "password"}
                          name="password"
                          value={formData.password}
                          onChange={handleInputChange}
                          className="block w-full pl-9 pr-11 py-2.5 bg-n-7 border border-n-6 rounded-lg text-n-1 placeholder-n-4 focus:outline-none focus:ring-2 focus:ring-color-1/50 focus:border-color-1 transition-colors text-sm"
                          placeholder="Enter your password"
                          required
                        />
                        <button
                          type="button"
                          className="absolute inset-y-0 right-0 pr-3 flex items-center"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? (
                            <EyeOff className="h-4 w-4 text-n-4 hover:text-n-1 transition-colors" />
                          ) : (
                            <Eye className="h-4 w-4 text-n-4 hover:text-n-1 transition-colors" />
                          )}
                        </button>
                      </div>
                    </div>

                    {/* Remember Me & Forgot Password */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <input
                          id="remember-me"
                          name="rememberMe"
                          type="checkbox"
                          checked={formData.rememberMe}
                          onChange={handleInputChange}
                          className="h-4 w-4 text-color-1 bg-n-7 border-n-6 rounded focus:ring-color-1/50 focus:ring-2"
                        />
                        <label htmlFor="remember-me" className="ml-2 block text-sm text-n-3">
                          Remember me
                        </label>
                      </div>
                      <Link 
                        to="/forgot-password" 
                        className="text-sm text-color-1 hover:text-color-2 transition-colors"
                      >
                        Forgot password?
                      </Link>
                    </div>

                    {/* Submit Button */}
                    <Button 
                      type="submit"
                      className="w-full justify-center"
                    >
                      Sign In
                    </Button>
                  </form>

                  {/* Sign Up Link */}
                  <div className="mt-6 text-center">
                    <p className="text-n-4 text-sm">
                      Don't have an account?{" "}
                      <Link 
                        to="/signup" 
                        className="text-color-1 hover:text-color-2 font-medium transition-colors"
                      >
                        Sign up here
                      </Link>
                    </p>
                  </div>

                  {/* Social Login Divider */}
                  <div className="mt-6">
                    <div className="relative">
                      <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-n-6" />
                      </div>
                      <div className="relative flex justify-center text-sm">
                        <span className="px-2 bg-n-8 text-n-4 text-xs">Or continue with</span>
                      </div>
                    </div>

                    {/* Social Login Buttons */}
                    <div className="mt-4 grid grid-cols-2 gap-3">
                      <button
                        type="button"
                        className="w-full inline-flex justify-center py-2.5 px-4 border border-n-6 rounded-lg bg-n-7 hover:bg-n-6 transition-colors"
                      >
                        <span className="text-n-1 font-medium text-sm">Google</span>
                      </button>
                      <button
                        type="button"
                        className="w-full inline-flex justify-center py-2.5 px-4 border border-n-6 rounded-lg bg-n-7 hover:bg-n-6 transition-colors"
                      >
                        <span className="text-n-1 font-medium text-sm">GitHub</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Section>

      <Footer />
    </div>
  );
};

export default LoginPage;
