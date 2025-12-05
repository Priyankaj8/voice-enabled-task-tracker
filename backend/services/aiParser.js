const chrono = require("chrono-node");

function parseTaskFromTranscript(transcript) {
  // Lowercase for easier parsing
  const text = transcript.toLowerCase();

  // Extract priority
  let priority = "Medium";
  if (text.includes("high priority")) priority = "High";
  if (text.includes("low priority")) priority = "Low";

  // Extract due date using chrono
  const date = chrono.parseDate(transcript);
  const dueDate = date ? date.toISOString() : null;

  // Extract title (simple heuristic)
  let title = transcript
    .replace(/create|add|make|task|to\s*/gi, "")
    .trim();

  // Remove priority words
  title = title
    .replace(/high priority|low priority|medium priority/gi, "")
    .trim();

  // Remove date phrases
  title = title
    .replace(/tomorrow|today|next week|next month|by .*/gi, "")
    .trim();

  return {
    title: title.charAt(0).toUpperCase() + title.slice(1),
    priority,
    dueDate,
    description: "",
    status: "To Do"
  };
}

module.exports = { parseTaskFromTranscript };
