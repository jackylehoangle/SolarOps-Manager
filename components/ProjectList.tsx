import React, { useState } from 'react';
import { Project, ProjectStatus, RoleLevel } from '../types';
import { Search, Filter, MoreVertical, MapPin, Calendar, ArrowRight, User, HardHat, X, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

// Move mock data outside component to persist changes in memory during session
export const initialProjects: Project[] = [
  {
    id: 'PJ-001',
    name: 'Nhà máy Dệt May Hòa Bình',
    customer: 'Công ty CP Dệt May HB',
    capacityKWp: 450,
    address: 'KCN Hòa Khánh, Đà Nẵng',
    status: ProjectStatus.INSTALLATION,
    startDate: '2023-10-15',
    budget: 4500000000,
    salesRep: 'Lê Sale Một',
    salesRepId: 'U_S1', 
    surveyor: 'Võ Kỹ Thuật',
    surveyorId: 'U_TM'
  },
  {
    id: 'PJ-002',
    name: 'Biệt thự anh Hùng',
    customer: 'Nguyễn Văn Hùng',
    capacityKWp: 15,
    address: 'Thảo Điền, TP.HCM',
    status: ProjectStatus.DESIGN,
    startDate: '2023-11-01',
    budget: 250000000,
    salesRep: 'Phạm Sale Hai',
    salesRepId: 'U_S2', 
    surveyor: 'Võ Kỹ Thuật',
    surveyorId: 'U_TM'
  },
  {
    id: 'PJ-003',
    name: 'Trang trại Nông nghiệp Xanh',
    customer: 'HTX Nông nghiệp Xanh',
    capacityKWp: 120,
    address: 'Củ Chi, TP.HCM',
    status: ProjectStatus.SURVEY,
    startDate: '2023-11-05',
    budget: 1800000000,
    salesRep: 'Lê Sale Một',
    salesRepId: 'U_S1',
    surveyor: 'Chưa phân công'
  },
  {
    id: 'PJ-004',
    name: 'Kho lạnh Biển Đông',
    customer: 'Công ty Thủy sản Biển Đông',
    capacityKWp: 300,
    address: 'Vũng Tàu',
    status: ProjectStatus.GRID_CONNECTION,
    startDate: '2023-09-10',
    budget: 3200000000,
    salesRep: 'Phạm Sale Hai',
    salesRepId: 'U_S2',
    surveyor: 'Võ Kỹ Thuật',
    surveyorId: 'U_TM'
  },
];

// Helper to persist data across re-renders in same session
export let memoryProjects = [...initialProjects];

const StatusBadge: React.FC<{ status: ProjectStatus }> = ({ status }) => {
  const colors: Record<ProjectStatus, string> = {
    [ProjectStatus.SURVEY]: 'bg-gray-100 text-gray-700',
    [ProjectStatus.DESIGN]: 'bg-blue-50 text-blue-700',
    [ProjectStatus.PERMITTING]: 'bg-yellow-50 text-yellow-700',
    [ProjectStatus.INSTALLATION]: 'bg-purple-50 text-purple-700',
    [ProjectStatus.GRID_CONNECTION]: 'bg-orange-50 text-orange-700',
    [ProjectStatus.COMPLETED]: 'bg-emerald-50 text-emerald-700',
  };

  return (
    <span className={`px-3 py-1 rounded-full text-xs font-medium ${colors[status]}`}>
      {status}
    </span>
  );
};

const ProjectList: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>(memoryProjects);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();

  // New Project Form State
  const [newProject, setNewProject] = useState<Partial<Project>>({
    name: '',
    customer: '',
    capacityKWp: 0,
    address: '',
    status: ProjectStatus.SURVEY,
    startDate: new Date().toISOString().split('T')[0],
    budget: 0
  });

  const handleAddProject = (e: React.FormEvent) => {
    e.preventDefault();
    const projectToAdd: Project = {
      id: `PJ-${Date.now()}`, // Generate ID
      name: newProject.name || 'Dự án mới',
      customer: newProject.customer || 'Khách hàng mới',
      capacityKWp: newProject.capacityKWp || 0,
      address: newProject.address || '',
      status: newProject.status || ProjectStatus.SURVEY,
      startDate: newProject.startDate || '',
      budget: newProject.budget || 0,
      // Auto assign creator as sales rep if they are sales staff
      salesRep: user?.level === RoleLevel.STAFF && user.department === 'SALES' ? user.name : 'Chưa phân công',
      salesRepId: user?.level === RoleLevel.STAFF && user.department === 'SALES' ? user.id : undefined,
      surveyor: 'Chưa phân công'
    };

    memoryProjects = [projectToAdd, ...memoryProjects]; // Update memory
    setProjects(memoryProjects); // Update state
    setIsModalOpen(false);
    
    // Reset form
    setNewProject({
      name: '',
      customer: '',
      capacityKWp: 0,
      address: '',
      status: ProjectStatus.SURVEY,
      startDate: new Date().toISOString().split('T')[0],
      budget: 0
    });
  };

  // Filter Projects based on Permissions
  const accessibleProjects = projects.filter(p => {
    if (user?.level === RoleLevel.EXECUTIVE || user?.level === RoleLevel.MANAGER) return true;
    
    const isMySale = p.salesRepId === user?.id;
    const isMySurvey = p.surveyorId === user?.id;
    return isMySale || isMySurvey;
  });

  const filteredProjects = accessibleProjects.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.customer.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-8 ml-64 bg-slate-50 min-h-screen">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-3xl font-bold text-slate-800">Dự Án</h2>
          <p className="text-slate-500 mt-1">
             {user?.level === RoleLevel.STAFF 
              ? 'Danh sách dự án bạn phụ trách.' 
              : 'Quản lý toàn bộ dự án công ty.'}
          </p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2.5 rounded-xl font-medium transition-colors shadow-sm flex items-center gap-2"
        >
          <Plus size={20} />
          <span>Thêm dự án mới</span>
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={20} />
            <input 
              type="text" 
              placeholder="Tìm kiếm dự án, khách hàng..." 
              className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button className="flex items-center space-x-2 px-4 py-2 border border-slate-200 rounded-lg hover:bg-slate-50 text-slate-600">
            <Filter size={18} />
            <span>Bộ lọc</span>
          </button>
        </div>

        <table className="w-full text-left">
          <thead className="bg-slate-50 text-slate-500 text-sm">
            <tr>
              <th className="px-6 py-4 font-medium">Tên dự án</th>
              <th className="px-6 py-4 font-medium">Khách hàng</th>
              <th className="px-6 py-4 font-medium">Nhân sự phụ trách</th>
              <th className="px-6 py-4 font-medium">Trạng thái</th>
              <th className="px-6 py-4 font-medium">Ngân sách</th>
              <th className="px-6 py-4 font-medium text-right">Thao tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredProjects.map((project) => (
              <tr 
                key={project.id} 
                className="hover:bg-slate-50 transition-colors cursor-pointer group"
                onClick={() => navigate(`/projects/${project.id}`)}
              >
                <td className="px-6 py-4">
                  <div className="font-medium text-slate-800">{project.name}</div>
                  <div className="flex items-center text-xs text-slate-400 mt-1">
                    <MapPin size={12} className="mr-1" />
                    {project.address}
                  </div>
                </td>
                <td className="px-6 py-4 text-slate-600">{project.customer}</td>
                <td className="px-6 py-4">
                  <div className="space-y-1">
                    <div className="flex items-center text-xs text-slate-600" title="Kinh doanh">
                      <User size={12} className="mr-1.5 text-blue-500" />
                      {project.salesRep || '---'}
                    </div>
                    <div className="flex items-center text-xs text-slate-600" title="Kỹ thuật/Khảo sát">
                      <HardHat size={12} className="mr-1.5 text-orange-500" />
                      {project.surveyor || '---'}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <StatusBadge status={project.status} />
                </td>
                <td className="px-6 py-4 text-slate-600">
                  {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(project.budget)}
                </td>
                <td className="px-6 py-4 text-right">
                   <button className="p-2 bg-slate-100 hover:bg-emerald-100 text-slate-400 hover:text-emerald-600 rounded-lg transition-colors">
                    <ArrowRight size={18} />
                  </button>
                </td>
              </tr>
            ))}
            {filteredProjects.length === 0 && (
              <tr>
                <td colSpan={6} className="p-12 text-center text-slate-500">
                   Không có dự án nào trong danh sách hiển thị của bạn.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Add Project Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <h3 className="text-lg font-bold text-slate-800">Thêm Dự Án Mới</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X size={24} />
              </button>
            </div>
            <form onSubmit={handleAddProject} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">Tên dự án <span className="text-red-500">*</span></label>
                  <input 
                    required
                    type="text" 
                    value={newProject.name}
                    onChange={(e) => setNewProject({...newProject, name: e.target.value})}
                    className="w-full border border-slate-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-emerald-500 outline-none"
                    placeholder="VD: Nhà máy Dệt May..."
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">Khách hàng <span className="text-red-500">*</span></label>
                  <input 
                    required
                    type="text" 
                    value={newProject.customer}
                    onChange={(e) => setNewProject({...newProject, customer: e.target.value})}
                    className="w-full border border-slate-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-emerald-500 outline-none"
                    placeholder="Tên Cty hoặc Cá nhân"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">Công suất (kWp)</label>
                  <input 
                    type="number" 
                    value={newProject.capacityKWp || ''}
                    onChange={(e) => setNewProject({...newProject, capacityKWp: Number(e.target.value)})}
                    className="w-full border border-slate-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-emerald-500 outline-none"
                    placeholder="0"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">Ngân sách (VNĐ)</label>
                  <input 
                    type="number" 
                    value={newProject.budget || ''}
                    onChange={(e) => setNewProject({...newProject, budget: Number(e.target.value)})}
                    className="w-full border border-slate-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-emerald-500 outline-none"
                    placeholder="0"
                  />
                </div>
                <div className="col-span-2 space-y-2">
                  <label className="text-sm font-medium text-slate-700">Địa điểm thi công</label>
                  <input 
                    type="text" 
                    value={newProject.address}
                    onChange={(e) => setNewProject({...newProject, address: e.target.value})}
                    className="w-full border border-slate-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-emerald-500 outline-none"
                    placeholder="Địa chỉ công trình..."
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">Ngày bắt đầu</label>
                  <input 
                    type="date" 
                    value={newProject.startDate}
                    onChange={(e) => setNewProject({...newProject, startDate: e.target.value})}
                    className="w-full border border-slate-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-emerald-500 outline-none"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">Trạng thái ban đầu</label>
                  <select 
                    value={newProject.status}
                    onChange={(e) => setNewProject({...newProject, status: e.target.value as ProjectStatus})}
                    className="w-full border border-slate-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-emerald-500 outline-none"
                  >
                    {Object.values(ProjectStatus).map(s => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="flex justify-end gap-3 mt-6">
                <button 
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg font-medium"
                >
                  Hủy bỏ
                </button>
                <button 
                  type="submit"
                  className="px-6 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold shadow-sm"
                >
                  Tạo dự án
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectList;