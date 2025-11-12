// components/BoldText.js
import React from "react";
import { Text } from "react-native";
import { parseBoldText } from "../utils/formatUtils";

export const BoldText = ({ text, style, boldStyle, ...props }) => {
  const segments = parseBoldText(text);

  return (
    <Text style={[{ lineHeight: 20 }, style]} {...props}>
      {segments.map((segment, index) => (
        <Text
          key={index}
          style={[
            { lineHeight: 20 },
            segment.bold ? [boldStyle, { fontWeight: "700" }] : {},
          ]}
        >
          {segment.text}
        </Text>
      ))}
    </Text>
  );
};
