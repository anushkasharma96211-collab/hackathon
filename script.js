const $ = (id) => document.getElementById(id);
let currentIssues = [];
let originalDraft = "";

function parseRules(text) {
  return text.split(/\r?\n/).map(line => line.trim()).filter(Boolean).map((line, index) => {
    if (/^avoid\s*:/i.test(line)) {
      return { type: "avoid", raw: line, value: line.replace(/^avoid\s*:/i, "").trim(), index };
    }
    if (/^use\s*:/i.test(line)) {
      const value = line.replace(/^use\s*:/i, "").trim();
      const parts = value.split(/\s*->\s*/);
      if (parts.length === 2 && parts[0] && parts[1]) return { type: "use", raw: line, old: parts[0], preferred: parts[1], index };
    }
    if (/^fact\s*:/i.test(line)) {
      const value = line.replace(/^fact\s*:/i, "").trim();
      const parts = value.split(/\s*->\s*/);
      if (parts.length === 2 && parts[0] && parts[1]) return { type: "fact", raw: line, topic: parts[0], approved: parts[1], index };
    }
    return { type: "invalid", raw: line, index };
  });
}

function replaceAllInsensitive(text, search, replacement) {
  if (!search) return text;
  return text.replace(new RegExp(search.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "gi"), replacement);
}

function checkContent() {
  const draft = $("draft").value.trim();
  const brand = $("brandName").value.trim() || "your brand";
  const rules = parseRules($("rules").value);
  if (!draft) {
    $("inputHint").textContent = "Please enter a draft before checking.";
    $("draft").focus();
    return;
  }
  const invalidRules = rules.filter(r => r.type === "invalid");
  if (!rules.some(r => r.type !== "invalid")) {
    $("inputHint").textContent = "Add at least one valid rule using the formats shown above.";
    $("rules").focus();
    return;
  }
  $("inputHint").textContent = invalidRules.length
    ? `${invalidRules.length} rule line(s) could not be understood and were skipped.`
    : "Checks completed using the rules you supplied.";
  originalDraft = draft;
  currentIssues = [];
  const lowerDraft = draft.toLowerCase();

  rules.forEach(rule => {
    if (rule.type === "avoid" && rule.value && lowerDraft.includes(rule.value.toLowerCase())) {
      currentIssues.push({
        id: crypto.randomUUID ? crypto.randomUUID() : String(Date.now() + Math.random()),
        type: "Prohibited wording",
        phrase: rule.value,
        reason: `This phrase matches the Avoid rule: “${rule.value}”. Review whether the claim is approved for ${brand}.`,
        suggestion: "Replace this with a specific, verified benefit approved by the brand.",
        status: "pending",
        rule: rule.raw
      });
    }
    if (rule.type === "use" && rule.old && lowerDraft.includes(rule.old.toLowerCase())) {
      currentIssues.push({
        id: crypto.randomUUID ? crypto.randomUUID() : String(Date.now() + Math.random()),
        type: "Preferred terminology",
        phrase: rule.old,
        reason: `The brand rule prefers “${rule.preferred}” instead of “${rule.old}”.`,
        suggestion: rule.preferred,
        status: "pending",
        rule: rule.raw
      });
    }
    if (rule.type === "fact" && rule.topic && lowerDraft.includes(rule.topic.toLowerCase())) {
      const topicRegex = new RegExp(rule.topic.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i");
      const topicMatch = draft.match(topicRegex);
      const topicIndex = topicMatch ? topicMatch.index : -1;
      const context = topicIndex >= 0 ? draft.slice(Math.max(0, topicIndex - 35), Math.min(draft.length, topicIndex + rule.topic.length + 75)) : "";
      if (context && !context.toLowerCase().includes(rule.approved.toLowerCase())) {
        currentIssues.push({
          id: crypto.randomUUID ? crypto.randomUUID() : String(Date.now() + Math.random()),
          type: "Approved fact check",
          phrase: context.trim(),
          reason: `The approved fact for “${rule.topic}” is “${rule.approved}”. This nearby text does not contain the approved value, so verify it before publishing.`,
          suggestion: `Check the statement about ${rule.topic} and use the approved value: ${rule.approved}.`,
          status: "pending",
          rule: rule.raw
        });
      }
    }
  });
  renderResults();
}

function renderResults() {
  const pending = currentIssues.filter(i => i.status === "pending").length;
  const accepted = currentIssues.filter(i => i.status === "accepted").length;
  const rejected = currentIssues.filter(i => i.status === "rejected").length;
  $("summaryPill").textContent = currentIssues.length ? `${currentIssues.length} finding(s)` : "No known issues found";
  $("summaryCards").innerHTML = `
    <div class="summary-card"><span>Findings</span><strong>${currentIssues.length}</strong></div>
    <div class="summary-card"><span>Pending review</span><strong>${pending}</strong></div>
    <div class="summary-card"><span>Reviewed</span><strong>${accepted + rejected}</strong></div>`;
  const results = $("results");
  if (!currentIssues.length) {
    results.innerHTML = `<div class="empty-state"><div class="empty-icon">✓</div><h3>No configured rules were triggered</h3><p>This does not prove the draft is correct. Review it against your full brand guidelines before publishing.</p></div>`;
    return;
  }
  results.innerHTML = "";
  currentIssues.forEach(issue => {
    const card = document.createElement("article");
    card.className = "issue";
    const top = document.createElement("div");
    top.className = "issue-top";
    const icon = document.createElement("div");
    icon.className = "issue-icon";
    icon.textContent = issue.status === "accepted" ? "✓" : issue.status === "rejected" ? "×" : "!";
    const content = document.createElement("div");
    content.style.flex = "1";
    const title = document.createElement("h3");
    title.textContent = issue.type;
    const ruleLabel = document.createElement("div");
    ruleLabel.className = "rule-label";
    ruleLabel.textContent = issue.status === "pending" ? "Needs human review" : issue.status === "accepted" ? "Suggestion accepted" : "Suggestion rejected";
    const phrase = document.createElement("p");
    phrase.innerHTML = "Flagged text: ";
    const span = document.createElement("span");
    span.className = "phrase";
    span.textContent = issue.phrase;
    phrase.appendChild(span);
    const reason = document.createElement("p");
    reason.textContent = issue.reason;
    const rule = document.createElement("p");
    rule.textContent = `Rule: ${issue.rule}`;
    content.append(title, ruleLabel, phrase, reason, rule);
    top.append(icon, content);
    card.append(top);

    if (issue.status === "pending") {
      const suggestionLabel = document.createElement("label");
      suggestionLabel.className = "suggestion-label";
      suggestionLabel.textContent = "Suggested correction";
      const suggestion = document.createElement("div");
      suggestion.className = "suggestion";
      suggestion.textContent = issue.suggestion;
      const edit = document.createElement("textarea");
      edit.className = "edit-area";
      edit.value = issue.suggestion;
      edit.hidden = true;
      const actions = document.createElement("div");
      actions.className = "issue-actions";
      const accept = makeButton("Accept", "small-button accept", () => applySuggestion(issue.id, edit.hidden ? issue.suggestion : edit.value));
      const editBtn = makeButton("Edit suggestion", "small-button", () => {
        edit.hidden = !edit.hidden;
        editBtn.textContent = edit.hidden ? "Edit suggestion" : "Hide editor";
        if (!edit.hidden) edit.focus();
      });
      const reject = makeButton("Reject", "small-button reject", () => setStatus(issue.id, "rejected"));
      actions.append(accept, editBtn, reject);
      card.append(suggestionLabel, suggestion, edit, actions);
    } else {
      const status = document.createElement("div");
      status.className = "status-note";
      status.textContent = issue.status === "accepted" ? "Accepted suggestion was applied to the draft." : "Suggestion dismissed; the draft was not changed.";
      card.append(status);
    }
    results.append(card);
  });
}

function makeButton(label, className, action) {
  const button = document.createElement("button");
  button.type = "button";
  button.className = className;
  button.textContent = label;
  button.addEventListener("click", action);
  return button;
}

function applySuggestion(id, suggestion) {
  const issue = currentIssues.find(i => i.id === id);
  if (!issue) return;
  if (!suggestion.trim()) {
    alert("Please enter a correction before accepting.");
    return;
  }
  const draft = $("draft").value;
  if (issue.type === "Preferred terminology") {
    $("draft").value = replaceAllInsensitive(draft, issue.phrase, suggestion.trim());
  } else if (issue.type === "Prohibited wording") {
    $("draft").value = replaceAllInsensitive(draft, issue.phrase, suggestion.trim());
  } else {
    // For a context-based fact finding, insert the human-reviewed suggestion at the end
    // rather than silently replacing a potentially ambiguous sentence.
    $("draft").value = draft + "\n\n[Reviewed suggestion: " + suggestion.trim() + "]";
  }
  issue.status = "accepted";
  issue.suggestion = suggestion.trim();
  renderResults();
}

function setStatus(id, status) {
  const issue = currentIssues.find(i => i.id === id);
  if (issue) issue.status = status;
  renderResults();
}

$("checkButton").addEventListener("click", checkContent);
$("clearDraft").addEventListener("click", () => {
  $("draft").value = "";
  $("draft").focus();
});
$("loadExample").addEventListener("click", () => {
  $("brandName").value = "NovaTech";
  $("rules").value = "Avoid: 100% guaranteed results\nUse: buyer -> customer\nFact: warranty -> 1 year";
  $("draft").value = "NovaTech guarantees 100% guaranteed results for every buyer. Our warranty is five years.";
  $("inputHint").textContent = "Example loaded. Click Check content to run the demo.";
});
