const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

// In-memory tasks (fastest)
let tasks = [
  { id: 1, text: "First task", done: false },
  { id: 2, text: "Second task", done: true },
];

// Health check
app.get("/", (req, res) => res.send("API is running"));

// GET all tasks
app.get("/tasks", (req, res) => {
  res.json(tasks);
});

// POST create task
app.post("/tasks", (req, res) => {
  const { text } = req.body;
  if (!text || !text.trim()) return res.status(400).json({ error: "Task text required" });

  const newTask = {
    id: Date.now(),
    text: text.trim(),
    done: false,
  };

  tasks.unshift(newTask);
  res.status(201).json(newTask);
});

// PATCH toggle done
app.patch("/tasks/:id", (req, res) => {
  const id = Number(req.params.id);
  const task = tasks.find((t) => t.id === id);
  if (!task) return res.status(404).json({ error: "Task not found" });

  task.done = !task.done;
  res.json(task);
});

// DELETE task
app.delete("/tasks/:id", (req, res) => {
  const id = Number(req.params.id);
  const before = tasks.length;
  tasks = tasks.filter((t) => t.id !== id);

  if (tasks.length === before) return res.status(404).json({ error: "Task not found" });
  res.status(204).send();
});

const PORT = 5001;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
