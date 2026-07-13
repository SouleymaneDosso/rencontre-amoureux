import { useState, useRef, useEffect } from "react";
import { creerMessageAppel } from "../../services/tchatApi";

export default function useAudioCall({
  socket,
  id,
  token,
  messages,
  profilCible,
  monProfilId,
}) {
  const localStreamRef = useRef(null);
  const [calling, setCalling] = useState(false);
  const [incomingCall, setIncomingCall] = useState(null);
  const [offer, setOffer] = useState(null);
  const peerConnectionRef = useRef(null);

  const createPeerConnection = () => {
    peerConnectionRef.current = new RTCPeerConnection();
  };

  const createOffer = async () => {
    const offer = await peerConnectionRef.current.createOffer();
    await peerConnectionRef.current.setLocalDescription(offer);

    socket.emit("offer", {
      to: id,
      offer,
    });
  };

  useEffect(() => {
    const handleOffer = ({ offer }) => {
      console.log("Offer reçue :", offer);

      setOffer(offer);
    };

    socket.on("offer", handleOffer);

    return () => {
      socket.off("offer", handleOffer);
    };
  }, []);

  useEffect(() => {
    const accepeterappel = () => {
      setCalling(false);
      createOffer();
    };
    socket.on("callAccepted", accepeterappel);

    return () => {
      socket.off("callAccepted", accepeterappel);
    };
  }, []);

  useEffect(() => {
    const handleIncomingCall = ({ from }) => {
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
      createPeerConnection();

      stream.getTracks().forEach((track) => {
        peerConnectionRef.current.addTrack(track, stream);
      });

      await  peerConnectionRef.current.setRemoteDescription(
        new RTCSessionDescription(offer)
      )

      socket.emit("acceptCall", {
        to: incomingCall.from.id,
        from: monProfilId,
      });

      setIncomingCall(null);
    } catch (error) {
      console.error(error);
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

  return {
    calling,
    incomingCall,
    acceptCall,
    rejectCall,
    cancelCall,
    startCall,
  };
}
