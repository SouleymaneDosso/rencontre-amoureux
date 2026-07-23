import { useState, useRef, useEffect } from "react";
import { creerMessageAppel } from "../../services/tchatApi";

export default function useAudioCall({
  socket,
  id,
  token,
  messages,
  profilCible,
  monProfilId,
  conversationId,
}) {
  const [activeCallProfile, setActiveCallProfile] = useState(null);
  const monProfil = JSON.parse(localStorage.getItem("monProfil"));

  const [calling, setCalling] = useState(false);
  const [incomingCall, setIncomingCall] = useState(null);
  const [offer, setOffer] = useState(null);
  const [inCall, setInCall] = useState(false);
  const [callDuration, setCallDuration] = useState(0);
  const [isMinimized, setIsMinimized] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const ringtoneRef = useRef(
    new Audio("/sounds/poorartistt-k-pop-ringtone-no-copyright-357140.mp3"),
  );
  const callingToneRef = useRef(
    new Audio("/sounds/poorartistt-k-pop-ringtone-no-copyright-357142.mp3"),
  );

  const timerRef = useRef(null);
  const startedAtRef = useRef(null);
  const localStreamRef = useRef(null);
  const peerConnectionRef = useRef(null);
  const remoteAudioRef = useRef(null);
  const peerUserIdRef = useRef(null);

  const minimizeCall = () => {
    setIsMinimized(true);
  };

  const maximizeCall = () => {
    setIsMinimized(false);
  };

  const toggleMute = () => {
    if (!localStreamRef.current) return;

    const audioTrack = localStreamRef.current.getAudioTracks()[0];

    audioTrack.enabled = !audioTrack.enabled;

    setIsMuted(!audioTrack.enabled);
  };

  useEffect(() => {
    ringtoneRef.current.loop = true;
    callingToneRef.current.loop = true;
  }, []);

  const stopSounds = () => {
    ringtoneRef.current.pause();
    ringtoneRef.current.currentTime = 0;

    callingToneRef.current.pause();
    callingToneRef.current.currentTime = 0;

    if (navigator.vibrate) {
      navigator.vibrate(0);
    }
  };

  // durée d'appelle

  const startTimer = () => {
    startedAtRef.current = Date.now();

    timerRef.current = setInterval(() => {
      setCallDuration(Math.floor((Date.now() - startedAtRef.current) / 1000));
    }, 1000);
  };

  const stopTimer = () => {
    clearInterval(timerRef.current);
    timerRef.current = null;
    startedAtRef.current = null;
    setCallDuration(0);
  };

  // fin durée d'appelle

  const createAnswer = async () => {
    const answer = await peerConnectionRef.current.createAnswer();

    await peerConnectionRef.current.setLocalDescription(answer);

    socket.emit("answer", {
      to: incomingCall.from.id,
      answer,
    });
  };

  const createPeerConnection = () => {
    peerConnectionRef.current = new RTCPeerConnection({
      iceServers: [
        {
          urls: "stun:stun.l.google.com:19302",
        },
      ],
    });
    peerConnectionRef.current.onconnectionstatechange = () => {
      console.log(
        "État connexion :",
        peerConnectionRef.current.connectionState,
      );
    };

    peerConnectionRef.current.oniceconnectionstatechange = () => {
      console.log("ICE :", peerConnectionRef.current.iceConnectionState);
    };

    peerConnectionRef.current.ontrack = (event) => {
      console.log("Flux distant reçu :", event.streams[0]);
      remoteAudioRef.current.srcObject = event.streams[0];
    };

    peerConnectionRef.current.onicecandidate = (event) => {
      if (!event.candidate) return;

      socket.emit("iceCandidate", {
        to: peerUserIdRef.current,
        candidate: event.candidate,
      });
    };
  };

  const createOffer = async () => {
    const offer = await peerConnectionRef.current.createOffer();
    await peerConnectionRef.current.setLocalDescription(offer);

    socket.emit("offer", {
      to: id,
      offer,
    });
  };

  const cleanupCall = () => {
    stopTimer();
    localStreamRef.current?.getTracks().forEach((track) => track.stop());

    peerConnectionRef.current?.close();

    localStreamRef.current = null;
    peerConnectionRef.current = null;

    if (remoteAudioRef.current) {
      remoteAudioRef.current.srcObject = null;
    }

    setCalling(false);
    setIncomingCall(null);
    setInCall(false);
  };

  const endCall = async () => {
     console.log("📞 END CALL DATA", {
    incomingCall,
    id,
    conversationId,
  });
  const targetId = incomingCall?.from?.id || id;
  const targetConversationId =
    incomingCall?.conversationId || conversationId;

  console.log("📞 END CALL", {
    targetId,
    targetConversationId,
    incomingCall,
    id,
    conversationId,
  });

  stopSounds();

  socket.emit("endCall", {
    to: targetId,
    from: monProfilId,
  });

  try {
    const message = await creerMessageAppel(token, {
      conversationId: targetConversationId,
      destinataire: targetId,
      status: "ended",
    });

    socket.emit("sendMessage", message);
  } catch (error) {
    console.error("❌ Erreur création message appel terminé :", error);
  }

  cleanupCall();
};
  useEffect(() => {
    const handleEndCall = () => {
      stopSounds();
      cleanupCall();
    };

    socket.on("callEnded", handleEndCall);

    return () => {
      socket.off("callEnded", handleEndCall);
    };
  }, []);

  useEffect(() => {
    const handleIceCandidate = async ({ candidate }) => {
      if (!peerConnectionRef.current) return;

      await peerConnectionRef.current.addIceCandidate(
        new RTCIceCandidate(candidate),
      );
    };

    socket.on("iceCandidate", handleIceCandidate);

    return () => {
      socket.off("iceCandidate", handleIceCandidate);
    };
  }, []);

  useEffect(() => {
    const handleAnswer = async ({ answer }) => {
      stopSounds();
      await peerConnectionRef.current.setRemoteDescription(
        new RTCSessionDescription(answer),
      );
      setCalling(false);
      setInCall(true);
      startTimer();
    };

    socket.on("answer", handleAnswer);

    return () => {
      socket.off("answer", handleAnswer);
    };
  }, []);

  useEffect(() => {
    const handleOffer = ({ offer }) => {
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
    };
    socket.on("callAccepted", accepeterappel);

    return () => {
      socket.off("callAccepted", accepeterappel);
    };
  }, []);

  useEffect(() => {
    const handleIncomingCall = ({ from, conversationId }) => {
      console.log("📞 Appel entrant reçu :", from);

      ringtoneRef.current.currentTime = 0;
      ringtoneRef.current.play();

      if (navigator.vibrate) {
        navigator.vibrate([500, 300, 500]);
      }

      const callerProfile = {
        _id: from.id,
        pseudo: from.pseudo,
        avatar: {
          url: from.avatar,
        },
      };

      setActiveCallProfile(callerProfile);

      setIncomingCall({
        from,
        conversationId,
      });
    };

    socket.on("incomingCall", handleIncomingCall);

    return () => {
      socket.off("incomingCall", handleIncomingCall);
    };
  }, []);

  useEffect(() => {
    const handleRejected = () => {
      stopSounds();
      cleanupCall();
      setCalling(false);
    };

    socket.on("callRejected", handleRejected);

    return () => {
      socket.off("callRejected", handleRejected);
    };
  }, []);

  useEffect(() => {
    const handleCancel = () => {
      stopSounds();
      cleanupCall();
      setIncomingCall(null);
    };

    socket.on("callCancelled", handleCancel);

    return () => {
      socket.off("callCancelled", handleCancel);
    };
  }, []);

  const acceptCall = async () => {
    stopSounds();
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
      });

      localStreamRef.current = stream;
      createPeerConnection();

      stream.getTracks().forEach((track) => {
        peerConnectionRef.current.addTrack(track, stream);
      });
      peerUserIdRef.current = incomingCall.from.id;

      await peerConnectionRef.current.setRemoteDescription(
        new RTCSessionDescription(offer),
      );
      await createAnswer();
      socket.emit("acceptCall", {
        to: incomingCall.from.id,
        from: monProfilId,
      });

      setIncomingCall(null);
      setInCall(true);
      startTimer();
    } catch (error) {
      console.error(error);
    }
  };

  const startCall = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({
      audio: true,
    });

    localStreamRef.current = stream;

    setActiveCallProfile({
      _id: profilCible?._id,
      pseudo: profilCible?.pseudo,
      avatar: profilCible?.avatar,
    });

    createPeerConnection();

    stream.getTracks().forEach((track) => {
      peerConnectionRef.current.addTrack(track, stream);
    });

    peerUserIdRef.current = id;

    await createOffer();

    setCalling(true);

    callingToneRef.current.currentTime = 0;
    callingToneRef.current.play();

    socket.emit("callUser", {
      to: id,
      conversationId,
      from: {
        id: monProfilId,
        pseudo: monProfil?.pseudo,
        avatar: monProfil?.avatar?.url,
      },
    });
  };

  const cancelCall = async () => {
    stopSounds();
    setCalling(false);

    try {
      const message = await creerMessageAppel(token, {
        conversationId: conversationId,
        destinataire: id,
        status: "cancelled",
      });

      socket.emit("sendMessage", message);

      socket.emit("cancelCall", {
        to: id,
        from: monProfilId,
      });
      cleanupCall();
    } catch (error) {
      console.error(error);
    }
  };

  const rejectCall = async () => {
    stopSounds();
    if (!incomingCall) return;
    try {
      const message = await creerMessageAppel(token, {
       conversationId: incomingCall.conversationId,
        destinataire: incomingCall.from.id,
        status: "rejected",
      });

      socket.emit("sendMessage", message);

      socket.emit("rejectCall", {
        to: incomingCall.from.id,
        from: monProfilId,
      });
      cleanupCall();
    } catch (error) {
      console.error(error);
    }
  };

  return {
    calling,
    inCall,
    endCall,
    incomingCall,
    activeCallProfile,
    acceptCall,
    rejectCall,
    cancelCall,
    startCall,
    remoteAudioRef,
    callDuration,
    isMinimized,
    minimizeCall,
    maximizeCall,
    isMuted,
    toggleMute,
  };
}
