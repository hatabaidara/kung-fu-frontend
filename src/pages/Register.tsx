import React, { useState } from "react";
import { Link, useNavigate } from "react-router";
import { useAppContext } from "../context/AppContext";
import { DarkModeToggle } from "../components/DarkModeToggle";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Button } from "../components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { UserPlus, ArrowLeft, CheckCircle, Trophy, Calendar, CreditCard, Sparkles } from "lucide-react";
import { toast } from "sonner";

export function Register() {
  const { members, setMembers, payments, setPayments } = useAppContext();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    discipline: "",
    address: "",
  });

  const [success, setSuccess] = useState(false);
  const [registeredMember, setRegisteredMember] = useState<any>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!formData.name || !formData.phone || !formData.discipline) {
      toast.error("Veuillez remplir tous les champs obligatoires");
      return;
    }

    // Créer un nouvel ID
    const newId = `M${String(members.length + 1).padStart(3, "0")}`;

    // Créer le nouveau membre
    const newMember = {
      id: newId,
      name: formData.name,
      phone: formData.phone,
      email: formData.email,
      discipline: formData.discipline,
      address: formData.address,
      licenseStatus: "En attente",
      licenseExpiry: "",
      joinDate: new Date().toISOString().split("T")[0],
      active: true,
    };

    // Ajouter le membre
    const updatedMembers = [...members, newMember];
    setMembers(updatedMembers);

    // Créer le paiement d'inscription
    const inscriptionPayment = {
      id: `P${String(payments.length + 1).padStart(3, "0")}`,
      memberId: newId,
      memberName: formData.name,
      amount: 10000,
      type: "Inscription",
      date: new Date().toISOString().split("T")[0],
      status: "En attente",
      method: "",
    };

    const updatedPayments = [...payments, inscriptionPayment];
    setPayments(updatedPayments);

    setRegisteredMember({ ...newMember, paymentId: inscriptionPayment.id });
    setSuccess(true);
    toast.success("Inscription réussie !");
  };

  if (success && registeredMember) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#334155] dark:from-[#000000] dark:via-[#0a0f1a] dark:to-[#0f172a] flex items-center justify-center p-4 relative overflow-hidden transition-colors duration-300">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500/10 dark:bg-blue-400/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-green-500/10 dark:bg-green-400/20 rounded-full blur-3xl animate-pulse delay-700"></div>
        </div>

        {/* Dark Mode Toggle */}
        <DarkModeToggle className="fixed top-6 right-6 z-50 p-3 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110" />

        <Card className="w-full max-w-lg bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm border-0 shadow-2xl relative animate-in fade-in slide-in-from-bottom-4 duration-700 transition-colors">
          <CardHeader className="text-center pb-8 pt-10">
            <div className="flex justify-center mb-6">
              <div className="relative">
                <div className="w-20 h-20 bg-gradient-to-br from-green-400 to-green-600 dark:from-green-500 dark:to-green-700 rounded-full flex items-center justify-center shadow-lg shadow-green-500/50 dark:shadow-green-400/30 animate-in zoom-in duration-500">
                  <CheckCircle className="h-10 w-10 text-white" strokeWidth={2.5} />
                </div>
                <div className="absolute -top-1 -right-1 w-6 h-6 bg-yellow-400 dark:bg-yellow-500 rounded-full flex items-center justify-center animate-bounce">
                  <Sparkles className="h-3 w-3 text-yellow-900 dark:text-yellow-950" />
                </div>
              </div>
            </div>
            <CardTitle className="text-4xl font-bold bg-gradient-to-r from-[#1e293b] to-[#334155] dark:from-gray-100 dark:to-gray-300 bg-clip-text text-transparent mb-2">
              Inscription Réussie !
            </CardTitle>
            <p className="text-gray-600 dark:text-gray-400 text-sm">Votre aventure commence maintenant</p>
          </CardHeader>

          <CardContent className="space-y-5 pb-10">
            {/* Member Info Card */}
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/30 dark:to-emerald-950/30 p-6 rounded-xl border-2 border-green-200 dark:border-green-800 shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-green-500 dark:bg-green-600 rounded-lg flex items-center justify-center shadow-md">
                  <Trophy className="h-6 w-6 text-white" />
                </div>
                <div>
                  <p className="text-green-900 dark:text-green-100 font-bold text-lg">
                    {registeredMember.name}
                  </p>
                  <p className="text-green-700 dark:text-green-400 text-xs font-medium">Nouveau membre</p>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between bg-white/60 dark:bg-gray-800/60 p-3 rounded-lg">
                  <span className="text-xs text-green-800 dark:text-green-300 font-medium">ID Membre</span>
                  <span className="text-sm text-green-900 dark:text-green-100 font-bold">{registeredMember.id}</span>
                </div>
                <div className="flex items-center justify-between bg-white/60 dark:bg-gray-800/60 p-3 rounded-lg">
                  <span className="text-xs text-green-800 dark:text-green-300 font-medium">Discipline</span>
                  <span className="text-sm text-green-900 dark:text-green-100 font-bold">{registeredMember.discipline}</span>
                </div>
                <div className="flex items-center justify-between bg-white/60 dark:bg-gray-800/60 p-3 rounded-lg">
                  <span className="text-xs text-green-800 dark:text-green-300 font-medium">Date d'inscription</span>
                  <span className="text-sm text-green-900 dark:text-green-100 font-bold">
                    {new Date(registeredMember.joinDate).toLocaleDateString("fr-FR")}
                  </span>
                </div>
              </div>
            </div>

            {/* Next Steps */}
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 p-5 rounded-xl border-2 border-blue-200 dark:border-blue-800 shadow-sm">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-blue-500 dark:bg-blue-600 rounded-lg flex items-center justify-center">
                  <Calendar className="h-4 w-4 text-white" />
                </div>
                <p className="text-sm font-bold text-blue-900 dark:text-blue-100">
                  Prochaines étapes
                </p>
              </div>
              <ol className="space-y-2.5">
                {[
                  "Effectuez le paiement d'inscription (10 000 FCFA)",
                  "Présentez-vous à la salle avec une pièce d'identité",
                  "Complétez votre dossier d'adhésion",
                  "Obtenez votre licence de boxe/kung fu"
                ].map((step, index) => (
                  <li key={index} className="flex items-start gap-3 text-xs text-blue-800 dark:text-blue-200">
                    <span className="flex-shrink-0 w-5 h-5 bg-blue-500 dark:bg-blue-600 text-white rounded-full flex items-center justify-center text-[10px] font-bold mt-0.5">
                      {index + 1}
                    </span>
                    <span className="pt-0.5">{step}</span>
                  </li>
                ))}
              </ol>
            </div>

            {/* Pricing */}
            <div className="bg-gradient-to-br from-gray-50 to-slate-50 dark:from-gray-900/30 dark:to-slate-900/30 p-5 rounded-xl border-2 border-gray-200 dark:border-gray-700 shadow-sm">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-[#3b82f6] dark:bg-blue-600 rounded-lg flex items-center justify-center">
                  <CreditCard className="h-4 w-4 text-white" />
                </div>
                <p className="text-sm font-bold text-gray-900 dark:text-gray-100">
                  Tarification
                </p>
              </div>
              <div className="space-y-2.5">
                <div className="flex items-center justify-between bg-white dark:bg-gray-800 p-3 rounded-lg shadow-sm">
                  <span className="text-xs text-gray-700 dark:text-gray-300">Frais d'inscription</span>
                  <span className="text-sm font-bold text-[#1e293b] dark:text-gray-100">10 000 FCFA</span>
                </div>
                <div className="flex items-center justify-between bg-white dark:bg-gray-800 p-3 rounded-lg shadow-sm">
                  <span className="text-xs text-gray-700 dark:text-gray-300">Mensualité</span>
                  <span className="text-sm font-bold text-[#1e293b] dark:text-gray-100">5 000 FCFA</span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3 pt-3">
              <Link to="/login" className="block">
                <Button className="w-full bg-gradient-to-r from-[#3b82f6] to-[#2563eb] hover:from-[#2563eb] hover:to-[#1d4ed8] dark:from-blue-600 dark:to-blue-700 dark:hover:from-blue-700 dark:hover:to-blue-800 text-white shadow-lg shadow-blue-500/30 dark:shadow-blue-600/20 h-12 text-base font-semibold">
                  Retour à la connexion
                </Button>
              </Link>
              <Button
                variant="outline"
                className="w-full h-11 border-2 border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800 dark:text-gray-200 font-medium"
                onClick={() => {
                  setSuccess(false);
                  setFormData({
                    name: "",
                    phone: "",
                    email: "",
                    discipline: "",
                    address: "",
                  });
                }}
              >
                Nouvelle inscription
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#334155] dark:from-[#000000] dark:via-[#0a0f1a] dark:to-[#0f172a] flex items-center justify-center p-4 relative overflow-hidden transition-colors duration-300">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500/10 dark:bg-blue-400/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-500/10 dark:bg-purple-400/20 rounded-full blur-3xl animate-pulse delay-700"></div>
      </div>

      {/* Dark Mode Toggle */}
      <DarkModeToggle className="fixed top-6 right-6 z-50 p-3 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110" />

      <Card className="w-full max-w-3xl bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm border-0 shadow-2xl relative animate-in fade-in slide-in-from-bottom-4 duration-700 transition-colors">
        <CardHeader className="space-y-1 pb-8 pt-8">
          <div className="flex items-center justify-between mb-6">
            <Link to="/login">
              <Button variant="ghost" size="sm" className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Retour
              </Button>
            </Link>
          </div>
          
          <div className="flex justify-center mb-6">
            <div className="relative">
              <div className="w-20 h-20 bg-gradient-to-br from-[#3b82f6] to-[#2563eb] dark:from-blue-600 dark:to-blue-700 rounded-2xl flex items-center justify-center shadow-xl shadow-blue-500/40 dark:shadow-blue-600/30 rotate-6 hover:rotate-0 transition-transform duration-300">
                <UserPlus className="h-10 w-10 text-white" strokeWidth={2.5} />
              </div>
              <div className="absolute -top-2 -right-2 w-7 h-7 bg-gradient-to-br from-yellow-400 to-orange-500 dark:from-yellow-500 dark:to-orange-600 rounded-full flex items-center justify-center shadow-lg animate-bounce">
                <Sparkles className="h-3.5 w-3.5 text-white" />
              </div>
            </div>
          </div>

          <CardTitle className="text-4xl font-bold text-center bg-gradient-to-r from-[#1e293b] to-[#3b82f6] dark:from-gray-100 dark:to-blue-400 bg-clip-text text-transparent">
            Inscription Fight Club
          </CardTitle>
          <p className="text-gray-600 dark:text-gray-400 text-center text-base pt-2">
            Rejoignez notre salle de Boxe et Kung Fu dès aujourd'hui
          </p>
        </CardHeader>

        <CardContent className="pb-10">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Form Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                  Nom complet <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Ex: Jean Dupont"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="border-2 border-gray-200 dark:border-gray-700 dark:bg-gray-800/50 dark:text-gray-100 focus:border-blue-400 dark:focus:border-blue-500 h-12 rounded-lg transition-colors"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone" className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                  Téléphone <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="Ex: 77 123 45 67"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="border-2 border-gray-200 dark:border-gray-700 dark:bg-gray-800/50 dark:text-gray-100 focus:border-blue-400 dark:focus:border-blue-500 h-12 rounded-lg transition-colors"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-semibold text-gray-700 dark:text-gray-300">Email (optionnel)</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="email@exemple.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="border-2 border-gray-200 dark:border-gray-700 dark:bg-gray-800/50 dark:text-gray-100 focus:border-blue-400 dark:focus:border-blue-500 h-12 rounded-lg transition-colors"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="discipline" className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                  Discipline <span className="text-red-500">*</span>
                </Label>
                <Select
                  value={formData.discipline}
                  onValueChange={(value) => setFormData({ ...formData, discipline: value })}
                >
                  <SelectTrigger className="border-2 border-gray-200 dark:border-gray-700 dark:bg-gray-800/50 dark:text-gray-100 focus:border-blue-400 dark:focus:border-blue-500 h-12 rounded-lg">
                    <SelectValue placeholder="Choisir une discipline" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Boxe">🥊 Boxe</SelectItem>
                    <SelectItem value="Kung Fu">🥋 Kung Fu</SelectItem>
                    <SelectItem value="Boxe et Kung Fu">🥊🥋 Boxe et Kung Fu</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="address" className="text-sm font-semibold text-gray-700 dark:text-gray-300">Adresse (optionnel)</Label>
              <Input
                id="address"
                type="text"
                placeholder="Ex: Dakar, Plateau"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                className="border-2 border-gray-200 dark:border-gray-700 dark:bg-gray-800/50 dark:text-gray-100 focus:border-blue-400 dark:focus:border-blue-500 h-12 rounded-lg transition-colors"
              />
            </div>

            {/* Pricing Card */}
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 p-6 rounded-xl border-2 border-blue-200 dark:border-blue-800 shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-[#3b82f6] to-[#2563eb] dark:from-blue-600 dark:to-blue-700 rounded-lg flex items-center justify-center shadow-md">
                  <CreditCard className="h-5 w-5 text-white" />
                </div>
                <p className="text-base font-bold text-blue-900 dark:text-blue-100">
                  Tarification
                </p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm">
                  <p className="text-xs text-blue-700 dark:text-blue-400 mb-1 font-medium">Frais d'inscription</p>
                  <p className="text-2xl font-bold text-[#1e293b] dark:text-gray-100">10 000 <span className="text-sm">FCFA</span></p>
                </div>
                <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm">
                  <p className="text-xs text-blue-700 dark:text-blue-400 mb-1 font-medium">Mensualité</p>
                  <p className="text-2xl font-bold text-[#1e293b] dark:text-gray-100">5 000 <span className="text-sm">FCFA</span></p>
                </div>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-[#3b82f6] to-[#2563eb] hover:from-[#2563eb] hover:to-[#1d4ed8] dark:from-blue-600 dark:to-blue-700 dark:hover:from-blue-700 dark:hover:to-blue-800 text-white h-14 text-lg font-semibold shadow-lg shadow-blue-500/30 dark:shadow-blue-600/20 rounded-xl transition-all hover:shadow-xl hover:shadow-blue-500/40 dark:hover:shadow-blue-600/30"
            >
              <UserPlus className="h-5 w-5 mr-2" />
              S'inscrire maintenant
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Les champs marqués d'un <span className="text-red-500 font-semibold">*</span> sont obligatoires
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}