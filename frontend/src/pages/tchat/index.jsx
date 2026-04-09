import { useParams, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { useState, useRef, useEffect } from "react";
import {
  FaArrowLeft,
  FaPaperPlane,
  FaUserCircle,
  FaExclamationTriangle,
  FaCircle,
  FaImage,
  FaTimes,
} from "react-icons/fa";
import { socket } from "../../socket";

const Wrapper = styled.div`
  height: 100dvh;
  display: flex;
  flex-direction: column;
  background: linear-gradient(180deg, #fff0f6 0%, #f8f9ff 45%, #eef2ff 100%);
  overflow: hidden;
`;

const Header = styled.div`
  padding: 14px 16px;
  background: rgba(255, 255, 255, 0.92);
  backdrop-filter: blur(14px);
  border-bottom: 1px solid rgba(229, 231, 235, 0.8);
  display: flex;
  align-items: center;
  gap: 12px;
  box-shadow: 0 8px 24px rgba(31, 42, 68, 0.06);
  position: sticky;
  top: 0;
  z-index: 20;

  @media (max-width: 480px) {
    padding: 12px 14px;
  }
`;

const BackButton = styled.button`
  background: linear-gradient(135deg, #eef2ff, #f3e8ff);
  border: none;
  width: 42px;
  height: 42px;
  border-radius: 50%;
  color: #4f46e5;
  cursor: pointer;
  font-size: 16px;
  transition: 0.2s ease;
  flex-shrink: 0;

  &:hover {
    transform: scale(1.05);
  }
`;

const AvatarBox = styled.div`
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: linear-gradient(135deg, #ff4d8d, #7c3aed);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  box-shadow: 0 10px 24px rgba(255, 77, 141, 0.2);
  flex-shrink: 0;

  @media (max-width: 480px) {
    width: 44px;
    height: 44px;
  }
`;

const HeaderInfo = styled.div`
  display: flex;
  flex-direction: column;
  min-width: 0;
`;

const HeaderTitle = styled.h2`
  margin: 0;
  font-size: 18px;
  color: #111827;
  font-weight: 700;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;

  @media (max-width: 480px) {
    font-size: 16px;
  }
`;

const HeaderSubtitle = styled.div`
  margin-top: 4px;
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  color: #6b7280;
`;

const MessagesContainer = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 18px 14px 20px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  scroll-behavior: smooth;

  &::-webkit-scrollbar {
    width: 5px;
  }

  &::-webkit-scrollbar-thumb {
    background: rgba(156, 163, 175, 0.4);
    border-radius: 999px;
  }

  @media (max-width: 480px) {
    padding: 14px 10px 18px;
    gap: 10px;
  }
`;

const MessageRow = styled.div`
  display: flex;
  justify-content: ${(props) => (props.$mine ? "flex-end" : "flex-start")};
`;

const MessageBubble = styled.div`
  max-width: min(78%, 360px);
  padding: 12px 14px;
  border-radius: 22px;
  font-size: 14px;
  line-height: 1.5;
  word-break: break-word;
  box-shadow: 0 10px 26px rgba(31, 42, 68, 0.08);
  position: relative;

  background: ${(props) =>
    props.$mine
      ? "linear-gradient(135deg, #ff4d8d, #ff6ca7 55%, #ff8cc0)"
      : "rgba(255, 255, 255, 0.95)"};

  color: ${(props) => (props.$mine ? "white" : "#111827")};

  border-bottom-right-radius: ${(props) => (props.$mine ? "8px" : "22px")};
  border-bottom-left-radius: ${(props) => (props.$mine ? "22px" : "8px")};

  @media (max-width: 480px) {
    max-width: 85%;
    font-size: 13.5px;
    padding: 11px 13px;
  }
`;

const MessageImage = styled.img`
  width: 100%;
  max-width: 260px;
  border-radius: 16px;
  margin-bottom: 8px;
  object-fit: cover;
  display: block;

  @media (max-width: 480px) {
    max-width: 220px;
  }
`;

const MessageText = styled.p`
  margin: 0;
  white-space: pre-wrap;
`;

const MessageTime = styled.span`
  display: block;
  font-size: 11px;
  margin-top: 7px;
  opacity: 0.75;
  text-align: right;
`;

const PreviewBox = styled.div`
  padding: 10px 14px 0;
`;

const PreviewImageWrapper = styled.div`
  position: relative;
  width: fit-content;
  background: white;
  padding: 8px;
  border-radius: 20px;
  box-shadow: 0 10px 24px rgba(31, 42, 68, 0.08);
`;

const PreviewImage = styled.img`
  max-width: 140px;
  border-radius: 14px;
  display: block;

  @media (max-width: 480px) {
    max-width: 110px;
  }
`;

const RemovePreview = styled.button`
  position: absolute;
  top: -8px;
  right: -8px;
  width: 28px;
  height: 28px;
  border: none;
  border-radius: 50%;
  background: #ef4444;
  color: white;
  cursor: pointer;
  box-shadow: 0 6px 16px rgba(239, 68, 68, 0.28);
`;

const BottomArea = styled.div`
  background: rgba(255, 255, 255, 0.92);
  backdrop-filter: blur(16px);
  border-top: 1px solid rgba(229, 231, 235, 0.8);
  padding: 10px 12px calc(10px + env(safe-area-inset-bottom));
  position: sticky;
  bottom: 0;
  z-index: 15;
`;

const InputContainer = styled.div`
  display: flex;
  gap: 10px;
  align-items: center;
`;

const FileInput = styled.input`
  display: none;
`;

const IconButton = styled.label`
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background: linear-gradient(135deg, #eef2ff, #f5f3ff);
  color: #4f46e5;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  cursor: pointer;
  transition: 0.2s ease;
  flex-shrink: 0;

  &:hover {
    transform: translateY(-2px);
  }

  @media (max-width: 480px) {
    width: 46px;
    height: 46px;
    font-size: 16px;
  }
`;

const Input = styled.input`
  flex: 1;
  padding: 14px 18px;
  border-radius: 999px;
  border: 1px solid #e5e7eb;
  outline: none;
  font-size: 14px;
  background: #f9fafb;
  transition: 0.2s ease;
  min-width: 0;

  &:focus {
    border-color: #4f46e5;
    background: white;
    box-shadow: 0 0 0 4px rgba(79, 70, 229, 0.08);
  }

  @media (max-width: 480px) {
    padding: 13px 16px;
    font-size: 14px;
  }
`;

const SendButton = styled.button`
  width: 52px;
  height: 52px;
  border-radius: 50%;
  border: none;
  background: linear-gradient(135deg, #4f46e5, #7c3aed);
  color: white;
  font-size: 18px;
  cursor: pointer;
  box-shadow: 0 12px 28px rgba(79, 70, 229, 0.24);
  transition: 0.2s ease;
  flex-shrink: 0;

  &:hover {
    transform: translateY(-2px) scale(1.02);
  }

  &:disabled {
    opacity: 0.55;
    cursor: not-allowed;
    transform: none;
  }

  @media (max-width: 480px) {
    width: 48px;
    height: 48px;
    font-size: 16px;
  }
`;

const Loading = styled.h3`
  text-align: center;
  margin-top: 60px;
  color: #374151;
`;

const ErrorBox = styled.div`
  margin: 40px auto;
  max-width: 500px;
  background: #fff5f5;
  color: #b91c1c;
  border: 1px solid #fecaca;
  padding: 18px;
  border-radius: 18px;
  text-align: center;
`;

const EmptyState = styled.div`
  margin: auto;
  text-align: center;
  color: #6b7280;
  padding: 30px;

  h3 {
    margin-bottom: 8px;
    color: #111827;
  }

  p {
    margin: 0;
  }
`;

function Tchat() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [monProfilId, setMonProfilId] = useState(null);
  const [profilCible, setProfilCible] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [messageErreur, setMessageErreur] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");

  const messagesEndRef = useRef(null);
  const token = localStorage.getItem("token");

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  useEffect(() => {
    socket.connect();

    const handleConnect = () => {
      console.log("✅ Socket connecté");
    };

    const handleDisconnect = () => {
      console.log("❌ Socket déconnecté");
    };

    const handleConnectError = (err) => {
      console.error("💥 Erreur connexion socket :", err.message);
    };

    const handleReceiveMessage = (messageData) => {
      console.log("📩 Nouveau message reçu :", messageData);

      setMessages((prev) => {
        const existeDeja = prev.some((msg) => msg._id === messageData._id);
        if (existeDeja) return prev;
        return [...prev, messageData];
      });
    };

    socket.on("connect", handleConnect);
    socket.on("disconnect", handleDisconnect);
    socket.on("connect_error", handleConnectError);
    socket.on("receiveMessage", handleReceiveMessage);

    return () => {
      socket.off("connect", handleConnect);
      socket.off("disconnect", handleDisconnect);
      socket.off("connect_error", handleConnectError);
      socket.off("receiveMessage", handleReceiveMessage);
    };
  }, []);

  useEffect(() => {
    if (!monProfilId) return;

    const registerIfConnected = () => {
      console.log("👤 Enregistrement utilisateur socket :", monProfilId);
      socket.emit("registerUser", monProfilId);
    };

    if (socket.connected) {
      registerIfConnected();
    } else {
      socket.on("connect", registerIfConnected);
    }

    return () => {
      socket.off("connect", registerIfConnected);
    };
  }, [monProfilId]);

  useEffect(() => {
    const chargerTchat = async () => {
      try {
        setLoading(true);
        setMessageErreur("");

        const monProfilRes = await fetch(
          `${import.meta.env.VITE_API_URL}/api/mesInfos/me`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        const monProfilData = await monProfilRes.json();

        if (!monProfilRes.ok) {
          throw new Error(
            monProfilData.message || "Impossible de récupérer ton profil"
          );
        }

        setMonProfilId(monProfilData._id);

        const profilRes = await fetch(
          `${import.meta.env.VITE_API_URL}/api/mesInfos/${id}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        const profilData = await profilRes.json();

        if (!profilRes.ok) {
          throw new Error(
            profilData.message || "Impossible de récupérer le profil"
          );
        }

        setProfilCible(profilData);

        const messagesRes = await fetch(
          `${import.meta.env.VITE_API_URL}/api/tchat/messages/${id}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        const messagesData = await messagesRes.json();

        if (!messagesRes.ok) {
          throw new Error(
            messagesData.message || "Impossible de récupérer les messages"
          );
        }

        setMessages(messagesData);
      } catch (error) {
        setMessageErreur(error.message);
      } finally {
        setLoading(false);
      }
    };

    if (token && id) {
      chargerTchat();
    }
  }, [id, token]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const removeSelectedFile = () => {
    setSelectedFile(null);
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl("");
  };

  const sendMessage = async () => {
    if (!newMessage.trim() && !selectedFile) return;

    try {
      setSending(true);

      const formData = new FormData();
      formData.append("contenu", newMessage);

      if (selectedFile) {
        formData.append("media", selectedFile);
      }

      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/tchat/envoyer/${id}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Erreur lors de l’envoi du message");
      }

      setMessages((prev) => [...prev, data.nouveauMessage]);
      socket.emit("sendMessage", data.nouveauMessage);

      setNewMessage("");
      setSelectedFile(null);
      if (previewUrl) URL.revokeObjectURL(previewUrl);
      setPreviewUrl("");
    } catch (error) {
      setMessageErreur(error.message);
    } finally {
      setSending(false);
    }
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, previewUrl]);

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  if (loading) {
    return <Loading>Chargement du tchat...</Loading>;
  }

  if (messageErreur) {
    return (
      <Wrapper>
        <ErrorBox>
          <FaExclamationTriangle size={22} style={{ marginBottom: "10px" }} />
          <p>{messageErreur}</p>
        </ErrorBox>
      </Wrapper>
    );
  }

  return (
    <Wrapper>
      <Header>
        <BackButton onClick={() => navigate(-1)}>
          <FaArrowLeft />
        </BackButton>

        <AvatarBox>
          <FaUserCircle size={28} />
        </AvatarBox>

        <HeaderInfo>
          <HeaderTitle>{profilCible?.pseudo || "Discussion"}</HeaderTitle>
          <HeaderSubtitle>
            <FaCircle
              size={9}
              color={profilCible?.enLigne ? "#22c55e" : "#9ca3af"}
            />
            {profilCible?.enLigne ? "En ligne" : "Hors ligne"}
          </HeaderSubtitle>
        </HeaderInfo>
      </Header>

      <MessagesContainer>
        {messages.length === 0 ? (
          <EmptyState>
            <h3>Aucun message pour le moment</h3>
            <p>Commence une belle conversation ✨</p>
          </EmptyState>
        ) : (
          messages.map((msg) => {
            const isMine = msg.expediteur === monProfilId;

            return (
              <MessageRow key={msg._id} $mine={isMine}>
                <MessageBubble $mine={isMine}>
                  {msg.type === "image" && msg.media?.url && (
                    <MessageImage src={msg.media.url} alt="message" />
                  )}

                  {msg.contenu && <MessageText>{msg.contenu}</MessageText>}

                  <MessageTime>
                    {msg.createdAt ? formatTime(msg.createdAt) : ""}
                  </MessageTime>
                </MessageBubble>
              </MessageRow>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </MessagesContainer>

      <BottomArea>
        {previewUrl && (
          <PreviewBox>
            <PreviewImageWrapper>
              <PreviewImage src={previewUrl} alt="preview" />
              <RemovePreview onClick={removeSelectedFile}>
                <FaTimes />
              </RemovePreview>
            </PreviewImageWrapper>
          </PreviewBox>
        )}

        <InputContainer>
          <IconButton htmlFor="file-upload">
            <FaImage />
          </IconButton>

          <FileInput
            id="file-upload"
            type="file"
            accept="image/*"
            onChange={handleFileChange}
          />

          <Input
            placeholder="Écrire un message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          />

          <SendButton onClick={sendMessage} disabled={sending}>
            <FaPaperPlane />
          </SendButton>
        </InputContainer>
      </BottomArea>
    </Wrapper>
  );
}

export default Tchat;