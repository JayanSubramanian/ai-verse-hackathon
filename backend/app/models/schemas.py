from typing import List, Optional, Dict
from sqlmodel import SQLModel, Field, Relationship, JSON, Column
from datetime import datetime

# --- DB Models ---

class User(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    name: str
    email: str = Field(unique=True)
    current_role: Optional[str] = None
    experience_level: str
    bio: Optional[str] = None
    
    # Relationships
    skills: List["Skill"] = Relationship(back_populates="user")
    experiences: List["Experience"] = Relationship(back_populates="user")
    roadmaps: List["RoadmapDB"] = Relationship(back_populates="user")
    feedbacks: List["ApplicationFeedback"] = Relationship(back_populates="user")

class Skill(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    name: str
    level: str  # Beginner, Intermediate, Expert
    user_id: int = Field(foreign_key="user.id")
    user: User = Relationship(back_populates="skills")

class Experience(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    title: str
    company: str
    description: str
    start_date: str
    end_date: Optional[str] = None
    user_id: int = Field(foreign_key="user.id")
    user: User = Relationship(back_populates="experiences")

class RoadmapDB(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    target_role: str
    summary: str
    created_at: datetime = Field(default_factory=datetime.utcnow)
    is_active: bool = Field(default=True)
    user_id: int = Field(foreign_key="user.id")
    user: User = Relationship(back_populates="roadmaps")
    milestones: List["MilestoneDB"] = Relationship(back_populates="roadmap")

class MilestoneDB(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    title: str
    description: str
    duration: str
    status: str = Field(default="Not Started") # Not Started, In Progress, Completed
    roadmap_id: int = Field(foreign_key="roadmapdb.id")
    roadmap: RoadmapDB = Relationship(back_populates="milestones")
    resources: List[Dict] = Field(default=[], sa_column=Column(JSON))

class ApplicationFeedback(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    job_title: str
    company: str
    outcome: str # Rejected, Interview, Offer
    feedback_text: Optional[str] = None
    user_id: int = Field(foreign_key="user.id")
    user: User = Relationship(back_populates="feedbacks")

# --- API Schemas ---

class UserProfile(SQLModel):
    name: str
    current_role: Optional[str] = None
    skills: List[str] = []
    interests: List[str] = []
    career_goals: str
    experience_level: str
    bio: Optional[str] = None

class CareerPathSuggestion(SQLModel):
    role: str
    match_score: int
    reasoning: str
    missing_skills: List[str]

class LearningResource(SQLModel):
    title: str
    type: str 
    url: Optional[str] = None
    estimated_time: str

class Milestone(SQLModel):
    title: str
    description: str
    resources: List[LearningResource]
    duration: str

class Roadmap(SQLModel):
    target_role: str
    summary: str
    milestones: List[Milestone]

class AgentResponse(SQLModel):
    analysis: str
    suggested_paths: List[CareerPathSuggestion]
    roadmap: Optional[Roadmap] = None