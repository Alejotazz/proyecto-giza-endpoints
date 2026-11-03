// El token vive en localStorage si el usuario marcó "Recordar sesión"; si no, en sessionStorage
// (se borra al cerrar el navegador).
export const getToken = () => localStorage.getItem('token') || sessionStorage.getItem('token');

export const setToken = (token, recordar = true) => {
  clearToken();
  (recordar ? localStorage : sessionStorage).setItem('token', token);
};

export const clearToken = () => {
  localStorage.removeItem('token');
  sessionStorage.removeItem('token');
};
