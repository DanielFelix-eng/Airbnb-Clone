import { Routes, Route } from "react-router-dom";
import React from "react";
import { useEffect } from "react";
import Dashboard from "./pages/dashboard"; 
import  ForgotPassword from './pages/ForgotPassword'
import  ResetPassword from './pages/resetPassword'

import Floating from "./components/floating";
import LoginPage from "./pages/LoginPage";
import SigUpPage from "./pages/sigUpPage"; 
import EmailVerification from "./pages/EmailVerification";
import { useAuthStore } from './store/store'
import { Navigate } from "react-router-dom";
 //protect routes that require authentication
  const ProtectRoute = ({ children }) => {
    const { isAuthenticated, user } = useAuthStore();

    if (!isAuthenticated) {
      return <Navigate to='/login' replace />;
    }

    // your backend/model uses `isVerified` (typo in frontend was `isVeriified`)
    if (!user?.isVerified) {
      return <Navigate to='/verifyEmail' replace />;
    }

    return children;
  };

   //redirect authentiated user to  home page
 const RedirectAuthenticatedUser = ({children}) =>{
  const {isAuthenticated,user} = useAuthStore()
   if(isAuthenticated && user.isVeriified){
    return <Navigate to='/' replace /> 
   }
    return children
 }
function Home() {
  return <div>Home</div>;
}

export default function App() { 
    const {isCheckingAuth , checkAuth , isAuthenticated} =  useAuthStore()
useEffect(()=>{
   checkAuth(); 

},[checkAuth])
    
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-green-900 to-emerald-900 overflow-hidden relative">
      <Floating
        color="bg-green-500"
        size="w-64 h-64"
        top="top-[-5%]"
        left="left-[10%]"
        delay={0}
      />
      <Floating
        color="bg-emerald-500"
        size="w-48 h-48"
        top="top-[40%]"
        left="left-[70%]"
        delay={5}
      />
      <Floating
        color="bg-lime-500"
        size="w-32 h-32"
        top="top-[70%]"
        left="left-[30%]"
        delay={2}
      />

      <Routes>
        <Route path="/" element={ 
          <ProtectRoute>
            <Dashboard />
          </ProtectRoute>
          } />
        
        <Route path="/signup" element={
          <RedirectAuthenticatedUser>
             <SigUpPage />
          </RedirectAuthenticatedUser>
          } />
        <Route path="/login" element={
          <RedirectAuthenticatedUser>
             <LoginPage />
          </RedirectAuthenticatedUser>
        } />
        <Route path="/verifyEmail" element={<EmailVerification />} />
        <Route path="/resetPassword/:token" element={<ResetPassword />} />
        <Route path="/resetPassword" element={<ResetPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/forgotPassword" element={<ForgotPassword />} /> 

      </Routes>
    </div>
  );
}

 
