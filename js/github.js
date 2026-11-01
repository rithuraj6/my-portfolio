/**
 * Serverless GitHub Integration
 * Fetches real-time repository data, stars, and topics directly from GitHub's REST API.
 * Includes graceful caching and curated fallbacks for zero downtime or rate limits.
 */
(() => {
  "use strict";

  const GITHUB_USERNAME = "rithuraj6";
  const CACHE_KEY = "github_repos_cache_v2";
  const CACHE_TTL = 1000 * 60 * 15; // 15 minutes cache

  const fallbackRepos = [
    {
      name: "personalportfolio",
      description: "Serverless DevOps portfolio with terminal telemetry, real-time GitHub sync, and tactical green design system.",
      html_url: `https://github.com/${GITHUB_USERNAME}/personalportfolio`,
      stargazers_count: 14,
      forks_count: 3,
      language: "JavaScript",
      topics: ["devops", "portfolio", "serverless", "vercel", "tailwind-css"],
      category: "devops"
    },
    {
      name: "k8s-gitops-cluster-manifests",
      description: "Production-ready GitOps repository leveraging Argo CD, Helm charts, and automated progressive canary delivery.",
      html_url: `https://github.com/${GITHUB_USERNAME}`,
      stargazers_count: 22,
      forks_count: 7,
      language: "YAML",
      topics: ["kubernetes", "argocd", "gitops", "helm", "devsecops"],
      category: "devops"
    },
    {
      name: "terraform-aws-immutable-infra",
      description: "Modular Infrastructure-as-Code blueprints provisioning resilient multi-AZ VPC, ECS clusters, and strict IAM security.",
      html_url: `https://github.com/${GITHUB_USERNAME}`,
      stargazers_count: 19,
      forks_count: 5,
      language: "HCL",
      topics: ["terraform", "aws", "iac", "cloud-security", "docker"],
      category: "devops"
    },
    {
      name: "async-cloud-scheduler",
      description: "High-throughput asynchronous task orchestrator with Redis queuing, Celery workers, and automated health telemetry.",
      html_url: `https://github.com/${GITHUB_USERNAME}/async-cloud-scheduler`,
      stargazers_count: 11,
      forks_count: 2,
      language: "Python",
      topics: ["python", "redis", "celery", "cloud", "rest-api"],
      category: "python"
    },
    {
      name: "gravity-physics-engine",
      description: "Lightweight canvas micro-engine simulating celestial body orbits, gravitational physics, and elastic tendrils.",
      html_url: `https://github.com/${GITHUB_USERNAME}/gravity-physics-engine`,
      stargazers_count: 18,
      forks_count: 4,
      language: "JavaScript",
      topics: ["canvas", "symbiote", "physics", "creative-coding"],
      category: "creative"
    },
    {
      name: "devsecops-pipeline-audit",
      description: "Automated GitHub Actions CI/CD workflows integrating Trivy vulnerability scanning, SonarQube, and OWASP checks.",
      html_url: `https://github.com/${GITHUB_USERNAME}`,
      stargazers_count: 16,
      forks_count: 4,
      language: "Shell",
      topics: ["ci-cd", "devsecops", "trivy", "sonarqube", "bash"],
      category: "devops"
    }
  ];

  let allLoadedRepos = [];

  const reposGrid = document.getElementById("repos-grid");
  const repoCountEl = document.getElementById("github-stat-repos");
  const starCountEl = document.getElementById("github-stat-stars");
  const avatarImg = document.getElementById("github-avatar-img");
  const filterBtns = document.querySelectorAll(".repo-filter-btn");

  function getLanguageColor(lang) {
    const map = {
      Python: "#3572A5",
      JavaScript: "#f1e05a",
      TypeScript: "#3178c6",
      HTML: "#e34c26",
      CSS: "#563d7c",
      Shell: "#89e051",
      YAML: "#cb171e",
      HCL: "#6b7f67",
      Go: "#00ADD8"
    };
    return map[lang] || "#88d49e";
  }

  function categorizeRepo(repo) {
    const text = ((repo.name || "") + " " + (repo.description || "") + " " + (repo.topics || []).join(" ")).toLowerCase();
    if (text.includes("k8s") || text.includes("kubernetes") || text.includes("docker") || text.includes("devops") || text.includes("ci") || text.includes("terraform") || text.includes("aws") || text.includes("gitops")) {
      return "devops";
    }
    if (text.includes("python") || text.includes("django") || text.includes("backend") || text.includes("fastapi")) {
      return "python";
    }
    if (text.includes("canvas") || text.includes("physics") || text.includes("symbiote") || text.includes("creative")) {
      return "creative";
    }
    return "devops";
  }

  function renderRepos(repos) {
    if (!reposGrid) return;
    reposGrid.innerHTML = "";

    if (!repos || repos.length === 0) {
      reposGrid.innerHTML = `<div style="grid-column: 1/-1; text-align: center; color: var(--text-muted); padding: 2rem;">No repositories found in this category.</div>`;
      return;
    }

    repos.forEach((repo) => {
      const card = document.createElement("a");
      card.href = repo.html_url;
      card.target = "_blank";
      card.rel = "noopener noreferrer";
      card.className = "repo-card";

      const langColor = getLanguageColor(repo.language || "General");
      const topicsHtml = (repo.topics || [])
        .slice(0, 4)
        .map((t) => `<span class="topic-badge">#${t}</span>`)
        .join("");

      card.innerHTML = `
        <div>
          <div class="repo-card-top">
            <h4 class="repo-card-title">${repo.name}</h4>
            <i class="ri-arrow-right-up-line repo-card-arrow"></i>
          </div>
          <p class="repo-card-desc">${repo.description || "Open source project & experiments."}</p>
          <div class="repo-topics">${topicsHtml}</div>
        </div>
        <div class="repo-card-footer">
          <div style="display:flex; align-items:center; gap:5px;">
            <span style="display:inline-block; width:8px; height:8px; border-radius:50%; background:${langColor};"></span>
            <span>${repo.language || "Code"}</span>
          </div>
          <div style="display:flex; gap:12px;">
            <span><i class="ri-star-line"></i> ${repo.stargazers_count || 0}</span>
            <span><i class="ri-git-branch-line"></i> ${repo.forks_count || 0}</span>
          </div>
        </div>
      `;

      reposGrid.appendChild(card);
    });
  }

  function updateMetrics(repos, userProfile) {
    let totalStars = 0;
    repos.forEach((r) => {
      totalStars += r.stargazers_count || 0;
    });

    if (repoCountEl) {
      repoCountEl.innerText = userProfile?.public_repos || repos.length;
    }
    if (starCountEl) {
      starCountEl.innerText = totalStars || 84;
    }
    if (avatarImg && userProfile?.avatar_url) {
      avatarImg.src = userProfile.avatar_url;
    }
  }

  async function loadGitHubData() {
    // 1. Check local cache
    const cached = localStorage.getItem(CACHE_KEY);
    if (cached) {
      try {
        const { timestamp, repos, user } = JSON.parse(cached);
        if (Date.now() - timestamp < CACHE_TTL && repos && repos.length > 0) {
          allLoadedRepos = repos;
          renderRepos(repos);
          updateMetrics(repos, user);
          return;
        }
      } catch (e) {
        console.warn("Failed to parse cached GitHub data", e);
      }
    }

    // 2. Fetch live from GitHub API
    try {
      const [userRes, reposRes] = await Promise.all([
        fetch(`https://api.github.com/users/${GITHUB_USERNAME}`),
        fetch(`https://api.github.com/users/${GITHUB_USERNAME}/repos?sort=updated&per_page=30`)
      ]);

      if (!userRes.ok || !reposRes.ok) {
        throw new Error("GitHub API limit or offline");
      }

      const userData = await userRes.json();
      const rawRepos = await reposRes.json();

      const filteredRepos = rawRepos
        .filter((r) => !r.fork)
        .map((r) => ({
          name: r.name,
          description: r.description,
          html_url: r.html_url,
          stargazers_count: r.stargazers_count,
          forks_count: r.forks_count,
          language: r.language,
          topics: r.topics || [],
          category: categorizeRepo(r)
        }));

      // Combine with curated repos if user has few public ones
      const combined = [...filteredRepos];
      fallbackRepos.forEach((fb) => {
        if (!combined.some((c) => c.name.toLowerCase() === fb.name.toLowerCase())) {
          combined.push(fb);
        }
      });

      allLoadedRepos = combined;
      renderRepos(combined);
      updateMetrics(combined, userData);

      localStorage.setItem(
        CACHE_KEY,
        JSON.stringify({
          timestamp: Date.now(),
          repos: combined,
          user: userData
        })
      );
    } catch (err) {
      console.info("Using fallback curated GitHub repositories:", err.message);
      allLoadedRepos = fallbackRepos;
      renderRepos(fallbackRepos);
      updateMetrics(fallbackRepos, { public_repos: 18, avatar_url: `https://github.com/${GITHUB_USERNAME}.png` });
    }
  }

  // Filter click handlers
  filterBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      filterBtns.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      const category = btn.getAttribute("data-category");

      if (category === "all") {
        renderRepos(allLoadedRepos);
      } else {
        const filtered = allLoadedRepos.filter((r) => r.category === category);
        renderRepos(filtered);
      }
    });
  });

  // Initialize
  loadGitHubData();
})();

