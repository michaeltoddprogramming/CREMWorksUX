import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { ShoppingCart, Filter, Package, Search, Clock, Star } from "lucide-react";
import { toast } from "sonner";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { apiClient } from "@/services/api";
import { Product } from "@/types/api";
import { useCart } from "../contexts/CartContext";

const Gear = () => {
  const navigate = useNavigate();
  const { addItem } = useCart();
  
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState({ min: "", max: "" });
  const [minRating, setMinRating] = useState<number>(0);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [brandSearchTerm, setBrandSearchTerm] = useState("");

  const categories = ["Rods", "Reels", "Lures", "Tackle Boxes", "Clothing", "Accessories"];

  const brands = Array.from(new Set(products.map(p => p.brand).filter(Boolean))).sort();
  
  const filteredBrands = brands.filter(brand => 
    brand.toLowerCase().includes(brandSearchTerm.toLowerCase())
  );

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      const productList = await apiClient.getProducts();
      setProducts(productList);
    } catch (error) {
      console.error("Error loading products:", error);
      toast.error("Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  const getAnglerCount = (productId: string) => {
    const hash = productId.split('').reduce((a, b) => {
      a = ((a << 5) - a) + b.charCodeAt(0);
      return a & a;
    }, 0);
    return Math.abs(hash) % 400 + 100;
  };

  const getProductBadges = (productId: string) => {
    const hash = productId.split('').reduce((a, b) => {
      a = ((a << 5) - a) + b.charCodeAt(0);
      return a & a;
    }, 0);
    
    const badges = [];
    const randomValue = Math.abs(hash);
    
    if (randomValue % 3 === 0) badges.push('trending');
    if (randomValue % 5 === 0) badges.push('featured');
    if (randomValue % 7 === 0) badges.push('popular');
    
    return badges;
  };

  const handleAddToCart = (productId: string) => {
    const product = products.find(p => p._id === productId);
    if (product) {
      addItem(productId, {
        _id: product._id,
        name: product.name,
        price: product.price,
        image: product.image,
        brand: product.brand,
        category: product.category,
        stock: product.stock
      });
    }
  };

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = selectedCategories.length === 0 || 
                           selectedCategories.some(cat => cat.toLowerCase() === product.category.toLowerCase());
    
    const matchesBrand = selectedBrands.length === 0 || 
                        selectedBrands.includes(product.brand);
    
    const matchesPrice = (!priceRange.min || product.price >= parseFloat(priceRange.min)) &&
                        (!priceRange.max || product.price <= parseFloat(priceRange.max));
    
    const matchesStock = product.stock > 0;
    
    const matchesRating = product.averageRating >= minRating;

    return matchesSearch && matchesCategory && matchesBrand && matchesPrice && matchesStock && matchesRating;
  });

  const handleCategoryChange = (category: string, checked: boolean) => {
    if (checked) {
      setSelectedCategories(prev => [...prev, category]);
    } else {
      setSelectedCategories(prev => prev.filter(c => c !== category));
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const resetFilters = () => {
    setSearchTerm("");
    setSelectedCategories([]);
    setSelectedBrands([]);
    setPriceRange({ min: "", max: "" });
    setMinRating(0);
    scrollToTop();
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">Loading products...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Premium Fishing Gear
            </h1>
            <p className="text-gray-600 text-lg mb-8">
              Discover our hand-picked selection of top-quality tackle and equipment
            </p>
            
            <div className="max-w-4xl mx-auto relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <Input
                placeholder="Search for rods, reels, lures, and more..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 py-3 text-base w-full"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex gap-8">
          {/* <div className="w-64 flex-shrink-0 sticky top-1 self-start"> */}
          <div className="w-64 flex-shrink-0 self-start">
            <div className="filter-section bg-white p-6 rounded-lg shadow-sm border">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <Filter className="h-5 w-5 text-blue-600" />
                  <h3 className="font-semibold text-lg">Filters</h3>
                </div>
                <button
                  onClick={resetFilters}
                  className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                >
                  Reset
                </button>
              </div>

              <div className="mb-6">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-medium text-gray-900">Category</h4>
                  {selectedCategories.length > 0 && (
                    <button
                      onClick={() => {
                        setSelectedCategories([]);
                        scrollToTop();
                      }}
                      className="text-xs text-blue-600 hover:text-blue-700"
                    >
                      Reset
                    </button>
                  )}
                </div>
                <div className="space-y-3">
                  <div className="flex items-center">
                    <input
                      type="radio"
                      id="all"
                      name="category"
                      checked={selectedCategories.length === 0}
                      onChange={() => {
                        setSelectedCategories([]);
                        scrollToTop();
                      }}
                      className="w-4 h-4 text-blue-600"
                    />
                    <label htmlFor="all" className="ml-2 text-sm text-gray-700 cursor-pointer">
                      All
                    </label>
                  </div>
                  {categories.map((category) => (
                    <div key={category} className="flex items-center">
                      <input
                        type="radio"
                        id={category}
                        name="category"
                        checked={selectedCategories.includes(category)}
                        onChange={() => {
                          setSelectedCategories([category]);
                          scrollToTop();
                        }}
                        className="w-4 h-4 text-blue-600"
                      />
                      <label htmlFor={category} className="ml-2 text-sm text-gray-700 cursor-pointer">
                        {category}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mb-6">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-medium text-gray-900">Price Range</h4>
                  {(priceRange.min || priceRange.max) && (
                    <button
                      onClick={() => {
                        setPriceRange({ min: "", max: "" });
                        scrollToTop();
                      }}
                      className="text-xs text-blue-600 hover:text-blue-700"
                    >
                      Reset
                    </button>
                  )}
                </div>
                <div className="space-y-3">
                  <div>
                    <label htmlFor="minPrice" className="text-sm text-gray-700 mb-1 block">Min Price (R)</label>
                    <Input
                      id="minPrice"
                      type="number"
                      placeholder="0"
                      value={priceRange.min}
                      onChange={(e) => {
                        setPriceRange(prev => ({ ...prev, min: e.target.value }));
                        scrollToTop();
                      }}
                      className="w-full"
                      min="0"
                    />
                  </div>
                  <div>
                    <label htmlFor="maxPrice" className="text-sm text-gray-700 mb-1 block">Max Price (R)</label>
                    <Input
                      id="maxPrice"
                      type="number"
                      placeholder="Any"
                      value={priceRange.max}
                      onChange={(e) => {
                        setPriceRange(prev => ({ ...prev, max: e.target.value }));
                        scrollToTop();
                      }}
                      className="w-full"
                      min="0"
                    />
                  </div>
                </div>
              </div>

              <div className="mb-6">
              </div>

              <div className="mb-6">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-medium text-gray-900">Brand</h4>
                  {selectedBrands.length > 0 && (
                    <button
                      onClick={() => {
                        setSelectedBrands([]);
                        setBrandSearchTerm("");
                        scrollToTop();
                      }}
                      className="text-xs text-blue-600 hover:text-blue-700"
                    >
                      Clear
                    </button>
                  )}
                </div>
                <div className="relative mb-3">
                  <Input
                    placeholder="Search by Brand"
                    value={brandSearchTerm}
                    onChange={(e) => setBrandSearchTerm(e.target.value)}
                    className="w-full"
                  />
                  <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                </div>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {filteredBrands.map((brand) => (
                    <div key={brand} className="flex items-center">
                      <input
                        type="checkbox"
                        id={`brand-${brand}`}
                        checked={selectedBrands.includes(brand)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedBrands(prev => [...prev, brand]);
                          } else {
                            setSelectedBrands(prev => prev.filter(b => b !== brand));
                          }
                          scrollToTop();
                        }}
                        className="w-4 h-4 text-blue-600 rounded"
                      />
                      <label htmlFor={`brand-${brand}`} className="ml-2 text-sm text-gray-700 cursor-pointer">
                        {brand}
                      </label>
                    </div>
                  ))}
                  {filteredBrands.length === 0 && brandSearchTerm && (
                    <p className="text-sm text-gray-500 text-center py-2">No brands found</p>
                  )}
                </div>
              </div>

              <div className="mb-6">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-medium text-gray-900">Minimum Rating</h4>
                  {minRating > 0 && (
                    <button
                      onClick={() => {
                        setMinRating(0);
                        scrollToTop();
                      }}
                      className="text-xs text-blue-600 hover:text-blue-700"
                    >
                      Reset
                    </button>
                  )}
                </div>
                <input
                  type="range"
                  min="0"
                  max="5"
                  step="1"
                  value={minRating}
                  onChange={(e) => {
                    setMinRating(Number(e.target.value));
                    scrollToTop();
                  }}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                />
                <div className="flex justify-between mt-2">
                  {[0, 1, 2, 3, 4, 5].map((rating) => (
                    <div key={rating} className="flex flex-col items-center">
                      <Star className={`w-4 h-4 ${rating <= minRating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} />
                      <span className="text-xs text-gray-600 mt-1">{rating}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="flex-1">
            {filteredProducts.length === 0 ? (
              <div className="text-center py-12">
                <Package className="h-16 w-16 mx-auto text-gray-400 mb-4" />
                <h3 className="text-xl font-semibold mb-2">No products found</h3>
                <p className="text-gray-600">Try adjusting your filters or search terms</p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredProducts.map((product) => (
                  <div key={product._id} className="product-card group cursor-pointer flex" onClick={() => navigate(`/gear/${product._id}`)}>
                    <div className="relative w-64 h-48 flex-shrink-0">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover rounded-l-xl"
                      />
                      <div className="absolute top-3 left-3 flex flex-wrap gap-1">
                        {getProductBadges(product._id).map((badge) => {
                          if (badge === 'trending') return <span key="trending" className="badge-trending">Trending</span>;
                          if (badge === 'featured') return <span key="featured" className="badge-featured">Featured</span>;
                          if (badge === 'popular') return <span key="popular" className="badge-popular">Popular</span>;
                          return null;
                        })}
                        <span className="badge-rods">{product.category.charAt(0).toUpperCase() + product.category.slice(1)}</span>
                      </div>
                    </div>
                    
                    <div className="flex-1 p-6 flex flex-col justify-between">
                      <div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">
                          {product.name}
                        </h3>
                        
                        <div className="star-rating mb-3">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} className={`w-4 h-4 ${i < Math.floor(product.averageRating) ? 'fill-current' : 'text-gray-300'}`} />
                          ))}
                          <span className="ml-2 text-sm text-gray-600 font-medium">
                            {product.averageRating.toFixed(1)} ({product.reviewCount} reviews)
                          </span>
                        </div>
                        
                        <p className="text-gray-600 mb-4 text-sm leading-relaxed">
                          {product.description.length > 150 
                            ? `${product.description.substring(0, 150)}...` 
                            : product.description}
                        </p>
                        
                        <div className="flex items-center gap-2 mb-4">
                          <span className="text-sm text-gray-600">
                            {getAnglerCount(product._id)}+ anglers already own this
                          </span>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="price-text">
                          R{product.price.toFixed(2)}
                        </div>
                        <div className="flex gap-2">
                          <button 
                            className="btn-add-cart"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleAddToCart(product._id);
                            }}
                            disabled={product.stock === 0}
                          >
                            Add to Cart
                          </button>
                          <button 
                            className="btn-details"
                            onClick={(e) => {
                              e.stopPropagation();
                              navigate(`/gear/${product._id}`);
                            }}
                          >
                            Details
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Gear;
