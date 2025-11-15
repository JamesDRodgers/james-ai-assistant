# James D. Rodgers - AI Portfolio Chatbot

An interactive portfolio website with an AI chatbot that answers questions about my background and experience. Built with vanilla JavaScript and deployed on Netlify.

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
- [Cost Breakdown](#cost-breakdown)
- [License](#license)

---

## ✨ Features

### User Interface
- Responsive design for desktop and mobile
- Preset question buttons
- Real-time chat with typing indicators
- Headshot appears with bot responses
- Contact form
- Clear chat history option

### AI Capabilities
- OpenAI GPT-4 Assistant integration
- Custom knowledge base from resume and portfolio
- Context-aware responses
- Clean formatting (no citation markers)
- Markdown support

### Technical
- Serverless functions via Netlify
- Secure API key handling
- Formspree contact form backend
- Custom domain support
- Automatic SSL/HTTPS

---

## 🛠 Tech Stack

- HTML5, CSS3, JavaScript (vanilla)
- Netlify Functions (serverless)
- OpenAI GPT-4 API
- Formspree (contact form)
- Netlify hosting

---

## 📁 Project Structure

```
jamesdrodgers-chatbot/
│
├── index.html                 # Main HTML page
├── style.css                  # All styles and responsive design
├── script.js                  # Chatbot logic and UI interactions
├── headshot.png              # Professional headshot image
│
├── netlify/
│   └── functions/
│       └── chat.js           # Serverless function for OpenAI API
│
├── README.md                 # This file
└── DEPLOYMENT_GUIDE.md       # Detailed deployment instructions
```

---

## 🚀 Setup & Installation

### Prerequisites

1. **OpenAI Account** - Sign up at https://platform.openai.com/
2. **OpenAI Assistant** - Create an assistant with your knowledge base
3. **Netlify Account** - Sign up at https://netlify.com/ (free tier works)
4. **Formspree Account** - Sign up at https://formspree.io/ (free tier works)
5. **Domain** (optional) - Any domain registrar

### Local Development

1. **Clone or Download** the project files

2. **Add Your Headshot**
   ```
   - Name your professional headshot: headshot.png
   - Place it in the root directory
   - Recommended size: 500x500px minimum
   ```

3. **Get Your OpenAI Assistant ID**
   ```
   - Go to https://platform.openai.com/assistants
   - Create or locate your assistant
   - Copy the Assistant ID (starts with "asst_")
   ```

4. **Set Up Formspree**
   ```
   - Go to https://formspree.io/
   - Create a new form
   - Copy the form endpoint URL
   ```

5. **Update Configuration Files**
   
   **In `netlify/functions/chat.js`:**
   ```javascript
   assistant_id: "YOUR_ASSISTANT_ID"  // Replace with your actual assistant ID
   ```
   
   **In `index.html`:**
   ```html
   <form id="contactForm" action="https://formspree.io/f/YOUR_FORM_ID" method="POST">
   ```

6. **Test Locally** (optional)
   ```bash
   # Install Netlify CLI
   npm install -g netlify-cli
   
   # Run local dev server
   netlify dev
   
   # Open browser to localhost:8888
   ```

---

## ⚙️ Configuration

### OpenAI Assistant Setup

Your OpenAI Assistant should be configured with:

**Model:** GPT-4 or GPT-4 Turbo  
**Instructions:** Custom instructions about your background, experience, and communication style  
**Knowledge Files:** Upload your resume, portfolio, and any relevant documents  
**Temperature:** 0.7-0.8 (balanced between creativity and consistency)  
**Top P:** 0.8 (recommended for professional tone)

See `assistant_config_improved.json` for a complete example configuration.

### Environment Variables

Set these in your Netlify dashboard (Site settings → Environment variables):

| Variable | Description | Example |
|----------|-------------|---------|
| `OPENAI_API_KEY` | Your OpenAI API key | `sk-proj-...` |

### Customization Options

**In `index.html`:**
- Update preset questions to match your focus areas
- Modify intro text to reflect your personality
- Change contact form fields as needed

**In `style.css`:**
- Adjust color scheme (search for `#6f93ff` to find primary color)
- Modify spacing, fonts, or animations
- Customize mobile breakpoints

**In `script.js`:**
- Adjust typing indicator speed
- Modify success message timing
- Customize error handling messages

---

## 🌐 Deployment

### Option 1: Manual Deployment (Easiest)

1. **Prepare Your Files**
   ```
   Create a folder with:
   - index.html
   - style.css
   - script.js
   - headshot.png
   - netlify/functions/chat.js
   ```

2. **Deploy to Netlify**
   ```
   - Go to https://app.netlify.com/
   - Click "Add new site" → "Deploy manually"
   - Drag your project folder to the upload area
   - Wait for deployment to complete
   ```

3. **Add Environment Variables**
   ```
   - Go to Site configuration → Environment variables
   - Add: OPENAI_API_KEY = your-api-key
   - Click "Deploy" → "Trigger deploy" → "Deploy site"
   ```

4. **Connect Custom Domain** (optional)
   ```
   - Go to Domain management → Add domain
   - Enter your domain (e.g., jamesdrodgers.ai)
   - Follow DNS configuration instructions
   - Wait for SSL certificate (automatic)
   ```

### Option 2: GitHub Deployment (Recommended for Updates)

1. **Create GitHub Repository**
   ```bash
   # Using GitHub Desktop (easiest)
   # Or via command line:
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/yourusername/your-repo.git
   git push -u origin main
   ```

2. **Connect to Netlify**
   ```
   - Netlify → Add new site → Import from Git
   - Choose GitHub
   - Select your repository
   - Build settings:
     - Build command: (leave empty)
     - Publish directory: .
     - Functions directory: netlify/functions
   - Click "Deploy site"
   ```

3. **Add Environment Variables & Domain**
   (Same as Option 1, steps 3-4)

### DNS Configuration

**For Squarespace Domains:**

1. Go to Squarespace → Settings → Domains → [your domain]
2. Click "DNS Settings"
3. Choose one method:

**Method A: Netlify DNS (Recommended)**
- Change nameservers to Netlify's nameservers
- Netlify provides nameservers during domain setup
- Netlify manages all DNS automatically

**Method B: A Records**
- Add A record: @ → 75.2.60.5
- Add CNAME record: www → [your-site].netlify.app
- Keep other DNS with Squarespace

DNS propagation can take 5 minutes to 48 hours (usually 1-4 hours).

---

## 🎨 Customization

### Changing Colors

The primary color is `#6f93ff` (blue). To change it:

1. Search for `#6f93ff` in `style.css`
2. Replace with your preferred color
3. Also update gradient pairs: `#5a7cdb`, `#4a6bc5`

### Updating Preset Questions

Edit the preset buttons in `index.html`:

```html
<button class="preset-btn" onclick="setPresetQuestion(this)">
  💡 Your custom question here
</button>
```

Tips:
- Keep questions concise (under 60 characters)
- Use emojis to add visual interest
- Focus on your strongest areas

### Modifying the Assistant

To update how the chatbot responds:

1. Go to https://platform.openai.com/assistants
2. Edit your assistant's instructions
3. Upload new knowledge files
4. Adjust temperature/top_p settings
5. Changes take effect immediately (no redeployment needed)

### Adding New Features

**Analytics:**
```html
<!-- Add to <head> in index.html -->
<script async src="https://www.googletagmanager.com/gtag/js?id=YOUR-GA-ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'YOUR-GA-ID');
</script>
```

**Favicon:**
```html
<!-- Add to <head> in index.html -->
<link rel="icon" type="image/png" href="favicon.png">
```

**Social Media Meta Tags:**
```html
<!-- Add to <head> in index.html -->
<meta property="og:title" content="James D. Rodgers - AI Portfolio">
<meta property="og:description" content="Interactive AI-powered portfolio">
<meta property="og:image" content="https://yourdomain.com/preview.png">
```

---

## 🐛 Troubleshooting

### Chatbot Not Responding

**Symptoms:** User sends message, but no response appears

**Solutions:**
1. Check OpenAI API key is set in Netlify environment variables
2. Verify API key has credits: https://platform.openai.com/usage
3. Check Netlify function logs: Functions → chat → View logs
4. Verify assistant ID in `chat.js` is correct
5. Check browser console (F12) for errors

### Contact Form Not Working

**Symptoms:** "Error sending message" alert appears

**Solutions:**
1. Verify Formspree form ID in `index.html` is correct
2. Check Formspree dashboard for submissions
3. Verify email address in Formspree is confirmed
4. Test form directly on Formspree website
5. Check browser console for CORS errors

### Images Not Loading

**Symptoms:** Headshot doesn't appear, broken image icons

**Solutions:**
1. Verify `headshot.png` is in root directory
2. Check filename is exactly `headshot.png` (case-sensitive)
3. Ensure image is a valid PNG/JPG format
4. Try clearing browser cache
5. Check Netlify deploy log for file upload confirmation

### Domain Not Working

**Symptoms:** Site not loading at custom domain

**Solutions:**
1. Check DNS propagation: https://dnschecker.org/
2. Verify nameservers or A records are correct
3. Wait up to 48 hours for DNS to propagate
4. Check SSL certificate status in Netlify
5. Try accessing via www and non-www versions

### Styling Issues

**Symptoms:** Layout broken, buttons not clickable, elements overlapping

**Solutions:**
1. Clear browser cache (Ctrl+Shift+R or Cmd+Shift+R)
2. Verify all CSS files uploaded correctly
3. Check browser console for CSS errors
4. Test in incognito/private browsing mode
5. Try different browser to isolate issue

### Function Errors

**Symptoms:** "Function execution failed" or 500 errors

**Solutions:**
1. Check function logs in Netlify dashboard
2. Verify OpenAI API key format (starts with `sk-`)
3. Test API key directly: https://platform.openai.com/playground
4. Check network tab in browser devtools
5. Verify assistant ID hasn't changed

---

## 💰 Cost Breakdown

### Monthly Costs

| Service | Plan | Cost |
|---------|------|------|
| Netlify | Free tier | $0 |
| OpenAI API | Pay-as-you-go | $0-5 |
| Formspree | Free tier (50 submissions/mo) | $0 |
| **Total** | | **~$0-5/month** |

### Annual Costs

| Service | Cost |
|---------|------|
| Domain (jamesdrodgers.ai) | $85/2 years |
| **Total annual** | **~$42.50/year** |

### Scaling Costs

**If you exceed free tiers:**
- Netlify Pro: $19/month (300GB bandwidth, more build minutes)
- Formspree Pro: $10/month (unlimited submissions)
- OpenAI usage scales with conversations (~$0.01-0.05 per conversation)

**Typical usage for portfolio site:**
- 100-500 visitors/month: Stays within free tiers
- 1,000+ visitors/month: May need Netlify Pro ($19/mo)

---

## 📊 Analytics & Monitoring

### Recommended Tools

**Google Analytics** - Track visitor behavior  
**Netlify Analytics** - Built-in traffic stats ($9/month)  
**OpenAI Usage Dashboard** - Monitor API costs  
**Formspree Dashboard** - Track form submissions  

### Key Metrics to Track

- Total conversations started
- Most common questions (check OpenAI logs)
- Form submission rate
- Bounce rate vs. engagement
- Top traffic sources

---

## 🔒 Security Best Practices

1. **Never commit API keys** - Always use environment variables
2. **Use HTTPS** - Netlify provides this automatically
3. **Monitor API usage** - Set up billing alerts in OpenAI
4. **Rate limiting** - Consider adding if you get high traffic
5. **Spam protection** - Formspree includes basic filtering
6. **Keep dependencies updated** - Check for OpenAI API updates

---

## 🔄 Maintenance

### Regular Tasks

**Weekly:**
- Check Formspree for new submissions
- Monitor OpenAI API costs

**Monthly:**
- Review OpenAI conversation logs for improvements
- Update assistant knowledge base with new info
- Check analytics for user behavior insights

**Quarterly:**
- Review and update preset questions
- Refresh assistant instructions based on feedback
- Update resume/portfolio documents

**Annually:**
- Renew domain registration
- Review hosting costs vs. alternatives
- Major design refresh (optional)

---

## 📚 Additional Resources

### Documentation
- [OpenAI Assistants API](https://platform.openai.com/docs/assistants/overview)
- [Netlify Functions](https://docs.netlify.com/functions/overview/)
- [Formspree Documentation](https://help.formspree.io/)
- [Netlify Deployment](https://docs.netlify.com/site-deploys/overview/)

### Tutorials
- [OpenAI Assistant Builder](https://platform.openai.com/assistants)
- [Netlify DNS Setup](https://docs.netlify.com/domains-https/custom-domains/)
- [JavaScript Fetch API](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API)

### Community
- [OpenAI Community Forum](https://community.openai.com/)
- [Netlify Community](https://answers.netlify.com/)
- [Web Development on Reddit](https://reddit.com/r/webdev)

---

## 🤝 Contributing

This is a personal portfolio project, but if you'd like to use it as a template:

1. Fork the repository
2. Customize for your own portfolio
3. Update all personal information
4. Deploy to your own Netlify account

### Attribution

If you use this as a template, a link back to the original project would be appreciated but not required.

---

## 📝 License

This project is open source and available for personal and commercial use.

**You are free to:**
- Use this code for your own portfolio
- Modify and adapt it to your needs
- Deploy it commercially

**Please:**
- Replace all personal information with your own
- Use your own OpenAI API key
- Set up your own Formspree account

---

## 📧 Contact

**James D. Rodgers**  
Email: jdevin.rodgers@gmail.com  
LinkedIn: [linkedin.com/in/jdevinrodgers](https://linkedin.com/in/jdevinrodgers)  
GitHub: [github.com/jdevinrodgers](https://github.com/jdevinrodgers)  
Website: [jamesdrodgers.ai](https://jamesdrodgers.ai)

---



Built with OpenAI GPT-4 API, Netlify, Formspree, and assistance from Claude (Anthropic).

---

## 📋 Quick Start Checklist

- [ ] OpenAI account and assistant created
- [ ] Formspree form created
- [ ] Netlify account created
- [ ] Headshot image ready (headshot.png)
- [ ] Files updated with your IDs
- [ ] Uploaded to Netlify
- [ ] Environment variables added
- [ ] Tested chatbot and contact form
- [ ] DNS configured (if using custom domain)

---

Questions? Email me at jdevin.rodgers@gmail.com
