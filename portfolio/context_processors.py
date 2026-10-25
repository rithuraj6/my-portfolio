import os
from datetime import datetime
from portfolio_config import PORTFOLIO_CONFIG, get_next_birthday_countdown

def portfolio_context(request):
    """
    Supplies portfolio configuration, live DOB celebration countdown,
    and request metadata to all templates automatically.
    """
    config = dict(PORTFOLIO_CONFIG)
    
    # Allow environment variable overrides on Render or production
    if os.environ.get("GITHUB_USERNAME"):
        config["github_username"] = os.environ.get("GITHUB_USERNAME")
    if os.environ.get("WEB3FORMS_ACCESS_KEY"):
        config["web3forms_access_key"] = os.environ.get("WEB3FORMS_ACCESS_KEY")
    if os.environ.get("PORTFOLIO_NAME"):
        config["name"] = os.environ.get("PORTFOLIO_NAME")
    if os.environ.get("PORTFOLIO_DOB"):
        config["dob"] = os.environ.get("PORTFOLIO_DOB")

    bday_data = get_next_birthday_countdown(config.get("dob", "2002-08-15"))

    return {
        "portfolio": config,
        "bday": bday_data,
        "current_year": datetime.now().year,
        "current_path": request.path,
    }
