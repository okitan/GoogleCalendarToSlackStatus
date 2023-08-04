import { _createSlackStatus, _findEventForSlackStatus } from "../src/calendar";
import {
  wholeDayEvent,
  movingEvent,
  dayOffEvent,
  daysOffEvent,
  nineToElevenEvent,
  tenToElevenEvent,
  tenToNoonEvent,
  transparentEvent,
  focusTimeEvent,
  privateEvent,
  confidentialEvent,
  declinedEvent,
  unanswerdEvent,
} from "./fixtures/events";
import type { Status } from "../src/slack";
import { defaultConfig } from "../src/config";

describe(_findEventForSlackStatus, () => {
  test.each<[string, GoogleAppsScript.Calendar.Schema.Event[], GoogleAppsScript.Calendar.Schema.Event | undefined]>([
    ["should return undefined with an empty array", [], undefined],
    // target events
    ["should not return transparent event", [transparentEvent], undefined],
    ["should not return declined event", [declinedEvent], undefined],
    ["should return unanswerd event", [unanswerdEvent], unanswerdEvent],
    ["should return focus time event", [focusTimeEvent], focusTimeEvent],
    ["should return whole day event", [wholeDayEvent], wholeDayEvent],
    ["should return private event", [privateEvent], privateEvent],
    // events selection
    ["should prefer to a whole day off event", [movingEvent, dayOffEvent, tenToElevenEvent], dayOffEvent],
    ["should prefer to a days off event", [dayOffEvent, daysOffEvent, tenToElevenEvent], daysOffEvent],
    ["should prefer to a moving event", [movingEvent, tenToElevenEvent], movingEvent],
    ["should prefer to a shorter event", [wholeDayEvent, tenToElevenEvent, tenToNoonEvent], tenToElevenEvent],
  ])("%s", (_, events, expected) => {
    expect(_findEventForSlackStatus(events)).toEqual(expected);
  });
});

describe(_createSlackStatus, () => {
  test("should return default status when event is undefined", () => {
    expect(_createSlackStatus(undefined, defaultConfig)).toEqual({
      status_text: defaultConfig.freeText,
      status_emoji: defaultConfig.freeIcon,
      status_expiration: 0,
    });
  });

  test.each<[string, GoogleAppsScript.Calendar.Schema.Event, Status]>([
    ["with regular event", nineToElevenEvent, {}],
    ["with whole day event", wholeDayEvent, {}],
    [
      "with private event",
      privateEvent,
      { status_text: defaultConfig.secretText, status_emoji: defaultConfig.secretIcon },
    ],
    [
      "with confidential event",
      confidentialEvent,
      { status_text: defaultConfig.secretText, status_emoji: defaultConfig.secretIcon },
    ],
    ["with moving event", movingEvent, { status_emoji: defaultConfig.awayIcon }],
    ["with days off event", daysOffEvent, { status_emoji: defaultConfig.absentIcon }],
    ["with focus event", focusTimeEvent, { status_emoji: defaultConfig.focusIcon }],
  ])("should return status %s", (_, event, partial_expected) => {
    const expected: Status = Object.assign(
      // default
      {
        status_text: event.summary,
        status_emoji: defaultConfig.defaultIcon,
        status_expiration: Date.parse((event.end?.dateTime ?? event.end?.date)!) / 1000,
      },
      partial_expected,
    );

    expect(_createSlackStatus(event, defaultConfig)).toEqual(expected);
  });
});
