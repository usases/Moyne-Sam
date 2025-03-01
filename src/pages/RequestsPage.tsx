import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAppStore } from '../store';
import { ServiceRequest, ServiceType } from '../types';

interface LocationState {
  message?: string;
}

const RequestsPage: React.FC = () => {
  const location = useLocation();
  const { serviceRequests, serviceTypes, currentUser } = useAppStore();
  const [message, setMessage] = useState('');
  
  // Filter requests for current user if not admin
  const userRequests = currentUser?.isAdmin 
    ? serviceRequests 
    : serviceRequests.filter(req => req.userId === currentUser?.id);
  
  // Get service type name by id
  const getServiceTypeName = (id: string): string => {
    const serviceType = serviceTypes.find(type => type.id === id);
    return serviceType ? serviceType.name : 'Неизвестная услуга';
  };
  
  // Format payment type for display
  const formatPaymentType = (type: string): string => {
    switch (type) {
      case 'cash': return 'Наличными';
      case 'card': return 'Картой при выполнении';
      case 'online': return 'Онлайн оплата';
      default: return type;
    }
  };
  
  // Format status for display
  const formatStatus = (status: string): string => {
    switch (status) {
      case 'new': return 'Новая';
      case 'in-progress': return 'В процессе';
      case 'completed': return 'Выполнена';
      case 'cancelled': return 'Отменена';
      default: return status;
    }
  };
  
  // Get status color class
  const getStatusColorClass = (status: string): string => {
    switch (status) {
      case 'new': return 'bg-blue-100 text-blue-800';
      case 'in-progress': return 'bg-yellow-100 text-yellow-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };
  
  // Format date for display
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleString('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };
  
  useEffect(() => {
    const state = location.state as LocationState;
    if (state?.message) {
      setMessage(state.message);
      // Clear the location state
      window.history.replaceState({}, document.title);
    }
  }, [location]);
  
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="bg-blue-600 text-white py-4 px-6 flex justify-between items-center">
            <h2 className="text-2xl font-bold">
              {currentUser?.isAdmin ? 'Все заявки' : 'Мои заявки'}
            </h2>
            <Link
              to="/create-request"
              className="bg-white text-blue-600 px-4 py-2 rounded font-medium hover:bg-blue-50 transition-colors"
            >
              Создать заявку
            </Link>
          </div>
          
          {message && (
            <div className="bg-green-100 text-green-700 px-6 py-4">
              {message}
            </div>
          )}
          
          {userRequests.length === 0 ? (
            <div className="py-8 px-6 text-center text-gray-500">
              <p>У вас пока нет заявок</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      № заявки
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Услуга
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Дата и время
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Адрес
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Оплата
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Статус
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Создана
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {userRequests.map((request) => (
                    <tr key={request.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {request.id.slice(0, 8)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {getServiceTypeName(request.serviceTypeId)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(request.dateTime)}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">
                        {request.address}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatPaymentType(request.paymentType)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColorClass(request.status)}`}>
                          {formatStatus(request.status)}
                        </span>
                        {request.status === 'cancelled' && request.cancellationReason && (
                          <p className="text-xs text-red-500 mt-1">{request.cancellationReason}</p>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(request.createdAt)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RequestsPage;