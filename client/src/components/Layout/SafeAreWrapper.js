// components/Layout/SafeAreaWrapper.js
import { SafeAreaView } from "react-native-safe-area-context";
import AIIcon from "../AIIcon";

export const SafeAreaWrapper = ({
  children,
  edges = ["top", "left", "right"], // Default for most screens
  className = "",
}) => {
  return (
    <SafeAreaView className={`flex-1 bg-white ${className}`} edges={edges}>
      {children}
      <AIIcon />
    </SafeAreaView>
  );
};

// Specialized versions
export const SafeAreaFull = ({ children, className }) => (
  <SafeAreaWrapper
    edges={["top", "bottom", "left", "right"]}
    className={className}
  >
    {children}
  </SafeAreaWrapper>
);

export const SafeAreaNoBottom = ({ children, className }) => (
  <SafeAreaWrapper edges={["top", "left", "right"]} className={className}>
    {children}
  </SafeAreaWrapper>
);

export const SafeAreaNoTop = ({ children, className }) => (
  <SafeAreaWrapper edges={["bottom", "left", "right"]} className={className}>
    {children}
  </SafeAreaWrapper>
);
