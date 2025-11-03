// components/Layout/ScreenWrapper.js
import { ScrollView } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { SafeAreaWrapper } from "./SafeAreWrapper";

export function ScreenWrapper({
  children,
  showsVerticalScrollIndicator = false,
}) {
  const insets = useSafeAreaInsets();
  const navbarHeight = 70 + insets.bottom;

  return (
    <SafeAreaWrapper className="flex-1 bg-gray-50">
      <ScrollView
        showsVerticalScrollIndicator={showsVerticalScrollIndicator}
        className="flex-1"
        contentContainerStyle={{ paddingBottom: navbarHeight }}
      >
        {children}
      </ScrollView>
    </SafeAreaWrapper>
  );
}
