import TextInput from "../../Components/TextInput/TextInput";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Dog, Plus } from "lucide-react";
import styles from "./Login.module.css";
import { motion } from "framer-motion";
import { useAuth } from "../../hooks/useAuth";
import type { UserDTO } from "../../interfaces/User";

export default function Login() {
  const { loading, error, login, register } = useAuth();
  const navigate = useNavigate();
  const [loginForm, setLoginForm] = useState<UserDTO>({ email: '', password: '' });
  const [registerForm, setRegisterForm] = useState<UserDTO>({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [authView, setAuthView] = useState('login');

  const handleLogin = async () => {
    const success = await login(loginForm);
    if (success) {
      setLoginForm({ email: '', password: '' });
      navigate("/Home");
    }
  };

  const handleRegister = async () => {
    if (!registerForm.name || !registerForm.email || !registerForm.password || !registerForm.confirmPassword) {
      alert('Por favor, preencha todos os campos!');
      return;
    }

    if (registerForm.password !== registerForm.confirmPassword) {
      alert('As senhas não coincidem!');
      return;
    }

    if (registerForm.password.length < 6) {
      alert('A senha deve ter no mínimo 6 caracteres!');
      return;
    }

    const success = await register(registerForm);
    if (success) {
      setRegisterForm({ name: '', email: '', password: '', confirmPassword: '' });
      alert('Cadastro realizado com sucesso!');
      setAuthView('login'); // Redirect to login after successful registration
    }
  };

  return (
    <div className={styles['Container']}>
      <div className={styles['Container-Background']}>
        <div className={styles['Container-Header-Icon']}>
          <div className={styles['Container-Icon']}>
            <Dog className={styles['Icon-Dog']} />
          </div>
        </div>
        <h1 className={styles.Tittle}>Petshop Manager</h1>
        <p className={styles.Subtittle}>Sistema de Agendamentos</p>

        <div className={styles['Tab-Buttons']}>
          <button
            onClick={() => setAuthView('login')}
            className={`${styles['Tab-Button']} ${authView === 'login'
              ? styles['Tab-Button-Active']
              : styles['Tab-Button-Inactive']
              }`}
          >
            Login
          </button>
          <button
            onClick={() => setAuthView('register')}
            className={`${styles['Tab-Button']} ${authView === 'register'
              ? styles['Tab-Button-Active']
              : styles['Tab-Button-Inactive']
              }`}
          >
            Cadastrar
          </button>
        </div>

        {error && <p className={styles.errorMessage}>{error}</p>}

        {authView === 'login' ? (
          <div className="space-y-4">
            <TextInput
              Type="email"
              Value={loginForm.email}
              PlaceHolder="seu@email.com"
              OnChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })}
              Label="Email"
            />

            <TextInput
              Type="password"
              Value={loginForm.password}
              PlaceHolder="senha"
              OnChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
              Label="Senha"
            />

            <button
              onClick={handleLogin}
              disabled={loading}
              className={`${styles["Button-Login"]} relative flex items-center justify-center overflow-hidden disabled:opacity-60`}
            >
              {loading ? (
                <div
                  className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"
                />
              ) : (
                "Entrar"
              )}
            </button>

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">ou</span>
              </div>
            </div>

            <button
              onClick={() => setAuthView('register')}
              className={styles['Button-Register']}
            >
              <Plus className={styles['Icon-Plus']} />
              Criar Nova Conta
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <TextInput
              Type="text"
              Value={registerForm.name}
              OnChange={(e) => setRegisterForm({ ...registerForm, name: e.target.value })}
              PlaceHolder="João Silva"
              Label="Nome"
            />

            <TextInput
              Type="email"
              Value={registerForm.email}
              PlaceHolder="seu@email.com"
              OnChange={(e) => setRegisterForm({ ...registerForm, email: e.target.value })}
              Label="Email"
            />

            <TextInput
              Type="password"
              Value={registerForm.password}
              OnChange={(e) => setRegisterForm({ ...registerForm, password: e.target.value })}
              PlaceHolder="Mínimo 6 caracteres"
              Label="Senha"
            />
            <TextInput
              Type="password"
              Value={registerForm.confirmPassword}
              OnChange={(e) => setRegisterForm({ ...registerForm, confirmPassword: e.target.value })}
              PlaceHolder="Mínimo 6 caracteres"
              Label="Confirmar Senha"
            />

            <button
              onClick={handleRegister}
              disabled={loading}
              className={`${styles['Button-Create-Account']} relative flex items-center justify-center overflow-hidden disabled:opacity-60`}
            >
              {loading ? (
                <div
                  className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"
                />
              ) : (
                "Criar Conta"
              )}
            </button>

            <div className={styles['Container-Account-Exists']}>
              <p>
                Já tem uma conta?{' '}
                <button
                  onClick={() => setAuthView('login')}
                  className={styles['Link-Login']}
                >
                  Faça login aqui
                </button>
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
