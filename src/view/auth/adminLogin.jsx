import React, { useEffect, useState } from "react";
import {
  Eye,
  EyeOff,
  Shield,
  MapPin,
  Users,
  Hotel,
  FileText,
  Lock,
  Mail,
  ArrowLeft,
  ArrowRight,
} from "lucide-react";
import adminRoles from "../../config/adminRoles";
import { useNavigate } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { loginAdmin } from "../../hooks/slice/authSlice";
import toast from "react-hot-toast";

const AdminLogin = () => {
  const [currentStep, setCurrentStep] = useState(1); // 1: Role Selection, 2: Credentials
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    role: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const navigate = useNavigate();

  const dispatch = useDispatch();

  const user = localStorage.getItem("accessToken");

  console.log("accessToken:==>", user);

  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, [user, navigate]);

  console.log("user:", user);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear errors when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const handleRoleSelect = (roleValue) => {
    setFormData((prev) => ({
      ...prev,
      role: roleValue,
    }));
    setErrors({});
  };

  const proceedToCredentials = () => {
    if (!formData.role) {
      setErrors({ role: "Please select your role to continue" });
      return;
    }
    setCurrentStep(2);
    setErrors({});
  };

  const goBackToRoles = () => {
    setCurrentStep(1);
    setErrors({});
  };

  const validateCredentials = () => {
    const newErrors = {};

    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateCredentials()) return;

    setIsLoading(true);

    try {
      const result = await dispatch(loginAdmin(formData));
      const response = result?.payload;

      if (response?.success) {
        console.log("✅ Login success:", response?.data);
        toast.success("Login successful! Redirecting to dashboard...");
        navigate("/");
      } else {
        console.error("❌ Login failed:", response?.error);
        toast.error(response?.error || "Login failed. Please try again.");
        setErrors({ submit: response?.error });
      }
    } catch (error) {
      setErrors({ submit: "Login failed. Please check your credentials." });
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = () => {
    alert(
      "Forgot Password functionality - Contact Super Admin or use password recovery system"
    );
  };

  const handleSignUp = () => {
    navigate("/signup");
  };

  const selectedRole = adminRoles.find((role) => role.value === formData.role);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-orange-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-full mb-4">
            <MapPin className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Admin Portal
          </h1>
          <p className="text-gray-600">Tour Website Management System</p>
        </div>

        {/* Progress Indicator */}
        <div className="flex items-center justify-center mb-8">
          <div className="flex items-center">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                currentStep >= 1
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200 text-gray-600"
              }`}
            >
              1
            </div>
            <div
              className={`w-16 h-0.5 ${
                currentStep >= 2 ? "bg-blue-600" : "bg-gray-200"
              }`}
            ></div>
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                currentStep >= 2
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200 text-gray-600"
              }`}
            >
              2
            </div>
          </div>
        </div>

        {/* Main Form Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
          {/* Step 1: Role Selection */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <div className="text-center mb-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-2">
                  Select Your Role
                </h2>
                <p className="text-gray-600">
                  Choose your administrative role to continue
                </p>
              </div>

              <div className="space-y-3">
                {adminRoles.map((role) => {
                  const IconComponent = role.icon;
                  return (
                    <label
                      key={role.value}
                      className={`relative flex items-center p-4 rounded-xl border cursor-pointer transition-all duration-200 ${
                        formData.role === role.value
                          ? "border-blue-500 bg-blue-50 shadow-md transform scale-[1.02]"
                          : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                      }`}
                    >
                      <input
                        type="radio"
                        name="role"
                        value={role.value}
                        checked={formData.role === role.value}
                        onChange={() => handleRoleSelect(role.value)}
                        className="sr-only"
                      />
                      <div
                        className={`w-10 h-10 rounded-full ${role.color} flex items-center justify-center mr-4`}
                      >
                        <IconComponent className="w-5 h-5 text-white" />
                      </div>
                      <div className="flex-1">
                        <div className="font-semibold text-gray-900">
                          {role.label}
                        </div>
                        <div className="text-sm text-gray-500">
                          {role.description}
                        </div>
                      </div>
                      {formData.role === role.value && (
                        <div className="w-5 h-5 bg-blue-600 rounded-full flex items-center justify-center">
                          <div className="w-2 h-2 bg-white rounded-full"></div>
                        </div>
                      )}
                    </label>
                  );
                })}
              </div>

              {errors.role && (
                <p className="text-sm text-red-600 text-center">
                  {errors.role}
                </p>
              )}

              <button
                onClick={proceedToCredentials}
                className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors flex items-center justify-center"
              >
                Continue
                <ArrowRight className="w-5 h-5 ml-2" />
              </button>
            </div>
          )}

          {/* Step 2: Credentials */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <div className="text-center mb-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-2">
                  Enter Credentials
                </h2>
                <p className="text-gray-600">Sign in to your admin dashboard</p>
              </div>

              {/* Selected Role Display */}
              {selectedRole && (
                <div className="p-4 bg-gray-50 rounded-lg border">
                  <div className="flex items-center">
                    <div
                      className={`w-8 h-8 rounded-full ${selectedRole.color} flex items-center justify-center mr-3`}
                    >
                      <selectedRole.icon className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">
                        Signing in as {selectedRole.label}
                      </div>
                      <div className="text-sm text-gray-600">
                        {selectedRole.description}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Email Input */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                      errors.email ? "border-red-300" : "border-gray-300"
                    }`}
                    placeholder="Enter your email"
                  />
                </div>
                {errors.email && (
                  <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                )}
              </div>

              {/* Password Input */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className={`w-full pl-10 pr-12 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                      errors.password ? "border-red-300" : "border-gray-300"
                    }`}
                    placeholder="Enter your password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
                {errors.password && (
                  <p className="mt-1 text-sm text-red-600">{errors.password}</p>
                )}
              </div>

              {/* Submit Error */}
              {errors.submit && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-sm text-red-600">{errors.submit}</p>
                </div>
              )}

              {/* Action Buttons */}
              <div className="space-y-3">
                <button
                  onClick={handleSubmit}
                  disabled={isLoading}
                  className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center">
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                      Signing In...
                    </div>
                  ) : (
                    "Sign In to Dashboard"
                  )}
                </button>

                <button
                  onClick={goBackToRoles}
                  className="w-full bg-gray-100 text-gray-700 py-3 px-4 rounded-lg font-medium hover:bg-gray-200 transition-colors flex items-center justify-center"
                >
                  <ArrowLeft className="w-5 h-5 mr-2" />
                  Back to Role Selection
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="text-center mt-6 space-y-3">
          <div className="flex items-center justify-center space-x-1 text-sm">
            <span className="text-gray-500">Forgot your password?</span>
            <button
              onClick={handleForgotPassword}
              className="text-blue-600 hover:text-blue-700 font-medium hover:underline"
            >
              Reset Password
            </button>
          </div>

          <div className="flex items-center justify-center space-x-1 text-sm">
            <span className="text-gray-500">Need admin access?</span>
            <button
              onClick={handleSignUp}
              className="text-blue-600 hover:text-blue-700 font-medium hover:underline"
            >
              Create Account
            </button>
          </div>

          <div className="border-t border-gray-200 pt-3">
            <p className="text-xs text-gray-400">
              Protected by enterprise security protocols
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
