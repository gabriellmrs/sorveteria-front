import { Navigate, Outlet } from 'react-router-dom';

function parseJwt(token) {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (e) {
    return null;
  }
}

const PrivateRoute = () => {
  const token = localStorage.getItem('token');
  if (!token) return <Navigate to="/" replace />;

  const decoded = parseJwt(token);
  if (!decoded) {
    localStorage.removeItem('token');
    return <Navigate to="/" replace />;
  }

  const currentTime = Date.now() / 1000;
  if (decoded.exp && decoded.exp < currentTime) {
    localStorage.removeItem('token');
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default PrivateRoute;
