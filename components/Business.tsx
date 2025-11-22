import React, { useState } from 'react';
import { Lead, LeadStatus, RoleLevel } from '../types';
import { Users, Phone, FileText, TrendingUp, BadgePercent, Target, MoreHorizontal, Plus, X } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { useAuth } from '../contexts/AuthContext';

// Move mock data outside to persist in session
const initialLeads: Lead[] = [
  { id: 'L001', name: 'Nguyễn Văn An', phone: '0912345678', source: 'Website', status: LeadStatus.NEW, estimatedCapacity: 10, date: '2023-10-20', ownerId: 'U_S1', assignedTo: 'Lê Sale Một' },
  { id: 'L002', name: 'Công ty TNHH ABC', phone: '0987654321', source: 'Giới thiệu', status: LeadStatus.SURVEY_SCHEDULED, estimatedCapacity: 150, date: '2023-10-19', ownerId: 'U_S2', assignedTo: 'Phạm Sale Hai' },
  { id: 'L003', name: 'Trần Thị Bích', phone: '0909090909', source: 'Facebook', status: LeadStatus.CONTACTED, estimatedCapacity: 5, date: '2023-10-21', ownerId: 'U_S1', assignedTo: 'Lê Sale Một' },
  { id: 'L004', name: 'Nhà máy Gỗ X', phone: '0911223344', source: 'Giới thiệu', status: LeadStatus.QUOTE_SENT, estimatedCapacity: 450, date: '2023-10-15', ownerId: 'U_S2', assignedTo: 'Phạm Sale Hai' },
  { id: 'L005', name: 'Lê Văn Cường', phone: '0933445566', source: 'Website', status: LeadStatus.WON, estimatedCapacity: 8, date: '2023-10-10', ownerId: 'U_S1', assignedTo: 'Lê Sale Một' },
  { id: 'L006', name: 'Khách sạn Biển Nhớ', phone: '0944556677', source: 'Khác', status: LeadStatus.LOST, estimatedCapacity: 80, date: '2023-10-12', ownerId: 'U_SM', assignedTo: 'Trần Trưởng Phòng' },
];

// Memory store
let memoryLeads = [...initialLeads];

const funnelData = [
  { name: 'Khách tiềm năng', value: 45 },
  { name: 'Đã liên hệ', value: 32 },
  { name: 'Khảo sát', value: 20 },
  { name: 'Báo giá', value: 15 },
  { name: 'Hợp đồng', value: 8 },
];

const colors = ['#94a3b8', '#64748b', '#3b82f6', '#eab308', '#10b981'];

const LeadStatusBadge: React.FC<{ status: LeadStatus }> = ({ status }) => {
  const styles: Record<LeadStatus, string> = {
    [LeadStatus.NEW]: 'bg-blue-50 text-blue-700 border-blue-100',
    [LeadStatus.CONTACTED]: 'bg-indigo-50 text-indigo-700 border-indigo-100',
    [LeadStatus.SURVEY_SCHEDULED]: 'bg-purple-50 text-purple-700 border-purple-100',
    [LeadStatus.QUOTE_SENT]: 'bg-yellow-50 text-yellow-700 border-yellow-100',
    [LeadStatus.WON]: 'bg-emerald-50 text-emerald-700 border-emerald-100',
    [LeadStatus.LOST]: 'bg-red-50 text-red-700 border-red-100',
  };

  return (
    <span className={`px-3 py-1 rounded-full text-xs font-medium border ${styles[status]}`}>
      {status}
    </span>
  );
};

const Business: React.FC = () => {
  const { user, canAccessData } = useAuth();
  const [leads, setLeads] = useState<Lead[]>(memoryLeads);
  const [showAddModal, setShowAddModal] = useState(false);
  
  // New Lead Form State
  const [newLead, setNewLead] = useState<Partial<Lead>>({
    name: '',
    phone: '',
    source: 'Khác',
    estimatedCapacity: 0,
  });

  const handleAddLead = (e: React.FormEvent) => {
    e.preventDefault();
    const leadToAdd: Lead = {
        id: `L${Date.now()}`,
        name: newLead.name || 'Khách mới',
        phone: newLead.phone || '',
        source: newLead.source as any,
        status: LeadStatus.NEW,
        estimatedCapacity: newLead.estimatedCapacity || 0,
        date: new Date().toISOString().split('T')[0],
        ownerId: user?.id,
        assignedTo: user?.name || 'Chưa phân công'
    };
    
    memoryLeads = [leadToAdd, ...memoryLeads];
    setLeads(memoryLeads);
    setShowAddModal(false);
    setNewLead({ name: '', phone: '', source: 'Khác', estimatedCapacity: 0 });
  };

  // Filter logic: Executive/Manager sees all, Staff sees only their own
  const filteredLeads = leads.filter(lead => canAccessData(lead.ownerId));

  return (
    <div className="p-8 ml-64 bg-slate-50 min-h-screen">
      <header className="mb-8 flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-slate-800">Kinh Doanh & CRM</h2>
          <p className="text-slate-500 mt-1">
            {user?.level === RoleLevel.STAFF 
              ? 'Danh sách khách hàng của bạn' 
              : 'Quản lý toàn bộ khách hàng và hiệu quả bán hàng'}
          </p>
        </div>
        <button 
          onClick={() => setShowAddModal(true)}
          className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2.5 rounded-xl font-medium transition-colors shadow-sm flex items-center gap-2"
        >
          <Plus size={20} />
          <span>Thêm Lead Mới</span>
        </button>
      </header>

      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm text-slate-500 mb-1">Leads (Khả dụng)</p>
              <h3 className="text-2xl font-bold text-slate-800">{filteredLeads.length}</h3>
            </div>
            <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
              <Target size={24} />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm text-emerald-600 font-medium">
            <TrendingUp size={16} className="mr-1" />
            Dữ liệu theo phân quyền
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm text-slate-500 mb-1">Báo Giá Đang Chờ</p>
              <h3 className="text-2xl font-bold text-slate-800">
                {filteredLeads.filter(l => l.status === LeadStatus.QUOTE_SENT).length}
              </h3>
            </div>
            <div className="p-3 bg-yellow-50 text-yellow-600 rounded-xl">
              <FileText size={24} />
            </div>
          </div>
          <p className="mt-4 text-sm text-slate-400">Trong phạm vi quản lý</p>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm text-slate-500 mb-1">Tỷ Lệ Chốt Đơn</p>
              <h3 className="text-2xl font-bold text-slate-800">18.5%</h3>
            </div>
            <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
              <BadgePercent size={24} />
            </div>
          </div>
          <p className="mt-4 text-sm text-slate-400">Mục tiêu: 20%</p>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm text-slate-500 mb-1">Doanh Số Dự Kiến</p>
              <h3 className="text-2xl font-bold text-slate-800">
                {(filteredLeads.reduce((acc, curr) => acc + curr.estimatedCapacity, 0) * 15).toLocaleString()} Tr
              </h3>
            </div>
            <div className="p-3 bg-purple-50 text-purple-600 rounded-xl">
              <TrendingUp size={24} />
            </div>
          </div>
          <p className="mt-4 text-sm text-slate-400">Ước tính từ Leads hiện có</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        {/* Funnel Chart */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 lg:col-span-1">
          <h3 className="text-lg font-bold text-slate-800 mb-6">Phễu Bán Hàng</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={funnelData} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#e2e8f0" />
                <XAxis type="number" hide />
                <YAxis dataKey="name" type="category" width={100} tick={{fill: '#64748b', fontSize: 13}} />
                <Tooltip cursor={{fill: '#f1f5f9'}} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={24}>
                  {funnelData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Activity/List */}
        <div className="bg-white p-0 rounded-2xl shadow-sm border border-slate-100 lg:col-span-2 overflow-hidden flex flex-col">
          <div className="p-6 border-b border-slate-100 flex justify-between items-center">
            <h3 className="text-lg font-bold text-slate-800">Danh Sách Khách Hàng</h3>
            <div className="flex gap-2">
                <input 
                    type="text" 
                    placeholder="Tìm kiếm..." 
                    className="px-3 py-1.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
            </div>
          </div>
          <div className="flex-1 overflow-auto">
            <table className="w-full text-left">
              <thead className="bg-slate-50 text-slate-500 text-sm">
                <tr>
                  <th className="px-6 py-3 font-medium">Tên khách hàng</th>
                  <th className="px-6 py-3 font-medium">Phụ trách</th>
                  <th className="px-6 py-3 font-medium">Công suất</th>
                  <th className="px-6 py-3 font-medium">Trạng thái</th>
                  <th className="px-6 py-3 font-medium text-right">Hành động</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredLeads.length > 0 ? (
                  filteredLeads.map((lead) => (
                    <tr key={lead.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="font-medium text-slate-800">{lead.name}</div>
                        <div className="flex items-center text-xs text-slate-400 mt-1">
                          <Phone size={12} className="mr-1" />
                          {lead.phone}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-slate-600 text-sm">
                         {lead.assignedTo}
                      </td>
                      <td className="px-6 py-4 font-medium text-slate-800">{lead.estimatedCapacity} kWp</td>
                      <td className="px-6 py-4">
                        <LeadStatusBadge status={lead.status} />
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button className="text-slate-400 hover:text-emerald-600">
                          <MoreHorizontal size={20} />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-slate-500">
                      Không có dữ liệu hoặc bạn không có quyền xem.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      
      {/* Add Lead Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <h3 className="text-lg font-bold text-slate-800">Thêm Khách Hàng Mới</h3>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-slate-600">
                <X size={24} />
              </button>
            </div>
            <form onSubmit={handleAddLead} className="p-6 space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Tên khách hàng <span className="text-red-500">*</span></label>
                <input 
                  required
                  type="text" 
                  value={newLead.name}
                  onChange={(e) => setNewLead({...newLead, name: e.target.value})}
                  className="w-full border border-slate-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-emerald-500 outline-none"
                  placeholder="Nguyễn Văn A hoặc Công ty B"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Số điện thoại</label>
                <input 
                  type="tel" 
                  value={newLead.phone}
                  onChange={(e) => setNewLead({...newLead, phone: e.target.value})}
                  className="w-full border border-slate-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-emerald-500 outline-none"
                  placeholder="090..."
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Công suất quan tâm (kWp)</label>
                <input 
                  type="number" 
                  value={newLead.estimatedCapacity || ''}
                  onChange={(e) => setNewLead({...newLead, estimatedCapacity: Number(e.target.value)})}
                  className="w-full border border-slate-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-emerald-500 outline-none"
                  placeholder="0"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Nguồn khách</label>
                <select 
                  value={newLead.source}
                  onChange={(e) => setNewLead({...newLead, source: e.target.value as any})}
                  className="w-full border border-slate-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-emerald-500 outline-none"
                >
                  <option value="Website">Website</option>
                  <option value="Facebook">Facebook</option>
                  <option value="Giới thiệu">Giới thiệu</option>
                  <option value="Khác">Khác</option>
                </select>
              </div>
              <div className="flex justify-end gap-3 mt-6">
                <button 
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg font-medium"
                >
                  Hủy bỏ
                </button>
                <button 
                  type="submit"
                  className="px-6 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold shadow-sm"
                >
                  Lưu khách hàng
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Business;