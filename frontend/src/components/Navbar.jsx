import { Link, useNavigate, useLocation } from "react-router-dom";
import { Sparkles, LayoutDashboard, Folders, LogOut, UserCircle } from "lucide-react";

const Navbar = ({ user, logout }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const NavLink = ({ to, icon: Icon, children }) => {
    const isActive = location.pathname === to || (to === "/projects" && location.pathname.startsWith("/projects"));
    
    return (
      <Link 
        to={to} 
        className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all text-sm uppercase tracking-wider ${
          isActive 
            ? "text-cyan-400 bg-cyan-950/30 border border-cyan-500/30 shadow-[0_0_10px_rgba(6,182,212,0.15)]" 
            : "text-gray-400 hover:text-gray-100 hover:bg-gray-800"
        }`}
      >
        <Icon className="h-4 w-4" />
        {children}
      </Link>
    );
  };

  return (
    <nav className="bg-gray-950/80 backdrop-blur-xl sticky top-0 z-50 border-b border-cyan-500/20 shadow-[0_4px_30px_rgba(0,0,0,0.5)]">
      <div className="container mx-auto h-16 flex items-center justify-between px-6">
        <div className="flex items-center gap-10">
          <Link to="/" className="flex items-center gap-2 font-black text-2xl tracking-tighter">
            <Sparkles className="h-6 w-6 text-cyan-400" />
            <span className="text-gray-100 uppercase tracking-widest">Sys<span className="text-cyan-400">Ctrl</span></span>
          </Link>
          
          <div className="hidden md:flex items-center gap-3">
            <NavLink to="/" icon={LayoutDashboard}>Dashboard</NavLink>
            <NavLink to="/projects" icon={Folders}>Projects</NavLink>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3 px-4 py-1.5 rounded-lg bg-gray-900 border border-gray-800">
            <UserCircle className="h-5 w-5 text-gray-400" />
            <span className="text-xs font-semibold text-gray-200 uppercase tracking-wider">{user.name}</span>
            <span className="text-[9px] bg-cyan-950 text-cyan-400 border border-cyan-500/30 px-2 py-0.5 rounded uppercase tracking-[0.2em] font-bold">
              {user.role}
            </span>
          </div>
          
          <button
            onClick={handleLogout}
            className="p-2 rounded-lg bg-gray-900 border border-gray-800 text-gray-400 hover:text-red-400 hover:border-red-500/50 hover:bg-red-950/30 transition-all"
            title="Logout"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
