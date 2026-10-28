(() => {
  "use strict";
  const $ = (id) => document.getElementById(id);
  const scenarios = {
    social: "We are excited to announce our new service! It is the cheapest option on the market and we guarantee instant results for every customer. Our company was established in 2025 and we are changing the future.",
    press: "FOR IMMEDIATE RELEASE: BrandGuard launches a new content review tool. Established in 2025, the team guarantees that every draft is perfect. The product helps customers review messaging before publication.",
    product: "Meet the cheapest tool for every team. We guarantee 100% accurate results and instant compliance. Established in 2025, our product helps users publish better content with confidence.",
    blank: ""
  };
  let rules = [
    {id:1,type:"avoid",term:"cheapest",value:"",label:"Avoid phrase"},
    {id:2,type:"replace",term:"guarantee",value:"aim to help",label:"Preferred wording"},
    {id:3,type:"replace",term:"customers",value:"people and teams",label:"Preferred wording"},
    {id:4,type:"fact",term:"established in",value:"2024",label:"Approved fact"},
    {id:5,type:"avoid",term:"100% accurate",value:"",label:"Avoid phrase"}
  ];
  let findings = [];
  let hasRun = false;
  let nextRuleId = 6;
  let nextFindingId = 1;
  let toastTimer;

  const escapeHtml = (value) => String(value).replace(/[&<>"']/g, ch => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[ch]));
  const countWords = (text) => (text.trim().match(/\S+/g) || []).length;
  function wordRegex(term) {
    const escaped = term.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const left = /^[\w]/.test(term) ? "\\b" : "";
    const right = /[\w]$/.test(term) ? "\\b" : "";
    return new RegExp(left + escaped + right, "gi");
  }
  function showToast(message) {
    const toast = $("toast");
    toast.textContent = message;
    toast.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove("show"), 2600);
  }
  function updateWordCount() {
    $("wordCount").textContent = `${countWords($("draftText").value)} words`;
  }
  function updateRuleCounts() {
    $("heroRuleCount").textContent = rules.length;
    $("ruleCountSide").textContent = rules.length;
  }
  function renderRules() {
    updateRuleCounts();
    const list = $("rulesList");
    if (!rules.length) {
      list.innerHTML = '<div class="empty-state"><strong>No active rules</strong><p>Add a rule below to begin checking content.</p></div>';
      return;
    }
    list.innerHTML = rules.map(rule => {
      const title = rule.type === "fact" ? `Fact: ${rule.term}` : rule.type === "replace" ? `Prefer: ${rule.term}` : `Avoid: ${rule.term}`;
      const detail = rule.type === "replace" ? `Suggested wording: ${rule.value}` : rule.type === "fact" ? `Approved value: ${rule.value}` : "Flag this wording for human review";
      return `<div class="rule-row"><span class="rule-stripe ${rule.type}"></span><div><div class="rule-title">${escapeHtml(title)}</div><div class="rule-detail">${escapeHtml(detail)}</div></div><div style="display:flex;align-items:center;gap:4px"><span class="rule-badge ${rule.type}">${rule.type}</span><button class="rule-delete" data-delete-rule="${rule.id}" title="Delete rule" aria-label="Delete rule">×</button></div></div>`;
    }).join("");
    list.querySelectorAll("[data-delete-rule]").forEach(button => button.addEventListener("click", () => {
      const id = Number(button.dataset.deleteRule);
      rules = rules.filter(rule => rule.id !== id);
      renderRules();
      if (hasRun) analyzeDraft(false);
      showToast("Brand rule removed.");
    }));
  }
  function analyzeDraft(announce = true) {
    const draft = $("draftText").value;
    if (!draft.trim()) {
      showToast("Add a draft before running analysis.");
      $("draftText").focus();
      return;
    }
    const found = [];
    rules.forEach(rule => {
      if (rule.type === "avoid" || rule.type === "replace") {
        const regex = wordRegex(rule.term);
        let match, count = 0;
        while ((match = regex.exec(draft)) !== null) {
          count++;
          if (match[0].length === 0) regex.lastIndex++;
        }
        if (count) {
          found.push({
            id: nextFindingId++, ruleId: rule.id, type: rule.type, term: rule.term, value: rule.value,
            count, status: "open", title: rule.type === "avoid" ? `Avoid phrase detected: “${rule.term}”` : `Preferred wording needed: “${rule.term}”`,
            detail: rule.type === "avoid" ? "This wording is marked for review by your brand guidelines." : `Consider replacing it with “${rule.value}”.`,
            quote: draft
          });
        }
      } else if (rule.type === "fact") {
        const topicRegex = wordRegex(rule.term);
        const topicMatches = [...draft.matchAll(topicRegex)];
        if (topicMatches.length) {
          const valueRegex = wordRegex(rule.value);
          if (!valueRegex.test(draft)) {
            found.push({
              id: nextFindingId++, ruleId: rule.id, type: "fact", term: rule.term, value: rule.value,
              count: topicMatches.length, status: "open", title: `Verify approved fact: “${rule.term}”`,
              detail: `The draft mentions this topic but the approved value “${rule.value}” was not found. Confirm the correct fact before publishing.`,
              quote: draft
            });
          }
        }
      }
    });
    findings = found;
    hasRun = true;
    renderFindings();
    updateMetrics();
    if (announce) showToast(`Review complete: ${findings.length} finding${findings.length === 1 ? "" : "s"} to inspect.`);
  }
  function highlightTerm(text, term) {
    if (!term) return escapeHtml(text);
    const regex = wordRegex(term);
    let result = "", last = 0, match;
    while ((match = regex.exec(text)) !== null) {
      result += escapeHtml(text.slice(last, match.index)) + `<mark>${escapeHtml(match[0])}</mark>`;
      last = match.index + match[0].length;
      if (!match[0].length) regex.lastIndex++;
    }
    return result + escapeHtml(text.slice(last));
  }
  function renderFindings() {
    const list = $("findingsList");
    const filter = $("filterFindings").value;
    const visible = findings.filter(item => filter === "all" || item.status === filter);
    $("resultCount").textContent = findings.length;
    if (!hasRun) {
      list.innerHTML = '<div class="empty-state"><div class="empty-icon">⌕</div><strong>Ready when you are</strong><p>Analyze a draft to see wording and fact-check findings here.</p></div>';
      $("reviewSummary").textContent = "No review has been run yet.";
      return;
    }
    if (!visible.length) {
      list.innerHTML = `<div class="empty-state"><div class="empty-icon">✓</div><strong>${findings.length ? "No findings in this filter" : "No rule-based issues detected"}</strong><p>${findings.length ? "Try changing the filter to see other findings." : "This does not guarantee the content is error-free. A human review is still recommended."}</p></div>`;
    } else {
      list.innerHTML = visible.map(item => {
        const quote = item.type === "fact" ? highlightTerm(item.quote, item.term) : highlightTerm(item.quote, item.term);
        const statusText = item.status === "open" ? "Needs review" : item.status;
        const suggestion = item.type === "replace" ? `<div class="finding-recommendation"><strong>Suggested:</strong> ${escapeHtml(item.value)} <span style="color:#98a1b0">· ${item.count} occurrence${item.count===1?"":"s"}</span></div>` :
          item.type === "fact" ? `<div class="finding-recommendation"><strong>Approved value:</strong> ${escapeHtml(item.value)} · Please verify the source of truth.</div>` :
          `<div class="finding-recommendation"><strong>Recommendation:</strong> Rephrase or remove this term based on the intended message.</div>`;
        const actionButtons = item.status === "open" ? `<div class="finding-actions">${item.type === "replace" ? `<button class="mini-button accept" data-accept="${item.id}">Apply suggestion</button>` : item.type === "fact" ? `<button class="mini-button accept" data-accept-fact="${item.id}">Use approved value</button>` : ""}<button class="mini-button" data-dismiss="${item.id}">Dismiss finding</button></div>` : "";
        return `<article class="finding-card"><div class="finding-symbol ${item.type}">${item.type==="avoid"?"!":item.type==="fact"?"✓":"↗"}</div><div class="finding-main"><div class="finding-top"><div><div class="finding-title">${escapeHtml(item.title)}</div><div class="finding-meta">Rule #${item.ruleId} · ${item.count} matching occurrence${item.count===1?"":"s"}</div></div><span class="finding-status ${item.status}">${escapeHtml(statusText)}</span></div><div class="finding-quote">${quote.length > 800 ? quote.slice(0,800) + "…" : quote}</div><div class="finding-recommendation">${escapeHtml(item.detail)}</div>${suggestion}${actionButtons}</div></article>`;
      }).join("");
      list.querySelectorAll("[data-accept]").forEach(button => button.addEventListener("click", () => applySuggestion(Number(button.dataset.accept))));
      list.querySelectorAll("[data-accept-fact]").forEach(button => button.addEventListener("click", () => applyFact(Number(button.dataset.acceptFact))));
      list.querySelectorAll("[data-dismiss]").forEach(button => button.addEventListener("click", () => {
        const item = findings.find(f => f.id === Number(button.dataset.dismiss));
        if (item) item.status = "dismissed";
        renderFindings(); updateMetrics(); showToast("Finding dismissed for this review.");
      }));
    }
    const openCount = findings.filter(item => item.status === "open").length;
    const acceptedCount = findings.filter(item => item.status === "accepted").length;
    $("reviewSummary").textContent = `${findings.length} finding(s) · ${acceptedCount} accepted · ${openCount} still need review`;
  }
  function applySuggestion(id) {
    const item = findings.find(f => f.id === id);
    if (!item) return;
    const regex = wordRegex(item.term);
    $("draftText").value = $("draftText").value.replace(regex, item.value);
    item.status = "accepted";
    updateWordCount();
    // Re-analyse to keep findings consistent with the changed draft, while preserving the acceptance record.
    const accepted = findings.filter(f => f.status === "accepted");
    const previous = findings;
    analyzeDraft(false);
    findings.forEach(f => {
      const old = accepted.find(a => a.ruleId === f.ruleId && a.term === f.term);
      if (old) f.status = "accepted";
    });
    renderFindings(); updateMetrics();
    showToast("Suggestion applied. Run another review before publishing.");
  }
  function applyFact(id) {
    const item = findings.find(f => f.id === id);
    if (!item) return;
    const draft = $("draftText").value;
    const regex = wordRegex(item.term);
    if (regex.test(draft)) {
      regex.lastIndex = 0;
      $("draftText").value = $("draftText").value.replace(regex, match => `${match} ${item.value}`);
    } else {
      $("draftText").value += `\n${item.term} ${item.value}`;
    }
    updateWordCount();
    analyzeDraft(false);
    showToast("Approved value inserted. Verify it against your source of truth.");
  }
  function updateMetrics() {
    const total = findings.length;
    const open = findings.filter(f => f.status === "open").length;
    const accepted = findings.filter(f => f.status === "accepted").length;
    const dismissed = findings.filter(f => f.status === "dismissed").length;
    const score = Math.max(0, 100 - open * 16 - dismissed * 2);
    $("scoreValue").textContent = hasRun ? score : "—";
    $("scoreMeter").style.width = hasRun ? `${score}%` : "0%";
    $("scoreCaption").textContent = !hasRun ? "Run a review to calculate" : open === 0 ? "No open rule findings" : `${open} item(s) need human review`;
    $("findingValue").textContent = open;
    $("findingCaption").textContent = `${accepted} accepted · ${dismissed} dismissed`;
    const factRules = rules.filter(r => r.type === "fact");
    const factFindings = findings.filter(f => f.type === "fact");
    $("factValue").textContent = Math.max(0, factRules.length - factFindings.length);
    $("factTotal").textContent = ` / ${factRules.length} checked`;
    $("statusValue").textContent = !hasRun ? "Not run" : open ? "Review needed" : "Ready for human check";
    $("statusCaption").textContent = !hasRun ? "Analysis has not started" : open ? "Resolve or dismiss open findings" : "Human approval still required";
  }
  function buildReport() {
    const draft = $("draftText").value;
    const open = findings.filter(f => f.status === "open").length;
    const accepted = findings.filter(f => f.status === "accepted").length;
    const dismissed = findings.filter(f => f.status === "dismissed").length;
    const score = hasRun ? Math.max(0, 100 - open * 16 - dismissed * 2) : null;
    const lines = [
      "BRANDGUARD AI — CONTENT REVIEW REPORT",
      "Team: Quantum Rebels | FutureStack Round 3",
      `Generated: ${new Date().toLocaleString()}`,
      `Words in draft: ${countWords(draft)}`,
      `Active rules: ${rules.length}`,
      `Review status: ${!hasRun ? "Not run" : open ? "Review needed" : "Ready for human check"}`,
      `Rule-based score: ${score === null ? "Not calculated" : score + "/100 (prototype heuristic, not a validated quality metric)"}`,
      `Findings: ${findings.length} total; ${open} open; ${accepted} accepted; ${dismissed} dismissed`,
      "",
      "IMPORTANT LIMITATION",
      "This prototype uses transparent client-side phrase matching and simple approved-fact checks. It does not use a connected AI model, external fact database, or backend. Results can miss context and do not prove a draft is accurate or safe. A human must verify facts and approve publication.",
      "",
      "FINDINGS",
      ...(findings.length ? findings.map((f, i) => `${i+1}. [${f.status.toUpperCase()}] ${f.title}\n   Rule: ${f.term}${f.value ? " -> " + f.value : ""}\n   Note: ${f.detail}`) : ["No rule-based findings detected."]),
      "",
      "DRAFT",
      draft
    ];
    return lines.join("\n");
  }
  function openReport() {
    const draft = $("draftText").value;
    const open = findings.filter(f => f.status === "open").length;
    const accepted = findings.filter(f => f.status === "accepted").length;
    const score = hasRun ? Math.max(0, 100 - open * 16 - findings.filter(f => f.status === "dismissed").length * 2) : "—";
    $("reportContent").innerHTML = `
      <p class="report-paragraph">A compact summary of the current draft review. The score is a prototype heuristic based on open findings, not a validated measure of writing quality.</p>
      <div class="report-summary-grid"><div class="report-summary-item"><span>Rule-based score</span><strong>${score}${score === "—" ? "" : "/100"}</strong></div><div class="report-summary-item"><span>Findings</span><strong>${findings.length}</strong></div><div class="report-summary-item"><span>Words</span><strong>${countWords(draft)}</strong></div></div>
      <div class="report-detail"><strong>Status:</strong> ${!hasRun ? "Analysis not run" : open ? `${open} finding(s) need review` : "No open findings remain"}.</div>
      <div class="report-detail"><strong>Human decisions:</strong> ${accepted} accepted · ${findings.filter(f=>f.status==="dismissed").length} dismissed.</div>
      <div class="report-detail"><strong>Scope:</strong> ${rules.length} editable rules checked locally in the browser.</div>
      <div class="report-detail"><strong>Limitations:</strong> This prototype uses phrase matching and simple fact checks; it does not connect to an AI model or verify facts against the internet. Human verification is required.</div>`;
    const dialog = $("reportDialog");
    if (typeof dialog.showModal === "function") dialog.showModal();
    else showToast("Your browser does not support the report dialog.");
  }
  function resetDemo() {
    rules = [
      {id:1,type:"avoid",term:"cheapest",value:"",label:"Avoid phrase"},
      {id:2,type:"replace",term:"guarantee",value:"aim to help",label:"Preferred wording"},
      {id:3,type:"replace",term:"customers",value:"people and teams",label:"Preferred wording"},
      {id:4,type:"fact",term:"established in",value:"2024",label:"Approved fact"},
      {id:5,type:"avoid",term:"100% accurate",value:"",label:"Avoid phrase"}
    ];
    nextRuleId = 6; findings = []; hasRun = false; nextFindingId = 1;
    $("scenarioSelect").value = "social";
    $("draftText").value = scenarios.social;
    $("filterFindings").value = "all";
    updateWordCount(); renderRules(); renderFindings(); updateMetrics();
    showToast("Demo reset to its starting state.");
  }
  $("scenarioSelect").addEventListener("change", () => {
    $("draftText").value = scenarios[$("scenarioSelect").value];
    updateWordCount();
  });
  $("draftText").addEventListener("input", updateWordCount);
  $("analyzeBtn").addEventListener("click", () => analyzeDraft(true));
  $("sampleBtn").addEventListener("click", () => {
    $("scenarioSelect").value = "social";
    $("draftText").value = scenarios.social;
    updateWordCount();
    analyzeDraft(true);
  });
  $("addRuleBtn").addEventListener("click", () => {
    const type = $("newRuleType").value;
    const term = $("newRuleTerm").value.trim();
    const value = $("newRuleValue").value.trim();
    if (!term) { showToast("Enter a phrase or fact topic first."); $("newRuleTerm").focus(); return; }
    if ((type === "replace" || type === "fact") && !value) { showToast("Enter a replacement or approved value."); $("newRuleValue").focus(); return; }
    if (rules.some(r => r.type === type && r.term.toLowerCase() === term.toLowerCase())) { showToast("A rule with that phrase and type already exists."); return; }
    rules.push({id:nextRuleId++,type,term,value,label:type==="avoid"?"Avoid phrase":type==="replace"?"Preferred wording":"Approved fact"});
    $("newRuleTerm").value = ""; $("newRuleValue").value = "";
    renderRules();
    if (hasRun) analyzeDraft(false);
    showToast("Brand rule added.");
  });
  $("filterFindings").addEventListener("change", renderFindings);
  $("resetBtn").addEventListener("click", resetDemo);
  $("toggleRulesBtn").addEventListener("click", () => $("rulesPanel").scrollIntoView({behavior:"smooth",block:"start"}));
  $("navRules").addEventListener("click", () => $("rulesPanel").scrollIntoView({behavior:"smooth",block:"start"}));
  $("navDashboard").addEventListener("click", () => window.scrollTo({top:0,behavior:"smooth"}));
  $("navReports").addEventListener("click", openReport);
  $("showReportBtn").addEventListener("click", openReport);
  $("closeDialogBtn").addEventListener("click", () => $("reportDialog").close());
  $("exportBtn").addEventListener("click", openReport);
  $("copyReportBtn").addEventListener("click", async () => {
    const report = buildReport();
    try { await navigator.clipboard.writeText(report); showToast("Report copied to clipboard."); }
    catch (err) { showToast("Clipboard access blocked. Use Download .txt instead."); }
  });
  $("downloadReportBtn").addEventListener("click", () => {
    const blob = new Blob([buildReport()], {type:"text/plain;charset=utf-8"});
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = "BrandGuard-Review-Report.txt";
    document.body.appendChild(a); a.click(); a.remove(); URL.revokeObjectURL(url);
    showToast("Review report downloaded.");
  });
  $("draftText").value = scenarios.social;
  updateWordCount(); renderRules(); renderFindings(); updateMetrics();
})();