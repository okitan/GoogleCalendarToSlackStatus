import type { calendar_v3 } from "@googleapis/calendar";
import type { Status } from "./slack";

const defaultIcon = {
  absent: ":palm_tree:",
  away: ":no_entry:",
  secret: ":lock:",
  focus: ":mute:",
  default: ":ghost:",
};
export { defaultIcon };

// tmp
function debug() {
  const events = _fetchCurrentCalendarEvents();
  const event = _findEventForSlackStatus(events);
  const status = _createSlackStatus(event);

  console.log(events, event, status);
}

export function _fetchAndCreateSlackStatus(defaultStatus?: Status): Status | undefined {
  return _createSlackStatus(_findEventForSlackStatus(_fetchCurrentCalendarEvents()), defaultStatus);
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

// event から status を生成する
export function _createSlackStatus(
  event: GoogleAppsScript.Calendar.Schema.Event | undefined,
  defaultStatus?: Status,
): Status | undefined {
  if (!event) return defaultStatus;

  const end = new Date((event.end!.dateTime || event.end!.date)!).getTime() / 1000;

  // mask confidential information
  if (event.visibility === "private" || event.visibility === "confidential")
    return { status_text: "ヒミツだよ", status_emoji: defaultIcon.secret, status_expiration: end };

  const emoji = (() => {
    switch (event.eventType) {
      case "outOfOffice":
        return eventLength(event) > 4 * 60 * 60 * 1000 ? defaultIcon.absent : defaultIcon.away;
      case "focusTime":
        return defaultIcon.focus;
      default:
        return defaultIcon.default;
    }
  })();

  return { status_text: event.summary, status_emoji: emoji, status_expiration: end };
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
