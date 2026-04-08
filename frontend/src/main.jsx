import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

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


createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Router>
      <Header />

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
        <Route path="*" element={<h1>Page non trouvée</h1>} />
        <Route path="/conversations" element={<Conversations />} />
      </Routes>

      <FooterNav />
    </Router>
  </StrictMode>
);