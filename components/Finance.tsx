import React from 'react';
import { Transaction, TransactionType } from '../types';
import { DollarSign, TrendingUp, TrendingDown, FileText, PlusCircle, MinusCircle, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const mockTransactions: Transaction[] = [
  { id: 'TRX-001', date: '2023-10-25', description: 'Thanh toán đợt 1 dự án Dệt May HB', amount: 1500000000, type: TransactionType.INCOME, category: 'Doanh thu dự án', status: 'Hoàn thành' },
  { id: 'TRX-002', date: '2023-10-24', description: 'Nhập lô pin Canadian Solar', amount: 850000000, type: TransactionType.EXPENSE, category: 'Nhập hàng', status: 'Hoàn thành' },
  { id: 'TRX-003', date: '2023-10-23', description: 'Chi phí lương tháng 9', amount: 350000000, type: TransactionType.EXPENSE, category: 'Lương & Phúc lợi', status: 'Hoàn thành' },
  { id: 'TRX-004', date: '2023-10-22', description: 'Thanh toán thiết kế biệt thự A.Hùng', amount: 25000000, type: TransactionType.INCOME, category: 'Phí thiết kế', status: 'Hoàn thành' },
  { id: 'TRX-005', date: '2023-10-20', description: 'Chi phí xăng xe, công tác phí', amount: 12000000, type: TransactionType.EXPENSE, category: 'Công tác phí', status: 'Chờ xử lý' },
];

const chartData = [
  { name: 'T5', Thu: 2000, Chi: 1500 },
  { name: 'T6', Thu: 3500, Chi: 2200 },
  { name: 'T7', Thu: 1800, Chi: 1900 },
  { name: 'T8', Thu: 4200, Chi: 2800 },
  { name: 'T9', Thu: 3800, Chi: 3100 },
  { name: 'T10', Thu: 5100, Chi: 2500 },
];

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
};

const Finance: React.FC = () => {
  return (
    <div className="p-8 ml-64 bg-slate-50 min-h-screen">
      <header className="mb-8 flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-slate-800">Tài Chính & Kế Toán</h2>
          <p className="text-slate-500 mt-1">Theo dõi dòng tiền, doanh thu và chi phí.</p>
        </div>
        <div className="flex gap-3">
          <button className="bg-white border border-slate-200 text-slate-700 px-4 py-2.5 rounded-xl font-medium transition-colors shadow-sm hover:bg-slate-50 flex items-center gap-2">
            <MinusCircle size={20} className="text-red-500" />
            <span>Ghi chi phí</span>
          </button>
          <button className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2.5 rounded-xl font-medium transition-colors shadow-sm flex items-center gap-2">
            <PlusCircle size={20} />
            <span>Tạo hóa đơn</span>
          </button>
        </div>
      </header>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <p className="text-slate-500 text-sm font-medium mb-1">Doanh thu tháng này</p>
          <h3 className="text-2xl font-bold text-emerald-600">2.45 Tỷ</h3>
          <div className="flex items-center text-emerald-600 text-sm mt-2 font-medium">
            <TrendingUp size={16} className="mr-1" /> +15% so với tháng trước
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <p className="text-slate-500 text-sm font-medium mb-1">Chi phí tháng này</p>
          <h3 className="text-2xl font-bold text-red-600">1.2 Tỷ</h3>
          <div className="flex items-center text-red-500 text-sm mt-2 font-medium">
            <TrendingDown size={16} className="mr-1" /> -5% so với tháng trước
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <p className="text-slate-500 text-sm font-medium mb-1">Lợi nhuận ròng</p>
          <h3 className="text-2xl font-bold text-blue-600">1.25 Tỷ</h3>
          <div className="flex items-center text-blue-500 text-sm mt-2 font-medium">
            <DollarSign size={16} className="mr-1" /> Tỷ suất LN: 51%
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <p className="text-slate-500 text-sm font-medium mb-1">Công nợ phải thu</p>
          <h3 className="text-2xl font-bold text-orange-600">850 Tr</h3>
          <div className="flex items-center text-slate-400 text-sm mt-2">
            <FileText size={16} className="mr-1" /> 3 dự án đang chờ TT
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        {/* Chart */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <h3 className="text-lg font-bold text-slate-800 mb-6">Biểu đồ Thu - Chi 6 tháng gần nhất</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b'}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b'}} />
                <Tooltip 
                  formatter={(value) => new Intl.NumberFormat('vi-VN').format(value as number) + ' Tr'}
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Legend />
                <Bar dataKey="Thu" fill="#10b981" radius={[4, 4, 0, 0]} name="Doanh thu (Triệu VNĐ)" />
                <Bar dataKey="Chi" fill="#ef4444" radius={[4, 4, 0, 0]} name="Chi phí (Triệu VNĐ)" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Transactions */}
        <div className="lg:col-span-1 bg-white p-0 rounded-2xl shadow-sm border border-slate-100 flex flex-col">
          <div className="p-6 border-b border-slate-100">
            <h3 className="text-lg font-bold text-slate-800">Giao dịch gần đây</h3>
          </div>
          <div className="flex-1 overflow-auto p-4 space-y-4">
            {mockTransactions.map((trx) => (
              <div key={trx.id} className="flex items-center justify-between p-3 hover:bg-slate-50 rounded-xl transition-colors border border-transparent hover:border-slate-100">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-full ${trx.type === TransactionType.INCOME ? 'bg-emerald-100 text-emerald-600' : 'bg-red-100 text-red-600'}`}>
                    {trx.type === TransactionType.INCOME ? <ArrowUpRight size={18} /> : <ArrowDownRight size={18} />}
                  </div>
                  <div>
                    <p className="font-medium text-slate-800 text-sm line-clamp-1" title={trx.description}>{trx.description}</p>
                    <p className="text-xs text-slate-400">{trx.date} • {trx.category}</p>
                  </div>
                </div>
                <div className={`font-bold text-sm ${trx.type === TransactionType.INCOME ? 'text-emerald-600' : 'text-slate-700'}`}>
                  {trx.type === TransactionType.INCOME ? '+' : '-'}{formatCurrency(trx.amount)}
                </div>
              </div>
            ))}
          </div>
          <div className="p-4 border-t border-slate-100 text-center">
            <button className="text-emerald-600 font-medium text-sm hover:underline">Xem tất cả giao dịch</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Finance;