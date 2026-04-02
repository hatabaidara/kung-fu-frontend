import React, { useState } from "react";
import { useAppContext } from "../context/AppContext";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Switch } from "../components/ui/switch";
import { Settings, DollarSign, Calendar, Download, Upload, Save, UserPlus } from "lucide-react";
import { toast } from "sonner";

export function Admin() {
  const { members, payments, attendance, settings: appSettings, setSettings: setAppSettings } = useAppContext();

  // État local pour les paramètres
  const [settings, setSettings] = useState({
    gymName: "Fight Club",
    inscriptionFee: 10000,
    monthlyFee: 5000,
    trainingDays: ["Lundi", "Mercredi", "Vendredi"],
    email: "contact@fightclub.com",
    phone: "+226 XX XX XX XX",
    address: "Ouagadougou, Burkina Faso",
  });

  const [saved, setSaved] = useState(false);

  const handleSaveSettings = () => {
    // Sauvegarder dans localStorage
    localStorage.setItem("gymSettings", JSON.stringify(settings));
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
    setAppSettings(settings);
    toast.success("Paramètres sauvegardés avec succès !");
  };

  const handleExportData = () => {
    const data = {
      members,
      payments,
      attendance,
      settings,
      exportDate: new Date().toISOString(),
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `fight-club-export-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const stats = {
    totalMembers: members.length,
    totalPayments: payments.reduce((sum, p) => sum + p.amount, 0),
    totalAttendance: attendance.filter(a => a.present).length,
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-[#1e293b]">Administration</h1>
        <p className="text-gray-600 mt-1">Gérez les paramètres de votre salle de sport</p>
      </div>

      {/* Statistiques globales */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-white border-gray-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Total Membres Enregistrés
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-[#1e293b]">{stats.totalMembers}</div>
          </CardContent>
        </Card>

        <Card className="bg-white border-gray-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Total Revenus (FCFA)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-[#1e293b]">
              {stats.totalPayments.toLocaleString()}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border-gray-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Total Présences
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-[#1e293b]">{stats.totalAttendance}</div>
          </CardContent>
        </Card>
      </div>

      {/* Paramètres de la salle */}
      <Card className="bg-white border-gray-200">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Settings className="h-5 w-5 text-[#3b82f6]" />
            <CardTitle>Paramètres Généraux</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Activation de l'inscription */}
          <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg border border-blue-200">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <UserPlus className="h-5 w-5 text-blue-600" />
                <Label htmlFor="registration-toggle" className="font-medium text-blue-900 cursor-pointer">
                  Page d'inscription publique
                </Label>
              </div>
              <p className="text-sm text-blue-700">
                {appSettings.registrationEnabled
                  ? "Les visiteurs peuvent s'inscrire depuis la page de connexion"
                  : "L'inscription publique est désactivée"}
              </p>
            </div>
            <Switch
              id="registration-toggle"
              checked={appSettings.registrationEnabled}
              onCheckedChange={(checked) => {
                setAppSettings({ ...appSettings, registrationEnabled: checked });
                toast.success(
                  checked
                    ? "Page d'inscription activée !"
                    : "Page d'inscription désactivée"
                );
              }}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="gymName">Nom de la salle</Label>
              <Input
                id="gymName"
                value={settings.gymName}
                onChange={(e) => setSettings({ ...settings, gymName: e.target.value })}
                className="border-gray-300"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={settings.email}
                onChange={(e) => setSettings({ ...settings, email: e.target.value })}
                className="border-gray-300"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Téléphone</Label>
              <Input
                id="phone"
                value={settings.phone}
                onChange={(e) => setSettings({ ...settings, phone: e.target.value })}
                className="border-gray-300"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="address">Adresse</Label>
              <Input
                id="address"
                value={settings.address}
                onChange={(e) => setSettings({ ...settings, address: e.target.value })}
                className="border-gray-300"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tarification */}
      <Card className="bg-white border-gray-200">
        <CardHeader>
          <div className="flex items-center gap-2">
            <DollarSign className="h-5 w-5 text-green-600" />
            <CardTitle>Tarification</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="inscriptionFee">Frais d'inscription (FCFA)</Label>
              <Input
                id="inscriptionFee"
                type="number"
                value={settings.inscriptionFee}
                onChange={(e) => setSettings({ ...settings, inscriptionFee: parseInt(e.target.value) || 0 })}
                className="border-gray-300"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="monthlyFee">Mensualité (FCFA)</Label>
              <Input
                id="monthlyFee"
                type="number"
                value={settings.monthlyFee}
                onChange={(e) => setSettings({ ...settings, monthlyFee: parseInt(e.target.value) || 0 })}
                className="border-gray-300"
              />
            </div>
          </div>

          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
            <p className="text-sm text-blue-900">
              <strong>Configuration actuelle :</strong>
            </p>
            <ul className="text-sm text-blue-800 mt-2 space-y-1">
              <li>• Inscription : {settings.inscriptionFee.toLocaleString()} FCFA</li>
              <li>• Mensualité : {settings.monthlyFee.toLocaleString()} FCFA</li>
            </ul>
          </div>
        </CardContent>
      </Card>

      {/* Planning des entraînements */}
      <Card className="bg-white border-gray-200">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-purple-600" />
            <CardTitle>Planning des Entraînements</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <p className="text-sm text-gray-600">Jours d'entraînement actuels :</p>
            <div className="flex flex-wrap gap-2">
              {settings.trainingDays.map((day) => (
                <span
                  key={day}
                  className="px-4 py-2 bg-purple-100 text-purple-900 rounded-lg font-medium"
                >
                  {day}
                </span>
              ))}
            </div>
            <p className="text-xs text-gray-500 mt-2">
              Les entraînements ont lieu les lundis, mercredis et vendredis
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="bg-white border-gray-200">
          <CardHeader>
            <CardTitle>Sauvegarder les Paramètres</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600 mb-4">
              Enregistrer les modifications des paramètres dans le stockage local
            </p>
            <Button
              onClick={handleSaveSettings}
              className="w-full bg-[#3b82f6] hover:bg-[#2563eb]"
            >
              <Save className="h-4 w-4 mr-2" />
              {saved ? "Paramètres sauvegardés ✓" : "Sauvegarder"}
            </Button>
          </CardContent>
        </Card>

        <Card className="bg-white border-gray-200">
          <CardHeader>
            <CardTitle>Exporter les Données</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600 mb-4">
              Télécharger toutes les données (membres, paiements, présences) au format JSON
            </p>
            <Button
              onClick={handleExportData}
              variant="outline"
              className="w-full border-gray-300"
            >
              <Download className="h-4 w-4 mr-2" />
              Exporter les données
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Informations système */}
      <Card className="bg-white border-gray-200">
        <CardHeader>
          <CardTitle>Informations Système</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-gray-600">Version de l'application</p>
              <p className="font-medium text-[#1e293b]">1.0.0</p>
            </div>
            <div>
              <p className="text-gray-600">Type de stockage</p>
              <p className="font-medium text-[#1e293b]">LocalStorage (Démo)</p>
            </div>
            <div>
              <p className="text-gray-600">Disciplines disponibles</p>
              <p className="font-medium text-[#1e293b]">Boxe, Kung Fu</p>
            </div>
            <div>
              <p className="text-gray-600">Date de dernière mise à jour</p>
              <p className="font-medium text-[#1e293b]">{new Date().toLocaleDateString('fr-FR')}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}