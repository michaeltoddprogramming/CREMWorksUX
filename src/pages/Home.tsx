import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Fish, Award, Users, Star } from "lucide-react";
import { Link } from "react-router-dom";
import heroImage from "@/assets/hero-fishing.jpg";
import tackleImage from "@/assets/tackle-collection.jpg";

const Home = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${heroImage})` }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-primary/80 via-primary/60 to-background"></div>
        </div>
        
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
          <h1 className="text-7xl font-bold text-primary-foreground mb-6 drop-shadow-lg">
            South Africa's Premier Fishing Store
          </h1>
          <p className="text-2xl text-primary-foreground/90 mb-8 drop-shadow-md">
            Quality tackle for our incredible SA waters
          </p>
          <div className="flex flex-row gap-4 justify-center animate-fade-in" style={{ animationDelay: "0.2s" }}>
            <Button variant="outline" size="lg" asChild className="bg-card/80 backdrop-blur-sm border-2 hover:bg-blue-800 hover:text-white transition-colors">
              <Link to="/gear">
                <span className="relative">Shop Gear</span>
              </Link>
            </Button>
            <Button variant="outline" size="lg" asChild className="bg-card/80 backdrop-blur-sm border-2 hover:bg-blue-800 hover:text-white transition-colors">
              <Link to="/about">Our Story</Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-12">Why Choose CREMFish?</h2>
          <div className="grid grid-cols-3 gap-8">
            <Card className="border-2 hover:shadow-[var(--shadow-medium)] transition-all hover:scale-105">
              <CardContent className="pt-6 text-center">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <Award className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-2">Premium Quality</h3>
                <p className="text-muted-foreground">
                  Hand-selected tackle from the world's leading brands
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 hover:shadow-[var(--shadow-medium)] transition-all hover:scale-105">
              <CardContent className="pt-6 text-center">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <Users className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-2">Expert Knowledge</h3>
                <p className="text-muted-foreground">
                  Decades of combined fishing experience to guide you
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 hover:shadow-[var(--shadow-medium)] transition-all hover:scale-105">
              <CardContent className="pt-6 text-center">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <Star className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-2">Customer First</h3>
                <p className="text-muted-foreground">
                  Exceptional service and support for every angler
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold mb-6">Explore Our Collection</h2>
              <p className="text-lg text-muted-foreground mb-6">
                From beginner-friendly starter kits to professional-grade equipment, 
                we have everything you need for your next fishing trip. Browse our 
                carefully curated selection of rods, reels, lures, and accessories.
              </p>
              <Button variant="default" size="lg" asChild>
                <Link to="/gear">Browse All Gear</Link>
              </Button>
            </div>
            <div className="relative">
              <img
                src={tackleImage}
                alt="Fishing tackle collection"
                className="rounded-lg shadow-[var(--shadow-medium)] hover:shadow-[var(--shadow-medium)] transition-all"
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
