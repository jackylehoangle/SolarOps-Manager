import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Legend } from 'recharts';
import { TrendingUp, Zap, Users, DollarSign } from 'lucide-react';
import { StatCardProps } from '../types';

// Mock Data
const monthlyData = [
  { name: 'T1', kwh: 4000, projects: 2 },
  { name: 'T2', kwh: 3000, projects: 1 },
  { name: 'T3', kwh: 2000, projects: 3 },
  { name: 'T4', kwh: 2780, projects: 2 },
  { name: 'T5', kwh: 1890, projects: 4 },
  { name: 'T6', kwh: 2390, projects: 3 },
  { name: 'T7', kwh: 3490, projects: 5 },
];

const statusData = [
  { name: 'Khảo sát', value: 4 },
  { name: 'Thiết kế', value: 3 },
  { name: 'Thi công', value: 7 },
  { name: 'Đấu nối', value: 2 },
];

const StatCard: React.FC<StatCardProps> = ({ title, value, icon, trend, trendUp }) => (
  <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
    <div className="flex justify-between items-start">
      <div>
        <p className="text-sm text-slate-500 mb-1">{title}</p>
        <h3 className="text-2xl font-bold text-slate-800">{value}</h3>
      </div>
      <div className={`p-3 rounded-xl ${trendUp ? 'bg-emerald-50 text-emerald-600' : 'bg-blue-50 text-blue-600'}`}>
        {icon}
      </div>
    </div>
    {trend && (
      <div className="mt-4 flex items-center text-sm">
        <span className={trendUp ? "text-emerald-600 font-medium" : "text-red-500 font-medium"}>
          {trend}
        </span>
        <span className="text-slate-400 ml-2">so với tháng trước</span>
      </div>
    )}
  </div>
);

const Dashboard: React.FC = () => {
  return (
    <div className="p-8 ml-64 bg-slate-50 min-h-screen">
      <header className="mb-8">
        <h2 className="text-3xl font-bold text-slate-800">Tổng Quan Hoạt Động</h2>
        <p className="text-slate-500 mt-1">Báo cáo thời gian thực về các dự án và hiệu suất.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard 
          title="Tổng công suất lắp đặt" 
          value="1,240 kWp" 
          icon={<Zap size={24} />} 
          trend="+12%" 
          trendUp={true} 
        />
        <StatCard 
          title="Dự án đang thực hiện" 
          value="16" 
          icon={<TrendingUp size={24} />} 
          trend="+3" 
          trendUp={true} 
        />
        <StatCard 
          title="Khách hàng mới" 
          value="8" 
          icon={<Users size={24} />} 
          trend="+2%" 
          trendUp={true} 
        />
        <StatCard 
          title="Doanh thu tháng" 
          value="2.4 Tỷ VNĐ" 
          icon={<DollarSign size={24} />} 
          trend="+8%" 
          trendUp={true} 
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Chart */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <h3 className="text-lg font-bold text-slate-800 mb-6">Sản lượng điện dự kiến (kWh)</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={monthlyData}>
                <defs>
                  <linearGradient id="colorKwh" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b'}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b'}} />
                <Tooltip 
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Area type="monotone" dataKey="kwh" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorKwh)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Side Chart */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <h3 className="text-lg font-bold text-slate-800 mb-6">Trạng thái dự án</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={statusData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#e2e8f0" />
                <XAxis type="number" hide />
                <YAxis dataKey="name" type="category" width={80} tick={{fill: '#64748b', fontSize: 12}} />
                <Tooltip cursor={{fill: '#f1f5f9'}} />
                <Bar dataKey="value" fill="#3b82f6" radius={[0, 4, 4, 0]} barSize={30} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;