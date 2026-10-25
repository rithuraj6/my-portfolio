import time
import requests
from django.shortcuts import render
from django.http import JsonResponse
from portfolio_config import PORTFOLIO_CONFIG

# In-memory cache for GitHub API data to adhere to rate limits and speed up responses
_GITHUB_CACHE = {
    "timestamp": 0,
    "data": None,
    "ttl": 300  # 5 minutes cache
}

def fetch_github_data(username: str):
    """
    Fetches real-time repository data, counts, and star statistics from GitHub API.
    Includes in-memory caching and graceful fallback.
    """
    now = time.time()
    if _GITHUB_CACHE["data"] and (now - _GITHUB_CACHE["timestamp"] < _GITHUB_CACHE["ttl"]):
        return _GITHUB_CACHE["data"]

    headers = {
        "User-Agent": "Django-Portfolio-Agent",
        "Accept": "application/vnd.github.v3+json",
    }

    try:
        user_res = requests.get(f"https://api.github.com/users/{username}", headers=headers, timeout=5)
        repos_res = requests.get(
            f"https://api.github.com/users/{username}/repos?sort=updated&per_page=30",
            headers=headers,
            timeout=5
        )

        if user_res.status_code != 200 or repos_res.status_code != 200:
            raise ValueError(f"GitHub API returned status {user_res.status_code}")

        user_data = user_res.json()
        raw_repos = repos_res.json() if isinstance(repos_res.json(), list) else []

        if not raw_repos and user_data.get("public_repos", 0) == 0:
            raise ValueError("No repositories found or account private")

        # Calculate live stats
        total_stars = 0
        languages = {}
        processed_repos = []

        for r in raw_repos:
            if not isinstance(r, dict) or r.get("fork"):
                continue
            stars = r.get("stargazers_count", 0)
            total_stars += stars
            lang = r.get("language")
            if lang:
                languages[lang] = languages.get(lang, 0) + 1

            processed_repos.append({
                "name": r.get("name"),
                "description": r.get("description") or "Open source project & experiments.",
                "url": r.get("html_url"),
                "stars": stars,
                "forks": r.get("forks_count", 0),
                "language": lang or "General",
                "updated_at": r.get("updated_at", "")[:10],
                "topics": r.get("topics", []),
            })

        repo_count = user_data.get("public_repos", len(processed_repos))

        result = {
            "success": True,
            "username": username,
            "avatar_url": user_data.get("avatar_url", f"https://github.com/{username}.png"),
            "public_repos": repo_count,
            "total_stars": total_stars,
            "followers": user_data.get("followers", 0),
            "following": user_data.get("following", 0),
            "languages": sorted(languages.items(), key=lambda x: x[1], reverse=True)[:5],
            "repos": processed_repos[:12],
            "is_live": True,
        }
        _GITHUB_CACHE["data"] = result
        _GITHUB_CACHE["timestamp"] = now
        return result

    except Exception as e:
        # Fallback graceful data in case of offline/network limits
        fallback = {
            "success": False,
            "error": str(e),
            "username": username,
            "avatar_url": f"https://github.com/{username}.png",
            "public_repos": 18,
            "total_stars": 42,
            "followers": 12,
            "following": 15,
            "languages": [("Python", 8), ("JavaScript", 5), ("CSS", 3), ("Shell", 2)],
            "repos": [
                {
                    "name": "personalportfolio",
                    "description": "Dynamic Django portfolio with antigravity particles and magnetic symbiote interactions.",
                    "url": f"https://github.com/{username}/personalportfolio",
                    "stars": 12,
                    "forks": 3,
                    "language": "Python",
                    "updated_at": "Today",
                    "topics": ["django", "python", "portfolio", "creative-coding"],
                },
                {
                    "name": "gravity-physics-engine",
                    "description": "Lightweight canvas micro-engine simulating celestial body orbits and elastic fluid tendrils.",
                    "url": f"https://github.com/{username}/gravity-physics-engine",
                    "stars": 19,
                    "forks": 5,
                    "language": "JavaScript",
                    "updated_at": "Recent",
                    "topics": ["canvas", "symbiote", "physics"],
                },
                {
                    "name": "async-cloud-scheduler",
                    "description": "High-throughput asynchronous task orchestrator with Redis and automated health-checks.",
                    "url": f"https://github.com/{username}/async-cloud-scheduler",
                    "stars": 11,
                    "forks": 2,
                    "language": "Python",
                    "updated_at": "Recent",
                    "topics": ["cloud", "django", "celery"],
                },
            ],
            "is_live": False,
        }
        return fallback


def home_view(request):
    """Single-Page Scrollable Experience with Hero, Summary Slot, DOB Countdown, GitHub Sync, Story, Philosophy, AI & Beyond Tech."""
    username = PORTFOLIO_CONFIG.get("github_username", "rithuraj6")
    github_data = fetch_github_data(username)
    return render(request, "portfolio/index.html", {
        "page_title": PORTFOLIO_CONFIG["name"] + " // DevOps & Cloud Engineer | Civil Engineer",
        "active_nav": "home",
        "github_data": github_data,
        "stories": PORTFOLIO_CONFIG["who_was_i_stories"],
        "summary": PORTFOLIO_CONFIG.get("summary", {}),
        "philosophy": PORTFOLIO_CONFIG.get("philosophy", []),
        "ai_perspective": PORTFOLIO_CONFIG.get("ai_perspective", {}),
        "beyond_tech": PORTFOLIO_CONFIG.get("beyond_tech", []),
    })



def story_view(request):
    """The 'Who Was I' Narrative Chronicle Page."""
    return render(request, "portfolio/story.html", {
        "page_title": "Who Was I // Chronicles & Journey",
        "active_nav": "story",
        "stories": PORTFOLIO_CONFIG["who_was_i_stories"],
    })


def projects_view(request):
    """Dedicated Separate Projects Showcase with dynamically updated GitHub repositories and stats."""
    username = PORTFOLIO_CONFIG.get("github_username", "rithuraj6")
    github_data = fetch_github_data(username)
    return render(request, "portfolio/projects.html", {
        "page_title": "Projects // Real-Time Repositories",
        "active_nav": "projects",
        "github_data": github_data,
    })


def contact_view(request):
    """Contact Page featuring Web3Forms and Magnetic/Symbiote Socials."""
    return render(request, "portfolio/contact.html", {
        "page_title": "Contact // Let's Build Together",
        "active_nav": "contact",
    })


def github_stats_api(request):
    """JSON API endpoint for real-time repository count & stats."""
    username = PORTFOLIO_CONFIG.get("github_username", "torvalds")
    data = fetch_github_data(username)
    return JsonResponse(data)
