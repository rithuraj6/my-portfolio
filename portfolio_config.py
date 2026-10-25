"""
PORTFOLIO CONFIGURATION FILE
=============================
Customize your personal details, GitHub username, Date of Birth (DOB),
social media accounts, Web3Forms key, and personal story chapters here.
All templates automatically read from this configuration.
"""

from datetime import datetime, date

PORTFOLIO_CONFIG = {
    # -------------------------------------------------------------
    # Personal Identity
    # -------------------------------------------------------------
    "name": "Rith",
    "full_name": "Rith",
    "role": "Python & Django Developer | Creative Technologist",
    "tagline": "Architecting resilient backends & gravity-defying interactive experiences.",
    "location": "Global / Remote",
    "email": "hello@example.com",
    "status": "Available for high-impact projects & engineering roles",

    # -------------------------------------------------------------
    # Date of Birth (DOB) & Countdown Configuration
    # Format: YYYY-MM-DD (e.g. "2001-11-14")
    # The countdown automatically detects your next upcoming birthday!
    # -------------------------------------------------------------
    "dob": "2002-08-15",  # Replace with your actual DOB

    # -------------------------------------------------------------
    # GitHub Integration
    # Set your GitHub username below.
    # The portfolio dynamically fetches your public repository count,
    # stargazers, language stats, and top repositories.
    # -------------------------------------------------------------
    "github_username": "torvalds",  # Replace with your GitHub handle (e.g. 'rithwik', 'octocat')

    # -------------------------------------------------------------
    # Social Media Accounts (Venom Symbiote & Magnetic Buttons)
    # -------------------------------------------------------------
    "socials": {
        "github": {
            "name": "GitHub",
            "url": "https://github.com/",
            "icon": "github",
            "handle": "@github",
            "description": "Code repositories, open source contributions, and experiments.",
        },
        "linkedin": {
            "name": "LinkedIn",
            "url": "https://linkedin.com/in/",
            "icon": "linkedin",
            "handle": "in/developer",
            "description": "Professional history, engineering endorsements, and career updates.",
        },
        "instagram": {
            "name": "Instagram",
            "url": "https://instagram.com/",
            "icon": "instagram",
            "handle": "@instagram",
            "description": "Life behind the terminal, creative visual sketches, and captures.",
        },
    },

    # -------------------------------------------------------------
    # Web3Forms Contact Form (100% Free, No Backend Key Required)
    # Get your free access key in 30 seconds at: https://web3forms.com
    # Just enter your email and paste the key here or via WEB3FORMS_ACCESS_KEY env variable!
    # -------------------------------------------------------------
    "web3forms_access_key": "YOUR_WEB3FORMS_ACCESS_KEY_HERE",

    # -------------------------------------------------------------
    # "Who Was I" - Interactive Story Chronicles & Backstory
    # Scrollable journey through your personal evolution and milestones
    # -------------------------------------------------------------
    "who_was_i_stories": [
        {
            "id": "origins",
            "period": "Phase 01 // The Curious Spark",
            "year": "The Early Days",
            "title": "Taking Apart the Machine",
            "tagline": "How a fascination with how things work turned into lines of code.",
            "content": (
                "Before I wrote production-ready services, I was the kid who opened up "
                "old electronics just to see the silicon gears turning inside. My first lines "
                "of code weren't clean or structured — they were simple scripts, text games, "
                "and crude loops. But the feeling of commanding electrons was pure magic."
            ),
            "lesson": "Curiosity without fear of breaking things is where real engineering starts.",
            "badge": "Origins",
        },
        {
            "id": "wilderness",
            "period": "Phase 02 // The Wilderness",
            "year": "The Crucible Years",
            "title": "Into Python & Backend Depths",
            "tagline": "Grappling with databases, architecture patterns, and algorithmic scale.",
            "content": (
                "Transitioning into deep Python and Django was a watershed moment. "
                "Suddenly, it wasn't just about syntax — it was about architecture, state management, "
                "ORM optimizations, secure authentication, and handling concurrency. I spent late nights "
                "tracing bottlenecks, reading PEPs, and building microservices from scratch."
            ),
            "lesson": "Resilience in code comes from embracing edge cases before they find you.",
            "badge": "Growth",
        },
        {
            "id": "creative-gravity",
            "period": "Phase 03 // The Synthesis",
            "year": "Modern Era",
            "title": "Gravity-Defying Web & Aesthetics",
            "tagline": "Merging strict backend logic with tactile, organic frontend physics.",
            "content": (
                "Engineering is half science and half sensory experience. A fast backend is "
                "essential, but pairing it with fluid, physics-driven interfaces creates unforgettable "
                "software. From canvas-based antigravity particles to dynamic symbiote magnetic physics, "
                "I discovered the power of making the web feel alive and responsive."
            ),
            "lesson": "Great software shouldn't just function; it should evoke wonder and delight.",
            "badge": "Aesthetics",
        },
        {
            "id": "future-horizons",
            "period": "Phase 04 // The Horizon",
            "year": "Present & Forward",
            "title": "Designing Scalable Frontiers",
            "tagline": "Continuous curiosity, distributed cloud computing, and real-world impact.",
            "content": (
                "Today, 'Who I Am' is an ongoing commit history. I focus on building production-grade "
                "Django applications hosted on modern cloud fabrics like Render, architecting clean APIs, "
                "automating deployments, and constantly challenging what's possible at the intersection "
                "of reliability and high visual polish."
            ),
            "lesson": "Never stop being the curious beginner in a room full of veterans.",
            "badge": "Horizons",
        },
    ],

    # -------------------------------------------------------------
    # Technical Skills & Arsenal
    # -------------------------------------------------------------
    "skill_categories": [
        {
            "category": "Backend & Core",
            "skills": ["Python 3.12+", "Django 6", "REST Framework", "PostgreSQL", "SQLite", "Celery / Redis"]
        },
        {
            "category": "Frontend & Creative",
            "skills": ["HTML5 Canvas", "Modern Vanilla CSS", "Magnetic Physics", "Responsive Design", "Symbiote Slime Math"]
        },
        {
            "category": "DevOps & Cloud",
            "skills": ["Render Deployment", "Gunicorn", "WhiteNoise", "Git & GitHub CI", "Linux / Bash", "Docker"]
        },
    ],
}


def get_next_birthday_countdown(dob_str: str):
    """
    Computes human-readable countdown and details for the upcoming birthday celebration.
    """
    try:
        dob_date = datetime.strptime(dob_str, "%Y-%m-%d").date()
    except Exception:
        dob_date = date(2002, 8, 15)

    today = date.today()
    # Check if birthday already happened this year
    current_year_bday = date(today.year, dob_date.month, dob_date.day)
    
    if current_year_bday < today:
        next_bday = date(today.year + 1, dob_date.month, dob_date.day)
        next_age = (today.year + 1) - dob_date.year
    else:
        next_bday = current_year_bday
        next_age = today.year - dob_date.year

    days_remaining = (next_bday - today).days

    return {
        "dob_formatted": dob_date.strftime("%B %d, %Y"),
        "dob_short": dob_date.strftime("%d %b"),
        "birth_year": dob_date.year,
        "next_celebration_date": next_bday.strftime("%Y-%m-%d"),
        "next_celebration_formatted": next_bday.strftime("%B %d, %Y"),
        "days_remaining": days_remaining,
        "turning_age": next_age,
        "is_today": days_remaining == 0,
    }
