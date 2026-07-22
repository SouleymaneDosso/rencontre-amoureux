import { useState } from "react";
import { socket } from "../../socket";
import useAudioCall from "../hooks/useAudioCall";
import CallModal from "../../pages/tchat/CallModal";

export default function CallManager() {
  const [activeCall, setActiveCall] = useState(null);

  // Pour l'instant, on ne démarre pas encore le hook.
  // On va le connecter à l'étape suivante.

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

