import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import AdminLayout from './layouts/AdminLayout';
import CustomerLayout from './layouts/CustomerLayout';
import Login from './pages/admin/Login';
import Dashboard from './pages/admin/Dashboard';
import Cars from './pages/admin/Cars';
import CarForm from './pages/admin/CarForm';
import Employees from './pages/admin/Employees';
import EmployeeForm from './pages/admin/EmployeeForm';
import Sales from './pages/admin/Sales';
import SaleForm from './pages/admin/SaleForm';
import Customers from './pages/admin/Customers';
import CustomerForm from './pages/admin/CustomerForm';
import Expenses from './pages/admin/Expenses';
import ExpenseForm from './pages/admin/ExpenseForm';
import Reports from './pages/admin/Reports';
import Settings from './pages/admin/Settings';
import Inquiries from './pages/admin/Inquiries';
import PublicHome from './pages/customer/Home';
import PublicCarDetail from './pages/customer/CarDetail';
import Wishlist from './pages/customer/Wishlist';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Customer Portal Routes - Completely Separate */}
          <Route path="/" element={<CustomerLayout />}>
            <Route index element={<PublicHome />} />
            <Route path="car/:id" element={<PublicCarDetail />} />
            <Route path="wishlist" element={<Wishlist />} />
          </Route>

          {/* Admin Portal Routes - Requires Login */}
          {/* Login page - accessible without auth */}
          <Route path="/admin/login" element={<Login />} />
          
          {/* All admin routes are protected - redirect to login if not authenticated */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <AdminLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Navigate to="/admin/dashboard" replace />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="cars" element={<Cars />} />
            <Route path="cars/new" element={<CarForm />} />
            <Route path="cars/:id/edit" element={<CarForm />} />
            <Route path="employees" element={<Employees />} />
            <Route path="employees/new" element={<EmployeeForm />} />
            <Route path="employees/:id/edit" element={<EmployeeForm />} />
            <Route path="sales" element={<Sales />} />
            <Route path="sales/new" element={<SaleForm />} />
            <Route path="sales/:id" element={<SaleForm />} />
            <Route path="customers" element={<Customers />} />
            <Route path="customers/new" element={<CustomerForm />} />
            <Route path="customers/:id/edit" element={<CustomerForm />} />
            <Route path="expenses" element={<Expenses />} />
            <Route path="expenses/new" element={<ExpenseForm />} />
            <Route path="expenses/:id/edit" element={<ExpenseForm />} />
            <Route path="inquiries" element={<Inquiries />} />
            <Route path="reports" element={<Reports />} />
            <Route path="settings" element={<Settings />} />
          </Route>

          {/* Catch all - redirect to home */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;


