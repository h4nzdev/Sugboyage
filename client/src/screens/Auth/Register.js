import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
  Animated,
  Keyboard,
  ImageBackground,
} from "react-native";
import React, { useState, useRef, useEffect, useCallback } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import logo from "../../../assets/logo.png";
import { useAuth } from "../../context/AuthenticationContext";

// Move InputField outside the component to prevent recreation
const InputField = React.memo(
  ({
    label,
    name,
    placeholder,
    secureTextEntry,
    showPasswordToggle,
    autoCapitalize = "none",
    value,
    onChangeText,
    error,
    loading,
    onTogglePassword,
    keyboardType = "default",
  }) => {
    return (
      <View className="mb-5">
        <Text className="text-gray-700 font-semibold mb-2 text-sm">
          {label}
        </Text>
        <View
          className={`flex-row items-center bg-white rounded-2xl px-4 py-4 border-2 ${
            error ? "border-red-400" : "border-gray-200"
          }`}
        >
          <Feather
            name={
              name === "email"
                ? "mail"
                : name === "password" || name === "confirmPassword"
                  ? "lock"
                  : name === "username"
                    ? "user"
                    : "user-check"
            }
            size={20}
            color={error ? "#DC143C" : "#9CA3AF"}
          />
          <TextInput
            placeholder={placeholder}
            placeholderTextColor="#9CA3AF"
            className="flex-1 ml-3 text-gray-900 text-base"
            value={value}
            onChangeText={onChangeText}
            secureTextEntry={secureTextEntry}
            autoCapitalize={autoCapitalize}
            editable={!loading}
            keyboardType={keyboardType}
            autoComplete="off"
            autoCorrect={false}
            spellCheck={false}
          />
          {showPasswordToggle && (
            <TouchableOpacity onPress={onTogglePassword}>
              <Feather
                name={secureTextEntry ? "eye" : "eye-off"}
                size={18}
                color="#9CA3AF"
              />
            </TouchableOpacity>
          )}
        </View>
        {error && (
          <Text className="text-red-500 text-xs mt-2 ml-1">{error}</Text>
        )}
      </View>
    );
  }
);

export default function Register() {
  const navigation = useNavigation();
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    displayName: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [currentStep, setCurrentStep] = useState(1);

  const { register, loading, error, clearError } = useAuth();

  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const progressAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Clear any previous errors when component mounts
    clearError();

    // Entrance animation
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.spring(slideAnim, {
        toValue: 0,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  // Update progress animation when step changes
  useEffect(() => {
    Animated.timing(progressAnim, {
      toValue: (currentStep - 1) / 2, // 3 steps total (0-1 range)
      duration: 500,
      useNativeDriver: false,
    }).start();
  }, [currentStep]);

  const validateField = useCallback(
    (name, value) => {
      const newErrors = { ...errors };

      switch (name) {
        case "username":
          if (!value) {
            newErrors.username = "Username is required";
          } else if (value.length < 3) {
            newErrors.username = "Username must be at least 3 characters";
          } else if (!/^[a-zA-Z0-9_]+$/.test(value)) {
            newErrors.username =
              "Username can only contain letters, numbers, and underscores";
          } else {
            delete newErrors.username;
          }
          break;

        case "email":
          if (!value) {
            newErrors.email = "Email is required";
          } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
            newErrors.email = "Please enter a valid email address";
          } else {
            delete newErrors.email;
          }
          break;

        case "password":
          if (!value) {
            newErrors.password = "Password is required";
          } else if (value.length < 6) {
            newErrors.password = "Password must be at least 6 characters";
          } else {
            delete newErrors.password;
          }

          // Also validate confirm password if it exists
          if (formData.confirmPassword && value !== formData.confirmPassword) {
            newErrors.confirmPassword = "Passwords do not match";
          } else if (formData.confirmPassword) {
            delete newErrors.confirmPassword;
          }
          break;

        case "confirmPassword":
          if (!value) {
            newErrors.confirmPassword = "Please confirm your password";
          } else if (value !== formData.password) {
            newErrors.confirmPassword = "Passwords do not match";
          } else {
            delete newErrors.confirmPassword;
          }
          break;

        case "displayName":
          if (!value) {
            newErrors.displayName = "Display name is required";
          } else if (value.length < 2) {
            newErrors.displayName =
              "Display name must be at least 2 characters";
          } else {
            delete newErrors.displayName;
          }
          break;
      }

      setErrors(newErrors);
      return Object.keys(newErrors).length === 0;
    },
    [errors, formData.confirmPassword, formData.password]
  );

  const handleInputChange = useCallback(
    (name, value) => {
      setFormData((prev) => ({ ...prev, [name]: value }));
      validateField(name, value);
      clearError();
    },
    [validateField, clearError]
  );

  const validateStep = useCallback(
    (step) => {
      const newErrors = {};

      switch (step) {
        case 1:
          if (!formData.username) newErrors.username = "Username is required";
          if (!formData.email) newErrors.email = "Email is required";
          break;
        case 2:
          if (!formData.password) newErrors.password = "Password is required";
          if (!formData.confirmPassword)
            newErrors.confirmPassword = "Please confirm your password";
          if (formData.password !== formData.confirmPassword)
            newErrors.confirmPassword = "Passwords do not match";
          break;
        case 3:
          if (!formData.displayName)
            newErrors.displayName = "Display name is required";
          break;
      }

      setErrors(newErrors);
      return Object.keys(newErrors).length === 0;
    },
    [formData]
  );

  const nextStep = useCallback(() => {
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => Math.min(prev + 1, 3));
    }
  }, [currentStep, validateStep]);

  const prevStep = useCallback(() => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
    clearError();
  }, [clearError]);

  const handleRegister = async () => {
    Keyboard.dismiss();

    if (!validateStep(3)) return;

    const result = await register({
      username: formData.username,
      email: formData.email,
      password: formData.password,
      displayName: formData.displayName,
    });

    if (result.success) {
      console.log("✅ Registration successful, user:", result.user);
      // Registration successful - you can navigate to home or welcome screen
      // navigation.navigate("Home");
    } else {
      console.log("❌ Registration failed:", result.error);
    }
  };

  const ProgressBar = () => {
    const progressWidth = progressAnim.interpolate({
      inputRange: [0, 1],
      outputRange: ["0%", "100%"],
    });

    return (
      <View className="px-6 mb-6">
        <View className="flex-row justify-between mb-2">
          <Text className="text-red-600 font-bold text-sm">
            Step {currentStep} of 3
          </Text>
          <Text className="text-gray-500 text-sm">
            {currentStep === 1 && "Account Basics"}
            {currentStep === 2 && "Security"}
            {currentStep === 3 && "Profile"}
          </Text>
        </View>
        <View className="h-2 bg-gray-200 rounded-full overflow-hidden">
          <Animated.View
            style={{ width: progressWidth }}
            className="h-full bg-red-600 rounded-full"
          />
        </View>
      </View>
    );
  };

  const StepIndicator = () => (
    <View className="flex-row justify-center mb-8">
      {[1, 2, 3].map((step) => (
        <View key={step} className="flex-row items-center">
          <View
            className={`w-8 h-8 rounded-full items-center justify-center ${
              step === currentStep
                ? "bg-red-600"
                : step < currentStep
                  ? "bg-green-500"
                  : "bg-gray-300"
            }`}
          >
            {step < currentStep ? (
              <Feather name="check" size={16} color="#FFFFFF" />
            ) : (
              <Text
                className={`font-bold text-sm ${
                  step === currentStep ? "text-white" : "text-gray-600"
                }`}
              >
                {step}
              </Text>
            )}
          </View>
          {step < 3 && (
            <View
              className={`w-8 h-1 mx-1 ${
                step < currentStep ? "bg-green-500" : "bg-gray-300"
              }`}
            />
          )}
        </View>
      ))}
    </View>
  );

  return (
    <SafeAreaView className="flex-1 bg-white">
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
        keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps="handled"
        >
          <Animated.View
            style={{
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            }}
            className="flex-1"
          >
            {/* Header Section */}
            <View className="px-6 pt-8 pb-4">
              <TouchableOpacity
                onPress={() => navigation.goBack()}
                className="w-10 h-10 bg-gray-100 rounded-xl items-center justify-center mb-6"
              >
                <Feather name="arrow-left" size={20} color="#374151" />
              </TouchableOpacity>

              <View className="items-center mb-6">
                <ImageBackground
                  source={logo}
                  className="w-20 h-20 bg-red-600 rounded-2xl items-center justify-center mb-4 shadow-lg"
                />
                <Text className="text-3xl font-black text-gray-900 mb-2">
                  Join SugVoyage
                </Text>
                <Text className="text-gray-500 text-base text-center">
                  Start your Cebu adventure today
                </Text>
              </View>
            </View>

            {/* Progress Bar */}
            <ProgressBar />

            {/* Step Indicator */}
            <StepIndicator />

            {/* Registration Form */}
            <View className="px-6 flex-1">
              {/* Show context error if exists */}
              {error && (
                <View className="bg-red-50 border border-red-200 rounded-2xl p-4 mb-4">
                  <View className="flex-row items-center">
                    <Feather name="alert-triangle" size={16} color="#DC143C" />
                    <Text className="text-red-700 font-semibold text-sm ml-2">
                      {error}
                    </Text>
                  </View>
                </View>
              )}

              {/* Step 1: Account Basics */}
              {currentStep === 1 && (
                <View>
                  <Text className="text-xl font-bold text-gray-900 mb-6 text-center">
                    Create Your Account
                  </Text>

                  <InputField
                    label="Username"
                    name="username"
                    placeholder="Choose a username"
                    value={formData.username}
                    onChangeText={(value) =>
                      handleInputChange("username", value)
                    }
                    error={errors.username}
                    loading={loading}
                    showPasswordToggle={false}
                    secureTextEntry={false}
                    autoCapitalize="none"
                  />

                  <InputField
                    label="Email Address"
                    name="email"
                    placeholder="your@email.com"
                    value={formData.email}
                    onChangeText={(value) => handleInputChange("email", value)}
                    error={errors.email}
                    loading={loading}
                    showPasswordToggle={false}
                    secureTextEntry={false}
                    autoCapitalize="none"
                    keyboardType="email-address"
                  />
                </View>
              )}

              {/* Step 2: Security */}
              {currentStep === 2 && (
                <View>
                  <Text className="text-xl font-bold text-gray-900 mb-6 text-center">
                    Secure Your Account
                  </Text>

                  <InputField
                    label="Password"
                    name="password"
                    placeholder="Create a password"
                    value={formData.password}
                    onChangeText={(value) =>
                      handleInputChange("password", value)
                    }
                    error={errors.password}
                    loading={loading}
                    showPasswordToggle={true}
                    secureTextEntry={!showPassword}
                    autoCapitalize="none"
                    onTogglePassword={() => setShowPassword(!showPassword)}
                  />

                  <InputField
                    label="Confirm Password"
                    name="confirmPassword"
                    placeholder="Confirm your password"
                    value={formData.confirmPassword}
                    onChangeText={(value) =>
                      handleInputChange("confirmPassword", value)
                    }
                    error={errors.confirmPassword}
                    loading={loading}
                    showPasswordToggle={true}
                    secureTextEntry={!showConfirmPassword}
                    autoCapitalize="none"
                    onTogglePassword={() =>
                      setShowConfirmPassword(!showConfirmPassword)
                    }
                  />

                  <View className="bg-blue-50 rounded-2xl p-4 border border-blue-200 mt-2">
                    <Text className="text-blue-800 font-semibold text-sm mb-2">
                      Password Requirements:
                    </Text>
                    <Text className="text-blue-600 text-xs">
                      • At least 6 characters long
                    </Text>
                  </View>
                </View>
              )}

              {/* Step 3: Profile */}
              {currentStep === 3 && (
                <View>
                  <Text className="text-xl font-bold text-gray-900 mb-6 text-center">
                    Complete Your Profile
                  </Text>

                  <InputField
                    label="Display Name"
                    name="displayName"
                    placeholder="How should we call you?"
                    value={formData.displayName}
                    onChangeText={(value) =>
                      handleInputChange("displayName", value)
                    }
                    error={errors.displayName}
                    loading={loading}
                    showPasswordToggle={false}
                    secureTextEntry={false}
                    autoCapitalize="words"
                  />

                  <View className="bg-green-50 rounded-2xl p-4 border border-green-200 mt-2 mb-6">
                    <View className="flex-row items-center mb-2">
                      <Feather name="check-circle" size={16} color="#10B981" />
                      <Text className="text-green-800 font-semibold text-sm ml-2">
                        Almost there!
                      </Text>
                    </View>
                    <Text className="text-green-600 text-xs">
                      Review your information and complete registration to start
                      exploring Cebu
                    </Text>
                  </View>

                  {/* Review Summary */}
                  <View className="bg-gray-50 rounded-2xl p-4 border border-gray-200">
                    <Text className="text-gray-800 font-semibold mb-3">
                      Review Summary
                    </Text>
                    <View className="space-y-2">
                      <View className="flex-row justify-between">
                        <Text className="text-gray-600 text-sm">Username:</Text>
                        <Text className="text-gray-900 text-sm font-medium">
                          {formData.username}
                        </Text>
                      </View>
                      <View className="flex-row justify-between">
                        <Text className="text-gray-600 text-sm">Email:</Text>
                        <Text className="text-gray-900 text-sm font-medium">
                          {formData.email}
                        </Text>
                      </View>
                      <View className="flex-row justify-between">
                        <Text className="text-gray-600 text-sm">
                          Display Name:
                        </Text>
                        <Text className="text-gray-900 text-sm font-medium">
                          {formData.displayName}
                        </Text>
                      </View>
                    </View>
                  </View>
                </View>
              )}

              {/* Navigation Buttons */}
              <View className="flex-row justify-between mt-8 mb-6">
                {currentStep > 1 ? (
                  <TouchableOpacity
                    onPress={prevStep}
                    disabled={loading}
                    className="flex-1 bg-gray-100 rounded-2xl py-4 mr-2"
                  >
                    <Text className="text-gray-700 font-bold text-center text-base">
                      Back
                    </Text>
                  </TouchableOpacity>
                ) : (
                  <View className="flex-1 mr-2" />
                )}

                {currentStep < 3 ? (
                  <TouchableOpacity
                    onPress={nextStep}
                    disabled={loading}
                    className="flex-1 bg-red-600 rounded-2xl py-4 ml-2 shadow-lg"
                  >
                    <Text className="text-white font-bold text-center text-base">
                      Continue
                    </Text>
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity
                    onPress={handleRegister}
                    disabled={loading}
                    className={`flex-1 rounded-2xl py-4 ml-2 shadow-lg ${
                      loading ? "bg-red-400" : "bg-red-600"
                    }`}
                  >
                    <View className="flex-row items-center justify-center">
                      {loading ? (
                        <>
                          <Feather name="loader" size={20} color="#FFFFFF" />
                          <Text className="text-white font-bold text-base ml-2">
                            Creating Account...
                          </Text>
                        </>
                      ) : (
                        <>
                          <Feather name="user-plus" size={20} color="#FFFFFF" />
                          <Text className="text-white font-bold text-base ml-2">
                            Complete Registration
                          </Text>
                        </>
                      )}
                    </View>
                  </TouchableOpacity>
                )}
              </View>

              {/* Login Link */}
              <View className="flex-row justify-center items-center mb-8">
                <Text className="text-gray-600 text-sm">
                  Already have an account?{" "}
                </Text>
                <TouchableOpacity
                  onPress={() => navigation.navigate("Login")}
                  disabled={loading}
                >
                  <Text
                    className={`font-bold text-sm ${
                      loading ? "text-gray-400" : "text-red-600"
                    }`}
                  >
                    Sign In
                  </Text>
                </TouchableOpacity>
              </View>

              {/* Security Note */}
              <View className="bg-purple-50 rounded-2xl p-4 border border-purple-200">
                <View className="flex-row items-center mb-2">
                  <Feather name="shield" size={16} color="#8B5CF6" />
                  <Text className="text-purple-800 font-semibold text-sm ml-2">
                    Your Privacy Matters
                  </Text>
                </View>
                <Text className="text-purple-600 text-xs">
                  We protect your personal information and never share it
                  without your consent
                </Text>
              </View>
            </View>

            {/* Bottom Section */}
            <View className="items-center px-6 pb-8 pt-6">
              <View className="flex-row items-center mb-3">
                <Feather name="map-pin" size={14} color="#9CA3AF" />
                <Text className="text-gray-400 text-xs ml-2">
                  Discover Amazing Places in Cebu
                </Text>
              </View>
              <Text className="text-gray-400 text-xs text-center">
                Join thousands of travelers exploring Cebu's hidden gems 🗺️
              </Text>
            </View>
          </Animated.View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
