import dayjs from "dayjs";

const today = dayjs("2023-01-01T10:00:00+09:00");

export const wholeDayEvent = {
  kind: "calendar#event",
  eventType: "default",
  summary: "Whole Day Event",
  start: { date: today.format("YYYY-MM-DD") },
  end: { date: today.add(1, "day").format("YYYY-MM-DD") },
} satisfies GoogleAppsScript.Calendar.Schema.Event;

// out of office
export const movingEvent = {
  kind: "calendar#event",
  eventType: "outOfOffice",
  summary: "2時間の移動",
  start: { date: today.format() },
  end: { date: today.add(2, "hour").format() },
} satisfies GoogleAppsScript.Calendar.Schema.Event;

export const dayOffEvent = {
  kind: "calendar#event",
  eventType: "outOfOffice",
  summary: "休暇",
  start: {
    timeZone: "Asia/Tokyo",
    dateTime: today.hour(0).format(),
  },
  end: {
    timeZone: "Asia/Tokyo",
    dateTime: today.add(1, "day").hour(0).format(),
  },
  visibility: "public",
} satisfies GoogleAppsScript.Calendar.Schema.Event;

export const daysOffEvent = {
  kind: "calendar#event",
  eventType: "outOfOffice",
  summary: "休暇",
  start: {
    timeZone: "Asia/Tokyo",
    dateTime: today.hour(0).format(),
  },
  end: {
    timeZone: "Asia/Tokyo",
    dateTime: today.add(5, "day").hour(0).format(),
  },
  visibility: "public",
} satisfies GoogleAppsScript.Calendar.Schema.Event;

// regular events of variety length
export const nineToElevenEvent = {
  kind: "calendar#event",
  eventType: "default",
  summary: "two hours meeting",
  start: { date: today.add(-1, "hour").format() },
  end: { date: today.add(1, "hour").format() },
} satisfies GoogleAppsScript.Calendar.Schema.Event;

export const tenToElevenEvent = {
  kind: "calendar#event",
  eventType: "default",
  summary: "an hour meeting",
  start: { date: today.format() },
  end: { date: today.add(1, "hour").format() },
} satisfies GoogleAppsScript.Calendar.Schema.Event;

export const tenToNoonEvent = {
  kind: "calendar#event",
  eventType: "default",
  summary: "two hours meeting",
  start: { date: today.format() },
  end: { date: today.add(2, "hour").format() },
} satisfies GoogleAppsScript.Calendar.Schema.Event;

// varieties of event
export const transparentEvent = {
  kind: "calendar#event",
  eventType: "default",
  summary: "お知らせ",
  transparency: "transparent",
  start: { date: today.format() },
  end: { date: today.add(1, "hour").format() },
} satisfies GoogleAppsScript.Calendar.Schema.Event;

export const focusTimeEvent = {
  kind: "calendar#event",
  eventType: "focusTime",
  summary: "集中",
  start: { date: today.format() },
  end: { date: today.add(1, "hour").format() },
} satisfies GoogleAppsScript.Calendar.Schema.Event;

export const privateEvent = {
  kind: "calendar#event",
  eventType: "default",
  visibility: "private",
  summary: "MTG",
  start: { date: today.format() },
  end: { date: today.add(1, "hour").format() },
} satisfies GoogleAppsScript.Calendar.Schema.Event;

// Confidential is not supported now, but only for the safety
export const confidentialEvent = {
  kind: "calendar#event",
  eventType: "default",
  visibility: "confidential",
  summary: "MTG",
  start: { date: today.format() },
  end: { date: today.add(1, "hour").format() },
} satisfies GoogleAppsScript.Calendar.Schema.Event;

// attendance
export const declinedEvent = {
  kind: "calendar#event",
  eventType: "default",
  summary: "参加確認",
  status: "confirmed",
  attendees: [
    { responseStatus: "accepted" },
    { responseStatus: "declined", self: true },
    { responseStatus: "needsAction" },
    { responseStatus: "tentative" },
  ],
  start: { date: today.format() },
  end: { date: today.add(1, "hour").format() },
} satisfies GoogleAppsScript.Calendar.Schema.Event;

export const unanswerdEvent = {
  kind: "calendar#event",
  eventType: "default",
  summary: "参加確認",
  status: "confirmed",
  attendees: [
    { responseStatus: "accepted" },
    { responseStatus: "declined" },
    { responseStatus: "needsAction", self: true },
    { responseStatus: "tentative" },
  ],
  start: { date: today.format() },
  end: { date: today.add(1, "hour").format() },
} satisfies GoogleAppsScript.Calendar.Schema.Event;
