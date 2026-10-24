# BrandGuard AI — Team Quantum Rebels

A beginner-friendly MVP prototype for the FutureStack hackathon.

## What works
- Enter a brand name and simple brand rules.
- Check a draft against Avoid, Use, and Fact rules.
- View the matching phrase, rule, explanation, and suggested correction.
- Accept, edit, or reject suggestions.
- View a summary of findings and review status.
- Responsive layout for laptop and mobile browsers.

## Technology
- HTML
- CSS
- Vanilla JavaScript

## Run locally
1. Download or clone this folder.
2. Open `index.html` in a browser, or use the VS Code Live Server extension.
3. Click **Load example**, then **Check content**.

No build step or API key is required.

## Rule formats
Use one rule per line:
- `Avoid: 100% guaranteed results`
- `Use: buyer -> customer`
- `Fact: warranty -> 1 year`

These are simple prototype checks, not comprehensive natural-language understanding. Fact checks use nearby text and may need human review. A result of “no configured rules were triggered” does not guarantee correctness.

## Deployment
### Netlify (simple option)
1. Go to https://app.netlify.com/drop while signed in to your Netlify account.
2. Drag the entire `BrandGuard-AI` folder (containing `index.html`, `style.css`, and `script.js`) into the drop area.
3. Wait for deployment to finish.
4. Open the generated public URL in a private/incognito browser window and test it.
5. Save the public URL for the submission.

If the current Netlify interface no longer supports folder drop, create a new site and follow its manual deploy instructions or connect the GitHub repository.

### GitHub repository
1. Create a new public repository named `BrandGuard-AI`.
2. Upload `index.html`, `style.css`, `script.js`, and `README.md`.
3. Confirm the repository opens when signed out / in a private browser window.
4. Optional: enable GitHub Pages in repository Settings → Pages and select the main branch as the source. Wait for the published URL, then test it.

## Before submission
- Test a correct example, an Avoid-rule example, a preferred-term example, and a fact mismatch.
- Test Accept, Edit, and Reject.
- Check empty draft behaviour.
- Open the live link and repository in a private browser session.
- In the Round 2 PDF, list only features that actually work.
- Do not describe this rule-based version as a trained AI model or claim perfect accuracy.
