import {
  fetchData,
  drawEventsTable,
  countOccurrences,
  calculateMCC,
  drawCorrelationsTable,
} from "./functions.js";

fetchData().then((eventsResult) => {
  const eventsWithOccurences = countOccurrences(eventsResult);
  const eventsWithMCC = calculateMCC(eventsResult, eventsWithOccurences);
  drawEventsTable(eventsResult);
  drawCorrelationsTable(eventsWithMCC);
});
