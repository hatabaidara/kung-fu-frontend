import React, { useState, useMemo } from "react";
import { useAppContext } from "../context/AppContext";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Checkbox } from "../components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../components/ui/table";
import { Badge } from "../components/ui/badge";
import { Calendar, Users, CheckCircle, XCircle, Search, Download, TrendingUp } from "lucide-react";
import { Attendance as AttendanceType } from "../types";
import { toast } from "sonner";

export function Attendance() {
  const { members, attendance, setAttendance } = useAppContext();
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0]);
  const [filterDiscipline, setFilterDiscipline] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState("");

  // Filtrer les membres actifs
  const activeMembers = useMemo(() => {
    return members.filter((m) => {
      const matchesDiscipline =
        filterDiscipline === "all" || m.discipline.includes(filterDiscipline);
      const matchesSearch =
        m.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        m.id.toLowerCase().includes(searchTerm.toLowerCase());
      return m.active && matchesDiscipline && matchesSearch;
    });
  }, [members, filterDiscipline, searchTerm]);

  // Obtenir les présences du jour sélectionné
  const attendanceForDate = useMemo(() => {
    return attendance.filter((a) => a.date === selectedDate);
  }, [attendance, selectedDate]);

  // Marquer la présence
  const toggleAttendance = (memberId: string, memberName: string, discipline: string) => {
    const existingAttendance = attendanceForDate.find((a) => a.memberId === memberId);

    if (existingAttendance) {
      // Toggle présence existante
      const updatedAttendance = attendance.map((a) =>
        a.id === existingAttendance.id ? { ...a, present: !a.present } : a
      );
      setAttendance(updatedAttendance);
      toast.success(
        `${memberName} marqué comme ${!existingAttendance.present ? "présent" : "absent"}`
      );
    } else {
      // Créer nouvelle présence
      const newId = `A${String(attendance.length + 1).padStart(3, "0")}`;
      const newAttendance: AttendanceType = {
        id: newId,
        memberId,
        memberName,
        date: selectedDate,
        present: true,
        discipline,
      };
      setAttendance([...attendance, newAttendance]);
      toast.success(`${memberName} marqué comme présent`);
    }
  };

  // Marquer tous présents
  const markAllPresent = () => {
    const newAttendances: AttendanceType[] = [];
    activeMembers.forEach((member) => {
      const existingAttendance = attendanceForDate.find((a) => a.memberId === member.id);
      if (!existingAttendance) {
        const newId = `A${String(attendance.length + newAttendances.length + 1).padStart(3, "0")}`;
        newAttendances.push({
          id: newId,
          memberId: member.id,
          memberName: member.name,
          date: selectedDate,
          present: true,
          discipline: member.discipline,
        });
      }
    });

    if (newAttendances.length > 0) {
      setAttendance([...attendance, ...newAttendances]);
      toast.success(`${newAttendances.length} membres marqués présents`);
    } else {
      toast.info("Tous les membres sont déjà enregistrés pour cette date");
    }
  };

  // Statistiques
  const stats = useMemo(() => {
    const totalToday = attendanceForDate.filter((a) => a.present).length;
    const totalThisWeek = attendance.filter((a) => {
      const attendanceDate = new Date(a.date);
      const weekStart = new Date();
      weekStart.setDate(weekStart.getDate() - weekStart.getDay() + 1); // Lundi
      weekStart.setHours(0, 0, 0, 0);
      const weekEnd = new Date(weekStart);
      weekEnd.setDate(weekEnd.getDate() + 6); // Dimanche
      weekEnd.setHours(23, 59, 59, 999);
      return a.present && attendanceDate >= weekStart && attendanceDate <= weekEnd;
    }).length;

    const totalThisMonth = attendance.filter((a) => {
      const attendanceDate = new Date(a.date);
      const now = new Date();
      return (
        a.present &&
        attendanceDate.getMonth() === now.getMonth() &&
        attendanceDate.getFullYear() === now.getFullYear()
      );
    }).length;

    // Taux de présence moyen
    const uniqueDates = [...new Set(attendance.map((a) => a.date))];
    const avgAttendance =
      uniqueDates.length > 0
        ? Math.round(
            (attendance.filter((a) => a.present).length / uniqueDates.length) * 100
          ) / 100
        : 0;

    return {
      today: totalToday,
      thisWeek: totalThisWeek,
      thisMonth: totalThisMonth,
      avgAttendance,
    };
  }, [attendance, attendanceForDate]);

  // Export en CSV
  const exportAttendance = () => {
    const csvContent =
      "Date,Membre ID,Nom,Discipline,Présent\n" +
      attendance
        .map(
          (a) =>
            `${a.date},${a.memberId},${a.memberName},${a.discipline},${a.present ? "Oui" : "Non"}`
        )
        .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `presences-${new Date().toISOString().split("T")[0]}.csv`;
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
          <h1 className="text-3xl font-bold text-[#1e293b]">Contrôle des Présences</h1>
          <p className="text-gray-600 mt-1">Lundi - Mercredi - Vendredi</p>
        </div>
        <Button
          variant="outline"
          onClick={exportAttendance}
          className="border-gray-300"
        >
          <Download className="h-4 w-4 mr-2" />
          Exporter
        </Button>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-white border-gray-200">
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-blue-600" />
              <div>
                <div className="text-2xl font-bold text-[#1e293b]">{stats.today}</div>
                <p className="text-xs text-gray-600 mt-1">Présents aujourd'hui</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-white border-gray-200">
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-green-600" />
              <div>
                <div className="text-2xl font-bold text-green-600">{stats.thisWeek}</div>
                <p className="text-xs text-gray-600 mt-1">Cette semaine</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-white border-gray-200">
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-purple-600" />
              <div>
                <div className="text-2xl font-bold text-purple-600">{stats.thisMonth}</div>
                <p className="text-xs text-gray-600 mt-1">Ce mois</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-white border-gray-200">
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-orange-600" />
              <div>
                <div className="text-2xl font-bold text-orange-600">{stats.avgAttendance}</div>
                <p className="text-xs text-gray-600 mt-1">Moyenne/session</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Sélection de date et filtres */}
      <Card className="bg-white border-gray-200">
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label htmlFor="date">Date de la session</Label>
              <Input
                id="date"
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="border-gray-300"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="discipline">Discipline</Label>
              <Select value={filterDiscipline} onValueChange={setFilterDiscipline}>
                <SelectTrigger className="border-gray-300">
                  <SelectValue placeholder="Toutes" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Toutes disciplines</SelectItem>
                  <SelectItem value="Boxe">Boxe</SelectItem>
                  <SelectItem value="Kung Fu">Kung Fu</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="search">Rechercher</Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  id="search"
                  placeholder="Nom ou ID..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 border-gray-300"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>&nbsp;</Label>
              <Button
                onClick={markAllPresent}
                className="w-full bg-green-600 hover:bg-green-700 text-white"
              >
                <CheckCircle className="h-4 w-4 mr-2" />
                Tout marquer présent
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Liste de présence */}
      <Card className="bg-white border-gray-200">
        <CardHeader>
          <CardTitle>
            Feuille de présence - {new Date(selectedDate).toLocaleDateString("fr-FR", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Nom</TableHead>
                  <TableHead>Discipline</TableHead>
                  <TableHead>Licence</TableHead>
                  <TableHead className="text-center">Présence</TableHead>
                  <TableHead>Statut</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {activeMembers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                      Aucun membre trouvé
                    </TableCell>
                  </TableRow>
                ) : (
                  activeMembers.map((member) => {
                    const attendanceRecord = attendanceForDate.find(
                      (a) => a.memberId === member.id
                    );
                    const isPresent = attendanceRecord?.present || false;

                    return (
                      <TableRow key={member.id}>
                        <TableCell className="font-medium">{member.id}</TableCell>
                        <TableCell>
                          <div className="font-medium text-[#1e293b]">{member.name}</div>
                          {member.age && (
                            <div className="text-xs text-gray-500">{member.age} ans</div>
                          )}
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{member.discipline}</Badge>
                        </TableCell>
                        <TableCell>
                          <Badge
                            className={
                              member.licenseStatus === "Actif"
                                ? "bg-green-100 text-green-800 hover:bg-green-100"
                                : "bg-yellow-100 text-yellow-800 hover:bg-yellow-100"
                            }
                          >
                            {member.licenseStatus}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-center">
                          <Checkbox
                            checked={isPresent}
                            onCheckedChange={() =>
                              toggleAttendance(member.id, member.name, member.discipline)
                            }
                            className="w-5 h-5"
                          />
                        </TableCell>
                        <TableCell>
                          {attendanceRecord ? (
                            isPresent ? (
                              <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
                                <CheckCircle className="h-3 w-3 mr-1" />
                                Présent
                              </Badge>
                            ) : (
                              <Badge className="bg-red-100 text-red-800 hover:bg-red-100">
                                <XCircle className="h-3 w-3 mr-1" />
                                Absent
                              </Badge>
                            )
                          ) : (
                            <Badge variant="outline" className="text-gray-500">
                              Non enregistré
                            </Badge>
                          )}
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </div>

          {/* Résumé */}
          {activeMembers.length > 0 && (
            <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold text-[#1e293b]">{activeMembers.length}</div>
                  <p className="text-sm text-gray-600">Total membres</p>
                </div>
                <div>
                  <div className="text-2xl font-bold text-green-600">{stats.today}</div>
                  <p className="text-sm text-gray-600">Présents</p>
                </div>
                <div>
                  <div className="text-2xl font-bold text-red-600">
                    {activeMembers.length - stats.today}
                  </div>
                  <p className="text-sm text-gray-600">Absents</p>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Info Planning */}
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="pt-6">
          <div className="flex items-start gap-3">
            <Calendar className="h-5 w-5 text-blue-600 mt-1" />
            <div>
              <h3 className="font-bold text-blue-900">Planning d'entraînement</h3>
              <p className="text-sm text-blue-800 mt-1">
                Les sessions d'entraînement ont lieu les <strong>Lundis, Mercredis et Vendredis</strong> à partir de 18h00.
                Assurez-vous d'enregistrer les présences à chaque session.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}