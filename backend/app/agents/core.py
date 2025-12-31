import os
import google.generativeai as genai
import json
from typing import Optional, List
from dotenv import load_dotenv
from ..models.schemas import UserProfile, AgentResponse, Roadmap, CareerPathSuggestion, ApplicationFeedback

load_dotenv()

API_KEY = os.getenv("GOOGLE_API_KEY")
if API_KEY:
    genai.configure(api_key=API_KEY)

class CareerAgent:
    def __init__(self):
        self.model = genai.GenerativeModel('gemini-1.5-flash')

    def analyze_profile(self, profile: UserProfile, history: Optional[List[ApplicationFeedback]] = None) -> AgentResponse:
        """
        Analyze user profile and history to provide reasoning and planning.
        """
        history_context = ""
        if history:
            history_context = "User's Application History:\n" + "\n".join([
                f"- {f.job_title} at {f.company}: {f.outcome}. Feedback: {f.feedback_text}" 
                for f in history
            ])

        prompt = f"""
        You are an Agentic AI Career Mentor. 
        Your goal is to guide the user from their current state to job readiness.
        
        {history_context}

        User Profile:
        - Name: {profile.name}
        - Role: {profile.current_role}
        - Skills: {', '.join(profile.skills)}
        - Goals: {profile.career_goals}
        - Bio: {profile.bio}

        Tasks:
        1. REASON: Analyze the gap between their current skills and their goals. 
           Consider the application history if provided to identify patterns in rejections or successes.
        2. PLAN: Suggest 3 realistic career paths.
        3. ACT: Generate a detailed, adaptive learning roadmap for the top path.

        Output JSON:
        {{
            "analysis": "...",
            "suggested_paths": [...],
            "roadmap": {{...}}
        }}
        """
        
        if not API_KEY:
            return self._get_mock_response(profile)

        try:
            response = self.model.generate_content(prompt, generation_config={"response_mime_type": "application/json"})
            data = json.loads(response.text)
            return AgentResponse(**data)
        except Exception as e:
            print(f"Agent Error: {e}")
            return self._get_mock_response(profile)

    def recommend_jobs(self, profile: UserProfile) -> List[dict]:
        """
        Mock action for job recommendation.
        """
        return [
            {"title": "Software Engineer I", "company": "Tech Corp", "match_score": 88, "link": "#"},
            {"title": "Junior Developer", "company": "Startup Inc", "match_score": 92, "link": "#"}
        ]

    def tailor_resume(self, resume_text: str, job_description: str) -> str:
        """
        Agentic action to tailor resume for a specific job.
        """
        prompt = f"Tailor this resume for the following job description:\nResume: {resume_text}\nJD: {job_description}"
        # Shell logic
        return "Tailored Resume Content..."

    def _get_mock_response(self, profile: UserProfile) -> AgentResponse:
        # (Keep existing mock or enhance)
        return AgentResponse(
            analysis="Based on your profile, you have a strong foundation in frontend but need to strengthen your backend skills for Full Stack roles.",
            suggested_paths=[
                {"role": "Frontend Specialist", "match_score": 95, "reasoning": "Fits current skill set perfectly.", "missing_skills": ["Tailwind CSS"]},
                {"role": "Full Stack Engineer", "match_score": 70, "reasoning": "Strategic growth path.", "missing_skills": ["PostgreSQL", "FastAPI"]}
            ],
            roadmap=Roadmap(
                target_role="Full Stack Engineer",
                summary="Focus on backend integration and database management.",
                milestones=[
                    {
                        "title": "Backend Basics",
                        "description": "Learn Python and FastAPI.",
                        "duration": "3 weeks",
                        "resources": [{"title": "FastAPI Docs", "type": "Course", "url": "https://fastapi.tiangolo.com", "estimated_time": "15h"}]
                    }
                ]
            )
        )