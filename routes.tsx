import { createBrowserRouter } from 'react-router-dom';
import AgentLogin from './pages/auth/AgentLogin';
import AgentDashboard from './pages/agent/Dashboard';
import { ProtectedRoute } from './components/auth/ProtectedRoute';

// ... existing imports and routes ...

export const router = createBrowserRouter([
  // ... existing routes ...
  {
    path: '/agent/login',
    element: <AgentLogin />
  },
  {
    path: '/agent/dashboard',
    element: (
      <ProtectedRoute userType="agent">
        <AgentDashboard />
      </ProtectedRoute>
    )
  }
  // ... existing routes ...
]); 