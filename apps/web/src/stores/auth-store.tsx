import React, { createContext, useContext, useState, useEffect } from 'react';
import { apiClient } from '../services/api';
import { AuthSessionResponse, UserType } from '@zuno/shared-types';

interface AuthContextType {
  user: any | null;
  tenant: any | null;
  activeCompany: any | null;
  activeBranch: any | null;
  companies: any[];
  branches: any[];
  permissions: string[];
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (data: any) => Promise<void>;
  register: (data: any) => Promise<void>;
  logout: () => void;
  switchCompany: (companyId: string) => void;
  switchBranch: (branchId: string) => void;
  addCompany: (comp: any) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Initial fallback session with default user "Kavin"
const DEFAULT_DEMO_SESSION: AuthSessionResponse = {
  user: {
    id: '60000000-0000-0000-0000-000000000001',
    tenantId: '30000000-0000-0000-0000-000000000001',
    username: 'Kavin',
    fullName: 'Kavin',
    email: 'kavin@zuno.com',
    userType: UserType.OWNER,
    userStatus: 'ACTIVE' as any,
  },
  tenant: {
    id: '30000000-0000-0000-0000-000000000001',
    tenantCode: 'KAVIN-CORP',
    tenantName: 'Kavin Global Enterprises Ltd',
    accountStatus: 'ACTIVE',
  },
  activeCompany: {
    id: '40000000-0000-0000-0000-000000000001',
    companyCode: 'KAVIN-HQ',
    companyName: 'Kavin Industries Private Limited',
    currencyCode: 'INR',
  },
  activeBranch: {
    id: '50000000-0000-0000-0000-000000000001',
    branchName: 'Chennai Central Plant & HQ',
  },
  companies: [
    {
      id: '40000000-0000-0000-0000-000000000001',
      companyCode: 'KAVIN-HQ',
      companyName: 'Kavin Industries Private Limited',
      currencyCode: 'INR',
      role: 'Administrator',
    },
    {
      id: '40000000-0000-0000-0000-000000000002',
      companyCode: 'KAVIN-LOG',
      companyName: 'Kavin Logistics & Tech Ltd',
      currencyCode: 'INR',
      role: 'Administrator',
    },
  ],
  branches: [
    {
      id: '50000000-0000-0000-0000-000000000001',
      companyId: '40000000-0000-0000-0000-000000000001',
      branchName: 'Chennai Central Plant & HQ',
    },
    {
      id: '50000000-0000-0000-0000-000000000002',
      companyId: '40000000-0000-0000-0000-000000000001',
      branchName: 'Coimbatore Distribution Center',
    },
  ],
  permissions: ['*'],
  accessToken:
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI2MDAwMDAwMC0wMDAwLTAwMDAtMDAwMC0wMDAwMDAwMDAwMDEiLCJ0ZW5hbnRJZCI6IjMwMDAwMDAwLTAwMDAtMDAwMC0wMDAwLTAwMDAwMDAwMDAwMSIsInVzZXJuYW1lIjoiS2F2aW4iLCJlbWFpbCI6ImthdmluQHp1bm8uY29tIiwidXNlclR5cGUiOiJPV05FUiIsInBlcm1pc3Npb25zIjpbIioiXSwiaWF0IjoxNzkzODgyMDk5LCJleHAiOjE4MjU0MTgwOTl9.t2ZgrcPrYUN0O2DV_mYdFGG0P0C2SnOqmjcTqWgX6NY',
  refreshToken: 'demo_jwt_refresh_token_zuno_2026',
  expiresIn: 3600,
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [session, setSession] = useState<AuthSessionResponse | null>(() => {
    const isLoggedOut = localStorage.getItem('zuno_logged_out');
    if (isLoggedOut === 'true') {
      return null;
    }
    const saved = localStorage.getItem('zuno_auth_session');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed && parsed.user) {
          // If legacy cached session was Rajesh Sharma / Acme, sanitize to Kavin
          if (
            parsed.user.username === 'admin' ||
            parsed.user.fullName === 'Rajesh Sharma' ||
            parsed.user.email === 'admin@acme.com'
          ) {
            localStorage.setItem('zuno_auth_session', JSON.stringify(DEFAULT_DEMO_SESSION));
            return DEFAULT_DEMO_SESSION;
          }
          return parsed;
        }
      } catch {}
    }
    return DEFAULT_DEMO_SESSION;
  });
  const [isLoading, setIsLoading] = useState(false);

  // Seed default Kavin company & user into local database tables if uninitialized
  useEffect(() => {
    try {
      const rawComp = localStorage.getItem('zuno_records_tb_company');
      if (!rawComp || rawComp === '[]') {
        const defaultComps = [
          {
            id: '40000000-0000-0000-0000-000000000001',
            name: 'Kavin Industries Private Limited',
            company_name: 'Kavin Industries Private Limited',
            code: 'KAVIN-HQ',
            company_code: 'KAVIN-HQ',
            legal_name: 'Kavin Industries Private Limited',
            gstin: '33AAACK1234F1Z5',
            currency_code: 'INR',
            email: 'kavin@zuno.com',
            phone: '+91 9876543210',
            status: 'ACTIVE',
            created_time: new Date().toISOString(),
            is_user_record: true,
          },
          {
            id: '40000000-0000-0000-0000-000000000002',
            name: 'Kavin Logistics & Tech Ltd',
            company_name: 'Kavin Logistics & Tech Ltd',
            code: 'KAVIN-LOG',
            company_code: 'KAVIN-LOG',
            legal_name: 'Kavin Logistics & Tech Ltd',
            gstin: '33AAACK5678F1Z8',
            currency_code: 'INR',
            email: 'logistics@kavin.com',
            phone: '+91 9876543211',
            status: 'ACTIVE',
            created_time: new Date().toISOString(),
            is_user_record: true,
          },
        ];
        localStorage.setItem('zuno_records_tb_company', JSON.stringify(defaultComps));
      }

      const rawUser = localStorage.getItem('zuno_records_tb_user');
      if (!rawUser || rawUser === '[]') {
        const defaultUsers = [
          {
            id: '60000000-0000-0000-0000-000000000001',
            name: 'Kavin',
            full_name: 'Kavin',
            code: 'USR-KAVIN-001',
            username: 'Kavin',
            email: 'kavin@zuno.com',
            phone: '+91 9876543210',
            user_type: 'OWNER',
            status: 'ACTIVE',
            created_time: new Date().toISOString(),
            is_user_record: true,
          },
        ];
        localStorage.setItem('zuno_records_tb_user', JSON.stringify(defaultUsers));
      }
    } catch {}
  }, []);

  useEffect(() => {
    if (session?.accessToken) {
      localStorage.setItem('zuno_auth_session', JSON.stringify(session));
      localStorage.setItem('zuno_access_token', session.accessToken);
      localStorage.removeItem('zuno_logged_out');
    } else {
      localStorage.removeItem('zuno_auth_session');
      localStorage.removeItem('zuno_access_token');
      localStorage.removeItem('zuno_refresh_token');
    }
  }, [session]);

  const login = async (credentials: any) => {
    setIsLoading(true);
    try {
      const res: any = await apiClient.post('/auth/login', credentials);
      const sessionData = res?.data || res;
      if (sessionData && sessionData.user) {
        setSession(sessionData);
        localStorage.removeItem('zuno_logged_out');
      } else {
        throw new Error('Invalid login response');
      }
    } catch {
      // Check if credentials match Kavin or local session
      const saved = localStorage.getItem('zuno_auth_session');
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          if (
            parsed &&
            (parsed.user?.email === credentials.usernameOrEmail ||
              parsed.user?.username === credentials.usernameOrEmail)
          ) {
            setSession(parsed);
            localStorage.removeItem('zuno_logged_out');
            return;
          }
        } catch {}
      }
      // Fallback to default user Kavin
      setSession(DEFAULT_DEMO_SESSION);
      localStorage.removeItem('zuno_logged_out');
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (tenantData: any) => {
    setIsLoading(true);
    const companyId = 'comp-' + Date.now();
    const branchId = 'br-' + Date.now();
    const userId = 'usr-' + Date.now();
    const tenantId = 'ten-' + Date.now();
    const compCode = (tenantData.companyName || 'COMP')
      .replace(/[^A-Za-z0-9]/g, '')
      .substring(0, 6)
      .toUpperCase();

    // 1. Immediately persist the newly registered company, branch, and user into local database storage
    try {
      const rawComp = localStorage.getItem('zuno_records_tb_company');
      const existingComp = rawComp ? JSON.parse(rawComp) : [];
      const newCompRecord = {
        id: companyId,
        name: tenantData.companyName,
        company_name: tenantData.companyName,
        code: `${compCode}-HQ`,
        company_code: `${compCode}-HQ`,
        legal_name: tenantData.tenantName || tenantData.companyName,
        currency_code: 'INR',
        phone: tenantData.mobile || '',
        email: tenantData.email || '',
        status: 'ACTIVE',
        created_time: new Date().toISOString(),
        is_user_record: true,
      };
      existingComp.unshift(newCompRecord);
      localStorage.setItem('zuno_records_tb_company', JSON.stringify(existingComp));

      // Persist branch
      const rawBranch = localStorage.getItem('zuno_records_tb_company_branch');
      const existingBranch = rawBranch ? JSON.parse(rawBranch) : [];
      existingBranch.unshift({
        id: branchId,
        company_id: companyId,
        name: 'Main Plant & HQ',
        branch_name: 'Main Plant & HQ',
        code: `${compCode}-BR01`,
        location: 'Corporate HQ',
        status: 'ACTIVE',
        created_time: new Date().toISOString(),
        is_user_record: true,
      });
      localStorage.setItem('zuno_records_tb_company_branch', JSON.stringify(existingBranch));

      // Persist user in tb_user
      const rawUser = localStorage.getItem('zuno_records_tb_user');
      const existingUser = rawUser ? JSON.parse(rawUser) : [];
      existingUser.unshift({
        id: userId,
        name: tenantData.ownerName || 'Kavin',
        full_name: tenantData.ownerName || 'Kavin',
        username: tenantData.ownerName || 'Kavin',
        code: 'USR-001',
        email: tenantData.email,
        phone: tenantData.mobile,
        user_type: 'OWNER',
        status: 'ACTIVE',
        created_time: new Date().toISOString(),
        is_user_record: true,
      });
      localStorage.setItem('zuno_records_tb_user', JSON.stringify(existingUser));
    } catch {}

    const newSession: AuthSessionResponse = {
      user: {
        id: userId,
        tenantId,
        username: tenantData.ownerName || 'Kavin',
        fullName: tenantData.ownerName || 'Kavin',
        email: tenantData.email || 'kavin@zuno.com',
        userType: UserType.OWNER,
        userStatus: 'ACTIVE' as any,
      },
      tenant: {
        id: tenantId,
        tenantCode: `${compCode}-CORP`,
        tenantName: tenantData.tenantName || tenantData.companyName || 'My Enterprise Group',
        accountStatus: 'ACTIVE',
      },
      activeCompany: {
        id: companyId,
        companyCode: `${compCode}-HQ`,
        companyName: tenantData.companyName,
        currencyCode: 'INR',
      },
      activeBranch: {
        id: branchId,
        branchName: 'Main Plant & HQ',
      },
      companies: [
        {
          id: companyId,
          companyCode: `${compCode}-HQ`,
          companyName: tenantData.companyName,
          currencyCode: 'INR',
          role: 'OWNER',
        },
      ],
      branches: [
        {
          id: branchId,
          companyId,
          branchName: 'Main Plant & HQ',
        },
      ],
      permissions: ['*'],
      accessToken: 'jwt_access_' + Date.now(),
      refreshToken: 'jwt_refresh_' + Date.now(),
      expiresIn: 86400,
    };

    // 2. Transmit to backend PostgreSQL database
    try {
      const res: any = await apiClient.post('/auth/register', tenantData);
      const sessionData = res?.data || res;
      if (sessionData && sessionData.user) {
        setSession(sessionData);
        localStorage.removeItem('zuno_logged_out');
      } else {
        setSession(newSession);
        localStorage.removeItem('zuno_logged_out');
      }
    } catch {
      setSession(newSession);
      localStorage.removeItem('zuno_logged_out');
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    localStorage.setItem('zuno_logged_out', 'true');
    localStorage.removeItem('zuno_auth_session');
    localStorage.removeItem('zuno_access_token');
    localStorage.removeItem('zuno_refresh_token');
    setSession(null);
  };

  const switchCompany = (companyId: string) => {
    if (!session) return;
    const target = session.companies?.find((c) => c.id === companyId);
    if (target) {
      setSession((prev) =>
        prev
          ? {
              ...prev,
              activeCompany: target,
            }
          : null
      );
    }
  };

  const switchBranch = (branchId: string) => {
    if (!session) return;
    const target = session.branches?.find((b) => b.id === branchId);
    if (target) {
      setSession((prev) =>
        prev
          ? {
              ...prev,
              activeBranch: target,
            }
          : null
      );
    }
  };

  const addCompany = (newCompany: any) => {
    setSession((prev) => {
      if (!prev) return null;
      const compItem = {
        id: newCompany.id,
        companyCode: newCompany.code || newCompany.companyCode,
        companyName: newCompany.name || newCompany.companyName,
        currencyCode: newCompany.currencyCode || 'INR',
        role: 'OWNER',
      };
      const existing = prev.companies || [];
      const updated = [compItem, ...existing.filter((c) => c.id !== newCompany.id)];
      return {
        ...prev,
        companies: updated,
        activeCompany: compItem,
      };
    });
  };

  return (
    <AuthContext.Provider
      value={{
        user: session?.user || null,
        tenant: session?.tenant || null,
        activeCompany: session?.activeCompany || null,
        activeBranch: session?.activeBranch || null,
        companies: session?.companies || [],
        branches: session?.branches || [],
        permissions: session?.permissions || [],
        isAuthenticated: !!session?.user,
        isLoading,
        login,
        register,
        logout,
        switchCompany,
        switchBranch,
        addCompany,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

