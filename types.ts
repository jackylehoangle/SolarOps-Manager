import React from 'react';

export enum ProjectStatus {
  SURVEY = 'Khảo sát',
  DESIGN = 'Thiết kế',
  PERMITTING = 'Xin phép',
  INSTALLATION = 'Thi công',
  GRID_CONNECTION = 'Đấu nối',
  COMPLETED = 'Hoàn thành'
}

export enum LeadStatus {
  NEW = 'Mới',
  CONTACTED = 'Đã liên hệ',
  SURVEY_SCHEDULED = 'Hẹn khảo sát',
  QUOTE_SENT = 'Đã báo giá',
  WON = 'Chốt hợp đồng',
  LOST = 'Hủy/Trượt'
}

export enum EmployeeStatus {
  ACTIVE = 'Đang làm việc',
  ON_LEAVE = 'Nghỉ phép',
  RESIGNED = 'Đã nghỉ việc'
}

export enum TransactionType {
  INCOME = 'Thu',
  EXPENSE = 'Chi'
}

// --- NEW RBAC SYSTEM ---
export enum RoleLevel {
  EXECUTIVE = 'EXECUTIVE', // Ban điều hành (Giám đốc, PGĐ) - Full quyền
  MANAGER = 'MANAGER',     // Cấp quản lý (Trưởng/Phó phòng) - Full quyền trong phòng ban
  STAFF = 'STAFF'          // Cấp nhân viên - Chỉ xem/sửa dữ liệu của mình
}

export enum Department {
  BOARD = 'BOARD',         // Ban giám đốc
  SALES = 'SALES',         // Kinh doanh
  TECHNICAL = 'TECHNICAL', // Kỹ thuật & Dự án
  FINANCE = 'FINANCE',     // Tài chính kế toán
  HR = 'HR',               // Hành chính nhân sự
  WAREHOUSE = 'WAREHOUSE'  // Kho vận
}

export interface User {
  id: string;
  username: string;
  name: string;
  level: RoleLevel;
  department: Department;
  avatar?: string;
}
// --------------------

export interface SurveyData {
  roofArea: number;
  roofType: 'Mái ngói' | 'Mái tôn' | 'Mái bằng' | 'Khác';
  azimuth: string; // Hướng nhà
  tilt: number; // Độ nghiêng
  shading: string;
  images: string[];
  notes: string;
}

export interface QuotationItem {
  id: string;
  description: string;
  quantity: number;
  unit: string;
  unitPrice: number;
  total: number;
}

export interface Project {
  id: string;
  name: string;
  customer: string;
  capacityKWp: number;
  address: string;
  status: ProjectStatus;
  startDate: string;
  completionDate?: string;
  budget: number;
  // Staff Assignment
  salesRep?: string; 
  salesRepId?: string; // ID nhân viên sale (để phân quyền)
  surveyor?: string; 
  surveyorId?: string; // ID nhân viên kỹ thuật
  // Details
  surveyData?: SurveyData;
  quotationItems?: QuotationItem[];
}

export interface Lead {
  id: string;
  name: string;
  phone: string;
  source: 'Facebook' | 'Website' | 'Giới thiệu' | 'Khác';
  status: LeadStatus;
  estimatedCapacity: number; // kWp
  notes?: string;
  date: string;
  ownerId?: string; // ID người tạo/phụ trách (để phân quyền Staff)
  assignedTo?: string; // Tên người phụ trách
}

export interface InventoryItem {
  id: string;
  name: string;
  category: 'Solar Panel' | 'Inverter' | 'Mounting' | 'Cable' | 'Other';
  quantity: number;
  unit: string;
  minStock: number;
}

export interface Employee {
  id: string;
  name: string;
  role: string; // Chức danh công việc (Job Title)
  phone: string;
  email: string;
  status: EmployeeStatus;
  joinDate: string;
  
  // System Access Control
  level: RoleLevel;
  department: Department;
  username?: string;
}

// --- HR EXTENSION ---
export interface LaborContract {
  id: string;
  employeeId: string;
  type: 'Thử việc' | 'Có thời hạn' | 'Không thời hạn' | 'CTV';
  startDate: string;
  endDate?: string;
  salary: number;
  status: 'Hiệu lực' | 'Hết hạn' | 'Chờ ký';
}

export interface AttendanceSummary {
  id: string;
  employeeId: string;
  month: string; // MM/YYYY
  standardDays: number; // Ngày công chuẩn
  actualDays: number; // Ngày công thực tế
  lateHours: number; // Số giờ đi muộn
  overtimeHours: number; // Số giờ tăng ca
  leaveDays: number; // Số ngày nghỉ phép
}

export enum AttendanceMethod {
  FINGERPRINT = 'Vân tay',
  FACE_ID = 'Khuôn mặt',
  GPS_PHOTO = 'Hình ảnh & GPS'
}

export interface AttendanceLog {
  id: string;
  employeeId: string;
  timestamp: string; // ISO string
  type: 'CHECK_IN' | 'CHECK_OUT';
  method: AttendanceMethod;
  imageUrl?: string; // Base64 string for photo attendance
  location?: string;
  isValid: boolean;
}

export interface PayrollRecord {
  id: string;
  employeeId: string;
  month: string;
  basicSalary: number;
  allowances: number; // Phụ cấp
  bonus: number; // Thưởng
  deductions: number; // Khấu trừ (BHXH, Thuế...)
  netSalary: number; // Thực lĩnh
  status: 'Chưa thanh toán' | 'Đã thanh toán';
}

export interface BenefitRecord {
  id: string;
  employeeId: string;
  socialInsurance: boolean; // BHXH
  healthInsurance: boolean; // BHYT
  welfare: string[]; // Các phúc lợi khác (Cơm trưa, Xăng xe...)
}
// --------------------

export interface Transaction {
  id: string;
  date: string;
  description: string;
  amount: number;
  type: TransactionType;
  category: string;
  status: 'Hoàn thành' | 'Chờ xử lý';
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: number;
}

export interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  trend?: string;
  trendUp?: boolean;
}