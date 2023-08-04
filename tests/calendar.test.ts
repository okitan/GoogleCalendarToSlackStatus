import { _createSlackStatus, _findEventForSlackStatus, defaultIcon } from "../src/calendar";
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
    const status = { status_text: "default", status_emoji: ":ghost:" };
    expect(_createSlackStatus(undefined, status)).toEqual(status);
  });

  test("should return undefined when evetything is undefined", () => {
    expect(_createSlackStatus(undefined)).toEqual(undefined);
  });

  test.each<[string, GoogleAppsScript.Calendar.Schema.Event, Status]>([
    ["with regular event", nineToElevenEvent, {}],
    ["with whole day event", wholeDayEvent, {}],
    ["with private event", privateEvent, { status_text: "ヒミツだよ", status_emoji: defaultIcon.secret }],
    ["with confidential event", confidentialEvent, { status_text: "ヒミツだよ", status_emoji: defaultIcon.secret }],
    ["with moving event", movingEvent, { status_emoji: defaultIcon.away }],
    ["with days off event", daysOffEvent, { status_emoji: defaultIcon.absent }],
    ["with focus event", focusTimeEvent, { status_emoji: defaultIcon.focus }],
  ])("should return status %s", (_, event, partial_expected) => {
    const expected: Status = Object.assign(
      // default
      {
        status_text: event.summary,
        status_emoji: defaultIcon.default,
        status_expiration: Date.parse((event.end?.dateTime ?? event.end?.date)!) / 1000,
      },
      partial_expected,
    );

    expect(_createSlackStatus(event)).toEqual(expected);
  });
});
