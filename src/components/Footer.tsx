import { Fish, Facebook, Instagram, Twitter } from "lucide-react";
import { Link } from "react-router-dom";

export const Footer = () => {
  return (
    <footer className="border-t bg-blue-600 mt-auto overflow-hidden">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="relative inline-block text-2xl font-bold" style={{ animation: 'bob 3s ease-in-out infinite' }}>
                <span style={{
                  color: 'transparent',
                  WebkitTextStroke: '1px #ffffff',
                  position: 'absolute',
                  top: 0,
                  left: 0
                }}>CREMFish</span>
                <span style={{
                  color: '#ffffff',
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
            </div>
            <p className="text-sm text-white">
              South Africa's premier fishing tackle and gear store.
            </p>
          </div>

          <div className="md:text-right">
            <h3 className="font-semibold mb-4 text-white">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/" className="text-white hover:text-gray-200 transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/gear" className="text-white hover:text-gray-200 transition-colors">
                  Gear
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-white hover:text-gray-200 transition-colors">
                  About Us
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="w-full border-t border-white/20"></div>
      
      <div className="container mx-auto px-4 py-8 text-center text-sm text-white">
        <p>&copy; {new Date().getFullYear()} CREMFish. All rights reserved.</p>
      </div>
    </footer>
  );
};
