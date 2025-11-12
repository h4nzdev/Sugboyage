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
import React, { useState, useRef, useEffect, useContext } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import logo from "../../../assets/logo.png";
import { useAuth } from "../../context/AuthenticationContext";

export default function Login() {
  const navigation = useNavigation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const { login, loading, error, clearError } = useAuth();

  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const shakeAnim = useRef(new Animated.Value(0)).current;

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

  // Clear errors when inputs change
  useEffect(() => {
    if (email) setEmailError("");
    if (password) setPasswordError("");
    clearError();
  }, [email, password]);

  const validateEmail = (text) => {
    setEmail(text);
    setEmailError("");

    if (text.length > 0) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(text)) {
        setEmailError("Please enter a valid email address");
      }
    }
  };

  const validatePassword = (text) => {
    setPassword(text);
    setPasswordError("");

    if (text.length > 0 && text.length < 6) {
      setPasswordError("Password must be at least 6 characters");
    }
  };

  const shakeAnimation = () => {
    Animated.sequence([
      Animated.timing(shakeAnim, {
        toValue: 10,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(shakeAnim, {
        toValue: -10,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(shakeAnim, {
        toValue: 10,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(shakeAnim, {
        toValue: 0,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const handleLogin = async () => {
    Keyboard.dismiss();

    // Validate inputs
    let hasError = false;

    if (!email) {
      setEmailError("Email is required");
      hasError = true;
    } else if (emailError) {
      hasError = true;
    }

    if (!password) {
      setPasswordError("Password is required");
      hasError = true;
    } else if (passwordError) {
      hasError = true;
    }

    if (hasError) {
      shakeAnimation();
      return;
    }

    // Call the login function from AuthContext
    const result = await login({ email, password });

    if (result.success) {
      // Login successful - navigation will be handled by the app flow
      console.log("✅ Login successful, user:", result.user);
      // You can add navigation here if needed, or let the app flow handle it
      // navigation.navigate("Home");
    } else {
      // Login failed - error is already set in context
      console.log("❌ Login failed:", result.error);
      shakeAnimation();
    }
  };

  const handleSocialLogin = (provider) => {
    Alert.alert(
      "Coming Soon!",
      `${provider} login will be available soon! 🚀`,
      [{ text: "Got it!" }]
    );
  };

  const handleForgotPassword = () => {
    Alert.alert(
      "Reset Password",
      "We'll send reset instructions to your email",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Send",
          onPress: () =>
            Alert.alert("Check your email!", "Password reset link sent 📧"),
        },
      ]
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
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
            <View className="px-6 pt-8 pb-6">
              <TouchableOpacity
                onPress={() => navigation.goBack()}
                className="w-10 h-10 bg-gray-100 rounded-xl items-center justify-center mb-6"
              >
                <Feather name="arrow-left" size={20} color="#374151" />
              </TouchableOpacity>

              <View className="items-center mb-8">
                <ImageBackground
                  source={logo}
                  className="w-20 h-20 bg-red-600 rounded-2xl items-center justify-center mb-4 shadow-lg"
                />
                <Text className="text-3xl font-black text-gray-900 mb-2">
                  Welcome Back
                </Text>
                <Text className="text-gray-500 text-base text-center">
                  Continue your Cebu adventure
                </Text>
              </View>
            </View>

            {/* Login Form */}
            <Animated.View
              style={{ transform: [{ translateX: shakeAnim }] }}
              className="px-6 flex-1"
            >
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

              {/* Email Input */}
              <View className="mb-5">
                <Text className="text-gray-700 font-semibold mb-2 text-sm">
                  Email Address
                </Text>
                <View
                  className={`flex-row items-center bg-white rounded-2xl px-4 py-4 border-2 ${
                    emailError ? "border-red-400" : "border-gray-200"
                  }`}
                >
                  <Feather
                    name="mail"
                    size={20}
                    color={emailError ? "#DC143C" : "#9CA3AF"}
                  />
                  <TextInput
                    placeholder="your@email.com"
                    placeholderTextColor="#9CA3AF"
                    className="flex-1 ml-3 text-gray-900 text-base"
                    value={email}
                    onChangeText={validateEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoComplete="email"
                    editable={!loading}
                  />
                  {email && (
                    <TouchableOpacity
                      onPress={() => {
                        setEmail("");
                        setEmailError("");
                        clearError();
                      }}
                    >
                      <Feather name="x" size={18} color="#9CA3AF" />
                    </TouchableOpacity>
                  )}
                </View>
                {emailError && (
                  <Text className="text-red-500 text-xs mt-2 ml-1">
                    {emailError}
                  </Text>
                )}
              </View>

              {/* Password Input */}
              <View className="mb-6">
                <Text className="text-gray-700 font-semibold mb-2 text-sm">
                  Password
                </Text>
                <View
                  className={`flex-row items-center bg-white rounded-2xl px-4 py-4 border-2 ${
                    passwordError ? "border-red-400" : "border-gray-200"
                  }`}
                >
                  <Feather
                    name="lock"
                    size={20}
                    color={passwordError ? "#DC143C" : "#9CA3AF"}
                  />
                  <TextInput
                    placeholder="Enter your password"
                    placeholderTextColor="#9CA3AF"
                    className="flex-1 ml-3 text-gray-900 text-base"
                    value={password}
                    onChangeText={validatePassword}
                    secureTextEntry={!showPassword}
                    autoCapitalize="none"
                    editable={!loading}
                  />
                  <TouchableOpacity
                    onPress={() => setShowPassword(!showPassword)}
                  >
                    <Feather
                      name={showPassword ? "eye-off" : "eye"}
                      size={18}
                      color="#9CA3AF"
                    />
                  </TouchableOpacity>
                </View>
                {passwordError && (
                  <Text className="text-red-500 text-xs mt-2 ml-1">
                    {passwordError}
                  </Text>
                )}
              </View>

              {/* Forgot Password */}
              <TouchableOpacity
                onPress={handleForgotPassword}
                className="self-end mb-6"
                disabled={loading}
              >
                <Text
                  className={`font-semibold text-sm ${
                    loading ? "text-gray-400" : "text-red-600"
                  }`}
                >
                  Forgot Password?
                </Text>
              </TouchableOpacity>

              {/* Login Button */}
              <TouchableOpacity
                onPress={handleLogin}
                disabled={loading}
                className={`rounded-2xl py-4 mb-6 shadow-lg ${
                  loading ? "bg-red-400" : "bg-red-600"
                }`}
              >
                <View className="flex-row items-center justify-center">
                  {loading ? (
                    <>
                      <View className="items-center justify-center animate-spin">
                        <Feather name="loader" size={20} color="#FFFFFF" />
                      </View>
                      <Text className="text-white font-bold text-base ml-2">
                        Signing In...
                      </Text>
                    </>
                  ) : (
                    <>
                      <Feather name="map" size={20} color="#FFFFFF" />
                      <Text className="text-white font-bold text-base ml-2">
                        Explore Cebu
                      </Text>
                    </>
                  )}
                </View>
              </TouchableOpacity>

              {/* Divider */}
              <View className="flex-row items-center mb-6">
                <View className="flex-1 h-px bg-gray-200" />
                <Text className="text-gray-400 text-sm mx-4 font-medium">
                  Or continue with
                </Text>
                <View className="flex-1 h-px bg-gray-200" />
              </View>

              {/* Social Login Buttons */}
              <View className="flex-row justify-between mb-8 gap-3">
                <TouchableOpacity
                  onPress={() => handleSocialLogin("Google")}
                  disabled={loading}
                  className={`flex-1 border-2 rounded-xl py-3.5 items-center ${
                    loading
                      ? "bg-gray-100 border-gray-300"
                      : "bg-white border-gray-200"
                  }`}
                >
                  <Feather
                    name="chrome"
                    size={20}
                    color={loading ? "#9CA3AF" : "#374151"}
                  />
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => handleSocialLogin("Facebook")}
                  disabled={loading}
                  className={`flex-1 rounded-xl py-3.5 items-center ${
                    loading ? "bg-blue-400" : "bg-blue-600"
                  }`}
                >
                  <Feather name="facebook" size={20} color="#FFFFFF" />
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => handleSocialLogin("Apple")}
                  disabled={loading}
                  className="flex-1 bg-black rounded-xl py-3.5 items-center"
                >
                  <Feather name="smartphone" size={20} color="#FFFFFF" />
                </TouchableOpacity>
              </View>

              {/* Sign Up Link */}
              <View className="flex-row justify-center items-center mb-8">
                <Text className="text-gray-600 text-sm">New to Sugoyage? </Text>
                <TouchableOpacity
                  onPress={() => navigation.navigate("register")}
                  disabled={loading}
                >
                  <Text
                    className={`font-bold text-sm ${
                      loading ? "text-gray-400" : "text-red-600"
                    }`}
                  >
                    Create Account
                  </Text>
                </TouchableOpacity>
              </View>

              {/* Demo Hint */}
              <View className="bg-red-50 rounded-2xl p-4 border border-red-200">
                <View className="flex-row items-center mb-2">
                  <Feather name="info" size={16} color="#DC143C" />
                  <Text className="text-red-700 font-semibold text-sm ml-2">
                    Demo Access
                  </Text>
                </View>
                <Text className="text-red-600 text-xs">
                  Use any valid email format and password to login
                </Text>
              </View>
            </Animated.View>

            {/* Bottom Section */}
            <View className="items-center px-6 pb-8 pt-6">
              <View className="flex-row items-center mb-3">
                <Feather name="shield" size={14} color="#9CA3AF" />
                <Text className="text-gray-400 text-xs ml-2">
                  Secure & Encrypted
                </Text>
              </View>
              <Text className="text-gray-400 text-xs text-center">
                Your travel data is safe with us 🛡️
              </Text>
            </View>
          </Animated.View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
