import React from 'react';
import { LayoutDashboard, Sun, Package, MessageSquareText, Settings, Zap, Briefcase, Users, Banknote, LogOut } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Department, RoleLevel } from '../types';

const Sidebar: React.FC = () => {
  const location = useLocation();
  const { user, logout, checkAccess } = useAuth();
  const navigate = useNavigate();

  const isActive = (path: string) => {
    return location.pathname === path ? 'bg-emerald-600 text-white shadow-lg' : 'text-slate-600 hover:bg-slate-100';
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Define Departments that can access each module
  const navItems = [
    { 
      path: '/', 
      label: 'Tổng quan', 
      icon: <LayoutDashboard size={20} />, 
      allowedDepts: [Department.BOARD, Department.SALES, Department.TECHNICAL, Department.FINANCE, Department.HR, Department.WAREHOUSE] // Everyone
    },
    { 
      path: '/business', 
      label: 'Kinh doanh', 
      icon: <Briefcase size={20} />, 
      allowedDepts: [Department.BOARD, Department.SALES] 
    },
    { 
      path: '/projects', 
      label: 'Dự án', 
      icon: <Sun size={20} />, 
      allowedDepts: [Department.BOARD, Department.SALES, Department.TECHNICAL] 
    },
    { 
      path: '/inventory', 
      label: 'Kho vật tư', 
      icon: <Package size={20} />, 
      allowedDepts: [Department.BOARD, Department.TECHNICAL, Department.WAREHOUSE] 
    },
    { 
      path: '/hr', 
      label: 'Nhân sự', 
      icon: <Users size={20} />, 
      allowedDepts: [Department.BOARD, Department.SALES, Department.TECHNICAL, Department.FINANCE, Department.HR, Department.WAREHOUSE] // Everyone
    },
    { 
      path: '/finance', 
      label: 'Tài chính', 
      icon: <Banknote size={20} />, 
      allowedDepts: [Department.BOARD, Department.FINANCE] 
    },
    { 
      path: '/assistant', 
      label: 'Trợ lý AI', 
      icon: <MessageSquareText size={20} />, 
      allowedDepts: [Department.BOARD, Department.SALES, Department.TECHNICAL] 
    },
  ];

  const visibleItems = navItems.filter(item => checkAccess(item.allowedDepts));

  const getRoleLabel = () => {
    if (!user) return '';
    const levelMap: Record<RoleLevel, string> = {
      [RoleLevel.EXECUTIVE]: 'Ban Điều Hành',
      [RoleLevel.MANAGER]: 'Quản Lý',
      [RoleLevel.STAFF]: 'Nhân Viên'
    };
    const deptMap: Record<Department, string> = {
      [Department.BOARD]: 'Ban Giám Đốc',
      [Department.SALES]: 'Kinh Doanh',
      [Department.TECHNICAL]: 'Kỹ Thuật',
      [Department.FINANCE]: 'Tài Chính',
      [Department.HR]: 'Nhân Sự',
      [Department.WAREHOUSE]: 'Kho'
    };
    
    return `${levelMap[user.level]} - ${deptMap[user.department]}`;
  };

  return (
    <div className="w-64 h-screen bg-white border-r border-slate-200 flex flex-col fixed left-0 top-0 z-10">
      <div className="p-6 flex items-center space-x-2 border-b border-slate-100">
        <div className="bg-emerald-600 p-2 rounded-lg text-white">
          <Zap size={24} />
        </div>
        <h1 className="text-xl font-bold text-slate-800">SolarOps</h1>
      </div>
      
      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        {visibleItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 font-medium ${isActive(item.path)}`}
          >
            {item.icon}
            <span>{item.label}</span>
          </Link>
        ))}
      </nav>

      <div className="p-4 border-t border-slate-100">
        <div className="mb-4 px-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
            {user?.avatar || user?.name?.charAt(0)}
          </div>
          <div className="overflow-hidden w-full">
            <p className="text-sm font-bold text-slate-800 truncate">{user?.name}</p>
            <p className="text-[10px] text-slate-500 truncate uppercase tracking-wide" title={getRoleLabel()}>
              {getRoleLabel()}
            </p>
          </div>
        </div>
        <button 
          onClick={handleLogout}
          className="flex items-center space-x-3 px-4 py-2 text-slate-500 hover:text-red-600 w-full rounded-xl hover:bg-red-50 transition-colors text-sm"
        >
          <LogOut size={18} />
          <span>Đăng xuất</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;