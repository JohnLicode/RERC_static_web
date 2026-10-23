# PSU RERC Website Handover

## 1. Website overview

This repository contains the static frontend website for the Palawan State
University Research Ethics Review Committee (PSU RERC).

Production URL:

```text
https://www.psurerc.com
```

The website consists of HTML, CSS, JavaScript, images, PDF files, and Word
documents. It does not contain a server-side application, user database,
authentication backend, or database backup. The separate system/application
must be handed over separately.

## 2. Included website areas

- `index.html` - homepage
- `about/` - committee information
- `resources/` - forms and reference materials
- `contacts/` - contact details, map, and contact form
- `login/` - frontend login page only; it is not a working authentication system
- `assets/` - images, PDFs, and Word documents
- `css/` - stylesheets
- `js/` - frontend JavaScript

## 3. Local preview

The site does not require a build step or package installation. Serve the
repository root with any static web server. For example, with Python:

```text
python -m http.server 8080
```

Then open:

```text
http://localhost:8080
```

Opening files directly with `file://` is not recommended because the website
uses root-relative paths such as `/assets/` and `/about/`.

## 4. Deployment

Upload the contents of this repository to the hosting document root. The
document root must contain `index.html` and the folders `about`, `contacts`,
`resources`, `assets`, `css`, and `js`.

For a private deployment package, create an archive from the website files
only. Do not commit deployment archives or private handover documents to this
repository.

After deployment, verify:

1. `https://www.psurerc.com/` loads.
2. `/about/`, `/resources/`, `/contacts/`, and `/login/` load.
3. Images, PDFs, and Word documents open or download.
4. HTTPS shows no certificate warning.
5. The contact form sends a test message.
6. Mobile navigation and page links work.
7. The old domain redirects to the new domain, if the old domain is still controlled.

## 5. External services and ownership

The website uses or references these external services:

- Domain and DNS: `www.psurerc.com`
- Hosting provider: transfer details must be shared separately with the client
  through a private channel
- GitHub repository: access has already been provided to the client
- EmailJS: used by the contact form in `contacts/index.html`
- Font Awesome CDN
- Google Maps embed
- Google Search Console verification

GitHub repository access is sufficient for source-code collaboration, but it
does not transfer domain ownership, DNS control, hosting ownership, SSL
management, EmailJS administration, or official email accounts. Those must be
transferred separately.

## 6. Contact form

The contact form uses EmailJS from `contacts/index.html`. EmailJS configuration
details are intentionally not documented here. Transfer those details and
the EmailJS project separately through a private channel or secure document.
The website sends the contact-us template; configure the auto-reply template
as the service's autoresponder or automation in the EmailJS dashboard.

The client must receive ownership or administrator access to the EmailJS
project, or a new EmailJS project must be created under the client's account.
Send a test message after deployment and confirm which mailbox receives it.

Do not put account passwords, EmailJS configuration details, private API keys,
recovery codes, or other secrets in this repository or in this README.

## 7. Known limitations and exclusions

- No database or database backup is included.
- No server-side API or backend is included.
- The login page is a frontend design and is not connected to authentication.
- Password reset and Google sign-in are not implemented by this repository.
- The separate system/application is excluded from this website handover.
- Privacy Policy and Terms & Conditions links are placeholders and should be
  reviewed by the client before production use.

## 8. Handover

The client should confirm that they can access:

- The GitHub repository
- The domain registrar
- DNS management
- The hosting control panel or deployment method
- SSL certificate management
- The EmailJS project
- Google Search Console

Domain, hosting, DNS, SSL, EmailJS, and other access details must be shared
separately from this public source repository.
