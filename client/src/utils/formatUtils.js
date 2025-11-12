// utils/formatUtils.js

/**
 * Format AI responses with basic markdown-like styling
 * Converts *text* to bold and handles basic formatting
 */
export const formatAIMessage = (text) => {
  if (!text) return "";

  let formattedText = text;

  // Convert code blocks with language specification
  formattedText = formattedText.replace(
    /```(\w+)?\n([\s\S]*?)```/g,
    (match, lang, code) => {
      const language = lang ? ` (${lang})` : "";
      return `\n━━━ CODE${language} ━━━\n${code.trim()}\n━━━━━━━━━━━━━━━\n`;
    }
  );

  // Convert inline code
  formattedText = formattedText.replace(/`([^`]+)`/g, '"$1"');

  // Convert headers (### Header -> Header)
  formattedText = formattedText.replace(/^#{1,6}\s+(.+)$/gm, "\n$1\n");

  // Convert bold text
  formattedText = formattedText.replace(/\*\*(.+?)\*\*/g, "$1");
  formattedText = formattedText.replace(/__(.+?)__/g, "$1");

  // Convert italic text
  formattedText = formattedText.replace(/\*(.+?)\*/g, "$1");
  formattedText = formattedText.replace(/_(.+?)_/g, "$1");

  // Convert numbered lists (1. item)
  formattedText = formattedText.replace(/^\d+\.\s+(.+)$/gm, "• $1");

  // Convert bullet points with * or -
  formattedText = formattedText.replace(/^[\*\-]\s+(.+)$/gm, "• $1");

  // Convert blockquotes (> quote)
  formattedText = formattedText.replace(/^>\s+(.+)$/gm, "│ $1");

  // Convert horizontal rules
  formattedText = formattedText.replace(
    /^(?:\*{3,}|-{3,}|_{3,})$/gm,
    "─────────────"
  );

  // Clean up excessive blank lines (more than 2 becomes 2)
  formattedText = formattedText.replace(/\n{3,}/g, "\n\n");

  // Trim whitespace from start and end
  formattedText = formattedText.trim();

  return formattedText;
};

/**
 * Extract bold segments from text for custom rendering
 */
export const parseBoldText = (text) => {
  const segments = [];
  let currentIndex = 0;
  const boldRegex = /\*\*(.*?)\*\*/g;

  let match;
  while ((match = boldRegex.exec(text)) !== null) {
    // Add text before the bold segment
    if (match.index > currentIndex) {
      segments.push({
        text: text.slice(currentIndex, match.index),
        bold: false,
      });
    }

    // Add the bold segment
    segments.push({
      text: match[1],
      bold: true,
    });

    currentIndex = match.index + match[0].length;
  }

  // Add remaining text
  if (currentIndex < text.length) {
    segments.push({
      text: text.slice(currentIndex),
      bold: false,
    });
  }

  return segments.length > 0 ? segments : [{ text, bold: false }];
};

/**
 * Clean and format AI response for better readability
 */
export const cleanAIResponse = (text) => {
  if (!text) return "";

  let cleaned = text;

  // Remove excessive line breaks but keep paragraph structure
  cleaned = cleaned.replace(/\n{3,}/g, "\n\n");

  // Ensure proper spacing after bullet points
  cleaned = cleaned.replace(/(•|\-)\s*/g, "• ");

  // Trim whitespace
  cleaned = cleaned.trim();

  return cleaned;
};

/**
 * Format travel-specific content (itineraries, budgets, etc.)
 */
export const formatTravelContent = (text) => {
  let formatted = text;

  // Format budget ranges
  formatted = formatted.replace(/₱\s*(\d+)[,\s]*(\d*)/g, "₱$1,$2");

  // Format time ranges
  formatted = formatted.replace(/(\d+)\s*-\s*(\d+)\s*(AM|PM)/g, "$1-$2$3");

  // Format durations
  formatted = formatted.replace(
    /(\d+)\s*-\s*(\d+)\s*(days|day|hours|hour|hrs|hr)/g,
    "$1-$2 $3"
  );

  return formatted;
};

/**
 * Main formatting function that applies all formatting rules
 */
export const formatChatResponse = (text) => {
  if (!text) return "";

  let formatted = text;

  // Apply all formatting steps
  formatted = formatAIMessage(formatted);
  formatted = cleanAIResponse(formatted);
  formatted = formatTravelContent(formatted);

  return formatted;
};
