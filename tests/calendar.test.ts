import { calendar_v3 } from "@googleapis/calendar";
import { _findEventForSlackStatus } from "../src/calendar";
import {
  tenToElevenEvent,
  dayOffEvent,
  daysOffEvent,
  transparentEvent,
  tenToNoonEvent,
  wholeDayEvent,
  declinedEvent,
  unanswerdEvent,
  focusTimeEvent,
  movingEvent,
  privateEvent,
} from "./fixtures/events";

describe(_findEventForSlackStatus, () => {
  test.each<[string, GoogleAppsScript.Calendar.Schema.Event[], GoogleAppsScript.Calendar.Schema.Event | undefined]>([
    ["should return undefined with an empty array", [], undefined],
    // target events
    ["should not return transparent event", [transparentEvent], undefined],
    ["should not return declined event", [declinedEvent], undefined],
    ["should return unanswerd event", [unanswerdEvent], unanswerdEvent],
    ["should return focus time event", [focusTimeEvent], focusTimeEvent],
    ["should return whole day event", [wholeDayEvent], wholeDayEvent],
    ["shole return private event", [privateEvent], privateEvent],
    // events selection
    ["should prefer to a whole day off event", [movingEvent, dayOffEvent, tenToElevenEvent], dayOffEvent],
    ["should prefer to a days off event", [dayOffEvent, daysOffEvent, tenToElevenEvent], daysOffEvent],
    ["should prefer to a moving event", [movingEvent, tenToElevenEvent], movingEvent],
    ["should prefer to a shorter event", [wholeDayEvent, tenToElevenEvent, tenToNoonEvent], tenToElevenEvent],
  ])("%s", (_, events, expected) => {
    expect(_findEventForSlackStatus(events)).toEqual(expected);
  });
});
