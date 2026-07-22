import { useCallContext } from "../../context/CallContext";
import { useEffect } from "react";
import { socket } from "../../socket";
import useAudioCall from "../hooks/useAudioCall";
import CallModal from "../../pages/tchat/CallModal";

export default function CallManager() {
  const { callTarget } = useCallContext();

  const monProfil = JSON.parse(localStorage.getItem("monProfil"));

  const monProfilId = monProfil?._id || null;

  const token = localStorage.getItem("token");

  const id = callTarget?.id || null;

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
    profilCible: callTarget?.profilCible || null,
    messages: callTarget?.messages || [],
  });

  useEffect(() => {
  if (!callTarget?.id) return;

  const lancerAppel = async () => {
    try {
      await startCall();
    } catch (error) {
      console.error("Erreur démarrage appel :", error);
    }
  };

  lancerAppel();
}, [callTarget?.id]);

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
        profilCible={callTarget?.profilCible || null}
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