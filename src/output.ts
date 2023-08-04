import type { Config } from "./config";

export function _render({
  topUrl,
  triggerDuration,
  properties,
}: {
  topUrl: string;
  triggerDuration?: number;
  properties: Partial<Config>;
}) {
  const template = HtmlService.createTemplateFromFile("template/index.html");

  template.topUrl = topUrl;
  template.triggerDuration = triggerDuration;
  template.properties = properties;

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
