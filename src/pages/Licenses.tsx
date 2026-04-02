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
import { ShieldCheck, ShieldAlert, ShieldX, User, Edit, Calendar, AlertCircle, Search } from "lucide-react";
import { Member } from "../types";
import { toast } from "sonner";

export function Licenses() {
  const { members, setMembers } = useAppContext();
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<Member | null>(null);

  const [formData, setFormData] = useState({
    licenseStatus: "",
    licenseNumber: "",
    licenseExpiry: "",
  });

  const stats = useMemo(() => {
    const active = members.filter((m) => m.licenseStatus === "Actif").length;
    const pending = members.filter((m) => m.licenseStatus === "En attente").length;
    const expired = members.filter((m) => m.licenseStatus === "Expiré").length;
    const missing = members.filter((m) => m.licenseStatus === "Non disponible").length;

    // Licences expirant dans 30 jours
    const expiringCount = members.filter((m) => {
      if (m.licenseExpiry && m.licenseStatus === "Actif") {
        const expiryDate = new Date(m.licenseExpiry);
        const today = new Date();
        const diffDays = Math.ceil((expiryDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
        return diffDays > 0 && diffDays <= 30;
      }
      return false;
    }).length;

    return { active, pending, expired, missing, expiring: expiringCount };
  }, [members]);

  const filteredMembers = useMemo(() => {
    return members.filter((member) => {
      const matchesStatus =
        filterStatus === "all" || member.licenseStatus === filterStatus;
      const matchesSearch =
        member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (member.licenseNumber || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
        member.id.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesStatus && matchesSearch;
    });
  }, [members, filterStatus, searchTerm]);

  const handleOpenDialog = (member: Member) => {
    setEditingMember(member);
    setFormData({
      licenseStatus: member.licenseStatus,
      licenseNumber: member.licenseNumber || "",
      licenseExpiry: member.licenseExpiry || "",
    });
    setIsDialogOpen(true);
  };

  const handleSave = () => {
    if (editingMember) {
      const updatedMembers = members.map((m) =>
        m.id === editingMember.id
          ? { ...m, ...formData }
          : m
      );
      setMembers(updatedMembers);
      toast.success("Licence mise à jour");
      setIsDialogOpen(false);
    }
  };

  const getLicenseStatusColor = (status: string) => {
    switch (status) {
      case "Actif":
        return "bg-green-100 text-green-800 hover:bg-green-100";
      case "En attente":
        return "bg-yellow-100 text-yellow-800 hover:bg-yellow-100";
      case "Expiré":
        return "bg-red-100 text-red-800 hover:bg-red-100";
      default:
        return "bg-gray-100 text-gray-800 hover:bg-gray-100";
    }
  };

  const getLicenseIcon = (status: string) => {
    switch (status) {
      case "Actif":
        return <ShieldCheck className="h-5 w-5 text-green-600" />;
      case "En attente":
        return <ShieldAlert className="h-5 w-5 text-yellow-600" />;
      case "Expiré":
        return <ShieldX className="h-5 w-5 text-red-600" />;
      default:
        return <ShieldX className="h-5 w-5 text-gray-600" />;
    }
  };

  const getDaysUntilExpiry = (expiryDate: string) => {
    const expiry = new Date(expiryDate);
    const today = new Date();
    const diffDays = Math.ceil((expiry.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-[#1e293b]">Gestion des Licences</h1>
        <p className="text-gray-600 mt-1">Suivi des licences sportives de Boxe et Kung Fu</p>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <Card className="bg-white border-gray-200">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Licences actives
            </CardTitle>
            <ShieldCheck className="h-5 w-5 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">{stats.active}</div>
            <p className="text-xs text-gray-500 mt-1">
              {Math.round((stats.active / members.length) * 100)}% des membres
            </p>
          </CardContent>
        </Card>

        <Card className="bg-white border-gray-200">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              En attente
            </CardTitle>
            <ShieldAlert className="h-5 w-5 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-yellow-600">{stats.pending}</div>
            <p className="text-xs text-gray-500 mt-1">À traiter</p>
          </CardContent>
        </Card>

        <Card className="bg-white border-gray-200">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Expirées
            </CardTitle>
            <ShieldX className="h-5 w-5 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-red-600">{stats.expired}</div>
            <p className="text-xs text-gray-500 mt-1">À renouveler</p>
          </CardContent>
        </Card>

        <Card className="bg-white border-gray-200">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Bientôt expirées
            </CardTitle>
            <AlertCircle className="h-5 w-5 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-orange-600">{stats.expiring}</div>
            <p className="text-xs text-gray-500 mt-1">Dans 30 jours</p>
          </CardContent>
        </Card>

        <Card className="bg-white border-gray-200">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Non disponibles
            </CardTitle>
            <ShieldX className="h-5 w-5 text-gray-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-600">{stats.missing}</div>
            <p className="text-xs text-gray-500 mt-1">Sans licence</p>
          </CardContent>
        </Card>
      </div>

      {/* Filtres */}
      <Card className="bg-white border-gray-200">
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Rechercher par nom, numéro de licence..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 border-gray-300"
              />
            </div>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="border-gray-300">
                <SelectValue placeholder="Tous statuts" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous statuts</SelectItem>
                <SelectItem value="Actif">Actives</SelectItem>
                <SelectItem value="En attente">En attente</SelectItem>
                <SelectItem value="Expiré">Expirées</SelectItem>
                <SelectItem value="Non disponible">Non disponibles</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Table des licences */}
      <Card className="bg-white border-gray-200">
        <CardHeader>
          <CardTitle>Liste des Licences ({filteredMembers.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Membre</TableHead>
                  <TableHead>Discipline</TableHead>
                  <TableHead>Numéro de licence</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead>Date d'expiration</TableHead>
                  <TableHead>Jours restants</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredMembers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8 text-gray-500">
                      <AlertCircle className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                      Aucune licence trouvée
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredMembers.map((member) => {
                    const daysLeft = member.licenseExpiry
                      ? getDaysUntilExpiry(member.licenseExpiry)
                      : null;

                    return (
                      <TableRow key={member.id}>
                        <TableCell className="font-medium">{member.id}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                              <User className="h-4 w-4 text-gray-600" />
                            </div>
                            <div>
                              <div className="font-medium text-[#1e293b]">{member.name}</div>
                              <div className="text-xs text-gray-500">{member.email}</div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{member.discipline}</Badge>
                        </TableCell>
                        <TableCell>
                          <span className="font-mono text-sm">
                            {member.licenseNumber || "-"}
                          </span>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            {getLicenseIcon(member.licenseStatus)}
                            <Badge className={getLicenseStatusColor(member.licenseStatus)}>
                              {member.licenseStatus}
                            </Badge>
                          </div>
                        </TableCell>
                        <TableCell>
                          {member.licenseExpiry ? (
                            <div className="flex items-center gap-1 text-sm">
                              <Calendar className="h-3 w-3 text-gray-500" />
                              {new Date(member.licenseExpiry).toLocaleDateString("fr-FR")}
                            </div>
                          ) : (
                            <span className="text-sm text-gray-400">-</span>
                          )}
                        </TableCell>
                        <TableCell>
                          {daysLeft !== null ? (
                            <Badge
                              className={
                                daysLeft < 0
                                  ? "bg-red-100 text-red-800 hover:bg-red-100"
                                  : daysLeft <= 30
                                  ? "bg-orange-100 text-orange-800 hover:bg-orange-100"
                                  : "bg-green-100 text-green-800 hover:bg-green-100"
                              }
                            >
                              {daysLeft < 0
                                ? `Expiré depuis ${Math.abs(daysLeft)}j`
                                : `${daysLeft} jours`}
                            </Badge>
                          ) : (
                            <span className="text-sm text-gray-400">-</span>
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleOpenDialog(member)}
                            className="hover:bg-blue-50 hover:text-blue-600"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Alertes */}
      {stats.expiring > 0 && (
        <Card className="bg-orange-50 border-orange-200">
          <CardContent className="pt-6">
            <div className="flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-orange-600 mt-1" />
              <div>
                <h3 className="font-bold text-orange-900">Licences à renouveler</h3>
                <p className="text-sm text-orange-800 mt-1">
                  {stats.expiring} licence(s) expire(nt) dans les 30 prochains jours.
                  Contactez les membres concernés pour le renouvellement.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Dialog de modification */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Modifier la licence - {editingMember?.name}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="licenseStatus">Statut de la licence</Label>
              <Select
                value={formData.licenseStatus}
                onValueChange={(value) =>
                  setFormData({ ...formData, licenseStatus: value })
                }
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
                value={formData.licenseNumber}
                onChange={(e) =>
                  setFormData({ ...formData, licenseNumber: e.target.value })
                }
                className="border-gray-300"
                placeholder="Ex: BOX2024001"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="licenseExpiry">Date d'expiration</Label>
              <Input
                id="licenseExpiry"
                type="date"
                value={formData.licenseExpiry}
                onChange={(e) =>
                  setFormData({ ...formData, licenseExpiry: e.target.value })
                }
                className="border-gray-300"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Annuler
            </Button>
            <Button onClick={handleSave} className="bg-[#3b82f6] hover:bg-[#2563eb]">
              Enregistrer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
