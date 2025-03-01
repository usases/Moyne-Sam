export interface User {
  id: string;
  fullName: string;
  phone: string;
  email: string;
  login: string;
  isAdmin: boolean;
}

export interface ServiceType {
  id: string;
  name: string;
  description: string;
  price: number;
}

export type PaymentType = 'cash' | 'card' | 'online';

export type RequestStatus = 'new' | 'in-progress' | 'completed' | 'cancelled';

export interface ServiceRequest {
  id: string;
  userId: string;
  address: string;
  contactInfo: string;
  dateTime: string;
  paymentType: PaymentType;
  serviceTypeId: string;
  status: RequestStatus;
  cancellationReason?: string;
  createdAt: string;
  updatedAt: string;
}