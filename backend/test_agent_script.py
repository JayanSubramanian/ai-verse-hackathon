import sys
import os

# Add the backend directory to sys.path so we can import app modules
sys.path.append(os.path.join(os.path.dirname(__file__), '..'))

from backend.app.models.schemas import UserProfile
from backend.app.agents.core import CareerAgent

def test_agent():
    print("Initializing Agent...")
    agent = CareerAgent()
    
    profile = UserProfile(
        name="Test User",
        current_role="Student",
        experience_level="Entry-level",
        skills=["Python", "Basic HTML"],
        interests=["AI", "Backend"],
        career_goals="Become a Backend Engineer",
        bio="I am a CS student looking for my first job."
    )
    
    print("Analyzing Profile (this calls Gemini API or Mock)...")
    try:
        response = agent.analyze_profile(profile)
        print("\n--- Agent Response ---")
        print(f"Analysis: {response.analysis[:100]}...")
        print(f"Suggested Paths: {len(response.suggested_paths)}")
        print(f"Roadmap Target: {response.roadmap.target_role if response.roadmap else 'None'}")
        print("\nSuccess!")
    except Exception as e:
        print(f"\nError: {e}")

if __name__ == "__main__":
    test_agent()
