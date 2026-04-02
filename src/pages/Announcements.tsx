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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { Badge } from "../components/ui/badge";
import { Plus, Edit, Trash2, Info, AlertTriangle, CheckCircle, Bell, Calendar, User } from "lucide-react";
import { Announcement } from "../types";
import { toast } from "sonner";

export function Announcements() {
  const { announcements, setAnnouncements } = useAppContext();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingAnnouncement, setEditingAnnouncement] = useState<Announcement | null>(null);

  const [formData, setFormData] = useState<Partial<Announcement>>({
    title: "",
    content: "",
    type: "info",
    author: "Administration",
  });

  const handleOpenDialog = (announcement?: Announcement) => {
    if (announcement) {
      setEditingAnnouncement(announcement);
      setFormData(announcement);
    } else {
      setEditingAnnouncement(null);
      setFormData({
        title: "",
        content: "",
        type: "info",
        author: "Administration",
      });
    }
    setIsDialogOpen(true);
  };

  const handleSave = () => {
    if (!formData.title || !formData.content) {
      toast.error("Veuillez remplir tous les champs");
      return;
    }

    if (editingAnnouncement) {
      // Modifier l'annonce existante
      const updatedAnnouncements = announcements.map((a) =>
        a.id === editingAnnouncement.id
          ? { ...formData, id: a.id, date: a.date } as Announcement
          : a
      );
      setAnnouncements(updatedAnnouncements);
      toast.success("Annonce modifiée");
    } else {
      // Ajouter nouvelle annonce
      const newId = `AN${String(announcements.length + 1).padStart(3, "0")}`;
      const newAnnouncement: Announcement = {
        ...formData,
        id: newId,
        date: new Date().toISOString().split("T")[0],
      } as Announcement;
      setAnnouncements([newAnnouncement, ...announcements]);
      toast.success("Nouvelle annonce publiée");
    }
    setIsDialogOpen(false);
  };

  const handleDelete = (id: string) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer cette annonce ?")) {
      setAnnouncements(announcements.filter((a) => a.id !== id));
      toast.success("Annonce supprimée");
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "info":
        return <Info className="h-5 w-5 text-blue-600" />;
      case "warning":
        return <AlertTriangle className="h-5 w-5 text-yellow-600" />;
      case "success":
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case "urgent":
        return <Bell className="h-5 w-5 text-red-600" />;
      default:
        return <Info className="h-5 w-5 text-gray-600" />;
    }
  };

  const getTypeBadge = (type: string) => {
    switch (type) {
      case "info":
        return (
          <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">
            <Info className="h-3 w-3 mr-1" />
            Information
          </Badge>
        );
      case "warning":
        return (
          <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">
            <AlertTriangle className="h-3 w-3 mr-1" />
            Attention
          </Badge>
        );
      case "success":
        return (
          <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
            <CheckCircle className="h-3 w-3 mr-1" />
            Événement
          </Badge>
        );
      case "urgent":
        return (
          <Badge className="bg-red-100 text-red-800 hover:bg-red-100">
            <Bell className="h-3 w-3 mr-1" />
            Urgent
          </Badge>
        );
      default:
        return <Badge variant="outline">{type}</Badge>;
    }
  };

  const getCardColor = (type: string) => {
    switch (type) {
      case "info":
        return "border-blue-200 bg-blue-50";
      case "warning":
        return "border-yellow-200 bg-yellow-50";
      case "success":
        return "border-green-200 bg-green-50";
      case "urgent":
        return "border-red-200 bg-red-50";
      default:
        return "border-gray-200 bg-white";
    }
  };

  const sortedAnnouncements = [...announcements].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-[#1e293b]">Annonces & Informations</h1>
          <p className="text-gray-600 mt-1">Communiquez avec tous les membres</p>
        </div>
        <Button
          onClick={() => handleOpenDialog()}
          className="bg-[#3b82f6] hover:bg-[#2563eb] text-white"
        >
          <Plus className="h-4 w-4 mr-2" />
          Nouvelle annonce
        </Button>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="bg-white border-gray-200">
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-[#1e293b]">{announcements.length}</div>
            <p className="text-xs text-gray-600 mt-1">Total annonces</p>
          </CardContent>
        </Card>
        <Card className="bg-white border-gray-200">
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-blue-600">
              {announcements.filter((a) => a.type === "info").length}
            </div>
            <p className="text-xs text-gray-600 mt-1">Informations</p>
          </CardContent>
        </Card>
        <Card className="bg-white border-gray-200">
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-yellow-600">
              {announcements.filter((a) => a.type === "warning").length}
            </div>
            <p className="text-xs text-gray-600 mt-1">Alertes</p>
          </CardContent>
        </Card>
        <Card className="bg-white border-gray-200">
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-green-600">
              {announcements.filter((a) => a.type === "success").length}
            </div>
            <p className="text-xs text-gray-600 mt-1">Événements</p>
          </CardContent>
        </Card>
      </div>

      {/* Liste des annonces */}
      <div className="space-y-4">
        {sortedAnnouncements.length === 0 ? (
          <Card className="bg-white border-gray-200">
            <CardContent className="py-12 text-center">
              <Info className="h-12 w-12 mx-auto mb-4 text-gray-400" />
              <p className="text-gray-500">Aucune annonce pour le moment</p>
              <p className="text-sm text-gray-400 mt-1">
                Cliquez sur "Nouvelle annonce" pour en créer une
              </p>
            </CardContent>
          </Card>
        ) : (
          sortedAnnouncements.map((announcement) => (
            <Card key={announcement.id} className={`border ${getCardColor(announcement.type)}`}>
              <CardHeader>
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3 flex-1">
                    <div className="mt-1">{getTypeIcon(announcement.type)}</div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        {getTypeBadge(announcement.type)}
                        <div className="flex items-center gap-1 text-xs text-gray-500">
                          <Calendar className="h-3 w-3" />
                          {new Date(announcement.date).toLocaleDateString("fr-FR", {
                            weekday: "long",
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })}
                        </div>
                      </div>
                      <CardTitle className="text-xl text-[#1e293b]">
                        {announcement.title}
                      </CardTitle>
                      <p className="text-gray-700 mt-2 whitespace-pre-wrap">
                        {announcement.content}
                      </p>
                      {announcement.author && (
                        <div className="flex items-center gap-1 text-xs text-gray-500 mt-3">
                          <User className="h-3 w-3" />
                          Publié par {announcement.author}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleOpenDialog(announcement)}
                      className="hover:bg-blue-100 hover:text-blue-600"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(announcement.id)}
                      className="hover:bg-red-100 hover:text-red-600"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
            </Card>
          ))
        )}
      </div>

      {/* Dialog d'ajout/modification */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {editingAnnouncement ? "Modifier l'annonce" : "Nouvelle annonce"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="type">
                  Type <span className="text-red-500">*</span>
                </Label>
                <Select
                  value={formData.type}
                  onValueChange={(value: any) => setFormData({ ...formData, type: value })}
                >
                  <SelectTrigger className="border-gray-300">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="info">
                      <div className="flex items-center gap-2">
                        <Info className="h-4 w-4 text-blue-600" />
                        Information
                      </div>
                    </SelectItem>
                    <SelectItem value="warning">
                      <div className="flex items-center gap-2">
                        <AlertTriangle className="h-4 w-4 text-yellow-600" />
                        Attention
                      </div>
                    </SelectItem>
                    <SelectItem value="success">
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        Événement
                      </div>
                    </SelectItem>
                    <SelectItem value="urgent">
                      <div className="flex items-center gap-2">
                        <Bell className="h-4 w-4 text-red-600" />
                        Urgent
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="author">Auteur</Label>
                <Input
                  id="author"
                  value={formData.author || ""}
                  onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                  className="border-gray-300"
                  placeholder="Ex: Coach Principal"
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
                placeholder="Ex: Rappel d'entraînement"
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
                placeholder="Saisissez le contenu de l'annonce..."
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Annuler
            </Button>
            <Button onClick={handleSave} className="bg-[#3b82f6] hover:bg-[#2563eb]">
              {editingAnnouncement ? "Enregistrer" : "Publier"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
