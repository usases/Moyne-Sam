import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Chrome as Broom, LogOut, User } from 'lucide-react';
import { useAppStore } from '../store';

const Header: React.FC = () => {
  const { currentUser, logout } = useAppStore();
  const navigate = useNavigate();
  
  const handleLogout = () => {
    logout();
    navigate('/login');
  };
  
  return (
    <header className="bg-blue-600 text-white shadow-md">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <Link to="/" className="flex items-center space-x-2 text-xl font-bold">
          <Broom size={24} />
          <span>Moyne Sam</span>
        </Link>
        
        <nav>
          <ul className="flex space-x-6">
            {currentUser ? (
              <>
                <li>
                  <Link to="/requests" className="hover:text-blue-200 transition-colors">
                    Мои заявки
                  </Link>
                </li>
                {currentUser.isAdmin && (
                  <li>
                    <Link to="/admin" className="hover:text-blue-200 transition-colors">
                      Админ панель
                    </Link>
                  </li>
                )}
                <li className="flex items-center space-x-2">
                  <User size={18} />
                  <span>{currentUser.fullName}</span>
                </li>
                <li>
                  <button 
                    onClick={handleLogout}
                    className="flex items-center space-x-1 hover:text-blue-200 transition-colors"
                  >
                    <LogOut size={18} />
                    <span>Выйти</span>
                  </button>
                </li>
              </>
            ) : (
              <>
                <li>
                  <Link to="/login" className="hover:text-blue-200 transition-colors">
                    Вход
                  </Link>
                </li>
                <li>
                  <Link to="/register" className="hover:text-blue-200 transition-colors">
                    Регистрация
                  </Link>
                </li>
              </>
            )}
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;