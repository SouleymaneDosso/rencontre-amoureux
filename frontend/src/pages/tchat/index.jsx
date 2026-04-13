import { useParams, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { useState, useRef, useEffect } from "react";
import imageCompression from "browser-image-compression";
import {
  FaArrowLeft,
  FaPaperPlane,
  FaUserCircle,
  FaExclamationTriangle,
  FaCircle,
  FaImage,
  FaTimes,
} from "react-icons/fa";
import { FaCheck, FaCheckDouble } from "react-icons/fa";

import { socket } from "../../socket";

import { useTchatSocket } from "../../hooks/useTchatSocket";
import {
  getMonProfil,
  getProfilCible,
  getMessagesConversation,
  envoyerMessageApi,
  marquerMessagesCommeLusApi,
} from "../../services/tchatApi";

import { useLocation } from "react-router-dom";

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

const StatusWrapper = styled.span`
  margin-left: 6px;
  display: inline-flex;
  align-items: center;
  opacity: 0.9;
`;

const Avatarplaceholder = styled.div`
  width: 42px;
  height: 42px;
  border-radius: 50%;
  background: linear-gradient(135deg, #4f6cff, #6f88ff);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 18px;
  font-weight: 700;
`;

const Avatar = styled.img`
  width: 100%;
  height: 100%;
  border-radius: 50%;
  object-fit: cover;
`;

const SkeletonBubble = styled.div`
  width: ${(props) => props.width || "60%"};
  height: 16px;
  border-radius: 12px;
  background: linear-gradient(90deg, #e5e7eb 25%, #f3f4f6 37%, #e5e7eb 63%);
  background-size: 400% 100%;
  animation: shimmer 1.4s ease infinite;

  @keyframes shimmer {
    0% {
      background-position: 100% 0;
    }
    100% {
      background-position: 0 0;
    }
  }
`;

const SkeletonMessage = styled.div`
  display: flex;
  justify-content: ${(props) => (props.$right ? "flex-end" : "flex-start")};
`;

function Tchat() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const containerRef = useRef(null);
  const shouldAutoScrollRef = useRef(true);

  const [messages, setMessages] = useState(location.state?.messages || []);
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
  const [isTyping, setIsTyping] = useState(false);
  const { onlineUsers } = useTchatSocket(monProfilId, setMessages);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const typingTimeoutRef = useRef(null);

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

  useEffect(() => {
    const cachedMessages = localStorage.getItem(`messages-${id}`);

    if (cachedMessages) {
      console.log("⚡ Chargement instantané depuis cache");
      setMessages(JSON.parse(cachedMessages));
      setLoading(false); // 🔥 IMPORTANT
    }
  }, [id]);

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatutIcon = (statut) => {
    switch (statut) {
      case "sent":
        return <FaCheck color="white" size={12} />;

      case "delivered":
        return <FaCheckDouble color="white" size={12} />;

      case "seen":
        return <FaCheckDouble color="#3b82f6" size={12} />;

      default:
        return null;
    }
  };

  const loadMoreMessages = async () => {
    if (!hasMore || loadingMore) return;

    setLoadingMore(true);

    const nextPage = page + 1;

    try {
      const moreMessages = await getMessagesConversation(id, token, nextPage);

      if (moreMessages.length === 0) {
        setHasMore(false);
      } else {
        setMessages((prev) => [...moreMessages, ...prev]);
        setPage(nextPage);
      }
    } catch (error) {
      console.error("Erreur load more :", error);
    } finally {
      setLoadingMore(false);
    }
  };

  // localStorage pour les messages

  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem(`messages-${id}`, JSON.stringify(messages));
    }
  }, [id, messages]);

  useEffect(() => {
    const chargerTchat = async () => {
      try {
        const cachedMessages = localStorage.getItem(`messages-${id}`);

        if (!cachedMessages) {
          setLoading(true);
        }
        setMessageErreur("");

        const [monProfilData, profilData, messagesData] = await Promise.all([
          getMonProfil(token),
          getProfilCible(id),
          getMessagesConversation(id, token),
        ]);

        setMonProfilId(monProfilData._id);
        setProfilCible(profilData);
        setMessages((prev) => {
          return messagesData;
        });
        setPage(1);
        setHasMore(messagesData.length === 20);
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
    const handleReceiveMessage = (msg) => {
      // 📬 dire "livré"
      socket.emit("messageDelivered", {
        messageId: msg._id,
        expediteurId: msg.expediteur,
      });

      // 👁️ dire "LU DIRECT si ouvert"
      socket.emit("messagesRead", {
        expediteurId: msg.expediteur,
        idsMessagesLus: [msg._id],
      });
    };

    socket.on("receiveMessage", handleReceiveMessage);

    return () => {
      socket.off("receiveMessage", handleReceiveMessage);
    };
  }, []);

  useEffect(() => {
    const handleReconnect = async () => {
      console.log("🔄 Reconnexion → sync messages");

      const messagesData = await getMessagesConversation(id, token);
      setMessages(messagesData);
    };

    socket.on("connect", handleReconnect);

    return () => {
      socket.off("connect", handleReconnect);
    };
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
                : msg,
            ),
          );
          socket.emit("messagesRead", {
            expediteurId: id,
            idsMessagesLus: data.idsMessagesLus,
          });
        }
      } catch (error) {
        console.error("Erreur marquage lu :", error.message);
      }
    };

    marquerCommeLus();
  }, [id, token, monProfilId]);

  // typing
  useEffect(() => {
    let timeout;
    const handleTyping = () => {
      setIsTyping(true);

      clearTimeout(timeout);
      timeout = setTimeout(() => {
        setIsTyping(false);
      }, 2000);
    };
    socket.on("typing", handleTyping);
    return () => {
      socket.off("typing", handleTyping);
    };
  }, []);

  useEffect(() => {
    const handleStopTyping = () => {
      setIsTyping(false);
    };

    socket.on("stopTyping", handleStopTyping);

    return () => {
      socket.off("stopTyping", handleStopTyping);
    };
  }, []);

  // fin typing

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      // ⚙️ options de compression
      const options = {
        maxSizeMB: 0.5, // taille max = 500KB
        maxWidthOrHeight: 1024, // redimensionne image
        useWebWorker: true, // + rapide
      };

      // 🔥 compression
      const compressedFile = await imageCompression(file, options);

      // 🧠 stocke fichier compressé
      setSelectedFile(compressedFile);

      // 👁️ preview (image compressée)
      setPreviewUrl(URL.createObjectURL(compressedFile));
    } catch (error) {
      console.error("Erreur compression :", error);
    }
  };

  const removeSelectedFile = () => {
    setSelectedFile(null);
    setPreviewUrl("");
  };

  const sendMessage = async () => {
    if (!newMessage.trim() && !selectedFile) return;

    const tempId = "temp-" + Date.now();

    const file = selectedFile;
    const messageText = newMessage;

    const tempMessage = {
      _id: tempId,
      conversationId: id,
      expediteur: monProfilId,
      destinataire: id,
      contenu: messageText,
      type: file ? "image" : "text",
      media: file
        ? {
            url: previewUrl,
            originalname: file.name,
            mimetype: file.type,
            size: file.size,
          }
        : {},
      statut: "sent",
      createdAt: new Date().toISOString(),
    };

    // ⚡ affichage instantané
    setMessages((prev) => [...prev, tempMessage]);

    // ⚡ reset UI
    setNewMessage("");
    setSelectedFile(null);
    setPreviewUrl("");

    try {
      const formData = new FormData();
      formData.append("contenu", messageText);

      if (file) {
        formData.append("media", file);
      }

      const data = await envoyerMessageApi(id, token, formData);

      // 🔁 remplacement message temporaire
      setMessages((prev) =>
        prev.map((msg) => (msg._id === tempId ? data.nouveauMessage : msg)),
      );

      socket.emit("sendMessage", data.nouveauMessage);
    } catch (error) {
      console.error("Erreur :", error.message);

      setMessages((prev) =>
        prev.map((msg) =>
          msg._id === tempId ? { ...msg, statut: "error" } : msg,
        ),
      );
    }
  };

  useEffect(() => {
    if (shouldAutoScrollRef.current) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const isProfilCibleOnline = onlineUsers.includes(id);

  if (loading && messages.length === 0) {
    return (
      <Wrapper>
        <Header>
          <BackButton onClick={() => navigate(-1)}>
            <FaArrowLeft />
          </BackButton>

          <HeaderInfo>
            <HeaderTitle>Chargement...</HeaderTitle>
          </HeaderInfo>
        </Header>

        <MessagesContainer>
          {[...Array(6)].map((_, i) => (
            <SkeletonMessage key={i} $right={i % 2 === 0}>
              <SkeletonBubble width={i % 2 === 0 ? "60%" : "40%"} />
            </SkeletonMessage>
          ))}
        </MessagesContainer>
      </Wrapper>
    );
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

        <Avatarplaceholder>
          {profilCible?.avatar ? (
            <Avatar src={profilCible.avatar?.url} alt="Profil" />
          ) : (
            <FaUserCircle size={42} color="#4f6cff" />
          )}
        </Avatarplaceholder>

        <HeaderInfo>
          <HeaderTitle>{profilCible?.pseudo || "Discussion"}</HeaderTitle>
          <HeaderSubtitle>
            {isTyping ? (
              "en train d’écrire..."
            ) : (
              <>
                <FaCircle
                  size={10}
                  color={isProfilCibleOnline ? "#22c55e" : "#9ca3af"}
                />
                {isProfilCibleOnline ? "En ligne" : "Hors ligne"}
              </>
            )}
          </HeaderSubtitle>
        </HeaderInfo>
      </Header>

      <MessagesContainer
        ref={containerRef}
        onScroll={(e) => {
          const el = e.target;

          // 📌 détecte si on est en bas
          const isNearBottom =
            el.scrollHeight - el.scrollTop - el.clientHeight < 100;

          shouldAutoScrollRef.current = isNearBottom;

          // 📌 load anciens messages
          if (el.scrollTop === 0) {
            loadMoreMessages();
          }
        }}
      >
        {messages.length === 0 ? (
          <EmptyState>
            <h3>Aucun message pour le moment</h3>
            <p>Commence la conversation</p>
          </EmptyState>
        ) : (
          messages.map((msg) => {
            const isMine = msg.expediteur === monProfilId;
            if (!monProfilId) return null;
            return (
              <MessageRow key={msg._id} $mine={isMine}>
                <MessageBubble $mine={isMine}>
                  {msg.type === "image" && msg.media?.url && (
                    <MessageImage src={msg.media.url} alt="message" />
                  )}

                  {msg.contenu && <MessageText>{msg.contenu}</MessageText>}

                  <MessageTime>
                    {msg.createdAt ? formatTime(msg.createdAt) : ""}
                    {isMine && (
                      <StatusWrapper>{getStatutIcon(msg.statut)}</StatusWrapper>
                    )}
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
          onChange={(e) => {
            setNewMessage(e.target.value);

            if (!typingTimeoutRef.current) {
              socket.emit("typing", { to: id });
            }

            clearTimeout(typingTimeoutRef.current);

            typingTimeoutRef.current = setTimeout(() => {
              typingTimeoutRef.current = null;

              // 🔥 NOUVEAU : stop typing
              socket.emit("stopTyping", { to: id });
            }, 2000);
          }}
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
