import React, { useState } from 'react';
import { CircleUserRound, CirclePlus, Layout } from 'lucide-react'; // Example icon import

interface HomePageProps {
  onOpenNewTransaction: () => void;
}

const HomePage: React.FC<HomePageProps> = ({ onOpenNewTransaction }) => {
  const [dropdownVisible, setDropdownVisible] = useState(false);

  const toggleDropdown = () => {
    setDropdownVisible(!dropdownVisible);
  };

  const handleProfileClick = () => {
    console.log('Profile clicked');
    setDropdownVisible(false);
    // Implement navigation to profile page
  };

  const handleSettingsClick = () => {
    console.log('Settings clicked');
    setDropdownVisible(false);
    // Implement navigation to settings page
  };

  return (
    <div className="home-page">
      <header className="header">
        <h1 className="app-title">Expense Tracker</h1>
        <div className="user-menu">
          <div className="user-icon-container">
            <CircleUserRound
              className="user-icon"
              onClick={toggleDropdown}
              onMouseEnter={() => setDropdownVisible(true)}
              onMouseLeave={() => setDropdownVisible(false)}
              size={30}
            />
            {dropdownVisible && (
              <div
                className="dropdown-menu"
                onMouseEnter={() => setDropdownVisible(true)}
                onMouseLeave={() => setDropdownVisible(false)}
              >
                <div className="dropdown-item" onClick={handleProfileClick}>
                  Profile
                </div>
                <div className="dropdown-item" onClick={handleSettingsClick}>
                  Settings
                </div>
              </div>
            )}
          </div>
        </div>
      </header>
      <div className='content'>
        <h2 className="welcome-message">Welcome!</h2>
        <div className="controls">
          <button onClick={onOpenNewTransaction} className="new-transaction-button">
            <CirclePlus className="icon" /> New Transaction
          </button>
          
        </div>
        <div className="dashboard-layout">
          <div className='side-bar'>
            <Layout/>
            Sidebar
          </div>
          <div className='dashboard-main'>
            Main
          </div>
          </div>
              </div>
    </div>
  );
};

export default HomePage;