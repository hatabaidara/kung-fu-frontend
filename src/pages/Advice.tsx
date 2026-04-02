import React, { useState } from "react";
import { useAppContext } from "../context/AppContext";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Textarea } from "../components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "../components/ui/dialog";
import { Badge } from "../components/ui/badge";
import { Plus, Edit, Trash2, Lightbulb, BookOpen } from "lucide-react";
import { Advice as AdviceType } from "../types";
import { toast } from "sonner";

export function Advice() {
  const { advices, setAdvices } = useAppContext();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingAdvice, setEditingAdvice] = useState<AdviceType | null>(null);
  const [filterCategory, setFilterCategory] = useState<string>("all");

  const [formData, setFormData] = useState<Partial<AdviceType>>({
    title: "",
    content: "",
    category: "Respect",
    icon: "💡",
  });

  const categories = [...new Set(advices.map((a) => a.category))];

  const filteredAdvices = filterCategory === "all"
    ? advices
    : advices.filter((a) => a.category === filterCategory);

  const handleOpenDialog = (advice?: AdviceType) => {
    if (advice) {
      setEditingAdvice(advice);
      setFormData(advice);
    } else {
      setEditingAdvice(null);
      setFormData({
        title: "",
        content: "",
        category: "Respect",
        icon: "💡",
      });
    }
    setIsDialogOpen(true);
  };

  const handleSave = () => {
    if (!formData.title || !formData.content || !formData.category) {
      toast.error("Veuillez remplir tous les champs");
      return;
    }

    if (editingAdvice) {
      // Modifier le conseil existant
      const updatedAdvices = advices.map((a) =>
        a.id === editingAdvice.id ? { ...formData, id: a.id } as AdviceType : a
      );
      setAdvices(updatedAdvices);
      toast.success("Conseil modifié");
    } else {
      // Ajouter nouveau conseil
      const newId = `AD${String(advices.length + 1).padStart(3, "0")}`;
      const newAdvice: AdviceType = {
        ...formData,
        id: newId,
      } as AdviceType;
      setAdvices([...advices, newAdvice]);
      toast.success("Nouveau conseil ajouté");
    }
    setIsDialogOpen(false);
  };

  const handleDelete = (id: string) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer ce conseil ?")) {
      setAdvices(advices.filter((a) => a.id !== id));
      toast.success("Conseil supprimé");
    }
  };

  const getCategoryColor = (category: string) => {
    const colors: { [key: string]: string } = {
      Respect: "bg-blue-100 text-blue-800 hover:bg-blue-100",
      Discipline: "bg-purple-100 text-purple-800 hover:bg-purple-100",
      Ponctualité: "bg-green-100 text-green-800 hover:bg-green-100",
      "Esprit d'équipe": "bg-yellow-100 text-yellow-800 hover:bg-yellow-100",
      Hygiène: "bg-pink-100 text-pink-800 hover:bg-pink-100",
      Motivation: "bg-orange-100 text-orange-800 hover:bg-orange-100",
      Sécurité: "bg-red-100 text-red-800 hover:bg-red-100",
      Santé: "bg-teal-100 text-teal-800 hover:bg-teal-100",
    };
    return colors[category] || "bg-gray-100 text-gray-800 hover:bg-gray-100";
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-[#1e293b]">Conseils de Bon Comportement</h1>
          <p className="text-gray-600 mt-1">
            Règles et recommandations pour les pratiquants
          </p>
        </div>
        <Button
          onClick={() => handleOpenDialog()}
          className="bg-[#3b82f6] hover:bg-[#2563eb] text-white"
        >
          <Plus className="h-4 w-4 mr-2" />
          Nouveau conseil
        </Button>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="bg-white border-gray-200">
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-[#1e293b]">{advices.length}</div>
            <p className="text-xs text-gray-600 mt-1">Total conseils</p>
          </CardContent>
        </Card>
        <Card className="bg-white border-gray-200">
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-blue-600">{categories.length}</div>
            <p className="text-xs text-gray-600 mt-1">Catégories</p>
          </CardContent>
        </Card>
        <Card className="bg-white border-gray-200">
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-purple-600">
              {advices.filter((a) => a.category === "Discipline").length}
            </div>
            <p className="text-xs text-gray-600 mt-1">Discipline</p>
          </CardContent>
        </Card>
        <Card className="bg-white border-gray-200">
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-green-600">
              {advices.filter((a) => a.category === "Respect").length}
            </div>
            <p className="text-xs text-gray-600 mt-1">Respect</p>
          </CardContent>
        </Card>
      </div>

      {/* Filtres par catégorie */}
      <Card className="bg-white border-gray-200">
        <CardContent className="pt-6">
          <div className="flex flex-wrap gap-2">
            <Button
              variant={filterCategory === "all" ? "default" : "outline"}
              size="sm"
              onClick={() => setFilterCategory("all")}
              className={filterCategory === "all" ? "bg-[#3b82f6]" : ""}
            >
              Toutes ({advices.length})
            </Button>
            {categories.map((category) => (
              <Button
                key={category}
                variant={filterCategory === category ? "default" : "outline"}
                size="sm"
                onClick={() => setFilterCategory(category)}
                className={filterCategory === category ? "bg-[#3b82f6]" : ""}
              >
                {category} ({advices.filter((a) => a.category === category).length})
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Liste des conseils */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredAdvices.length === 0 ? (
          <Card className="bg-white border-gray-200 col-span-2">
            <CardContent className="py-12 text-center">
              <Lightbulb className="h-12 w-12 mx-auto mb-4 text-gray-400" />
              <p className="text-gray-500">Aucun conseil pour le moment</p>
            </CardContent>
          </Card>
        ) : (
          filteredAdvices.map((advice) => (
            <Card key={advice.id} className="bg-white border-gray-200 hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3 flex-1">
                    <div className="text-3xl">{advice.icon}</div>
                    <div className="flex-1">
                      <Badge className={getCategoryColor(advice.category)}>
                        {advice.category}
                      </Badge>
                      <CardTitle className="text-lg text-[#1e293b] mt-2">
                        {advice.title}
                      </CardTitle>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleOpenDialog(advice)}
                      className="hover:bg-blue-50 hover:text-blue-600"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(advice.id)}
                      className="hover:bg-red-50 hover:text-red-600"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 text-sm leading-relaxed">
                  {advice.content}
                </p>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Informations supplémentaires */}
      <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
        <CardContent className="pt-6">
          <div className="flex items-start gap-3">
            <BookOpen className="h-6 w-6 text-blue-600 mt-1" />
            <div>
              <h3 className="font-bold text-blue-900">À propos des conseils</h3>
              <p className="text-sm text-blue-800 mt-2">
                Ces conseils de bon comportement sont essentiels pour maintenir un environnement
                d'entraînement sain, respectueux et productif. Ils reflètent les valeurs de notre
                salle de sport et aident chaque pratiquant à progresser dans les meilleures conditions.
              </p>
              <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
                <div className="bg-white bg-opacity-50 p-2 rounded">
                  <div className="font-bold text-blue-900">🥊 Respect</div>
                  <div className="text-blue-700">Envers tous</div>
                </div>
                <div className="bg-white bg-opacity-50 p-2 rounded">
                  <div className="font-bold text-purple-900">💪 Discipline</div>
                  <div className="text-purple-700">Rigueur</div>
                </div>
                <div className="bg-white bg-opacity-50 p-2 rounded">
                  <div className="font-bold text-green-900">🤝 Équipe</div>
                  <div className="text-green-700">Solidarité</div>
                </div>
                <div className="bg-white bg-opacity-50 p-2 rounded">
                  <div className="font-bold text-orange-900">🏆 Excellence</div>
                  <div className="text-orange-700">Progrès</div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Dialog d'ajout/modification */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {editingAdvice ? "Modifier le conseil" : "Nouveau conseil"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="category">
                  Catégorie <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="category"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="border-gray-300"
                  placeholder="Ex: Respect, Discipline..."
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="icon">Icône (emoji)</Label>
                <Input
                  id="icon"
                  value={formData.icon}
                  onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                  className="border-gray-300 text-2xl"
                  placeholder="💡"
                  maxLength={2}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="title">
                Titre <span className="text-red-500">*</span>
              </Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="border-gray-300"
                placeholder="Ex: Respect du coach"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="content">
                Contenu <span className="text-red-500">*</span>
              </Label>
              <Textarea
                id="content"
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                className="border-gray-300 min-h-[150px]"
                placeholder="Saisissez le conseil détaillé..."
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Annuler
            </Button>
            <Button onClick={handleSave} className="bg-[#3b82f6] hover:bg-[#2563eb]">
              {editingAdvice ? "Enregistrer" : "Ajouter"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}