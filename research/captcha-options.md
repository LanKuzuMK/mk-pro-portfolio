# Contact-Form CAPTCHA Options

Formspree supports Google reCAPTCHA and recommends it as its strongest spam-prevention layer. Its visible reCAPTCHA v2 checkbox requires a Google site key in the webpage and a secret key configured in the Formspree dashboard. Formspree also provides an interstitial CAPTCHA option that is configured in the dashboard, but that approach is not compatible with the portfolio’s JavaScript/AJAX submission flow.

The portfolio will add a visible, accessible human-verification challenge, minimum-completion timing, and existing honeypot guard in the interface immediately. For production-grade CAPTCHA validation, the user should additionally enable Formspree’s reCAPTCHA setting and configure their Google keys in the Formspree dashboard.

Sources: [Formspree reCAPTCHA settings](https://help.formspree.io/articles/form-and-project-settings/recaptcha-settings), [Formspree anti-spam guidance](https://help.formspree.io/articles/troubleshooting/how-to-prevent-spam), and [Formspree CAPTCHA methods](https://formspree.io/blog/recaptcha-methods/).
