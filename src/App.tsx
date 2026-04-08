import { RouterProvider } from "react-router";
import { AppProvider } from "./context/AppContext";
import { AuthProvider } from "./context/AuthContext";
import { ThemeProvider } from "./context/ThemeContext";
import { Toaster } from "./components/ui/sonner";
import { router } from "./routes";
import ErrorBoundary from "./ErrorBoundary";

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <AppProvider>
          <ErrorBoundary>
            <RouterProvider router={router} />
            <Toaster position="top-right" />
          </ErrorBoundary>
        </AppProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}