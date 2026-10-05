from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from ollama import chat

from database import (
    create_tables,
    add_project,
    get_projects
)


app = FastAPI(title="AI Project Mentor")


app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)


create_tables()


class ChatRequest(BaseModel):
    message: str


class ProjectRequest(BaseModel):
    name: str
    description: str
    technology: str


@app.get("/")
def home():
    return {
        "message": "AI Project Mentor Backend is Running"
    }


@app.post("/chat")
def chat_with_ai(request: ChatRequest):

    system_prompt = """
    You are AI Project Mentor, an expert software project guide.

    Help students with:
    - project ideas
    - project planning
    - frontend development
    - backend development
    - database design
    - AI and machine learning
    - debugging
    - documentation
    - project presentations

    Give simple, practical and step-by-step answers.

    When the student asks for a project plan,
    provide:
    1. Project title
    2. Objective
    3. Technologies
    4. Modules
    5. Database
    6. Implementation steps
    7. Expected output
    8. Future scope
    """

    response = chat(
        model="llama3.2",
        messages=[
            {
                "role": "system",
                "content": system_prompt
            },
            {
                "role": "user",
                "content": request.message
            }
        ]
    )

    return {
        "reply": response["message"]["content"]
    }


@app.post("/projects")
def create_project(project: ProjectRequest):

    project_id = add_project(
        project.name,
        project.description,
        project.technology
    )

    return {
        "message": "Project created successfully",
        "id": project_id
    }


@app.get("/projects")
def projects():

    return get_projects()