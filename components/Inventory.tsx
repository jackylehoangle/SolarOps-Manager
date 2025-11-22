import React from 'react';
import { InventoryItem } from '../types';
import { AlertTriangle, CheckCircle2 } from 'lucide-react';

const inventoryData: InventoryItem[] = [
  { id: 'INV-001', name: 'Canadian Solar 550W', category: 'Solar Panel', quantity: 120, unit: 'Tấm', minStock: 50 },
  { id: 'INV-002', name: 'Longi Solar 450W', category: 'Solar Panel', quantity: 35, unit: 'Tấm', minStock: 50 },
  { id: 'INV-003', name: 'Huawei SUN2000-100KTL', category: 'Inverter', quantity: 5, unit: 'Cái', minStock: 2 },
  { id: 'INV-004', name: 'Growatt 5000TL', category: 'Inverter', quantity: 12, unit: 'Cái', minStock: 10 },
  { id: 'INV-005', name: 'Cáp DC 4.0mm2', category: 'Cable', quantity: 2500, unit: 'Mét', minStock: 1000 },
  { id: 'INV-006', name: 'Thanh Rail nhôm 4.2m', category: 'Mounting', quantity: 200, unit: 'Thanh', minStock: 100 },
];

const Inventory: React.FC = () => {
  return (
    <div className="p-8 ml-64 bg-slate-50 min-h-screen">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-3xl font-bold text-slate-800">Kho Vật Tư</h2>
          <p className="text-slate-500 mt-1">Theo dõi tồn kho thiết bị và vật tư.</p>
        </div>
        <div className="space-x-3">
           <button className="bg-white border border-slate-200 text-slate-700 px-6 py-2.5 rounded-xl font-medium transition-colors shadow-sm hover:bg-slate-50">
            Xuất kho
          </button>
          <button className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2.5 rounded-xl font-medium transition-colors shadow-sm">
            Nhập kho
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 border-l-4 border-l-emerald-500">
          <h4 className="text-slate-500 text-sm font-medium uppercase">Tổng giá trị tồn kho</h4>
          <p className="text-2xl font-bold text-slate-800 mt-2">8.5 Tỷ VNĐ</p>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 border-l-4 border-l-yellow-500">
          <h4 className="text-slate-500 text-sm font-medium uppercase">Sắp hết hàng</h4>
          <p className="text-2xl font-bold text-slate-800 mt-2">2 mục</p>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 border-l-4 border-l-blue-500">
          <h4 className="text-slate-500 text-sm font-medium uppercase">Đã nhập tháng này</h4>
          <p className="text-2xl font-bold text-slate-800 mt-2">12 phiếu</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-50 text-slate-500 text-sm">
            <tr>
              <th className="px-6 py-4 font-medium">Mã SP</th>
              <th className="px-6 py-4 font-medium">Tên sản phẩm</th>
              <th className="px-6 py-4 font-medium">Danh mục</th>
              <th className="px-6 py-4 font-medium">Đơn vị</th>
              <th className="px-6 py-4 font-medium text-right">Số lượng</th>
              <th className="px-6 py-4 font-medium">Trạng thái</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {inventoryData.map((item) => {
              const isLowStock = item.quantity <= item.minStock;
              return (
                <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 text-slate-500 font-mono text-sm">{item.id}</td>
                  <td className="px-6 py-4 font-medium text-slate-800">{item.name}</td>
                  <td className="px-6 py-4">
                    <span className="px-2.5 py-0.5 rounded border border-slate-200 text-xs font-medium text-slate-600 bg-slate-50">
                      {item.category}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-slate-600">{item.unit}</td>
                  <td className="px-6 py-4 text-right font-bold text-slate-800">{item.quantity.toLocaleString()}</td>
                  <td className="px-6 py-4">
                    {isLowStock ? (
                      <div className="flex items-center text-amber-600 text-sm font-medium">
                        <AlertTriangle size={16} className="mr-1.5" />
                        Sắp hết ({item.minStock})
                      </div>
                    ) : (
                      <div className="flex items-center text-emerald-600 text-sm font-medium">
                        <CheckCircle2 size={16} className="mr-1.5" />
                        Đủ hàng
                      </div>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Inventory;