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
    showHiddenInvitations: true,
  } satisfies calendar_v3.Params$Resource$Events$List);

  return items!;
}

export function _findEventForSlackStatus(events: GoogleAppsScript.Calendar.Schema.Event[]) {
  return events[0];
}
