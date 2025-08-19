import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Eye, EyeOff, Mail, Lock, User, ArrowLeft } from "lucide-react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Section from "../components/Section";
import Button from "../components/Button";
import { useToast } from "../contexts/ToastContext";

const SignupPage = () => {
  const { showError } = useToast();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    agreeToTerms: false,
    subscribeNewsletter: false,
  });

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      showError("Passwords don't match!");
      return;
    }
    // Handle signup logic here
    console.log("Signup data:", formData);
  };

  return (
    <div className="pt-[4.75rem] lg:pt-[5.25rem] overflow-hidden">
      <Header />

      <Section className="pt-[12rem] -mt-[5.25rem]" id="signup">
        <div className="container relative z-1">
          <div className="flex items-center justify-center min-h-screen -mt-[12rem] pt-[12rem] pb-[6rem] px-4">
            <div className="w-full max-w-sm">
              {/* Back Link */}
              <Link
                to="/"
                className="inline-flex items-center gap-2 text-n-3 hover:text-color-1 transition-colors mb-6 font-code text-sm"
              >
                <ArrowLeft size={16} />
                Back to Home
              </Link>

              {/* Signup Form */}
              <div className="relative">
                {/* Background gradient effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-color-1/10 to-color-2/10 rounded-xl blur-2xl -z-1"></div>

                <div className="relative bg-n-8 border border-n-6 rounded-xl p-6 backdrop-blur-sm">
                  <div className="text-center mb-6">
                    <h1 className="h4 mb-3">Create Account</h1>
                    <p className="body-2 text-n-4 text-sm">
                      Join PritechVior and start your innovation journey
                    </p>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Name Fields */}
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-sm font-medium text-n-1 mb-1.5">
                          First Name
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <User className="h-4 w-4 text-n-4" />
                          </div>
                          <input
                            type="text"
                            name="firstName"
                            value={formData.firstName}
                            onChange={handleInputChange}
                            className="block w-full pl-9 pr-4 py-2.5 bg-n-7 border border-n-6 rounded-lg text-n-1 placeholder-n-4 focus:outline-none focus:ring-2 focus:ring-color-1/50 focus:border-color-1 transition-colors text-sm"
                            placeholder="First name"
                            required
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-n-1 mb-1.5">
                          Last Name
                        </label>
                        <input
                          type="text"
                          name="lastName"
                          value={formData.lastName}
                          onChange={handleInputChange}
                          className="block w-full px-4 py-2.5 bg-n-7 border border-n-6 rounded-lg text-n-1 placeholder-n-4 focus:outline-none focus:ring-2 focus:ring-color-1/50 focus:border-color-1 transition-colors text-sm"
                          placeholder="Last name"
                          required
                        />
                      </div>
                    </div>

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
                          placeholder="Create a password"
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

                    {/* Confirm Password Field */}
                    <div>
                      <label className="block text-sm font-medium text-n-1 mb-1.5">
                        Confirm Password
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Lock className="h-4 w-4 text-n-4" />
                        </div>
                        <input
                          type={showConfirmPassword ? "text" : "password"}
                          name="confirmPassword"
                          value={formData.confirmPassword}
                          onChange={handleInputChange}
                          className="block w-full pl-9 pr-11 py-2.5 bg-n-7 border border-n-6 rounded-lg text-n-1 placeholder-n-4 focus:outline-none focus:ring-2 focus:ring-color-1/50 focus:border-color-1 transition-colors text-sm"
                          placeholder="Confirm your password"
                          required
                        />
                        <button
                          type="button"
                          className="absolute inset-y-0 right-0 pr-3 flex items-center"
                          onClick={() =>
                            setShowConfirmPassword(!showConfirmPassword)
                          }
                        >
                          {showConfirmPassword ? (
                            <EyeOff className="h-4 w-4 text-n-4 hover:text-n-1 transition-colors" />
                          ) : (
                            <Eye className="h-4 w-4 text-n-4 hover:text-n-1 transition-colors" />
                          )}
                        </button>
                      </div>
                    </div>

                    {/* Terms and Newsletter */}
                    <div className="space-y-3">
                      <div className="flex items-start">
                        <input
                          id="agree-terms"
                          name="agreeToTerms"
                          type="checkbox"
                          checked={formData.agreeToTerms}
                          onChange={handleInputChange}
                          className="h-4 w-4 text-color-1 bg-n-7 border-n-6 rounded focus:ring-color-1/50 focus:ring-2 mt-1"
                          required
                        />
                        <label
                          htmlFor="agree-terms"
                          className="ml-3 block text-sm text-n-3"
                        >
                          I agree to the{" "}
                          <Link
                            to="/terms"
                            className="text-color-1 hover:text-color-2 transition-colors"
                          >
                            Terms of Service
                          </Link>{" "}
                          and{" "}
                          <Link
                            to="/privacy"
                            className="text-color-1 hover:text-color-2 transition-colors"
                          >
                            Privacy Policy
                          </Link>
                        </label>
                      </div>
                      <div className="flex items-center">
                        <input
                          id="subscribe-newsletter"
                          name="subscribeNewsletter"
                          type="checkbox"
                          checked={formData.subscribeNewsletter}
                          onChange={handleInputChange}
                          className="h-4 w-4 text-color-1 bg-n-7 border-n-6 rounded focus:ring-color-1/50 focus:ring-2"
                        />
                        <label
                          htmlFor="subscribe-newsletter"
                          className="ml-3 block text-sm text-n-3"
                        >
                          Subscribe to our newsletter for updates
                        </label>
                      </div>
                    </div>

                    {/* Submit Button */}
                    <Button type="submit" className="w-full justify-center">
                      Create Account
                    </Button>
                  </form>

                  {/* Sign In Link */}
                  <div className="mt-6 text-center">
                    <p className="text-n-4 text-sm">
                      Already have an account?{" "}
                      <Link
                        to="/login"
                        className="text-color-1 hover:text-color-2 font-medium transition-colors"
                      >
                        Sign in here
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
                        <span className="px-2 bg-n-8 text-n-4 text-xs">
                          Or continue with
                        </span>
                      </div>
                    </div>

                    {/* Social Login Buttons */}
                    <div className="mt-4 grid grid-cols-2 gap-3">
                      <button
                        type="button"
                        className="w-full inline-flex justify-center py-2.5 px-4 border border-n-6 rounded-lg bg-n-7 hover:bg-n-6 transition-colors"
                      >
                        <span className="text-n-1 font-medium text-sm">
                          Google
                        </span>
                      </button>
                      <button
                        type="button"
                        className="w-full inline-flex justify-center py-2.5 px-4 border border-n-6 rounded-lg bg-n-7 hover:bg-n-6 transition-colors"
                      >
                        <span className="text-n-1 font-medium text-sm">
                          GitHub
                        </span>
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

export default SignupPage;
