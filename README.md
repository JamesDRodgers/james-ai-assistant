# James D. Rodgers — AI Portfolio

An interactive portfolio site with an AI chatbot that answers questions about my background, projects, and experience — built as a static site with [Eleventy](https://www.11ty.dev/), backed by a Netlify Function calling the Anthropic Claude API, and deployed on Netlify.

Live at: https://jamesdrodgers.ai

---

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Setup & Installation](#setup--installation)
- [Configuration](#configuration)
- [Deployment](#deployment)
- [Customization](#customization)
- [Troubleshooting](#troubleshooting)
- [License](#license)

---

## ✨ Features

### User interface
- Responsive design for desktop and mobile
- Preset suggestion chips for common questions
- Real-time chat with a typing indicator
- Markdown-style link rendering, so the chatbot can point visitors to specific portfolio/case-study pages
- Contact form (Formspree-backed)

### AI capabilities
- Powered by Anthropic's Claude (Sonnet 5) via the Messages API
- The full knowledge base — resume, portfolio project write-ups, bio, skills self-assessment — is inlined directly in the system prompt (`netlify/functions/system-prompt.js`), so there's no separate "upload documents to a retrieval store" step to keep in sync
- Instructed to link back to relevant case-study pages when it's genuinely useful

### Technical
- Static site built with Eleventy (Nunjucks templates for the four core pages; case-study pages are hand-authored HTML, passed through unchanged)
- Serverless chat backend via Netlify Functions
- Secure API key handling (server-side only, never exposed to the browser)
- Formspree contact form backend
- Custom domain with automatic SSL/HTTPS

---

## 🛠 Tech Stack

- [Eleventy](https://www.11ty.dev/) (static site generator) + Nunjucks templates
- HTML5, CSS3, vanilla JavaScript
- Netlify Functions (serverless)
- [Anthropic Claude API](https://platform.claude.com/) (Sonnet 5)
- Formspree (contact form)
- Netlify hosting

---

## 📁 Project Structure

```
james-ai-assistant/
│
├── src/                          # Eleventy source — only the 4 templated pages
│   ├── index.njk                 # Homepage / chatbot
│   ├── portfolio.njk             # Featured work
│   ├── resume.njk                # Resume
│   ├── jamesrodgers.njk          # About
│   ├── _includes/partials/
│   │   └── head.njk              # Shared <head> meta partial (title/description/OG/Twitter/font)
│   └── assets/
│       ├── css/                  # One stylesheet per templated page
│       └── js/chat.js            # Chatbot UI logic
│
├── netlify/functions/
│   ├── chat.js                   # Serverless function — calls the Anthropic Messages API
│   └── system-prompt.js          # Full inlined knowledge base + persona/behavior instructions
│
├── *.html                        # Case-study / project pages (bespoke, one-off designs,
│                                  # copied through by Eleventy unchanged — see .eleventy.js)
├── swim/                         # Interactive swim-science tools (linked from the swim
│                                  # science case study)
│
├── .eleventy.js                  # Eleventy config: input/output dirs + passthrough copy list
├── netlify.toml                  # Netlify build config (build command, publish dir, functions dir)
├── package.json
└── README.md                     # This file
```

Eleventy only processes the four core pages under `src/`. The case-study pages, images, and PDFs at the repo root are copied through as-is via `addPassthroughCopy` in `.eleventy.js` — they're standalone documents that don't share structure with the templated pages, so there's nothing to gain from converting them.

---

## 🚀 Setup & Installation

### Prerequisites

1. **Node.js** (for running Eleventy locally)
2. **Anthropic account** — sign up at https://console.anthropic.com/ and create an API key
3. **Netlify account** — sign up at https://netlify.com/ (free tier works)
4. **Formspree account** (optional, for the contact form) — https://formspree.io/

### Local development

```bash
# Install dependencies
npm install

# Build the site
npm run build

# Build and serve locally with live reload
npm start
```

Note: the chatbot itself won't work with a plain static server (`npm start` only serves the built HTML/CSS/JS) — it needs the Netlify Function running. Use the [Netlify CLI](https://docs.netlify.com/cli/get-started/) for a full local test:

```bash
npm install -g netlify-cli
netlify dev
```

This serves the site *and* runs `netlify/functions/chat.js` locally, reading `ANTHROPIC_API_KEY` from a local `.env` file if you create one (don't commit it).

---

## ⚙️ Configuration

### Environment variable

Set this in your Netlify dashboard (**Site/Project configuration → Environment variables**):

| Variable | Description | Example |
|----------|-------------|---------|
| `ANTHROPIC_API_KEY` | Your Anthropic API key | `sk-ant-...` |

### Updating what the chatbot knows

The chatbot's entire knowledge base lives in `netlify/functions/system-prompt.js` as a single exported string — resume, portfolio project summaries (with their real URLs so the bot can link to them), bio, and behavior/tone instructions. To update what it knows or how it talks:

1. Edit `SYSTEM_PROMPT` in `netlify/functions/system-prompt.js`
2. Commit and push — no separate "upload documents" step, no retraining, no dashboard to keep in sync

### Customization options

**In `src/index.njk`:**
- Update the suggestion chips and welcome message to match your focus areas
- Edit the sidebar profile text

**In `src/assets/css/*.css`:**
- Each templated page has its own stylesheet — `chat.css` (homepage), `portfolio.css`, `resume.css`, `jamesrodgers.css`
- Search for `--primary-color` (chat.css) or `--accent` (the others) to find each page's primary color

**In `src/assets/js/chat.js`:**
- Adjust the typing indicator speed
- Customize error handling messages
- `formatMessage()` handles `**bold**` and `[text](url)` links — extend it here if you want more markdown support

---

## 🌐 Deployment

This repo deploys to Netlify via Git — Netlify builds automatically on every push using the config in `netlify.toml`:

```toml
[build]
  command = "npx @11ty/eleventy"
  publish = "_site"
  functions = "netlify/functions"
```

### First-time setup

1. **Netlify → Add new site → Import from Git**, select this repository
2. Netlify will read `netlify.toml` automatically — no manual build settings needed
3. Add the `ANTHROPIC_API_KEY` environment variable (see [Configuration](#configuration))
4. Deploy

### Custom domain

**Domain management → Add domain**, then follow Netlify's DNS instructions (either point nameservers at Netlify, or add an A record + CNAME per Netlify's guidance). SSL certificates are issued automatically.

---

## 🎨 Customization

### Changing colors

Each templated page has its own CSS custom properties block at the top of its stylesheet (`src/assets/css/*.css`). Update the `:root { ... }` values there.

### Updating preset questions

Edit the suggestion chips in `src/index.njk`:

```html
<button class="chip" onclick="sendChip(this)">Your custom question here</button>
```

Keep questions short and specific — questions the system prompt can actually answer in depth (a named project, a named employer, a concrete fact) make for a much better first impression than generic ones.

### Adding a new portfolio case study

1. Add the new HTML page at the repo root (or wherever makes sense)
2. Add an `eleventyConfig.addPassthroughCopy("your-new-page.html")` line in `.eleventy.js`
3. Add a summary + its URL to `netlify/functions/system-prompt.js` so the chatbot can discuss and link to it
4. Add a card for it on `src/portfolio.njk`

---

## 🐛 Troubleshooting

### Chatbot not responding

**Symptoms:** User sends a message, but no response appears

**Solutions:**
1. Check `ANTHROPIC_API_KEY` is set in Netlify's environment variables
2. Verify the key is valid and has available credits/quota at https://console.anthropic.com/
3. Check Netlify function logs: **Functions → chat → View logs**
4. Check the browser console (F12) for errors

### Contact form not working

**Symptoms:** "Error sending message" alert appears

**Solutions:**
1. Verify the Formspree form ID in `src/index.njk` is correct
2. Check the Formspree dashboard for submissions
3. Check the browser console for CORS errors

### Images not loading

**Symptoms:** Headshot doesn't appear, broken image icons

**Solutions:**
1. Confirm the image exists at the repo root and is listed in `.eleventy.js`'s passthrough copy config
2. Check the Netlify deploy log for file upload confirmation

### Styling issues

**Symptoms:** Layout broken, buttons not clickable, elements overlapping

**Solutions:**
1. Clear your browser cache (Ctrl+Shift+R / Cmd+Shift+R)
2. Confirm the build succeeded — check the Netlify deploy log for Eleventy build errors
3. Test in incognito/private browsing mode

### Function errors

**Symptoms:** "Function execution failed" or 500 errors

**Solutions:**
1. Check function logs in the Netlify dashboard
2. Verify the API key format (starts with `sk-ant-`)
3. Check the Netlify function's response body — errors are returned as JSON with a `note` field pointing at `netlify/functions/chat.js`

---

## 🔒 Security Best Practices

1. **Never commit API keys** — always use environment variables
2. **Use HTTPS** — Netlify provides this automatically
3. **Monitor API usage** — set up usage alerts in the Anthropic console
4. **Keep dependencies updated** — check `npm outdated` periodically

---

## 📧 Contact

**James D. Rodgers**
Email: jdevin.rodgers@gmail.com
LinkedIn: [linkedin.com/in/jdevinrodgers](https://linkedin.com/in/jdevinrodgers)
Website: [jamesdrodgers.ai](https://jamesdrodgers.ai)

---

## 📝 License

This project is open source and available for personal and commercial use. If you use it as a template, please replace all personal information with your own and use your own API keys.

---

Built with Eleventy, the Anthropic Claude API, Netlify, and Formspree.
