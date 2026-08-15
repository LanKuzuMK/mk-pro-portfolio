# Formspree Production Protection Checklist

The portfolio already uses a visible human-verification challenge, a short completion-time guard, and a hidden honeypot. Before publishing, finish the server-side protections in the Formspree dashboard.

| Step | Action |
|---|---|
| 1 | Open the configured form and enable reCAPTCHA under **Spam protection**. |
| 2 | Restrict the form to the final published custom domain. |
| 3 | Send one genuine inquiry and verify delivery to `lku199776@gmail.com`. |
| 4 | Mark any spam delivery as spam so Formspree can improve filtering. |

These dashboard settings provide server-side enforcement; the browser-side verification only deters basic automation.
