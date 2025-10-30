import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Image,
} from "react-native";
import React, { useState, useRef } from "react";
import { Feather } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";

export default function AIChatbot() {
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Kamusta! I'm your SugVoyage AI assistant! 🌴 Ready to explore Cebu like a local? I know all the hidden gems, best food spots, and secret routes!",
      sender: "ai",
      timestamp: new Date(),
      type: "text",
    },
  ]);
  const [inputText, setInputText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [showPhotoOptions, setShowPhotoOptions] = useState(false);
  const scrollViewRef = useRef();

  const quickQuestions = [
    "What's the best lechon in Cebu? 🐖",
    "Hidden beaches near the city? 🏖️",
    "3-day itinerary for first-timers 📅",
    "How to avoid tourist traps? 🚫",
    "Best time to visit waterfalls? 💦",
    "Local transportation tips 🚌",
    "Free activities in Cebu City 🆓",
    "Emergency contacts & safety 🆘",
  ];

  const photoRecognitionOptions = [
    { icon: "camera", label: "Take Photo", action: "camera" },
    { icon: "image", label: "Gallery", action: "gallery" },
    { icon: "map-pin", label: "Scan Landmark", action: "landmark" },
    { icon: "coffee", label: "Identify Food", action: "food" },
  ];

  const handleSend = () => {
    if (inputText.trim() === "") return;

    // Add user message
    const userMessage = {
      id: messages.length + 1,
      text: inputText,
      sender: "user",
      timestamp: new Date(),
      type: "text",
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputText("");
    setIsTyping(true);

    // Simulate AI response with local expertise
    setTimeout(() => {
      const aiResponses = [
        "For authentic lechon, head to CNT in Mandaue or Rico's in Lapu-Lapu! The skin should be crispy and the meat juicy. Best enjoyed with puso (hanging rice)! 🍚",

        "Here's a perfect 3-day Cebu adventure:\n\n📍Day 1: City Heritage\n• Magellan's Cross & Basilica\n• Fort San Pedro\n• Temple of Leah sunset\n• Larsian BBQ for dinner\n\n📍Day 2: Island Escape  \n• Early ferry to Bantayan\n• Sugar Beach swimming\n• Local seafood lunch\n• Star gazing at night\n\n📍Day 3: Waterfall Adventure\n• Kawasan Falls canyoneering\n• Local guide recommended\n• Try the bamboo raft ride\n• Back to city by evening\n\nWant me to customize this? 🤿",

        "Secret beaches near the city:\n\n🏝️ Bantayan Island - 4hrs north, worth the trip!\n🏝️ Malapascua - Amazing for diving\n🏝️ Camotes - Hidden paradise\n🏝️ Mactan resorts - Quick access\n\nPro tip: Take the earliest ferry to avoid crowds! ⛴️",

        "Local transportation guide:\n\n🚙 Grab - Most convenient\n🚌 Jeepneys - Authentic experience (₱8-15)\n🚕 Taxis - Use meter only\n🛵 Habal-habal - For adventurous routes\n🚢 Ferries - Book online in advance\n\nAlways agree on price before riding! 💰",

        "Must-try Cebuano foods:\n\n🍖 Lechon Cebu - World's best roasted pig\n🐟 Danggit - Crispy dried fish breakfast \n🥭 Dried Mangoes - Sweetest in the world\n🍚 Puso - Hanging rice\n🍲 Sutukil - Fresh seafood trio\n📍 Larsian BBQ for authentic experience! 🍽️",
      ];

      const randomResponse =
        aiResponses[Math.floor(Math.random() * aiResponses.length)];

      const aiMessage = {
        id: messages.length + 2,
        text: randomResponse,
        sender: "ai",
        timestamp: new Date(),
        type: "text",
      };

      setMessages((prev) => [...prev, aiMessage]);
      setIsTyping(false);
    }, 1200);
  };

  const handleQuickQuestion = (question) => {
    const userMessage = {
      id: messages.length + 1,
      text: question,
      sender: "user",
      timestamp: new Date(),
      type: "text",
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsTyping(true);

    // Special responses for specific questions
    setTimeout(() => {
      let response = "";

      if (question.includes("lechon")) {
        response =
          "Top lechon spots in Cebu:\n\n🥇 CNT Lechon - Mandaue (original recipe)\n🥈 Rico's Lechon - Lapu-Lapu (spicy option)\n🥉 House of Lechon - Cebu City (consistent quality)\n\nPro tip: Go before 12PM for the crispiest skin! They often sell out by afternoon. 🕛";
      } else if (question.includes("itinerary")) {
        response =
          "I'd recommend:\n\n🌅 Day 1: City Culture & Food\n• Magellan's Cross & Basilica\n• Fort San Pedro \n• Carbon Market experience\n• Temple of Leah for sunset\n• Dinner at Larsian BBQ\n\n🏝️ Day 2: Island Adventure  \n• Early ferry to Bantayan\n• Beach hopping & snorkeling\n• Fresh seafood lunch\n• Virgin Island sandbar\n\n💦 Day 3: Nature & Adventure\n• Kawasan Falls canyoneering\n• Local guide for safety\n• Bamboo raft experience\n• Back to city by evening\n\nWant me to adjust based on your interests? 🗺️";
      } else if (question.includes("hidden")) {
        response =
          "Local secrets! 🤫\n\n🏞️ Sirao Flower Farm - Little Amsterdam of Cebu\n⛰️ Top of Cebu - Panoramic mountain views\n🏛️ Casa Gorordo - Heritage museum\n🌊 Molave Cove - Cliff diving spot\n🛕 Taoist Temple - Peaceful gardens\n\nThese are less crowded and absolutely magical! ✨";
      } else {
        response =
          "Great question! Based on local knowledge, I recommend visiting waterfalls in the morning (7-10AM) to avoid crowds and get the best light for photos. Beaches are perfect from 3-5PM for that golden hour glow! Local guides are available at most spots - they know the safest routes and hidden viewpoints. 🗿";
      }

      const aiMessage = {
        id: messages.length + 2,
        text: response,
        sender: "ai",
        timestamp: new Date(),
        type: "text",
      };

      setMessages((prev) => [...prev, aiMessage]);
      setIsTyping(false);
    }, 1000);
  };

  const handlePhotoAction = (action) => {
    setShowPhotoOptions(false);

    const userMessage = {
      id: messages.length + 1,
      text: `[${action === "camera" ? "Taking photo..." : action === "gallery" ? "Selecting from gallery..." : action === "landmark" ? "Scanning landmark..." : "Identifying food..."}]`,
      sender: "user",
      timestamp: new Date(),
      type: "action",
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsTyping(true);

    // Simulate photo recognition
    setTimeout(() => {
      const recognitionResults = {
        camera:
          "📸 Photo received! I can see you're at a beautiful location. This looks like the Cebu Taoist Temple area! Would you like directions or nearby recommendations?",
        gallery:
          "🖼️ Analyzing your photo... This appears to be Magellan's Cross! Historical fact: This marks the spot where Ferdinand Magellan planted the cross in 1521. Want to know more about its history?",
        landmark:
          "🏛️ Landmark detected! This is the Temple of Leah - often called the 'Taj Mahal of Cebu'. It's open daily from 6AM-6PM. Entrance fee is ₱100. Best time to visit is during sunset! 🌅",
        food: "🍽️ Food scan complete! This looks like authentic Cebu lechon! The crispy skin and golden color suggest it's from either CNT or Rico's. Perfect with puso (hanging rice) and toyomansi dip! 🐖",
      };

      const aiMessage = {
        id: messages.length + 2,
        text: recognitionResults[action],
        sender: "ai",
        timestamp: new Date(),
        type: "text",
      };

      setMessages((prev) => [...prev, aiMessage]);
      setIsTyping(false);
    }, 2000);
  };

  const formatTime = (date) => {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      {/* Header */}
      <View className="bg-white pt-4 pb-4 px-5 border-b border-gray-200 shadow-sm z-40">
        <View className="flex-row justify-between items-center">
          <View className="flex-row items-center">
            <View className="w-12 h-12 bg-emerald-500 rounded-2xl items-center justify-center mr-3 shadow-lg">
              <Feather name="navigation" size={24} color="#FFFFFF" />
            </View>
            <View>
              <Text className="text-xl font-black text-gray-900">
                Cebu Travel AI
              </Text>
              <Text className="text-emerald-600 text-sm font-medium">
                Your Local Guide 🤙
              </Text>
            </View>
          </View>
          <TouchableOpacity className="bg-gray-100 p-2 rounded-xl">
            <Feather name="more-horizontal" size={20} color="#374151" />
          </TouchableOpacity>
        </View>
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
        {/* Chat Messages */}
        <ScrollView
          ref={scrollViewRef}
          onContentSizeChange={() =>
            scrollViewRef.current?.scrollToEnd({ animated: true })
          }
          className="flex-1 px-4 py-4"
          showsVerticalScrollIndicator={false}
        >
          {/* Welcome Card */}
          <View className="bg-emerald-500 rounded-2xl p-5 mb-4 shadow-lg">
            <View className="flex-row items-start">
              <View className="bg-white p-3 rounded-2xl mr-3">
                <Feather name="map" size={20} color="#059669" />
              </View>
              <View className="flex-1">
                <Text className="text-white font-black text-lg mb-1">
                  Kamusta, Explorer! 🇵🇭
                </Text>
                <Text className="text-emerald-100 text-sm">
                  I'm your local Cebu AI guide! I can: • Plan your itinerary 📅
                  • Find hidden gems 💎 • Identify places from photos 📸 • Share
                  local secrets 🤫 • Emergency assistance 🆘
                </Text>
              </View>
            </View>
          </View>

          {/* Quick Questions */}
          <View className="mb-6">
            <Text className="text-gray-900 font-black text-base mb-3">
              Quick Local Questions:
            </Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ gap: 12 }}
            >
              {quickQuestions.map((question, index) => (
                <TouchableOpacity
                  key={index}
                  onPress={() => handleQuickQuestion(question)}
                  className="bg-white border border-emerald-200 px-4 py-3 rounded-2xl shadow-sm"
                >
                  <Text className="text-gray-800 text-sm font-medium text-center">
                    {question}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          {/* Messages */}
          {messages.map((message) => (
            <View
              key={message.id}
              className={`flex-row mb-4 ${
                message.sender === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <View
                className={`max-w-[85%] rounded-2xl p-4 ${
                  message.sender === "user"
                    ? "bg-emerald-500 rounded-br-none shadow-lg"
                    : "bg-gray-100 rounded-bl-none border border-gray-200"
                }`}
              >
                {message.type === "action" ? (
                  <View className="flex-row items-center">
                    <Feather name="camera" size={16} color="#6B7280" />
                    <Text className="text-gray-600 text-sm ml-2 italic">
                      {message.text}
                    </Text>
                  </View>
                ) : (
                  <>
                    <Text
                      className={
                        message.sender === "user"
                          ? "text-white text-sm leading-5"
                          : "text-gray-800 text-sm leading-5"
                      }
                    >
                      {message.text}
                    </Text>
                    <Text
                      className={`text-xs mt-2 ${
                        message.sender === "user"
                          ? "text-emerald-100"
                          : "text-gray-500"
                      }`}
                    >
                      {formatTime(message.timestamp)}
                    </Text>
                  </>
                )}
              </View>
            </View>
          ))}

          {/* Typing Indicator */}
          {isTyping && (
            <View className="flex-row mb-4 justify-start">
              <View className="bg-gray-100 rounded-2xl rounded-bl-none p-4 border border-gray-200">
                <View className="flex-row items-center">
                  <Text className="text-gray-600 text-sm mr-2">
                    Local AI is typing
                  </Text>
                  <View className="flex-row space-x-1">
                    <View className="w-1.5 h-1.5 bg-gray-500 rounded-full animate-bounce" />
                    <View
                      className="w-1.5 h-1.5 bg-gray-500 rounded-full animate-bounce"
                      style={{ animationDelay: "0.1s" }}
                    />
                    <View
                      className="w-1.5 h-1.5 bg-gray-500 rounded-full animate-bounce"
                      style={{ animationDelay: "0.2s" }}
                    />
                  </View>
                </View>
              </View>
            </View>
          )}
        </ScrollView>

        {/* Photo Recognition Modal */}
        {showPhotoOptions && (
          <View className="absolute inset-0 bg-black/50 justify-end z-50">
            <View className="bg-white rounded-t-3xl p-6">
              <View className="flex-row justify-between items-center mb-4">
                <Text className="text-lg font-black text-gray-900">
                  Photo Recognition
                </Text>
                <TouchableOpacity onPress={() => setShowPhotoOptions(false)}>
                  <Feather name="x" size={24} color="#374151" />
                </TouchableOpacity>
              </View>
              <Text className="text-gray-600 text-sm mb-4">
                Use AI to identify landmarks, food, or get information about
                places from photos
              </Text>
              <View className="flex-row flex-wrap justify-between">
                {photoRecognitionOptions.map((option, index) => (
                  <TouchableOpacity
                    key={index}
                    onPress={() => handlePhotoAction(option.action)}
                    className="w-[48%] bg-emerald-50 rounded-2xl p-4 mb-3 items-center border border-emerald-200"
                  >
                    <View className="w-12 h-12 bg-emerald-500 rounded-xl items-center justify-center mb-2">
                      <Feather name={option.icon} size={20} color="#FFFFFF" />
                    </View>
                    <Text className="text-emerald-700 text-sm font-semibold text-center">
                      {option.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </View>
        )}

        {/* Input Area */}
        <View className="bg-white border-t border-gray-200 px-4 py-4">
          <View className="flex-row items-center">
            <TouchableOpacity
              onPress={() => setShowPhotoOptions(true)}
              className="w-12 h-12 bg-emerald-100 rounded-xl items-center justify-center mr-3 border border-emerald-200"
            >
              <Feather name="camera" size={20} color="#059669" />
            </TouchableOpacity>

            <TextInput
              placeholder="Ask about Cebu travel, food, or take a photo..."
              className="flex-1 bg-gray-100 rounded-xl px-4 py-3 text-gray-800 mr-3 border border-gray-300"
              value={inputText}
              onChangeText={setInputText}
              multiline
              maxLength={500}
              placeholderTextColor="#6B7280"
            />

            <TouchableOpacity
              onPress={handleSend}
              disabled={inputText.trim() === ""}
              className={`w-12 h-12 rounded-xl items-center justify-center ${
                inputText.trim() === "" ? "bg-gray-400" : "bg-emerald-500"
              }`}
            >
              <Feather name="send" size={20} color="#FFFFFF" />
            </TouchableOpacity>
          </View>

          {/* Quick Actions */}
          <View className="flex-row justify-between mt-3">
            <TouchableOpacity className="flex-row items-center bg-gray-100 px-3 py-2 rounded-lg">
              <Feather name="map" size={16} color="#4B5563" />
              <Text className="text-gray-700 text-sm ml-2 font-medium">
                Near Me
              </Text>
            </TouchableOpacity>
            <TouchableOpacity className="flex-row items-center bg-gray-100 px-3 py-2 rounded-lg">
              <Feather name="shield" size={16} color="#4B5563" />
              <Text className="text-gray-700 text-sm ml-2 font-medium">
                Safety
              </Text>
            </TouchableOpacity>
            <TouchableOpacity className="flex-row items-center bg-gray-100 px-3 py-2 rounded-lg">
              <Feather name="dollar-sign" size={16} color="#4B5563" />
              <Text className="text-gray-700 text-sm ml-2 font-medium">
                Budget
              </Text>
            </TouchableOpacity>
            <TouchableOpacity className="flex-row items-center bg-gray-100 px-3 py-2 rounded-lg">
              <Feather name="heart" size={16} color="#4B5563" />
              <Text className="text-gray-700 text-sm ml-2 font-medium">
                Saved
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
