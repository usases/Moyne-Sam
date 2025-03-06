import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../store';
import InputMask from 'react-input-mask';


const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const { register } = useAppStore();
  
  
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    email: '',
    login: '',
    password: '',
    confirmPassword: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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

    if (!formData.fullName.trim()) { 
      newErrors.fullName = 'Введите ФИО';
    } else if (!/^[А-ЯЁ][а-яё]+\s[А-ЯЁ][а-яё]+\s[А-ЯЁ][а-яё]+$/.test(formData.fullName)) {
      newErrors.fullName = 'Введите ФИО полностью (Фамилия Имя Отчество) на кириллице';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Введите номер телефона';
    } else if (!/^\+7 \(\d{3}\) \d{3} \d{2} \d{2}$/.test(formData.phone)) {
      newErrors.phone = 'Телефон должен быть в формате +7';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Введите email';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Введите корректный email';
    }

    if (!formData.login.trim()) {
      newErrors.login = 'Введите логин';
    }

    if (!formData.password) {
      newErrors.password = 'Введите пароль';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Пароль должен содержать минимум 6 символов';
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Пароли не совпадают';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    const { confirmPassword, ...userData } = formData;
    const success = register(userData);

    if (success) {
      navigate('/login', { state: { message: 'Регистрация успешна. Войдите в систему.' } });
    } else {
      setErrors({ login: 'Пользователь с таким логином уже существует' });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-md mx-auto bg-white rounded-lg shadow-md overflow-hidden">
          <div className="bg-blue-600 text-white py-4 px-6">
            <h2 className="text-2xl font-bold">Регистрация</h2>
          </div>

          <form onSubmit={handleSubmit} className="py-6 px-8">
            <div className="mb-4">
              <label htmlFor="fullName" className="block text-gray-700 font-medium mb-2">
                ФИО
              </label>
              <input
                type="text"
                id="fullName"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${errors.fullName ? 'border-red-500 focus:ring-red-200' : 'border-gray-300 focus:ring-blue-200'
                  }`}
              />
              {errors.fullName && (
                <p className="text-red-500 text-sm mt-1">{errors.fullName}</p>
              )}
            </div>

            <div className="mb-4">
              <label htmlFor="phone" className="block text-gray-700 font-medium mb-2">
                Телефон
              </label>
              <InputMask
                mask="+7 (999) 999 99 99"
                type="text"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                //placeholder="7(999) 720 66 96"
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${errors.phone ? 'border-red-500 focus:ring-red-200' : 'border-gray-300 focus:ring-blue-200'
                  }`}
              />
              {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
            </div>

            <div className="mb-4">
              <label htmlFor="email" className="block text-gray-700 font-medium mb-2">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${errors.email ? 'border-red-500 focus:ring-red-200' : 'border-gray-300 focus:ring-blue-200'
                  }`}
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">{errors.email}</p>
              )}
            </div>

            <div className="mb-4">
              <label htmlFor="login" className="block text-gray-700 font-medium mb-2">
                Логин
              </label>
              <input
                type="text"
                id="login"
                name="login"
                value={formData.login}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${errors.login ? 'border-red-500 focus:ring-red-200' : 'border-gray-300 focus:ring-blue-200'
                  }`}
              />
              {errors.login && (
                <p className="text-red-500 text-sm mt-1">{errors.login}</p>
              )}
            </div>

            <div className="mb-4">
              <label htmlFor="password" className="block text-gray-700 font-medium mb-2">
                Пароль
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${errors.password ? 'border-red-500 focus:ring-red-200' : 'border-gray-300 focus:ring-blue-200'
                  }`}
              />
              {errors.password && (
                <p className="text-red-500 text-sm mt-1">{errors.password}</p>
              )}
            </div>

            <div className="mb-6">
              <label htmlFor="confirmPassword" className="block text-gray-700 font-medium mb-2">
                Подтверждение пароля
              </label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${errors.confirmPassword ? 'border-red-500 focus:ring-red-200' : 'border-gray-300 focus:ring-blue-200'
                  }`}
              />
              {errors.confirmPassword && (
                <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>
              )}
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors"
            >
              Зарегистрироваться
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
