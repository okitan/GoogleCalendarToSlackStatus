export function _render({ slackAuthorizationUrl }: { slackAuthorizationUrl?: string }) {
  const template = HtmlService.createTemplateFromFile("template/index.html");

  template.topUrl = ScriptApp.getService().getUrl();
  template.slackAuthorizationUrl = slackAuthorizationUrl;

  return template.evaluate().setTitle("Google Calendar To Slack Status");
}

export function _renderError() {
  return HtmlService.createHtmlOutputFromFile("template/error.html").setTitle("Google Calendar To Slack Status");
}
