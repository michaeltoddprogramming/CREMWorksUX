import { useRef, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { useCart } from "../contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import { ShoppingCart, Minus, Plus, Trash2, ShoppingBag, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { Link, useNavigate } from "react-router-dom";
import { useEffect } from "react";

const Cart = () => {
  const { items, updateQuantity, removeItem, total, clearCart } = useCart();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const didRun = useRef(false);

  const [quantityChanged, setQuantity] = useState(false);
  const [showCheckout, setShowCheckout] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [customerInfo, setCustomerInfo] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: {
      street: '',
      city: '',
      state: '',
      zipCode: '',
      country: 'United States'
    },
    paymentMethod: 'credit_card'
  });

  useEffect(() => {
    console.log("These are the items in the cart:", items);
    
    const syncCart = async () => {
      if (didRun.current) return;
      didRun.current = true;
      console.log("Cat is updated");
      if (!isAuthenticated || items.length === 0) return;

      try {
        const token = localStorage.getItem("token");

        // Loop through all items and call your add-to-cart endpoint
        for (const item of items) {
          await fetch("http://localhost:3000/api/cart/add", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              productId: item._id,
              quantity: item.quantity,
            }),
          });
        }
      } catch (err) {
        console.error("Failed to sync cart:", err);
      }
    };

    syncCart();
  }, [quantityChanged]);

  const handleQuantityChange = async (productId: string, newQuantity: number) => {

    if (newQuantity < 1) {
      
      removeItem(productId);
      try {
        const token = localStorage.getItem("token");
  
        // Loop through all items and call your add-to-cart endpoint
          await fetch(`http://localhost:3000/api/cart/remove/${productId}`, {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          });
      } catch (err) {
        console.error("Failed to sync cart:", err);
      }
    } 
    else 
    {
      updateQuantity(productId, newQuantity);
      try {
        const token = localStorage.getItem("token");

        // Loop through all items and call your add-to-cart endpoint
          await fetch("http://localhost:3000/api/cart/update", {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              productId: productId,
              quantity: newQuantity,
            }),
          });
      } catch (err) {
        console.error("Failed to sync cart:", err);
      }
    }
    // if(didRun.current)
    // {
    //   didRun.current = false;
    // }

    // setQuantity(!quantityChanged);
  };
  
  const handleRemoveItem = async (productId: string) => {      
      removeItem(productId);
      try {
        const token = localStorage.getItem("token");
  
        // Loop through all items and call your add-to-cart endpoint
          await fetch(`http://localhost:3000/api/cart/remove/${productId}`, {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          });
      } catch (err) {
        console.error("Failed to sync cart:", err);
      }
  };

  const handleCheckout = () => {
    if (!isAuthenticated) {
      toast.error("Please log in to checkout");
      navigate("/auth");
      return;
    }

    if (items.length === 0) {
      toast.error("Your cart is empty");
      return;
    }

    setShowCheckout(true);
  };

  const handleProcessOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!customerInfo.firstName || !customerInfo.lastName || !customerInfo.email || !customerInfo.address.street) {
      toast.error("Please fill in all required fields");
      return;
    }

    // setIsProcessing(true);
    
    try {
      setIsProcessing(true);
      // await new Promise(resolve => setTimeout(resolve, 2000));

      const response = await fetch('http://localhost:3000/api/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
      });

      const data = await response.json();
      

      if (!response.ok) {
        toast.error(data.message || "Failed to process order");
        return;
      }

      toast.success(`Order placed successfully!`);
      clearCart();
      setShowCheckout(false);
      setCustomerInfo({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        address: {
          street: '',
          city: '',
          state: '',
          zipCode: '',
          country: 'United States'
        },
        paymentMethod: 'credit_card'
      });
      navigate("/");

    } catch (error) {
      console.error(error);
      toast.error("Failed to process order. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    if (field.startsWith('address.')) {
      const addressField = field.split('.')[1];
      setCustomerInfo(prev => ({
        ...prev,
        address: { ...prev.address, [addressField]: value }
      }));
    } else {
      setCustomerInfo(prev => ({ ...prev, [field]: value }));
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <ShoppingCart className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
          <h1 className="text-2xl font-bold mb-2">Please Log In</h1>
          <p className="text-muted-foreground mb-6">You need to be logged in to view your cart</p>
          <Button asChild>
            <Link to="/auth">Login</Link>
          </Button>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <ShoppingBag className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
          <h1 className="text-2xl font-bold mb-2">Your Cart is Empty</h1>
          <p className="text-muted-foreground mb-6">Add some fishing gear to get started!</p>
          <Button asChild>
            <Link to="/gear">Browse Products</Link>
          </Button>
        </div>
      </div>
    );
  }

  if (showCheckout) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="mb-6">
          <Button 
            className="mb-4"
            onClick={() => setShowCheckout(false)}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Cart
          </Button>
          <h1 className="text-3xl font-bold">Checkout</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Shipping Information</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleProcessOrder} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="firstName" className="form-label">First Name *</Label>
                      <Input
                        id="firstName"
                        className="form-input"
                        value={customerInfo.firstName}
                        onChange={(e) => handleInputChange('firstName', e.target.value)}
                        required
                        placeholder="John"
                      />
                    </div>
                    <div>
                      <Label htmlFor="lastName" className="form-label">Last Name *</Label>
                      <Input
                        id="lastName"
                        className="form-input"
                        value={customerInfo.lastName}
                        onChange={(e) => handleInputChange('lastName', e.target.value)}
                        required
                        placeholder="Doe"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="email" className="form-label">Email Address *</Label>
                    <Input
                      id="email"
                      type="email"
                      className="form-input"
                      value={customerInfo.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      required
                      placeholder="john.doe@example.com"
                    />
                  </div>

                  <div>
                    <Label htmlFor="phone" className="form-label">Phone Number</Label>
                    <Input
                      id="phone"
                      type="number"
                      className="form-input"
                      value={customerInfo.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      placeholder="011 123 4567"
                    />
                  </div>

                  <div>
                    <Label htmlFor="street" className="form-label">Street Address *</Label>
                    <Input
                      id="street"
                      className="form-input"
                      value={customerInfo.address.street}
                      onChange={(e) => handleInputChange('address.street', e.target.value)}
                      required
                      placeholder="123 Jan Smuts Avenue"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="city" className="form-label">City *</Label>
                      <Input
                        id="city"
                        className="form-input"
                        value={customerInfo.address.city}
                        onChange={(e) => handleInputChange('address.city', e.target.value)}
                        required
                        placeholder="Johannesburg"
                      />
                    </div>
                    <div>
                      <Label htmlFor="state" className="form-label">Province *</Label>
                      <Input
                        id="state"
                        className="form-input"
                        value={customerInfo.address.state}
                        onChange={(e) => handleInputChange('address.state', e.target.value)}
                        required
                        placeholder="Gauteng"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="zipCode" className="form-label">Postal Code *</Label>
                    <Input
                      id="zipCode"
                      type="number"
                      className="form-input"
                      value={customerInfo.address.zipCode}
                      onChange={(e) => handleInputChange('address.zipCode', e.target.value)}
                      required
                      placeholder="2196"
                    />
                  </div>

                  <div className="pt-4">
                    <Button 
                      type="submit"
                      className="w-full bg-green-600 hover:bg-green-700 text-white py-3 text-lg font-medium"
                      disabled={isProcessing}
                    >
                      {isProcessing ? 'Processing Order...' : 'Place Order'}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>

          <div>
            <Card className="sticky top-4">
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {items.map((item) => (
                    <div key={item._id} className="flex items-center gap-3">
                      <img
                        src={item.image || '/placeholder.svg'}
                        alt={item.name}
                        className="w-12 h-12 object-cover rounded"
                      />
                      <div className="flex-1">
                        <h4 className="font-medium text-sm">{item.name}</h4>
                        <p className="text-xs text-muted-foreground">Qty: {item.quantity}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">R{(item.price * item.quantity).toFixed(2)}</p>
                      </div>
                    </div>
                  ))}
                  
                  <Separator />
                  
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Subtotal:</span>
                      <span>R{total.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Shipping:</span>
                      <span>{(total * 1.15) >= 1500 ? 'Free' : 'R150.00'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>VAT (15%):</span>
                      <span>R{(total * 0.15).toFixed(2)}</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between font-bold text-lg">
                      <span>Total:</span>
                      <span>R{((total * 1.15) + ((total * 1.15) >= 1500 ? 0 : 150)).toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 flex items-center gap-2">
        <ShoppingCart className="h-8 w-8" />
        Shopping Cart
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          {items.map((item) => (
            <Card key={item._id} className="mb-4">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <img
                    src={item.image || '/placeholder.svg'}
                    alt={item.name}
                    className="w-20 h-20 object-cover rounded-lg"
                  />
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg">{item.name}</h3>
                    <p className="text-muted-foreground">{item.brand || 'No Brand'}</p>
                    {(item.stock || 0) < 10 && (
                      <div className="mt-2">
                        <Badge className="bg-red-500 text-white">Low Stock ({item.stock || 0})</Badge>
                      </div>
                    )}
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold">
                      R{item.price.toFixed(2)}
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      <button
                        className="px-2 py-1 border-0 bg-transparent cursor-pointer"
                        onClick={() => handleQuantityChange(item._id, item.quantity - 1)}
                      >
                        <Minus className="h-4 w-4" />
                      </button>
                      <span className="w-12 text-center">{item.quantity}</span>
                      <button
                        className="px-2 py-1 border-0 bg-transparent cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                        onClick={() => handleQuantityChange(item._id, item.quantity + 1)}
                        disabled={item.quantity >= (item.stock || 999)}
                      >
                      <Plus className="h-4 w-4" />
                      </button>
                      <Button
                        className="bg-red-500 hover:bg-red-600 text-white px-2 py-1"
                        onClick={() => handleRemoveItem(item._id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="lg:col-span-1">
          <Card className="sticky top-4">
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span>R{total.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping:</span>
                  <span>{(total * 1.15) >= 1500 ? 'Free' : 'R150.00'}</span>
                </div>
                <div className="flex justify-between">
                  <span>VAT (15%):</span>
                  <span>R{(total * 0.15).toFixed(2)}</span>
                </div>
                <Separator />
                <div className="flex justify-between font-bold text-lg">
                  <span>Total:</span>
                  <span>R{((total * 1.15) + ((total * 1.15) >= 1500 ? 0 : 150)).toFixed(2)}</span>
                </div>
              </div>
              <Button 
                className="bg-green-600 hover:bg-green-700 text-white w-full mt-6" 
                onClick={handleCheckout}
                disabled={items.length === 0}
              >
              Proceed to Checkout
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Cart;