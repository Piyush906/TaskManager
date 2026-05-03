import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../services/api";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Compass, UsersRound, X } from "lucide-react";

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [newProject, setNewProject] = useState({ name: "", description: "" });
  const [error, setError] = useState("");
  
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const isAdmin = user?.role === "ADMIN";

  const fetchProjects = async () => {
    try {
      const { data } = await API.get("/projects");
      setProjects(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleCreateProject = async (e) => {
    e.preventDefault();
    try {
      await API.post("/projects", newProject);
      setIsModalOpen(false);
      setNewProject({ name: "", description: "" });
      fetchProjects();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create project");
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8">
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-100 tracking-tight">Active Projects</h1>
          <p className="text-gray-400 mt-1 text-sm uppercase tracking-wider">Manage team initiatives</p>
        </div>
        {isAdmin && (
          <button
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center gap-2 neon-button px-5 py-2.5 rounded-lg font-semibold text-sm tracking-wide cursor-pointer"
          >
            <Plus className="h-4 w-4" />
            NEW PROJECT
          </button>
        )}
      </header>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-cyan-500"></div>
        </div>
      ) : projects.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence>
            {projects.map((project) => (
              <motion.div
                key={project._id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                whileHover={{ y: -3 }}
                className="group bg-gray-900 border border-gray-800 rounded-xl overflow-hidden hover:shadow-[0_0_15px_rgba(6,182,212,0.15)] hover:border-cyan-500/50 transition-all block"
              >
                <div className="p-6 h-full flex flex-col">
                  <div className="flex items-start justify-between mb-4">
                    <div className="h-10 w-10 rounded-lg bg-gray-800 border border-gray-700 flex items-center justify-center text-cyan-400">
                      <Compass className="h-5 w-5" />
                    </div>
                    <span className="text-[10px] font-bold text-gray-400 bg-gray-800 border border-gray-700 px-2.5 py-1 rounded uppercase tracking-wider">
                      {new Date(project.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  
                  <h3 className="text-lg font-bold text-gray-100 mb-2 group-hover:text-cyan-400 transition-colors tracking-tight">
                    {project.name}
                  </h3>
                  <p className="text-gray-500 text-sm line-clamp-2 mb-6 flex-grow">
                    {project.description || "No description provided."}
                  </p>

                  <div className="flex items-center justify-between pt-4 border-t border-gray-800 mt-auto">
                    <div className="flex items-center gap-2 text-xs text-gray-500 uppercase tracking-wider">
                      <UsersRound className="h-3.5 w-3.5" />
                      <span>{project.owner?.name || "Unknown"}</span>
                    </div>
                    <Link
                      to={`/projects/${project._id}`}
                      className="text-cyan-400 text-xs font-bold uppercase tracking-wider hover:text-cyan-300 transition-colors flex items-center gap-1"
                    >
                      View Board &rarr;
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      ) : (
        <div className="text-center py-20 bg-gray-900 rounded-xl border border-dashed border-gray-700">
          <div className="mx-auto h-16 w-16 bg-gray-800 border border-gray-700 rounded-full flex items-center justify-center mb-4">
            <Compass className="h-8 w-8 text-cyan-400" />
          </div>
          <h3 className="text-xl font-bold text-gray-100 mb-2">No projects yet</h3>
          <p className="text-gray-500 text-sm mb-6">Initialize your first project to get started.</p>
          {isAdmin && (
            <button
              onClick={() => setIsModalOpen(true)}
              className="inline-flex items-center gap-2 neon-button px-5 py-2.5 rounded-lg font-semibold text-sm tracking-wide cursor-pointer"
            >
              <Plus className="h-4 w-4" />
              NEW PROJECT
            </button>
          )}
        </div>
      )}

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
                className="absolute top-6 right-6 p-1.5 text-gray-500 hover:text-gray-300 hover:bg-gray-800 rounded transition-colors cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
              
              <h2 className="text-2xl font-bold text-gray-100 mb-6 tracking-tight">Initialize Project</h2>
              
              {error && (
                <div className="mb-6 p-3 bg-red-950/50 text-red-400 border border-red-900/50 rounded-lg text-sm">
                  {error}
                </div>
              )}

              <form onSubmit={handleCreateProject} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5 ml-1">Project Name</label>
                  <input
                    type="text"
                    required
                    className="neon-input block w-full rounded-lg px-4 py-2.5 text-gray-100 placeholder-gray-600 text-sm"
                    placeholder="e.g. Protocol Alpha"
                    value={newProject.name}
                    onChange={(e) => setNewProject({ ...newProject, name: e.target.value })}
                  />
                </div>
                
                <div>
                  <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5 ml-1">Description (Optional)</label>
                  <textarea
                    rows="3"
                    className="neon-input block w-full rounded-lg px-4 py-2.5 text-gray-100 placeholder-gray-600 text-sm resize-none"
                    placeholder="Define project parameters..."
                    value={newProject.description}
                    onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
                  ></textarea>
                </div>

                <div className="pt-4 flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2.5 rounded-lg text-sm font-semibold text-gray-400 hover:text-gray-200 hover:bg-gray-800 transition-colors cursor-pointer"
                  >
                    CANCEL
                  </button>
                  <button
                    type="submit"
                    className="neon-button px-5 py-2.5 rounded-lg text-sm font-semibold tracking-wide cursor-pointer"
                  >
                    INITIALIZE
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

export default Projects;
