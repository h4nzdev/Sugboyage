import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
  Alert,
} from "react-native";
import React, { useState, useRef, useEffect } from "react";
import { Feather } from "@expo/vector-icons";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ChatService } from "../../../services/ai_services/chatService";
import { formatAIMessage } from "../../../utils/formatUtils";
import { BoldText } from "../../../components/BoldText";
import { TripPlanService } from "../../../services/tripPlanService";
import { useAuth } from "../../../context/AuthenticationContext";
import TripPreviewModal from "./TripPreview";

// Colors configuration
const colors = {
  primary: "#DC143C",
  secondary: "#FFF8DC",
  background: "#FFFFFF",
  text: "#2D3748",
  muted: "#718096",
  light: "#F7FAFC",
};

// Quick Actions Component
const QuickActions = ({ onActionPress, isVisible }) => {
  const quickActions = [
    {
      id: "weekend",
      icon: "calendar",
      title: "Weekend Trip",
      subtitle: "2-3 days",
      prompt: "Plan a weekend trip in Cebu for 2-3 days",
    },
    {
      id: "cultural",
      icon: "book",
      title: "Cultural Tour",
      subtitle: "Heritage & History",
      prompt: "Create a cultural heritage itinerary in Cebu",
    },
    {
      id: "adventure",
      icon: "compass",
      title: "Adventure",
      subtitle: "Thrilling activities",
      prompt: "Adventure activities itinerary in Cebu",
    },
    {
      id: "beach",
      icon: "sun",
      title: "Beach Holiday",
      subtitle: "Relaxation focus",
      prompt: "Beach and relaxation itinerary in Cebu",
    },
  ];

  if (!isVisible) return null;

  return (
    <View className="mt-6 mb-4">
      <Text className="text-lg font-bold text-gray-900 text-center mb-4">
        Quick Start Templates
      </Text>
      <View className="flex-row flex-wrap justify-between">
        {quickActions.map((action) => (
          <TouchableOpacity
            key={action.id}
            onPress={() => onActionPress(action)}
            className="w-[48%] mb-3"
          >
            <View className="bg-white rounded-2xl p-4 border border-gray-200 shadow-sm">
              <View className="w-10 h-10 bg-red-50 rounded-xl items-center justify-center mb-2">
                <Feather name={action.icon} size={18} color={colors.primary} />
              </View>
              <Text className="font-semibold text-gray-900 text-sm mb-1">
                {action.title}
              </Text>
              <Text className="text-gray-500 text-xs">{action.subtitle}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

// Trip Templates Component
const TripTemplates = ({ onTemplateSelect, isVisible }) => {
  const tripTemplates = [
    "3-day cultural experience in Cebu",
    "Weekend beach getaway in Cebu",
    "5-day adventure tour in Cebu",
    "Family friendly plan in Cebu",
    "Budget travel plan in Cebu",
    "Luxury experience in Cebu",
  ];

  if (!isVisible) return null;

  return (
    <View className="mt-4">
      <Text className="text-lg font-bold text-gray-900 text-center mb-3">
        Popular Trip Styles
      </Text>
      <View className="flex-row flex-wrap justify-between">
        {tripTemplates.map((template, index) => (
          <TouchableOpacity
            key={index}
            onPress={() => onTemplateSelect(template)}
            className="bg-white p-3 rounded-xl border border-gray-200 shadow-sm mb-2"
            style={{ width: "48%" }}
          >
            <Text className="text-gray-800 text-sm text-center font-medium">
              {template}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

// Message List Component
// Message List Component - FIX THIS PART
// Updated MessageList component
const MessageList = ({ messages, isTyping, onSaveTrip, savingTrip }) => {
  const [previewModalVisible, setPreviewModalVisible] = useState(false);
  const [selectedTripData, setSelectedTripData] = useState(null);

  const formatTime = (date) => {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  const handlePreviewTrip = (tripData) => {
    setSelectedTripData(tripData);
    setPreviewModalVisible(true);
  };

  const handleSaveTrip = (tripData) => {
    setPreviewModalVisible(false);
    onSaveTrip(tripData);
  };

  return (
    <>
      {messages.map((message) => (
        <View
          key={message.id}
          className={`flex-row mb-4 ${
            message.sender === "user" ? "justify-end" : "justify-start"
          }`}
        >
          <View
            className={`max-w-[85%] rounded-2xl px-4 py-3 ${
              message.sender === "user"
                ? "bg-red-600 rounded-br-md"
                : "bg-white rounded-bl-md border border-gray-200"
            } shadow-sm`}
          >
            {/* Message Text */}
            {message.sender === "ai" ? (
              <BoldText
                text={message.text}
                style={{
                  fontSize: 14,
                  lineHeight: 20,
                  color: "#1F2937",
                  textAlign: "left",
                }}
                boldStyle={{
                  color: "#DC2626",
                  fontWeight: "700",
                }}
              />
            ) : (
              <Text
                className="text-white text-sm leading-5 text-start"
                style={{ lineHeight: 20 }}
              >
                {message.text}
              </Text>
            )}

            {/* 🎯 PREVIEW BUTTON FOR TRIP PLANS */}
            {message.sender === "ai" && message.tripData && (
              <View className="mt-3">
                <TouchableOpacity
                  onPress={() => handlePreviewTrip(message.tripData)}
                  className="bg-red-600 py-3 rounded-xl"
                >
                  <View className="flex-row items-center justify-center">
                    <Feather name="eye" size={16} color="white" />
                    <Text className="text-white font-semibold text-base ml-2">
                      Preview Trip Plan
                    </Text>
                  </View>
                </TouchableOpacity>

                {/* Quick Save Option */}
                <TouchableOpacity
                  onPress={() => handleSaveTrip(message.tripData)}
                  disabled={savingTrip}
                  className={`py-2 rounded-xl mt-2 ${
                    savingTrip ? "bg-gray-300" : "bg-green-500"
                  }`}
                >
                  <Text className="text-white py-2 text-center text-sm font-medium">
                    {savingTrip ? "💾 Saving..." : "💾 Save Without Preview"}
                  </Text>
                </TouchableOpacity>
              </View>
            )}

            {/* Timestamp */}
            <Text
              className={`text-xs mt-2 ${
                message.sender === "user" ? "text-red-200" : "text-gray-500"
              }`}
            >
              {formatTime(message.timestamp)}
            </Text>
          </View>
        </View>
      ))}

      {isTyping && <TypingIndicator />}

      {/* Trip Preview Modal */}
      <TripPreviewModal
        visible={previewModalVisible}
        onClose={() => setPreviewModalVisible(false)}
        tripData={selectedTripData}
        onSave={handleSaveTrip}
        loading={savingTrip}
      />
    </>
  );
};

// Typing Indicator Component
const TypingIndicator = () => (
  <View className="flex-row mb-4 justify-start">
    <View className="bg-white rounded-2xl rounded-bl-md px-4 py-3 border border-gray-200 shadow-sm">
      <View className="flex-row items-center gap-2">
        <View className="flex-row gap-1">
          <View className="w-2 h-2 bg-red-600 rounded-full animate-pulse" />
          <View className="w-2 h-2 bg-red-600 rounded-full animate-pulse" />
          <View className="w-2 h-2 bg-red-600 rounded-full animate-pulse" />
        </View>
        <Text className="text-gray-600 text-sm">
          AI is planning your trip...
        </Text>
      </View>
    </View>
  </View>
);

// Input Area Component
const InputArea = ({
  inputText,
  onInputChange,
  onSend,
  isTyping,
  keyboardVisible,
}) => {
  const insets = useSafeAreaInsets();

  return (
    <View
      className="bg-white border-t border-gray-200 px-4 py-4"
      style={{
        paddingBottom: insets.bottom + 10,
      }}
    >
      <View className="flex-row items-center bg-white rounded-2xl px-4 py-3 border border-gray-300">
        <TextInput
          placeholder="Ask about Cebu trips, budgets, itineraries..."
          className="flex-1 text-sm mr-3"
          style={{ color: colors.text }}
          value={inputText}
          onChangeText={onInputChange}
          multiline
          maxLength={500}
          placeholderTextColor={colors.muted}
          onSubmitEditing={onSend}
        />

        <TouchableOpacity
          onPress={onSend}
          disabled={inputText.trim() === "" || isTyping}
          className={`w-10 h-10 rounded-xl items-center justify-center ${
            inputText.trim() === "" || isTyping ? "bg-gray-300" : "bg-red-600"
          }`}
        >
          <Feather name="send" size={16} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      {!keyboardVisible && (
        <Text className="text-center text-gray-500 text-xs mt-2">
          Try: "3 days beach trip for 2 people, budget ₱5,000" or "Weekend
          cultural tour"
        </Text>
      )}
    </View>
  );
};

// Header Component
const Header = ({ onBack, onReset }) => (
  <View className="bg-white pt-4 pb-4 px-5 border-b border-gray-200">
    <View className="flex-row items-center justify-between">
      <View className="flex-row items-center">
        <TouchableOpacity
          onPress={onBack}
          className="p-2 mr-3 bg-gray-100 rounded-xl"
        >
          <Feather name="arrow-left" size={20} color={colors.text} />
        </TouchableOpacity>
        <View>
          <Text className="text-2xl font-bold text-gray-900">
            AI Trip Planner
          </Text>
          <Text className="text-red-600 text-sm font-medium">
            Powered by Gemini AI
          </Text>
        </View>
      </View>
      <TouchableOpacity
        onPress={onReset}
        className="p-2 bg-gray-100 rounded-xl"
      >
        <Feather name="refresh-cw" size={18} color={colors.text} />
      </TouchableOpacity>
    </View>
  </View>
);

// Main AIPlanner Component
export default function AIPlanner() {
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "🤖 Hi! I'm your AI Travel Planner. I can create personalized Cebu itineraries with optimized routes and travel times. What kind of trip are you planning?",
      sender: "ai",
      timestamp: new Date(),
    },
  ]);
  const [inputText, setInputText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [keyboardVisible, setKeyboardVisible] = useState(false);
  const scrollViewRef = useRef();
  const navigation = useNavigation();
  const [savingTrip, setSavingTrip] = useState(false);
  const { user } = useAuth();

  // Load messages from AsyncStorage on component mount
  useEffect(() => {
    loadMessages();
  }, []);

  // Save messages to AsyncStorage whenever messages change
  useEffect(() => {
    saveMessages();
  }, [messages]);

  // Keyboard listeners
  useEffect(() => {
    const showSubscription = Keyboard.addListener("keyboardDidShow", () => {
      setKeyboardVisible(true);
    });
    const hideSubscription = Keyboard.addListener("keyboardDidHide", () => {
      setKeyboardVisible(false);
    });

    return () => {
      showSubscription.remove();
      hideSubscription.remove();
    };
  }, []);

  // AsyncStorage functions
  const loadMessages = async () => {
    try {
      const savedMessages = await AsyncStorage.getItem("ai_chat_messages");
      if (savedMessages) {
        const parsedMessages = JSON.parse(savedMessages);
        // Convert timestamp strings back to Date objects
        const messagesWithDates = parsedMessages.map((msg) => ({
          ...msg,
          timestamp: new Date(msg.timestamp),
        }));
        setMessages(messagesWithDates);
      }
    } catch (error) {
      console.log("❌ Error loading messages:", error);
    }
  };

  const saveMessages = async () => {
    try {
      await AsyncStorage.setItem("ai_chat_messages", JSON.stringify(messages));
    } catch (error) {
      console.log("❌ Error saving messages:", error);
    }
  };

  const clearChatHistory = async () => {
    try {
      await AsyncStorage.removeItem("ai_chat_messages");
      setMessages([messages[0]]); // Keep only the first message
    } catch (error) {
      console.log("❌ Error clearing chat history:", error);
    }
  };

  // Message handling functions
  // In AIPlanner - Update handleSend function
  const handleSend = async () => {
    if (inputText.trim() === "") return;

    const userMessage = {
      id: Date.now(),
      text: inputText,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputText("");
    setIsTyping(true);
    Keyboard.dismiss();

    try {
      const response = await ChatService.sendMessage(inputText);

      if (response.success) {
        // 🎯 CHECK IF IT'S A TRIP PLAN OR NORMAL CHAT
        if (response.type === "trip_plan") {
          // STRUCTURED TRIP PLAN - Show with save button!
          const aiMessage = {
            id: Date.now() + 1,
            text: response.message, // Friendly message
            sender: "ai",
            timestamp: new Date(),
            tripData: response.data, // 🎯 STRUCTURED DATA
            showSaveButton: true, // 🎯 SHOW SAVE BUTTON!
          };
          setMessages((prev) => [...prev, aiMessage]);
        } else {
          // NORMAL CHAT RESPONSE
          const aiMessage = {
            id: Date.now() + 1,
            text: formatAIMessage(response.message),
            sender: "ai",
            timestamp: new Date(),
          };
          setMessages((prev) => [...prev, aiMessage]);
        }
      } else {
        handleFallbackResponse("AI service might be offline.");
      }
    } catch (error) {
      console.error("❌ AI Error:", error);
      handleFallbackResponse("Failed to connect to AI service");
    } finally {
      setIsTyping(false);
    }
  };

  const handleSaveTrip = async (tripData) => {
    setSavingTrip(true);

    try {
      console.log("💾 Saving trip to database...", tripData);

      // Add user ID and other required fields
      const tripToSave = {
        ...tripData,
        user: user.id, // From your auth context
        generatedByAI: true,
        status: "planned",
        travelers: {
          adults: 1,
          children: 0,
        },
      };

      const result = await TripPlanService.saveTripPlan(tripToSave);

      if (result.success) {
        Alert.alert("🎉 Success!", "Your trip has been saved to Travel Hub!");

        // Remove save button after successful save
        setMessages((prev) =>
          prev.map((msg) =>
            msg.tripData ? { ...msg, showSaveButton: false } : msg
          )
        );
      } else {
        Alert.alert("❌ Error", result.message || "Failed to save trip");
      }
    } catch (error) {
      console.error("❌ Save trip error:", error);
      Alert.alert("❌ Error", "Failed to save trip to database");
    } finally {
      setSavingTrip(false);
    }
  };

  const handleQuickAction = async (action) => {
    const userMessage = {
      id: Date.now(),
      text: action.prompt,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsTyping(true);
    Keyboard.dismiss();

    try {
      const response = await ChatService.sendMessage(action.prompt);

      if (response.success) {
        const aiMessage = {
          id: Date.now() + 1,
          text: formatAIMessage(response.reply),
          sender: "ai",
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, aiMessage]);
      } else {
        handleTemplateFallback(action.title);
      }
    } catch (error) {
      console.error("❌ Quick action error:", error);
      handleTemplateFallback(action.title);
    } finally {
      setIsTyping(false);
    }
  };

  const handleTemplateSelect = async (template) => {
    const userMessage = {
      id: Date.now(),
      text: `Plan a ${template}`,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsTyping(true);
    Keyboard.dismiss();

    try {
      const response = await ChatService.sendMessage(`Plan a ${template}`);

      if (response.success) {
        const aiMessage = {
          id: Date.now() + 1,
          text: formatAIMessage(response.reply),
          sender: "ai",
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, aiMessage]);
      } else {
        handleTemplateFallback(template);
      }
    } catch (error) {
      console.error("❌ Template error:", error);
      handleTemplateFallback(template);
    } finally {
      setIsTyping(false);
    }
  };

  const handleFallbackResponse = (message) => {
    const fallbackMessage = {
      id: Date.now() + 1,
      text: "I'm having trouble connecting right now. Here's a sample Cebu itinerary:\n\n3-Day Cebu Adventure\n• Day 1: City Tour - Magellan's Cross, Fort San Pedro\n• Day 2: South Cebu - Kawasan Falls, Moalboal\n• Day 3: Island Hopping - Hilutungan, Nalusuan\n\nTry again in a moment!",
      sender: "ai",
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, fallbackMessage]);
    Alert.alert("Connection Issue", message);
  };

  const handleTemplateFallback = (title) => {
    const fallbackMessage = {
      id: Date.now() + 1,
      text: `🎉 Creating your ${title}...\n\nTell me more:\n• Budget range?\n• Travel dates?\n• Special interests?\n• Number of people?`,
      sender: "ai",
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, fallbackMessage]);
  };

  const showTemplates = messages.length <= 2 && !keyboardVisible && !isTyping;

  return (
    <SafeAreaView className="flex-1 bg-white">
      <Header onBack={() => navigation.goBack()} onReset={clearChatHistory} />

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
        keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
      >
        <View className="flex-1">
          <ScrollView
            ref={scrollViewRef}
            onContentSizeChange={() => {
              scrollViewRef.current?.scrollToEnd({ animated: true });
            }}
            className="flex-1 px-4 py-4"
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 10 }}
          >
            <MessageList
              messages={messages}
              isTyping={isTyping}
              onSaveTrip={handleSaveTrip}
              savingTrip={savingTrip}
            />

            <QuickActions
              onActionPress={handleQuickAction}
              isVisible={showTemplates}
            />

            <TripTemplates
              onTemplateSelect={handleTemplateSelect}
              isVisible={showTemplates}
            />
          </ScrollView>

          <InputArea
            inputText={inputText}
            onInputChange={setInputText}
            onSend={handleSend}
            isTyping={isTyping}
            keyboardVisible={keyboardVisible}
          />
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
