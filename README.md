# 🚀 Professional Python & Django Personal Portfolio

An ultra-modern, interactive personal portfolio website built with **Python 3.12**, **Django 6**, and **Vanilla CSS/JS**. Engineered specifically for turnkey hosting on **[Render.com](https://render.com)** with WhiteNoise static asset serving, living physics simulations, dynamic contrast typography, and GitHub API synchronization.

---

## ✨ Standout Features

1. **🌌 Antigravity Intro Page Loader**
   - Fullscreen inverted-gravity canvas animation on initial load.
   - Nodes and filaments gently drift and levitate, then gracefully fade out to reveal the portfolio.

2. **🎨 Dynamic Animated Background & Adaptive Contrast**
   - Smooth light-to-dark gradient mesh transitions.
   - Intelligent scroll-linked contrast engine that dynamically adapts font luminance and card surfaces for pristine readability.

3. **🦠 Venom Symbiote & Magnetic Social Dock**
   - Fixed social dock (LinkedIn, Instagram, GitHub) with a 120px magnetic capture radius.
   - Living Venom symbiote physics: organic black & iridescent violet tendrils dynamically stretch out, wiggle, and latch onto the mouse cursor, pulling the button towards the cursor with spring physics.

4. **🎂 DOB & Celebration Countdown Ticker**
   - Displays Date of Birth in a celebratory badge.
   - Real-time countdown (Days, Hours, Minutes, Seconds) calculating the exact time remaining until the next upcoming birthday celebration.

5. **🐙 Dynamic GitHub Synchronizer**
   - Automatically polls the GitHub REST API (`/api/github-stats/`) with in-memory caching.
   - Repository count and stargazers increment dynamically with smooth counter animations whenever new public repos are created.
   - Instant client-side search & topic filtering for projects.

6. **📜 "Who Was I" Chronicle & Journey**
   - Dedicated multi-page route (`/story/`) featuring an interactive scrollable timeline of personal evolution, lessons, and engineering philosophy.

7. **📬 Free Web3Forms Contact Integration**
   - Direct, serverless mail delivery powered by [Web3Forms](https://web3forms.com).
   - Async AJAX transmission with instant live validation and alert feedback.

---

## 📁 Project Architecture

```text
personalportfolio/
├── build.sh                  # Render build script (installs deps, collects static, migrates)
├── Procfile                  # Render web process definition (Gunicorn)
├── render.yaml               # Render Infrastructure-as-Code Blueprint
├── runtime.txt               # Declares Python 3.12.3 runtime for Render
├── requirements.txt          # Python dependencies (Django, Gunicorn, WhiteNoise, Requests)
├── portfolio_config.py       # 🎯 SINGLE CONFIG FILE: Edit your name, DOB, GitHub, socials here
├── core/
│   ├── settings.py           # Production-ready Django settings (WhiteNoise, Render hosts)
│   ├── urls.py               # Main URL router
│   └── wsgi.py               # WSGI entrypoint for Gunicorn
└── portfolio/
    ├── context_processors.py # Supplies global portfolio & DOB data to all templates
    ├── models.py             # Optional models for FeaturedProject & StoryChronicle
    ├── admin.py              # Registered Django admin
    ├── views.py              # Multi-page views & /api/github-stats/ endpoint
    ├── urls.py               # Routes for /, /story/, /projects/, /contact/
    ├── static/portfolio/
    │   ├── css/style.css     # Modern design system, tokens, glassmorphism, responsive
    │   └── js/
    │       ├── antigravity-loader.js  # Floating node canvas loader
    │       ├── venom-symbiote.js      # Magnetic pull & symbiote slime tendrils
    │       ├── gradient-contrast.js   # Dynamic scroll background & font contrast
    │       ├── countdown.js           # Live DOB countdown ticker
    │       └── github-counter.js      # Live GitHub repo counter & search
    └── templates/portfolio/
        ├── base.html         # Base template with nav, symbiote dock, and loader
        ├── index.html        # Landing page with hero, countdown, and teaser
        ├── story.html        # "Who Was I" chronicles & milestones
        ├── projects.html     # Live GitHub repository showcase
        └── contact.html      # Web3Forms contact form
```

---

## 🛠️ Quickstart: Running Locally

1. **Activate virtual environment**:
   ```bash
   source venv/bin/activate
   ```

2. **Install dependencies** (already installed in workspace):
   ```bash
   pip install -r requirements.txt
   ```

3. **Run database migrations**:
   ```bash
   python manage.py migrate
   ```

4. **Start the local server**:
   ```bash
   python manage.py runserver
   ```
   Open `http://127.0.0.1:8000/` in your browser.

---

## ⚙️ How to Personalize (In 60 Seconds)

Open [`portfolio_config.py`](file:///home/rith/PROJECTS/personalportfolio/portfolio_config.py) and update:

- **Name & Bio**:
  ```python
  "name": "Rith",
  "full_name": "Rith",
  "role": "Python & Django Developer | Creative Technologist",
  ```
- **Date of Birth (DOB)**:
  ```python
  "dob": "2002-08-15",  # Format: YYYY-MM-DD
  ```
- **GitHub Username** (for live repo count & showcases):
  ```python
  "github_username": "your-github-handle",
  ```
- **Social Media Links** (Venom symbiote buttons):
  ```python
  "socials": {
      "github": {"url": "https://github.com/your-username", ...},
      "linkedin": {"url": "https://linkedin.com/in/your-profile", ...},
      "instagram": {"url": "https://instagram.com/your-handle", ...},
  }
  ```
- **Free Web3Forms Access Key**:
  1. Visit [web3forms.com](https://web3forms.com) and enter your email (key is generated instantly for free).
  2. Paste it in `portfolio_config.py` under `"web3forms_access_key"` or set it as an environment variable in Render.

---

## ☁️ Deploying to Render.com

Deploying is completely turnkey thanks to the included [`build.sh`](file:///home/rith/PROJECTS/personalportfolio/build.sh), [`Procfile`](file:///home/rith/PROJECTS/personalportfolio/Procfile), and [`render.yaml`](file:///home/rith/PROJECTS/personalportfolio/render.yaml):

1. **Push your code to GitHub**:
   ```bash
   git init
   git add .
   git commit -m "Initial portfolio commit"
   git remote add origin https://github.com/<YOUR_USER>/personalportfolio.git
   git push -u origin main
   ```

2. **Create New Web Service on Render**:
   - Go to [dashboard.render.com](https://dashboard.render.com).
   - Click **New +** → **Web Service**.
   - Select your GitHub repository.
   - Render will auto-detect settings, or configure:
     - **Runtime**: `Python 3`
     - **Build Command**: `./build.sh`
     - **Start Command**: `gunicorn core.wsgi:application --bind 0.0.0.0:$PORT`
   - Under **Environment Variables**, add:
     - `PYTHON_VERSION`: `3.12.3`
     - `DEBUG`: `False`
     - `SECRET_KEY`: `<Generate a random string or click generate>`
     - `WEB3FORMS_ACCESS_KEY`: `<Your free Web3Forms key>`
     - `GITHUB_USERNAME`: `<Your GitHub handle>`

3. **Click "Deploy Web Service"**!
   Your portfolio will be live at `https://your-app.onrender.com` with HTTPS and zero maintenance.
