const chrono = require("chrono-node");

function parseTaskFromTranscript(transcript) {
  const text = transcript.toLowerCase();

  // -------------------------------
  // PRIORITY DETECTION
  // -------------------------------
  let priority = "Medium";

  if (
    text.includes("high priority") ||
    text.includes("urgent") ||
    text.includes("critical") ||
    text.includes("important")
  ) {
    priority = "High";
  }

  if (text.includes("low priority") || text.includes("low importance")) {
    priority = "Low";
  }


  // -------------------------------
  // STATUS DETECTION
  // -------------------------------
  let status = "To Do";

  if (
    text.includes("mark as done") ||
    text.includes("completed") ||
    text.includes("complete this") ||
    text.includes("finish it") ||
    text.includes("finished") ||
    text.includes("done")
  ) {
    status = "Done";
  } else if (
    text.includes("in progress") ||
    text.includes("start working") ||
    text.includes("start this") ||
    text.includes("begin working") ||
    text.includes("working on")
  ) {
    status = "In Progress";
  }

  // -------------------------------
  // DATE DETECTION
  // -------------------------------
  const date = chrono.parseDate(transcript);
  const dueDate = date ? date.toISOString() : null;

  // -------------------------------
  // TITLE EXTRACTION
  // -------------------------------
  let title = transcript;

  // Remove command-type phrases
  title = title.replace(/(create|add|make|task|remind me|to do)/gi, "");
  title = title.replace(/mark as done|complete|finished|finish/gi, "");
  title = title.replace(/start working|start this|begin|working on/gi, "");

  // Remove priority words
  title = title.replace(/urgent|critical|high priority|low priority|medium priority/gi, "");

  // Remove date phrases detected by chrono
  title = title.replace(/today|tomorrow|tonight|this week|next week|yesterday/gi, "");
  title = title.replace(/by [^,]+/gi, "");

  // Clean spaces
  title = title.trim();
  if (title.length > 0) {
    title = title.charAt(0).toUpperCase() + title.slice(1);
  } else {
    title = "Untitled Task";
  }

  return {
    title,
    priority,
    dueDate,
    description: "",
    status
  };
}

module.exports = { parseTaskFromTranscript };
