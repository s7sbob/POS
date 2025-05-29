import axios from 'axios';
import Cookies from 'js-cookie';

const api = axios.create({
  baseURL: 'https://horexapi.watsorder.com',
  headers: { 'Content-Type': 'application/json' }
});

/* ▸ أضف التوكين مع كل Request */
api.interceptors.request.use((config) => {
  const token = Cookies.get('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
    config.headers.BranchID  = '123';
  config.headers.CompanyID = '123';
  return config;
});

/* ▸ رجّع رسالة واضحة عند الخطأ */
api.interceptors.response.use(
  (r) => r,
  (err) =>
    Promise.reject(
      (err.response && err.response.data) || 'Network / Server error'
    )
);

export default api;
