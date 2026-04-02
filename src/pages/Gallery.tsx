import React, { useState } from "react";
import { useAppContext } from "../context/AppContext";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "../components/ui/dialog";
import { Badge } from "../components/ui/badge";
import { Plus, Trash2, Calendar, Image as ImageIcon, X, Download } from "lucide-react";
import { GalleryItem } from "../types";
import { toast } from "sonner";

export function Gallery() {
  const { gallery, setGallery } = useAppContext();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<GalleryItem | null>(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);

  const [formData, setFormData] = useState<Partial<GalleryItem>>({
    url: "",
    title: "",
    event: "",
    description: "",
  });

  const handleOpenDialog = () => {
    setFormData({
      url: "",
      title: "",
      event: "",
      description: "",
    });
    setIsDialogOpen(true);
  };

  const handleSave = () => {
    if (!formData.url || !formData.title || !formData.event) {
      toast.error("Veuillez remplir tous les champs obligatoires");
      return;
    }

    const newId = `G${String(gallery.length + 1).padStart(3, "0")}`;
    const newItem: GalleryItem = {
      ...formData,
      id: newId,
      date: new Date().toISOString().split("T")[0],
    } as GalleryItem;
    setGallery([newItem, ...gallery]);
    toast.success("Photo ajoutée à la galerie");
    setIsDialogOpen(false);
  };

  const handleDelete = (id: string) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer cette photo ?")) {
      setGallery(gallery.filter((item) => item.id !== id));
      toast.success("Photo supprimée");
      if (selectedImage?.id === id) {
        setIsViewDialogOpen(false);
        setSelectedImage(null);
      }
    }
  };

  const handleViewImage = (item: GalleryItem) => {
    setSelectedImage(item);
    setIsViewDialogOpen(true);
  };

  const events = [...new Set(gallery.map((item) => item.event))];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-[#1e293b]">Galerie Photos</h1>
          <p className="text-gray-600 mt-1">
            Souvenirs de nos entraînements et compétitions
          </p>
        </div>
        <Button
          onClick={handleOpenDialog}
          className="bg-[#3b82f6] hover:bg-[#2563eb] text-white"
        >
          <Plus className="h-4 w-4 mr-2" />
          Ajouter une photo
        </Button>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="bg-white border-gray-200">
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <ImageIcon className="h-5 w-5 text-blue-600" />
              <div>
                <div className="text-2xl font-bold text-[#1e293b]">{gallery.length}</div>
                <p className="text-xs text-gray-600 mt-1">Photos totales</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-white border-gray-200">
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-green-600" />
              <div>
                <div className="text-2xl font-bold text-green-600">{events.length}</div>
                <p className="text-xs text-gray-600 mt-1">Événements</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-white border-gray-200">
          <CardContent className="pt-6">
            <div>
              <div className="text-2xl font-bold text-purple-600">
                {gallery.filter((item) => {
                  const date = new Date(item.date);
                  const now = new Date();
                  return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
                }).length}
              </div>
              <p className="text-xs text-gray-600 mt-1">Ce mois</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-white border-gray-200">
          <CardContent className="pt-6">
            <div>
              <div className="text-2xl font-bold text-orange-600">
                {new Date().getFullYear()}
              </div>
              <p className="text-xs text-gray-600 mt-1">Année en cours</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filtres par événement */}
      {events.length > 0 && (
        <Card className="bg-white border-gray-200">
          <CardContent className="pt-6">
            <div className="flex flex-wrap gap-2">
              <Badge variant="outline" className="text-sm">
                Tous les événements
              </Badge>
              {events.map((event) => (
                <Badge key={event} variant="outline" className="text-sm">
                  {event}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Galerie */}
      {gallery.length === 0 ? (
        <Card className="bg-white border-gray-200">
          <CardContent className="py-12 text-center">
            <ImageIcon className="h-16 w-16 mx-auto mb-4 text-gray-400" />
            <p className="text-gray-500 text-lg font-medium">Aucune photo pour le moment</p>
            <p className="text-sm text-gray-400 mt-2">
              Commencez à construire votre galerie en ajoutant vos premières photos
            </p>
            <Button
              onClick={handleOpenDialog}
              className="mt-4 bg-[#3b82f6] hover:bg-[#2563eb] text-white"
            >
              <Plus className="h-4 w-4 mr-2" />
              Ajouter une photo
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {gallery.map((item) => (
            <Card
              key={item.id}
              className="bg-white border-gray-200 overflow-hidden hover:shadow-lg transition-shadow cursor-pointer group"
              onClick={() => handleViewImage(item)}
            >
              <div className="relative aspect-square overflow-hidden bg-gray-100">
                <img
                  src={item.url}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src =
                      "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=400";
                  }}
                />
                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(item.id);
                    }}
                    className="bg-red-600 hover:bg-red-700"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <CardContent className="p-3">
                <h3 className="font-bold text-sm text-[#1e293b] truncate">{item.title}</h3>
                <div className="flex items-center justify-between mt-2">
                  <Badge variant="outline" className="text-xs">
                    {item.event}
                  </Badge>
                  <div className="flex items-center gap-1 text-xs text-gray-500">
                    <Calendar className="h-3 w-3" />
                    {new Date(item.date).toLocaleDateString("fr-FR")}
                  </div>
                </div>
                {item.description && (
                  <p className="text-xs text-gray-600 mt-2 line-clamp-2">{item.description}</p>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Information */}
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="pt-6">
          <div className="flex items-start gap-3">
            <ImageIcon className="h-5 w-5 text-blue-600 mt-1" />
            <div>
              <h3 className="font-bold text-blue-900">💡 Astuce</h3>
              <p className="text-sm text-blue-800 mt-1">
                Utilisez des URL d'images Unsplash pour ajouter rapidement des photos de qualité.
                Par exemple : https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=800
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Dialog d'ajout */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Ajouter une photo</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="url">
                URL de l'image <span className="text-red-500">*</span>
              </Label>
              <Input
                id="url"
                value={formData.url}
                onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                className="border-gray-300"
                placeholder="https://images.unsplash.com/photo-..."
              />
              {formData.url && (
                <div className="mt-2 border rounded-lg overflow-hidden">
                  <img
                    src={formData.url}
                    alt="Aperçu"
                    className="w-full h-48 object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src =
                        "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=400";
                    }}
                  />
                </div>
              )}
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="title">
                  Titre <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="border-gray-300"
                  placeholder="Ex: Entraînement du soir"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="event">
                  Événement <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="event"
                  value={formData.event}
                  onChange={(e) => setFormData({ ...formData, event: e.target.value })}
                  className="border-gray-300"
                  placeholder="Ex: Compétition 2024"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Input
                id="description"
                value={formData.description || ""}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="border-gray-300"
                placeholder="Courte description de la photo"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Annuler
            </Button>
            <Button onClick={handleSave} className="bg-[#3b82f6] hover:bg-[#2563eb]">
              Ajouter
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog de visualisation */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <div className="flex items-center justify-between">
              <DialogTitle>{selectedImage?.title}</DialogTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsViewDialogOpen(false)}
                className="h-8 w-8 p-0"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </DialogHeader>
          {selectedImage && (
            <div className="space-y-4">
              <div className="relative rounded-lg overflow-hidden bg-gray-100">
                <img
                  src={selectedImage.url}
                  alt={selectedImage.title}
                  className="w-full max-h-[500px] object-contain"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src =
                      "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=800";
                  }}
                />
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-sm">
                    {selectedImage.event}
                  </Badge>
                  <div className="flex items-center gap-1 text-sm text-gray-500">
                    <Calendar className="h-4 w-4" />
                    {new Date(selectedImage.date).toLocaleDateString("fr-FR", {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </div>
                </div>
                {selectedImage.description && (
                  <p className="text-gray-700">{selectedImage.description}</p>
                )}
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => window.open(selectedImage.url, "_blank")}
                  className="flex-1"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Télécharger
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => handleDelete(selectedImage.id)}
                  className="bg-red-600 hover:bg-red-700"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Supprimer
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
