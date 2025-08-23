import React, { useState } from 'react';
import { FaRegEye, FaRegEyeSlash } from 'react-icons/fa';

const Input = ({ value, onChange, placeholder, label, type, required }) => {
  const [showPassword, setShowPassword] = useState(false);

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="space-y-2">
      <label className="text-[13px] text-slate-800 font-medium">{label}</label>

      <div className="relative flex items-center border border-gray-300 rounded-lg px-3 py-2 focus-within:border-purple-500 focus-within:ring-1 focus-within:ring-purple-500">
        <input
          type={type === 'password' ? showPassword ? 'text' : 'password' : type}
          placeholder={placeholder}
          className="w-full bg-transparent outline-none text-gray-900 placeholder-gray-500"
          value={value}
          onChange={(e) => onChange(e)}
          required={required}
        />

        {type === "password" && (
          showPassword ? (
            <FaRegEye
              size={22}
              className="text-purple-600 cursor-pointer hover:text-purple-700"
              onClick={toggleShowPassword}
            />
          ) : (
            <FaRegEyeSlash
              size={22}
              className="text-slate-400 cursor-pointer hover:text-slate-600"
              onClick={toggleShowPassword}
            />
          )
        )}
      </div>
    </div>
  );
};

export default Input;
