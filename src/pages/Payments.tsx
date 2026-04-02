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
import { Plus, Search, Edit, Trash2, DollarSign, Download, CheckCircle, XCircle, Clock, AlertCircle } from "lucide-react";
import { Payment } from "../types";
import { toast } from "sonner";

export function Payments() {
  const { members, payments, setPayments } = useAppContext();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState<string>("all");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingPayment, setEditingPayment] = useState<Payment | null>(null);

  const [formData, setFormData] = useState<Partial<Payment>>({
    memberId: "",
    memberName: "",
    amount: 5000,
    type: "Mensualité",
    date: new Date().toISOString().split("T")[0],
    status: "En attente",
    method: "",
    notes: "",
  });

  const filteredPayments = useMemo(() => {
    return payments.filter((payment) => {
      const matchesSearch =
        payment.memberName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        payment.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        payment.memberId.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesType = filterType === "all" || payment.type === filterType;
      const matchesStatus = filterStatus === "all" || payment.status === filterStatus;
      return matchesSearch && matchesType && matchesStatus;
    });
  }, [payments, searchTerm, filterType, filterStatus]);

  const handleOpenDialog = (payment?: Payment) => {
    if (payment) {
      setEditingPayment(payment);
      setFormData(payment);
    } else {
      setEditingPayment(null);
      setFormData({
        memberId: "",
        memberName: "",
        amount: 5000,
        type: "Mensualité",
        date: new Date().toISOString().split("T")[0],
        status: "En attente",
        method: "",
        notes: "",
      });
    }
    setIsDialogOpen(true);
  };

  const handleSave = () => {
    if (!formData.memberId || !formData.amount || !formData.date) {
      toast.error("Veuillez remplir tous les champs obligatoires");
      return;
    }

    // Trouver le nom du membre
    const member = members.find((m) => m.id === formData.memberId);
    if (!member) {
      toast.error("Membre non trouvé");
      return;
    }

    if (editingPayment) {
      // Update existing payment
      const updatedPayments = payments.map((p) =>
        p.id === editingPayment.id
          ? { ...formData, id: p.id, memberName: member.name } as Payment
          : p
      );
      setPayments(updatedPayments);
      toast.success("Paiement modifié avec succès");
    } else {
      // Add new payment
      const newId = `P${String(payments.length + 1).padStart(3, "0")}`;
      const newPayment: Payment = {
        ...formData,
        id: newId,
        memberName: member.name,
      } as Payment;
      setPayments([...payments, newPayment]);
      toast.success("Nouveau paiement enregistré");
    }
    setIsDialogOpen(false);
  };

  const handleDelete = (paymentId: string) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer ce paiement ?")) {
      setPayments(payments.filter((p) => p.id !== paymentId));
      toast.success("Paiement supprimé");
    }
  };

  const markAsPaid = (payment: Payment) => {
    const updatedPayments = payments.map((p) =>
      p.id === payment.id ? { ...p, status: "Payé" } : p
    );
    setPayments(updatedPayments);
    toast.success("Paiement marqué comme payé");
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Payé":
        return (
          <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
            <CheckCircle className="h-3 w-3 mr-1" />
            Payé
          </Badge>
        );
      case "En attente":
        return (
          <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">
            <Clock className="h-3 w-3 mr-1" />
            En attente
          </Badge>
        );
      case "En retard":
        return (
          <Badge className="bg-red-100 text-red-800 hover:bg-red-100">
            <XCircle className="h-3 w-3 mr-1" />
            En retard
          </Badge>
        );
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const stats = {
    total: payments.reduce((sum, p) => sum + p.amount, 0),
    paid: payments.filter((p) => p.status === "Payé").reduce((sum, p) => sum + p.amount, 0),
    pending: payments.filter((p) => p.status === "En attente").reduce((sum, p) => sum + p.amount, 0),
    late: payments.filter((p) => p.status === "En retard").reduce((sum, p) => sum + p.amount, 0),
    thisMonth: payments
      .filter((p) => {
        const paymentDate = new Date(p.date);
        const now = new Date();
        return (
          paymentDate.getMonth() === now.getMonth() &&
          paymentDate.getFullYear() === now.getFullYear()
        );
      })
      .reduce((sum, p) => sum + (p.status === "Payé" ? p.amount : 0), 0),
  };

  const exportPayments = () => {
    const csvContent =
      "ID,Membre,Type,Montant,Date,Statut,Méthode\n" +
      filteredPayments
        .map(
          (p) =>
            `${p.id},${p.memberName},${p.type},${p.amount},${p.date},${p.status},${p.method || ""}`
        )
        .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `paiements-${new Date().toISOString().split("T")[0]}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    toast.success("Export réussi");
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-[#1e293b]">Gestion des Paiements</h1>
          <p className="text-gray-600 mt-1">Suivez les inscriptions et mensualités</p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={exportPayments}
            className="border-gray-300"
          >
            <Download className="h-4 w-4 mr-2" />
            Exporter
          </Button>
          <Button
            onClick={() => handleOpenDialog()}
            className="bg-[#3b82f6] hover:bg-[#2563eb] text-white"
          >
            <Plus className="h-4 w-4 mr-2" />
            Nouveau paiement
          </Button>
        </div>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card className="bg-white border-gray-200">
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-[#3b82f6]" />
              <div>
                <div className="text-2xl font-bold text-[#1e293b]">
                  {stats.total.toLocaleString()}
                </div>
                <p className="text-xs text-gray-600 mt-1">Total FCFA</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-white border-gray-200">
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <div>
                <div className="text-2xl font-bold text-green-600">
                  {stats.paid.toLocaleString()}
                </div>
                <p className="text-xs text-gray-600 mt-1">Payés FCFA</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-white border-gray-200">
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-yellow-600" />
              <div>
                <div className="text-2xl font-bold text-yellow-600">
                  {stats.pending.toLocaleString()}
                </div>
                <p className="text-xs text-gray-600 mt-1">En attente FCFA</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-white border-gray-200">
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <XCircle className="h-5 w-5 text-red-600" />
              <div>
                <div className="text-2xl font-bold text-red-600">
                  {stats.late.toLocaleString()}
                </div>
                <p className="text-xs text-gray-600 mt-1">En retard FCFA</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-white border-gray-200">
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-purple-600" />
              <div>
                <div className="text-2xl font-bold text-purple-600">
                  {stats.thisMonth.toLocaleString()}
                </div>
                <p className="text-xs text-gray-600 mt-1">Ce mois FCFA</p>
              </div>
            </div>
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
                placeholder="Rechercher par membre, ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 border-gray-300"
              />
            </div>
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="border-gray-300">
                <SelectValue placeholder="Tous types" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous types</SelectItem>
                <SelectItem value="Inscription">Inscription</SelectItem>
                <SelectItem value="Mensualité">Mensualité</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="border-gray-300">
                <SelectValue placeholder="Tous statuts" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous statuts</SelectItem>
                <SelectItem value="Payé">Payé</SelectItem>
                <SelectItem value="En attente">En attente</SelectItem>
                <SelectItem value="En retard">En retard</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Table des paiements */}
      <Card className="bg-white border-gray-200">
        <CardHeader>
          <CardTitle>Liste des Paiements ({filteredPayments.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Membre</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Montant</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead>Méthode</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPayments.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8 text-gray-500">
                      <AlertCircle className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                      Aucun paiement trouvé
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredPayments.map((payment) => (
                    <TableRow key={payment.id}>
                      <TableCell className="font-medium">{payment.id}</TableCell>
                      <TableCell>
                        <div className="font-medium text-[#1e293b]">{payment.memberName}</div>
                        <div className="text-xs text-gray-500">{payment.memberId}</div>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={
                            payment.type === "Inscription"
                              ? "border-blue-300 text-blue-700"
                              : "border-purple-300 text-purple-700"
                          }
                        >
                          {payment.type}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-bold text-[#1e293b]">
                        {payment.amount.toLocaleString()} FCFA
                      </TableCell>
                      <TableCell>{new Date(payment.date).toLocaleDateString("fr-FR")}</TableCell>
                      <TableCell>{getStatusBadge(payment.status)}</TableCell>
                      <TableCell>
                        <span className="text-sm text-gray-600">
                          {payment.method || "-"}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          {payment.status !== "Payé" && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => markAsPaid(payment)}
                              className="hover:bg-green-50 hover:text-green-600"
                            >
                              <CheckCircle className="h-4 w-4" />
                            </Button>
                          )}
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleOpenDialog(payment)}
                            className="hover:bg-blue-50 hover:text-blue-600"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDelete(payment.id)}
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
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              {editingPayment ? "Modifier le paiement" : "Nouveau paiement"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="memberId">
                Membre <span className="text-red-500">*</span>
              </Label>
              <Select
                value={formData.memberId}
                onValueChange={(value) => setFormData({ ...formData, memberId: value })}
              >
                <SelectTrigger className="border-gray-300">
                  <SelectValue placeholder="Sélectionner un membre" />
                </SelectTrigger>
                <SelectContent>
                  {members.map((member) => (
                    <SelectItem key={member.id} value={member.id}>
                      {member.name} ({member.id})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="type">
                  Type <span className="text-red-500">*</span>
                </Label>
                <Select
                  value={formData.type}
                  onValueChange={(value: "Inscription" | "Mensualité") => {
                    setFormData({
                      ...formData,
                      type: value,
                      amount: value === "Inscription" ? 10000 : 5000,
                    });
                  }}
                >
                  <SelectTrigger className="border-gray-300">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Inscription">Inscription</SelectItem>
                    <SelectItem value="Mensualité">Mensualité</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="amount">
                  Montant (FCFA) <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="amount"
                  type="number"
                  value={formData.amount}
                  onChange={(e) =>
                    setFormData({ ...formData, amount: parseInt(e.target.value) || 0 })
                  }
                  className="border-gray-300"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="date">
                  Date <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="date"
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  className="border-gray-300"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="status">Statut</Label>
                <Select
                  value={formData.status}
                  onValueChange={(value) => setFormData({ ...formData, status: value })}
                >
                  <SelectTrigger className="border-gray-300">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="En attente">En attente</SelectItem>
                    <SelectItem value="Payé">Payé</SelectItem>
                    <SelectItem value="En retard">En retard</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="method">Méthode de paiement</Label>
              <Select
                value={formData.method || ""}
                onValueChange={(value) => setFormData({ ...formData, method: value })}
              >
                <SelectTrigger className="border-gray-300">
                  <SelectValue placeholder="Sélectionner une méthode" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Espèces">Espèces</SelectItem>
                  <SelectItem value="Mobile Money">Mobile Money</SelectItem>
                  <SelectItem value="Virement">Virement bancaire</SelectItem>
                  <SelectItem value="Chèque">Chèque</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="notes">Notes</Label>
              <Input
                id="notes"
                value={formData.notes || ""}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                className="border-gray-300"
                placeholder="Notes additionnelles"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Annuler
            </Button>
            <Button onClick={handleSave} className="bg-[#3b82f6] hover:bg-[#2563eb]">
              {editingPayment ? "Enregistrer" : "Ajouter"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
