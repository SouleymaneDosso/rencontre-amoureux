import { useLocation } from "react-router-dom";

import { socket } from "../../socket";
import useAudioCall from "../hooks/useAudioCall";
import CallModal from "../../pages/tchat/CallModal";

export default function CallManager() {
  const location = useLocation();

  // Récupère l'utilisateur de la conversation actuelle
  const id = location.pathname.startsWith("/tchat/")
    ? location.pathname.split("/tchat/")[1]
    : null;

  // Récupère ton profil depuis le localStorage
  const monProfil = JSON.parse(localStorage.getItem("monProfil"));

  const monProfilId = monProfil?._id || null;

  const token = localStorage.getItem("token");

  const {
    calling,
    incomingCall,
    startCall,
    acceptCall,
    rejectCall,
    cancelCall,
    remoteAudioRef,
    inCall,
    endCall,
    callDuration,
    isMinimized,
    minimizeCall,
    maximizeCall,
    isMuted,
    toggleMute,
  } = useAudioCall({
    socket,
    id,
    token,
    monProfilId,
    profilCible: null,
    messages: [],
  });

  return (
    <>
      <audio
        ref={remoteAudioRef}
        autoPlay
        playsInline
      />

      <CallModal
        open={incomingCall || calling || inCall}
        incoming={!!incomingCall}
        calling={calling}
        inCall={inCall}
        profilCible={null}
        onAccept={acceptCall}
        onReject={rejectCall}
        onCancel={inCall ? endCall : cancelCall}
        callDuration={callDuration}
        isMinimized={isMinimized}
        minimizeCall={minimizeCall}
        maximizeCall={maximizeCall}
        isMuted={isMuted}
        toggleMute={toggleMute}
      />
    </>
  );
}

