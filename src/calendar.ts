import type { calendar_v3 } from "@googleapis/calendar";

// tmp
function debug() {
  console.log(JSON.stringify(_fetchCurrentCalendarEvents(), null, 2));
}

// enents of next 1 minute
export function _fetchCurrentCalendarEvents(): GoogleAppsScript.Calendar.Schema.Event[] {
  const now = new Date();

  const from = new Date(now.getFullYear(), now.getMonth(), now.getDate(), now.getHours(), now.getMinutes() + 1, 0);
  const to = new Date(now.getFullYear(), now.getMonth(), now.getDate(), now.getHours(), now.getMinutes() + 1, 59);

  const { items } = Calendar.Events!.list("primary", {
    timeMin: from.toISOString(),
    timeMax: to.toISOString(),
    singleEvents: true,
  } satisfies calendar_v3.Params$Resource$Events$List);

  return items!;
}

export function _findEventForSlackStatus(events: GoogleAppsScript.Calendar.Schema.Event[]) {
  const targetEvents = events
    // reject event of locked
    .filter((event) => event.transparency !== "transparent")
    // reject event of declind by me
    .filter((event) => event.attendees?.find((e) => e.self)?.responseStatus !== "declined");

  // longer off is prior
  const offEvents = events.filter((event) => event.eventType === "outOfOffice");
  if (offEvents.length > 0) return offEvents.sort(compareEventLength).reverse()[0];

  // shorter event is prior
  return targetEvents.sort(compareEventLength)[0];
}

// shorter event is better
function compareEventLength(a: GoogleAppsScript.Calendar.Schema.Event, b: GoogleAppsScript.Calendar.Schema.Event) {
  const aLength = eventLength(a);
  const bLength = eventLength(b);

  return aLength - bLength === 0 ? 0 : aLength - bLength > 0 ? 1 : -1;
}

function eventLength(event: GoogleAppsScript.Calendar.Schema.Event) {
  const start = new Date((event.start!.dateTime || event.start!.date)!);
  const end = new Date((event.end!.dateTime || event.end!.date)!);

  return end.getTime() - start.getTime();
}
