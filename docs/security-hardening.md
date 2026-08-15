# Static Portfolio Security Hardening

This portfolio is deployed as a static Cloudflare Pages site. Static hosting reduces the attack surface because it does not expose an application server, database, authentication API, or administrative control plane to visitors.

## Delivery-layer controls

Cloudflare Pages supports a plain-text `_headers` file in the static asset directory. The deployment uses this file to attach browser security headers to static responses. See the [Cloudflare Pages headers documentation](https://developers.cloudflare.com/pages/configuration/headers/).

## Account-layer controls

The two accounts that control deployment are GitHub and Cloudflare. The repository owner should enable two-factor authentication and preferably add a passkey. GitHub states that passkeys are bound to the `github.com` domain and are more resistant to phishing than SMS or time-based one-time passwords. See [GitHub passkeys](https://docs.github.com/en/authentication/authenticating-with-a-passkey/about-passkeys).

For Cloudflare, open **My Profile** in the dashboard, select **Authentication**, and enable mobile authenticator or security-key authentication. Cloudflare recommends using at least two different factors and safely storing backup codes. For GitHub, open **Settings > Password and authentication**, enable 2FA with an authenticator app, save recovery codes, then use **Add a passkey** under Passkeys. See [Cloudflare 2FA](https://developers.cloudflare.com/fundamentals/user-profiles/2fa/) and [GitHub 2FA configuration](https://docs.github.com/en/authentication/securing-your-account-with-two-factor-authentication-2fa/configuring-two-factor-authentication).

## Public content boundaries

Frontend code and public portfolio assets are intentionally visible to website visitors. Private keys, passwords, private documents, and database credentials must never be committed to the repository or stored in the public R2 asset path.

## Contact-form controls

The form submits to Formspree and must rely on Formspree’s dashboard spam filtering and CAPTCHA. The client-side honeypot and timing checks are supplementary only and are not a replacement for provider-side protection.
