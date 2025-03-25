'use client';

import { useState, useEffect } from 'react';
import { createTask, updateTask } from '../services/tasks';
import { toast } from 'react-hot-toast';

export default function TaskForm({ initialData, onClose, onSuccess }) {

    // Add a new state variable to track the form data
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        completed: false,
    });

    // Add a new state variable to track the form submission status
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Update the form data when the initial data changes
    useEffect(() => {
        if (initialData) {
            setFormData({
                title: initialData.title,
                description: initialData.description || '',
                completed: initialData.completed,
            });
        }
    }, [initialData]);

    // Add a new function to handle form input changes
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    // Add a new function to handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            if (initialData) {
                await updateTask(initialData._id, formData);
            } else {
                const result = await createTask(formData);
            }
            onSuccess();
        } catch (error) {
            console.log("error", error)
            if (error) {
                toast.error(
                    <div>
                        <p>{error.message}</p>
                    </div>,
                    { duration: 5000 }
                );
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    // Render the form
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
                <h2 className="text-xl font-bold mb-4">
                    {initialData ? 'Edit Task' : 'Add New Task'}
                </h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <div className='flex items-center'>
                            <label htmlFor="title" className=" text-sm font-medium text-gray-700">
                                Title
                            </label>
                            <span className="mx-1 text-xs text-red-700">* required</span>
                        </div>

                        <input
                            type="text"
                            id="title"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"

                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                            Description
                        </label>
                        <textarea
                            id="description"
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            rows={3}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <div className="flex justify-end space-x-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? 'Saving to Cloud...' : (initialData ? 'Update' : 'Create')}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}