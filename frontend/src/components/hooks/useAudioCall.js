import { useState,useRef,useEffect} from "react";
import {
  creerMessageAppel,
} from "../../services/tchatApi";

export default function useAudioCall({socket,
    id,
    token,
    messages,
    profilCible,
    monProfilId}) {
const localStreamRef = useRef(null);
 const [calling, setCalling] = useState(false);
  const [incomingCall, setIncomingCall] = useState(null);
  

useEffect(() => {
    const handleIncomingCall = ({ from }) => {
      console.log("📞 Appel entrant de :", from);

      setIncomingCall({
        from,
      });
    };

    socket.on("incomingCall", handleIncomingCall);

    return () => {
      socket.off("incomingCall", handleIncomingCall);
    };
  }, []);

    useEffect(() => {
    const handleRejected = () => {
      setCalling(false);

      alert("L'appel a été refusé.");
    };

    socket.on("callRejected", handleRejected);

    return () => {
      socket.off("callRejected", handleRejected);
    };
  }, []);

  useEffect(() => {
    const handleCancel = () => {
      setIncomingCall(null);
    };

    socket.on("callCancelled", handleCancel);

    return () => {
      socket.off("callCancelled", handleCancel);
    };
  }, []);

  const acceptCall = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
      });

      localStreamRef.current = stream;

      setIncomingCall(null);

      console.log("🎤 Micro autorisé :", stream);
    } catch (error) {
      console.error("Accès au micro refusé :", error);
    }
  };
const startCall = () => {
    setCalling(true);

    socket.emit("callUser", {
      to: id,
      from: {
        id: monProfilId,
        pseudo: profilCible?.pseudo,
        avatar: profilCible?.avatar?.url,
      },
    });
  };

  const cancelCall = async () => {
    setCalling(false);

    try {
      const message = await creerMessageAppel(token, {
        conversationId: messages[0]?.conversationId,
        destinataire: id,
        status: "cancelled",
      });

      socket.emit("sendMessage", message);

      socket.emit("cancelCall", {
        to: id,
        from: monProfilId,
      });
    } catch (error) {
      console.error(error);
    }
  };

  const rejectCall = async () => {
    if (!incomingCall) return;
    try {
      const message = await creerMessageAppel(token, {
        conversationId: messages[0]?.conversationId,
        destinataire: incomingCall.from.id,
        status: "rejected",
      });

      socket.emit("sendMessage", message);

      socket.emit("rejectCall", {
        to: incomingCall.from.id,
        from: monProfilId,
      });

      setIncomingCall(null);
      setCalling(false);
    } catch (error) {
      console.error(error);
    }
  };
  

  return{
calling,
incomingCall,
acceptCall,
rejectCall,
cancelCall,
startCall

  }
}