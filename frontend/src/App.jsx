import { useEffect } from 'react'
import './App.css'
import { Navigate, Route, Routes } from 'react-router-dom'
import AdminRoutes  from './routes/AdminRoutes'
import TaskerRoutes from './routes/TaskerRoutes'
import UserRoutes   from './routes/UserRoutes'
import Login        from './pages/auth/Login'
import Signup       from './pages/auth/Signup'
import NotFound     from './pages/NotFound'
import AOS          from 'aos'
import 'aos/dist/aos.css'
import { useAuth }  from './context/AuthContext'
import { Toaster }  from 'react-hot-toast'

function App() {
  const { userRole } = useAuth();

  useEffect(() => {
    AOS.init({ duration: 900, once: false, easing: 'ease-in-out' });
  }, []);

  return (
    <>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#0a0a0a', color: '#fff',
            border: '1px solid rgba(255,255,255,0.1)',
            padding: '16px', borderRadius: '15px',
            fontSize: '11px', fontWeight: '900',
            textTransform: 'uppercase', letterSpacing: '0.1em',
          },
          success: { style: { borderTop: '4px solid #10b981' }, iconTheme: { primary: '#10b981', secondary: '#000' } },
          error:   { style: { borderTop: '4px solid #ef4444' }, iconTheme: { primary: '#ef4444', secondary: '#000' } },
        }}
      />

      <Routes>
        <Route path="/login"  element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {userRole === 'hirer'  && <Route path="/*" element={<UserRoutes />} />}
        {userRole === 'admin'  && <Route path="/*" element={<AdminRoutes />} />}
        {userRole === 'tasker' && <Route path="/*" element={<TaskerRoutes />} />}

        {!userRole && <Route path="*" element={<Navigate to="/login" replace />} />}
      </Routes>
    </>
  )
}

export default App
