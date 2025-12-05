const chrono = require("chrono-node");

function parseTaskFromTranscript(transcript) {
  const text = transcript.toLowerCase();

  /* ---------------- PRIORITY DETECTION ---------------- */
  let priority = "Medium";
  if (text.includes("high priority") || text.includes("urgent") || text.includes("critical")) {
    priority = "High";
  } 
  if (text.includes("medium priority")) {
    priority = "Medium";
  }
  if (text.includes("low priority")) {
    priority = "Low";
  }

  /* ---------------- STATUS DETECTION ---------------- */
  let status = "To Do";

  if (
    text.includes("done") ||
    text.includes("mark as done") ||
    text.includes("completed") ||
    text.includes("complete it")
  ) {
    status = "Done";
  }

  if (
    text.includes("in progress") ||
    text.includes("mark as in progress") ||
    text.includes("start working on")
  ) {
    status = "In Progress";
  }

  if (text.includes("to do") || text.includes("todo")) {
    status = "To Do";
  }

  /* ---------------- DATE EXTRACTION ---------------- */
  const date = chrono.parseDate(transcript);
  const dueDate = date ? date.toISOString() : null;

  /* ---------------- TITLE CLEANUP ---------------- */
  let title = transcript;

  // Remove command phrases
  title = title
    .replace(/create|add|make|task|remind me|please|mark as|set|to do|todo/gi, "")
    .replace(/high priority|low priority|medium priority|urgent|critical/gi, "")
    .replace(/mark as done|done|completed|complete it/gi, "")
    .replace(/in progress|start working on/gi, "")
    .replace(/by .*/gi, "") // remove date phrases
    .trim();

  // Capitalize first letter
  let cleanedTitle = title.charAt(0).toUpperCase() + title.slice(1);

  return {
    title: cleanedTitle || "Untitled Task",
    priority,
    dueDate,
    description: "",
    status
  };
}

module.exports = { parseTaskFromTranscript };