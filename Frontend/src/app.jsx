import React, { useEffect, useState } from "react";
import API from "./services/api";
import "./App.css";

function App() {
  const [tasks, setTasks] = useState("");
  const [taskList, setTaskList] = useState([]);

  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = async () => {
    const res = await API.get("/");
    setTaskList(res.data);
  };

  const addTask = async () => {
    if (!tasks) return;
    await API.post("/", { title: tasks });
    setTasks("");
    loadTasks();
  };

  const deleteTask = async (id) => {
    await API.delete(`/${id}`);
    loadTasks();
  };

  return (
    <div className="container">
      <h2>Task Manager</h2>

      <div className="input-box">
        <input
          type="text"
          placeholder="Enter task"
          value={tasks}
          onChange={(e) => setTasks(e.target.value)}
        />
        <button onClick={addTask}>Add</button>
      </div>

      <ul>
        {taskList.map((task) => (
          <li key={task.id}>
            {task.title}
            <button onClick={() => deleteTask(task.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
