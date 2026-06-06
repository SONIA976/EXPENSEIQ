import React from 'react';
import CARD2 from '../assets/images/CARD2.png';
import{LuTrendingUpDown} from 'react-icons/lu';


const AuthLayout = ({children} ) => {
  return <div className='flex'> 
    <div className='w-screen h-screen md:w-[60vw] px-12 pt-8 pb-12'>
      <div className="flex items-center space-x-3 mb-8">
        <div className="w-10 h-10 bg-purple-600 rounded-lg flex items-center justify-center">
          <svg width="24" height="24" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="16" cy="16" r="16" fill="white"/>
            <path d="M8 12C8 10.8954 8.89543 10 10 10H22C23.1046 10 24 10.8954 24 12V20C24 21.1046 23.1046 22 22 22H10C8.89543 22 8 21.1046 8 20V12Z" fill="#8B5CF6"/>
            <path d="M24 14H26C27.1046 14 28 14.8954 28 16V16C28 17.1046 27.1046 18 26 18H24V14Z" fill="#8B5CF6"/>
            <path d="M6 20L10 16L14 18L18 12L22 14L26 10" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <text x="16" y="19" textAnchor="middle" fill="white" fontFamily="Arial, sans-serif" fontSize="8" fontWeight="bold">₹</text>
          </svg>
        </div>
        <h2 className='text-2xl font-bold text-black'>ExpenseIQ</h2>
      </div>
      {children}
    </div>

<div className="hidden md:block w-[40vw] h-screen bg-violet-50 bg-cover bg-no-repeat bg-center overflow-hidden p-8 relative">
  <div className="w-48 h-48 rounded-[40px] bg-purple-600 absolute -top-7 -left-5"/>
  <div className="w-48 h-56 rounded-[40px] border-[20px] border-fuchsia-600 absolute top-[30%] -right-10"/>
  <div className="w-48 h-48 rounded-[40px] bg-violet-500 absolute -bottom-7 -left-7"/>

  <div className="grid grid-cols-1 z-20">
    <StatsInfoCard
      icon={<LuTrendingUpDown />}
      label="Track Your Income & Expenses"
      value="430,000"
      color="bg-purple-600"
    />
  </div>

  <img
    src={CARD2}
    className="w-64 lg:w-[90%] absolute bottom-10 shadow-lg shadow-blue-400/10"
  />
</div>
</div>;

};
 
const StatsInfoCard = ({ icon, label, value, color }) => {
    return (
      <div className="flex gap-6 bg-white p-4 rounded-xl shadow-md shadow-purple-400/10 border border-gray-200/50 z-10">
        <div
          className={`w-12 h-12 flex items-center justify-center text-[26px] text-white ${color} rounded-full drop-shadow-xl`}
        >
          {icon}
        </div>
        <div>
          <h6 className="text-xs text-gray-500 mb-1">{label}</h6>
          <span className="text-[20px]">{value}</span>
        </div>
      </div>
    );
  };
  
export default AuthLayout;
