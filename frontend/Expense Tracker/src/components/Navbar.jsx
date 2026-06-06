import React, { useContext } from 'react';
import { ThemeContext } from '../context/ThemeContext';
import { LuSun, LuMoon, LuPalette } from 'react-icons/lu';

const Navbar = () => {
  const { theme, setTheme } = useContext(ThemeContext);

  const themes = [
    { id: 'light', name: 'Light', icon: <LuSun className="w-3.5 h-3.5" /> },
    { id: 'butter-yellow', name: 'Butter', icon: <LuPalette className="w-3.5 h-3.5" /> },
    { id: 'light-blue', name: 'Sky Blue', icon: <LuPalette className="w-3.5 h-3.5" /> },
    { id: 'dark', name: 'Dark', icon: <LuMoon className="w-3.5 h-3.5" /> },
  ];

  return (
    <div className="bg-theme-card shadow-sm border-b border-theme-border px-6 py-4 transition-colors duration-200">
      <div className="flex items-center justify-between">
        <div>
          <span className="text-theme-muted text-xs font-medium uppercase tracking-wider">Workspace</span>
          <h1 className="text-sm font-semibold text-theme-main">Personal Dashboard</h1>
        </div>
        
        {/* Theme Picker */}
        <div className="flex items-center space-x-1 bg-theme-bg p-1 rounded-lg border border-theme-border transition-colors duration-200">
          <span className="text-xs text-theme-muted px-2 font-medium hidden xs:inline">Theme:</span>
          {themes.map((t) => (
            <button
              key={t.id}
              onClick={() => setTheme(t.id)}
              className={`flex items-center space-x-1.5 px-2.5 py-1.5 rounded-md text-xs font-medium border transition-all duration-200 cursor-pointer ${
                theme === t.id
                  ? 'bg-purple-600 text-white border-purple-600 shadow-sm'
                  : 'bg-theme-card text-theme-muted border-theme-border hover:bg-theme-bg'
              }`}
              title={t.name}
            >
              <span className="flex items-center justify-center">
                {t.icon}
              </span>
              <span className="hidden md:inline">{t.name}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Navbar;
