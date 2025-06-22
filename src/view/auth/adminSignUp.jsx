import React, { useState } from "react";
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
  User,
  Phone,
  Building,
  Calendar,
  ArrowLeft,
  ArrowRight,
  CheckCircle,
} from "lucide-react";
import adminRoles from "../../config/adminSignUpRole";

const AdminSignUp = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    role: "",
    // department: "",
    // employeeId: "",
    // joiningDate: "",
    permissions: [],
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const departments = [
    "Operations",
    "Marketing",
    "Sales",
    "Customer Service",
    "Finance",
    "IT & Technology",
    "Human Resources",
  ];

  const stepTitles = [
    { title: "Personal Info", subtitle: "Basic information" },
    { title: "Role Selection", subtitle: "Choose your role" },
    { title: "Security Setup", subtitle: "Account & password" },
  ];

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

  const validateStep1 = () => {
    const newErrors = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = "First name is required";
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = "Last name is required";
    }

    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email";
    }

    if (!formData.phone) {
      newErrors.phone = "Phone number is required";
    } else if (!/^\+?[\d\s-()]{10,}$/.test(formData.phone)) {
      newErrors.phone = "Please enter a valid phone number";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep2 = () => {
    const newErrors = {};

    if (!formData.role) {
      newErrors.role = "Please select your role";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep3 = () => {
    const newErrors = {};

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
      newErrors.password =
        "Password must contain uppercase, lowercase, and number";
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (currentStep === 1 && validateStep1()) {
      setCurrentStep(2);
    } else if (currentStep === 2 && validateStep2()) {
      setCurrentStep(3);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      setErrors({});
    }
  };

  const handleSubmit = async () => {
    if (!validateStep3()) return;

    setIsLoading(true);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000));

      console.log("Registration attempt:", formData);

      const selectedRole = adminRoles.find(
        (role) => role.value === formData.role
      );

      if (selectedRole?.requiresApproval) {
        alert(
          "Registration submitted successfully! Your account is pending approval from a Super Admin."
        );
      } else {
        alert("Registration successful! You can now login to your account.");
      }
    } catch (error) {
      setErrors({ submit: "Registration failed. Please try again." });
    } finally {
      setIsLoading(false);
    }
  };

  const selectedRole = adminRoles.find((role) => role.value === formData.role);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-orange-50 flex items-center justify-center p-4">
      <div className="w-full max-w-lg">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-full mb-4">
            <MapPin className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Create Admin Account
          </h1>
          <p className="text-gray-600">Join the Tour Website Management Team</p>
        </div>

        {/* Progress Indicator */}
        <div className="mb-8">
          <div className="flex items-center justify-center space-x-4">
            {[1, 2, 3].map((step, index) => (
              <React.Fragment key={step}>
                <div
                  className={`flex items-center justify-center w-10 h-10 rounded-full text-sm font-medium transition-all duration-300 ${
                    currentStep >= step
                      ? "bg-blue-600 text-white shadow-lg"
                      : "bg-gray-200 text-gray-600"
                  }`}
                >
                  {currentStep > step ? (
                    <CheckCircle className="w-5 h-5" />
                  ) : (
                    step
                  )}
                </div>
                {index < 2 && (
                  <div
                    className={`h-1 w-12 transition-all duration-300 ${
                      currentStep > step ? "bg-blue-600" : "bg-gray-200"
                    }`}
                  ></div>
                )}
              </React.Fragment>
            ))}
          </div>
          <div className="flex justify-between mt-3 text-xs text-gray-500 px-4">
            {stepTitles.map((step, index) => (
              <div key={index} className="text-center">
                <div className="font-medium">{step.title}</div>
                <div className="text-gray-400">{step.subtitle}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
          {/* Step 1: Personal Information */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <div className="text-center mb-6">
                <h2 className="text-xl font-semibold text-gray-900">
                  Personal Information
                </h2>
                <p className="text-sm text-gray-600 mt-1">
                  Tell us about yourself
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    First Name
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                        errors.firstName ? "border-red-300" : "border-gray-300"
                      }`}
                      placeholder="First name"
                    />
                  </div>
                  {errors.firstName && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.firstName}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Last Name
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                        errors.lastName ? "border-red-300" : "border-gray-300"
                      }`}
                      placeholder="Last name"
                    />
                  </div>
                  {errors.lastName && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.lastName}
                    </p>
                  )}
                </div>
              </div>

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

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                      errors.phone ? "border-red-300" : "border-gray-300"
                    }`}
                    placeholder="Enter your phone number"
                  />
                </div>
                {errors.phone && (
                  <p className="mt-1 text-sm text-red-600">{errors.phone}</p>
                )}
              </div>

              <button
                onClick={handleNext}
                className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors flex items-center justify-center"
              >
                Continue to Role Selection
                <ArrowRight className="w-5 h-5 ml-2" />
              </button>
            </div>
          )}

          {/* Step 2: Role Selection */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <div className="flex items-center mb-6">
                <button
                  onClick={handleBack}
                  className="mr-4 p-2 text-gray-600 hover:text-gray-800 transition-colors rounded-lg hover:bg-gray-100"
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">
                    Role & Department
                  </h2>
                  <p className="text-sm text-gray-600 mt-1">
                    Select your role and work details
                  </p>
                </div>
              </div>

              {/* Role Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Select Your Role
                </label>
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
                          <div className="flex items-center">
                            <span className="font-semibold text-gray-900">
                              {role.label}
                            </span>
                            {role.requiresApproval && (
                              <span className="ml-2 px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full">
                                Requires Approval
                              </span>
                            )}
                          </div>
                          <div className="text-sm text-gray-500">
                            {role.description}
                          </div>
                        </div>
                        {formData.role === role.value && (
                          <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center">
                            <div className="w-2 h-2 bg-white rounded-full"></div>
                          </div>
                        )}
                      </label>
                    );
                  })}
                </div>
                {errors.role && (
                  <p className="mt-1 text-sm text-red-600">{errors.role}</p>
                )}
              </div>

              <button
                onClick={handleNext}
                className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors flex items-center justify-center"
              >
                Continue to Security Setup
                <ArrowRight className="w-5 h-5 ml-2" />
              </button>
            </div>
          )}

          {/* Step 3: Security Setup */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <div className="flex items-center mb-6">
                <button
                  onClick={handleBack}
                  className="mr-4 p-2 text-gray-600 hover:text-gray-800 transition-colors rounded-lg hover:bg-gray-100"
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">
                    Security Setup
                  </h2>
                  <p className="text-sm text-gray-600 mt-1">
                    Create your secure password
                  </p>
                </div>
              </div>

              {/* Selected Role Confirmation */}
              {selectedRole && (
                <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200">
                  <div className="flex items-center mb-2">
                    <div
                      className={`w-10 h-10 rounded-full ${selectedRole.color} flex items-center justify-center mr-3 shadow-lg`}
                    >
                      <selectedRole.icon className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900">
                        {selectedRole.label}
                      </div>
                      {/* <div className="text-sm text-gray-600">
                        {formData.department} • {formData.employeeId}
                      </div> */}
                    </div>
                  </div>
                  {selectedRole.requiresApproval && (
                    <div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                      <div className="flex items-center">
                        <div className="w-4 h-4 bg-yellow-400 rounded-full mr-2 flex-shrink-0"></div>
                        <div className="text-sm text-yellow-800">
                          <strong>Requires Approval:</strong> Your account will
                          be reviewed by a Super Admin before activation.
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Create Password
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
                    placeholder="Create a strong password"
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

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Confirm Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    className={`w-full pl-10 pr-12 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                      errors.confirmPassword
                        ? "border-red-300"
                        : "border-gray-300"
                    }`}
                    placeholder="Confirm your password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.confirmPassword}
                  </p>
                )}
              </div>

              {/* Password Requirements */}
              <div className="p-4 bg-gray-50 rounded-lg">
                <h4 className="text-sm font-medium text-gray-700 mb-2">
                  Password Requirements:
                </h4>
                <ul className="text-xs text-gray-600 space-y-1">
                  <li className="flex items-center">
                    <div
                      className={`w-2 h-2 rounded-full mr-2 ${
                        formData.password.length >= 8
                          ? "bg-green-500"
                          : "bg-gray-300"
                      }`}
                    ></div>
                    At least 8 characters long
                  </li>
                  <li className="flex items-center">
                    <div
                      className={`w-2 h-2 rounded-full mr-2 ${
                        /[A-Z]/.test(formData.password)
                          ? "bg-green-500"
                          : "bg-gray-300"
                      }`}
                    ></div>
                    Contains uppercase letter
                  </li>
                  <li className="flex items-center">
                    <div
                      className={`w-2 h-2 rounded-full mr-2 ${
                        /[a-z]/.test(formData.password)
                          ? "bg-green-500"
                          : "bg-gray-300"
                      }`}
                    ></div>
                    Contains lowercase letter
                  </li>
                  <li className="flex items-center">
                    <div
                      className={`w-2 h-2 rounded-full mr-2 ${
                        /\d/.test(formData.password)
                          ? "bg-green-500"
                          : "bg-gray-300"
                      }`}
                    ></div>
                    Contains number
                  </li>
                </ul>
              </div>

              {/* Submit Error */}
              {errors.submit && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-sm text-red-600">{errors.submit}</p>
                </div>
              )}

              <button
                onClick={handleSubmit}
                disabled={isLoading}
                className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    Creating Account...
                  </div>
                ) : (
                  "Create Admin Account"
                )}
              </button>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="text-center mt-6">
          <p className="text-sm text-gray-500">
            Already have an account?{" "}
            <button className="text-blue-600 hover:text-blue-700 font-medium hover:underline">
              Sign In Here
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminSignUp;
