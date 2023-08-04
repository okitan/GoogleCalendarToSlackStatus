# Google Calendar To Slack Status

This is a simple script that will update your Slack status with your next Google Calendar event.

## Installation

1. Clone this repo and install dependencies

```bash
git clone https://github.com/okitan/GoogleCalendarToSlackStatus.git
npm install
```

2. Create a new Google App Script App with clasp

```bash
npx clasp login
npm run init
npm run clasp -- push
# src/.clasp.json and manifest.json is created
```

3. Create a new Slack App

- Go To `https://api.slack.com/apps/` and create a new app from `manifest.json` generated in section 2.
- install to your workspace and get `Client ID` and `Client Secret`.

4. Set environment variables

- `npm run clasp -- open` and you can go to the Google App Script Editor
- Click the Gear Icon and set `Client ID` as `SLACK_CLIENT_ID` and `Client Sceret` as `SLACK_CLIENT_SECRET` to `Script Properties`.

5. Test your script

- Click the Code(<>) Icon and open the `calendar.gs` file.
- Run `debug` function.
- Authorize Google App Script Request and you can see the result in the log.

Finally, run `npm run clasp -- open --webapp` and select `@HEAD`.
You can get your app url. Enjoy!
