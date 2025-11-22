import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Project, ProjectStatus, SurveyData, QuotationItem } from '../types';
import { memoryProjects } from './ProjectList';
import { 
  ArrowLeft, Save, Printer, Calculator, HardHat, User, 
  MapPin, Calendar, CheckCircle2, AlertCircle, Zap 
} from 'lucide-react';
import { GoogleGenAI } from "@google/genai";

const ProjectDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'overview' | 'survey' | 'calc' | 'quote'>('overview');
  const [project, setProject] = useState<Project | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);

  // Form States
  const [surveyData, setSurveyData] = useState<SurveyData>({
    roofArea: 0,
    roofType: 'Mái tôn',
    azimuth: 'Nam',
    tilt: 15,
    shading: 'Không',
    images: [],
    notes: ''
  });

  const [quoteItems, setQuoteItems] = useState<QuotationItem[]>([
    { id: '1', description: 'Tấm pin NLMT Canadian Solar 550W', quantity: 0, unit: 'Tấm', unitPrice: 2800000, total: 0 },
    { id: '2', description: 'Inverter Huawei 10kW', quantity: 1, unit: 'Cái', unitPrice: 35000000, total: 35000000 },
    { id: '3', description: 'Hệ thống khung giá đỡ', quantity: 1, unit: 'Hệ', unitPrice: 8000000, total: 8000000 },
    { id: '4', description: 'Tủ điện & Cáp DC/AC', quantity: 1, unit: 'Gói', unitPrice: 5000000, total: 5000000 },
    { id: '5', description: 'Nhân công lắp đặt & Vận chuyển', quantity: 1, unit: 'Gói', unitPrice: 12000000, total: 12000000 },
  ]);

  useEffect(() => {
    const found = memoryProjects.find(p => p.id === id);
    if (found) {
      setProject(found);
      // Mock loading existing survey data if any
      if (found.capacityKWp) {
         // Reverse engineering for demo
         setSurveyData(prev => ({ ...prev, roofArea: found.capacityKWp * 6 }));
      }
    }
  }, [id]);

  const handleCalculate = async () => {
    setIsCalculating(true);
    // Mock calculation logic
    setTimeout(() => {
      const estimatedCapacity = Math.floor(surveyData.roofArea / 2.2) * 0.550; // ~2.2m2 per 550W panel
      const panelCount = Math.floor(estimatedCapacity / 0.550);
      
      // Update quote based on calculation
      const newItems = [...quoteItems];
      newItems[0].quantity = panelCount;
      newItems[0].total = panelCount * newItems[0].unitPrice;
      
      // Inverter sizing logic
      let inverterName = 'Inverter Huawei 5kW';
      let inverterPrice = 18000000;
      if (estimatedCapacity > 8) { inverterName = 'Inverter Huawei 10kW'; inverterPrice = 35000000; }
      if (estimatedCapacity > 15) { inverterName = 'Inverter Huawei 20kW'; inverterPrice = 45000000; }
      if (estimatedCapacity > 50) { inverterName = 'Inverter Huawei 50kW'; inverterPrice = 80000000; }

      newItems[1].description = inverterName;
      newItems[1].unitPrice = inverterPrice;
      newItems[1].total = inverterPrice;

      setQuoteItems(newItems);
      setIsCalculating(false);
    }, 1500);
  };

  const totalAmount = quoteItems.reduce((sum, item) => sum + item.total, 0);

  if (!project) return <div>Loading...</div>;

  return (
    <div className="p-8 ml-64 bg-slate-50 min-h-screen flex flex-col">
      {/* Header */}
      <div className="mb-6">
        <button 
          onClick={() => navigate('/projects')}
          className="flex items-center text-slate-500 hover:text-slate-700 mb-2 text-sm font-medium transition-colors"
        >
          <ArrowLeft size={16} className="mr-1" /> Quay lại danh sách
        </button>
        <div className="flex justify-between items-start">
          <div>
            <div className="flex items-center gap-3">
              <h2 className="text-3xl font-bold text-slate-800">{project.name}</h2>
              <span className="px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
                {project.status}
              </span>
            </div>
            <div className="flex items-center text-slate-500 mt-2 gap-4 text-sm">
              <span className="flex items-center"><MapPin size={14} className="mr-1" /> {project.address}</span>
              <span className="flex items-center"><Calendar size={14} className="mr-1" /> {project.startDate}</span>
            </div>
          </div>
          <button className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2.5 rounded-xl font-medium transition-colors shadow-sm flex items-center gap-2">
            <Save size={18} /> Lưu thay đổi
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex space-x-1 bg-white p-1 rounded-xl shadow-sm border border-slate-100 mb-6 w-fit">
        {[
            {id: 'overview', label: 'Tổng quan'},
            {id: 'survey', label: 'Khảo sát'},
            {id: 'calc', label: 'Tính toán & Kỹ thuật'},
            {id: 'quote', label: 'Báo giá'}
        ].map(tab => (
            <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-6 py-2 rounded-lg text-sm font-medium transition-all ${
                    activeTab === tab.id 
                    ? 'bg-slate-100 text-slate-900 shadow-sm' 
                    : 'text-slate-500 hover:text-slate-700'
                }`}
            >
                {tab.label}
            </button>
        ))}
      </div>

      {/* Content Area */}
      <div className="flex-1 bg-white rounded-2xl shadow-sm border border-slate-100 p-8">
        
        {/* OVERVIEW TAB */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-bold text-slate-800 mb-4 border-b pb-2">Thông tin khách hàng</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-500">Tên khách hàng</label>
                  <div className="text-slate-900 font-medium mt-1">{project.customer}</div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-500">Địa chỉ lắp đặt</label>
                  <div className="text-slate-900 mt-1">{project.address}</div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-500">Ngân sách dự kiến</label>
                  <div className="text-slate-900 mt-1">
                    {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(project.budget)}
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-bold text-slate-800 mb-4 border-b pb-2">Phân công nhân sự</h3>
              <div className="space-y-4">
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                  <label className="flex items-center text-sm font-medium text-slate-500 mb-2">
                    <User size={16} className="mr-2 text-blue-500" /> Nhân viên Kinh doanh (Sales)
                  </label>
                  <select 
                    className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-slate-800 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    defaultValue={project.salesRep}
                  >
                    <option value="">Chưa phân công</option>
                    <option value="Trần Thị Hoa">Trần Thị Hoa</option>
                    <option value="Phạm Văn Nam">Phạm Văn Nam</option>
                  </select>
                </div>

                <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                  <label className="flex items-center text-sm font-medium text-slate-500 mb-2">
                    <HardHat size={16} className="mr-2 text-orange-500" /> Nhân viên Khảo sát (Technical)
                  </label>
                  <select 
                    className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-slate-800 focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    defaultValue={project.surveyor}
                  >
                    <option value="">Chưa phân công</option>
                    <option value="Nguyễn Văn Minh">Nguyễn Văn Minh</option>
                    <option value="Lê Văn Hùng">Lê Văn Hùng</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* SURVEY TAB */}
        {activeTab === 'survey' && (
          <div className="max-w-3xl">
            <h3 className="text-lg font-bold text-slate-800 mb-6">Dữ liệu khảo sát hiện trường</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Diện tích mái khả dụng (m²)</label>
                <input 
                  type="number" 
                  value={surveyData.roofArea}
                  onChange={(e) => setSurveyData({...surveyData, roofArea: Number(e.target.value)})}
                  className="w-full border border-slate-200 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Loại mái</label>
                <select 
                  value={surveyData.roofType}
                  onChange={(e) => setSurveyData({...surveyData, roofType: e.target.value as any})}
                  className="w-full border border-slate-200 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                >
                  <option value="Mái tôn">Mái tôn</option>
                  <option value="Mái ngói">Mái ngói</option>
                  <option value="Mái bằng">Mái bằng (Bê tông)</option>
                  <option value="Khác">Khác</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Hướng mái (Azimuth)</label>
                <select 
                  value={surveyData.azimuth}
                  onChange={(e) => setSurveyData({...surveyData, azimuth: e.target.value})}
                  className="w-full border border-slate-200 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                >
                  <option value="Nam">Chính Nam (Tốt nhất)</option>
                  <option value="Đông Nam">Đông Nam</option>
                  <option value="Tây Nam">Tây Nam</option>
                  <option value="Đông">Đông</option>
                  <option value="Tây">Tây</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Độ nghiêng (Độ)</label>
                <input 
                  type="number" 
                  value={surveyData.tilt}
                  onChange={(e) => setSurveyData({...surveyData, tilt: Number(e.target.value)})}
                  className="w-full border border-slate-200 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                />
              </div>
            </div>
            <div className="mb-6">
              <label className="block text-sm font-medium text-slate-700 mb-2">Ghi chú khảo sát & Đổ bóng</label>
              <textarea 
                value={surveyData.notes}
                onChange={(e) => setSurveyData({...surveyData, notes: e.target.value})}
                rows={4}
                placeholder="Mô tả tình trạng mái, vật cản gây bóng che, vị trí đặt Inverter..."
                className="w-full border border-slate-200 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-emerald-500 focus:border-transparent resize-none"
              />
            </div>
            <div className="p-4 bg-slate-50 rounded-xl border border-dashed border-slate-300 text-center cursor-pointer hover:bg-slate-100 transition-colors">
              <p className="text-slate-500">Kéo thả hoặc nhấn để tải lên ảnh khảo sát</p>
            </div>
          </div>
        )}

        {/* CALCULATION TAB */}
        {activeTab === 'calc' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-bold text-slate-800">Tính toán cấu hình hệ thống</h3>
              <button 
                onClick={handleCalculate}
                disabled={isCalculating || surveyData.roofArea === 0}
                className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2.5 rounded-xl font-medium transition-colors shadow-sm flex items-center gap-2 disabled:opacity-50"
              >
                {isCalculating ? <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></div> : <Zap size={18} />}
                <span>Tính toán tự động (AI)</span>
              </button>
            </div>

            {surveyData.roofArea === 0 ? (
              <div className="text-center py-12 bg-slate-50 rounded-xl border border-slate-100">
                <AlertCircle size={32} className="mx-auto text-slate-400 mb-2" />
                <p className="text-slate-500">Vui lòng nhập diện tích mái ở tab "Khảo sát" trước.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Input Parameters Display */}
                <div className="lg:col-span-1 space-y-4">
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                    <h4 className="font-medium text-slate-700 mb-3">Thông số đầu vào</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-slate-500">Diện tích mái:</span>
                        <span className="font-medium text-slate-800">{surveyData.roofArea} m²</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Hướng:</span>
                        <span className="font-medium text-slate-800">{surveyData.azimuth}</span>
                      </div>
                       <div className="flex justify-between">
                        <span className="text-slate-500">Tấm pin sử dụng:</span>
                        <span className="font-medium text-slate-800">550 Wp</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Results */}
                <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-emerald-50 p-6 rounded-2xl border border-emerald-100">
                    <p className="text-emerald-600 text-sm font-medium mb-1">Công suất hệ thống tối đa</p>
                    <h3 className="text-3xl font-bold text-emerald-700">
                      {Math.floor(surveyData.roofArea / 2.2) * 0.55} <span className="text-lg font-normal">kWp</span>
                    </h3>
                    <p className="text-emerald-600/70 text-xs mt-2">Dựa trên mật độ 2.2m²/tấm</p>
                  </div>
                  <div className="bg-blue-50 p-6 rounded-2xl border border-blue-100">
                    <p className="text-blue-600 text-sm font-medium mb-1">Sản lượng điện trung bình tháng</p>
                    <h3 className="text-3xl font-bold text-blue-700">
                      {Math.floor((Math.floor(surveyData.roofArea / 2.2) * 0.55) * 4 * 30)} <span className="text-lg font-normal">kWh</span>
                    </h3>
                     <p className="text-blue-600/70 text-xs mt-2">Hệ số bức xạ trung bình 4h/ngày</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* QUOTATION TAB */}
        {activeTab === 'quote' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-bold text-slate-800">Bảng báo giá chi tiết</h3>
              <div className="flex gap-3">
                <button className="px-4 py-2 border border-slate-200 rounded-lg hover:bg-slate-50 text-slate-600 flex items-center gap-2 text-sm font-medium">
                  <Printer size={16} /> In báo giá
                </button>
                <button className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 flex items-center gap-2 text-sm font-medium">
                  <CheckCircle2 size={16} /> Chốt báo giá
                </button>
              </div>
            </div>

            <div className="border border-slate-200 rounded-xl overflow-hidden mb-6">
              <table className="w-full text-left">
                <thead className="bg-slate-50 text-slate-500 text-sm">
                  <tr>
                    <th className="px-6 py-3 font-medium">STT</th>
                    <th className="px-6 py-3 font-medium">Hạng mục thiết bị</th>
                    <th className="px-6 py-3 font-medium text-center">ĐVT</th>
                    <th className="px-6 py-3 font-medium text-right">Số lượng</th>
                    <th className="px-6 py-3 font-medium text-right">Đơn giá (VNĐ)</th>
                    <th className="px-6 py-3 font-medium text-right">Thành tiền (VNĐ)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {quoteItems.map((item, index) => (
                    <tr key={item.id} className="hover:bg-slate-50">
                      <td className="px-6 py-4 text-slate-500 text-sm">{index + 1}</td>
                      <td className="px-6 py-4 font-medium text-slate-800">{item.description}</td>
                      <td className="px-6 py-4 text-center text-slate-600">{item.unit}</td>
                      <td className="px-6 py-4 text-right">
                        <input 
                          type="number" 
                          value={item.quantity}
                          onChange={(e) => {
                            const newQty = Number(e.target.value);
                            const newItems = [...quoteItems];
                            newItems[index].quantity = newQty;
                            newItems[index].total = newQty * newItems[index].unitPrice;
                            setQuoteItems(newItems);
                          }}
                          className="w-20 text-right border border-slate-200 rounded px-2 py-1 text-sm focus:ring-1 focus:ring-emerald-500"
                        />
                      </td>
                      <td className="px-6 py-4 text-right text-slate-600">
                         {new Intl.NumberFormat('vi-VN').format(item.unitPrice)}
                      </td>
                      <td className="px-6 py-4 text-right font-medium text-slate-800">
                         {new Intl.NumberFormat('vi-VN').format(item.total)}
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot className="bg-slate-50">
                  <tr>
                    <td colSpan={5} className="px-6 py-4 text-right font-bold text-slate-700">Tổng cộng trước thuế:</td>
                    <td className="px-6 py-4 text-right font-bold text-slate-900 text-lg">
                      {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(totalAmount)}
                    </td>
                  </tr>
                   <tr>
                    <td colSpan={5} className="px-6 py-4 text-right font-bold text-slate-700">VAT (8%):</td>
                    <td className="px-6 py-4 text-right font-bold text-slate-900">
                      {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(totalAmount * 0.08)}
                    </td>
                  </tr>
                   <tr>
                    <td colSpan={5} className="px-6 py-4 text-right font-bold text-emerald-700 text-lg">TỔNG THANH TOÁN:</td>
                    <td className="px-6 py-4 text-right font-bold text-emerald-700 text-xl">
                      {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(totalAmount * 1.08)}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default ProjectDetail;