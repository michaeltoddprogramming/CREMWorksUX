import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/AuthContext";
import { ShoppingBag } from "lucide-react";
import { toast } from "sonner";
import { Link, useNavigate } from "react-router-dom";

interface OrderItem {
  product: {
    _id: string;
    name: string;
    image?: string;
    price: number;
  };
  quantity: number;
}

interface Order {
  _id: string;
  items: OrderItem[];
  orderedAt: string;
}

const PastOrders = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) return;
    const token = localStorage.getItem("token");

    const fetchOrders = async () => {
      try {
        const res = await fetch("http://localhost:3000/api/my-orders", {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }); // no token needed
        if (!res.ok) throw new Error("Failed to fetch orders");

        const data = await res.json();
        setOrders(data.data); // adapt if your API structure is different
      } catch (err) {
        toast.error("Failed to fetch past orders");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [isAuthenticated]);

  if (!isAuthenticated) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <ShoppingBag className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
        <h1 className="text-2xl font-bold mb-2">Please Log In</h1>
        <p className="text-muted-foreground mb-6">You need to be logged in to view your past orders</p>
        <Button asChild>
          <Link to="/auth">Login</Link>
        </Button>
      </div>
    );
  }

  if (loading) {
    return <div className="container mx-auto px-4 py-8">Loading...</div>;
  }

  if (orders.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <ShoppingBag className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
        <h1 className="text-2xl font-bold mb-2">No Past Orders</h1>
        <p className="text-muted-foreground mb-6">Start shopping to create your first order!</p>
        <Button asChild>
          <Link to="/gear">Browse Products</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 flex items-center gap-2">
        <ShoppingBag className="h-8 w-8" />
        Past Orders
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          {orders.map((order, idx) => {
            const total = order.items.reduce(
              (sum, item) => sum + item.product.price * item.quantity,
              0
            );

            return (
              <Card key={`id: order._id`}>
                <CardHeader>
                  <CardTitle>Order #{idx + 1}</CardTitle>
                  <p className="text-sm text-muted-foreground">
                    Ordered on: {new Date(order.orderedAt).toLocaleDateString()}
                  </p>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {order.items.map((item, i) => (
                      <div key={i} className="flex items-center gap-3">
                        <img
                          src={item.product.image || "/placeholder.svg"}
                          alt={item.product.name}
                          className="w-20 h-20 object-cover rounded-lg"
                        />
                        <div className="flex-1">
                          <h3 className="font-semibold text-lg">{item.product.name}</h3>
                          <p className="text-xs text-muted-foreground">Qty: {item.quantity}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-2xl font-bold">
                            R{(item.product.price * item.quantity).toFixed(2)}
                          </p>
                        </div>
                      </div>
                    ))}
                    <Separator />
                    <div className="flex justify-between font-bold text-lg">
                      <span>Total:</span>
                      <span>R{total.toFixed(2)}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="lg:col-span-1">
          <Card className="sticky top-4 p-6 text-center">
            <p className="text-muted-foreground">Your past orders are listed here.</p>
            <Button
              className="mt-4 w-full bg-green-600 hover:bg-green-700 text-white"
              onClick={() => navigate("/gear")}
            >
              Browse More Products
            </Button>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default PastOrders;
