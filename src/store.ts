import { create } from 'zustand';
import { User, ServiceType, ServiceRequest } from './types';

// Mock data
const mockServiceTypes: ServiceType[] = [
  {
    id: '1',
    name: 'Стандартная уборка',
    description: 'Базовая уборка помещения, включая пылесос и мытье полов',
    price: 2500,
  },
  {
    id: '2',
    name: 'Генеральная уборка',
    description: 'Полная уборка всего помещения, включая мытье окон и чистку мебели',
    price: 5000,
  },
  {
    id: '3',
    name: 'Уборка после ремонта',
    description: 'Специализированная уборка для удаления строительной пыли и мусора',
    price: 7000,
  },
];

interface AppState {
  users: User[];
  currentUser: User | null;
  serviceTypes: ServiceType[];
  serviceRequests: ServiceRequest[];
  
  // Auth actions
  register: (user: Omit<User, 'id' | 'isAdmin'>) => boolean;
  login: (login: string, password: string) => boolean;
  logout: () => void;
  
  // Service types actions
  addServiceType: (serviceType: Omit<ServiceType, 'id'>) => void;
  updateServiceType: (id: string, serviceType: Partial<ServiceType>) => void;
  deleteServiceType: (id: string) => void;
  
  // Service requests actions
  createServiceRequest: (request: Omit<ServiceRequest, 'id' | 'status' | 'createdAt' | 'updatedAt'>) => void;
  updateRequestStatus: (id: string, status: ServiceRequest['status'], cancellationReason?: string) => void;
}

// Mock passwords store (in a real app, this would be handled securely on the backend)
const passwords: Record<string, string> = {
  'admin': 'admin123',
};

export const useAppStore = create<AppState>((set) => ({
  users: [
    {
      id: '1',
      fullName: 'Администратор',
      phone: '+79001234567',
      email: 'admin@moynesam.ru',
      login: 'admin',
      isAdmin: true,
    },
  ],
  currentUser: null,
  serviceTypes: mockServiceTypes,
  serviceRequests: [],
  
  register: (userData) => {
    let success = false;
    
    set((state) => {
      // Check if login already exists
      const loginExists = state.users.some(user => user.login === userData.login);
      
      if (loginExists) {
        return { ...state };
      }
      
      // Create new user
      const newUser = {
        ...userData,
        id: Date.now().toString(),
        isAdmin: false,
      };
      
      // Store password (in a real app, this would be hashed and stored on the backend)
      passwords[userData.login] = (userData as any).password;
      
      success = true;
      return {
        users: [...state.users, newUser],
      };
    });
    
    return success;
  },
  
  login: (login, password) => {
    let success = false;
    
    set((state) => {
      // Check if credentials are valid
      if (passwords[login] === password) {
        const user = state.users.find(u => u.login === login);
        if (user) {
          success = true;
          return { currentUser: user };
        }
      }
      
      return { ...state };
    });
    
    return success;
  },
  
  logout: () => set({ currentUser: null }),
  
  addServiceType: (serviceTypeData) => {
    set((state) => ({
      serviceTypes: [
        ...state.serviceTypes,
        {
          ...serviceTypeData,
          id: Date.now().toString(),
        },
      ],
    }));
  },
  
  updateServiceType: (id, serviceTypeData) => {
    set((state) => ({
      serviceTypes: state.serviceTypes.map(st => 
        st.id === id ? { ...st, ...serviceTypeData } : st
      ),
    }));
  },
  
  deleteServiceType: (id) => {
    set((state) => ({
      serviceTypes: state.serviceTypes.filter(st => st.id !== id),
    }));
  },
  
  createServiceRequest: (requestData) => {
    set((state) => {
      const newRequest: ServiceRequest = {
        ...requestData,
        id: Date.now().toString(),
        status: 'new',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      
      return {
        serviceRequests: [...state.serviceRequests, newRequest],
      };
    });
  },
  
  updateRequestStatus: (id, status, cancellationReason) => {
    set((state) => ({
      serviceRequests: state.serviceRequests.map(req => 
        req.id === id 
          ? { 
              ...req, 
              status, 
              cancellationReason: status === 'cancelled' ? cancellationReason : req.cancellationReason,
              updatedAt: new Date().toISOString(),
            } 
          : req
      ),
    }));
  },
}));