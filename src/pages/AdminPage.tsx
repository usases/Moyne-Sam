import React, { useState } from 'react';
import { useAppStore } from '../store';
import { ServiceRequest, ServiceType } from '../types';

const AdminPage: React.FC = () => {
  const { 
    serviceTypes, 
    serviceRequests, 
    users,
    addServiceType, 
    updateServiceType, 
    deleteServiceType,
    updateRequestStatus,
    currentUser
  } = useAppStore();
  
  const [activeTab, setActiveTab] = useState<'requests' | 'services'>('requests');
  const [editingServiceId, setEditingServiceId] = useState<string | null>(null);
  const [newService, setNewService] = useState<Omit<ServiceType, 'id'>>({
    name: '',
    description: '',
    price: 0,
  });
  
  const [statusUpdateData, setStatusUpdateData] = useState({
    requestId: '',
    status: '' as ServiceRequest['status'],
    cancellationReason: '',
  });
  
  // Check if user is admin
  if (!currentUser?.isAdmin) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl font-bold text-red-600">Доступ запрещен</h2>
          <p className="mt-4">У вас нет прав для доступа к этой странице.</p>
        </div>
      </div>
    );
  }
  
  // Get user name by id
  const getUserName = (id: string): string => {
    const user = users.find(u => u.id === id);
    return user ? user.fullName : 'Неизвестный пользователь';
  };
  
  // Get service type name by id
  const getServiceTypeName = (id: string): string => {
    const serviceType = serviceTypes.find(type => type.id === id);
    return serviceType ? serviceType.name : 'Неизвестная услуга';
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
  
  // Handle service form change
  const handleServiceFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    if (name === 'price') {
      setNewService(prev => ({ ...prev, [name]: parseFloat(value) || 0 }));
    } else {
      setNewService(prev => ({ ...prev, [name]: value }));
    }
  };
  
  // Handle service form submit
  const handleServiceFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newService.name || !newService.description || newService.price <= 0) {
      return;
    }
    
    if (editingServiceId) {
      updateServiceType(editingServiceId, newService);
    } else {
      addServiceType(newService);
    }
    
    // Reset form
    setNewService({
      name: '',
      description: '',
      price: 0,
    });
    setEditingServiceId(null);
  };
  
  // Start editing service
  const handleEditService = (service: ServiceType) => {
    setEditingServiceId(service.id);
    setNewService({
      name: service.name,
      description: service.description,
      price: service.price,
    });
  };
  
  // Cancel editing service
  const handleCancelEdit = () => {
    setEditingServiceId(null);
    setNewService({
      name: '',
      description: '',
      price: 0,
    });
  };
  
  // Open status update modal
  const handleOpenStatusModal = (request: ServiceRequest) => {
    setStatusUpdateData({
      requestId: request.id,
      status: request.status,
      cancellationReason: request.cancellationReason || '',
    });
  };
  
  // Handle status update form change
  const handleStatusFormChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setStatusUpdateData(prev => ({ ...prev, [name]: value }));
  };
  
  // Handle status update form submit
  const handleStatusFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!statusUpdateData.requestId || !statusUpdateData.status) {
      return;
    }
    
    updateRequestStatus(
      statusUpdateData.requestId, 
      statusUpdateData.status, 
      statusUpdateData.status === 'cancelled' ? statusUpdateData.cancellationReason : undefined
    );
    
    // Reset form
    setStatusUpdateData({
      requestId: '',
      status: 'new',
      cancellationReason: '',
    });
  };
  
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="bg-blue-600 text-white py-4 px-6">
            <h2 className="text-2xl font-bold">Панель администратора</h2>
          </div>
          
          <div className="border-b border-gray-200">
            <nav className="flex -mb-px">
              <button
                onClick={() => setActiveTab('requests')}
                className={`py-4 px-6 font-medium text-sm ${
                  activeTab === 'requests'
                    ? 'border-b-2 border-blue-500 text-blue-600'
                    : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Заявки
              </button>
              <button
                onClick={() => setActiveTab('services')}
                className={`py-4 px-6 font-medium text-sm ${
                  activeTab === 'services'
                    ? 'border-b-2 border-blue-500 text-blue-600'
                    : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Услуги
              </button>
            </nav>
          </div>
          
          {activeTab === 'requests' && (
            <div className="p-6">
              <h3 className="text-lg font-medium mb-4">Управление заявками</h3>
              
              {serviceRequests.length === 0 ? (
                <p className="text-gray-500">Нет заявок</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          № заявки
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Клиент
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Услуга
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Дата и время
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Статус
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Создана
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Действия
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {serviceRequests.map((request) => (
                        <tr key={request.id} className="hover:bg-gray-50">
                          <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                            {request.id.slice(0, 8)}
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                            {getUserName(request.userId)}
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                            {getServiceTypeName(request.serviceTypeId)}
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                            {formatDate(request.dateTime)}
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap">
                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColorClass(request.status)}`}>
                              {formatStatus(request.status)}
                            </span>
                            {request.status === 'cancelled' && request.cancellationReason && (
                              <p className="text-xs text-red-500 mt-1">{request.cancellationReason}</p>
                            )}
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                            {formatDate(request.createdAt)}
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm">
                            <button
                              onClick={() => handleOpenStatusModal(request)}
                              className="text-blue-600 hover:text-blue-800"
                            >
                              Изменить статус
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
              
              {/* Status Update Form */}
              {statusUpdateData.requestId && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                  <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
                    <h3 className="text-lg font-medium mb-4">Изменение статуса заявки</h3>
                    
                    <form onSubmit={handleStatusFormSubmit}>
                      <div className="mb-4">
                        <label htmlFor="status" className="block text-gray-700 font-medium mb-2">
                          Статус
                        </label>
                        <select
                          id="status"
                          name="status"
                          value={statusUpdateData.status}
                          onChange={handleStatusFormChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200"
                        >
                          <option value="new">Новая</option>
                          <option value="in-progress">В процессе</option>
                          <option value="completed">Выполнена</option>
                          <option value="cancelled">Отменена</option>
                        </select>
                      </div>
                      
                      {statusUpdateData.status === 'cancelled' && (
                        <div className="mb-4">
                          <label htmlFor="cancellationReason" className="block text-gray-700 font-medium mb-2">
                            Причина отмены
                          </label>
                          <textarea
                            id="cancellationReason"
                            name="cancellationReason"
                            value={statusUpdateData.cancellationReason}
                            onChange={handleStatusFormChange}
                            rows={3}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200"
                            required
                          />
                        </div>
                      )}
                      
                      <div className="flex justify-end space-x-2">
                        <button
                          type="button"
                          onClick={() => setStatusUpdateData({ requestId: '', status: 'new', cancellationReason: '' })}
                          className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                        >
                          Отмена
                        </button>
                        <button
                          type="submit"
                          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                        >
                          Сохранить
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              )}
            </div>
          )}
          
          {activeTab === 'services' && (
            <div className="p-6">
              <h3 className="text-lg font-medium mb-4">Управление услугами</h3>
              
              <form onSubmit={handleServiceFormSubmit} className="mb-8 bg-gray-50 p-4 rounded-lg">
                <h4 className="font-medium mb-4">
                  {editingServiceId ? 'Редактирование услуги' : 'Добавление новой услуги'}
                </h4>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label htmlFor="name" className="block text-gray-700 font-medium mb-2">
                      Название
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={newService.name}
                      onChange={handleServiceFormChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200"
                      required
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="price" className="block text-gray-700 font-medium mb-2">
                      Цена (₽)
                    </label>
                    <input
                      type="number"
                      id="price"
                      name="price"
                      value={newService.price}
                      onChange={handleServiceFormChange}
                      min="0"
                      step="100"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200"
                      required
                    />
                  </div>
                </div>
                
                <div className="mb-4">
                  <label htmlFor="description" className="block text-gray-700 font-medium mb-2">
                    Описание
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    value={newService.description}
                    onChange={handleServiceFormChange}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200"
                    required
                  />
                </div>
                
                <div className="flex justify-end space-x-2">
                  {editingServiceId && (
                    <button
                      type="button"
                      onClick={handleCancelEdit}
                      className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                    >
                      Отмена
                    </button>
                  )}
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    {editingServiceId ? 'Сохранить' : 'Добавить'}
                  </button>
                </div>
              </form>
              
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Название
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Описание
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Цена
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Действия
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {serviceTypes.map((service) => (
                      <tr key={service.id} className="hover:bg-gray-50">
                        <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                          {service.name}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-500 max-w-xs truncate">
                          {service.description}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                          {service.price} ₽
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm">
                          <button
                            onClick={() => handleEditService(service)}
                            className="text-blue-600 hover:text-blue-800 mr-3"
                          >
                            Редактировать
                          </button>
                          <button
                            onClick={() => deleteServiceType(service.id)}
                            className="text-red-600 hover:text-red-800"
                          >
                            Удалить
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminPage;