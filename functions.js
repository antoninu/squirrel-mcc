import { EVENTS_URI } from "./constants.js";

export const fetchData = async () => {
  const jsonResponse = await fetch(EVENTS_URI);
  const objectResponse = await jsonResponse.json();
  return objectResponse;
};

export const calculateMCC = (events, eventOccurences) => {
  const eventsArray = Object.entries(events);

  const squirrelCount = eventsArray.filter((ev) => ev[1].squirrel).length;
  const notSquirrelCount = eventsArray.length - squirrelCount;

  let eventOccurencesArray = Object.entries(eventOccurences);

  eventOccurencesArray.forEach((ev) => {
    const TP = ev[1]["isSquirrel"];
    const FP = squirrelCount - TP;
    const FN = ev[1]["notSquirrel"];
    const TN = notSquirrelCount - FN;

    const mccResult =
      (TP * TN - FP * FN) /
      Math.sqrt((TP + FP) * (TP + FN) * (TN + FP) * (TN + FN));

    ev[1]["mcc"] = mccResult;
  });

  return eventOccurencesArray;
};

export const countOccurrences = (events) => {
  var result = {};

  events.forEach((ev) => {
    var eventNames = ev.events;

    eventNames.forEach((eventName) => {
      if (!result[eventName]) {
        result[eventName] = {};
        result[eventName]["isSquirrel"] = 0;
        result[eventName]["notSquirrel"] = 0;
      }

      if (ev.squirrel) {
        result[eventName]["isSquirrel"] = result[eventName]["isSquirrel"] + 1;
      } else {
        result[eventName]["notSquirrel"] = result[eventName]["notSquirrel"] + 1;
      }
    });
  });

  return result;
};

export const drawEventsTable = (events) => {
  const eventsTableRows = document.getElementById("events-table-rows");

  events.forEach((ev, i) => {
    const row = eventsTableRows.insertRow();
    const numberCell = row.insertCell();
    const rowNumber = document.createTextNode(`# ${i + 1}`);
    numberCell.appendChild(rowNumber);

    const eventsCell = row.insertCell();
    const eventsText = document.createTextNode(ev.events);
    eventsCell.appendChild(eventsText);

    const isSquirrelCell = row.insertCell();
    const isSquirrel = ev.squirrel;

    const isSquirrelText = document.createTextNode(isSquirrel);
    isSquirrelCell.appendChild(isSquirrelText);

    if (isSquirrel) {
      row.className = "isSquirrelRow";
    }
  });
};

const eventsSortCompareFunction = (a, b) => {
  return a[1].mcc === b[1].mcc ? 0 : b[1].mcc > a[1].mcc ? 1 : -1;
};

export const drawCorrelationsTable = (events) => {
  const correlationTableRows = document.getElementById(
    "correlations-table-rows"
  );

  const sortedEvents = events.sort((a, b) => eventsSortCompareFunction(a, b));

  sortedEvents.forEach((ev, i) => {
    const row = correlationTableRows.insertRow();
    const numberCell = row.insertCell();
    const rowNumber = document.createTextNode(`# ${i + 1}`);
    numberCell.appendChild(rowNumber);

    const eventCell = row.insertCell();
    const eventText = document.createTextNode(ev[0]);
    eventCell.appendChild(eventText);

    const mccCell = row.insertCell();
    const mcc = ev[1].mcc;
    const mccText = document.createTextNode(mcc);
    mccCell.appendChild(mccText);
  });
};
