'use client';

import { useState } from 'react';
import { PencilIcon, TrashIcon, CheckIcon } from '@heroicons/react/24/outline';
import TaskForm from './TaskForm';
import { updateTask, deleteTask } from '../services/tasks';

export default function TaskItem({ task, onUpdate }) {

  // Add a new state variable to manage the editing state
  const [isEditing, setIsEditing] = useState(false);

  // Update the handleToggleComplete function to use the updateTask function
  const handleToggleComplete = async () => {
    await updateTask(task._id, { completed: !task.completed });
    onUpdate();
  };

  // Update the handleDelete function to use the deleteTask function
  const handleDelete = async () => {
    await deleteTask(task._id);
    onUpdate();
  };

  // Update the TaskItem component to conditionally render the TaskForm component when isEditing is true
  if (isEditing) {
    return (
      <TaskForm
        initialData={task}
        onClose={() => setIsEditing(false)}
        onSuccess={() => {
          setIsEditing(false);
          onUpdate();
        }}
      />
    );
  }

  // JSX code for the TaskItem component
  return (
    <div className={`border rounded-lg p-4 mb-3 ${task.completed ? 'bg-gray-50' : 'bg-white'}`}>
      <div className="flex items-start">
        <button
          onClick={handleToggleComplete}
          className={`mt-1 mr-3 flex-shrink-0 h-5 w-5 rounded border flex items-center justify-center ${task.completed ? 'bg-green-500 border-green-500 text-white' : 'border-gray-300'
            }`}
        >
          {task.completed && <CheckIcon className="h-3 w-3" />}
        </button>
        <div className="flex-grow">
          <h3 className={`font-medium ${task.completed ? 'line-through text-gray-500' : 'text-gray-900'}`}>
            {task.title}
          </h3>
          {task.description && (
            <p className="text-sm text-gray-500 mt-1">{task.description}</p>
          )}
        </div>
        <div className="flex space-x-2 ml-2">
          <button
            onClick={() => setIsEditing(true)}
            className="text-gray-500 hover:text-gray-700"
            aria-label="Edit task"
          >
            <PencilIcon className="h-5 w-5" />
          </button>
          <button
            onClick={handleDelete}
            className="text-gray-500 hover:text-red-500"
            aria-label="Delete task"
          >
            <TrashIcon className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
}