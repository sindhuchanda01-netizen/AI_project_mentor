import sqlite3

DATABASE = "projects.db"


def get_connection():
    connection = sqlite3.connect(DATABASE)
    connection.row_factory = sqlite3.Row
    return connection


def create_tables():
    connection = get_connection()

    connection.execute("""
        CREATE TABLE IF NOT EXISTS projects (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            description TEXT,
            technology TEXT
        )
    """)

    connection.commit()
    connection.close()


def add_project(name, description, technology):
    connection = get_connection()

    cursor = connection.execute(
        """
        INSERT INTO projects (name, description, technology)
        VALUES (?, ?, ?)
        """,
        (name, description, technology)
    )

    connection.commit()

    project_id = cursor.lastrowid

    connection.close()

    return project_id


def get_projects():
    connection = get_connection()

    projects = connection.execute(
        "SELECT * FROM projects ORDER BY id DESC"
    ).fetchall()

    connection.close()

    return [dict(project) for project in projects]