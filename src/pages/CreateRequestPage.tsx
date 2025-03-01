import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../store';
import { PaymentType } from '../types';

const CreateRequestPage: React.FC = () => {
  const navigate = useNavigate();
  const { serviceTypes, createServiceRequest, currentUser } = useAppStore();
  
  const [formData, setFormData] = useState({
    address: '',
    contactInfo: '',
    dateTime: '',
    paymentType: 'cash' as PaymentType,
    serviceTypeId: '',
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when field is edited
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };
  
  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.address.trim()) {
      newErrors.address = 'Введите адрес';
    }
    
    if (!formData.contactInfo.trim()) {
      newErrors.contactInfo = 'Введите контактную информацию';
    }
    
    if (!formData.dateTime) {
      newErrors.dateTime = 'Выберите дату и время';
    } else {
      const selectedDate = new Date(formData.dateTime);
      const now = new Date();
      
      if (selectedDate <= now) {
        newErrors.dateTime = 'Дата и время должны быть в будущем';
      }
    }
    
    if (!formData.serviceTypeId) {
      newErrors.serviceTypeId = 'Выберите тип услуги';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm() || !currentUser) {
      return;
    }
    
    createServiceRequest({
      ...formData,
      userId: currentUser.id,
    });
    
    navigate('/requests', { state: { message: 'Заявка успешно создана' } });
  };
  
  // Get current date and time in ISO format for min attribute
  const now = new Date();
  now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
  const minDateTime = now.toISOString().slice(0, 16);
  
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md overflow-hidden">
          <div className="bg-blue-600 text-white py-4 px-6">
            <h2 className="text-2xl font-bold">Создание заявки на уборку</h2>
          </div>
          
          <form onSubmit={handleSubmit} className="py-6 px-8">
            <div className="mb-4">
              <label htmlFor="serviceTypeId" className="block text-gray-700 font-medium mb-2">
                Тип услуги
              </label>
              <select
                id="serviceTypeId"
                name="serviceTypeId"
                value={formData.serviceTypeId}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                  errors.serviceTypeId ? 'border-red-500 focus:ring-red-200' : 'border-gray-300 focus:ring-blue-200'
                }`}
              >
                <option value="">Выберите тип услуги</option>
                {serviceTypes.map(type => (
                  <option key={type.id} value={type.id}>
                    {type.name} - {type.price} ₽
                  </option>
                ))}
              </select>
              {errors.serviceTypeId && (
                <p className="text-red-500 text-sm mt-1">{errors.serviceTypeId}</p>
              )}
            </div>
            
            <div className="mb-4">
              <label htmlFor="address" className="block text-gray-700 font-medium mb-2">
                Адрес
              </label>
              <textarea
                id="address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                rows={3}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                  errors.address ? 'border-red-500 focus:ring-red-200' : 'border-gray-300 focus:ring-blue-200'
                }`}
              />
              {errors.address && (
                <p className="text-red-500 text-sm mt-1">{errors.address}</p>
              )}
            </div>
            
            <div className="mb-4">
              <label htmlFor="contactInfo" className="block text-gray-700 font-medium mb-2">
                Контактная информация
              </label>
              <textarea
                id="contactInfo"
                name="contactInfo"
                value={formData.contactInfo}
                onChange={handleChange}
                rows={2}
                placeholder="Дополнительный телефон, имя контактного лица и т.д."
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                  errors.contactInfo ? 'border-red-500 focus:ring-red-200' : 'border-gray-300 focus:ring-blue-200'
                }`}
              />
              {errors.contactInfo && (
                <p className="text-red-500 text-sm mt-1">{errors.contactInfo}</p>
              )}
            </div>
            
            <div className="mb-4">
              <label htmlFor="dateTime" className="block text-gray-700 font-medium mb-2">
                Дата и время
              </label>
              <input
                type="datetime-local"
                id="dateTime"
                name="dateTime"
                value={formData.dateTime}
                onChange={handleChange}
                min={minDateTime}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                  errors.dateTime ? 'border-red-500 focus:ring-red-200' : 'border-gray-300 focus:ring-blue-200'
                }`}
              />
              {errors.dateTime && (
                <p className="text-red-500 text-sm mt-1">{errors.dateTime}</p>
              )}
            </div>
            
            <div className="mb-6">
              <label className="block text-gray-700 font-medium mb-2">
                Способ оплаты
              </label>
              <div className="space-y-2">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="paymentType"
                    value="cash"
                    checked={formData.paymentType === 'cash'}
                    onChange={handleChange}
                    className="mr-2"
                  />
                  Наличными
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="paymentType"
                    value="card"
                    checked={formData.paymentType === 'card'}
                    onChange={handleChange}
                    className="mr-2"
                  />
                  Картой при выполнении работ
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="paymentType"
                    value="online"
                    checked={formData.paymentType === 'online'}
                    onChange={handleChange}
                    className="mr-2"
                  />
                  Онлайн оплата
                </label>
              </div>
            </div>
            
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors"
            >
              Создать заявку
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateRequestPage;