import React, { useEffect, useState } from "react";
import Header from "./components/Header.jsx";
import Footer from "./components/Footer.jsx";
import { scanTodos, createTodo } from "./dynamo";

export default function App() {
  const [todos, setTodos] = useState([]);
  const [input, setInput] = useState("");

  useEffect(() => {
    async function fetchTodos() {
      const items = await scanTodos();
      setTodos(items || []);
    }
    fetchTodos();
  }, []);

  const handleAdd = async () => {
    if (!input.trim()) return;
    const newItem = {
      id: Date.now().toString(),
      text: input,
      completed: false,
    };
    await createTodo(newItem);
    setTodos((prev) => [...prev, newItem]);
    setInput("");
  };

  return (
    <>
      <Header />
      <main className="main">
        <div className="card">
          <h2>Todo List</h2>
          <ul>
            {todos.map((todo) => (
              <li key={todo.id}>
                {todo.text} {todo.completed ? "(done)" : ""}
              </li>
            ))}
          </ul>
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="New todo"
          />
          <button onClick={handleAdd}>Add</button>
        </div>
      </main>
      <Footer />
    </>
  );
}
