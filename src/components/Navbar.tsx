import { Link, useLocation } from "react-router-dom";
import { Fish, ShoppingCart, Info, LogIn, LogOut, User, Settings, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/AuthContext";
import { useCart } from "../contexts/CartContext";

export const Navbar = () => {
  const location = useLocation();
  const { isAuthenticated, user, logout, isAdmin } = useAuth();
  const { count } = useCart();

  const handleLogout = () => {
    logout();
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="sticky top-0 z-50 border-b bg-white backdrop-blur-sm shadow-[var(--shadow-soft)]">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <div className="relative inline-block text-3xl font-bold" style={{ animation: 'bob 3s ease-in-out infinite' }}>
              <span style={{
                color: 'transparent',
                WebkitTextStroke: '1px #2563eb',
                position: 'absolute',
                top: 0,
                left: 0
              }}>CREMFish</span>
              <span style={{
                color: '#2563eb',
                WebkitTextStroke: '0px',
                animation: 'wave 3s ease-in-out infinite'
              }}>CREMFish</span>
            </div>
            <style>{`
              @keyframes wave {
                0%, 100% { clip-path: polygon(0% 45%, 15% 44%, 32% 50%, 54% 60%, 70% 61%, 84% 59%, 100% 52%, 100% 100%, 0% 100%);}
                50% { clip-path: polygon(0% 60%, 16% 65%, 34% 66%, 51% 62%, 67% 50%, 84% 45%, 100% 46%, 100% 100%, 0% 100%);}
              }
              @keyframes bob {
                0%, 100% { transform: translateY(0); }
                50% { transform: translateY(5px); }
              }
            `}</style>
          </Link>

          <div className="flex items-center gap-8 absolute left-1/2 transform -translate-x-1/2">
            <Link
              to="/"
              className={`relative text-xl font-medium transition-all ${
                isActive("/") ? "text-blue-600" : "text-blue-600 hover:text-blue-800"
              }`}
            >
              <span className="relative">
                Home
                {isActive("/") && (
                  <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-blue-600 animate-fade-in"></span>
                )}
              </span>
            </Link>
            <Link
              to="/gear"
              className={`flex items-center gap-2 text-xl font-medium transition-all ${
                isActive("/gear") ? "text-blue-600" : "text-blue-600 hover:text-blue-800"
              }`}
            >
              <span className="relative">
                Gear
                {isActive("/gear") && (
                  <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-blue-600 animate-fade-in"></span>
                )}
              </span>
            </Link>
            <Link
              to="/about"
              className={`flex items-center text-xl gap-2 font-medium transition-all ${
                isActive("/about") ? "text-blue-600" : "text-blue-600 hover:text-blue-800"
              }`}
            >
              <span className="relative">
                About Us
                {isActive("/about") && (
                  <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-blue-600 animate-fade-in"></span>
                )}
              </span>
            </Link>
          </div>

          <div className="flex items-center gap-3">
            {isAuthenticated ? (
              <>
                <span className="text-sm text-blue-600">
                  Welcome, {user?.username} {isAdmin && "(Admin)"}
                </span>

                
                <Link
                  to="/orders"
                  className="flex items-center gap-2 font-medium text-blue-600 hover:text-blue-800 transition-all"
                >
                  <Package className="h-4 w-4 text-blue-600" />
                  Orders
                </Link>
                
                <Link
                  to="/cart"
                  className="flex items-center gap-2 font-medium text-blue-600 hover:text-blue-800 transition-all"
                >
                  <div className="relative">
                    <ShoppingCart className="h-5 w-5 text-blue-600" />
                    {count > 0 && (
                      <Badge className="absolute -top-3 -right-3 h-4 w-4 flex items-center justify-center text-xs bg-blue-600 text-white rounded-full">
                        {count}
                      </Badge>
                    )}
                  </div>
                  Cart
                </Link>

                

                {isAdmin && (
                  <Link
                    to="/admin"
                    className="flex items-center gap-2 font-medium text-blue-600 hover:text-blue-800 transition-all"
                  >
                    <Settings className="h-4 w-4 text-blue-600" />
                    Admin
                  </Link>
                )}

                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 font-medium text-blue-600 hover:text-blue-800 transition-all"
                >
                  <LogOut className="h-4 w-4 text-blue-600" />
                  Logout
                </button>
              </>
            ) : (
              <Link
                to="/auth"
                className="flex items-center gap-2 font-medium text-blue-600 hover:text-blue-800 transition-all"
              >
                <LogIn className="h-4 w-4 text-blue-600" />
                Login
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};
