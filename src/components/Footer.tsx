import { Fish, Facebook, Instagram, Twitter } from "lucide-react";
import { Link } from "react-router-dom";

export const Footer = () => {
  return (
    <footer className="border-t bg-card mt-auto">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Fish className="h-6 w-6 text-primary" />
              <span className="font-bold text-lg">CREMFish</span>
            </div>
            <p className="text-sm text-muted-foreground">
              South Africa's premier fishing tackle and gear store.
            </p>
          </div>

          <div className="md:text-right">
            <h3 className="font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/" className="text-muted-foreground hover:text-primary transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/gear" className="text-muted-foreground hover:text-primary transition-colors">
                  Gear
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-muted-foreground hover:text-primary transition-colors">
                  About Us
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t mt-8 pt-8 text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} CREMFish. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};
