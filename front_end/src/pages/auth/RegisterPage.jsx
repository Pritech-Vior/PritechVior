import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, User, Mail, Lock, UserCheck } from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";
import { useToast } from "../../contexts/ToastContext";
import Button from "../../components/Button";
import Input from "../../components/Input";
import authService from "../../services/authService";
import googleOAuthService from "../../services/googleOAuthService";

const RegisterPage = () => {
  const navigate = useNavigate();
  const { register, googleSignUp, isLoading, clearError } = useAuth();
  const { showError, showSuccess } = useToast();

  const [formData, setFormData] = useState({
    email: "",
    first_name: "",
    last_name: "",
    phone: "",
    password: "",
    password_confirm: "",
    role: "guest",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [roles, setRoles] = useState([]);
  const [loadingRoles, setLoadingRoles] = useState(true);

  // Fetch available roles on component mount
  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const response = await authService.getRoles();
        // Use all_roles from the new API format, fallback to roles for backwards compatibility
        const availableRoles = response.all_roles || response.roles || [];
        setRoles(availableRoles);
      } catch (err) {
        console.error("Failed to fetch roles:", err);
        // Fallback roles if API fails
        setRoles([
          {
            value: "guest",
            label: "Guest",
            description: "General access user",
            type: "predefined",
          },
          {
            value: "student",
            label: "Student",
            description: "Student access",
            type: "predefined",
          },
          {
            value: "parent",
            label: "Parent",
            description: "Parent access",
            type: "predefined",
          },
          {
            value: "trainer",
            label: "Trainer",
            description: "Trainer access",
            type: "predefined",
          },
          {
            value: "client",
            label: "Client",
            description: "Client access",
            type: "predefined",
          },
          {
            value: "designer",
            label: "Designer",
            description: "Designer access",
            type: "predefined",
          },
          {
            value: "writer",
            label: "Writer",
            description: "Writer access",
            type: "predefined",
          },
          {
            value: "technician",
            label: "Technician",
            description: "Technician access",
            type: "predefined",
          },
        ]);
      } finally {
        setLoadingRoles(false);
      }
    };

    fetchRoles();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "role") {
      console.log("Role changed to:", value); // Debug
    }

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear errors when user starts typing
    if (clearError) clearError();
  };

  const validateForm = () => {
    if (
      !formData.email ||
      !formData.first_name ||
      !formData.last_name ||
      !formData.password ||
      !formData.password_confirm
    ) {
      showError("Please fill in all required fields");
      return false;
    }

    if (formData.password !== formData.password_confirm) {
      showError("Passwords do not match");
      return false;
    }

    if (formData.password.length < 8) {
      showError("Password must be at least 8 characters long");
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      showError("Please enter a valid email address");
      return false;
    }

    // Phone number validation (optional)
    if (formData.phone && !/^[\d\s\-+()]+$/.test(formData.phone)) {
      showError("Please enter a valid phone number");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      // Use email as username
      const registrationData = {
        ...formData,
        username: formData.email,
      };
      await register(registrationData);
      showSuccess("Account created successfully! Welcome to PritechVior.");
      navigate("/", { replace: true });
    } catch (err) {
      showError(err.message || "Registration failed. Please try again.");
    }
  };

  const handleGoogleSignUp = async (e) => {
    e.preventDefault(); // Prevent form submission
    e.stopPropagation(); // Stop event bubbling

    try {
      showSuccess("Redirecting to Google...");

      // Get Google OAuth token
      const googleToken = await googleOAuthService.signUp();

      // Use the selected role from the form, defaulting to guest
      const selectedRole = formData.role || "guest";

      // Call backend with Google token and selected role
      await googleSignUp(googleToken, selectedRole);

      showSuccess(
        "Account created successfully with Google! Welcome to PritechVior."
      );
      navigate("/", { replace: true });
    } catch (err) {
      showError(err.message || "Google sign-up failed. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-n-8 flex items-center justify-center px-4 py-4">
      <div className="max-w-lg w-full space-y-4">
        {/* Header */}
        <div className="text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-n-1">
            Create Account
          </h2>
          <p className="mt-1 text-sm text-n-3">
            Join our platform and get started
          </p>
        </div>

        {/* Registration Form */}
        <div className="bg-n-7 rounded-xl p-6 md:p-8 border border-n-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email Field */}
            <div className="space-y-1">
              <label
                htmlFor="email"
                className="block text-sm font-medium text-n-1"
              >
                Email Address *
              </label>
              <div className="relative">
                <Mail
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-n-4"
                  size={18}
                />
                <Input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="pl-10"
                  placeholder="Enter your email address"
                />
              </div>
            </div>

            {/* Name Fields */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label
                  htmlFor="first_name"
                  className="block text-sm font-medium text-n-1"
                >
                  First Name *
                </label>
                <Input
                  id="first_name"
                  name="first_name"
                  type="text"
                  autoComplete="given-name"
                  required
                  value={formData.first_name}
                  onChange={handleChange}
                  placeholder="First name"
                />
              </div>
              <div className="space-y-1">
                <label
                  htmlFor="last_name"
                  className="block text-sm font-medium text-n-1"
                >
                  Last Name *
                </label>
                <Input
                  id="last_name"
                  name="last_name"
                  type="text"
                  autoComplete="family-name"
                  required
                  value={formData.last_name}
                  onChange={handleChange}
                  placeholder="Last name"
                />
              </div>
            </div>

            {/* Phone Field */}
            <div className="space-y-1">
              <label
                htmlFor="phone"
                className="block text-sm font-medium text-n-1"
              >
                Phone Number
              </label>
              <div className="relative">
                <User
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-n-4"
                  size={18}
                />
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  autoComplete="tel"
                  value={formData.phone}
                  onChange={handleChange}
                  className="pl-10"
                  placeholder="Phone number (optional)"
                />
              </div>
            </div>

            {/* Role Selection */}
            <div className="space-y-1">
              <label
                htmlFor="role"
                className="block text-sm font-medium text-n-1"
              >
                Role *
              </label>
              <div className="relative">
                <UserCheck
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-n-4"
                  size={18}
                />
                <select
                  id="role"
                  name="role"
                  required
                  value={formData.role}
                  onChange={handleChange}
                  disabled={loadingRoles}
                  className="
                    w-full pl-10 pr-4 py-2.5 
                    bg-n-8 border border-n-6 rounded-lg
                    text-n-1 text-sm
                    focus:outline-none focus:ring-2 focus:ring-primary-1 focus:border-transparent
                    transition-all duration-200
                    disabled:opacity-50 disabled:cursor-not-allowed
                  "
                >
                  {loadingRoles ? (
                    <option>Loading roles...</option>
                  ) : (
                    roles.map((role) => (
                      <option
                        key={role.value}
                        value={role.value}
                        className="bg-n-8"
                        title={role.description}
                      >
                        {role.label} {role.type === "custom" ? "(Custom)" : ""}
                      </option>
                    ))
                  )}
                </select>
              </div>

              {/* Role Description */}
              {formData.role && !loadingRoles && (
                <div className="text-xs text-n-4 mt-1">
                  {roles.find((r) => r.value === formData.role)?.description ||
                    "Choose your primary role on the platform"}
                </div>
              )}

              <p className="text-xs text-n-4 mt-0.5">
                Select the role that best describes your intended use
              </p>
            </div>

            {/* Password Fields */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-n-1"
                >
                  Password *
                </label>
                <div className="relative">
                  <Lock
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-n-4"
                    size={18}
                  />
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="new-password"
                    required
                    value={formData.password}
                    onChange={handleChange}
                    className="pl-10 pr-10"
                    placeholder="Create password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-n-4 hover:text-n-1 transition-colors"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <div className="space-y-1">
                <label
                  htmlFor="password_confirm"
                  className="block text-sm font-medium text-n-1"
                >
                  Confirm Password *
                </label>
                <div className="relative">
                  <Lock
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-n-4"
                    size={18}
                  />
                  <Input
                    id="password_confirm"
                    name="password_confirm"
                    type={showConfirmPassword ? "text" : "password"}
                    autoComplete="new-password"
                    required
                    value={formData.password_confirm}
                    onChange={handleChange}
                    className="pl-10 pr-10"
                    placeholder="Confirm password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-n-4 hover:text-n-1 transition-colors"
                  >
                    {showConfirmPassword ? (
                      <EyeOff size={18} />
                    ) : (
                      <Eye size={18} />
                    )}
                  </button>
                </div>
              </div>
            </div>

            <p className="text-xs text-n-4 -mt-1">
              Password must be at least 8 characters long
            </p>

            {/* Terms and Conditions */}
            <div className="flex items-start">
              <input
                id="terms"
                name="terms"
                type="checkbox"
                required
                className="h-4 w-4 text-primary-1 focus:ring-primary-1 border-n-6 rounded mt-0.5"
              />
              <label htmlFor="terms" className="ml-2 block text-xs text-n-3">
                I agree to the{" "}
                <Link
                  to="/terms"
                  className="font-medium text-primary-1 hover:text-primary-2"
                >
                  Terms of Service
                </Link>{" "}
                and{" "}
                <Link
                  to="/privacy"
                  className="font-medium text-primary-1 hover:text-primary-2"
                >
                  Privacy Policy
                </Link>
              </label>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              className="w-full"
              disabled={isLoading || loadingRoles}
            >
              {isLoading ? "Creating Account..." : "Create Account"}
            </Button>

            {/* Google Sign Up */}
            <div className="mt-4">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-n-6" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-n-7 text-n-3">Or continue with</span>
                </div>
              </div>

              <div className="mt-4">
                <Button
                  type="button"
                  variant="outline"
                  className="w-full"
                  onClick={handleGoogleSignUp}
                  disabled={isLoading || loadingRoles}
                >
                  <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                    <path
                      fill="currentColor"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="currentColor"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="currentColor"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    />
                    <path
                      fill="currentColor"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    />
                  </svg>
                  Sign up with Google
                </Button>
              </div>
            </div>
          </form>

          {/* Sign In Link */}
          <div className="mt-4 text-center">
            <p className="text-sm text-n-3">
              Already have an account?{" "}
              <Link
                to="/auth/login"
                className="font-medium text-primary-1 hover:text-primary-2 transition-colors"
              >
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
