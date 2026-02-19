import { useEffect, useState } from "react";
import "./App.css";

export default function App() {
  const [tasks, setTasks] = useState([]);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  // Load tasks
  async function loadTasks() {
    try {
      setErr("");
      setLoading(true);

      const res = await fetch("/tasks");
      const data = await res.json();

      setTasks(data);
    } catch (e) {
      setErr("Could not load tasks.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadTasks();
  }, []);

  // Add task
  async function addTask(e) {
    e.preventDefault();

    const value = text.trim();
    if (!value) return;

    const res = await fetch("/tasks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: value }),
    });

    if (!res.ok) {
      setErr("Add failed.");
      return;
    }

    setText("");
    loadTasks();
  }

  // Toggle task
  async function toggleTask(id) {
    await fetch(`/tasks/${id}`, { method: "PATCH" });
    loadTasks();
  }

  // Delete task
  async function deleteTask(id) {
    await fetch(`/tasks/${id}`, { method: "DELETE" });
    loadTasks();
  }

  return (
    <div className="container">
      <h1>Task Manager</h1>

      <form className="input-row" onSubmit={addTask}>
        <input
          placeholder="Add a task..."
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <button>Add</button>
      </form>

      {loading && <p>Loading...</p>}
      {err && <p style={{ color: "red" }}>{err}</p>}

      {tasks.map((task) => (
        <div key={task.id} className="task">
          <span
            style={{
              textDecoration: task.done ? "line-through" : "none",
              cursor: "pointer",
            }}
            onClick={() => toggleTask(task.id)}
          >
            {task.text}
          </span>

          <button onClick={() => deleteTask(task.id)}>Delete</button>
        </div>
      ))}
    </div>
  );
}
