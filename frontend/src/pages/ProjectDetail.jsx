import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import API from "../services/api";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, ArrowLeft, Calendar, Trash2, X, User, UserPlus } from "lucide-react";

const ProjectDetail = () => {
  const { id } = useParams();
  const [tasks, setTasks] = useState([]);
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [users, setUsers] = useState([]);
  const [newTask, setNewTask] = useState({ title: "", description: "", status: "TODO", assignedTo: "" });
  const [error, setError] = useState("");

  const fetchData = async () => {
    try {
      const [projectRes, tasksRes, usersRes] = await Promise.all([
        API.get(`/projects`),
        API.get(`/tasks/project/${id}`),
        API.get(`/users`)
      ]);
      const currentProject = projectRes.data.find(p => p._id === id);
      setProject(currentProject);
      setTasks(tasksRes.data);
      setUsers(usersRes.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [id]);

  const openModal = () => {
    setNewTask({ title: "", description: "", status: "TODO", assignedTo: "" });
    setError("");
    setIsModalOpen(true);
  };

  const handleCreateTask = async (e) => {
    e.preventDefault();
    
    if (!newTask.assignedTo) {
      setError("Please select a team member to assign this task to.");
      return;
    }

    try {
      await API.post("/tasks", { ...newTask, projectId: id });
      setIsModalOpen(false);
      setNewTask({ title: "", description: "", status: "TODO", assignedTo: "" });
      fetchData();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create task");
    }
  };

  const handleStatusChange = async (taskId, newStatus) => {
    setTasks(tasks.map(t => t._id === taskId ? { ...t, status: newStatus } : t));
    try {
      await API.put(`/tasks/${taskId}`, { status: newStatus });
    } catch (err) {
      console.error("Failed to update status", err);
      fetchData();
    }
  };

  const handleDeleteTask = async (taskId) => {
    try {
      await API.delete(`/tasks/${taskId}`);
      setTasks(tasks.filter(t => t._id !== taskId));
    } catch (err) {
      console.error("Failed to delete task", err);
    }
  };

  if (loading) return <div className="flex justify-center py-20"><div className="animate-spin rounded-full h-12 w-12 border-t-2 border-cyan-500"></div></div>;
  if (!project) return <div className="text-center py-20 text-gray-500 text-sm">Project not found.</div>;

  const columns = [
    { id: "TODO", title: "To Do", color: "border-purple-500/20 bg-purple-950/10", badge: "bg-purple-500/20 text-purple-400 border border-purple-500/30", dot: "bg-purple-500" },
    { id: "IN_PROGRESS", title: "In Progress", color: "border-cyan-500/20 bg-cyan-950/10", badge: "bg-cyan-500/20 text-cyan-400 border border-cyan-500/30", dot: "bg-cyan-500" },
    { id: "DONE", title: "Done", color: "border-emerald-500/20 bg-emerald-950/10", badge: "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30", dot: "bg-emerald-500" }
  ];

  return (
    <div className="p-6 max-w-[1400px] mx-auto h-[calc(100vh-4rem)] flex flex-col">
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 shrink-0">
        <div>
          <Link to="/projects" className="text-cyan-500 hover:text-cyan-400 font-semibold uppercase tracking-wider flex items-center gap-1.5 mb-2 text-[10px] transition-colors">
            <ArrowLeft className="h-3 w-3" /> Back to Projects
          </Link>
          <h1 className="text-3xl font-bold text-gray-100 tracking-tight">{project.name}</h1>
          <p className="text-gray-400 mt-1 text-sm">{project.description}</p>
        </div>
        <button
          onClick={openModal}
          className="inline-flex items-center gap-2 neon-button px-5 py-2.5 rounded-lg font-semibold text-sm tracking-wide"
        >
          <Plus className="h-4 w-4" />
          NEW TASK
        </button>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 overflow-hidden flex-grow pb-4">
        {columns.map(column => (
          <div key={column.id} className={`flex flex-col rounded-xl border ${column.color} overflow-hidden h-full`}>
            <div className="p-4 border-b border-gray-800 flex items-center justify-between bg-gray-900/50 shrink-0">
              <h2 className="font-semibold text-sm uppercase tracking-widest flex items-center gap-2 text-gray-300">
                <span className={`w-2 h-2 rounded-full ${column.dot} shadow-[0_0_8px_currentColor]`}></span>
                {column.title}
              </h2>
              <span className={`text-[10px] py-0.5 px-2 rounded font-bold ${column.badge}`}>
                {tasks.filter(t => t.status === column.id).length}
              </span>
            </div>
            
            <div className="p-4 overflow-y-auto flex-grow space-y-4 custom-scrollbar">
              <AnimatePresence>
                {tasks.filter(t => t.status === column.id).map(task => (
                  <motion.div
                    key={task._id}
                    layout
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="bg-gray-900 rounded-lg p-4 border border-gray-800 group hover:border-cyan-500/50 transition-colors relative overflow-hidden"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-semibold text-gray-100 leading-snug pr-8 text-sm">{task.title}</h3>
                      <button 
                        onClick={() => handleDeleteTask(task._id)}
                        className="opacity-0 group-hover:opacity-100 absolute top-3 right-3 p-1.5 text-gray-500 hover:text-red-400 hover:bg-red-950/30 rounded transition-all"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                    <p className="text-xs text-gray-500 mb-4 flex-grow">{task.description}</p>
                    
                    <div className="flex flex-col gap-1.5 mb-4 p-2.5 rounded bg-gray-950/50 border border-gray-800/50">
                      <div className="flex items-center gap-2 text-[10px] text-gray-500 uppercase tracking-wider">
                        <User className="h-3 w-3" />
                        <span>Creator: <strong className="text-gray-300">{task.createdBy?.name || "Unknown"}</strong></span>
                      </div>
                      <div className="flex items-center gap-2 text-[10px] text-gray-500 uppercase tracking-wider">
                        <UserPlus className="h-3 w-3" />
                        <span>Assignee: <strong className="text-cyan-400">{task.assignedTo?.name || "Unassigned"}</strong></span>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between border-t border-gray-800 pt-3 mt-auto">
                      <div className="flex items-center gap-1.5 text-[10px] text-gray-500 uppercase tracking-wider font-semibold">
                        <Calendar className="h-3 w-3" />
                        {new Date(task.createdAt).toLocaleDateString()}
                      </div>
                      
                      <select 
                        className="bg-gray-950 border border-gray-800 rounded text-[10px] font-bold uppercase tracking-wider py-1 px-2 text-gray-400 outline-none hover:border-cyan-500/50 hover:text-cyan-400 transition-colors cursor-pointer"
                        value={task.status}
                        onChange={(e) => handleStatusChange(task._id, e.target.value)}
                      >
                        <option value="TODO">TO DO</option>
                        <option value="IN_PROGRESS">IN PROGRESS</option>
                        <option value="DONE">DONE</option>
                      </select>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
              {tasks.filter(t => t.status === column.id).length === 0 && (
                <div className="h-full flex items-center justify-center text-gray-600 text-xs uppercase tracking-widest border border-dashed border-gray-800 rounded-lg py-8 m-1">
                  Awaiting Input
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-gray-900 rounded-xl border border-gray-700 p-8 w-full max-w-md shadow-2xl relative"
            >
              <button
                onClick={() => setIsModalOpen(false)}
                className="absolute top-6 right-6 p-1.5 text-gray-500 hover:text-gray-300 hover:bg-gray-800 rounded transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
              
              <h2 className="text-2xl font-bold text-gray-100 mb-6 tracking-tight">Create Task</h2>
              
              {error && (
                <div className="mb-6 p-3 bg-red-950/50 text-red-400 border border-red-900/50 rounded-lg text-sm">
                  {error}
                </div>
              )}

              <form onSubmit={handleCreateTask} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5 ml-1">Task Title</label>
                  <input
                    type="text"
                    required
                    className="neon-input block w-full rounded-lg px-4 py-2.5 text-gray-100 placeholder-gray-600 text-sm"
                    placeholder="e.g. Optimize algorithms"
                    value={newTask.title}
                    onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                  />
                </div>
                
                <div>
                  <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5 ml-1">Description (Optional)</label>
                  <textarea
                    rows="3"
                    className="neon-input block w-full rounded-lg px-4 py-2.5 text-gray-100 placeholder-gray-600 text-sm resize-none"
                    placeholder="Provide execution details..."
                    value={newTask.description}
                    onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                  ></textarea>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5 ml-1">Status</label>
                  <select
                    className="neon-input block w-full rounded-lg px-4 py-2.5 text-gray-100 text-sm appearance-none"
                    value={newTask.status}
                    onChange={(e) => setNewTask({ ...newTask, status: e.target.value })}
                  >
                    <option value="TODO">To Do</option>
                    <option value="IN_PROGRESS">In Progress</option>
                    <option value="DONE">Done</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5 ml-1">Assign To</label>
                  <select
                    className="neon-input block w-full rounded-lg px-4 py-2.5 text-gray-100 text-sm appearance-none"
                    value={newTask.assignedTo}
                    onChange={(e) => setNewTask({ ...newTask, assignedTo: e.target.value })}
                  >
                    <option value="">Unassigned</option>
                    {users.map(u => (
                      <option key={u._id} value={u._id}>{u.name} ({u.email})</option>
                    ))}
                  </select>
                </div>

                <div className="pt-4 flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2.5 rounded-lg text-sm font-semibold text-gray-400 hover:text-gray-200 hover:bg-gray-800 transition-colors"
                  >
                    CANCEL
                  </button>
                  <button
                    type="submit"
                    className="neon-button px-5 py-2.5 rounded-lg text-sm font-semibold tracking-wide"
                  >
                    DEPLOY
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ProjectDetail;
