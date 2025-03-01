import React from 'react';
import { Phone, Mail, MapPin } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-800 text-white py-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4">Moyne Sam</h3>
            <p className="text-gray-300">
              Профессиональные клининговые услуги для вашего дома и офиса.
            </p>
          </div>
          
          <div>
            <h3 className="text-xl font-bold mb-4">Контакты</h3>
            <ul className="space-y-2 text-gray-300">
              <li className="flex items-center space-x-2">
                <Phone size={18} />
                <span>+7 (900) 123-45-67</span>
              </li>
              <li className="flex items-center space-x-2">
                <Mail size={18} />
                <span>info@moynesam.ru</span>
              </li>
              <li className="flex items-center space-x-2">
                <MapPin size={18} />
                <span>г. Москва, ул. Примерная, д. 123</span>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-xl font-bold mb-4">Режим работы</h3>
            <p className="text-gray-300">
              Пн-Пт: 8:00 - 20:00<br />
              Сб-Вс: 9:00 - 18:00
            </p>
          </div>
        </div>
        
        <div className="mt-8 pt-6 border-t border-gray-700 text-center text-gray-400">
          <p>© {new Date().getFullYear()} Moyne Sam. Все права защищены.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;