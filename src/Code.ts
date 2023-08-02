import { _render, _renderError } from "./output";
import { _getSlackProperties, _getSlackService } from "./slack";

// hack for function import
const render = _render;
const renderError = _renderError;
const getSlackProperties = _getSlackProperties;
const getSlackService = _getSlackService;

// handlers
function doGet(request: GoogleAppsScript.Events.DoGet) {
  const { clientId, clientSecret } = getSlackProperties();
  if (!clientId || !clientSecret) return renderError();

  const slack = getSlackService({ clientId, clientSecret });
  if (!slack.hasAccess()) return render({ slackAuthorizationUrl: slack.getAuthorizationUrl() });

  // remoke
  if (request.parameter.revoke) {
    slack.reset();
    return render({ slackAuthorizationUrl: slack.getAuthorizationUrl() });
  }

  return render({});
}

function slackAuthCallback(request: GoogleAppsScript.Events.DoGet) {
  const { clientId, clientSecret } = getSlackProperties();
  if (!clientId || !clientSecret) return renderError();

  const slack = getSlackService({ clientId, clientSecret });
  const authorized = slack.handleCallback(request);

  if (slack.hasAccess()) {
    // TODO: add Time Trigger
    return render({});
  } else {
    return render({ slackAuthorizationUrl: slack.getAuthorizationUrl() });
  }
}
