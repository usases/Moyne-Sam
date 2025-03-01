import React from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle, Clock, CreditCard, MapPin } from 'lucide-react';
import { useAppStore } from '../store';

const HomePage: React.FC = () => {
  const { serviceTypes, currentUser } = useAppStore();
  
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-blue-600 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Профессиональная уборка для вашего дома и офиса
          </h1>
          <p className="text-xl mb-8 max-w-3xl mx-auto">
            Доверьте уборку профессионалам и наслаждайтесь чистотой без забот
          </p>
          {currentUser ? (
            <Link 
              to="/create-request" 
              className="bg-white text-blue-600 px-8 py-3 rounded-lg font-bold text-lg hover:bg-blue-100 transition-colors"
            >
              Заказать уборку
            </Link>
          ) : (
            <Link 
              to="/register" 
              className="bg-white text-blue-600 px-8 py-3 rounded-lg font-bold text-lg hover:bg-blue-100 transition-colors"
            >
              Зарегистрироваться
            </Link>
          )}
        </div>
      </section>
      
      {/* Services Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Наши услуги</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {serviceTypes.map((service) => (
              <div key={service.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-2">{service.name}</h3>
                  <p className="text-gray-600 mb-4">{service.description}</p>
                  <p className="text-2xl font-bold text-blue-600">от {service.price} ₽</p>
                </div>
                <div className="bg-gray-100 px-6 py-4">
                  {currentUser ? (
                    <Link 
                      to="/create-request" 
                      className="block w-full text-center bg-blue-600 text-white py-2 rounded font-medium hover:bg-blue-700 transition-colors"
                    >
                      Заказать
                    </Link>
                  ) : (
                    <Link 
                      to="/login" 
                      className="block w-full text-center bg-blue-600 text-white py-2 rounded font-medium hover:bg-blue-700 transition-colors"
                    >
                      Войти для заказа
                    </Link>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* How It Works Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Как это работает</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="bg-blue-100 text-blue-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle size={32} />
              </div>
              <h3 className="text-xl font-bold mb-2">Выберите услугу</h3>
              <p className="text-gray-600">Выберите подходящую услугу из нашего каталога</p>
            </div>
            
            <div className="text-center">
              <div className="bg-blue-100 text-blue-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock size={32} />
              </div>
              <h3 className="text-xl font-bold mb-2">Выберите время</h3>
              <p className="text-gray-600">Укажите удобную для вас дату и время</p>
            </div>
            
            <div className="text-center">
              <div className="bg-blue-100 text-blue-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <MapPin size={32} />
              </div>
              <h3 className="text-xl font-bold mb-2">Укажите адрес</h3>
              <p className="text-gray-600">Укажите адрес, где нужно провести уборку</p>
            </div>
            
            <div className="text-center">
              <div className="bg-blue-100 text-blue-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <CreditCard size={32} />
              </div>
              <h3 className="text-xl font-bold mb-2">Оплатите услугу</h3>
              <p className="text-gray-600">Выберите удобный способ оплаты</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;