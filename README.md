# BrandGuard AI — Round 3 Prototype
**Team:** Quantum Rebels  
**Event:** FutureStack · Round 3  
**Live demo (existing deployment):** https://chic-blancmange-1ca709.netlify.app/

## What it does
BrandGuard is a human-in-the-loop content review prototype. A user writes or pastes a draft, selects or adds brand rules, runs a check, reviews findings, applies wording suggestions, dismisses findings with a human decision, and exports a text report.

### Current implemented features
- Editable draft with scenario presets and word count.
- Three transparent rule types: avoid phrase, preferred wording, and approved fact.
- Case-insensitive phrase matching with word boundaries where appropriate.
- Findings show the rule, matched phrase, occurrence count, and recommendation.
- Human review actions: apply a suggested replacement, insert an approved fact value, or dismiss a finding.
- Rule management: add and remove rules.
- Summary metrics and a downloadable review report.
- Responsive layout for desktop and mobile.
- Local browser-only operation; no login or backend required.

## Important honesty note
Despite the product name, this submission build does **not** connect to a generative AI model or external fact-checking service. The analysis is a lightweight, rule-based JavaScript prototype. Its score is a demonstration heuristic, not a validated quality or safety metric. It can miss context and should never be treated as proof that content is accurate or ready to publish. Human verification is required.

## Run locally
1. Extract the ZIP.
2. Open `index.html` in a modern browser.
3. Choose a scenario or edit the draft.
4. Click **Analyze draft**.
5. Try **Apply suggestion**, **Dismiss finding**, add/delete a rule, then export a report.

No package installation or build process is needed. Internet is not required for the core app; the optional Google font import falls back to system fonts when offline.

## Round 3 judge demo (about 2 minutes)
1. **Problem (15 sec):** Teams can publish inconsistent wording or an outdated fact when content is produced quickly.
2. **Show draft (20 sec):** Keep the default sample; point out “cheapest”, “guarantee”, “customers”, and “established in 2025”.
3. **Run analysis (25 sec):** Click Analyze draft. Explain that each finding maps to an editable rule.
4. **Human-in-the-loop (25 sec):** Apply the suggested replacement for “guarantee”; dismiss an avoid-phrase finding to demonstrate that a person owns the decision.
5. **Customisation (20 sec):** Add an Avoid phrase rule such as “instant results” and re-run analysis.
6. **Report (15 sec):** Export and show the report summary.
7. **Limitations and next step (15 sec):** State clearly that this version uses deterministic rules locally. A next iteration would add a real AI-assisted rewrite layer, verified source-of-truth integrations, authentication, and audit history.

## Architecture
- `index.html`: page structure and accessible controls.
- `style.css`: responsive visual system and component styles.
- `script.js`: scenario data, rule management, deterministic analysis, review actions, metrics, and report export.

## Known limitations
- No backend, persistent account storage, team collaboration, or audit log.
- Fact check only compares the draft with a configured approved value; it does not verify the fact externally.
- Phrase matching is not semantic and may flag context that a person considers acceptable.
- The score is a simple illustrative heuristic and must not be marketed as a validated score.
- Human review remains mandatory.

## Suggested future roadmap
1. **Reliable source of truth:** store approved facts with source URL, owner, and last-reviewed date.
2. **AI-assisted rewrite (optional):** connect an LLM behind a secure backend, with a visible explanation and human approval.
3. **Audit trail:** record original draft, findings, accepted changes, reviewer, and timestamp.
4. **Team workflow:** roles, shared brand rule sets, and exportable evidence.
5. **Evaluation:** build a labelled test set and report precision/recall before making performance claims.

## Team
- Anshika Tripathi
- Anushka Sharma
- Anurag
- Anuj Yadav

Built as a student prototype by Team Quantum Rebels.
