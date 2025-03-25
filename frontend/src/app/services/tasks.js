import axios from 'axios';
import { toast } from 'react-hot-toast';

// API URL
const API_URL = process.env.NEXT_PUBLIC_API_URL;

// Fetch all tasks
export const getTasks = async () => {
  try {
    const response = await axios.get(API_URL);
    return response.data.data;
  } catch (error) {
    toast.error('Failed to fetch tasks');
    throw error;
  }
};

// Create a new task
export const createTask = async (taskData) => {
  try {
    const response = await axios.post(API_URL, taskData);
    return response.data;
  } catch (error) {
    if (error.response?.status === 409) {
      // Extract the detailed error information
      const { message, code, existingTaskId, suggestion } = error.response.data.error;
      throw {
        message,
        code,
        existingTaskId,
        suggestion,
        isDuplicate: true
      };
    }
    throw new Error(error.response?.data?.error?.message || 'Failed to create task');
  }
};

// Update a task
export const updateTask = async (id, taskData) => {
  try {
    const response = await axios.put(`${API_URL}/${id}`, taskData);
    toast.success('Task updated successfully');
    return response.data.data;
  } catch (error) {
    if (error.response?.status === 409) {
      // Extract the detailed error information
      const { message, code, existingTaskId, suggestion } = error.response.data.error;
      throw {
        message,
        code,
        existingTaskId,
        suggestion,
        isDuplicate: true
      };
    }
    throw new Error(error.response?.data?.error?.message || 'Failed to create task');
  }
};

// Delete a task
export const deleteTask = async (id) => {
  try {
    await axios.delete(`${API_URL}/${id}`);
    toast.success('Task deleted successfully');
  } catch (error) {
    toast.error('Failed to delete task');
    throw error;
  }
};