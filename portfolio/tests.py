from django.test import TestCase, Client
from django.urls import reverse
from portfolio_config import get_next_birthday_countdown

class PortfolioViewsTestCase(TestCase):
    def setUp(self):
        self.client = Client()

    def test_home_page_status(self):
        response = self.client.get(reverse("portfolio:home"))
        self.assertEqual(response.status_code, 200)
        self.assertContains(response, "INITIALIZING ANTIGRAVITY FIELD")
        self.assertContains(response, "Countdown to Celebration")

    def test_story_page_status(self):
        response = self.client.get(reverse("portfolio:story"))
        self.assertEqual(response.status_code, 200)
        self.assertContains(response, "Who Was I?")

    def test_projects_page_status(self):
        response = self.client.get(reverse("portfolio:projects"))
        self.assertEqual(response.status_code, 200)
        self.assertContains(response, "Live Projects")

    def test_contact_page_status(self):
        response = self.client.get(reverse("portfolio:contact"))
        self.assertEqual(response.status_code, 200)
        self.assertContains(response, "Web3Forms")

    def test_github_api_status(self):
        response = self.client.get(reverse("portfolio:github_stats_api"))
        self.assertEqual(response.status_code, 200)
        json_data = response.json()
        self.assertIn("public_repos", json_data)

    def test_birthday_countdown_calculation(self):
        result = get_next_birthday_countdown("2000-01-01")
        self.assertIn("days_remaining", result)
        self.assertIn("turning_age", result)
        self.assertGreaterEqual(result["days_remaining"], 0)
