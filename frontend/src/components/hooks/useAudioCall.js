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
  const [calling, setCalling] = useState(false);
  const [incomingCall, setIncomingCall] = useState(null);
  const [offer, setOffer] = useState(null);
  const localStreamRef = useRef(null);
  const peerConnectionRef = useRef(null);
  const remoteAudioRef = useRef(null);
  const peerUserIdRef = useRef(null);

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
      await peerConnectionRef.current.setRemoteDescription(
        new RTCSessionDescription(answer),
      );
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
      peerUserIdRef.current = id;

      await peerConnectionRef.current.setRemoteDescription(
        new RTCSessionDescription(offer),
      );
      await createAnswer();
      socket.emit("acceptCall", {
        to: incomingCall.from.id,
        from: monProfilId,
      });

      setIncomingCall(null);
    } catch (error) {
      console.error(error);
    }
  };

  const startCall = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({
      audio: true,
    });
    localStreamRef.current = stream;

    createPeerConnection();
    stream.getTracks().forEach((track) => {
      peerConnectionRef.current.addTrack(track, stream);
    });
    peerUserIdRef.current = id;
    await createOffer();
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
    remoteAudioRef,
  };
}
