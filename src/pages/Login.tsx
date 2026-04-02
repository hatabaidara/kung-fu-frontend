import React, { useState } from "react";
import { useNavigate, Link } from "react-router";
import { useAuth } from "../context/AuthContext";
import { useAppContext } from "../context/AppContext";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Button } from "../components/ui/button";
import { DarkModeToggle } from "../components/DarkModeToggle";
import { LogIn, AlertCircle, Search, UserPlus } from "lucide-react";

export function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { login } = useAuth();
  const { settings } = useAppContext();
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!username || !password) {
      setError("Veuillez remplir tous les champs");
      return;
    }

    const success = login(username, password);
    if (success) {
      navigate("/");
    } else {
      setError("Nom d'utilisateur ou mot de passe incorrect");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1e293b] via-[#334155] to-[#1e293b] dark:from-[#000000] dark:via-[#0a0f1a] dark:to-[#0f172a] flex items-center justify-center p-4 transition-colors duration-300">
      <DarkModeToggle />
      
      <Card className="w-full max-w-md bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800 shadow-2xl transition-colors">
        <CardHeader className="space-y-1 text-center pb-6">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-[#3b82f6] dark:bg-blue-600 rounded-full flex items-center justify-center shadow-lg">
              <LogIn className="h-8 w-8 text-white" />
            </div>
          </div>
          <CardTitle className="text-3xl font-bold text-[#1e293b] dark:text-gray-100">
            Fight Club
          </CardTitle>
          <p className="text-gray-600 dark:text-gray-400">Gestion Salle de Sport - Boxe & Kung Fu</p>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="flex items-center gap-2 p-3 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 rounded-lg">
                <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400" />
                <p className="text-sm text-red-800 dark:text-red-300">{error}</p>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="username" className="dark:text-gray-300">Nom d'utilisateur</Label>
              <Input
                id="username"
                type="text"
                placeholder="Entrez votre nom d'utilisateur"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="border-gray-300 dark:border-gray-700 dark:bg-gray-800/50 dark:text-gray-100"
                autoComplete="username"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="dark:text-gray-300">Mot de passe</Label>
              <Input
                id="password"
                type="password"
                placeholder="Entrez votre mot de passe"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="border-gray-300 dark:border-gray-700 dark:bg-gray-800/50 dark:text-gray-100"
                autoComplete="current-password"
              />
            </div>

            <Button
              type="submit"
              className="w-full bg-[#3b82f6] hover:bg-[#2563eb] dark:bg-blue-600 dark:hover:bg-blue-700 text-white"
            >
              <LogIn className="h-4 w-4 mr-2" />
              Se connecter
            </Button>
          </form>

          <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-950/30 rounded-lg border border-blue-200 dark:border-blue-800">
            <p className="text-xs font-medium text-blue-900 dark:text-blue-100 mb-2">
              Comptes de démonstration :
            </p>
            <div className="space-y-1 text-xs text-blue-800 dark:text-blue-200">
              <p>
                <strong>Admin :</strong> admin / admin123
              </p>
              <p>
                <strong>Coach :</strong> coach / coach123
              </p>
            </div>
          </div>

          {/* Lien vers la recherche publique */}
          <div className="mt-4 space-y-2">
            <Link to="/search">
              <Button
                variant="outline"
                className="w-full border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
              >
                <Search className="h-4 w-4 mr-2" />
                Vérifier un paiement (Recherche publique)
              </Button>
            </Link>

            {/* Lien vers l'inscription (conditionnel) */}
            {settings.registrationEnabled && (
              <Link to="/register">
                <Button
                  variant="outline"
                  className="w-full border-blue-300 dark:border-blue-700 text-blue-700 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/30"
                >
                  <UserPlus className="h-4 w-4 mr-2" />
                  S'inscrire maintenant
                </Button>
              </Link>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}