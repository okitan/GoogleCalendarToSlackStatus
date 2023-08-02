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

function getSlackProperties() {
  const clientId = PropertiesService.getScriptProperties().getProperty("SLACK_CLIENT_ID");
  const clientSecret = PropertiesService.getScriptProperties().getProperty("SLACK_CLIENT_SECRET");

  return { clientId, clientSecret };
}

function getSlackService({ clientId, clientSecret }: { clientId: string; clientSecret: string }) {
  return OAuth2.createService("slack")
    .setAuthorizationBaseUrl("https://slack.com/oauth/authorize")
    .setTokenUrl("https://slack.com/api/oauth.access")
    .setClientId(clientId)
    .setClientSecret(clientSecret)
    .setCallbackFunction("slackAuthCallback")
    .setPropertyStore(PropertiesService.getUserProperties())
    .setScope("users:write");
}

/*
    Template
 */
function render({ slackAuthorizationUrl }: { slackAuthorizationUrl?: string }) {
  const template = HtmlService.createTemplateFromFile("template/index.html");

  template.topUrl = ScriptApp.getService().getUrl();
  template.slackAuthorizationUrl = slackAuthorizationUrl;

  return template.evaluate().setTitle("Google Calendar To Slack Status");
}

function renderError() {
  return HtmlService.createHtmlOutputFromFile("template/error.html").setTitle("Google Calendar To Slack Status");
}
