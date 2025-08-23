import React, { useState, useContext } from 'react';
import { UserContext } from '../../context/UserContext';
import AuthLayout from '../../components/AuthLayout';
import Input from '../../components/inputs/Input';
import { useNavigate } from 'react-router-dom';
import { validateEmail } from '../../Utils/helper';
import axiosInstance from '../../Utils/axiosInstance';
import { API_PATHS } from '../../Utils/apiPaths';
 
const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const {updateUser}=useContext(UserContext)
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    // Frontend validations
    if (!validateEmail(email)) {
      setError("Please enter a valid email address.");
      return;
    }
    if (!password) {
      setError("Please enter the password.");
      return;
    }
    if (password.length < 8) {
      setError("Password must be at least 8 characters long.");
      return;
    }

    setError("");

    try {
      // Quick preflight to surface backend-down early
      try {
        await axiosInstance.get('/api/health');
      } catch (_) {
        // Ignore, regular request below will show error
      }
      console.log('Attempting login with:', { email, password: '***' });
      
      const response = await axiosInstance.post(API_PATHS.AUTH.LOGIN, {
        email,
        password,
      });

      console.log('Login response:', response.data);

      const { data } = response.data;
      const { token, user } = data;

      console.log('Extracted token and user:', { token: token ? 'exists' : 'missing', user });
      
      // Ensure user data is properly formatted
      if (!user || !user._id) {
        console.error('Invalid user data received:', user);
        setError("Invalid user data received from server");
        return;
      }

      if (token) {
        console.log('Setting token in localStorage and updating user context');
        localStorage.setItem("token", token);
        updateUser(user);
        console.log('User context updated, waiting a moment before navigation...');
        
        // Add a small delay to ensure state updates are processed
        setTimeout(() => {
          console.log('Navigating to dashboard...');
          try {
            navigate("/dashboard");
            console.log('Navigation called successfully');
          } catch (navError) {
            console.error('Navigation error:', navError);
          }
        }, 100);
      } else {
        setError("Login failed. No token received.");
      }
    } catch (error) {
      if (!error.response) {
        setError("Cannot reach the server. Please ensure the backend is running on http://localhost:8000 and try again.");
      } else {
        setError(error.response?.data?.message || "Something went wrong. Please try again.");
      }
    }
  };

  return (
    <AuthLayout>
      <div className="lg:w-[70%] h-3/4 md:h-full flex flex-col justify-center">
        <div className="max-w-md w-full">
          <h3 className="text-2xl font-semibold text-black mb-2">Welcome Back</h3>
          <p className="text-sm text-slate-600 mb-8">
            Please enter your details to login
          </p>

          <form onSubmit={handleLogin} className="space-y-6">
            <Input 
              value={email}
              onChange={({target}) => setEmail(target.value)}
              label="Email Address"
              placeholder="Nikhil@example.com"
              type="email"
              required
            />
            
            <Input 
              value={password}
              onChange={({target}) => setPassword(target.value)}
              label="Password"
              placeholder="Minimum 8 characters"
              type="password"
              required
            />
            
            <div className="flex items-center justify-between">
              <label className="flex items-center">
                <input type="checkbox" className="rounded border-gray-300 text-purple-600 focus:ring-purple-500" />
                <span className="ml-2 text-sm text-gray-600">Remember me</span>
              </label>
              <a href="#" className="text-sm text-purple-600 hover:text-purple-500">
                Forgot password?
              </a>
            </div>

            {error && (
              <div className="mb-4 text-sm text-red-500 font-medium">
                {error}
              </div>
            )}

            <button
              type="submit"
              className="w-full bg-purple-600 text-white py-3 px-4 rounded-lg hover:bg-purple-700 focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transition-colors"
            >
              Sign In
            </button>
          </form>
          
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Don't have an account?{' '}
              <a href="/signUp" className="text-purple-600 hover:text-purple-500 font-medium">
                Sign up
              </a>
            </p>
          </div>
        </div>
      </div>
    </AuthLayout>
  );
};

export default Login;
