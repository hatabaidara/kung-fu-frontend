import React, { useState, useMemo } from "react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../components/ui/table";
import { Badge } from "../components/ui/badge";
import { Plus, Search, Edit, Trash2, User, Phone, Mail, Calendar, AlertCircle } from "lucide-react";
import { Member } from "../types";
import { toast } from "sonner";

export function Members() {
  const { members, setMembers, payments, setPayments } = useAppContext();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterDiscipline, setFilterDiscipline] = useState<string>("all");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<Member | null>(null);
  const [memberToDelete, setMemberToDelete] = useState<Member | null>(null);

  const [formData, setFormData] = useState<Partial<Member>>({
    name: "",
    phone: "",
    email: "",
    discipline: "Boxe",
    age: 18,
    address: "",
    parent: "",
    licenseStatus: "En attente",
    licenseNumber: "",
    licenseExpiry: "",
    active: true,
  });

  const filteredMembers = useMemo(() => {
    return members.filter((member) => {
      const matchesSearch =
        member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        member.phone.includes(searchTerm) ||
        member.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        member.id.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesDiscipline =
        filterDiscipline === "all" || member.discipline === filterDiscipline;
      const matchesStatus =
        filterStatus === "all" ||
        (filterStatus === "active" && member.active) ||
        (filterStatus === "inactive" && !member.active) ||
        member.licenseStatus === filterStatus;
      return matchesSearch && matchesDiscipline && matchesStatus;
    });
  }, [members, searchTerm, filterDiscipline, filterStatus]);

  const handleOpenDialog = (member?: Member) => {
    if (member) {
      setEditingMember(member);
      setFormData(member);
    } else {
      setEditingMember(null);
      setFormData({
        name: "",
        phone: "",
        email: "",
        discipline: "Boxe",
        age: 18,
        address: "",
        parent: "",
        licenseStatus: "En attente",
        licenseNumber: "",
        licenseExpiry: "",
        active: true,
      });
    }
    setIsDialogOpen(true);
  };

  const handleSave = () => {
    if (!formData.name || !formData.phone || !formData.email || !formData.discipline) {
      toast.error("Veuillez remplir tous les champs obligatoires");
      return;
    }

    if (editingMember) {
      // Update existing member
      const updatedMembers = members.map((m) =>
        m.id === editingMember.id ? { ...formData, id: m.id, joinDate: m.joinDate } as Member : m
      );
      setMembers(updatedMembers);
      toast.success("Membre modifié avec succès");
    } else {
      // Add new member
      const newId = `M${String(members.length + 1).padStart(3, "0")}`;
      const newMember: Member = {
        ...formData,
        id: newId,
        joinDate: new Date().toISOString().split("T")[0],
      } as Member;
      setMembers([...members, newMember]);

      // Créer le paiement d'inscription
      const newPaymentId = `P${String(payments.length + 1).padStart(3, "0")}`;
      const inscriptionPayment = {
        id: newPaymentId,
        memberId: newId,
        memberName: formData.name!,
        amount: 10000,
        type: "Inscription" as const,
        date: new Date().toISOString().split("T")[0],
        status: "En attente",
      };
      setPayments([...payments, inscriptionPayment]);

      toast.success("Nouveau membre ajouté avec succès");
    }
    setIsDialogOpen(false);
  };

  const handleDelete = () => {
    if (memberToDelete) {
      // Supprimer le membre
      setMembers(members.filter((m) => m.id !== memberToDelete.id));
      // Optionnel: Supprimer aussi les paiements et présences associés
      toast.success(`Membre ${memberToDelete.name} supprimé`);
      setIsDeleteDialogOpen(false);
      setMemberToDelete(null);
    }
  };

  const toggleMemberStatus = (member: Member) => {
    const updatedMembers = members.map((m) =>
      m.id === member.id ? { ...m, active: !m.active } : m
    );
    setMembers(updatedMembers);
    toast.success(`Membre ${member.active ? "désactivé" : "activé"}`);
  };

  const getLicenseStatusBadge = (status: string) => {
    switch (status) {
      case "Actif":
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Actif</Badge>;
      case "En attente":
        return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">En attente</Badge>;
      case "Expiré":
        return <Badge className="bg-red-100 text-red-800 hover:bg-red-100">Expiré</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-100">N/A</Badge>;
    }
  };

  const stats = {
    total: members.length,
    active: members.filter((m) => m.active).length,
    boxe: members.filter((m) => m.discipline.includes("Boxe")).length,
    kungFu: members.filter((m) => m.discipline.includes("Kung Fu")).length,
    withLicense: members.filter((m) => m.licenseStatus === "Actif").length,
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-[#1e293b]">Gestion des Membres</h1>
          <p className="text-gray-600 mt-1">Gérez les adhérents de votre salle de sport</p>
        </div>
        <Button
          onClick={() => handleOpenDialog()}
          className="bg-[#3b82f6] hover:bg-[#2563eb] text-white"
        >
          <Plus className="h-4 w-4 mr-2" />
          Nouveau membre
        </Button>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <Card className="bg-white border-gray-200">
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-[#1e293b]">{stats.total}</div>
            <p className="text-xs text-gray-600 mt-1">Total Membres</p>
          </CardContent>
        </Card>
        <Card className="bg-white border-gray-200">
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-green-600">{stats.active}</div>
            <p className="text-xs text-gray-600 mt-1">Actifs</p>
          </CardContent>
        </Card>
        <Card className="bg-white border-gray-200">
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-blue-600">{stats.boxe}</div>
            <p className="text-xs text-gray-600 mt-1">Boxe</p>
          </CardContent>
        </Card>
        <Card className="bg-white border-gray-200">
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-purple-600">{stats.kungFu}</div>
            <p className="text-xs text-gray-600 mt-1">Kung Fu</p>
          </CardContent>
        </Card>
        <Card className="bg-white border-gray-200">
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-orange-600">{stats.withLicense}</div>
            <p className="text-xs text-gray-600 mt-1">Avec Licence</p>
          </CardContent>
        </Card>
      </div>

      {/* Recherche et filtres */}
      <Card className="bg-white border-gray-200">
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Rechercher par nom, ID, téléphone, email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 border-gray-300"
              />
            </div>
            <Select value={filterDiscipline} onValueChange={setFilterDiscipline}>
              <SelectTrigger className="border-gray-300">
                <SelectValue placeholder="Toutes disciplines" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Toutes disciplines</SelectItem>
                <SelectItem value="Boxe">Boxe</SelectItem>
                <SelectItem value="Kung Fu">Kung Fu</SelectItem>
                <SelectItem value="Boxe et Kung Fu">Boxe et Kung Fu</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="border-gray-300">
                <SelectValue placeholder="Tous statuts" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous statuts</SelectItem>
                <SelectItem value="active">Actifs</SelectItem>
                <SelectItem value="inactive">Inactifs</SelectItem>
                <SelectItem value="Actif">Licence Active</SelectItem>
                <SelectItem value="En attente">Licence En attente</SelectItem>
                <SelectItem value="Expiré">Licence Expirée</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Table des membres */}
      <Card className="bg-white border-gray-200">
        <CardHeader>
          <CardTitle>Liste des Membres ({filteredMembers.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Nom</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Discipline</TableHead>
                  <TableHead>Licence</TableHead>
                  <TableHead>Date d'adhésion</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredMembers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8 text-gray-500">
                      <AlertCircle className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                      Aucun membre trouvé
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredMembers.map((member) => (
                    <TableRow key={member.id}>
                      <TableCell className="font-medium">{member.id}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                            <User className="h-4 w-4 text-gray-600" />
                          </div>
                          <div>
                            <div className="font-medium text-[#1e293b]">{member.name}</div>
                            {member.age && (
                              <div className="text-xs text-gray-500">{member.age} ans</div>
                            )}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1 text-sm">
                          <div className="flex items-center gap-1 text-gray-600">
                            <Phone className="h-3 w-3" />
                            {member.phone}
                          </div>
                          <div className="flex items-center gap-1 text-gray-600">
                            <Mail className="h-3 w-3" />
                            {member.email}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="font-medium">
                          {member.discipline}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          {getLicenseStatusBadge(member.licenseStatus)}
                          {member.licenseNumber && (
                            <div className="text-xs text-gray-500">{member.licenseNumber}</div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1 text-sm text-gray-600">
                          <Calendar className="h-3 w-3" />
                          {new Date(member.joinDate).toLocaleDateString("fr-FR")}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge
                          className={
                            member.active
                              ? "bg-green-100 text-green-800 hover:bg-green-100"
                              : "bg-gray-100 text-gray-800 hover:bg-gray-100"
                          }
                        >
                          {member.active ? "Actif" : "Inactif"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleOpenDialog(member)}
                            className="hover:bg-blue-50 hover:text-blue-600"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setMemberToDelete(member);
                              setIsDeleteDialogOpen(true);
                            }}
                            className="hover:bg-red-50 hover:text-red-600"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Dialog d'ajout/modification */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingMember ? "Modifier le membre" : "Nouveau membre"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">
                  Nom complet <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="border-gray-300"
                  placeholder="Ex: Ahmed Diallo"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">
                  Téléphone <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="border-gray-300"
                  placeholder="77 123 45 67"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">
                  Email <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="border-gray-300"
                  placeholder="email@exemple.com"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="discipline">
                  Discipline <span className="text-red-500">*</span>
                </Label>
                <Select
                  value={formData.discipline}
                  onValueChange={(value) => setFormData({ ...formData, discipline: value })}
                >
                  <SelectTrigger className="border-gray-300">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Boxe">Boxe</SelectItem>
                    <SelectItem value="Kung Fu">Kung Fu</SelectItem>
                    <SelectItem value="Boxe et Kung Fu">Boxe et Kung Fu</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="age">Âge</Label>
                <Input
                  id="age"
                  type="number"
                  value={formData.age}
                  onChange={(e) => setFormData({ ...formData, age: parseInt(e.target.value) })}
                  className="border-gray-300"
                  placeholder="18"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="parent">Parent/Tuteur (si mineur)</Label>
                <Input
                  id="parent"
                  value={formData.parent || ""}
                  onChange={(e) => setFormData({ ...formData, parent: e.target.value })}
                  className="border-gray-300"
                  placeholder="Nom du parent"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="address">Adresse</Label>
              <Input
                id="address"
                value={formData.address || ""}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                className="border-gray-300"
                placeholder="Dakar, Plateau"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="licenseStatus">Statut de la licence</Label>
                <Select
                  value={formData.licenseStatus}
                  onValueChange={(value) => setFormData({ ...formData, licenseStatus: value })}
                >
                  <SelectTrigger className="border-gray-300">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="En attente">En attente</SelectItem>
                    <SelectItem value="Actif">Actif</SelectItem>
                    <SelectItem value="Expiré">Expiré</SelectItem>
                    <SelectItem value="Non disponible">Non disponible</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="licenseNumber">Numéro de licence</Label>
                <Input
                  id="licenseNumber"
                  value={formData.licenseNumber || ""}
                  onChange={(e) => setFormData({ ...formData, licenseNumber: e.target.value })}
                  className="border-gray-300"
                  placeholder="BOX2024001"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="licenseExpiry">Date d'expiration de la licence</Label>
              <Input
                id="licenseExpiry"
                type="date"
                value={formData.licenseExpiry || ""}
                onChange={(e) => setFormData({ ...formData, licenseExpiry: e.target.value })}
                className="border-gray-300"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Annuler
            </Button>
            <Button onClick={handleSave} className="bg-[#3b82f6] hover:bg-[#2563eb]">
              {editingMember ? "Enregistrer" : "Ajouter"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog de confirmation de suppression */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmer la suppression</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p className="text-gray-600">
              Êtes-vous sûr de vouloir supprimer le membre{" "}
              <span className="font-bold text-[#1e293b]">{memberToDelete?.name}</span> ?
            </p>
            <p className="text-sm text-red-600 mt-2">
              Cette action est irréversible et supprimera toutes les données associées.
            </p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Annuler
            </Button>
            <Button
              onClick={handleDelete}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              Supprimer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
