/**
 * Interactive DevOps CLI Terminal Drawer
 * Real-time command executor with interactive command chips and history.
 */
(() => {
  "use strict";

  const drawer = document.getElementById("terminal-drawer");
  const toggleBtn = document.getElementById("terminal-toggle-btn");
  const bar = document.getElementById("terminal-bar");
  const closeBtn = document.getElementById("terminal-close-btn");
  const body = document.getElementById("terminal-body");
  const input = document.getElementById("terminal-input");
  const chips = document.querySelectorAll(".quick-chip");

  if (!drawer || !input) return;

  const history = [];
  let historyIdx = -1;

  function toggleTerminal() {
    drawer.classList.toggle("open");
    if (drawer.classList.contains("open")) {
      setTimeout(() => input.focus(), 250);
    }
  }

  if (toggleBtn) toggleBtn.addEventListener("click", toggleTerminal);
  if (bar) bar.addEventListener("click", (e) => {
    if (!e.target.closest(".terminal-controls")) {
      toggleTerminal();
    }
  });
  if (closeBtn) closeBtn.addEventListener("click", () => drawer.classList.remove("open"));

  const commands = {
    help: () => `
<pre>AVAILABLE COMMANDS:
  help       - Display this list of terminal commands
  bio        - Executive summary & mission statement
  story      - Career journey: Civil Engineering → DevOps
  skills     - Infrastructure, Cloud, & Automation toolkit
  pipeline   - Inspect our CI/CD GitOps deployment flow
  repos      - View featured GitHub repositories
  ai         - Perspective on AI & "Will AI take my job?"
  biryani    - The unnegotiable culinary philosophy
  contact    - Connect with Rithu Raj R
  clear      - Clear terminal window
  exit       - Close terminal drawer</pre>`,

    bio: () => `
<strong>RITHU RAJ R</strong> // DevOps & Cloud Engineer
From physical foundations in Civil Engineering to cloud infrastructure automation.
Obsessed with understanding how complex systems operate, why they break, and how to make them resilient.
Stack: AWS, Docker, Kubernetes, Terraform, Argo CD, Python, Linux.`,

    story: () => `
<pre>[PHASE 01] Concrete Foundation  -> Civil Engineering, blueprints & site coordination
[PHASE 02] The Blank Slate      -> Stepping into the deep end: Linux, Bash, Python
[PHASE 03] The DevOps Crucible  -> Infrastructure as civil engineering for electrons
[PHASE 04] The Synthesis        -> Enduring architecture, reliability, and precision</pre>`,

    skills: () => `
<pre>CLOUD & DEVOPS : Linux/Bash, Docker, Kubernetes, Terraform, AWS, Helm, Argo CD
CI/CD & SEC    : GitHub Actions, Jenkins, Trivy, SonarQube, OWASP
OBSERVABILITY  : Prometheus, Grafana, ELK Stack, Distributed Tracing
DEVELOPMENT    : Python 3.12, REST APIs, Shell Scripting, PostgreSQL, WhiteNoise</pre>`,

    pipeline: () => `
<pre>
[CODE] ──▶ [TEST & LINT] ──▶ [CONTAINERIZE] ──▶ [DEVSECOPS SCAN] ──▶ [GITOPS DEPLOY] ──▶ [PROMETHEUS]
 git push      flake8/pytest     docker build         trivy audit         argo cd sync        alerts ok
</pre>`,

    repos: () => `
Featured Repositories:
- personalportfolio: Modern serverless portfolio hosted on Vercel
- k8s-gitops-cluster-manifests: Argo CD & Helm chart deployments
- terraform-aws-immutable-infra: Multi-AZ AWS infrastructure
- async-cloud-scheduler: Celery & Redis distributed task engine
Type 'curl github' or visit: https://github.com/rithuraj6`,

    ai: () => `
"Will AI take my job? Bro, I use AI. This Portfolio is Vibecoded!"
AI writes configs; someone still needs to know if that config will bring production down.
And if AI takes the servers? I can make Porotta, design buildings, or farm. Bro, I'm diversified.`,

    biryani: () => `
🍛 <strong>Biryani over Mandhi. No negotiations. 😌🤝</strong>
If we agree on that, we're already off to a pretty good start. Some things are more important than automation.`,

    contact: () => {
      window.open("https://mail.google.com/mail/?view=cm&fs=1&to=rithuraj6@gmail.com&su=DevOps%20Inquiry%20-%20Rithu%20Raj%20R", "_blank");
      return `Opening Gmail compose for <strong>rithuraj6@gmail.com</strong>...<br>Direct links:
- Gmail: <a href="https://mail.google.com/mail/?view=cm&fs=1&to=rithuraj6@gmail.com" target="_blank" style="color:var(--glow-emerald)">rithuraj6@gmail.com ↗</a>
- GitHub: <a href="https://github.com/rithuraj6" target="_blank" style="color:var(--text-bright)">github.com/rithuraj6 ↗</a>
- LinkedIn: <a href="https://www.linkedin.com/in/rithurajr" target="_blank" style="color:var(--text-bright)">linkedin.com/in/rithurajr ↗</a>`;
    },

    clear: () => {
      body.innerHTML = "";
      return "";
    },

    sudo: () => `Permission denied: nice try, agent! 🔐`,

    exit: () => {
      drawer.classList.remove("open");
      return "Terminal minimized.";
    }
  };

  function executeCommand(cmdStr) {
    const trimmed = cmdStr.trim();
    if (!trimmed) return;

    history.push(trimmed);
    historyIdx = history.length;

    const cmdEntry = document.createElement("div");
    cmdEntry.className = "terminal-output";
    cmdEntry.innerHTML = `<span class="terminal-prompt">$</span> <span>${escapeHtml(trimmed)}</span>`;
    body.appendChild(cmdEntry);

    const baseCmd = trimmed.toLowerCase().split(" ")[0];

    let outputHtml = "";
    if (commands[baseCmd]) {
      outputHtml = commands[baseCmd]();
    } else {
      outputHtml = `<span style="color:#fca5a5;">Command not found: '${escapeHtml(trimmed)}'. Type 'help' for available commands.</span>`;
    }

    if (outputHtml) {
      const respEntry = document.createElement("div");
      respEntry.className = "terminal-output";
      respEntry.innerHTML = outputHtml;
      body.appendChild(respEntry);
    }

    body.scrollTop = body.scrollHeight;
  }

  function escapeHtml(text) {
    const div = document.createElement("div");
    div.innerText = text;
    return div.innerHTML;
  }

  input.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      executeCommand(input.value);
      input.value = "";
    } else if (e.key === "ArrowUp") {
      if (historyIdx > 0) {
        historyIdx--;
        input.value = history[historyIdx];
      }
    } else if (e.key === "ArrowDown") {
      if (historyIdx < history.length - 1) {
        historyIdx++;
        input.value = history[historyIdx];
      } else {
        historyIdx = history.length;
        input.value = "";
      }
    }
  });

  chips.forEach((chip) => {
    chip.addEventListener("click", () => {
      const cmd = chip.getAttribute("data-cmd");
      if (cmd) {
        executeCommand(cmd);
      }
    });
  });
})();

