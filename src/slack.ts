export type Status = {
  status_text?: string;
  status_emoji?: string;
  status_expiration?: number;
};

export function _getSlackProperties() {
  const clientId = PropertiesService.getScriptProperties().getProperty("SLACK_CLIENT_ID");
  const clientSecret = PropertiesService.getScriptProperties().getProperty("SLACK_CLIENT_SECRET");

  return { clientId, clientSecret };
}

export function _getSlackService({ clientId, clientSecret }: { clientId: string; clientSecret: string }) {
  return OAuth2.createService("slack")
    .setAuthorizationBaseUrl("https://slack.com/oauth/authorize")
    .setTokenUrl("https://slack.com/api/oauth.access")
    .setClientId(clientId)
    .setClientSecret(clientSecret)
    .setCallbackFunction("slackAuthCallback")
    .setPropertyStore(PropertiesService.getUserProperties())
    .setScope("users.profile:write");
}

export function _updateSlackStatus({ slack, status }: { slack: GoogleAppsScriptOAuth2.OAuth2Service; status: Status }) {
  const token = slack.getAccessToken();

  const response = UrlFetchApp.fetch("https://slack.com/api/users.profile.set", {
    method: "post",
    contentType: "application/json",
    headers: { Authorization: `Bearer ${token}` },
    payload: JSON.stringify({ profile: status }),
  });

  if (response.getResponseCode() !== 200)
    throw new Error(`Slack API Status Error: ${response.getResponseCode()}: ${response.getContentText()}`);

  const result = JSON.parse(response.getContentText());
  if (result.ok !== true) throw new Error(`Slack API Error: ${result.error}`);
}
