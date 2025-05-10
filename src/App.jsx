import React, { useEffect, useState } from "react";
import Header from "./components/Header.jsx";
import Footer from "./components/Footer.jsx";
import { scanTodos, createTodo, updateTodo, deleteTodo } from "./dynamo";

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

  const handleToggleComplete = async (id, currentCompleted) => {
    const updatedTodo = await updateTodo(id, { completed: !currentCompleted });
    setTodos((prev) =>
      prev.map((todo) => (todo.id === id ? { ...todo, ...updatedTodo } : todo))
    );
  };

  const handleDelete = async (id) => {
    await deleteTodo(id);
    setTodos((prev) => prev.filter((todo) => todo.id !== id));
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
                <input
                  type="checkbox"
                  checked={todo.completed}
                  onChange={() => handleToggleComplete(todo.id, todo.completed)}
                />
                {todo.text} {todo.completed ? "(done)" : ""}
                <button onClick={() => handleDelete(todo.id)}>×</button>
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
