'use client';
import React, { useEffect, useState, ChangeEvent } from 'react';
import {
  Plus,
  Calendar,
  User,
  Edit2,
  Trash2,
  Check,
  Clock,
  AlertCircle,
  Pause,
  View
} from 'lucide-react';
import { toast } from 'sonner';
import { trpc } from '@/app/_trpc/client';
import { useAuth } from '@/hooks/useAuth';

// Define interfaces for type safety
interface Task {
  _id: string;
  title: string;
  description: string;
  assignTo: string;
  dueDate: string;
  status: TaskStatus;
}

interface AuthUser {
  email: string;
  role: 'admin' | 'user';
}

interface FormData {
  title: string;
  description: string;
  assignTo: string;
  dueDate: string;
  status: TaskStatus;
}

type TaskStatus = 'To Do' | 'In Progress' | 'Completed' | 'On Hold';

const TaskManager: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const auth = useAuth() as AuthUser;
  const [showForm, setShowForm] = useState<boolean>(false);
  const [viewForm, setViewForm] = useState<boolean>(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [viewingTask, setViewingTask] = useState<Task | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<TaskStatus>('To Do');
  const [formData, setFormData] = useState<FormData>({
    title: '',
    description: '',
    assignTo: '',
    dueDate: '',
    status: 'To Do',
  });

  const statusOptions: TaskStatus[] = [
    'To Do',
    'In Progress',
    'Completed',
    'On Hold',
  ];

  const statusColors: Record<TaskStatus, string> = {
    'To Do': 'bg-gray-100 text-gray-800 border-gray-300',
    'In Progress': 'bg-blue-100 text-blue-800 border-blue-300',
    Completed: 'bg-green-100 text-green-800 border-green-300',
    'On Hold': 'bg-yellow-100 text-yellow-800 border-yellow-300',
  };

  const statusIcons: Record<TaskStatus, React.ReactNode> = {
    'To Do': <Clock className="w-4 h-4" />,
    'In Progress': <AlertCircle className="w-4 h-4" />,
    Completed: <Check className="w-4 h-4" />,
    'On Hold': <Pause className="w-4 h-4" />,
  };

  const tabColors: Record<TaskStatus, string> = {
    'To Do': 'border-gray-500 text-gray-700',
    'In Progress': 'border-blue-500 text-blue-700',
    Completed: 'border-green-500 text-green-700',
    'On Hold': 'border-yellow-500 text-yellow-700',
  };

  useEffect(() => {
    const fetchTasks = async () => {
      if (!auth) return;

      setLoading(true);
      try {
        if (auth.role === 'admin') {
          const info = await trpc.task.getTasks.query();
          // @ts-ignore
          setTasks(info.message || []);
        } else {
          const info = await trpc.task.getTask.mutate({
            assignTo: auth.email,
          });
          // @ts-ignore
          setTasks(info.message || []);
        }
      } catch (error) {
        console.error('Error fetching tasks:', error);
        toast('Error fetching tasks');
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, [auth]);

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      toast('Please enter a title');
      return;
    }

    try {
      if (editingTask) {
        if (auth.role === 'admin') {
          const info = await trpc.task.updateTasksAdmin.mutate({
            id: editingTask._id,
            title: formData.title,
            description: formData.description,
            assignTo: formData.assignTo,
            dueDate: formData.dueDate,
            status: formData.status,
          });
          toast(info.message as string);
        } else {
          const info = await trpc.task.updateTasks.mutate({
            id: editingTask._id,
            title: formData.title,
            description: formData.description,
            dueDate: formData.dueDate,
            status: formData.status,
          });
          toast(info.message as string);
        }
        setEditingTask(null);
      } else {
        const result = await trpc.task.addTask.mutate({
          title: formData.title,
          description: formData.description,
          assignTo: formData.assignTo,
          dueDate: formData.dueDate,
          status: formData.status,
        });
        toast(result.message as string);
      }

      // Reset form and close modal
      setFormData({
        title: '',
        description: '',
        assignTo: '',
        dueDate: '',
        status: 'To Do',
      });
      setShowForm(false);

      // Refresh the page or refetch data
      window.location.reload();
    } catch (error) {
      console.error('Error submitting task:', error);
      toast('Error saving task');
    }
  };

  const handleEdit = (task: Task) => {
    setFormData({
      title: task.title,
      description: task.description,
      assignTo: task.assignTo,
      dueDate: task.dueDate,
      status: task.status,
    });
    setEditingTask(task);
    setShowForm(true);
  };

  const handleView = (task: Task) => {
    setViewingTask(task);
    setViewForm(true);
  };

  const handleDelete = async (taskId: string) => {
    try {
      const res = await trpc.task.deleteTasks.mutate({
        id: taskId,
        assignTo: auth.email,
      });
      toast(res.message as string);
      // Optionally refresh the tasks list
      window.location.reload();
    } catch (error) {
      console.error('Error deleting task:', error);
      toast('Error deleting task');
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingTask(null);
    setFormData({
      title: '',
      description: '',
      assignTo: '',
      dueDate: '',
      status: 'To Do',
    });
  };

  const handleCloseView = () => {
    setViewForm(false);
    setViewingTask(null);
  };

  const formatDate = (dateString: string): string => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const isOverdue = (dueDate: string, status: TaskStatus): boolean => {
    if (!dueDate || status === 'Completed') return false;
    return new Date(dueDate) < new Date();
  };

  const getTasksByStatus = (status: TaskStatus): Task[] => {
    return tasks.filter((task) => task.status === status);
  };

  const getTaskCount = (status: TaskStatus): number => {
    return tasks.filter((task) => task.status === status).length;
  };

  if (loading) {
    return (
      <div className="w-full p-6 bg-gray-50 min-h-screen">
        <div className="text-center">
          <h2 className="text-xl font-semibold">Loading...</h2>
        </div>
      </div>
    );
  }

  if (!auth) {
    return (
      <div className="w-full p-6 bg-gray-50 min-h-screen">
        <div className="text-center">
          <h2 className="text-xl font-semibold">Please log in to view tasks</h2>
        </div>
      </div>
    );
  }

  const activeTasks = getTasksByStatus(activeTab);

  return (
    <div className="w-full p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Task Manager
            </h1>
            <p className="text-gray-600">
              Organize and track your tasks efficiently
            </p>
          </div>

          {/* Add Task Button */}
          {auth.role === 'admin' && (
            <button
              onClick={() => setShowForm(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
            >
              <Plus className="w-4 h-4" />
              Add New Task
            </button>
          )}
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="mb-6">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            {statusOptions.map((status) => {
              const count = getTaskCount(status);
              const isActive = activeTab === status;

              return (
                <button
                  key={status}
                  onClick={() => setActiveTab(status)}
                  className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${
                    isActive
                      ? `${tabColors[status]} border-current`
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    {statusIcons[status]}
                    <span>{status}</span>
                    <span
                      className={`inline-flex items-center justify-center px-2 py-1 text-xs font-bold rounded-full ${
                        isActive
                          ? statusColors[status]
                          : 'bg-gray-100 text-gray-600'
                      }`}
                    >
                      {count}
                    </span>
                  </div>
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Task Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <h2 className="text-xl font-semibold mb-4">
              {editingTask ? 'Edit Task' : 'Add New Task'}
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Title *
                </label>
                <input
                  type="text"
                  name="title"
                  disabled={auth.role !== 'admin'}
                  value={formData.title}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  disabled={auth.role !== 'admin'}
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Assign To
                </label>
                <input
                  type="text"
                  name="assignTo"
                  disabled={auth.role !== 'admin'}
                  value={formData.assignTo}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Due Date
                </label>
                <input
                  type="date"
                  name="dueDate"
                  value={formData.dueDate}
                  onChange={handleInputChange}
                  disabled={auth.role !== 'admin'}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Status
                </label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {statusOptions.map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  onClick={handleSubmit}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg transition-colors"
                >
                  {editingTask ? 'Update Task' : 'Add Task'}
                </button>
                <button
                  onClick={handleCancel}
                  className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-700 py-2 rounded-lg transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* View Task Modal */}
      {viewForm && viewingTask && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <h2 className="text-xl font-semibold mb-4">Task Details</h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Title
                </label>
                <input
                  type="text"
                  value={viewingTask.title}
                  readOnly
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-100"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  value={viewingTask.description}
                  readOnly
                  rows={3}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-100"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Assigned To
                </label>
                <input
                  type="text"
                  value={viewingTask.assignTo}
                  readOnly
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-100"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Due Date
                </label>
                <input
                  type="text"
                  value={formatDate(viewingTask.dueDate)}
                  readOnly
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-100"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Status
                </label>
                <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg ${statusColors[viewingTask.status]}`}>
                  {statusIcons[viewingTask.status]}
                  {viewingTask.status}
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  onClick={handleCloseView}
                  className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-700 py-2 rounded-lg transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Active Tab Content */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 min-h-[400px]">
        {/* Tab Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg font-medium ${statusColors[activeTab]}`}
              >
                {statusIcons[activeTab]}
                {activeTab}
              </div>
              <span className="text-gray-600">
                {activeTasks.length}{' '}
                {activeTasks.length === 1 ? 'task' : 'tasks'}
              </span>
            </div>
          </div>
        </div>

        {/* Tasks Grid */}
        <div className="p-6">
          {activeTasks.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {activeTasks.map((task) => (
                <div
                  key={task._id}
                  className="bg-gray-50 rounded-lg p-5 hover:shadow-md transition-shadow border border-gray-100"
                >
                  {/* Task Header */}
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="font-semibold text-lg text-gray-900 flex-1 mr-2">
                      {task.title}
                    </h3>
                    <div className="flex gap-1">
                      <button
                        onClick={() => handleView(task)}
                        className="p-1 text-gray-500 hover:text-blue-600 transition-colors"
                      >
                        <View className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => handleEdit(task)}
                        className="p-1 text-gray-500 hover:text-blue-600 transition-colors"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(task._id)}
                        className="p-1 text-gray-500 hover:text-red-600 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Task Description */}
                  {task.description && (
                    <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                      {task.description}
                    </p>
                  )}

                  {/* Task Details */}
                  <div className="space-y-2">
                    {/* Assigned To */}
                    {task.assignTo && (
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <User className="w-4 h-4" />
                        <span>{task.assignTo}</span>
                      </div>
                    )}

                    {/* Due Date */}
                    {task.dueDate && (
                      <div
                        className={`flex items-center gap-2 text-sm ${
                          isOverdue(task.dueDate, task.status)
                            ? 'text-red-600'
                            : 'text-gray-600'
                        }`}
                      >
                        <Calendar className="w-4 h-4" />
                        <span>{formatDate(task.dueDate)}</span>
                        {isOverdue(task.dueDate, task.status) && (
                          <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded">
                            Overdue
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            // Empty State for Active Tab
            <div className="text-center py-12">
              <div className="mb-4">
                <div
                  className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg ${statusColors[activeTab]} mb-4`}
                >
                  {statusIcons[activeTab]}
                  {activeTab}
                </div>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No {activeTab.toLowerCase()} tasks
              </h3>
              <p className="text-gray-600 mb-4">
                {activeTab === 'To Do'
                  ? 'Create your first task to get started'
                  : `No tasks are currently ${activeTab.toLowerCase()}`}
              </p>

              {auth.role === 'admin' && activeTab === 'To Do' && (
                <button
                  onClick={() => setShowForm(true)}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
                >
                  Add Task
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TaskManager;