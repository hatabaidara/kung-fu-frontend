import React, { useState } from "react";
import { Link } from "react-router";
import { useAppContext } from "../context/AppContext";
import { DarkModeToggle } from "../components/DarkModeToggle";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Button } from "../components/ui/button";
import { Search, CheckCircle, XCircle, ArrowLeft, User } from "lucide-react";

export function PublicSearch() {
  const { members, payments } = useAppContext();
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResult, setSearchResult] = useState<any>(null);
  const [searched, setSearched] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearched(true);

    if (!searchTerm.trim()) {
      setSearchResult(null);
      return;
    }

    // Rechercher le membre par nom ou ID
    const foundMember = members.find(
      (m) =>
        m.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        m.id === searchTerm
    );

    if (foundMember) {
      // Récupérer les paiements du membre
      const memberPayments = payments.filter((p) => p.memberId === foundMember.id);
      const latestPayment = memberPayments.sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
      )[0];

      // Vérifier si le dernier paiement est récent (moins de 35 jours)
      const isPaid = latestPayment
        ? latestPayment.status === "Payé" &&
          new Date().getTime() - new Date(latestPayment.date).getTime() <
            35 * 24 * 60 * 60 * 1000
        : false;

      setSearchResult({
        member: foundMember,
        latestPayment,
        isPaid,
        totalPayments: memberPayments.length,
      });
    } else {
      setSearchResult(null);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1e293b] via-[#334155] to-[#1e293b] dark:from-[#000000] dark:via-[#0a0f1a] dark:to-[#0f172a] flex items-center justify-center p-4 transition-colors duration-300">
      <DarkModeToggle />
      
      <Card className="w-full max-w-2xl bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800 shadow-2xl transition-colors">
        <CardHeader className="space-y-1 pb-6">
          <div className="flex items-center justify-between mb-4">
            <Link to="/login">
              <Button variant="ghost" size="sm" className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-800">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Retour à la connexion
              </Button>
            </Link>
          </div>
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-[#3b82f6] dark:bg-blue-600 rounded-full flex items-center justify-center shadow-lg">
              <Search className="h-8 w-8 text-white" />
            </div>
          </div>
          <CardTitle className="text-3xl font-bold text-[#1e293b] dark:text-gray-100 text-center">
            Vérification de Paiement
          </CardTitle>
          <p className="text-gray-600 dark:text-gray-400 text-center">
            Recherchez un membre pour vérifier son statut de paiement
          </p>
        </CardHeader>

        <CardContent className="space-y-6">
          <form onSubmit={handleSearch} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="search" className="dark:text-gray-300">Nom du membre ou ID</Label>
              <div className="flex gap-2">
                <Input
                  id="search"
                  type="text"
                  placeholder="Ex: Jean Dupont ou ID du membre"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="border-gray-300 dark:border-gray-700 dark:bg-gray-800/50 dark:text-gray-100"
                  autoComplete="off"
                />
                <Button
                  type="submit"
                  className="bg-[#3b82f6] hover:bg-[#2563eb] dark:bg-blue-600 dark:hover:bg-blue-700 text-white px-6"
                >
                  <Search className="h-4 w-4 mr-2" />
                  Rechercher
                </Button>
              </div>
            </div>
          </form>

          {/* Résultat de la recherche */}
          {searched && (
            <div>
              {searchResult ? (
                <div className="space-y-4">
                  {/* Informations du membre */}
                  <div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-gray-300 dark:bg-gray-700 rounded-full flex items-center justify-center">
                        <User className="h-6 w-6 text-gray-600 dark:text-gray-300" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-bold text-lg text-[#1e293b] dark:text-gray-100">
                          {searchResult.member.name}
                        </h3>
                        <div className="grid grid-cols-2 gap-2 mt-2 text-sm">
                          <div>
                            <p className="text-gray-600 dark:text-gray-400">Téléphone</p>
                            <p className="font-medium text-[#1e293b] dark:text-gray-200">
                              {searchResult.member.phone}
                            </p>
                          </div>
                          <div>
                            <p className="text-gray-600 dark:text-gray-400">Discipline</p>
                            <p className="font-medium text-[#1e293b] dark:text-gray-200">
                              {searchResult.member.discipline}
                            </p>
                          </div>
                          <div>
                            <p className="text-gray-600 dark:text-gray-400">Statut Licence</p>
                            <p className="font-medium text-[#1e293b] dark:text-gray-200">
                              {searchResult.member.licenseStatus}
                            </p>
                          </div>
                          <div>
                            <p className="text-gray-600 dark:text-gray-400">Total Paiements</p>
                            <p className="font-medium text-[#1e293b] dark:text-gray-200">
                              {searchResult.totalPayments}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Statut de paiement */}
                  {searchResult.isPaid ? (
                    <div className="bg-green-50 dark:bg-green-950/30 p-6 rounded-lg border-2 border-green-500 dark:border-green-700">
                      <div className="flex items-center gap-4">
                        <CheckCircle className="h-12 w-12 text-green-600 dark:text-green-500" />
                        <div>
                          <h4 className="text-xl font-bold text-green-900 dark:text-green-100">
                            Paiement à jour ✓
                          </h4>
                          <p className="text-sm text-green-700 dark:text-green-300 mt-1">
                            Dernier paiement :{" "}
                            {new Date(searchResult.latestPayment.date).toLocaleDateString(
                              "fr-FR"
                            )}
                          </p>
                          <p className="text-sm text-green-700 dark:text-green-300">
                            Montant : {searchResult.latestPayment.amount.toLocaleString()} FCFA
                          </p>
                          <p className="text-sm text-green-700 dark:text-green-300">
                            Type : {searchResult.latestPayment.type}
                          </p>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="bg-red-50 dark:bg-red-950/30 p-6 rounded-lg border-2 border-red-500 dark:border-red-700">
                      <div className="flex items-center gap-4">
                        <XCircle className="h-12 w-12 text-red-600 dark:text-red-500" />
                        <div>
                          <h4 className="text-xl font-bold text-red-900 dark:text-red-100">
                            Paiement en retard ⚠️
                          </h4>
                          {searchResult.latestPayment ? (
                            <>
                              <p className="text-sm text-red-700 dark:text-red-300 mt-1">
                                Dernier paiement :{" "}
                                {new Date(
                                  searchResult.latestPayment.date
                                ).toLocaleDateString("fr-FR")}
                              </p>
                              <p className="text-sm text-red-700 dark:text-red-300">
                                Statut : {searchResult.latestPayment.status}
                              </p>
                            </>
                          ) : (
                            <p className="text-sm text-red-700 dark:text-red-300 mt-1">
                              Aucun paiement enregistré
                            </p>
                          )}
                          <p className="text-sm font-medium text-red-900 dark:text-red-200 mt-2">
                            Veuillez régulariser votre situation
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="bg-orange-50 dark:bg-orange-950/30 p-6 rounded-lg border border-orange-200 dark:border-orange-700 text-center">
                  <p className="text-orange-900 dark:text-orange-100 font-medium">
                    Aucun membre trouvé avec ce nom ou cet ID
                  </p>
                  <p className="text-sm text-orange-700 dark:text-orange-300 mt-2">
                    Veuillez vérifier l'orthographe et réessayer
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Instructions */}
          <div className="bg-blue-50 dark:bg-blue-950/30 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
            <p className="text-sm font-medium text-blue-900 dark:text-blue-100 mb-2">
              💡 Comment utiliser cette page :
            </p>
            <ul className="text-xs text-blue-800 dark:text-blue-200 space-y-1 list-disc list-inside">
              <li>Entrez le nom complet ou partiel du membre</li>
              <li>Ou entrez l'ID du membre si vous le connaissez</li>
              <li>Cliquez sur "Rechercher" pour voir le statut de paiement</li>
              <li>
                Un paiement est considéré à jour s'il a été effectué il y a moins de 35
                jours
              </li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}