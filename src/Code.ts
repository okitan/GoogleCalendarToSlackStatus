import { _fetchAndCreateSlackStatus } from "./calendar";
import { _render, _renderError, _renderUnAuthorized } from "./output";
import { _getSlackProperties, _getSlackService, _updateSlackStatus, type Status } from "./slack";

// hack for function import
const render = _render;
const renderUnAuthorized = _renderUnAuthorized;
const renderError = _renderError;

const getSlackProperties = _getSlackProperties;
const getSlackService = _getSlackService;
const updateSlackStatus = _updateSlackStatus;

const fetchAndCreateSlackStatus = _fetchAndCreateSlackStatus;

// handlers
function doGet(request: GoogleAppsScript.Events.DoGet) {
  const { clientId, clientSecret } = getSlackProperties();
  if (!clientId || !clientSecret) return renderError();

  const slack = getSlackService({ clientId, clientSecret });
  if (!slack.hasAccess()) return renderUnAuthorized(slack.getAuthorizationUrl());

  return buildScreen();
}

function doPost(request: GoogleAppsScript.Events.DoPost) {
  const { clientId, clientSecret } = getSlackProperties();
  if (!clientId || !clientSecret) return renderError();

  const slack = getSlackService({ clientId, clientSecret });
  if (!slack.hasAccess()) return renderUnAuthorized(slack.getAuthorizationUrl());

  if (request.parameter.slack === "revoke") {
    slack.reset();
    removeTriggers();
    return renderUnAuthorized(slack.getAuthorizationUrl());
  }

  if (request.parameter.trigger === "on") {
    addTrigger(1); // TODO: editable
  } else if (request.parameter.trigger === "off") {
    removeTriggers();
  }

  return buildScreen();
}

function slackAuthCallback(request: GoogleAppsScript.Events.DoGet) {
  const { clientId, clientSecret } = getSlackProperties();
  if (!clientId || !clientSecret) return renderError();

  const slack = getSlackService({ clientId, clientSecret });
  const authorized = slack.handleCallback(request);
  if (!authorized) return renderUnAuthorized(slack.getAuthorizationUrl());

  addTrigger(1); // TODO: editable

  return buildScreen();
}

function onClock(event: GoogleAppsScript.Events.TimeDriven) {
  const { clientId, clientSecret } = getSlackProperties();
  if (!clientId || !clientSecret) throw new Error("clientId or clientSecret is not set");

  const slack = getSlackService({ clientId, clientSecret });
  if (!slack.hasAccess()) throw new Error("slack has no access");

  // TODO: default status with config
  const status = fetchAndCreateSlackStatus({ status_emoji: "", status_text: "" });
  if (status) updateSlackStatus({ slack, status });
}

// triggers
export function addTrigger(duration: number) {
  // assert no triggers
  removeTriggers();
  ScriptApp.newTrigger("onClock").timeBased().everyMinutes(duration).create();
}

export function removeTriggers() {
  ScriptApp.getProjectTriggers().forEach((trigger) => ScriptApp.deleteTrigger(trigger));
}

// normal output
function buildScreen() {
  const params: Parameters<typeof render>[0] = {
    topUrl: ScriptApp.getService().getUrl(),
  };

  // check triggers
  const trigger = ScriptApp.getProjectTriggers().find(
    (trigger) => trigger.getEventType() === ScriptApp.EventType.CLOCK,
  );
  if (trigger) params.triggerDuration = 1; // TODO: editable

  return render(params);
}
