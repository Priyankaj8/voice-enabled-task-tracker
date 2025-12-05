const chrono = require("chrono-node");

function parseTaskFromTranscript(transcript) {
  const text = transcript.toLowerCase();

  // --- PRIORITY DETECTION ---
  let priority = "Medium";

  if (
    text.includes("high priority") ||
    text.includes("urgent") ||
    text.includes("critical") ||
    text.includes("top priority")
  ) {
    priority = "High";
  } else if (
    text.includes("low priority") ||
    text.includes("less important") ||
    text.includes("low")
  ) {
    priority = "Low";
  } else if (
    text.includes("medium priority") ||
    text.includes("normal priority")
  ) {
    priority = "Medium";
  }

  // --- DATE DETECTION ---
  const date = chrono.parseDate(transcript);
  const dueDate = date ? date.toISOString() : null;

  // --- TITLE EXTRACTION (cleaned) ---
  let title = transcript
    .replace(/create|add|make|task|remember to|remind me to/gi, "")
    .replace(/high priority|low priority|medium priority|urgent|critical/gi, "")
    .replace(/tomorrow|today|next week|next month|by .*/gi, "")
    .trim();

  title = title.charAt(0).toUpperCase() + title.slice(1);

  return {
    title,
    priority,
    dueDate,
    description: "",
    status: "To Do",
  };
}

module.exports = { parseTaskFromTranscript };