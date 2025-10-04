import { Link, useLocation } from "react-router-dom";
import { Fish, ShoppingCart, Info, LogIn, LogOut, User, Settings } from "lucide-react";
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
          <Link to="/" className="flex items-center gap-2 text-xl font-bold text-blue-600 hover:opacity-80 transition-opacity">
            <Fish className="h-7 w-7 text-blue-600" />
            <span>CREMFish</span>
          </Link>

          <div className="hidden md:flex items-center gap-8 absolute left-1/2 transform -translate-x-1/2">
            <Link
              to="/"
              className={`relative font-medium transition-all ${
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
              className={`flex items-center gap-2 font-medium transition-all ${
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
              className={`flex items-center gap-2 font-medium transition-all ${
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

                <Link to="/cart" className="relative p-2 hover:opacity-80 transition-opacity">
                  <ShoppingCart className="h-5 w-5 text-blue-600" />
                  {count > 0 && (
                    <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center text-xs bg-blue-600 text-white rounded-full">
                      {count}
                    </Badge>
                  )}
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
