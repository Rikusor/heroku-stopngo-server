# Heroku Stop 'N Go Add-on Open Source

This is the code for getting Stop 'N Go Add-on up an running for your company.

**NOTE** This project has dependency of https://github.com/Rikusor/heroku-stopngo-pages which works as the admin panel for the add-on and error page.

## What is Stop 'N Go

Stop ‘N Go is an add-on that automatically stops and starts dynos in non-production Heroku apps to reduce costs. Adding Stop 'N Go to development apps can save your organization a significant amount of money.

Here’s some quick math to illustrate:

Assume your development app is running on 1 Standard-1X dyno ($25 per month, prorated to the second).
Assume your app is actively being developed for 12 hours a day, 20 days per month.
Therefore, your development app needs to be active for about 12 * 20 = 240 hours per month.
Assuming a 30-day month, this leaves 480 hours a month (about 67% of the month) during which your development app is running but receiving no traffic.
In the above example, using Stop 'N Go to automatically stop your development app during periods of idleness can result in savings on the order of $16.75 a month ($25 * .67) per application.

## How to configure Stop 'N Go self-hosted

### Become Heroku provider partner

To complete this you can follow documentation by Heroku at https://devcenter.heroku.com/articles/building-an-add-on

Example manifest:

```
{
  "id": "stopngo",
  "api": {
    "test": {
      "sso_url": "http://localhost:3001/auth/login",
      "base_url": "http://localhost:4567/heroku/resources"
    },
    "regions": [
      "eu",
      "us"
    ],
    "version": "1",
    "password": "<PASSWORD>",
    "requires": [
      "log_input",
      "syslog_drain"
    ],
    "sso_salt": "<SSO_SALT>",
    "production": {
      "sso_url": "https://stopngo-pages.herokuapp.com/auth/login",
      "base_url": "https://stopngoserver.herokuapp.com/"
    },
    "config_vars": [
      "ERROR_PAGE_URL"
    ],
    "config_vars_prefix": "ERROR_PAGE"
  },
  "name": "Stop 'N Go",
  "$base": 150702992790360,
  "cli_plugin_name": "heroku-stopngo"
}
```

Upload that manifest into Heroku.

### Deploying back-end to Heroku

1. Clone this repository to your local machine
2. Create Heroku App X (**Remember to update Manifest base_url according to this app name!**)
3. Add mLab mongodb to app (Free works)
4. Add following environment variables to Heroku App
```
HASHING_ALGORITHM=aes-256-ctr
HASHING_PASSWORD=<YOUR_HASHING_PASSWORD>
MONGO_URI=<MONGO_DB_URI>
OAUTH_CLIENT_SECRET=<OAUTH_SECRET> // https://devcenter.heroku.com/articles/oauth#register-client
SYSLOG_SERVER=https://<ADDON_ID>:<ADDON_PASSWORD>@<ADDON_BASE_URL>/logs
USER_NAME=<ADDON_ID>
USER_PASSWORD=<ADDON_PASSWORD>
STOPNGO_PAGES_BASE_URL=<URL_TO_APP_HOSTING_PAGES>
```
5. Push code to Heroku

### Deploying Pages to Heroku
1. Create app in Heroku
2. Update manifest sso_url to this app's url + /auth/login
3. Update back-end STOPNGO_PAGES_BASE_URL to this app's base url
4. Add following environment variables to the app
```
SALT=<ADDON_SSO_SALT>
SERVER_URL=https://<ADDON_ID>:<ADDON_PASSWORD>@<ADDON_BASE_URL>
```
5. Deploy code from https://github.com/Rikusor/heroku-stopngo-pages in to this app

## Provision the add-on

At this point you should be able to provision the add-on and all users who you've added as alpha testers, by using the heroku cli provision command with the addon_id you provided in the manifest.
