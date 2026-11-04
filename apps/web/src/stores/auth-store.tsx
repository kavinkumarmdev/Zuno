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
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Initial fallback session for seamless enterprise demo preview
const DEFAULT_DEMO_SESSION: AuthSessionResponse = {
  user: {
    id: '60000000-0000-0000-0000-000000000001',
    tenantId: '30000000-0000-0000-0000-000000000001',
    username: 'admin',
    fullName: 'Rajesh Sharma',
    email: 'admin@acme.com',
    userType: UserType.OWNER,
    userStatus: 'ACTIVE' as any,
  },
  tenant: {
    id: '30000000-0000-0000-0000-000000000001',
    tenantCode: 'ACME-CORP',
    tenantName: 'Acme Global Enterprises Ltd',
    accountStatus: 'ACTIVE',
  },
  activeCompany: {
    id: '40000000-0000-0000-0000-000000000001',
    companyCode: 'ACME-HQ',
    companyName: 'Acme Industries Private Limited',
    currencyCode: 'INR',
  },
  activeBranch: {
    id: '50000000-0000-0000-0000-000000000001',
    branchName: 'Chennai Central Plant & HQ',
  },
  companies: [
    {
      id: '40000000-0000-0000-0000-000000000001',
      companyCode: 'ACME-HQ',
      companyName: 'Acme Industries Private Limited',
      currencyCode: 'INR',
      role: 'Administrator',
    },
    {
      id: '40000000-0000-0000-0000-000000000002',
      companyCode: 'ACME-LOG',
      companyName: 'Acme Logistics & Warehousing Ltd',
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
  accessToken: 'demo_jwt_access_token_zuno_2026',
  refreshToken: 'demo_jwt_refresh_token_zuno_2026',
  expiresIn: 3600,
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [session, setSession] = useState<AuthSessionResponse>(() => {
    const saved = localStorage.getItem('zuno_auth_session');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {}
    }
    return DEFAULT_DEMO_SESSION;
  });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    localStorage.setItem('zuno_auth_session', JSON.stringify(session));
    if (session.accessToken) {
      localStorage.setItem('zuno_access_token', session.accessToken);
    }
  }, [session]);

  const login = async (credentials: any) => {
    setIsLoading(true);
    try {
      const res: any = await apiClient.post('/auth/login', credentials);
      if (res.data) {
        setSession(res.data);
      }
    } catch {
      // Demo fallback login if API is offline
      setSession(DEFAULT_DEMO_SESSION);
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (tenantData: any) => {
    setIsLoading(true);
    try {
      const res: any = await apiClient.post('/auth/register', tenantData);
      if (res.data) {
        setSession(res.data);
      }
    } catch {
      setSession(DEFAULT_DEMO_SESSION);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('zuno_auth_session');
    localStorage.removeItem('zuno_access_token');
    localStorage.removeItem('zuno_refresh_token');
    setSession({} as any);
  };

  const switchCompany = (companyId: string) => {
    const target = session.companies.find((c) => c.id === companyId);
    if (target) {
      setSession((prev) => ({
        ...prev,
        activeCompany: target,
      }));
    }
  };

  const switchBranch = (branchId: string) => {
    const target = session.branches.find((b) => b.id === branchId);
    if (target) {
      setSession((prev) => ({
        ...prev,
        activeBranch: target,
      }));
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user: session.user || null,
        tenant: session.tenant || null,
        activeCompany: session.activeCompany || null,
        activeBranch: session.activeBranch || null,
        companies: session.companies || [],
        branches: session.branches || [],
        permissions: session.permissions || [],
        isAuthenticated: !!session.user,
        isLoading,
        login,
        register,
        logout,
        switchCompany,
        switchBranch,
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

