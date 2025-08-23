import React, { useState, useContext } from "react";

import AuthLayout from '../../components/AuthLayout';
import Input from '../../components/inputs/Input';
import ProfilePhotoSelector from '../../components/inputs/ProfilePhotoSelector';
 
 
import { useNavigate } from 'react-router-dom';
import { validateEmail } from '../../Utils/helper';
import axiosInstance from '../../Utils/axiosInstance';
import { API_PATHS, BASE_URL } from '../../Utils/apiPaths';
import { uploadImage } from '../../Utils/uploadImage';

import { UserContext } from "../../context/UserContext";

 const SignUp = () => {
  const[profilePic,setProfilePic]=useState(null);
  const[fullName,setFullName]=useState("");
  const[email,setEmail]=useState("");
  const[password,setPassword]=useState("");
  const[error,setError]=useState(null);
  const {updateUser}=useContext(UserContext);
  const navigate=useNavigate();
 
  const handleSignup=async(e)=>{
    e.preventDefault();
    
    // Validation
    if (!fullName.trim()) {
      setError("Please enter your full name.");
      return;
    }
    
    if (!validateEmail(email)) {
      setError("Please enter a valid email address.");
      return;
    }
    
    if (!password) {
      setError("Please enter a password.");
      return;
    }
    
    if (password.length < 8) {
      setError("Password must be at least 8 characters long.");
      return;
    }
    
    // TODO: Add actual API call here when backend is ready
    // For now, just navigate to dashboard
    setError("");
    try{
      let profileImageUrl = "";
      if(profilePic){
        const imgUploadRes=await uploadImage(profilePic);
        profileImageUrl=imgUploadRes.imageUrl || "";
      }

      const response=await axiosInstance.post(API_PATHS.AUTH.REGISTER,{
        fullName,
        email,
        password,
        profilePhoto: profileImageUrl
      });
      const { data } = response.data;
      const { token, user } = data;
      
      if(token){
        localStorage.setItem("token",token);
        updateUser(user);
        navigate("/dashboard");
      }
    }catch(error){
      console.error('Signup error:', error);
      if (error.response && error.response.data.message){
        setError(error.response.data.message);
      } else if (error.message) {
        setError(error.message);
      } else {
        setError("Something went wrong during signup");
      }
    }
    
  };

   return (
      <AuthLayout>
        <div className='lg:w-[100%] h-auto md:h-full mt-10 md:mt-0 flex flex-col justify-center'>
          <h3 className='text-xl font-semibold text-black'>Create an Account</h3>
          <p className='text-xs text-slate-700 mt-[5px] mb-6'>join us today by entering details below</p>

          {error && (
            <div className="mb-4 text-sm text-red-500 font-medium">
              {error}
            </div>
          )}

         <form onSubmit={handleSignup} className="space-y-6">

        <ProfilePhotoSelector image={profilePic} setImage={setProfilePic}/>

          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            <Input
            value={fullName}
            onChange={({target})=>setFullName(target.value)}
            label="Full Name"
            placeholder="Nikhil"
            type="text"
            required
            />
            <Input 
              value={email}
              onChange={({target}) => setEmail(target.value)}
              label="Email Address"
              placeholder="Nikhil@example.com"
              type="email"
              required
            />
            <div className='col-span-2'> 
            <Input 
              value={password}
              onChange={({target}) => setPassword(target.value)}
              label="Password"
              placeholder="Minimum 8 characters"
              type="password"
              required
            />
            </div>
          </div>
          
          <button
            type="submit"
            className="w-full bg-purple-600 text-white py-3 px-4 rounded-lg hover:bg-purple-700 focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transition-colors"
          >
            Create Account
          </button>
         </form>

         <div className="mt-6 text-center">
           <p className="text-sm text-gray-600">
             Already have an account?{' '}
             <a href="/login" className="text-purple-600 hover:text-purple-500 font-medium">
               Sign in
             </a>
           </p>
         </div>

        </div>
      </AuthLayout>
   )
 }
 
 export default SignUp
 