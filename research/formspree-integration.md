# Formspree Integration Requirements

Official Formspree guidance confirms that direct submissions require a Formspree account, a created form, and that form’s unique `https://formspree.io/f/{form-id}` endpoint. The submitted form fields must include `name` attributes, and Formspree can route stored submissions to the target email configured in its dashboard.

The existing portfolio form already has client-side validation. The implementation should replace its `mailto:` handoff with a JSON `POST` to the user-supplied endpoint, report bilingual success and error states, and retain the validation before network submission.

Sources: [Formspree HTML form guide](https://formspree.io/html/) and [Building an HTML Form](https://help.formspree.io/articles/building-your-form/building-an-html-form).
