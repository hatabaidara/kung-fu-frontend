import React from "react";
import { Link } from "react-router";
import { Button } from "../components/ui/button";
import { AlertCircle } from "lucide-react";

export function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f5f5f7]">
      <div className="text-center">
        <AlertCircle className="h-16 w-16 mx-auto mb-4 text-gray-400" />
        <h1 className="text-4xl font-bold text-[#1e293b] mb-2">404</h1>
        <p className="text-gray-600 mb-6">Page non trouvée</p>
        <Link to="/">
          <Button className="bg-[#3b82f6] hover:bg-[#2563eb]">
            Retour au tableau de bord
          </Button>
        </Link>
      </div>
    </div>
  );
}
