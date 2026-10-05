import { useEffect, useState } from "react";
import "./App.css";

const API = "http://127.0.0.1:8000";

function App() {

  const [messages, setMessages] = useState([
    {
      role: "ai",
      text: "Hello! I am your AI Project Mentor. How can I help you?"
    }
  ]);

  const [input, setInput] = useState("");
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);

  const [projectName, setProjectName] = useState("");
  const [projectDescription, setProjectDescription] = useState("");
  const [projectTechnology, setProjectTechnology] = useState("");


  useEffect(() => {
    loadProjects();
  }, []);


  async function loadProjects() {

    try {

      const response = await fetch(`${API}/projects`);

      const data = await response.json();

      setProjects(data);

    } catch (error) {

      console.log(error);

    }
  }


  async function sendMessage(customMessage = null) {

    const message = customMessage || input;

    if (!message.trim()) {
      return;
    }

    setMessages(prev => [
      ...prev,
      {
        role: "user",
        text: message
      }
    ]);

    setInput("");


    try {

      const response = await fetch(`${API}/chat`, {

        method: "POST",

        headers: {
          "Content-Type": "application/json"
        },

        body: JSON.stringify({
          message: message
        })

      });


      const data = await response.json();


      setMessages(prev => [
        ...prev,
        {
          role: "ai",
          text: data.reply
        }
      ]);


    } catch (error) {

      setMessages(prev => [
        ...prev,
        {
          role: "ai",
          text: "Backend connection failed."
        }
      ]);

    }
  }


  async function createProject() {

    if (!projectName.trim()) {

      alert("Enter project name");

      return;
    }


    try {

      await fetch(`${API}/projects`, {

        method: "POST",

        headers: {
          "Content-Type": "application/json"
        },

        body: JSON.stringify({

          name: projectName,

          description: projectDescription,

          technology: projectTechnology

        })

      });


      setProjectName("");

      setProjectDescription("");

      setProjectTechnology("");

      loadProjects();

      alert("Project created successfully!");

    } catch (error) {

      alert("Unable to create project");

    }
  }


  function newChat() {

    setMessages([
      {
        role: "ai",
        text: "New chat started. What project do you want to work on?"
      }
    ]);

  }


  return (

    <div className="app">


      <aside className="sidebar">

        <div className="logo">
          🤖 AI Project Mentor
        </div>


        <button
          className="new-chat"
          onClick={newChat}
        >
          + New Chat
        </button>


        <div className="menu">

          <h3>Workspace</h3>


          <button
            onClick={() =>
              sendMessage(
                "Give me 5 innovative AI full stack project ideas for a B.Tech student."
              )
            }
          >
            💡 Project Ideas
          </button>


          <button
            onClick={() =>
              sendMessage(
                "Create a complete development plan for my project."
              )
            }
          >
            📋 Project Plan
          </button>


          <button
            onClick={() =>
              sendMessage(
                "Help me debug my project code."
              )
            }
          >
            🐞 Debug Code
          </button>


          <button
            onClick={() =>
              sendMessage(
                "Help me create project documentation."
              )
            }
          >
            📝 Documentation
          </button>

        </div>


        <div className="project-section">

          <h3>Projects</h3>


          {projects.length === 0 && (
            <p className="empty">
              No projects yet
            </p>
          )}


          {projects.map(project => (

            <div
              className="project-item"
              key={project.id}
              onClick={() =>
                sendMessage(
                  `Give me guidance for my project ${project.name}. Description: ${project.description}. Technologies: ${project.technology}`
                )
              }
            >
              📁 {project.name}
            </div>

          ))}

        </div>

      </aside>


      <main className="main">


        <header className="header">

          <div>

            <h1>
              AI Project Mentor
            </h1>

            <p>
              Your intelligent software project assistant
            </p>

          </div>


          <div className="status">
            ● AI Online
          </div>

        </header>


        <section className="chat">


          {messages.map((message, index) => (

            <div
              key={index}
              className={
                message.role === "user"
                  ? "message user"
                  : "message ai"
              }
            >

              <div className="avatar">

                {message.role === "user"
                  ? "👩"
                  : "🤖"}

              </div>


              <div className="message-content">

                <strong>

                  {message.role === "user"
                    ? "You"
                    : "AI Mentor"}

                </strong>


                <p>
                  {message.text}
                </p>

              </div>

            </div>

          ))}

        </section>


        <div className="quick-actions">


          <button
            onClick={() =>
              sendMessage(
                "Suggest a unique AI full stack project for a B.Tech student."
              )
            }
          >
            💡 Project Idea
          </button>


          <button
            onClick={() =>
              sendMessage(
                "Give me a step-by-step project development plan."
              )
            }
          >
            📋 Project Plan
          </button>


          <button
            onClick={() =>
              sendMessage(
                "Explain how to debug a Python project."
              )
            }
          >
            🐞 Debug
          </button>


          <button
            onClick={() =>
              sendMessage(
                "Give me a project documentation structure."
              )
            }
          >
            📝 Docs
          </button>

        </div>


        <div className="input-area">


          <input

            type="text"

            placeholder="Ask your AI Project Mentor..."

            value={input}

            onChange={(e) =>
              setInput(e.target.value)
            }

            onKeyDown={(e) => {

              if (e.key === "Enter") {

                sendMessage();

              }

            }}

          />


          <button
            onClick={() => sendMessage()}
          >
            Send ➤
          </button>

        </div>

      </main>


      <aside className="right-panel">


        <h2>
          Create Project
        </h2>


        <input

          placeholder="Project name"

          value={projectName}

          onChange={(e) =>
            setProjectName(e.target.value)
          }

        />


        <textarea

          placeholder="Project description"

          value={projectDescription}

          onChange={(e) =>
            setProjectDescription(e.target.value)
          }

        />


        <input

          placeholder="Technologies"

          value={projectTechnology}

          onChange={(e) =>
            setProjectTechnology(e.target.value)
          }

        />


        <button

          className="create-button"

          onClick={createProject}

        >
          + Create Project
        </button>


        <div className="mentor-info">

          <h3>
            AI Mentor
          </h3>

          <p>
            Ask questions about your project,
            coding, debugging, database design,
            documentation and deployment.
          </p>

        </div>

      </aside>


    </div>

  );
}

export default App;