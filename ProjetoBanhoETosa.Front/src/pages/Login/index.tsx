import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Dog, Plus } from "lucide-react";
import { useAuth } from "../../hooks/useAuth";
import type { UserDTO } from "../../interfaces/User";
import { Button } from "../../Components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../Components/ui/card";
import { Input } from "../../Components/ui/input";
import { Label } from "../../Components/ui/label";
import { Separator } from "../../Components/ui/separator";
import { useToast } from "../../Components/common/ToastProvider";

export default function Login() {
  const { loading, error, login, register } = useAuth();
  const navigate = useNavigate();
  const { pushToast } = useToast();
  const [loginForm, setLoginForm] = useState<UserDTO>({ email: "", password: "" });
  const [registerForm, setRegisterForm] = useState<UserDTO>({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [authView, setAuthView] = useState<"login" | "register">("login");
  const isLogin = authView === "login";

  const handleLogin = async () => {
    const success = await login(loginForm);
    if (success) {
      setLoginForm({ email: "", password: "" });
      navigate("/Home");
    }
  };

  const handleRegister = async () => {
    if (!registerForm.name || !registerForm.email || !registerForm.password || !registerForm.confirmPassword) {
      pushToast({ message: "Por favor, preencha todos os campos.", variant: "error" });
      return;
    }

    if (registerForm.password !== registerForm.confirmPassword) {
      pushToast({ message: "As senhas não coincidem.", variant: "error" });
      return;
    }

    if (registerForm.password.length < 6) {
      pushToast({ message: "A senha deve ter no mínimo 6 caracteres.", variant: "error" });
      return;
    }

    const success = await register(registerForm);
    if (success) {
      setRegisterForm({ name: "", email: "", password: "", confirmPassword: "" });
      pushToast({ message: "Cadastro realizado com sucesso.", variant: "success" });
      setAuthView("login");
    }
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(219,234,254,0.6),_transparent_45%),radial-gradient(circle_at_bottom,_rgba(254,249,195,0.6),_transparent_40%)] flex items-center justify-center p-6">
      <div className="relative w-full max-w-md">
        <div
          className="absolute -inset-6 rounded-[32px] bg-gradient-to-br from-blue-100/70 via-white to-sky-100/70 blur-2xl"
          aria-hidden
        />
        <Card className="relative border-slate-200/80 bg-white/95 shadow-xl backdrop-blur">
          <CardHeader className="space-y-3 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-900 text-white shadow-sm">
              <Dog className="h-6 w-6" />
            </div>
            <div>
              <CardTitle className="text-2xl">Petshop Manager</CardTitle>
              <CardDescription>Sistema de Agendamentos</CardDescription>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-2 gap-2 rounded-xl bg-slate-100 p-1">
              <Button
                type="button"
                variant={isLogin ? "brand" : "ghost"}
                size="sm"
                onClick={() => setAuthView("login")}
              >
                Login
              </Button>
              <Button
                type="button"
                variant={!isLogin ? "brand" : "ghost"}
                size="sm"
                onClick={() => setAuthView("register")}
              >
                Cadastrar
              </Button>
            </div>

            {error && (
              <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-600">
                {error}
              </div>
            )}

            {isLogin ? (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="login-email">Email</Label>
                  <Input
                    id="login-email"
                    type="email"
                    value={loginForm.email}
                    placeholder="seu@email.com"
                    onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="login-password">Senha</Label>
                  <Input
                    id="login-password"
                    type="password"
                    value={loginForm.password}
                    placeholder="senha"
                    onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                  />
                </div>

                <Button
                  type="button"
                  variant="brand"
                  onClick={handleLogin}
                  disabled={loading}
                  className="w-full"
                >
                  {loading ? (
                    <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  ) : (
                    "Entrar"
                  )}
                </Button>

                <div className="space-y-3">
                  <Separator />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setAuthView("register")}
                    className="w-full"
                  >
                    <Plus className="h-4 w-4" />
                    Criar Nova Conta
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="register-name">Nome</Label>
                  <Input
                    id="register-name"
                    type="text"
                    value={registerForm.name}
                    placeholder="João Silva"
                    onChange={(e) => setRegisterForm({ ...registerForm, name: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="register-email">Email</Label>
                  <Input
                    id="register-email"
                    type="email"
                    value={registerForm.email}
                    placeholder="seu@email.com"
                    onChange={(e) => setRegisterForm({ ...registerForm, email: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="register-password">Senha</Label>
                  <Input
                    id="register-password"
                    type="password"
                    value={registerForm.password}
                    placeholder="Mínimo 6 caracteres"
                    onChange={(e) => setRegisterForm({ ...registerForm, password: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="register-confirm">Confirmar Senha</Label>
                  <Input
                    id="register-confirm"
                    type="password"
                    value={registerForm.confirmPassword}
                    placeholder="Mínimo 6 caracteres"
                    onChange={(e) => setRegisterForm({ ...registerForm, confirmPassword: e.target.value })}
                  />
                </div>

                <Button
                  type="button"
                  variant="brand"
                  onClick={handleRegister}
                  disabled={loading}
                  className="w-full"
                >
                  {loading ? (
                    <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  ) : (
                    "Criar Conta"
                  )}
                </Button>

                <div className="text-center text-sm text-slate-600">
                  Já tem uma conta?{" "}
                  <button
                    type="button"
                    onClick={() => setAuthView("login")}
                    className="font-semibold text-blue-600 hover:text-blue-700"
                  >
                    Faça login aqui
                  </button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
