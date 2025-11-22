import React, { useState, useRef, useEffect } from 'react';
import { Employee, EmployeeStatus, RoleLevel, Department, LaborContract, AttendanceSummary, PayrollRecord, BenefitRecord, AttendanceLog, AttendanceMethod } from '../types';
import { Search, UserPlus, Phone, Mail, Briefcase, Filter, Shield, Lock, Check, X, Users, Building, FileText, Clock, DollarSign, Heart, Printer, Camera, MapPin, Fingerprint, XCircle, Loader2, AlertCircle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

// --- Mock Data outside component for persistence ---
const initialEmployees: Employee[] = [
  { id: 'NV001', name: 'Nguyễn Văn Giám Đốc', role: 'Giám đốc điều hành', phone: '0901234567', email: 'ceo@solarops.vn', status: EmployeeStatus.ACTIVE, joinDate: '2022-01-15', level: RoleLevel.EXECUTIVE, department: Department.BOARD },
  { id: 'NV002', name: 'Trần Trưởng Phòng', role: 'Trưởng phòng Kinh doanh', phone: '0902345678', email: 'sm@solarops.vn', status: EmployeeStatus.ACTIVE, joinDate: '2022-03-01', level: RoleLevel.MANAGER, department: Department.SALES },
  { id: 'NV003', name: 'Võ Kỹ Thuật', role: 'Trưởng phòng Kỹ thuật', phone: '0903456789', email: 'tm@solarops.vn', status: EmployeeStatus.ACTIVE, joinDate: '2023-05-20', level: RoleLevel.MANAGER, department: Department.TECHNICAL },
  { id: 'NV004', name: 'Lê Sale Một', role: 'Nhân viên Kinh doanh', phone: '0904567890', email: 's1@solarops.vn', status: EmployeeStatus.ACTIVE, joinDate: '2023-06-15', level: RoleLevel.STAFF, department: Department.SALES },
  { id: 'NV005', name: 'Đặng Kế Toán', role: 'Kế toán trưởng', phone: '0905678901', email: 'ac@solarops.vn', status: EmployeeStatus.ACTIVE, joinDate: '2022-02-10', level: RoleLevel.MANAGER, department: Department.FINANCE },
  { id: 'NV006', name: 'Ngô Nhân Sự', role: 'Chuyên viên nhân sự', phone: '0906789012', email: 'hr@solarops.vn', status: EmployeeStatus.ACTIVE, joinDate: '2023-01-10', level: RoleLevel.MANAGER, department: Department.HR },
  // Adding mock user for logged in staff context if needed
  { id: 'U_S1', name: 'Lê Sale Một', role: 'Nhân viên Kinh doanh', phone: '0904567890', email: 's1@solarops.vn', status: EmployeeStatus.ACTIVE, joinDate: '2023-06-15', level: RoleLevel.STAFF, department: Department.SALES },
];

// Memory Store
let memoryEmployees = [...initialEmployees];

const mockContracts: LaborContract[] = [
  { id: 'HD001', employeeId: 'NV001', type: 'Không thời hạn', startDate: '2022-01-15', salary: 50000000, status: 'Hiệu lực' },
  { id: 'HD002', employeeId: 'NV002', type: 'Có thời hạn', startDate: '2022-03-01', endDate: '2024-03-01', salary: 30000000, status: 'Hiệu lực' },
  { id: 'HD003', employeeId: 'NV003', type: 'Có thời hạn', startDate: '2023-05-20', endDate: '2024-05-20', salary: 28000000, status: 'Hiệu lực' },
  { id: 'HD004', employeeId: 'NV004', type: 'Thử việc', startDate: '2023-10-01', endDate: '2023-11-30', salary: 8000000, status: 'Hiệu lực' },
  { id: 'HD004', employeeId: 'U_S1', type: 'Thử việc', startDate: '2023-10-01', endDate: '2023-11-30', salary: 8000000, status: 'Hiệu lực' },
];

const mockAttendance: AttendanceSummary[] = [
  { id: 'CC001', employeeId: 'NV001', month: '10/2023', standardDays: 26, actualDays: 26, lateHours: 0, overtimeHours: 10, leaveDays: 0 },
  { id: 'CC002', employeeId: 'NV002', month: '10/2023', standardDays: 26, actualDays: 25, lateHours: 0.5, overtimeHours: 4, leaveDays: 1 },
  { id: 'CC003', employeeId: 'NV003', month: '10/2023', standardDays: 26, actualDays: 26, lateHours: 0, overtimeHours: 20, leaveDays: 0 },
  { id: 'CC004', employeeId: 'U_S1', month: '10/2023', standardDays: 26, actualDays: 24, lateHours: 2, overtimeHours: 0, leaveDays: 2 },
  { id: 'CC005', employeeId: 'NV005', month: '10/2023', standardDays: 26, actualDays: 26, lateHours: 0, overtimeHours: 5, leaveDays: 0 },
  { id: 'CC006', employeeId: 'NV006', month: '10/2023', standardDays: 26, actualDays: 26, lateHours: 0, overtimeHours: 0, leaveDays: 0 },
];

const mockLogs: AttendanceLog[] = [
  { id: 'LG1', employeeId: 'NV003', timestamp: new Date(Date.now() - 86400000 + 28800000).toISOString(), type: 'CHECK_IN', method: AttendanceMethod.GPS_PHOTO, location: '10.762, 106.660 (Công trình Quận 10)', isValid: true, imageUrl: 'https://images.unsplash.com/photo-1581092918056-0c4c3acd9009?q=80&w=2070&auto=format&fit=crop' },
  { id: 'LG2', employeeId: 'U_S1', timestamp: new Date(Date.now() - 28800000).toISOString(), type: 'CHECK_IN', method: AttendanceMethod.FINGERPRINT, location: 'Văn phòng chính', isValid: true },
];

const mockPayroll: PayrollRecord[] = [
  { id: 'PL001', employeeId: 'NV001', month: '09/2023', basicSalary: 50000000, allowances: 5000000, bonus: 2000000, deductions: 3000000, netSalary: 54000000, status: 'Đã thanh toán' },
  { id: 'PL002', employeeId: 'NV002', month: '09/2023', basicSalary: 30000000, allowances: 3000000, bonus: 5000000, deductions: 2000000, netSalary: 36000000, status: 'Đã thanh toán' },
  { id: 'PL003', employeeId: 'NV003', month: '09/2023', basicSalary: 28000000, allowances: 2000000, bonus: 1000000, deductions: 1500000, netSalary: 29500000, status: 'Đã thanh toán' },
  { id: 'PL004', employeeId: 'U_S1', month: '09/2023', basicSalary: 8000000, allowances: 1000000, bonus: 200000, deductions: 0, netSalary: 9200000, status: 'Đã thanh toán' },
];

const mockBenefits: BenefitRecord[] = [
  { id: 'BF001', employeeId: 'NV001', socialInsurance: true, healthInsurance: true, welfare: ['Cơm trưa', 'Xăng xe', 'Điện thoại', 'Gym'] },
  { id: 'BF002', employeeId: 'NV002', socialInsurance: true, healthInsurance: true, welfare: ['Cơm trưa', 'Xăng xe', 'Điện thoại'] },
  { id: 'BF003', employeeId: 'NV003', socialInsurance: true, healthInsurance: true, welfare: ['Cơm trưa', 'Xăng xe', 'Điện thoại', 'Bảo hiểm tai nạn'] },
  { id: 'BF004', employeeId: 'U_S1', socialInsurance: false, healthInsurance: false, welfare: ['Cơm trưa'] },
];

// --- Helper Components ---

const StatusBadge: React.FC<{ status: EmployeeStatus }> = ({ status }) => {
  const styles: Record<EmployeeStatus, string> = {
    [EmployeeStatus.ACTIVE]: 'bg-emerald-50 text-emerald-700 border-emerald-100',
    [EmployeeStatus.ON_LEAVE]: 'bg-yellow-50 text-yellow-700 border-yellow-100',
    [EmployeeStatus.RESIGNED]: 'bg-slate-100 text-slate-600 border-slate-200',
  };
  return <span className={`px-3 py-1 rounded-full text-xs font-medium border ${styles[status]}`}>{status}</span>;
};

const PermissionMatrix = () => {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr>
            <th className="p-4 border-b-2 border-slate-200 bg-slate-50 font-bold text-slate-700">Phạm vi quyền hạn</th>
            <th className="p-4 border-b-2 border-slate-200 bg-slate-50 text-center font-bold text-red-600">Ban điều hành (Executive)</th>
            <th className="p-4 border-b-2 border-slate-200 bg-slate-50 text-center font-bold text-purple-600">Cấp quản lý (Manager)</th>
            <th className="p-4 border-b-2 border-slate-200 bg-slate-50 text-center font-bold text-blue-600">Cấp nhân viên (Staff)</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 text-sm">
          <tr className="hover:bg-slate-50">
            <td className="p-4 font-medium text-slate-800">Truy cập Module</td>
            <td className="p-4 text-center">Tất cả Module</td>
            <td className="p-4 text-center">Chỉ Module thuộc Phòng ban quản lý</td>
            <td className="p-4 text-center">Chỉ Module thuộc Phòng ban</td>
          </tr>
          <tr className="hover:bg-slate-50">
            <td className="p-4 font-medium text-slate-800">Xem dữ liệu</td>
            <td className="p-4 text-center">Toàn bộ dữ liệu công ty</td>
            <td className="p-4 text-center">Toàn bộ dữ liệu của Phòng ban</td>
            <td className="p-4 text-center">Chỉ dữ liệu của cá nhân hoặc được gán</td>
          </tr>
          <tr className="hover:bg-slate-50">
            <td className="p-4 font-medium text-slate-800">Sửa/Xóa dữ liệu</td>
            <td className="p-4 text-center">Toàn quyền</td>
            <td className="p-4 text-center">Toàn quyền trong Phòng ban</td>
            <td className="p-4 text-center">Chỉ sửa được dữ liệu của mình</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

const CameraModal: React.FC<{ onClose: () => void, onCapture: (img: string) => void }> = ({ onClose, onCapture }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [error, setError] = useState('');
  const [capturing, setCapturing] = useState(false);

  useEffect(() => {
    const startCamera = async () => {
      try {
        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
             throw new Error('Trình duyệt không hỗ trợ truy cập camera.');
        }
        const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' } });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (err: any) {
        let msg = 'Không thể truy cập camera.';
        if (err.name === 'NotAllowedError') msg = 'Quyền truy cập camera bị từ chối. Vui lòng kiểm tra cài đặt trình duyệt.';
        if (err.name === 'NotFoundError') msg = 'Không tìm thấy thiết bị camera trên máy tính này.';
        if (err.name === 'NotReadableError') msg = 'Camera đang được sử dụng bởi ứng dụng khác.';
        
        console.error('Camera Error:', err);
        setError(msg);
      }
    };
    startCamera();

    return () => {
      // Cleanup stream
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const handleCapture = () => {
    setCapturing(true);
    if (videoRef.current) {
      const canvas = document.createElement('canvas');
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        // Mirror the image
        ctx.translate(canvas.width, 0);
        ctx.scale(-1, 1);
        ctx.drawImage(videoRef.current, 0, 0);
        ctx.setTransform(1, 0, 0, 1, 0, 0); // Reset transform
        
        // --- WATERMARK LOGIC ---
        const now = new Date();
        const dateStr = now.toLocaleDateString('vi-VN');
        const timeStr = now.toLocaleTimeString('vi-VN');
        
        // Background for text
        ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
        ctx.fillRect(10, canvas.height - 90, 280, 80);
        
        // Text
        ctx.font = "bold 24px Arial";
        ctx.fillStyle = "#10b981"; // Emerald color
        ctx.fillText(timeStr, 30, canvas.height - 55);
        ctx.font = "18px Arial";
        ctx.fillStyle = "white";
        ctx.fillText(dateStr, 30, canvas.height - 25);
        ctx.font = "14px Arial";
        ctx.fillText("SolarOps Check-in", 150, canvas.height - 55);
        // -----------------------

        const dataUrl = canvas.toDataURL('image/jpeg');
        setTimeout(() => {
            onCapture(dataUrl);
            setCapturing(false);
        }, 500);
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/90 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-lg bg-white rounded-2xl overflow-hidden shadow-2xl">
        <div className="p-4 bg-slate-900 text-white flex justify-between items-center">
          <h3 className="font-bold flex items-center gap-2"><Camera size={20}/> Chấm công hình ảnh</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-white"><X size={24}/></button>
        </div>
        <div className="relative bg-black aspect-video flex items-center justify-center overflow-hidden">
          {error ? (
            <div className="flex flex-col items-center justify-center p-6 text-center">
                <AlertCircle size={48} className="text-red-500 mb-3" />
                <p className="text-red-500 font-medium">{error}</p>
                <p className="text-slate-400 text-sm mt-2">Vui lòng kiểm tra kết nối camera và thử lại.</p>
            </div>
          ) : (
            <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover transform scale-x-[-1]" />
          )}
          {/* Overlay Target Box */}
          {!error && (
            <div className="absolute inset-0 border-2 border-white/30 m-8 rounded-lg pointer-events-none flex items-center justify-center">
               <div className="w-40 h-56 border-2 border-emerald-500/50 rounded-full"></div>
            </div>
          )}
        </div>
        <div className="p-6 flex justify-center bg-slate-900">
          {!error && (
             <button 
                onClick={handleCapture}
                disabled={capturing}
                className="w-16 h-16 rounded-full bg-white border-4 border-slate-300 hover:border-emerald-500 hover:scale-105 transition-all flex items-center justify-center disabled:opacity-50 disabled:scale-100"
              >
                {capturing ? (
                    <Loader2 className="animate-spin text-emerald-600" size={24}/>
                ) : (
                    <div className="w-12 h-12 rounded-full bg-red-500"></div>
                )}
              </button>
          )}
          {error && (
             <button onClick={onClose} className="px-4 py-2 bg-slate-700 text-white rounded-lg hover:bg-slate-600">
                 Đóng
             </button>
          )}
        </div>
        <div className="px-4 py-2 bg-slate-100 text-xs text-center text-slate-500">
            Hình ảnh sẽ được tự động gắn nhãn thời gian để xác thực.
        </div>
      </div>
    </div>
  );
};

const HR: React.FC = () => {
  const { user, checkAccess } = useAuth();
  
  // Determine View Mode
  const isHRAdmin = checkAccess([Department.BOARD, Department.HR]);
  
  const [activeTab, setActiveTab] = useState<'employees' | 'contracts' | 'attendance' | 'payroll' | 'benefits' | 'permissions'>(
    isHRAdmin ? 'employees' : 'attendance'
  );
  
  const [searchTerm, setSearchTerm] = useState('');
  const [employeeData, setEmployeeData] = useState(memoryEmployees);
  const [attendanceLogs, setAttendanceLogs] = useState<AttendanceLog[]>(mockLogs);
  
  // Check-in States
  const [showCamera, setShowCamera] = useState(false);
  const [isCheckingIn, setIsCheckingIn] = useState(false);
  const [locationLoading, setLocationLoading] = useState(false);

  // Add Employee Modal State
  const [showAddModal, setShowAddModal] = useState(false);
  const [newEmp, setNewEmp] = useState<Partial<Employee>>({
    name: '',
    role: '',
    email: '',
    phone: '',
    department: Department.SALES,
    level: RoleLevel.STAFF
  });

  const handleAddEmployee = (e: React.FormEvent) => {
    e.preventDefault();
    const employeeToAdd: Employee = {
        id: `NV${Date.now()}`,
        name: newEmp.name || 'Nhân viên mới',
        role: newEmp.role || 'Nhân viên',
        email: newEmp.email || '',
        phone: newEmp.phone || '',
        status: EmployeeStatus.ACTIVE,
        joinDate: new Date().toISOString().split('T')[0],
        level: newEmp.level || RoleLevel.STAFF,
        department: newEmp.department || Department.SALES
    };
    
    memoryEmployees = [...memoryEmployees, employeeToAdd];
    setEmployeeData(memoryEmployees);
    setShowAddModal(false);
    setNewEmp({ name: '', role: '', email: '', phone: '', department: Department.SALES, level: RoleLevel.STAFF });
  };

  // Filter Data based on Role
  // If Admin: Show all. If Staff: Show only own data.
  const displayEmployees = isHRAdmin ? employeeData : employeeData.filter(e => e.id === user?.id);
  const displayContracts = isHRAdmin ? mockContracts : mockContracts.filter(c => c.employeeId === user?.id);
  const displayAttendance = isHRAdmin ? mockAttendance : mockAttendance.filter(a => a.employeeId === user?.id);
  const displayPayroll = isHRAdmin ? mockPayroll : mockPayroll.filter(p => p.employeeId === user?.id);
  const displayBenefits = isHRAdmin ? mockBenefits : mockBenefits.filter(b => b.employeeId === user?.id);
  const displayLogs = isHRAdmin ? attendanceLogs : attendanceLogs.filter(l => l.employeeId === user?.id);

  const filteredEmployees = displayEmployees.filter(emp =>
    emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    emp.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getEmployeeName = (id: string) => {
      const allEmps = memoryEmployees;
      return allEmps.find(e => e.id === id)?.name || id;
  };
  const getEmployeeRole = (id: string) => {
       const allEmps = memoryEmployees;
      return allEmps.find(e => e.id === id)?.role || '';
  };

  const handleLevelChange = (id: string, newLevel: RoleLevel) => {
    const updated = employeeData.map(emp => emp.id === id ? { ...emp, level: newLevel } : emp);
    setEmployeeData(updated);
    memoryEmployees = updated;
  };
  
  const handleDeptChange = (id: string, newDept: Department) => {
    const updated = employeeData.map(emp => emp.id === id ? { ...emp, department: newDept } : emp);
    setEmployeeData(updated);
    memoryEmployees = updated;
  };

  const formatCurrency = (amount: number) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);

  // --- Attendance Logic ---

  const addAttendanceLog = (method: AttendanceMethod, imageUrl?: string, location?: string) => {
    const newLog: AttendanceLog = {
      id: `LG${Date.now()}`,
      employeeId: user?.id || 'GUEST',
      timestamp: new Date().toISOString(),
      type: 'CHECK_IN', // Simplified logic
      method: method,
      imageUrl: imageUrl,
      location: location,
      isValid: true
    };
    setAttendanceLogs(prev => [newLog, ...prev]);
    
    // Show success message
    alert(`Chấm công thành công!\nPhương thức: ${method}\nĐịa điểm: ${location}`);
  };

  const handleFingerprintCheckin = () => {
    setIsCheckingIn(true);
    // Simulate connection to fingerprint device
    setTimeout(() => {
      addAttendanceLog(AttendanceMethod.FINGERPRINT, undefined, 'Văn phòng chính (IP: 192.168.1.10)');
      setIsCheckingIn(false);
    }, 1500);
  };

  const handlePhotoCheckin = (dataUrl: string) => {
    setShowCamera(false);
    setLocationLoading(true);

    // Real Geolocation API
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          const locStr = `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`;
          addAttendanceLog(AttendanceMethod.GPS_PHOTO, dataUrl, locStr);
          setLocationLoading(false);
        },
        (error) => {
          console.error("Lỗi lấy vị trí:", error);
          // Fallback if GPS fails but photo is taken
          let errorMsg = "Không định vị được";
          if (error.code === error.PERMISSION_DENIED) errorMsg = "Từ chối quyền GPS";
          addAttendanceLog(AttendanceMethod.GPS_PHOTO, dataUrl, errorMsg);
          setLocationLoading(false);
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
      );
    } else {
       addAttendanceLog(AttendanceMethod.GPS_PHOTO, dataUrl, "Trình duyệt không hỗ trợ GPS");
       setLocationLoading(false);
    }
  };

  const TabButton = ({ id, label, icon: Icon }: { id: typeof activeTab, label: string, icon: any }) => (
    <button
      onClick={() => setActiveTab(id)}
      className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 whitespace-nowrap ${
        activeTab === id ? 'bg-emerald-50 text-emerald-700 shadow-sm' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50'
      }`}
    >
      <Icon size={18} /> {label}
    </button>
  );

  return (
    <div className="p-8 ml-64 bg-slate-50 min-h-screen">
      {showCamera && (
        <CameraModal 
          onClose={() => setShowCamera(false)} 
          onCapture={handlePhotoCheckin} 
        />
      )}
      
      {/* Overlay Loading for Location */}
      {locationLoading && (
        <div className="fixed inset-0 z-[60] bg-black/50 flex flex-col items-center justify-center text-white">
            <Loader2 size={48} className="animate-spin mb-4" />
            <p className="font-bold">Đang xác định vị trí...</p>
            <p className="text-sm opacity-80">Vui lòng giữ kết nối mạng</p>
        </div>
      )}

      <header className="mb-8 flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-slate-800">
             {isHRAdmin ? 'Quản Trị Nguồn Nhân Lực' : 'Thông Tin Nhân Sự & Chấm Công'}
          </h2>
          <p className="text-slate-500 mt-1">
             {isHRAdmin ? 'Quản lý hồ sơ, lương thưởng và phúc lợi nhân viên.' : 'Quản lý chấm công và xem phiếu lương cá nhân.'}
          </p>
        </div>
        {isHRAdmin && (
            <button 
                onClick={() => setShowAddModal(true)}
                className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2.5 rounded-xl font-medium transition-colors shadow-sm flex items-center gap-2"
            >
                <UserPlus size={20} />
                <span>+ Thêm nhân viên</span>
            </button>
        )}
      </header>

      {/* Tabs Navigation */}
      <div className="flex overflow-x-auto gap-2 bg-white p-2 rounded-xl shadow-sm border border-slate-100 mb-6">
        {isHRAdmin && <TabButton id="employees" label="Danh sách nhân sự" icon={Users} />}
        {isHRAdmin && <TabButton id="contracts" label="Hợp đồng lao động" icon={FileText} />}
        <TabButton id="attendance" label="Chấm công" icon={Clock} />
        <TabButton id="payroll" label="Lương thưởng" icon={DollarSign} />
        <TabButton id="benefits" label="Chế độ & Bảo hiểm" icon={Heart} />
        {isHRAdmin && <TabButton id="permissions" label="Phân quyền" icon={Shield} />}
      </div>

      {/* TAB CONTENT */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden min-h-[500px]">
        
        {/* 1. EMPLOYEES TAB (Admin only) */}
        {activeTab === 'employees' && isHRAdmin && (
          <>
            <div className="p-4 border-b border-slate-100 flex gap-4 items-center justify-between">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={20} />
                <input 
                  type="text" 
                  placeholder="Tìm kiếm nhân viên..." 
                  className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <table className="w-full text-left">
              <thead className="bg-slate-50 text-slate-500 text-sm">
                <tr>
                  <th className="px-6 py-4 font-medium">Nhân viên</th>
                  <th className="px-6 py-4 font-medium">Liên hệ</th>
                  <th className="px-6 py-4 font-medium">Trạng thái</th>
                  <th className="px-6 py-4 font-medium">Level</th>
                  <th className="px-6 py-4 font-medium">Phòng ban</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredEmployees.map((emp) => (
                  <tr key={emp.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center font-bold">
                          {emp.name.split(' ').pop()?.charAt(0)}
                        </div>
                        <div>
                          <div className="font-medium text-slate-800">{emp.name}</div>
                          <div className="text-xs text-slate-500">{emp.role}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-slate-600 flex items-center gap-2"><Phone size={12}/> {emp.phone}</div>
                      <div className="text-sm text-slate-600 flex items-center gap-2"><Mail size={12}/> {emp.email}</div>
                    </td>
                    <td className="px-6 py-4"><StatusBadge status={emp.status} /></td>
                    <td className="px-6 py-4">
                       <select 
                        value={emp.level}
                        onChange={(e) => handleLevelChange(emp.id, e.target.value as RoleLevel)}
                        className="bg-white border border-slate-200 text-xs rounded px-2 py-1 focus:ring-emerald-500"
                      >
                        {Object.values(RoleLevel).map(l => <option key={l} value={l}>{l}</option>)}
                      </select>
                    </td>
                    <td className="px-6 py-4">
                      <select 
                          value={emp.department}
                          onChange={(e) => handleDeptChange(emp.id, e.target.value as Department)}
                          className="bg-white border border-slate-200 text-xs rounded px-2 py-1 focus:ring-emerald-500"
                      >
                          {Object.values(Department).map(d => <option key={d} value={d}>{d}</option>)}
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        )}

        {/* 2. CONTRACTS TAB (Admin only) */}
        {activeTab === 'contracts' && isHRAdmin && (
          <table className="w-full text-left">
            <thead className="bg-slate-50 text-slate-500 text-sm">
              <tr>
                <th className="px-6 py-4 font-medium">Mã HĐ</th>
                <th className="px-6 py-4 font-medium">Nhân viên</th>
                <th className="px-6 py-4 font-medium">Loại hợp đồng</th>
                <th className="px-6 py-4 font-medium">Hiệu lực từ</th>
                <th className="px-6 py-4 font-medium">Đến ngày</th>
                <th className="px-6 py-4 font-medium">Lương cơ bản</th>
                <th className="px-6 py-4 font-medium">Trạng thái</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {displayContracts.map((contract) => (
                <tr key={contract.id} className="hover:bg-slate-50">
                  <td className="px-6 py-4 text-sm font-mono text-slate-500">{contract.id}</td>
                  <td className="px-6 py-4 font-medium text-slate-800">{getEmployeeName(contract.employeeId)}</td>
                  <td className="px-6 py-4 text-slate-600">{contract.type}</td>
                  <td className="px-6 py-4 text-slate-600">{contract.startDate}</td>
                  <td className="px-6 py-4 text-slate-600">{contract.endDate || '---'}</td>
                  <td className="px-6 py-4 font-medium text-slate-800">{formatCurrency(contract.salary)}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${contract.status === 'Hiệu lực' ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-600'}`}>
                      {contract.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {/* 3. ATTENDANCE TAB (Shared) */}
        {activeTab === 'attendance' && (
          <div className="flex flex-col h-full">
            {/* Time Clock Section - Available to everyone */}
            <div className="p-6 bg-gradient-to-r from-slate-50 to-white border-b border-slate-200">
               <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                  <div>
                    <h3 className="text-xl font-bold text-slate-800">
                        Xin chào, {user?.name}
                    </h3>
                    <p className="text-slate-500 text-sm mt-1">
                      {new Date().toLocaleDateString('vi-VN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                    </p>
                  </div>
                  
                  <div className="flex gap-4">
                    {/* Fingerprint Button (Office) */}
                    <button 
                      onClick={handleFingerprintCheckin}
                      disabled={isCheckingIn}
                      className="group flex flex-col items-center justify-center w-32 h-32 bg-white border-2 border-slate-200 rounded-2xl hover:border-blue-500 hover:bg-blue-50 transition-all shadow-sm active:scale-95"
                    >
                      <div className={`p-3 rounded-full mb-2 transition-colors ${isCheckingIn ? 'bg-blue-100 text-blue-600' : 'bg-slate-100 text-slate-600 group-hover:bg-blue-100 group-hover:text-blue-600'}`}>
                        {isCheckingIn ? <div className="animate-spin h-6 w-6 border-2 border-blue-600 rounded-full border-t-transparent"></div> : <Fingerprint size={28} />}
                      </div>
                      <span className="text-xs font-bold text-slate-700">Vân tay</span>
                      <span className="text-[10px] text-slate-400 mt-1">Văn phòng</span>
                    </button>

                    {/* Camera Button (Field) */}
                    <button 
                      onClick={() => setShowCamera(true)}
                      className="group flex flex-col items-center justify-center w-32 h-32 bg-white border-2 border-slate-200 rounded-2xl hover:border-emerald-500 hover:bg-emerald-50 transition-all shadow-sm active:scale-95"
                    >
                      <div className="p-3 rounded-full bg-slate-100 text-slate-600 mb-2 group-hover:bg-emerald-100 group-hover:text-emerald-600 transition-colors">
                        <Camera size={28} />
                      </div>
                      <span className="text-xs font-bold text-slate-700">Hình ảnh</span>
                      <span className="text-[10px] text-slate-400 mt-1">Công trình/Ngoài trời</span>
                    </button>
                  </div>
               </div>
            </div>

            {/* Logs & Summary Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 divide-y lg:divide-y-0 lg:divide-x divide-slate-100">
              
              {/* Left: Daily Logs */}
              <div className="lg:col-span-1 p-6 bg-slate-50/50">
                <h4 className="font-bold text-slate-700 mb-4 flex items-center gap-2">
                  <Clock size={18} /> Nhật ký hôm nay
                </h4>
                {displayLogs.length === 0 && <p className="text-slate-500 text-sm italic">Chưa có dữ liệu chấm công.</p>}
                <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2">
                  {displayLogs.map(log => (
                    <div key={log.id} className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm flex gap-4">
                      {log.method === AttendanceMethod.GPS_PHOTO && log.imageUrl ? (
                        <div className="w-16 h-16 rounded-lg bg-slate-100 overflow-hidden flex-shrink-0 border border-slate-200 group relative">
                          <img src={log.imageUrl} alt="Check-in" className="w-full h-full object-cover" />
                          <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-all"></div>
                        </div>
                      ) : (
                        <div className="w-16 h-16 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center flex-shrink-0 border border-blue-100">
                           <Fingerprint size={32} />
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start">
                          <p className="font-bold text-slate-800 text-sm truncate">{getEmployeeName(log.employeeId)}</p>
                          <span className="text-xs font-mono text-slate-500">
                            {new Date(log.timestamp).toLocaleTimeString('vi-VN', {hour: '2-digit', minute:'2-digit'})}
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 mt-1 flex items-center gap-1">
                          {log.method === AttendanceMethod.GPS_PHOTO ? <MapPin size={10}/> : <Building size={10}/>}
                          {log.location}
                        </p>
                        <div className="mt-2 flex gap-2">
                          <span className="px-2 py-0.5 bg-emerald-100 text-emerald-700 text-[10px] rounded-full font-medium border border-emerald-200">
                            {log.type}
                          </span>
                          <span className="px-2 py-0.5 bg-slate-100 text-slate-600 text-[10px] rounded-full font-medium border border-slate-200">
                            {log.method}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right: Monthly Summary Table */}
              <div className="lg:col-span-2 p-0">
                 <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/30">
                   <h3 className="font-bold text-slate-700">Tổng hợp công tháng 10/2023</h3>
                   {isHRAdmin && <button className="text-emerald-600 text-sm font-medium hover:underline">Xuất báo cáo</button>}
                </div>
                <table className="w-full text-left">
                  <thead className="bg-slate-50 text-slate-500 text-sm">
                    <tr>
                      <th className="px-6 py-4 font-medium">Nhân viên</th>
                      <th className="px-6 py-4 font-medium text-center">Công chuẩn</th>
                      <th className="px-6 py-4 font-medium text-center">Thực tế</th>
                      <th className="px-6 py-4 font-medium text-center">Đi muộn</th>
                      <th className="px-6 py-4 font-medium text-center">Tăng ca</th>
                      <th className="px-6 py-4 font-medium text-center">Nghỉ phép</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {displayAttendance.map((att) => (
                      <tr key={att.id} className="hover:bg-slate-50">
                        <td className="px-6 py-4">
                          <div className="font-medium text-slate-800">{getEmployeeName(att.employeeId)}</div>
                          <div className="text-xs text-slate-500">{getEmployeeRole(att.employeeId)}</div>
                        </td>
                        <td className="px-6 py-4 text-center text-slate-600">{att.standardDays}</td>
                        <td className="px-6 py-4 text-center font-bold text-emerald-600">{att.actualDays}</td>
                        <td className="px-6 py-4 text-center text-slate-600">{att.lateHours > 0 ? <span className="text-red-500 font-medium">{att.lateHours}h</span> : '-'}</td>
                        <td className="px-6 py-4 text-center text-slate-600">{att.overtimeHours > 0 ? <span className="text-blue-600 font-medium">{att.overtimeHours}h</span> : '-'}</td>
                        <td className="px-6 py-4 text-center text-slate-600">{att.leaveDays}</td>
                      </tr>
                    ))}
                    {displayAttendance.length === 0 && (
                        <tr><td colSpan={6} className="p-6 text-center text-slate-500">Không có dữ liệu chấm công.</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* 4. PAYROLL TAB (Shared) */}
        {activeTab === 'payroll' && (
          <div>
             <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
               <h3 className="font-bold text-slate-700">Bảng lương tháng 09/2023</h3>
               <div className="flex gap-2">
                  {isHRAdmin && <span className="px-3 py-1 bg-emerald-100 text-emerald-700 text-xs rounded-full font-bold uppercase">Tổng chi: {formatCurrency(displayPayroll.reduce((acc, cur) => acc + cur.netSalary, 0))}</span>}
                  <button className="flex items-center gap-1 text-slate-600 text-sm hover:text-emerald-600"><Printer size={14}/> In phiếu lương</button>
               </div>
            </div>
            <table className="w-full text-left">
              <thead className="bg-slate-50 text-slate-500 text-sm">
                <tr>
                  <th className="px-4 py-4 font-medium">Nhân viên</th>
                  <th className="px-4 py-4 font-medium text-right">Lương cơ bản</th>
                  <th className="px-4 py-4 font-medium text-right">Phụ cấp</th>
                  <th className="px-4 py-4 font-medium text-right">Thưởng</th>
                  <th className="px-4 py-4 font-medium text-right">Khấu trừ</th>
                  <th className="px-4 py-4 font-medium text-right">Thực lĩnh</th>
                  <th className="px-4 py-4 font-medium text-center">Trạng thái</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {displayPayroll.map((pay) => (
                  <tr key={pay.id} className="hover:bg-slate-50">
                    <td className="px-4 py-4 font-medium text-slate-800">{getEmployeeName(pay.employeeId)}</td>
                    <td className="px-4 py-4 text-right text-slate-600">{formatCurrency(pay.basicSalary)}</td>
                    <td className="px-4 py-4 text-right text-slate-600">{formatCurrency(pay.allowances)}</td>
                    <td className="px-4 py-4 text-right text-emerald-600">+{formatCurrency(pay.bonus)}</td>
                    <td className="px-4 py-4 text-right text-red-500">-{formatCurrency(pay.deductions)}</td>
                    <td className="px-4 py-4 text-right font-bold text-slate-900">{formatCurrency(pay.netSalary)}</td>
                    <td className="px-4 py-4 text-center">
                      <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">{pay.status}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* 5. BENEFITS TAB (Shared) */}
        {activeTab === 'benefits' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
            {displayBenefits.map((benefit) => (
              <div key={benefit.id} className="bg-white border border-slate-200 rounded-xl p-5 hover:shadow-md transition-shadow">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                    {getEmployeeName(benefit.employeeId).split(' ').pop()?.charAt(0)}
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-800">{getEmployeeName(benefit.employeeId)}</h4>
                    <p className="text-xs text-slate-500">{getEmployeeRole(benefit.employeeId)}</p>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div className="flex justify-between items-center p-2 bg-slate-50 rounded-lg">
                    <span className="text-sm text-slate-600">BHXH & BHYT</span>
                    {benefit.socialInsurance ? (
                      <Check size={18} className="text-emerald-500" />
                    ) : (
                      <X size={18} className="text-slate-300" />
                    )}
                  </div>
                  
                  <div>
                    <p className="text-xs font-medium text-slate-500 mb-2 uppercase tracking-wider">Phúc lợi khác</p>
                    <div className="flex flex-wrap gap-2">
                      {benefit.welfare.map((w, idx) => (
                        <span key={idx} className="px-2 py-1 bg-purple-50 text-purple-700 text-xs rounded border border-purple-100">
                          {w}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* 6. PERMISSIONS TAB (Admin only) */}
        {activeTab === 'permissions' && isHRAdmin && (
          <div className="p-8">
             <div className="mb-8 text-center">
                <h3 className="text-xl font-bold text-slate-800">Chính sách phân quyền hệ thống</h3>
                <p className="text-slate-500">Hệ thống sử dụng mô hình RBAC 3 cấp độ kết hợp với quản lý theo phòng ban.</p>
            </div>
            <PermissionMatrix />
          </div>
        )}

      </div>
      
      {/* Add Employee Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <h3 className="text-lg font-bold text-slate-800">Thêm Nhân Viên Mới</h3>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-slate-600">
                <X size={24} />
              </button>
            </div>
            <form onSubmit={handleAddEmployee} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">Họ và tên <span className="text-red-500">*</span></label>
                  <input 
                    required
                    type="text" 
                    value={newEmp.name}
                    onChange={(e) => setNewEmp({...newEmp, name: e.target.value})}
                    className="w-full border border-slate-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-emerald-500 outline-none"
                    placeholder="Nguyễn Văn A"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">Chức danh (Job Title)</label>
                  <input 
                    required
                    type="text" 
                    value={newEmp.role}
                    onChange={(e) => setNewEmp({...newEmp, role: e.target.value})}
                    className="w-full border border-slate-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-emerald-500 outline-none"
                    placeholder="VD: Nhân viên kỹ thuật"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">Email</label>
                  <input 
                    type="email" 
                    value={newEmp.email}
                    onChange={(e) => setNewEmp({...newEmp, email: e.target.value})}
                    className="w-full border border-slate-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-emerald-500 outline-none"
                    placeholder="email@solarops.vn"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">Số điện thoại</label>
                  <input 
                    type="tel" 
                    value={newEmp.phone}
                    onChange={(e) => setNewEmp({...newEmp, phone: e.target.value})}
                    className="w-full border border-slate-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-emerald-500 outline-none"
                    placeholder="090..."
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">Phòng ban</label>
                  <select 
                    value={newEmp.department}
                    onChange={(e) => setNewEmp({...newEmp, department: e.target.value as Department})}
                    className="w-full border border-slate-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-emerald-500 outline-none"
                  >
                    {Object.values(Department).map(d => (
                        <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">Cấp độ (Role Level)</label>
                  <select 
                    value={newEmp.level}
                    onChange={(e) => setNewEmp({...newEmp, level: e.target.value as RoleLevel})}
                    className="w-full border border-slate-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-emerald-500 outline-none"
                  >
                    {Object.values(RoleLevel).map(l => (
                        <option key={l} value={l}>{l}</option>
                    ))}
                  </select>
                </div>
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
                  Tạo nhân viên
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default HR;