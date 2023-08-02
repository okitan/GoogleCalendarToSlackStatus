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
    .setScope("users:write");
}
