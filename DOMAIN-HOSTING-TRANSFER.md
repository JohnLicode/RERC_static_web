# PSU RERC Domain and Hosting Transfer Record

Use this document to record the transfer of the website domain, DNS, hosting,
SSL, and related services. Do not write passwords, private keys, recovery
codes, or other secrets in this file.

## 1. Website details

| Item | Value |
|---|---|
| Website | PSU Research Ethics Review Committee |
| Production URL | `https://www.psurerc.com` |
| Previous URL | `https://psurerc.me` |
| Website type | Static HTML/CSS/JavaScript website |
| Website repository | `JohnLicode/RERC_static_web` |
| Repository access | Already provided to the client |
| Handover date | ____________________ |
| Handover version/commit | ____________________ |

## 2. Domain registrar transfer

| Item | Details |
|---|---|
| Registrar | Namecheap |
| Registrar login URL | https://www.namecheap.com/ |
| Current registrant/owner | Lawrence Secjadas |
| New owner/account | ____________________ |
| Domain renewal date | October 2, 2027 |
| Auto-renewal enabled | No |
| Transfer completed on | ____________________ |
| Client access confirmed by | ____________________ |

Actions:

- [ ] Confirm the client is the legal/organizational domain owner.
- [ ] Add the client's administrator account.
- [ ] Transfer ownership or move the domain into the client's registrar account.
- [ ] Confirm the registrant email and recovery details.
- [ ] Enable MFA for the client's administrator account.
- [ ] Confirm renewal and payment responsibility.
- [ ] Keep the old `psurerc.me` domain active while redirects and search indexing are
      being monitored, if it is still available.

## 3. DNS configuration

Record the final values supplied by the hosting provider. Do not guess these
values.

| Record | Host/name | Value/target | TTL | Verified |
|---|---|---|---|---|
| A | `@` | ____________________ | ______ | Yes / No |
| CNAME | `www` | ____________________ | ______ | Yes / No |
| CNAME/TXT | ____________________ | ____________________ | ______ | Yes / No |
| MX | ____________________ | ____________________ | ______ | Yes / No |
| TXT | ____________________ | ____________________ | ______ | Yes / No |

DNS checks:

- [ ] `psurerc.com` resolves to the approved hosting service.
- [ ] `www.psurerc.com` resolves to the approved hosting service.
- [ ] No unrelated DNS records were deleted.
- [ ] Email-related MX, SPF, DKIM, and DMARC records were preserved or recreated.
- [ ] DNS propagation was confirmed from more than one network.

## 4. Hosting transfer

| Item | Details |
|---|---|
| Hosting provider | ____________________ |
| Hosting login URL | ____________________ |
| Hosting account owner | ____________________ |
| Hosting plan | ____________________ |
| Document root | ____________________ |
| Deployment method | Upload / Git / CI / Other: __________ |
| Backup method | ____________________ |
| Billing owner | ____________________ |
| Client access confirmed on | ____________________ |

Deployment requirements:

- [ ] Upload the contents of `RERC-website-deployable.zip`.
- [ ] Place `index.html` in the hosting document root.
- [ ] Preserve the folders and case-sensitive paths.
- [ ] Configure directory/index handling so `/about/`, `/resources/`, and
      `/contacts/` load their `index.html` files.
- [ ] Do not upload `.git` or `.vscode` as part of the production site.
- [ ] Confirm the hosting account is owned and billed by the client.
- [ ] Confirm the client can deploy a future update without the original
      developer's personal account.

## 5. HTTPS and redirects

- [ ] Issue or enable an SSL certificate for `psurerc.com`.
- [ ] Issue or enable an SSL certificate for `www.psurerc.com`.
- [ ] Confirm `https://www.psurerc.com` loads without warnings.
- [ ] Redirect `http://psurerc.com` to `https://www.psurerc.com`.
- [ ] Redirect `https://psurerc.com` to `https://www.psurerc.com`, or document
      the approved canonical choice.
- [ ] Redirect the old `.me` domain to the new `.com` domain, if available.
- [ ] Confirm redirects do not create a loop.

## 6. Related website services

| Service | Account/project | New owner/admin | Transfer status |
|---|---|---|---|
| GitHub | `JohnLicode/RERC_static_web` | Client already has access | Complete / Verify |
| EmailJS | ____________________ | ____________________ | Pending / Complete |
| Google Search Console | ____________________ | ____________________ | Pending / Complete |
| Google Analytics, if used | ____________________ | ____________________ | Pending / Complete |
| Official email mailbox | ____________________ | ____________________ | Pending / Complete |

For EmailJS, confirm that the client controls the project used by the contact
form and can change the receiving email address and template. For Google
Search Console, add and verify the new `.com` property and retain the old
property while redirects are active.

## 7. Final acceptance test

- [ ] Homepage loads at `https://www.psurerc.com`.
- [ ] About page loads.
- [ ] Resources page loads.
- [ ] Contacts page loads.
- [ ] Login page loads and its frontend-only limitation is understood.
- [ ] Images load.
- [ ] PDF and Word document downloads work.
- [ ] Contact form successfully sends a test message.
- [ ] Mobile navigation works.
- [ ] HTTPS and redirects work.
- [ ] Client has confirmed access to domain, DNS, hosting, SSL, and EmailJS.

## 8. Acceptance

The client confirms receipt of the static website source code and deployable
files, and confirms that domain and hosting access have been transferred or
verified. The separate system/application, backend, authentication, and
database are excluded from this website handover and will be transferred
separately.

Client representative: ______________________________

Signature: _________________________________________

Date: ______________________________________________

Handover representative: ____________________________

Signature: _________________________________________

Date: ______________________________________________

