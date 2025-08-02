import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Mail, ArrowLeft, CheckCircle } from "lucide-react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Section from "../components/Section";
import Button from "../components/Button";

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle forgot password logic here
    console.log("Reset password for:", email);
    setIsSubmitted(true);
  };

  return (
    <div className="pt-[4.75rem] lg:pt-[5.25rem] overflow-hidden">
      <Header />
      
      <Section className="pt-[12rem] -mt-[5.25rem]" id="forgot-password">
        <div className="container relative z-1">
          <div className="flex items-center justify-center min-h-screen -mt-[12rem] pt-[12rem] px-4">
            <div className="w-full max-w-sm">
              {/* Back Link */}
              <Link 
                to="/login" 
                className="inline-flex items-center gap-2 text-n-3 hover:text-color-1 transition-colors mb-6 font-code text-sm"
              >
                <ArrowLeft size={16} />
                Back to Sign In
              </Link>

              {/* Forgot Password Form */}
              <div className="relative">
                {/* Background gradient effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-color-1/10 to-color-2/10 rounded-xl blur-2xl -z-1"></div>
                
                <div className="relative bg-n-8 border border-n-6 rounded-xl p-6 backdrop-blur-sm">
                  {!isSubmitted ? (
                    <>
                      <div className="text-center mb-6">
                        <h1 className="h4 mb-3">Forgot Password?</h1>
                        <p className="body-2 text-n-4 text-sm">
                          No worries! Enter your email and we'll send you a reset link.
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
                              value={email}
                              onChange={(e) => setEmail(e.target.value)}
                              className="block w-full pl-9 pr-4 py-2.5 bg-n-7 border border-n-6 rounded-lg text-n-1 placeholder-n-4 focus:outline-none focus:ring-2 focus:ring-color-1/50 focus:border-color-1 transition-colors text-sm"
                              placeholder="Enter your email"
                              required
                            />
                          </div>
                        </div>

                        {/* Submit Button */}
                        <Button 
                          type="submit"
                          className="w-full justify-center bg-gradient-to-r from-color-1 to-color-2 hover:from-color-1/90 hover:to-color-2/90"
                        >
                          Send Reset Link
                        </Button>
                      </form>
                    </>
                  ) : (
                    <>
                      <div className="text-center mb-6">
                        <div className="w-12 h-12 bg-gradient-to-br from-color-1 to-color-2 rounded-full flex items-center justify-center mx-auto mb-3">
                          <CheckCircle size={24} className="text-white" />
                        </div>
                        <h1 className="h4 mb-3">Check Your Email</h1>
                        <p className="body-2 text-n-4 text-sm">
                          We've sent a reset link to <span className="text-color-1">{email}</span>
                        </p>
                      </div>

                      <div className="space-y-3">
                        <p className="text-sm text-n-4 text-center">
                          Didn't receive it? Check spam or try again.
                        </p>
                        <Button 
                          onClick={() => setIsSubmitted(false)}
                          className="w-full justify-center border border-n-6 hover:border-color-1"
                        >
                          Try Again
                        </Button>
                      </div>
                    </>
                  )}

                  {/* Back to Login */}
                  <div className="mt-6 text-center">
                    <p className="text-n-4 text-sm">
                      Remember your password?{" "}
                      <Link 
                        to="/login" 
                        className="text-color-1 hover:text-color-2 font-medium transition-colors"
                      >
                        Sign in here
                      </Link>
                    </p>
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

export default ForgotPasswordPage;
