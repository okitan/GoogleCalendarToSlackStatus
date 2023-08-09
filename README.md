# Google Calendar To Slack Status

Google App Scriptを使い、Google Calendarの次の予定をSlackのステータスに反映させるスクリプトです。

## セットアップ方法

1. このリポジトリをクローンし、依存関係をインストールします

```bash
git clone https://github.com/okitan/GoogleCalendarToSlackStatus.git
npm install
```

2. claspを使ってGoogle App Scriptのプロジェクトを作成します

```bash
npx clasp login
npm run init
# src/.clasp.json and manifest.json is created
npm run clasp -- push
```

3. Slack Appを作成します

- https://api.slack.com/apps/ にアクセスし、`manifest.json` をアップロードしSlack Appを作成します
- 作成したSlack Appをワークスペースにインストールし、`Client ID` と `Client Secret` を取得します

4. Google App Scriptに環境変数を設定します

- `npm run clasp -- open` でGoogle App Scriptのエディタを開きます
- エディタの歯車アイコンをクリックし、`Client ID` を `SLACK_CLIENT_ID`として、`Client Sceret` に `SLACK_CLIENT_SECRET` として設定します

5. Googleの認可設定

- エディタのコード（<>）アイコンをクリックし、`calendar.gs` ファイルを開きます
- `debug` 関数を実行します
- Google App Scriptのリクエストを許可し、ログに結果が出力されれば成功です

最後に、`npm run clasp -- open --webapp` を実行し、`@HEAD` を選択すると、アプリのURLが取得できます。

## 利用方法

- `npm run clasp -- open --webapp` で取得したURLにアクセスします
  - URLにアクセスする際、Googleの認可画面が出た場合は、認可を行ってください
- Slack の認可を行います
- 認可が完了すると、Slackのステータスが更新されます

### 設定

Google Calendar To Slack Status は以下を設定することができます。

| 設定項目     | 説明                                               | デフォルト値 |
| ------------ | -------------------------------------------------- | ------------ |
| absentIcon   | 「お休み」の予定の場合に表示するアイコン           | :palm_tree:  |
| awayIcon     | 「外出」の予定の場合に表示するアイコン             | :no_entry:   |
| secretIcon   | 「非公開」の予定の場合に表示するアイコン           | :lock:       |
| secretText   | 「非公開」の予定の場合に表示するテキスト           | ヒミツだよ   |
| focusIcon    | 「サイレントモード」の予定の場合に表示するアイコン | :mute:       |
| scheduleIcon | 上記以外の予定がある場合に表示するアイコン         | :calendar:   |
| freeIcon     | 予定がない場合に表示するアイコン                   |              |
| freeText     | 予定がない場合に表示するテキスト                   |

## Google Calendar To Slack Status が取り扱う予定

Google Calendar To Slack Status は次の条件にあてはまる予定を取り扱います。

- Google Calendar の予定の `transparency` が `transparent（予定なし）` 以外の予定
- Google Calendar の予定で `responseStatus` が `declined（不参加）` 以外の予定
  - 未回答の予定や多分参加の予定はSlackのステータスに反映されますので、参加しなくなった予定には回答をしてください

同一時間帯に複数の予定がある場合、次の優先順位でステータスが決定されます。

1. 「お休み」の予定
2. 予定の時間が短い順（同一の開催時間の予定が複数の場合、結果は不定です）

### 予定の種類

| 予定の種類       | 条件                                                                             |
| ---------------- | -------------------------------------------------------------------------------- |
| お休み           | Google Calendar の予定の `eventType` が `outOfOffice（不在）`かつ4時間以上の予定 |
| 外出             | Google Calendar の予定の `eventType` が`outOfOffice（不在）`かつ4時間未満の予定  |
| サイレントモード | Google Calendarの予定の `visibility` が `private（非公開）`の予定                |
| 非公開           | visibility 「非公開」の予定タイプ                                                |

非公開の予定以外は、カレンダーの`summary`をステータスに表示します
