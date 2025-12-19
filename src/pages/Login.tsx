import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import logo from "@/assets/BLDR.png";

const Login = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Validate email domain
    if (!email.endsWith("@bldrapp.com.br")) {
      toast({
        title: "Acesso negado",
        description: "Apenas emails @bldrapp.com.br são permitidos.",
        variant: "destructive",
      });
      setLoading(false);
      return;
    }

    // Simulate authentication
    setTimeout(() => {
      localStorage.setItem("bldr_authenticated", "true");
      localStorage.setItem("bldr_user", JSON.stringify({
        name: "Admin BLDR",
        email: email,
        avatar: null
      }));
      toast({
        title: "Login realizado",
        description: "Bem-vindo ao BLDR CRM!",
      });
      navigate("/dashboard");
      setLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4 fade-in">
      <div className="w-full max-w-md space-y-8">
        <div className="flex flex-col items-center space-y-4">
          <img
            src={logo}
            alt="BLDR CRM"
            className="h-16 object-contain"
          />
          <p className="text-muted-foreground text-sm">
            Painel Administrativo Corporativo
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="email" className="text-foreground">
              Email
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="seu.email@bldrapp.com.br"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="bg-card border-border focus:border-primary focus:ring-primary"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password" className="text-foreground">
              Senha
            </Label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="bg-card border-border focus:border-primary focus:ring-primary"
            />
          </div>

          <Button
            type="submit"
            variant="gold"
            className="w-full"
            disabled={loading}
          >
            {loading ? "Entrando..." : "Entrar"}
          </Button>
        </form>

        <p className="text-center text-sm text-muted-foreground">
          Acesso restrito a colaboradores BLDR
        </p>
      </div>
    </div>
  );
};

export default Login;
