import { _fetchCurrentCalendarEvents } from "./calendar";
import { _render, _renderError } from "./output";
import { _getSlackProperties, _getSlackService, _updateSlackStatus, type Status } from "./slack";

// hack for function import
const render = _render;
const renderError = _renderError;
const getSlackProperties = _getSlackProperties;
const getSlackService = _getSlackService;
const updateSlackStatus = _updateSlackStatus;
const fetchCurrentCalendarEvents = _fetchCurrentCalendarEvents;

// handlers
function doGet(request: GoogleAppsScript.Events.DoGet) {
  const { clientId, clientSecret } = getSlackProperties();
  if (!clientId || !clientSecret) return renderError();

  const slack = getSlackService({ clientId, clientSecret });
  if (!slack.hasAccess()) return render({ slackAuthorizationUrl: slack.getAuthorizationUrl() });

  // revoke
  if (request.parameter.revoke) {
    slack.reset();
    return render({ slackAuthorizationUrl: slack.getAuthorizationUrl() });
  }

  // tmp
  // const status: Status = {
  //   status_text: "test",
  //   status_emoji: ":ghost:",
  //   status_expiration: new Date().getTime() / 1000 + 60 * 2,
  // };
  // updateSlackStatus({ slack, status });

  return render({});
}

function slackAuthCallback(request: GoogleAppsScript.Events.DoGet) {
  const { clientId, clientSecret } = getSlackProperties();
  if (!clientId || !clientSecret) return renderError();

  const slack = getSlackService({ clientId, clientSecret });
  const authorized = slack.handleCallback(request);

  if (authorized) {
    // TODO: add Time Trigger
    return render({});
  } else {
    return render({ slackAuthorizationUrl: slack.getAuthorizationUrl() });
  }
}
