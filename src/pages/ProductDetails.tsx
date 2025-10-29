import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { ShoppingCart, Package, Star, ArrowLeft, Check, Shield, Truck } from "lucide-react";
import { toast } from "sonner";
import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { apiClient } from "@/services/api";
import { Product, Review } from "@/types/api";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";

const ProductDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addItem } = useCart();
  const { user } = useAuth();
  
  const [product, setProduct] = useState<Product | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  
  const [newReview, setNewReview] = useState({
    rating: 5,
    comment: "",
  });
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);

  useEffect(() => {
    if (id) {
      loadProduct();
      loadReviews();
    }
  }, [id]);

  const loadProduct = async () => {
    if (!id) return;
    
    try {
      setLoading(true);
      const productData = await apiClient.getProduct(id);
      setProduct(productData);
    } catch (error) {
      console.error("Error loading product:", error);
      toast.error("Failed to load product");
    } finally {
      setLoading(false);
    }
  };

  const loadReviews = async () => {
    if (!id) return;
    
    try {
      const reviewsData = await apiClient.getReviews(id);
      setReviews(reviewsData.reviews);
    } catch (error) {
      console.error("Error loading reviews:", error);
    }
  };

  const handleAddToCart = () => {
    if (!product) return;
    
    setIsAddingToCart(true);
    
    const productForCart = {
      _id: product._id,
      name: product.name,
      price: product.price,
      image: product.image,
      brand: product.brand,
      category: product.category,
      stock: product.stock
    };
    
    addItem(product._id, productForCart, quantity);
    setIsAddingToCart(false);
  };

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!product || !user) return;

    try {
      setIsSubmittingReview(true);
      await apiClient.addReview(product._id, { 
        username: user.username,
        rating: newReview.rating, 
        comment: newReview.comment 
      });
      toast.success("Review submitted successfully!");
      setNewReview({ rating: 5, comment: "" });
      loadReviews();
    } catch (error) {
      toast.error("Failed to submit review");
    } finally {
      setIsSubmittingReview(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen py-12 bg-muted/20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold mb-4">Loading...</h1>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen py-12 bg-muted/20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold mb-4">Product Not Found</h1>
          <Button onClick={() => navigate("/gear")}>Back to Gear</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12 bg-muted/20">
      <div className="container mx-auto px-4">
        <Button
          className="mb-6"
          onClick={() => navigate("/gear")}
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Gear
        </Button>

        <div className="grid lg:grid-cols-2 gap-12 mb-12">
          <div className="relative">
            <Card className="border-2 overflow-hidden">
              <div className="aspect-square bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center">
                {product.image ? (
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <Package className="h-32 w-32 text-primary/40" />
                )}
              </div>
            </Card>
          </div>

          <div>
            <div className="flex items-center gap-2 mb-4 flex-wrap">
              {product.stock <= 0 && (
                <Badge variant="destructive" className="text-base px-3 py-1">
                  Out of Stock
                </Badge>
              )}
            </div>

            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              {product.name}
            </h1>

            <div className="flex items-center gap-3 mb-6">
              <div className="flex items-center">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`h-5 w-5 ${
                      i < Math.floor(product.averageRating || 0)
                        ? "fill-warning text-warning"
                        : "text-muted-foreground/30"
                    }`}
                  />
                ))}
              </div>
              <span className="text-lg font-semibold">{product.averageRating?.toFixed(1) || 'No rating'}</span>
              <span className="text-muted-foreground">
                ({product.reviewCount || 0} reviews)
              </span>
            </div>

            <p className="text-xl text-muted-foreground mb-6">
              {product.description}
            </p>

            <Separator className="my-6" />

            <div className="mb-8">
              <div className="flex items-baseline gap-3 mb-4">
                <p className="text-5xl font-bold text-black">
                  R{product.price}
                </p>
              </div>

              {product.stock > 0 && (
                <div className="space-y-4">
                  <p className="text-lg font-semibold text-foreground">
                    {product.stock} in stock
                  </p>
                  
                  <div className="flex items-center gap-4">
                    <label className="font-medium">Quantity:</label>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      >
                        -
                      </Button>
                      <span className="mx-2 font-semibold">{quantity}</span>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                      >
                        +
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="flex gap-4 mb-8">
              <Button
                variant="default"
                size="lg"
                className="flex-1 text-lg h-16 bg-green-600 hover:bg-green-700 text-white"
                disabled={product.stock <= 0 || isAddingToCart}
                onClick={handleAddToCart}
              >
                <ShoppingCart className="h-5 w-5 mr-2" />
                {isAddingToCart ? "Adding..." : product.stock > 0 ? "Add to Cart" : "Out of Stock"}
              </Button>
            </div>

            {product.stock > 0 && (
              <Card className="border-success/50 bg-success/5 p-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <Check className="h-4 w-4 text-success" />
                    <span>In stock and ready to ship</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Check className="h-4 w-4 text-success" />
                    <span>Free shipping on orders over R1500</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Check className="h-4 w-4 text-success" />
                    <span>30-day money-back guarantee</span>
                  </div>
                </div>
              </Card>
            )}
          </div>
        </div>

        <Card className="border-2 mb-12">
          <div className="p-8">
            <h2 className="text-3xl font-bold mb-6">Customer Reviews</h2>
            
            {user && (
              <Card className="p-6 mb-6 bg-muted/5">
                <h3 className="text-xl font-semibold mb-4">Write a Review</h3>
                <form onSubmit={handleSubmitReview} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Rating</label>
                    <div className="flex gap-1">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <button
                          key={i}
                          type="button"
                          onClick={() => setNewReview(prev => ({ ...prev, rating: i + 1 }))}
                          className="focus:outline-none"
                        >
                          <Star
                            className={`h-6 w-6 ${
                              i < newReview.rating
                                ? "fill-warning text-warning"
                                : "text-muted-foreground/30"
                            }`}
                          />
                        </button>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">Comment</label>
                    <Textarea
                      value={newReview.comment}
                      onChange={(e) => setNewReview(prev => ({ ...prev, comment: e.target.value }))}
                      placeholder="Share your experience with this product..."
                      rows={4}
                    />
                  </div>
                  
                  <Button type="submit" disabled={isSubmittingReview || !newReview.rating || !newReview.comment.trim()}>
                    {isSubmittingReview ? "Submitting..." : "Submit Review"}
                  </Button>
                </form>
              </Card>
            )}

            <div className="space-y-6">
              {reviews.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">No reviews yet. Be the first to review this product!</p>
              ) : (
                reviews.map((review) => (
                  <Card key={review.id} className="p-6">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-semibold">{review.username}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="flex">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <Star
                                key={i}
                                className={`h-4 w-4 ${
                                  i < review.rating
                                    ? "fill-warning text-warning"
                                    : "text-muted-foreground/30"
                                }`}
                              />
                            ))}
                          </div>
                          <span className="text-sm text-muted-foreground">
                            {new Date(review.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>
                    <p className="text-muted-foreground">{review.comment}</p>
                  </Card>
                ))
              )}
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default ProductDetails;