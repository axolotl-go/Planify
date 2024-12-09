"use client";
import { Reorder } from "motion/react";
import { useEffect, useState } from "react";
import { FaTrash } from "react-icons/fa";

const TaskManager = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTask, setNewTask] = useState("");
  const [taskDate, setTaskDate] = useState("");

  useEffect(() => {
    const savedTasks = localStorage.getItem("tasks");
    if (savedTasks) {
      try {
        setTasks(JSON.parse(savedTasks));
      } catch (error) {
        console.error("Error parsing tasks from localStorage:", error);
      }
    }
  }, []);

  useEffect(() => {
    const timeout = setTimeout(() => {
      localStorage.setItem("tasks", JSON.stringify(tasks));
    }, 5000); // Guarda después de 500ms de inactividad
  
    return () => clearTimeout(timeout); // Limpia el timeout en cada cambio
  }, [tasks]);
  

  const addTask = () => {
    if (newTask.trim() !== "" && taskDate !== "") {
      setTasks([
        ...tasks,
        { id: Date.now(), text: newTask, completed: false, date: taskDate },
      ]);
    }
  };

  const deleteTask = (id: number) => {
    setTasks(tasks.filter((t) => t.id !== id));
  };

  const toggleTaskCompletion = (id: number) => {
    setTasks(
      tasks.map((t) =>
        t.id === id? {...t, completed:!t.completed } : t
      )
    );
  }

  return (
    <div className="bg-zinc-900 border-2 border-zinc-700 p-6 rounded-lg max-w-md mx-auto shadow-lg">
      <p className="text-center text-white text-xl font-bold mb-4">My Tasks</p>

      <div className="grid grid-cols-1 gap-4 mb-4">
        <div className="flex space-x-4">
          <input
            type="text"
            onChange={(e) => setNewTask(e.target.value)}
            placeholder="Nueva tarea"
            className="p-3 rounded-md text-black focus:outline-none focus:ring-2 focus:ring-purple-600 w-full"
          />
          <input
            type="date"
            onChange={(e) => setTaskDate(e.target.value)}
            className="w-full p-3 rounded-md text-black focus:outline-none focus:ring-2 focus:ring-purple-600"
          />
        </div>
        <button
          onClick={addTask}
          className="bg-purple-600 text-white font-semibold py-2 px-4 rounded-md hover:bg-purple-700 transition-all duration-200 w-full"
        >
          Agregar
        </button>
      </div>

      {/* Mostrar las tareas */}
      <div className="mb-4">
        <Reorder.Group axis="y" values={tasks} onReorder={setTasks}>
          {tasks.map((task) => (
            <Reorder.Item
            key={task.id}
            value={task}
            className={`flex items-center justify-between p-4 mb-2 border rounded-md shadow-sm transition-all duration-200 ${
              task.completed ? "bg-green-100" : "bg-white"
            }`}
          >
            <div>
              <span
                className={`font-medium ${
                  task.completed ? "text-gray-400 line-through" : "text-gray-800"
                }`}
              >
                {task.text}
              </span>
              <p className="text-sm text-gray-500 mt-1">
                {new Date(task.date).toLocaleDateString("es-MX", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </p>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={() => toggleTaskCompletion(task.id)}
                className={`px-2 py-1 text-sm font-semibold rounded ${
                  task.completed
                    ? "bg-green-500 text-white hover:bg-green-600"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                {task.completed ? "Completada" : "Pendiente"}
              </button>
              <button
                onClick={() => deleteTask(task.id)}
                className="text-red-600 hover:text-red-800 font-semibold transition-all duration-200"
              >
                <FaTrash />
              </button>
            </div>
          </Reorder.Item>
          
          ))}
        </Reorder.Group>
      </div>
    </div>
  );
};

export default TaskManager;
