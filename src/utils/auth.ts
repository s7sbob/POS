import Cookies from 'js-cookie';

/** هل التوكين موجود وصالح؟ */
export const isAuthValid = () => {
  const token = Cookies.get('token');
  const exp   = Cookies.get('token_exp');
  if (!token || !exp) return false;
  return new Date(exp) > new Date();       // لم ينتهِ بعد
};

/** خزِّن التوكين ووقت انتهاءه بالدقيقة */
export const saveAuth = (token: string, expiration: string) => {
  Cookies.set('token', token, { expires: 7 });
  Cookies.set('token_exp', expiration, { expires: 7 });
};

/** امسح التوكين تمامًا */
export const clearAuth = () => {
  Cookies.remove('token');
  Cookies.remove('token_exp');
};
