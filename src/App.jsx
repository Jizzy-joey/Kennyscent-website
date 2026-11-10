import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Perfumes from "./pages/Perfumes";
import Gifts from "./pages/Gifts";
import Surprises from "./pages/Surprises";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Cart from "./pages/Cart";
import Gloss from "./pages/KGloss";

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/perfumes" element={<Perfumes />} />
        <Route path="/gifts" element={<Gifts />} />
        <Route path="/surprises" element={<Surprises />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/kgloss" element={<Gloss />} />
      </Routes>
    </>
  );
}

export default App;