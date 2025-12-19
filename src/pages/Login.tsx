import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import logo from "@/assets/BLDR-CLEAN.png";

const Login = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { signIn, signUp } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [loading, setLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);

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

    if (isSignUp) {
      if (!fullName.trim()) {
        toast({
          title: "Nome obrigatório",
          description: "Por favor, informe seu nome completo.",
          variant: "destructive",
        });
        setLoading(false);
        return;
      }

      const { error } = await signUp(email, password, fullName);
      if (error) {
        toast({
          title: "Erro ao criar conta",
          description: error.message,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Conta criada",
          description: "Sua conta foi criada com sucesso!",
        });
        navigate("/dashboard");
      }
    } else {
      const { error } = await signIn(email, password);
      if (error) {
        toast({
          title: "Erro ao entrar",
          description: error.message,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Login realizado",
          description: "Bem-vindo ao BLDR CRM!",
        });
        navigate("/dashboard");
      }
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4 fade-in">
      <div className="w-full max-w-md space-y-8">
        <div className="flex flex-col items-center space-y-4">
          <img
            src={logo}
            alt="BLDR CRM"
            className="h-32 md:h-40 object-contain"
          />
          <p className="text-muted-foreground text-sm">
            Painel Administrativo Corporativo
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {isSignUp && (
            <div className="space-y-2">
              <Label htmlFor="fullName" className="text-foreground">
                Nome Completo
              </Label>
              <Input
                id="fullName"
                type="text"
                placeholder="Seu nome completo"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required={isSignUp}
                className="bg-card border-border focus:border-primary focus:ring-primary"
              />
            </div>
          )}

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
              minLength={6}
              className="bg-card border-border focus:border-primary focus:ring-primary"
            />
          </div>

          <Button
            type="submit"
            variant="gold"
            className="w-full"
            disabled={loading}
          >
            {loading ? "Processando..." : isSignUp ? "Criar Conta" : "Entrar"}
          </Button>
        </form>

        <div className="text-center space-y-2">
          <button
            type="button"
            onClick={() => setIsSignUp(!isSignUp)}
            className="text-sm text-primary hover:underline"
          >
            {isSignUp
              ? "Já tem conta? Faça login"
              : "Não tem conta? Cadastre-se"}
          </button>
          <p className="text-sm text-muted-foreground">
            Acesso restrito a colaboradores BLDR
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
