import React, { useMemo } from "react";
import { useAppContext } from "../context/AppContext";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { Link } from "react-router";
import { 
  Users, 
  DollarSign, 
  TrendingUp, 
  Calendar, 
  ShieldCheck, 
  ShieldAlert,
  AlertCircle,
  CheckCircle,
  XCircle,
  Bell,
  ArrowRight
} from "lucide-react";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell,
  LineChart,
  Line
} from "recharts";

export function Dashboard() {
  const { members, payments, attendance, announcements } = useAppContext();

  const stats = useMemo(() => {
    const totalMembers = members.length;
    const activeMembers = members.filter(m => m.active).length;
    const inactiveMembers = totalMembers - activeMembers;
    
    // Licences
    const activeLicenses = members.filter(m => m.licenseStatus === "Actif").length;
    const pendingLicenses = members.filter(m => m.licenseStatus === "En attente").length;
    const expiredLicenses = members.filter(m => m.licenseStatus === "Expiré").length;

    // Paiements
    const totalRevenue = payments.reduce((sum, p) => sum + p.amount, 0);
    const paidRevenue = payments.filter(p => p.status === "Payé").reduce((sum, p) => sum + p.amount, 0);
    const pendingRevenue = payments.filter(p => p.status === "En attente").reduce((sum, p) => sum + p.amount, 0);
    const lateRevenue = payments.filter(p => p.status === "En retard").reduce((sum, p) => sum + p.amount, 0);

    // Paiements ce mois
    const thisMonth = payments.filter(p => {
      const paymentDate = new Date(p.date);
      const now = new Date();
      return paymentDate.getMonth() === now.getMonth() && paymentDate.getFullYear() === now.getFullYear();
    });
    const thisMonthRevenue = thisMonth.filter(p => p.status === "Payé").reduce((sum, p) => sum + p.amount, 0);

    // Présences
    const today = new Date().toISOString().split("T")[0];
    const todayAttendance = attendance.filter(a => a.date === today && a.present).length;
    
    const thisWeek = attendance.filter(a => {
      const attendanceDate = new Date(a.date);
      const weekStart = new Date();
      weekStart.setDate(weekStart.getDate() - weekStart.getDay() + 1);
      weekStart.setHours(0, 0, 0, 0);
      const weekEnd = new Date(weekStart);
      weekEnd.setDate(weekEnd.getDate() + 6);
      return a.present && attendanceDate >= weekStart && attendanceDate <= weekEnd;
    }).length;

    // Disciplines
    const boxeCount = members.filter(m => m.discipline.includes("Boxe")).length;
    const kungFuCount = members.filter(m => m.discipline.includes("Kung Fu")).length;

    // Taux de présence moyen
    const uniqueDates = [...new Set(attendance.map(a => a.date))];
    const avgAttendance = uniqueDates.length > 0
      ? Math.round((attendance.filter(a => a.present).length / uniqueDates.length) * 10) / 10
      : 0;

    return {
      totalMembers,
      activeMembers,
      inactiveMembers,
      activeLicenses,
      pendingLicenses,
      expiredLicenses,
      totalRevenue,
      paidRevenue,
      pendingRevenue,
      lateRevenue,
      thisMonthRevenue,
      todayAttendance,
      thisWeek,
      boxeCount,
      kungFuCount,
      avgAttendance,
    };
  }, [members, payments, attendance]);

  // Données pour le graphique des disciplines
  const disciplineData = [
    { name: "Boxe", value: stats.boxeCount, color: "#3b82f6" },
    { name: "Kung Fu", value: stats.kungFuCount, color: "#8b5cf6" },
  ];

  // Données pour l'évolution des revenus (derniers 6 mois simulés)
  const revenueData = [
    { month: "Oct", montant: 45000 },
    { month: "Nov", montant: 52000 },
    { month: "Déc", montant: 48000 },
    { month: "Jan", montant: 65000 },
    { month: "Fév", montant: 71000 },
    { month: "Mar", montant: stats.thisMonthRevenue },
  ];

  // Données pour les présences de la semaine
  const weekDays = ["Lun", "Mer", "Ven"];
  const attendanceWeekData = weekDays.map((day, index) => {
    const date = new Date();
    date.setDate(date.getDate() - (date.getDay() === 0 ? 6 : date.getDay() - 1) + index * 2);
    const dateStr = date.toISOString().split("T")[0];
    const count = attendance.filter(a => a.date === dateStr && a.present).length;
    return { jour: day, présents: count };
  });

  // Dernières annonces
  const recentAnnouncements = [...announcements]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 3);

  // Alertes
  const alerts = [];
  if (stats.pendingLicenses > 0) {
    alerts.push({
      type: "warning",
      message: `${stats.pendingLicenses} licence(s) en attente de validation`,
      link: "/licenses"
    });
  }
  if (stats.lateRevenue > 0) {
    alerts.push({
      type: "error",
      message: `${stats.lateRevenue.toLocaleString()} FCFA de paiements en retard`,
      link: "/payments"
    });
  }
  if (stats.expiredLicenses > 0) {
    alerts.push({
      type: "error",
      message: `${stats.expiredLicenses} licence(s) expirée(s)`,
      link: "/licenses"
    });
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-[#1e293b]">Tableau de Bord</h1>
        <p className="text-gray-600 mt-1">
          Vue d'ensemble de votre salle Fight Club - {new Date().toLocaleDateString("fr-FR", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </p>
      </div>

      {/* Alertes */}
      {alerts.length > 0 && (
        <div className="space-y-2">
          {alerts.map((alert, index) => (
            <Card
              key={index}
              className={
                alert.type === "error"
                  ? "bg-red-50 border-red-200"
                  : "bg-yellow-50 border-yellow-200"
              }
            >
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {alert.type === "error" ? (
                      <XCircle className="h-5 w-5 text-red-600" />
                    ) : (
                      <AlertCircle className="h-5 w-5 text-yellow-600" />
                    )}
                    <span className={alert.type === "error" ? "text-red-900" : "text-yellow-900"}>
                      {alert.message}
                    </span>
                  </div>
                  <Link to={alert.link}>
                    <Button variant="outline" size="sm">
                      Voir
                      <ArrowRight className="h-3 w-3 ml-1" />
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Statistiques principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-white border-gray-200">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Total Membres
            </CardTitle>
            <Users className="h-5 w-5 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-[#1e293b]">{stats.totalMembers}</div>
            <p className="text-xs text-gray-500 mt-1">
              <span className="text-green-600 font-medium">{stats.activeMembers} actifs</span> • {stats.inactiveMembers} inactifs
            </p>
          </CardContent>
        </Card>

        <Card className="bg-white border-gray-200">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Revenus Total
            </CardTitle>
            <DollarSign className="h-5 w-5 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-[#1e293b]">
              {stats.paidRevenue.toLocaleString()}
            </div>
            <p className="text-xs text-gray-500 mt-1">
              FCFA encaissés • {stats.pendingRevenue.toLocaleString()} en attente
            </p>
          </CardContent>
        </Card>

        <Card className="bg-white border-gray-200">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Présences Semaine
            </CardTitle>
            <Calendar className="h-5 w-5 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-[#1e293b]">{stats.thisWeek}</div>
            <p className="text-xs text-gray-500 mt-1">
              Moyenne: {stats.avgAttendance} par session
            </p>
          </CardContent>
        </Card>

        <Card className="bg-white border-gray-200">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Licences Actives
            </CardTitle>
            <ShieldCheck className="h-5 w-5 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-[#1e293b]">{stats.activeLicenses}</div>
            <p className="text-xs text-gray-500 mt-1">
              {stats.pendingLicenses} en attente • {stats.expiredLicenses} expirées
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Graphiques */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Évolution des revenus */}
        <Card className="bg-white border-gray-200">
          <CardHeader>
            <CardTitle>Évolution des Revenus (6 mois)</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="month" stroke="#6b7280" />
                <YAxis stroke="#6b7280" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#fff",
                    border: "1px solid #e5e7eb",
                    borderRadius: "8px",
                  }}
                  formatter={(value: number) => [`${value.toLocaleString()} FCFA`, "Montant"]}
                />
                <Line 
                  type="monotone" 
                  dataKey="montant" 
                  stroke="#10b981" 
                  strokeWidth={2}
                  dot={{ fill: "#10b981", r: 4 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Présences de la semaine */}
        <Card className="bg-white border-gray-200">
          <CardHeader>
            <CardTitle>Présences Cette Semaine</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={attendanceWeekData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="jour" stroke="#6b7280" />
                <YAxis stroke="#6b7280" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#fff",
                    border: "1px solid #e5e7eb",
                    borderRadius: "8px",
                  }}
                />
                <Bar dataKey="présents" fill="#3b82f6" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Répartition par discipline */}
        <Card className="bg-white border-gray-200">
          <CardHeader>
            <CardTitle>Répartition des Disciplines</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={disciplineData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value, percent }) => 
                    `${name}: ${value} (${(percent * 100).toFixed(0)}%)`
                  }
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {disciplineData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Dernières annonces */}
        <Card className="bg-white border-gray-200">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Dernières Annonces</CardTitle>
              <Link to="/announcements">
                <Button variant="ghost" size="sm">
                  Voir tout
                  <ArrowRight className="h-3 w-3 ml-1" />
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentAnnouncements.length === 0 ? (
                <p className="text-sm text-gray-500 text-center py-8">
                  Aucune annonce récente
                </p>
              ) : (
                recentAnnouncements.map((announcement) => (
                  <div key={announcement.id} className="flex items-start gap-3 pb-3 border-b last:border-0">
                    <Bell className="h-4 w-4 text-blue-600 mt-1" />
                    <div className="flex-1">
                      <p className="font-medium text-sm text-[#1e293b]">{announcement.title}</p>
                      <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                        {announcement.content}
                      </p>
                      <div className="flex items-center gap-2 mt-2">
                        <Badge
                          variant="outline"
                          className={
                            announcement.type === "urgent"
                              ? "border-red-300 text-red-700"
                              : announcement.type === "warning"
                              ? "border-yellow-300 text-yellow-700"
                              : announcement.type === "success"
                              ? "border-green-300 text-green-700"
                              : "border-blue-300 text-blue-700"
                          }
                        >
                          {announcement.type}
                        </Badge>
                        <span className="text-xs text-gray-400">
                          {new Date(announcement.date).toLocaleDateString("fr-FR")}
                        </span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Accès rapides */}
      <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
        <CardHeader>
          <CardTitle>Accès Rapides</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <Link to="/members">
              <Button variant="outline" className="w-full justify-start">
                <Users className="h-4 w-4 mr-2" />
                Membres
              </Button>
            </Link>
            <Link to="/payments">
              <Button variant="outline" className="w-full justify-start">
                <DollarSign className="h-4 w-4 mr-2" />
                Paiements
              </Button>
            </Link>
            <Link to="/attendance">
              <Button variant="outline" className="w-full justify-start">
                <Calendar className="h-4 w-4 mr-2" />
                Présences
              </Button>
            </Link>
            <Link to="/licenses">
              <Button variant="outline" className="w-full justify-start">
                <ShieldCheck className="h-4 w-4 mr-2" />
                Licences
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
