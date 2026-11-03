import { createContext, useContext, useEffect, useState } from 'react';
import { iniciarSesion, obtenerPerfil } from '../services/auth';
import { getToken, setToken, clearToken } from '../utils/token';

const AuthContext = createContext(null);
export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const logout = () => {
    clearToken();
    setUser(null);
  };

  // Al abrir la app: si hay token guardado, recupera el perfil
  useEffect(() => {
    if (!getToken()) { setLoading(false); return; }
    obtenerPerfil().then(setUser).catch(logout).finally(() => setLoading(false));
  }, []);

  const login = async (correo, password, recordar = true) => {
    const { token } = await iniciarSesion(correo, password);
    setToken(token, recordar);
    setUser(await obtenerPerfil());
  };

  return (
    <AuthContext.Provider value={{ user, setUser, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}