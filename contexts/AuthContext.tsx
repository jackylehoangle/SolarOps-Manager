import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, RoleLevel, Department } from '../types';

interface AuthContextType {
  user: User | null;
  login: (username: string) => Promise<boolean>;
  logout: () => void;
  checkAccess: (requiredDept: Department[]) => boolean;
  canAccessData: (dataOwnerId?: string) => boolean; // Kiểm tra quyền xem dữ liệu (của mình hay của cả phòng)
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock Database Users reflecting the new Hierarchy
const MOCK_USERS: Record<string, User> = {
  'admin': { 
    id: 'U_ADMIN', username: 'admin', name: 'System Admin', 
    level: RoleLevel.EXECUTIVE, department: Department.BOARD, avatar: 'AD' 
  },
  'ceo': { 
    id: 'U_CEO', username: 'ceo', name: 'Nguyễn Văn Giám Đốc', 
    level: RoleLevel.EXECUTIVE, department: Department.BOARD, avatar: 'G' 
  },
  'sales_manager': { 
    id: 'U_SM', username: 'sales_manager', name: 'Trần Trưởng Phòng', 
    level: RoleLevel.MANAGER, department: Department.SALES, avatar: 'T' 
  },
  'sales_staff_1': { 
    id: 'U_S1', username: 'sales_staff_1', name: 'Lê Sale Một', 
    level: RoleLevel.STAFF, department: Department.SALES, avatar: 'S' 
  },
  'sales_staff_2': { 
    id: 'U_S2', username: 'sales_staff_2', name: 'Phạm Sale Hai', 
    level: RoleLevel.STAFF, department: Department.SALES, avatar: 'P' 
  },
  'tech_manager': { 
    id: 'U_TM', username: 'tech_manager', name: 'Võ Kỹ Thuật', 
    level: RoleLevel.MANAGER, department: Department.TECHNICAL, avatar: 'K' 
  },
  'accountant': { 
    id: 'U_AC', username: 'accountant', name: 'Đặng Kế Toán', 
    level: RoleLevel.MANAGER, department: Department.FINANCE, avatar: 'KT' 
  },
  'hr': {
    id: 'U_HR', username: 'hr', name: 'Ngô Nhân Sự',
    level: RoleLevel.MANAGER, department: Department.HR, avatar: 'NS'
  }
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('solar_user_v2');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (username: string): Promise<boolean> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const userFound = MOCK_USERS[username.toLowerCase()];
        if (userFound) {
          setUser(userFound);
          localStorage.setItem('solar_user_v2', JSON.stringify(userFound));
          resolve(true);
        } else {
          resolve(false);
        }
      }, 800);
    });
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('solar_user_v2');
  };

  // 1. Kiểm tra quyền truy cập vào Module (Dựa trên Phòng ban & Cấp bậc)
  const checkAccess = (requiredDepts: Department[]): boolean => {
    if (!user) return false;

    // EXECUTIVE (Ban điều hành) có quyền truy cập MỌI THỨ
    if (user.level === RoleLevel.EXECUTIVE) return true;

    // Nếu user thuộc phòng ban được phép
    if (requiredDepts.includes(user.department)) {
      return true;
    }

    return false;
  };

  // 2. Kiểm tra quyền xem dữ liệu (Row-Level Security)
  // Logic:
  // - EXECUTIVE: Xem hết.
  // - MANAGER: Xem hết dữ liệu trong module họ được truy cập (Thường là cả phòng).
  // - STAFF: Chỉ xem dữ liệu do mình tạo ra (ownerId == user.id) hoặc được gán.
  const canAccessData = (dataOwnerId?: string): boolean => {
    if (!user) return false;
    
    if (user.level === RoleLevel.EXECUTIVE) return true;
    if (user.level === RoleLevel.MANAGER) return true; // Quản lý xem được hết của nhân viên
    
    // Nếu là Staff, phải khớp Owner ID
    if (user.level === RoleLevel.STAFF) {
      return dataOwnerId === user.id;
    }

    return false;
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, checkAccess, canAccessData, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};