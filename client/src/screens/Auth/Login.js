import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
  Animated,
  Keyboard,
} from "react-native";
import React, { useState, useRef, useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useAuth } from "../../context/AuthenticationContext";

export default function Login() {
  const navigation = useNavigation();
  const { setUser } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [rememberMe, setRememberMe] = useState(false);

  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const shakeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
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

    setIsLoading(true);
    setUser(true);

    // Simulate API call with validation
    setTimeout(() => {
      setIsLoading(false);

      // Simple demo validation
      if (email.toLowerCase() === "traveler@demo.com" || email.includes("@")) {
        Alert.alert(
          "Welcome Back! 🌴",
          `You're all set, ${email.split("@")[0]}! Ready to explore Cebu?`,
          [
            {
              text: "Let's Go!",
            },
          ]
        );
      } else {
        shakeAnimation();
        Alert.alert(
          "Login Failed",
          "Invalid credentials. Please try again or use demo credentials.",
          [{ text: "OK" }]
        );
      }
    }, 1500);
  };

  const handleSocialLogin = (provider) => {
    Alert.alert(
      "Coming Soon!",
      `${provider} login will be available in the next update! 🚀`,
      [{ text: "Got it!" }]
    );
  };

  const handleForgotPassword = () => {
    Alert.alert(
      "Reset Password",
      "Enter your email to receive password reset instructions",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Send",
          onPress: () =>
            Alert.alert(
              "Success!",
              "Password reset link sent to your email 📧"
            ),
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
          >
            {/* Header Section */}
            <View className="px-6 pt-8 pb-6">
              <TouchableOpacity
                onPress={() => navigation.goBack()}
                className="w-10 h-10 bg-gray-100 rounded-xl items-center justify-center mb-6 active:bg-gray-200"
              >
                <Feather name="arrow-left" size={20} color="#374151" />
              </TouchableOpacity>

              <View className="items-center mb-8">
                <View className="w-20 h-20 bg-emerald-500 rounded-2xl items-center justify-center mb-4 shadow-lg">
                  <Feather name="map-pin" size={32} color="#FFFFFF" />
                </View>
                <Text className="text-3xl font-black text-gray-900 mb-2">
                  Welcome Back
                </Text>
                <Text className="text-gray-500 text-base text-center px-4">
                  Continue your Cebu adventure with SugVoyage 🌴
                </Text>
              </View>
            </View>

            {/* Login Form */}
            <Animated.View
              style={{ transform: [{ translateX: shakeAnim }] }}
              className="px-6 flex-1"
            >
              {/* Email Input */}
              <View className="mb-5">
                <Text className="text-gray-700 font-semibold mb-2 text-xs tracking-wide">
                  EMAIL ADDRESS
                </Text>
                <View
                  className={`flex-row items-center bg-gray-50 rounded-2xl px-4 py-4 ${
                    emailError
                      ? "border-2 border-red-400"
                      : "border border-gray-200"
                  }`}
                >
                  <Feather
                    name="mail"
                    size={20}
                    color={emailError ? "#EF4444" : "#9CA3AF"}
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
                    editable={!isLoading}
                  />
                  {email && (
                    <TouchableOpacity
                      onPress={() => {
                        setEmail("");
                        setEmailError("");
                      }}
                    >
                      <Feather name="x-circle" size={18} color="#9CA3AF" />
                    </TouchableOpacity>
                  )}
                </View>
                {emailError ? (
                  <View className="flex-row items-center mt-2 ml-1">
                    <Feather name="alert-circle" size={12} color="#EF4444" />
                    <Text className="text-red-500 text-xs ml-1">
                      {emailError}
                    </Text>
                  </View>
                ) : null}
              </View>

              {/* Password Input */}
              <View className="mb-4">
                <Text className="text-gray-700 font-semibold mb-2 text-xs tracking-wide">
                  PASSWORD
                </Text>
                <View
                  className={`flex-row items-center bg-gray-50 rounded-2xl px-4 py-4 ${
                    passwordError
                      ? "border-2 border-red-400"
                      : "border border-gray-200"
                  }`}
                >
                  <Feather
                    name="lock"
                    size={20}
                    color={passwordError ? "#EF4444" : "#9CA3AF"}
                  />
                  <TextInput
                    placeholder="Enter your password"
                    placeholderTextColor="#9CA3AF"
                    className="flex-1 ml-3 text-gray-900 text-base"
                    value={password}
                    onChangeText={validatePassword}
                    secureTextEntry={!showPassword}
                    autoCapitalize="none"
                    editable={!isLoading}
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
                {passwordError ? (
                  <View className="flex-row items-center mt-2 ml-1">
                    <Feather name="alert-circle" size={12} color="#EF4444" />
                    <Text className="text-red-500 text-xs ml-1">
                      {passwordError}
                    </Text>
                  </View>
                ) : null}
              </View>

              {/* Remember Me & Forgot Password */}
              <View className="flex-row justify-between items-center mb-6">
                <TouchableOpacity
                  onPress={() => setRememberMe(!rememberMe)}
                  className="flex-row items-center"
                >
                  <View
                    className={`w-5 h-5 rounded border-2 ${
                      rememberMe
                        ? "bg-emerald-500 border-emerald-500"
                        : "border-gray-300"
                    } items-center justify-center mr-2`}
                  >
                    {rememberMe && (
                      <Feather name="check" size={12} color="#FFFFFF" />
                    )}
                  </View>
                  <Text className="text-gray-600 text-sm">Remember me</Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={handleForgotPassword}>
                  <Text className="text-emerald-600 font-semibold text-sm">
                    Forgot Password?
                  </Text>
                </TouchableOpacity>
              </View>

              {/* Login Button */}
              <TouchableOpacity
                onPress={handleLogin}
                disabled={isLoading}
                className={`rounded-2xl py-4 mb-6 shadow-lg ${
                  isLoading ? "bg-emerald-400" : "bg-emerald-500"
                } active:bg-emerald-600`}
              >
                <View className="flex-row items-center justify-center">
                  {isLoading ? (
                    <>
                      <Feather name="loader" size={20} color="#FFFFFF" />
                      <Text className="text-white font-bold text-base ml-2">
                        Signing In...
                      </Text>
                    </>
                  ) : (
                    <>
                      <Feather name="log-in" size={20} color="#FFFFFF" />
                      <Text className="text-white font-bold text-base ml-2">
                        Continue Journey
                      </Text>
                    </>
                  )}
                </View>
              </TouchableOpacity>

              {/* Divider */}
              <View className="flex-row items-center mb-6">
                <View className="flex-1 h-px bg-gray-200" />
                <Text className="text-gray-400 text-xs mx-4 font-medium">
                  Or continue with
                </Text>
                <View className="flex-1 h-px bg-gray-200" />
              </View>

              {/* Social Login Buttons */}
              <View className="flex-row justify-between mb-8 gap-3">
                <TouchableOpacity
                  onPress={() => handleSocialLogin("Google")}
                  className="flex-1 bg-white border-2 border-gray-200 rounded-xl py-3.5 items-center shadow-sm active:bg-gray-50"
                >
                  <Image
                    source={{
                      uri: "https://cdn-icons-png.flaticon.com/512/2991/2991148.png",
                    }}
                    className="w-5 h-5"
                  />
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => handleSocialLogin("Facebook")}
                  className="flex-1 bg-blue-600 rounded-xl py-3.5 items-center shadow-sm active:bg-blue-700"
                >
                  <Feather name="facebook" size={20} color="#FFFFFF" />
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => handleSocialLogin("Apple")}
                  className="flex-1 bg-black rounded-xl py-3.5 items-center shadow-sm active:bg-gray-900"
                >
                  <Feather name="smartphone" size={20} color="#FFFFFF" />
                </TouchableOpacity>
              </View>

              {/* Sign Up Link */}
              <View className="flex-row justify-center items-center mb-6">
                <Text className="text-gray-600 text-sm">
                  New to SugVoyage?{" "}
                </Text>
                <TouchableOpacity onPress={() => navigation.navigate("SignUp")}>
                  <Text className="text-emerald-600 font-bold text-sm">
                    Create Account
                  </Text>
                </TouchableOpacity>
              </View>

              {/* Demo Credentials */}
              <View className="bg-gradient-to-r from-amber-50 to-orange-50 border-2 border-amber-200 rounded-2xl p-4 mb-8">
                <View className="flex-row items-center mb-3">
                  <View className="bg-amber-100 rounded-full p-1.5 mr-2">
                    <Feather name="info" size={14} color="#F59E0B" />
                  </View>
                  <Text className="text-amber-900 font-bold text-sm">
                    Demo Mode Available
                  </Text>
                </View>
                <View className="bg-white rounded-xl p-3 border border-amber-100">
                  <View className="flex-row items-center mb-2">
                    <Feather name="mail" size={12} color="#92400E" />
                    <Text className="text-amber-900 text-xs ml-2 font-medium">
                      traveler@demo.com
                    </Text>
                  </View>
                  <View className="flex-row items-center">
                    <Feather name="lock" size={12} color="#92400E" />
                    <Text className="text-amber-900 text-xs ml-2 font-medium">
                      any password works
                    </Text>
                  </View>
                </View>
              </View>
            </Animated.View>

            {/* Bottom Section */}
            <View className="items-center px-6 pb-8 pt-4">
              <View className="flex-row items-center mb-4">
                <Feather name="shield" size={14} color="#9CA3AF" />
                <Text className="text-gray-400 text-xs ml-2">
                  Your data is secure and encrypted
                </Text>
              </View>
              <Text className="text-gray-400 text-xs text-center px-8 leading-5">
                Discover hidden gems, explore pristine beaches, and create
                unforgettable memories in Cebu 🌊✨
              </Text>
            </View>
          </Animated.View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
