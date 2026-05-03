import { useEffect, useState } from "react";
import API from "../services/api";
import { motion } from "framer-motion";
import { 
  CheckCircle2, 
  AlertCircle, 
  Plus,
  ArrowRight,
  Activity,
  Layers
} from "lucide-react";
import { Link } from "react-router-dom";

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const isAdmin = user?.role === "ADMIN";

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data } = await API.get("/dashboard/stats");
        setStats(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) return <div className="flex justify-center py-20"><div className="animate-spin rounded-full h-12 w-12 border-t-2 border-cyan-500"></div></div>;

  return (
    <div className="space-y-8 p-6 max-w-7xl mx-auto">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-100 tracking-tight">System Overview</h1>
          <p className="text-gray-400 mt-1 text-sm uppercase tracking-wider">Metrics and recent activity</p>
        </div>
        {isAdmin && (
          <Link to="/projects" className="inline-flex items-center gap-2 neon-button px-5 py-2.5 rounded-lg font-semibold text-sm tracking-wide">
            <Plus className="h-4 w-4" />
            NEW PROJECT
          </Link>
        )}
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          icon={<AlertCircle className="text-purple-400 h-6 w-6" />} 
          label="Pending Tasks" 
          value={stats?.todoTasks || 0} 
          color="bg-purple-900/30 border-purple-500/30" 
        />
        <StatCard 
          icon={<Activity className="text-cyan-400 h-6 w-6" />} 
          label="In Progress" 
          value={stats?.inProgressTasks || 0} 
          color="bg-cyan-900/30 border-cyan-500/30" 
        />
        <StatCard 
          icon={<CheckCircle2 className="text-emerald-400 h-6 w-6" />} 
          label="Completed" 
          value={stats?.doneTasks || 0} 
          color="bg-emerald-900/30 border-emerald-500/30" 
        />
        <StatCard 
          icon={<Layers className="text-gray-400 h-6 w-6" />} 
          label="Total Projects" 
          value={stats?.projectsCount || 0} 
          color="bg-gray-800 border-gray-600" 
        />
      </div>

      <div className="mt-10">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-100">Recent Activity</h2>
            <Link to="/projects" className="text-cyan-400 font-semibold hover:text-cyan-300 text-xs uppercase tracking-wider flex items-center gap-1 bg-gray-900 px-3 py-1.5 rounded-md border border-gray-800">
              View All <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
          
          <div className="bg-gray-900 rounded-xl overflow-hidden border border-gray-800 neon-border">
            {stats?.recentTasks?.length > 0 ? (
              <div className="divide-y divide-gray-800">
                {stats.recentTasks.map((task) => (
                  <div key={task._id} className="p-5 flex items-center justify-between hover:bg-gray-800/50 transition-colors">
                    <div>
                      <h3 className="font-semibold text-gray-100">{task.title}</h3>
                      <p className="text-xs text-gray-500 uppercase tracking-wider mt-1">{task.project?.name}</p>
                    </div>
                    <span className={`text-[10px] font-bold px-2.5 py-1 rounded-sm uppercase tracking-widest ${
                      task.status === "DONE" ? "bg-emerald-900/50 text-emerald-400 border border-emerald-500/30" :
                      task.status === "IN_PROGRESS" ? "bg-cyan-900/50 text-cyan-400 border border-cyan-500/30" :
                      "bg-purple-900/50 text-purple-400 border border-purple-500/30"
                    }`}>
                      {task.status.replace("_", " ")}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-16 text-center text-gray-500 text-sm">
                <div className="mx-auto h-12 w-12 bg-gray-800 rounded-full flex items-center justify-center mb-4">
                  <CheckCircle2 className="h-6 w-6 text-gray-600" />
                </div>
                No activity records found
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ icon, label, value, color }) => (
  <motion.div 
    whileHover={{ y: -3 }}
    className={`p-6 rounded-xl border flex items-center gap-5 bg-gray-900 hover:shadow-[0_0_15px_rgba(6,182,212,0.15)] transition-all ${color.includes('border-gray') ? 'border-gray-800' : 'neon-border'}`}
  >
    <div className={`h-12 w-12 rounded-lg flex items-center justify-center border ${color}`}>
      {icon}
    </div>
    <div>
      <p className="text-xs text-gray-500 font-semibold uppercase tracking-wider mb-1">{label}</p>
      <p className="text-2xl font-bold text-gray-100">{value}</p>
    </div>
  </motion.div>
);

export default Dashboard;
