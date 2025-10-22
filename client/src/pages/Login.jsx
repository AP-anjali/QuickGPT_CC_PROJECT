// /client/src/pages/Login.jsx

import React, { useState } from "react";
import { useAppContext } from "../context/AppContext";
import toast from "react-hot-toast";

const Login = () => {
  const [state, setState] = useState("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { axios, setToken } = useAppContext();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const url = state === "login" ? '/api/user/login' : '/api/user/register';

    try 
    {
      const {data} = await axios.post(url, {name, email, password});

      if(data.success)
      {
        setToken(data.token);
        localStorage.setItem('token', data.token);
      }
      else
      {
        toast.error(data.message);
      }
    } 
    catch (error) 
    {
      toast.error(error.message);
    }
  };

  return (
    <div className="flex h-screen w-full items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-md rounded-2xl bg-white shadow-xl p-8 border border-gray-200">
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          {/* Title */}
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-800">
              {state === "login" ? "Sign in" : "Sign up"}
            </h2>
            <p className="text-gray-500 mt-2">
              {state === "login" ? "Welcome back! Please sign in to continue" : "Create your account to get started"}
            </p>
          </div>

          {/* Google Button */}
          <button type="button" className="w-full flex items-center justify-center h-12 rounded-full bg-gray-100 hover:bg-gray-200 transition border border-gray-300 text-gray-700 font-medium">
                <img className="h-4 w-4 mr-2" src="https://raw.githubusercontent.com/prebuiltui/prebuiltui/main/assets/login/googleFavicon.png" alt="googleFavicon" />
                Continue with Google
            </button>

          {/* Divider */}
          <div className="flex items-center gap-3">
            <div className="h-px flex-1 bg-gray-300"></div>
            <p className="text-gray-500 text-sm"> or {state === "login" ? "sign in" : "sign up"} with email
            </p>
            <div className="h-px flex-1 bg-gray-300"></div>
          </div>

          {/* Name (only for register) */}
          {state === "register" && (
            <div className="flex items-center w-full bg-white border border-gray-300 h-12 rounded-full px-4 overflow-hidden pl-6 gap-2 mt-2">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="#6B7280" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.5 20.25a8.25 8.25 0 1115 0v.75H4.5v-.75z" />
              </svg>
              <input type="text" placeholder="Full name" value={name} onChange={(e) => setName(e.target.value)} className="bg-transparent text-gray-700 placeholder-gray-500/80 outline-none text-md w-full h-full" required />
            </div>
          )}

          {/* Email */}
          <div className="flex items-center w-full bg-white border border-gray-300 h-12 rounded-full px-4 overflow-hidden pl-6 gap-2 mt-2">
            <svg width="16" height="11" viewBox="0 0 16 11" fill="none" xmlns="http://www.w3.org/2000/svg" >
              <path fillRule="evenodd" clipRule="evenodd" d="M0 .55.571 0H15.43l.57.55v9.9l-.571.55H.57L0 10.45zm1.143 1.138V9.9h13.714V1.69l-6.503 4.8h-.697zM13.749 1.1H2.25L8 5.356z" fill="#6B7280" />
            </svg>
            <input type="email" placeholder="Email id" value={email} onChange={(e) => setEmail(e.target.value)} className="bg-transparent text-gray-700 placeholder-gray-500/80 outline-none text-md w-full h-full" required />
          </div>

          {/* Password */}
          <div className="flex items-center w-full bg-white border border-gray-300 h-12 rounded-full px-4 overflow-hidden pl-6 gap-2 mt-2">
            <svg width="13" height="17" viewBox="0 0 13 17" fill="none" xmlns="http://www.w3.org/2000/svg" >
              <path d="M13 8.5c0-.938-.729-1.7-1.625-1.7h-.812V4.25C10.563 1.907 8.74 0 6.5 0S2.438 1.907 2.438 4.25V6.8h-.813C.729 6.8 0 7.562 0 8.5v6.8c0 .938.729 1.7 1.625 1.7h9.75c.896 0 1.625-.762 1.625-1.7zM4.063 4.25c0-1.406 1.093-2.55 2.437-2.55s2.438 1.144 2.438 2.55V6.8H4.061z" fill="#6B7280" />
            </svg>
            <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} className="bg-transparent text-gray-700 placeholder-gray-500/80 outline-none text-md w-full h-full" required />
          </div>

          {/* Submit */}
          <button type="submit" className="mt-2 h-12 rounded-lg text-white font-semibold bg-indigo-500 hover:bg-indigo-600 transition" >
            {state === "login" ? "Login" : "Create Account"}
          </button>

          {/* Toggle */}
          <p className="text-gray-600 text-sm text-center">
            {state === "login" ? (
              <>
                Don't have an account?{" "}
                <span className="text-indigo-500 hover:underline cursor-pointer" onClick={() => setState("register")} >
                  Sign up
                </span>
              </>
            ) : (
              <>
                Already have an account?{" "}
                <span className="text-indigo-500 hover:underline cursor-pointer" onClick={() => setState("login")} >
                  Login
                </span>
              </>
            )}
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;
