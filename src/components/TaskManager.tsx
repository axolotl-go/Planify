"use client";
import { Reorder } from "motion/react";
import { useEffect, useState } from "react";
import { FaTrash } from "react-icons/fa";
import { FaGripVertical } from "react-icons/fa6";

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
    }, 500);

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
      tasks.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t))
    );
  };

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
        <Reorder.Group
          axis="y"
          values={tasks}
          onReorder={setTasks}
          className="space-y-2"
        >
          {tasks.map((task) => (
            <Reorder.Item key={task.id} value={task}>
              <div className="flex items-center space-x-2 text-black  bg-gray-100 p-2 rounded cursor-move">
                <span>
                  <FaGripVertical className="h-4 w-4 text-gray-400" />
                </span>

                  <input
                    type="checkbox"
                    className="accent-purple-700 "
                    onClick={() => toggleTaskCompletion(task.id)}
                    defaultChecked = { task.completed == true }
                  />

                <span
                  className={`flex-grow break-all  ${
                    task.completed ? "line-through text-gray-500" : ""
                  }`}
                >
                  {task.text} - {task.date}
                </span>
                <button onClick={() => deleteTask(task.id)}>
                  <FaTrash className="h-4 w-4" />
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
