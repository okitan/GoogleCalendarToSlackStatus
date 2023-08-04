export function _render({ topUrl, triggerDuration }: { topUrl: string; triggerDuration?: number }) {
  const template = HtmlService.createTemplateFromFile("template/index.html");

  template.topUrl = topUrl;
  template.triggerDuration = triggerDuration;

  return template.evaluate().setTitle("Google Calendar To Slack Status");
}

export function _renderUnAuthorized(slackAuthorizationUrl: string) {
  const template = HtmlService.createTemplateFromFile("template/unauthorized.html");

  template.slackAuthorizationUrl = slackAuthorizationUrl;

  return template.evaluate().setTitle("Google Calendar To Slack Status");
}

export function _renderError() {
  return HtmlService.createHtmlOutputFromFile("template/error.html").setTitle("Google Calendar To Slack Status");
}
