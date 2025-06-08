import React, { useState, useEffect } from 'react';
import { CheckCircle2, Circle, Clock, Calendar, Loader2, Plus, X } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../contexts/AuthContext';

interface Task {
  id: string;
  task: string;
  is_completed: boolean;
  due_time: string;
  category: string;
}

interface NewTask {
  task: string;
  due_time: string;
  category: string;
}

const DailyChecklist = () => {
  const { user } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAddTask, setShowAddTask] = useState(false);
  const [newTask, setNewTask] = useState<NewTask>({
    task: '',
    due_time: new Date().toISOString().slice(0, 16),
    category: ''
  });

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const { data, error } = await supabase
          .from('daily_tasks')
          .select('*')
          .eq('user_id', user?.id)
          .order('due_time', { ascending: true });

        if (error) throw error;

        setTasks(data || []);
      } catch (err) {
        console.error('Error fetching tasks:', err);
        setError('Failed to load tasks');
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchTasks();
    }
  }, [user]);

  const toggleTask = async (taskId: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('daily_tasks')
        .update({ is_completed: !currentStatus })
        .eq('id', taskId)
        .eq('user_id', user?.id);

      if (error) throw error;

      setTasks(tasks.map(task =>
        task.id === taskId ? { ...task, is_completed: !currentStatus } : task
      ));
    } catch (err) {
      console.error('Error updating task:', err);
      setError('Failed to update task');
    }
  };

  const handleAddTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('daily_tasks')
        .insert([{
          task: newTask.task,
          due_time: newTask.due_time,
          category: newTask.category,
          user_id: user.id,
          is_completed: false
        }])
        .select()
        .single();

      if (error) throw error;

      setTasks([...tasks, data]);
      setShowAddTask(false);
      setNewTask({
        task: '',
        due_time: new Date().toISOString().slice(0, 16),
        category: ''
      });
    } catch (err) {
      console.error('Error adding task:', err);
      setError('Failed to add task');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-red-900/50 border border-red-500 text-red-200 rounded-lg p-4">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold mb-2">Daily Checklist</h1>
          <p className="text-gray-400">Keep track of your daily tasks and priorities</p>
        </div>
        <button
          onClick={() => setShowAddTask(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Add Task
        </button>
      </div>

      <div className="bg-gray-900 rounded-xl p-6 shadow-lg">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-blue-400" />
            <span className="text-lg font-semibold">
              {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
            </span>
          </div>
          <div className="text-sm text-gray-400">
            {tasks.filter(t => t.is_completed).length} of {tasks.length} completed
          </div>
        </div>

        <div className="space-y-4">
          {tasks.map(task => (
            <div
              key={task.id}
              className={`flex items-center gap-4 p-4 rounded-lg transition-all ${
                task.is_completed 
                  ? 'bg-green-900/20 border border-green-500/20' 
                  : 'bg-gray-800/50 border border-gray-700 hover:border-gray-600'
              }`}
            >
              <button
                onClick={() => toggleTask(task.id, task.is_completed)}
                className="flex-shrink-0"
              >
                {task.is_completed ? (
                  <CheckCircle2 className="w-6 h-6 text-green-500" />
                ) : (
                  <Circle className="w-6 h-6 text-gray-400" />
                )}
              </button>
              <div className="flex-grow">
                <div className={`font-medium ${task.is_completed ? 'text-gray-400 line-through' : 'text-white'}`}>
                  {task.task}
                </div>
                <div className="text-sm text-gray-500">{task.category}</div>
              </div>
              {task.due_time && (
                <div className="flex items-center gap-1 text-sm text-gray-400">
                  <Clock className="w-4 h-4" />
                  {new Date(task.due_time).toLocaleTimeString('en-US', { 
                    hour: '2-digit', 
                    minute: '2-digit'
                  })}
                </div>
              )}
            </div>
          ))}

          {tasks.length === 0 && (
            <div className="text-center py-8 text-gray-400">
              No tasks for today
            </div>
          )}
        </div>
      </div>

      {/* Add Task Modal */}
      {showAddTask && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-gray-900 rounded-xl p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold">Add New Task</h2>
              <button
                onClick={() => setShowAddTask(false)}
                className="text-gray-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddTask} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Task
                </label>
                <input
                  type="text"
                  value={newTask.task}
                  onChange={(e) => setNewTask({ ...newTask, task: e.target.value })}
                  className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Category
                </label>
                <input
                  type="text"
                  value={newTask.category}
                  onChange={(e) => setNewTask({ ...newTask, category: e.target.value })}
                  className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Due Time
                </label>
                <input
                  type="datetime-local"
                  value={newTask.due_time}
                  onChange={(e) => setNewTask({ ...newTask, due_time: e.target.value })}
                  className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div className="flex justify-end gap-4 mt-6">
                <button
                  type="button"
                  onClick={() => setShowAddTask(false)}
                  className="px-4 py-2 text-gray-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
                >
                  Add Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default DailyChecklist;