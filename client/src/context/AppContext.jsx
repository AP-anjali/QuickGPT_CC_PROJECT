// /client/src/context/AppContext.jsx
import { createContext, useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import axios from "axios";

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_SERVER_URL || "http://localhost:3000",
});

// request interceptor → only add token if exists
axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem("token"); 

  if (token)
  {
    config.headers.Authorization = token;
  }

  return config;
});

const AppContext = createContext();

const fetchWrapper = async (url, { method = 'GET', body = null, token = null } = {}) => {
  const headers = { 'Content-Type': 'application/json' };
  if (token) headers['Authorization'] = token;

  const res = await fetch(import.meta.env.VITE_SERVER_URL + url, {
    method,
    headers,
    body: body ? JSON.stringify(body) : null,
  });

  const data = await res.json().catch(() => ({}));
  return { status: res.status, data };
};

export const AppContextProvider = ({ children }) => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [chats, setChats] = useState([]);
  const [selectedChats, setSelectedChats] = useState(null);
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');
  const [token, setToken] = useState(localStorage.getItem('token') || null);
  const [loadingUser, setLoadingUser] = useState(true);

  const fetchUser = async () => {

    if (!token) 
    { 
      setLoadingUser(false); 
      return; 
    }

    const { status, data } = await fetchWrapper('/api/users/me', { token });

    if (status === 200 && data.success)
    {
      setUser(data.user);
    } 
    else 
    {
      toast.error(data.message || 'Failed to fetch user');
      setUser(null);
      setToken(null);
      localStorage.removeItem('token');
    }
    setLoadingUser(false);
  };

  const createNewChat = async () => {

    if (!user) return toast('Login to create a new chat !');

    const { status, data } = await fetchWrapper('/api/chats', { method: 'POST', token });

    if (status === 201 && data.success)
    {
      setChats(prev => [data.chat, ...prev]);
      setSelectedChats(data.chat);
      navigate('/');
    } 
    else 
    {
      toast.error(data.message || 'Failed to create chat');
    }
  };

  const fetchUserChats = async () => {

    if (!token) return;

    const { status, data } = await fetchWrapper('/api/chats', { token });

    if (status === 200 && data.success) 
    {
      const safeChats = Array.isArray(data.chats) ? data.chats : [];
      setChats(safeChats);

      if (safeChats.length === 0) 
      {
        await createNewChat();
      } 
      else 
      {
        setSelectedChats(safeChats[0]);
      }
    } 
    else 
    {
      toast.error(data.message || 'Failed to fetch chats');
    }
  };

  useEffect(() => {
    if (theme === 'dark') document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
    
    localStorage.setItem('theme', theme);
  }, [theme]);

  useEffect(() => {
    if (user) fetchUserChats();
    else { setChats([]); setSelectedChats(null); }
  }, [user]);

  useEffect(() => {
    if (token) fetchUser();
    else { setUser(null); setLoadingUser(false); }
  }, [token]);

  const value = {
    axios: axiosInstance, navigate, user, setUser, fetchUser, chats, setChats, selectedChats, setSelectedChats,
    theme, setTheme, createNewChat, loadingUser, fetchUserChats,
    token, setToken, fetchWrapper
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useAppContext = () => useContext(AppContext);
