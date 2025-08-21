import { Routes, Route, Navigate, Link } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext.jsx';
import LoginPage from './pages/LoginPage.jsx';
import RegisterPage from './pages/RegisterPage.jsx';
import MuiDashboard from './pages/MuiDashboard.jsx';
import { AppBar, Toolbar, Typography, Box, Switch, Button } from '@mui/material';

function ProtectedRoute({ children }) {
  const { token } = useAuth();
  if (!token) return <Navigate to="/login" replace />;
  return children;
}

function Layout({ children }) {
  const { token, logout, useMock, setUseMock } = useAuth();
  return (
    <div>
      <AppBar position="static" color="transparent" enableColorOnDark sx={{ background: 'rgba(18,26,43,.7)', backdropFilter: 'blur(8px)', mb: 2 }}>
        <Toolbar>
          <Typography variant="h6" sx={{ fontWeight: 700 }} component={Link} to="/" style={{ color: 'inherit', textDecoration: 'none' }}>
            SmartMock
          </Typography>
          <Box sx={{ flexGrow: 1 }} />
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography variant="body2">Use Mock</Typography>
            <Switch checked={useMock} onChange={(e) => setUseMock(e.target.checked)} />
            {token ? (
              <Button color="inherit" onClick={logout}>Logout</Button>
            ) : (
              <>
                <Button color="inherit" component={Link} to="/login">Login</Button>
                <Button color="inherit" component={Link} to="/register">Register</Button>
              </>
            )}
          </Box>
        </Toolbar>
      </AppBar>
      <Box sx={{ px: 2 }}>{children}</Box>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <Layout>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <MuiDashboard />
              </ProtectedRoute>
            }
          />
        </Routes>
      </Layout>
    </AuthProvider>
  );
}


