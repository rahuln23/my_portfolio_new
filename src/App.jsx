import { useEffect, useState } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";

import { listenAuthState } from "./firebase/auth";
import CursorTrail from "./components/CursorTrail";
import Portfolio from "./pages/Portfolio";
import Login from "./pages/Login";
import Admin from "./pages/Admin";
import ProtectedRoute from "./pages/ProtectedRoute";

import "./styles/fonts.css";
import "./styles/variables.css";
import "./styles/global.css";

export default function App() {
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = listenAuthState((currentUser) => {
      setUser(currentUser);
      setAuthLoading(false);
    });

    return unsubscribe;
  }, []);

  if (authLoading) {
    return (
      <div
        style={{
          minHeight: "100vh",
          background: "#000",
          color: "white",
          display: "grid",
          placeItems: "center",
          fontSize: 11,
        }}
      >
        INITIALIZING...
      </div>
    );
  }

  return (
    <BrowserRouter>
    <CursorTrail />
      <Routes>
        <Route
          path="/"
          element={<Portfolio />}
        />

        <Route
          path="/admin/login"
          element={<Login />}
        />

        <Route
          path="/admin"
          element={
            <ProtectedRoute user={user}>
              <Admin user={user} />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}