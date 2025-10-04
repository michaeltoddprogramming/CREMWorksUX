import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Fish, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { apiClient } from "@/services/api";

const AuthPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  
  const [loginUser, setLoginUser] = useState("");
  const [loginPass, setLoginPass] = useState("");
  const [signupUser, setSignupUser] = useState("");
  const [signupPass, setSignupPass] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!loginUser || !loginPass) {
      toast.error("Please fill in all fields");
      return;
    }

    setLoading(true);
    try {
      const response = await apiClient.login({
        username: loginUser,
        password: loginPass,
      });

      localStorage.setItem('token', response.token);
      
      login({
        id: response.user.id,
        username: response.user.username,
        admin: response.user.admin,
      });
      
      toast.success("Login successful!");
      navigate("/");
    } catch (error: any) {
      toast.error(error.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!signupUser || !signupPass) {
      toast.error("Please fill in all fields");
      return;
    }

    if (signupPass.length < 6) {
      toast.error("Password must be at least 6 characters long");
      return;
    }

    setLoading(true);
    try {
      const response = await apiClient.register({
        username: signupUser,
        password: signupPass,
      });

      if (response.status === "success") {
        toast.success("Registration successful! Please log in.");
        setSignupUser("");
        setSignupPass("");
      }
    } catch (error: any) {
      toast.error(error.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-wrapper">
        <div className="brand-header">
          <Link to="/" className="brand-link">
            <Fish className="brand-icon" />
            CREMFish
          </Link>
          <p className="brand-subtitle">South Africa's premier fishing tackle store</p>
        </div>

        <Tabs defaultValue="login" className="w-full">
          <TabsList className="tabs-list">
            <TabsTrigger value="login">Login</TabsTrigger>
            <TabsTrigger value="signup">Sign Up</TabsTrigger>
          </TabsList>

          <TabsContent value="login" className="mt-0">
            <Card className="auth-card">
              <CardHeader className="pb-4">
                <CardTitle className="text-2xl">Login to Your Account</CardTitle>
                <CardDescription>
                  Enter your credentials to access your account
                </CardDescription>
              </CardHeader>
              <CardContent className="pb-6">
                <form onSubmit={handleLogin} className="auth-form">
                  <div className="field-group">
                    <Label htmlFor="login-user" className="field-label">Username</Label>
                    <Input
                      id="login-user"
                      type="text"
                      placeholder="Enter your username"
                      value={loginUser}
                      onChange={(e) => setLoginUser(e.target.value)}
                      required
                      className="field-input"
                      disabled={loading}
                    />
                  </div>
                  <div className="field-group">
                    <Label htmlFor="login-pass" className="field-label">Password</Label>
                    <Input
                      id="login-pass"
                      type="password"
                      placeholder="Enter your password"
                      value={loginPass}
                      onChange={(e) => setLoginPass(e.target.value)}
                      required
                      className="field-input"
                      disabled={loading}
                    />
                  </div>
                  <div className="pt-2">
                    <Button type="submit" className="w-full" disabled={loading}>
                      {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                      Login
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="signup" className="mt-0">
            <Card className="auth-card">
              <CardHeader className="pb-4">
                <CardTitle className="text-2xl">Create an Account</CardTitle>
                <CardDescription>
                  Join our community of passionate anglers
                </CardDescription>
              </CardHeader>
              <CardContent className="pb-6">
                <form onSubmit={handleSignup} className="auth-form">
                  <div className="field-group">
                    <Label htmlFor="signup-user" className="field-label">Username</Label>
                    <Input
                      id="signup-user"
                      type="text"
                      placeholder="Choose a username"
                      value={signupUser}
                      onChange={(e) => setSignupUser(e.target.value)}
                      required
                      className="field-input"
                      disabled={loading}
                    />
                  </div>
                  <div className="field-group">
                    <Label htmlFor="signup-pass" className="field-label">Password</Label>
                    <Input
                      id="signup-pass"
                      type="password"
                      placeholder="Min. 6 characters"
                      value={signupPass}
                      onChange={(e) => setSignupPass(e.target.value)}
                      required
                      className="field-input"
                      disabled={loading}
                    />
                  </div>
                  <div className="pt-2">
                    <Button type="submit" className="w-full" disabled={loading}>
                      {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                      Create Account
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <p className="terms-text">
          By continuing, you agree to our Terms of Service and Privacy Policy
        </p>
      </div>
    </div>
  );
};

export default AuthPage;
