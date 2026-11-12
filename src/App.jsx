
import { Routes, Route, useLocation } from "react-router-dom";
import AdminRoute from "./components/AdminRoute";
import Navbar from "./components/Navbar";

import Home from "./pages/Home";
import Perfumes from "./pages/Perfumes";
import Gifts from "./pages/Gifts";
import Surprises from "./pages/Surprises";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Cart from "./pages/Cart";
import Gloss from "./pages/KGloss";

import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";

function App() {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith("/admin");

  return (
    <>
      {!isAdminRoute && <Navbar />}

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/perfumes" element={<Perfumes />} />
        <Route path="/gifts" element={<Gifts />} />
        <Route path="/surprises" element={<Surprises />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/kgloss" element={<Gloss />} />

        <Route path="/admin" element={<AdminLogin />} />
        <Route 
          path="/admin/dashboard"
          element={
          <AdminRoute>
            <AdminDashboard />
          </AdminRoute>
          }
        />
      </Routes>
    </>
  );
}

export default App;
