# FutureStack Round 3 — Submission & Demo Pack
**Project:** BrandGuard AI  
**Team:** Quantum Rebels  
**Live URL:** https://chic-blancmange-1ca709.netlify.app/

> Use this as a preparation guide. Match every answer to the exact fields in the official Round 3 form. Do not claim that a feature is complete unless your deployed version demonstrates it.

## 1. Short project description
BrandGuard AI is a human-in-the-loop brand compliance prototype that helps a content reviewer check draft copy against custom wording rules and approved facts before publication. It flags potential issues, suggests preferred wording, and keeps the final decision with a human reviewer.

## 2. Problem statement
Content teams create copy for social media, product pages, and announcements under time pressure. Different writers can use inconsistent brand language or repeat facts that no longer match the approved messaging. A lightweight pre-publication review can make these issues more visible before a person approves the draft.

## 3. Solution and workflow
1. Enter or paste a draft.
2. Choose or configure brand rules.
3. Run the local analysis.
4. Inspect each flagged phrase or fact mismatch.
5. Accept a wording suggestion, insert an approved value, or dismiss a finding.
6. Export a report and complete a human review before publication.

## 4. Technology and implementation
- HTML: page structure and form controls.
- CSS: responsive interface, cards, navigation, and review states.
- JavaScript: rule configuration, case-insensitive phrase matching, simple approved-value checks, finding states, score heuristic, and report export.
- Deployment: existing Netlify-hosted demo; the ZIP can also be opened locally.
- Data flow: current prototype processes draft text in the browser; no backend or external AI API is connected.

## 5. What is working in this build
- Scenario presets and editable content draft.
- Add/delete rules for avoid phrases, preferred wording, and approved facts.
- Run analysis and show matching findings.
- Apply replacement suggestions and insert configured fact values.
- Mark findings as dismissed or accepted.
- Filter findings by status.
- View, copy, and download a review summary.
- Responsive layout and local-first demo behavior.

## 6. What is not implemented yet
- No actual LLM-powered analysis or generative rewrite.
- No external source verification or live fact database.
- No user login, cloud persistence, team collaboration, or audit history.
- The score is a demo heuristic and is not a validated metric.

Being precise about this is a strength: it shows the team understands its current technical boundary and has a realistic plan.

## 7. Three improvements to propose for the next round
1. **Source-linked facts:** every approved fact will store its source, owner, and review date, so reviewers can verify the origin rather than trust a text match alone.
2. **AI-assisted rewrite with approval:** add a backend-connected language model to explain issues and offer contextual rewrites, while requiring a human to approve every change.
3. **Audit trail and evaluation:** save before/after versions and reviewer actions, then evaluate on a labelled set of sample drafts and report measured precision/recall rather than relying on a heuristic score.

## 8. Two-minute demo script
**Opening:** “BrandGuard is a pre-publication checkpoint for brand language. Our focus is not automatic publishing; it is making possible issues visible while keeping a human in control.”

**Show the draft:** “This sample includes a risky superlative, a guarantee, and a year that conflicts with our configured approved fact.”

**Run review:** Click **Analyze draft**. “Each finding points back to a rule, so the reviewer can understand why it appeared.”

**Human decision:** Click **Apply suggestion** on the preferred wording finding, then dismiss another finding. “Suggestions are not silently published. A reviewer chooses what to accept or dismiss.”

**Custom rule:** Add an avoid phrase and run the analysis again. “The rule set can be adjusted to a particular brand's language.”

**Report:** Open **Export report** and download the text file. “The report records the review state and includes the limitations.”

**Close:** “This is a rule-based prototype today. Our next step is source-linked facts, optional AI-assisted rewriting behind a backend, and an audit trail. We will evaluate those features with a labelled test set before making accuracy claims.”

## 9. Likely judge questions and honest answers
**Q: Is this really AI?**  
A: “The current build is a rule-based prototype, not a connected LLM. We use AI in the project direction, but we are not claiming that the current matching engine is generative AI. The next step is to add an optional AI layer with human approval.”

**Q: How do you verify facts?**  
A: “Right now, a rule stores an approved value and checks whether the draft contains it. It does not verify the fact on the internet. We plan to attach source links and review dates to facts.”

**Q: Why keep a human in the loop?**  
A: “A phrase can be acceptable in one context and risky in another. The reviewer should see the reason and decide whether to apply or dismiss the suggestion.”

**Q: How do you measure accuracy?**  
A: “We do not yet have a validated accuracy metric. We plan to create labelled examples, compare findings against human labels, and report precision and recall. The current score is only a UI heuristic.”

**Q: What is technically different from a simple spell-checker?**  
A: “The prototype lets a team configure brand-specific rules, check approved values, review each finding, apply changes, and export a review summary. Semantic analysis and integrations are planned rather than claimed as implemented.”

**Q: What happens to draft text?**  
A: “In this build, analysis happens in the browser and there is no backend or external AI call. The report is generated locally.”

## 10. Final submission checklist
- [ ] Open the live URL on a phone and laptop; check all controls before submitting.
- [ ] Confirm the repository URL is accessible to judges and contains the same files as the demo.
- [ ] Make sure `index.html`, `style.css`, and `script.js` are in the repository root.
- [ ] Upload a current project PDF/description if the form asks for it.
- [ ] Include a short demo video or screenshots only if requested/allowed by the form.
- [ ] Verify every field in the official form and submit before the deadline.
- [ ] Save a copy/screenshot of the submission confirmation.
- [ ] Do not claim AI integration, external fact verification, or persistent audit logging unless actually built and tested.

## 11. Suggested repository description
BrandGuard AI is a human-in-the-loop brand compliance prototype. It checks draft copy against editable phrase and approved-fact rules, surfaces findings, supports reviewer decisions, and exports a local review report. Current analysis is deterministic and browser-based.
