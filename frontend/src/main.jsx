import {useState} from "react";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import { useEffect } from "react";
import Profil from "./pages/profil";
import Header from "./comportments/header";
import FooterNav from "./comportments/footer";
import Tchat from "./pages/tchat";
import Connexion from "./pages/connexion";
import Inscription from "./pages/inscription";
import Home from "./comportments/home";
import Modifier from "./pages/modifierprofil";
import Profilpublic from "./pages/profilpublic";
import Decouverte from "./pages/decouverte";
import Matchs from "./pages/match";
import Conversations from "./pages/conversations";
import Video from "./pages/videos";
import { socket } from "./socket";
import Videopublic from "./pages/videospublic";
import { ConversationProvider } from "./context/ConversationContext";

// 🔥 Layout principal
function Layout() {
  const location = useLocation();
 const [monProfilId, setMonProfilId] = useState(null);
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) {
      return;
    }

    console.log("🔌 Connexion socket globale");

    if (!socket.connected) {
      socket.connect();
    }

    return () => {
     
    };
  }, [token]);

  useEffect(() => {
  const chargerMonProfil = async () => {
    if (!token) return;

    try {
      const profilLocal = localStorage.getItem("monProfil");

      if (profilLocal) {
        const profil = JSON.parse(profilLocal);

        setMonProfilId(profil._id);
        return;
      }

      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/mesInfos/me`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message);
      }

      localStorage.setItem("monProfil", JSON.stringify(data));

      setMonProfilId(data._id);
    } catch (error) {
      console.error("Erreur récupération profil :", error.message);
    }
  };

  chargerMonProfil();
}, [token]);

useEffect(() => {
  if (!monProfilId) return;

  const registerUser = () => {
    console.log("👤 Enregistrement socket :", monProfilId);

    socket.emit("registerUser", monProfilId);
  };

  if (socket.connected) {
    registerUser();
  }

  socket.on("connect", registerUser);

  return () => {
    socket.off("connect", registerUser);
  };
}, [monProfilId]);

  // routes où on cache header + footer
  const hideHeader =
    location.pathname.startsWith("/tchat") ||
    location.pathname === "/connexion" ||
    location.pathname === "/inscription" ||
    location.pathname === "/videos" ||
    location.pathname === "/publicdeo";

  const hideFooter =
    location.pathname.startsWith("/tchat") ||
    location.pathname === "/connexion" ||
    location.pathname === "/inscription"||
    location.pathname === "/videos" ||
    location.pathname === "/publicdeo";
 

  return (
    <>
      {!hideHeader && <Header />}
      {!hideFooter && <FooterNav />}

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/:id" element={<Home />} />
        <Route path="/profil" element={<Profil />} />
        <Route path="/tchat/:id" element={<Tchat />} />
        <Route path="/inscription" element={<Inscription />} />
        <Route path="/connexion" element={<Connexion />} />
        <Route path="/modifier/:id" element={<Modifier />} />
        <Route path="/profilpublic/:id" element={<Profilpublic />} />
        <Route path="/decouverte" element={<Decouverte />} />
        <Route path="/matchs" element={<Matchs />} />
        <Route path="/conversations" element={<Conversations />} />
        <Route path="/videos" element={<Video />} />
        <Route path="/publicdeo" element={<Videopublic />} />
        <Route path="*" element={<h1>Page non trouvée</h1>} />
      </Routes>
    </>
  );
}


createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ConversationProvider>
    <Router>
      <Layout />

    </Router>
    </ConversationProvider>
  </StrictMode>,
);
