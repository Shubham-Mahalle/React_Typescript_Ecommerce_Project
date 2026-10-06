import { Navigate, Route, Routes } from "react-router-dom";
import { useSelector } from "react-redux";
import type { RootState } from "./redux/store";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";
import { CartPage } from "./pages/CartPage";
import { CheckoutPage } from "./pages/CheckoutPage";
import { LoginPage } from "./pages/LoginPage";
import { OrdersPage } from "./pages/OrdersPage";
import { ProductDetailsPage } from "./pages/ProductDetailsPage";
import { ProductsPage } from "./pages/ProductsPage";
import { SignupPage } from "./pages/SignupPage";

function App() {
  const user = useSelector((state: RootState) => state.auth.user);
  return (
    <>
      <Navbar />
      <Routes>
        <Route
          path="/"
          element={user ? <Navigate to="/products" replace /> : <LoginPage />}
        />
        <Route
          path="/login"
          element={user ? <Navigate to="/products" replace /> : <LoginPage />}
        />
        <Route
          path="/signup"
          element={user ? <Navigate to="/products" replace /> : <SignupPage />}
        />
        <Route element={<ProtectedRoute />}>
          <Route path="/products" element={<ProductsPage />} />
          <Route path="/products/:id" element={<ProductDetailsPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/orders" element={<OrdersPage />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <footer className="site-footer">
        <span>© {new Date().getFullYear()} ShopEasy</span>
        <span>Everyday, considered.</span>
      </footer>
    </>
  );
}
export default App;
