
import { useState } from "react";
import { useLocation } from "react-router-dom";

import { socket } from "../../socket";
import useAudioCall from "../hooks/useAudioCall";
import CallModal from "../../pages/tchat/CallModal";

export default function CallManager() {
  const location = useLocation();

  const [activeCall, setActiveCall] = useState(null);

  // On récupère l'ID depuis l'URL
  const currentUserId = location.pathname.startsWith("/tchat/")
    ? location.pathname.split("/tchat/")[1]
    : null;

  console.log("Utilisateur de la conversation :", currentUserId);

  return (
    <>
      <CallModal
        open={false}
        incoming={false}
        calling={false}
        inCall={false}
        profilCible={null}
        onAccept={() => {}}
        onReject={() => {}}
        onCancel={() => {}}
        callDuration={0}
        isMinimized={false}
        minimizeCall={() => {}}
        maximizeCall={() => {}}
        isMuted={false}
        toggleMute={() => {}}
      />
    </>
  );
}

