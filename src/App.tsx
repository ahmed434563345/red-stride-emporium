import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ChatWidget from "@/components/ChatWidget";
import Index from "./pages/Index";
import Products from "./pages/Products";
import ProductDetail from "./pages/ProductDetail";
import Shoes from "./pages/Shoes";
import AthleticWear from "./pages/AthleticWear";
import Outerwear from "./pages/Outerwear";
import Electronics from "./pages/Electronics";
import HomeGarden from "./pages/HomeGarden";
import Books from "./pages/Books";
import Beauty from "./pages/Beauty";
import Cart from "./pages/Cart";
import Wishlist from "./pages/Wishlist";
import Admin from "./pages/Admin";
import Search from "./pages/Search";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import Profile from "./pages/Profile";
import Checkout from "./pages/Checkout";
import PaymentSuccess from "./pages/PaymentSuccess";
import Chat from "./pages/Chat";
import NotFound from "./pages/NotFound";
import MenTShirts from "./pages/MenTShirts";
import MenJeans from "./pages/MenJeans";
import MenCapsAccessories from "./pages/MenCapsAccessories";
import WomenTShirts from "./pages/WomenTShirts";
import WomenJeans from "./pages/WomenJeans";
import WomenCapsAccessories from "./pages/WomenCapsAccessories";
import VendorSignUp from "./pages/VendorSignUp";
import VendorDashboard from "./pages/VendorDashboard";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/products" element={<Products />} />
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="/shoes" element={<Shoes />} />
          <Route path="/athletic-wear" element={<AthleticWear />} />
          <Route path="/outerwear" element={<Outerwear />} />
          <Route path="/electronics" element={<Electronics />} />
          <Route path="/home-garden" element={<HomeGarden />} />
          <Route path="/books" element={<Books />} />
          <Route path="/beauty" element={<Beauty />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/wishlist" element={<Wishlist />} />
          <Route path="/search" element={<Search />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/payment-success" element={<PaymentSuccess />} />
          <Route path="/chat" element={<Chat />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/vendor-signup" element={<VendorSignUp />} />
          <Route path="/vendor-dashboard" element={<VendorDashboard />} />
          <Route path="*" element={<NotFound />} />
          {/* --- New routes for Men --- */}
          <Route path="/men/t-shirts" element={<MenTShirts />} />
          <Route path="/men/jeans" element={<MenJeans />} />
          <Route path="/men/caps-accessories" element={<MenCapsAccessories />} />
          {/* --- New routes for Women --- */}
          <Route path="/women/t-shirts" element={<WomenTShirts />} />
          <Route path="/women/jeans" element={<WomenJeans />} />
          <Route path="/women/caps-accessories" element={<WomenCapsAccessories />} />
        </Routes>
        <ChatWidget />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
