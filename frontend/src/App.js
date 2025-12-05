import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchTasks, createTask, updateTask, deleteTask } from './store';
import VoiceInput from './components/VoiceInput/VoiceInput';
import { Plus, Search, Trash2, Edit2, Calendar, X } from 'lucide-react';
import KanbanBoard from "./components/KanbanBoard";

function App() {
  const dispatch = useDispatch();
  const { items: tasks, loading } = useSelector(state => state.tasks);
  
  const [view, setView] = useState('board');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterPriority, setFilterPriority] = useState('All');
  const [filterStatus, setFilterStatus] = useState('All');
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [showVoiceModal, setShowVoiceModal] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [voiceData, setVoiceData] = useState({ transcript: '', parsed: null });

  useEffect(() => {
    dispatch(fetchTasks());
  }, [dispatch]);

  const handleVoiceParsed = (transcript, parsed) => {
    setVoiceData({ transcript, parsed });
    setShowVoiceModal(true);
  };

  const handleCreateTask = (taskData) => {
    if (editingTask) {
      dispatch(updateTask({ id: editingTask._id, updates: taskData }));
      setEditingTask(null);
    } else {
      dispatch(createTask(taskData));
    }
    setShowTaskModal(false);
  };

  const handleCreateFromVoice = () => {
    if (voiceData.parsed) {
      dispatch(createTask(voiceData.parsed));
      setShowVoiceModal(false);
      setVoiceData({ transcript: '', parsed: null });
    }
  };

  const handleDeleteTask = (id) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      dispatch(deleteTask(id));
    }
  };

  const handleEditTask = (task) => {
    setEditingTask(task);
    setShowTaskModal(true);
  };

  const handleUpdateStatus = (id, newStatus) => {
    dispatch(updateTask({ id, updates: { status: newStatus } }));
  };

  const filteredTasks = tasks.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (task.description || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchesPriority = filterPriority === 'All' || task.priority === filterPriority;
    const matchesStatus = filterStatus === 'All' || task.status === filterStatus;
    return matchesSearch && matchesPriority && matchesStatus;
  });

  const getPriorityColor = (priority) => {
    switch(priority) {
      case 'High': return 'text-red-600 bg-red-50 border-red-200';
      case 'Medium': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'Low': return 'text-green-600 bg-green-50 border-green-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold text-gray-900">Task Tracker</h1>
            <div className="flex gap-2">
              <VoiceInput onTaskParsed={handleVoiceParsed} />
              <button
                onClick={() => { setShowTaskModal(true); setEditingTask(null); }}
                className="flex items-center gap-2 px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 font-medium"
              >
                <Plus size={18} />
                Add Task
              </button>
            </div>
          </div>

          {/* Filters */}
          <div className="flex gap-3 flex-wrap">
            <div className="flex-1 min-w-64">
              <div className="relative">
                <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
                <input
                  type="text"
                  placeholder="Search tasks..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg"
                />
              </div>
            </div>
            <select
              value={filterPriority}
              onChange={(e) => setFilterPriority(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg"
            >
              <option>All</option>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg"
            >
              <option value="All">All</option>
              <option value="To Do">To Do</option>
              <option value="In Progress">In Progress</option>
              <option value="Done">Done</option>
            </select>
            <div className="flex gap-1 border border-gray-300 rounded-lg p-1">
              <button
                onClick={() => setView('board')}
                className={`px-3 py-1 rounded ${view === 'board' ? 'bg-gray-800 text-white' : 'hover:bg-gray-100'}`}
              >
                Board
              </button>
              <button
                onClick={() => setView('list')}
                className={`px-3 py-1 rounded ${view === 'list' ? 'bg-gray-800 text-white' : 'hover:bg-gray-100'}`}
              >
                List
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        {view === "board" ? (
          <KanbanBoard 
            tasks={filteredTasks} 
            onEdit={handleEditTask}
            getPriorityColor={getPriorityColor}
          />
        ) : (
          <TaskList
            tasks={filteredTasks}
            onEdit={handleEditTask}
            onDelete={handleDeleteTask}
            onStatusChange={handleUpdateStatus}
            getPriorityColor={getPriorityColor}
          />
        )}
      </div>

      {/* Voice Modal */}
      {showVoiceModal && (
        <Modal onClose={() => setShowVoiceModal(false)} title="Review Voice Input">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Transcript</label>
              <div className="p-3 bg-gray-50 rounded border border-gray-200 text-sm">
                "{voiceData.transcript}"
              </div>
            </div>
            <TaskFormFields
              task={voiceData.parsed || {}}
              onChange={(updated) => setVoiceData({ ...voiceData, parsed: updated })}
            />
            <div className="flex gap-3 pt-4">
              <button
                onClick={handleCreateFromVoice}
                className="flex-1 bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600"
              >
                Create Task
              </button>
              <button
                onClick={() => setShowVoiceModal(false)}
                className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* Task Modal */}
      {showTaskModal && (
        <TaskModal
          task={editingTask}
          onSave={handleCreateTask}
          onClose={() => { setShowTaskModal(false); setEditingTask(null); }}
        />
      )}
    </div>
  );
}

// Helper Components
function TaskCard({ task, onEdit, onDelete, onStatusChange, getPriorityColor }) {
  return (
    <div className="bg-white rounded-lg p-4 shadow-sm border hover:shadow-md transition">
      <div className="flex items-start justify-between mb-2">
        <h4 className="font-medium text-gray-900 flex-1">{task.title}</h4>
        <div className="flex gap-1">
          <button onClick={() => onEdit(task)} className="text-gray-400 hover:text-blue-600">
            <Edit2 size={14} />
          </button>
          <button onClick={() => onDelete(task._id)} className="text-gray-400 hover:text-red-600">
            <Trash2 size={14} />
          </button>
        </div>
      </div>
      {task.description && <p className="text-sm text-gray-600 mb-3">{task.description}</p>}
      <div className="flex items-center justify-between text-sm mb-3">
        <span className={`px-2 py-1 rounded text-xs font-medium border ${getPriorityColor(task.priority)}`}>
          {task.priority}
        </span>
        {task.dueDate && (
          <span className="flex items-center gap-1 text-gray-500">
            <Calendar size={14} />
            {new Date(task.dueDate).toLocaleDateString()}
          </span>
        )}
      </div>
      <select
        value={task.status}
        onChange={(e) => onStatusChange(task._id, e.target.value)}
        className="w-full text-sm border border-gray-300 rounded px-2 py-1"
      >
        <option>To Do</option>
        <option>In Progress</option>
        <option>Done</option>
      </select>
    </div>
  );
}

function TaskList({ tasks, onEdit, onDelete, onStatusChange, getPriorityColor }) {
  return (
    <div className="bg-white rounded-lg shadow">
      <table className="w-full">
        <thead className="bg-gray-50 border-b">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Title</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Priority</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Due Date</th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y">
          {tasks.map(task => (
            <tr key={task._id} className="hover:bg-gray-50">
              <td className="px-6 py-4">
                <div className="font-medium">{task.title}</div>
                {task.description && <div className="text-sm text-gray-500">{task.description}</div>}
              </td>
              <td className="px-6 py-4">
                <select
                  value={task.status}
                  onChange={(e) => onStatusChange(task._id, e.target.value)}
                  className="text-sm border rounded px-2 py-1"
                >
                  <option>To Do</option>
                  <option>In Progress</option>
                  <option>Done</option>
                </select>
              </td>
              <td className="px-6 py-4">
                <span className={`px-2 py-1 text-xs font-medium rounded border ${getPriorityColor(task.priority)}`}>
                  {task.priority}
                </span>
              </td>
              <td className="px-6 py-4 text-sm text-gray-500">
                {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'No date'}
              </td>
              <td className="px-6 py-4 text-right">
                <button onClick={() => onEdit(task)} className="text-blue-600 hover:text-blue-800 mr-3">
                  <Edit2 size={16} />
                </button>
                <button onClick={() => onDelete(task._id)} className="text-red-600 hover:text-red-800">
                  <Trash2 size={16} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function TaskModal({ task, onSave, onClose }) {
  const [formData, setFormData] = useState(task || {
    title: '',
    description: '',
    priority: 'Medium',
    status: 'To Do',
    dueDate: ''
  });

  const handleSubmit = () => {
    if (!formData.title.trim()) {
      alert('Title is required');
      return;
    }
    onSave(formData);
  };

  return (
    <Modal onClose={onClose} title={task ? 'Edit Task' : 'Create Task'}>
      <div className="space-y-4">
        <TaskFormFields task={formData} onChange={setFormData} />
        <div className="flex gap-3 pt-4">
          <button
            onClick={handleSubmit}
            className="flex-1 bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600"
          >
            {task ? 'Update' : 'Create'} Task
          </button>
          <button onClick={onClose} className="px-6 py-2 border rounded-lg hover:bg-gray-50">
            Cancel
          </button>
        </div>
      </div>
    </Modal>
  );
}

function TaskFormFields({ task, onChange }) {
  return (
    <>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Title *</label>
        <input
          type="text"
          value={task.title || ''}
          onChange={(e) => onChange({ ...task, title: e.target.value })}
          className="w-full px-3 py-2 border rounded-lg"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
        <textarea
          value={task.description || ''}
          onChange={(e) => onChange({ ...task, description: e.target.value })}
          className="w-full px-3 py-2 border rounded-lg"
          rows="3"
        />
      </div>
      <div className="grid grid-cols-3 gap-3">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Priority</label>
          <select
            value={task.priority || 'Medium'}
            onChange={(e) => onChange({ ...task, priority: e.target.value })}
            className="w-full px-3 py-2 border rounded-lg"
          >
            <option>High</option>
            <option>Medium</option>
            <option>Low</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
          <select
            value={task.status || 'To Do'}
            onChange={(e) => onChange({ ...task, status: e.target.value })}
            className="w-full px-3 py-2 border rounded-lg"
          >
            <option>To Do</option>
            <option>In Progress</option>
            <option>Done</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Due Date</label>
          <input
            type="date"
            value={task.dueDate ? task.dueDate.split('T')[0] : ''}
            onChange={(e) => onChange({ ...task, dueDate: e.target.value })}
            className="w-full px-3 py-2 border rounded-lg"
          />
        </div>
      </div>
    </>
  );
}

function Modal({ children, onClose, title }) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold">{title}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X size={24} />
          </button>
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
}

export default App;