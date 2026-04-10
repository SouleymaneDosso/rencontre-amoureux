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
import {
  FaCheck,
  FaCheckDouble,
} from "react-icons/fa";

import { socket } from "../../socket";

import { useTchatSocket } from "../../hooks/useTchatSocket";
import {
  getMonProfil,
  getProfilCible,
  getMessagesConversation,
  envoyerMessageApi,
  marquerMessagesCommeLusApi,
} from "../../services/tchatApi";


const Wrapper = styled.div`
  height: 100dvh; /* ✅ meilleur que 100vh */
  display: flex;
  flex-direction: column;
  background: linear-gradient(135deg, #f8f9ff, #eef2ff);
`;

const Header = styled.div`
  position: sticky;
  top: 0;
  z-index: 1000;

  padding: 16px 20px;
  background: white;
  border-bottom: 1px solid #e5e7eb;
  display: flex;
  align-items: center;
  gap: 14px;
  box-shadow: 0 4px 18px rgba(31, 42, 68, 0.05);
`;

const BackButton = styled.button`
  background: #eef2ff;
  border: none;
  width: 42px;
  height: 42px;
  border-radius: 50%;
  color: #4f6cff;
  cursor: pointer;
  font-size: 16px;
  transition: 0.2s ease;

  &:hover {
    background: #dfe7ff;
    transform: scale(1.05);
  }
`;

const HeaderInfo = styled.div`
  display: flex;
  flex-direction: column;
`;

const HeaderTitle = styled.h2`
  margin: 0;
  font-size: 18px;
  color: #1f2a44;
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
  padding: 20px 16px 100px;
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const MessageRow = styled.div`
  display: flex;
  justify-content: ${(props) => (props.$mine ? "flex-end" : "flex-start")};
`;

const MessageBubble = styled.div`
  max-width: 75%;
  padding: 12px 16px;
  border-radius: 20px;
  font-size: 14px;
  line-height: 1.5;
  word-break: break-word;
  box-shadow: 0 8px 20px rgba(31, 42, 68, 0.06);

  background: ${(props) =>
    props.$mine ? "linear-gradient(135deg, #ff4d8d, #ff6ca7)" : "white"};

  color: ${(props) => (props.$mine ? "white" : "#1f2a44")};

  border-bottom-right-radius: ${(props) => (props.$mine ? "6px" : "20px")};
  border-bottom-left-radius: ${(props) => (props.$mine ? "20px" : "6px")};
`;

const MessageImage = styled.img`
  width: 100%;
  max-width: 260px;
  border-radius: 16px;
  margin-bottom: 8px;
  object-fit: cover;
`;

const MessageText = styled.p`
  margin: 0;
`;

const MessageTime = styled.span`
  display: block;
  font-size: 11px;
  margin-top: 6px;
  opacity: 0.75;
`;

const PreviewBox = styled.div`
  padding: 12px 16px;
  background: white;
  border-top: 1px solid #e5e7eb;
`;

const PreviewImageWrapper = styled.div`
  position: relative;
  width: fit-content;
`;

const PreviewImage = styled.img`
  max-width: 140px;
  border-radius: 16px;
  display: block;
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
`;

const InputContainer = styled.div`
  position: sticky;
  bottom: 0;
  z-index: 1000;

  display: flex;
  padding: 10px;
  background: white;
  border-top: 1px solid #e5e7eb;
  gap: 10px;
  align-items: center;
`;

const FileInput = styled.input`
  display: none;
`;

const IconButton = styled.label`
  width: 52px;
  height: 52px;
  border-radius: 50%;
  border: none;
  background: #eef2ff;
  color: #4f6cff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  cursor: pointer;
  transition: 0.2s ease;

  &:hover {
    background: #dfe7ff;
    transform: translateY(-2px);
  }
`;

const Input = styled.input`
  flex: 1;
  padding: 14px 18px;
  border-radius: 999px;
  border: 1px solid #dbe2f0;
  outline: none;
  font-size: 16px; /* IMPORTANT pour éviter zoom */
  transition: 0.2s ease;

  &:focus {
    border-color: #4f6cff;
    box-shadow: 0 0 0 4px rgba(79, 108, 255, 0.08);
  }
`;

const SendButton = styled.button`
  width: 52px;
  height: 52px;
  border-radius: 50%;
  border: none;
  background: linear-gradient(135deg, #4f6cff, #6f88ff);
  color: white;
  font-size: 18px;
  cursor: pointer;
  box-shadow: 0 10px 24px rgba(79, 108, 255, 0.22);
  transition: 0.2s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 14px 28px rgba(79, 108, 255, 0.28);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
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

  const { onlineUsers } = useTchatSocket(monProfilId, setMessages);

  useEffect(() => {
    if (!monProfilId) return;

    const registerIfConnected = () => {
      console.log("👤 Enregistrement utilisateur socket :", monProfilId);
      console.log("🔌 socket.connected ?", socket.connected);
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

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

const getStatutIcon = (status) => {
  switch (status) {
    case "sent":
      return "✔";
    case "delivered":
      return "✔✔";
    case "seen":
      return "✔✔"; 
    default:
      return "";
  }
};

  useEffect(() => {
    const chargerTchat = async () => {
      try {
        setLoading(true);
        setMessageErreur("");

        const monProfilData = await getMonProfil(token);
        setMonProfilId(monProfilData._id);

        const profilData = await getProfilCible(id);
        setProfilCible(profilData);

        const messagesData = await getMessagesConversation(id, token);
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

useEffect(() => {
  if (!token || !id || !monProfilId) return;

  const marquerCommeLus = async () => {
    try {
      const data = await marquerMessagesCommeLusApi(id, token);

      if (data.idsMessagesLus?.length > 0) {
        setMessages((prev) =>
          prev.map((msg) =>
            data.idsMessagesLus.includes(msg._id)
              ? { ...msg, statut: "seen" }
              : msg
          )
        );
      }
    } catch (error) {
      console.error("Erreur marquage lu :", error.message);
    }
  };

  marquerCommeLus();
}, [id, token, monProfilId]); 

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const removeSelectedFile = () => {
    setSelectedFile(null);
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

      const data = await envoyerMessageApi(id, token, formData);

      setMessages((prev) => {
        const existeDeja = prev.some(
          (msg) => msg._id === data.nouveauMessage._id,
        );
        if (existeDeja) return prev;

        return [...prev, data.nouveauMessage];
      });

      socket.emit("sendMessage", data.nouveauMessage);

      setNewMessage("");
      setSelectedFile(null);
      setPreviewUrl("");
    } catch (error) {
      setMessageErreur(error.message);
    } finally {
      setSending(false);
    }
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const isProfilCibleOnline = onlineUsers.includes(id);

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

        <FaUserCircle size={42} color="#4f6cff" />

        <HeaderInfo>
          <HeaderTitle>{profilCible?.pseudo || "Discussion"}</HeaderTitle>
          <HeaderSubtitle>
            <FaCircle
              size={10}
              color={isProfilCibleOnline ? "#22c55e" : "#9ca3af"}
            />
            {isProfilCibleOnline ? "En ligne" : "Hors ligne"}
          </HeaderSubtitle>
        </HeaderInfo>
      </Header>

      <MessagesContainer>
        {messages.length === 0 ? (
          <EmptyState>
            <h3>Aucun message pour le moment</h3>
            <p>Commence la conversation</p>
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
                    {isMine && ` • ${getStatutIcon(msg.statut)}`}
                  </MessageTime>
                </MessageBubble>
              </MessageRow>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </MessagesContainer>

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
    </Wrapper>
  );
}

export default Tchat;
