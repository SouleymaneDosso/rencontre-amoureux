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

// 🔥 Layout principal
function Layout() {
  const location = useLocation();
  useEffect(() => {
    console.log("🔌 Connexion socket globale");
    socket.connect();
  }, []);

  // routes où on cache header + footer
  const shouldHideLayout =
    location.pathname.startsWith("/tchat") ||
    location.pathname === "/connexion" ||
    location.pathname === "/inscription"

  return (
    <>
      {!shouldHideLayout && <Header />}
      {!shouldHideLayout && <FooterNav />}

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

// 🔥 Render app
createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Router>
      <Layout />
    </Router>
  </StrictMode>,
);
