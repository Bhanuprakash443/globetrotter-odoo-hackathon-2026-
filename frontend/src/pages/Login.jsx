import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Globe, Mail, Lock, User, AlertCircle } from "lucide-react";
import InputField from "../components/InputField";
import { validation } from "../utils/validation";
import { userService } from "../services/userService";

export default function Login() {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    firstName: "",
    lastName: "",
    phone: "",
    city: "",
    country: "",
    additionalInfo: ""
  });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: null
      });
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (isLogin) {
      // Login validation
      const usernameError = validation.validateRequired(formData.username, "Username");
      if (usernameError) newErrors.username = usernameError;

      const passwordError = validation.validateRequired(formData.password, "Password");
      if (passwordError) newErrors.password = passwordError;
    } else {
      // Registration validation
      const firstNameError = validation.validateRequired(formData.firstName, "First Name");
      if (firstNameError) newErrors.firstName = firstNameError;

      const lastNameError = validation.validateRequired(formData.lastName, "Last Name");
      if (lastNameError) newErrors.lastName = lastNameError;

      const emailError = validation.validateEmail(formData.email);
      if (emailError) newErrors.email = emailError;

      const phoneError = validation.validatePhone(formData.phone);
      if (phoneError) newErrors.phone = phoneError;

      const passwordError = validation.validatePassword(formData.password);
      if (passwordError) newErrors.password = passwordError;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setErrors({}); // Clear previous errors
    try {
      if (isLogin) {
        // Login logic - for demo, just navigate
        // In production, call login API
        navigate("/dashboard");
      } else {
        // Registration
        const userData = {
          username: (formData.firstName.toLowerCase() + formData.lastName.toLowerCase()).replace(/\s+/g, '_'),
          email: formData.email,
          password: formData.password,
          first_name: formData.firstName,
          last_name: formData.lastName,
          phone: formData.phone || null,
          city: formData.city || null,
          country: formData.country || null,
          bio: formData.additionalInfo || null
        };
        
        const response = await userService.createUser(userData);
        if (response && response.id) {
          // Store user ID in localStorage for session management
          localStorage.setItem('userId', response.id);
          navigate("/dashboard");
        } else {
          setErrors({ submit: "Registration failed. Please try again." });
        }
      }
    } catch (error) {
      console.error("Registration error:", error);
      // Extract error message from API response
      const errorMessage = error?.error || error?.message || error?.response?.data?.error || "An error occurred. Please try again.";
      setErrors({ submit: errorMessage });
    } finally {
      setLoading(false);
    }
  };

  const handleTabSwitch = (newTab) => {
    setIsLogin(newTab);
    setErrors({});
    setFormData({
      username: "",
      email: "",
      password: "",
      firstName: "",
      lastName: "",
      phone: "",
      city: "",
      country: "",
      additionalInfo: ""
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-blue-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white rounded-2xl shadow-xl p-8 border border-gray-200">
        {/* Logo/Photo */}
        <div className="flex flex-col items-center">
          <div className="w-24 h-24 bg-gradient-to-br from-indigo-500 to-blue-600 rounded-full flex items-center justify-center mb-4 shadow-lg">
            <Globe className="w-12 h-12 text-white" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            {isLogin ? "Welcome Back" : "Create Account"}
          </h2>
          <p className="text-gray-600 text-sm text-center">
            {isLogin ? "Sign in to continue your journey" : "Start planning your adventures"}
          </p>
        </div>

        {/* Toggle Login/Register */}
        <div className="flex gap-2 p-1 bg-gray-100 rounded-lg">
          <button
            onClick={() => handleTabSwitch(true)}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all ${
              isLogin
                ? "bg-indigo-600 text-white shadow-md"
                : "text-gray-700 hover:text-gray-900"
            }`}
          >
            Login
          </button>
          <button
            onClick={() => handleTabSwitch(false)}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all ${
              !isLogin
                ? "bg-indigo-600 text-white shadow-md"
                : "text-gray-700 hover:text-gray-900"
            }`}
          >
            Register
          </button>
        </div>

        <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
          {isLogin ? (
            <>
              <InputField
                label="Username"
                name="username"
                type="text"
                value={formData.username}
                onChange={handleChange}
                placeholder="Enter your username"
                error={errors.username}
                required
                icon={User}
              />

              <InputField
                label="Password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter your password"
                error={errors.password}
                required
                icon={Lock}
              />

              <div className="flex items-center justify-between">
                <label className="flex items-center">
                  <input type="checkbox" className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500" />
                  <span className="ml-2 text-sm text-gray-600">Remember me</span>
                </label>
                <Link to="/forgot-password" className="text-sm text-indigo-600 hover:text-indigo-500 font-medium">
                  Forgot Password?
                </Link>
              </div>
            </>
          ) : (
            <>
              <div className="grid grid-cols-2 gap-4">
                <InputField
                  label="First Name"
                  name="firstName"
                  type="text"
                  value={formData.firstName}
                  onChange={handleChange}
                  placeholder="First Name"
                  error={errors.firstName}
                  required
                />

                <InputField
                  label="Last Name"
                  name="lastName"
                  type="text"
                  value={formData.lastName}
                  onChange={handleChange}
                  placeholder="Last Name"
                  error={errors.lastName}
                  required
                />
              </div>

              <InputField
                label="Email Address"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Email Address"
                error={errors.email}
                required
                icon={Mail}
              />

              <InputField
                label="Phone Number"
                name="phone"
                type="tel"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Phone Number"
                error={errors.phone}
                icon={User}
              />

              <div className="grid grid-cols-2 gap-4">
                <InputField
                  label="City"
                  name="city"
                  type="text"
                  value={formData.city}
                  onChange={handleChange}
                  placeholder="City"
                />

                <InputField
                  label="Country"
                  name="country"
                  type="text"
                  value={formData.country}
                  onChange={handleChange}
                  placeholder="Country"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Additional Information
                </label>
                <textarea
                  name="additionalInfo"
                  value={formData.additionalInfo}
                  onChange={handleChange}
                  placeholder="Tell us about yourself..."
                  rows="3"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all resize-none"
                />
              </div>

              <InputField
                label="Password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Create a password"
                error={errors.password}
                required
                icon={Lock}
              />
            </>
          )}

          {errors.submit && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
              <p className="text-sm text-red-700">{errors.submit}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-indigo-600 to-blue-600 text-white py-3 rounded-lg font-semibold hover:from-indigo-700 hover:to-blue-700 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
          >
            {loading ? "Processing..." : isLogin ? "Login" : "Register User"}
          </button>
        </form>
      </div>
    </div>
  );
}
