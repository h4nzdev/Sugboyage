import { View, TouchableOpacity, Image } from "react-native";
import React from "react";
import ai from "../../assets/ai_icons/ai-icon.png";
import { useNavigation } from "@react-navigation/native";

export default function AIIcon() {
  const navigation = useNavigation();

  return (
    <View className="absolute bottom-28 right-5 z-50">
      <TouchableOpacity
        onPress={() => navigation.navigate("ai")}
        className="w-16 h-16 border-2 border-red-300 rounded-full items-center justify-center"
      >
        <Image source={ai} className="w-16 h-16" resizeMode="contain" />
      </TouchableOpacity>
    </View>
  );
}
