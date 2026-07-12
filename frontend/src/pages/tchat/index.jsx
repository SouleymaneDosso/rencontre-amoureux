import { useParams, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { useState, useRef, useEffect, useLayoutEffect } from "react";
import imageCompression from "browser-image-compression";
import { FaMicrophone } from "react-icons/fa";
import { keyframes } from "styled-components";
import { FaPhoneSlash } from "react-icons/fa";
import { MdCallMade, MdCallReceived } from "react-icons/md";
import MessageItem from "../../components/chat/MessageItem";
import HeaderChat from "../../components/chat/HeaderChat";

import { FaPhoneAlt } from "react-icons/fa";
const API_URL = import.meta.env.VITE_API_URL;
import {
  FaTrash,
  FaArrowLeft,
  FaPaperPlane,
  FaUserCircle,
  FaExclamationTriangle,
  FaCircle,
  FaImage,
  FaTimes,
  FaPlay,
  FaPause,
} from "react-icons/fa";
import { FaCheck, FaCheckDouble } from "react-icons/fa";

import { socket } from "../../socket";

import { useTchatSocket } from "../../hooks/useTchatSocket";
import {
  getProfilCible,
  getMessagesConversation,
  envoyerMessageApi,
  marquerMessagesCommeLusApi,
  creerMessageAppel,
} from "../../services/tchatApi";

import { useLocation } from "react-router-dom";

import { FaExpand } from "react-icons/fa";

const HeaderActions = styled.div`
  margin-left: auto;
`;

const CallButton = styled.button`
  width: 42px;
  height: 42px;

  border: none;
  border-radius: 50%;

  display: flex;
  align-items: center;
  justify-content: center;

  cursor: pointer;

  background: #22c55e;
  color: white;

  transition: 0.2s;

  &:hover {
    transform: scale(1.08);
  }
`;

const ExpandButton = styled.button`
  position: absolute;
  top: 10px;
  right: 10px;

  width: 34px;
  height: 34px;
  border-radius: 50%;
  border: none;

  background: rgba(0, 0, 0, 0.5);
  color: white;

  display: flex;
  align-items: center;
  justify-content: center;

  cursor: pointer;
`;

const PreviewActions = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  width: 100%;
  margin-top: 20px;
`;
const blink = keyframes`
  0%,100%{
    opacity:1;
    transform:scale(1);
  }

  50%{
    opacity:.35;
    transform:scale(.85);
  }
`;
const wave = keyframes`
  0%,100%{
    transform:scaleY(.35);
  }

  50%{
    transform:scaleY(1);
  }
`;

const RecordingWave = styled.div`
  display: flex;
  align-items: flex-end;
  gap: 4px;
  height: 32px;
  margin: 18px 0;
`;

const WaveBar = styled.div`
  width: 4px;
  height: 24px;

  border-radius: 999px;

  background: #3b82f6;

  animation: ${wave} 0.8s ease-in-out infinite;

  animation-delay: ${({ $delay }) => $delay}s;
`;

const CircleAction = styled.button`
  width: 52px;
  height: 52px;
  border: none;
  border-radius: 50%;

  display: flex;
  align-items: center;
  justify-content: center;

  cursor: pointer;

  color: white;
  font-size: 18px;

  background: ${({ $variant }) => {
    switch ($variant) {
      case "delete":
        return "#ef4444"; // rouge

      case "play":
        return "#3b82f6"; // bleu

      case "send":
        return "#22c55e"; // vert

      default:
        return "#6b7280"; // gris
    }
  }};

  transition: all 0.2s ease;

  &:hover {
    transform: scale(1.06);
  }

  &:active {
    transform: scale(0.95);
  }
`;

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

  border: none;

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
  border: none;
  font-size: 20px;
  cursor: pointer;
  border-radius: 12px;

  color: #4f6cff;
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

const MessageVideo = styled.video`
  width: 100%;
  max-width: 260px;
  border-radius: 16px;
  margin-bottom: 8px;
`;

const MOdalcontain = styled.div`
  position: fixed;
  inset: 0;
  background: black;
  z-index: 9999;

  display: flex;
  align-items: center;
  justify-content: center;
`;

const ModalImage = styled.img`
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
`;

const Slider = styled.div`
  display: flex;
  height: 100%;
  transition: transform 0.3s ease;
  user-select: none;
`;

const Slide = styled.div`
  min-width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const VideoWrapper = styled.div`
  position: relative;
  width: fit-content;
`;
const PlayIcon = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);

  width: 56px;
  height: 56px;
  border-radius: 50%;

  background: rgba(0, 0, 0, 0.5);

  display: flex;
  align-items: center;
  justify-content: center;

  color: white;
  font-size: 22px;
`;

const SwipeContainer = styled.div`
  position: relative;
  overflow: hidden;
  display: inline-block;
`;

const ProgressBar = styled.div`
  flex: 1;
  width: 100px;

  height: 4px;
  background: rgba(128, 10, 132, 0.08);
  border-radius: 999px;
`;

const ProgressFill = styled.div`
  position: relative;
  height: 100%;
  width: ${(props) => props.$progress}%;
  background: #007bff;
  transition: width 0.1s linear;
`;

const ProgressThumb = styled.div`
  position: absolute;

  right: -6px;
  top: 50%;

  transform: translateY(-50%);

  width: 12px;
  height: 12px;

  border-radius: 50%;

  background: white;
  border: 2px solid #007bff;
`;

// modal message

const ModalOverlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);

  display: flex;
  justify-content: center;
  align-items: center;

  z-index: 10000;
`;

const ModalBox = styled.div`
  background: white;
  border-radius: 16px;
  padding: 20px;
  width: 300px;

  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const ModalTitle = styled.h3`
  margin: 0;
  text-align: center;
`;

const ModalAction = styled.button`
  padding: 12px;
  border: none;
  cursor: pointer;
  border-radius: 10px;
`;

const ModalCancel = styled(ModalAction)`
  font-weight: bold;
`;

const SelectedMessagePreview = styled.div`
  width: 100%;

  padding: 12px;

  border-radius: 10px;

  background: #f5f5f5;

  color: #333;

  font-size: 14px;

  line-height: 1.4;

  word-break: break-word;

  max-height: 100px;

  overflow-y: auto;

  border-left: 4px solid #25d366;
`;

const NotificationToast = styled.div`
  position: fixed;

  bottom: 100px;

  left: 50%;

  transform: translateX(-50%);

  background: rgba(0, 0, 0, 0.85);

  color: white;

  padding: 12px 20px;

  border-radius: 10px;

  font-size: 14px;

  z-index: 10001;

  pointer-events: none;
`;

const ReplyPreview = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;

  padding: 10px 15px;

  border-left: 4px solid #00a884;

  background: #f5f5f5;
`;
const ReplyContent = styled.div`
  flex: 1;
`;
const ReplyLabel = styled.div`
  font-size: 13px;
  font-weight: 600;

  color: #00a884;
`;
const LoadingMoreContainer = styled.div`
  position: sticky;
  top: 8px;
  z-index: 20;

  display: flex;
  justify-content: center;
  pointer-events: none;
`;

const LoadingSpinner = styled.div`
  width: 28px;
  height: 28px;

  border: 3px solid rgba(255, 255, 255, 0.25);
  border-top-color: #4f6cff;
  border-radius: 50%;

  background: rgba(15, 23, 42, 0.85);
  backdrop-filter: blur(8px);

  animation: spin 0.8s linear infinite;

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
`;

const ReplyText = styled.div`
  margin-top: 4px;

  font-size: 14px;

  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const ReplyClose = styled.button`
  border: none;
  background: transparent;
  cursor: pointer;

  font-size: 18px;
`;

const ReplyMessageContainer = styled.div`
  margin-bottom: 6px;
  padding: 8px;

  border-left: 3px solid #00a884;

  background: rgba(0, 0, 0, 0.08);

  border-radius: 6px;

  font-size: 13px;
`;
const ReplyMessageText = styled.div`
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const ReplyIconVisible = styled.div`
  opacity: ${({ $visible }) => ($visible ? 1 : 0)};

  transition: opacity 0.2s ease;

  position: absolute;
  left: 10px;

  font-size: 20px;
`;

const RecordingModal = styled.div`
  position: absolute;
  left: 16px;
  right: 16px;
  bottom: 85px;
  color: white;

  padding: 18px;

  border-radius: 18px;

  background: rgba(25, 25, 25, 0.95);
  backdrop-filter: blur(12px);

  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;

  z-index: 500;
`;
const RecordingDot = styled.div`
  width: 14px;
  height: 14px;
  border-radius: 50%;

  background: #ef4444;

  animation: ${blink} 1s infinite;
`;
const CallModal = styled.div`
  position: fixed;
  inset: 0;

  background: rgba(0, 0, 0, 0.6);

  display: flex;
  justify-content: center;
  align-items: center;

  z-index: 20000;
`;

const CallBox = styled.div`
  background: white;
  padding: 20px;
  border-radius: 12px;
  text-align: center;
  width: 300px;
`;

const CallActions = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 15px;
`;

const AcceptButton = styled.button`
  background: #22c55e;
  color: white;
  border: none;
  padding: 10px;
  border-radius: 8px;
  cursor: pointer;
`;

const DeclineButton = styled.button`
  background: #ef4444;
  color: white;
  border: none;
  padding: 10px;
  border-radius: 8px;
  cursor: pointer;
`;

const CallMessage = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const CallIcon = styled.div`
  width: 42px;
  height: 42px;

  border-radius: 50%;

  display: flex;
  align-items: center;
  justify-content: center;

  font-size: 18px;

  background: ${({ $status }) => {
    if ($status === "missed") return "#fee2e2";

    if ($status === "rejected") return "#fee2e2";

    if ($status === "cancelled") return "#f3f4f6";

    return "#dcfce7";
  }};

  color: ${({ $status }) => {
    if ($status === "missed") return "#dc2626";

    if ($status === "rejected") return "#dc2626";

    if ($status === "cancelled") return "#6b7280";

    return "#16a34a";
  }};
`;

const CallAvatar = styled.div`
  width: 56px;
  height: 56px;

  border-radius: 50%;

  overflow: hidden;

  display: flex;
  align-items: center;
  justify-content: center;

  background: #f3f4f6;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const CallInfos = styled.div`
  display: flex;
  flex-direction: column;
`;
const CallTitle = styled.div`
  font-weight: 600;
  font-size: 15px;
`;

const CallDuration = styled.div`
  font-size: 12px;
  opacity: 0.7;
  margin-top: 3px;
`;

const CallingBanner = styled.div`
  position: fixed;

  top: 15px;
  left: 50%;
  transform: translateX(-50%);

  width: 360px;
  max-width: calc(100% - 20px);

  background: white;

  border-radius: 18px;

  padding: 14px 18px;

  display: flex;
  align-items: center;
  justify-content: space-between;

  box-shadow: 0 15px 40px rgba(0, 0, 0, 0.18);

  z-index: 99999;

  animation: slideDown 0.25s ease;

  @keyframes slideDown {
    from {
      opacity: 0;
      transform: translate(-50%, -20px);
    }

    to {
      opacity: 1;
      transform: translate(-50%, 0);
    }
  }
`;
const CallerSection = styled.div`
  display: flex;
  align-items: center;
  gap: 14px;
`;

const CallerText = styled.div`
  display: flex;
  flex-direction: column;

  strong {
    font-size: 16px;
    color: #111827;
  }

  small {
    margin-top: 3px;
    font-size: 13px;
    color: #6b7280;
  }
`;

const EndCallButton = styled.button`
  width: 52px;
  height: 52px;

  border: none;

  border-radius: 50%;

  background: #ef4444;

  color: white;

  display: flex;
  align-items: center;
  justify-content: center;

  cursor: pointer;

  font-size: 18px;

  transition: 0.2s;

  &:hover {
    transform: scale(1.08);
  }
`;

function Tchat() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const containerRef = useRef(null);
  const shouldAutoScrollRef = useRef(true);
  const startX = useRef(0);
  const isDragging = useRef(false);
  const startY = useRef(0);
  const moved = useRef(false);
  const videoRefs = useRef({});
  const modalVideoRefs = useRef({});
  const controlsTimeoutRef = useRef({});
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const touchStartX = useRef(0);
  const mouseStartX = useRef(0);
  const firstLoadRef = useRef(true);
  const previewProgressRef = useRef(null);
  const audioRefs = useRef({});
  const previewAudioRef = useRef(null);
  const localStreamRef = useRef(null);

  const progressRefs = useRef({});
  const recordingStartRef = useRef(null);
  const longPressTimer = useRef(null);
  const loadingOlderMessagesRef = useRef(false);

  const [messages, setMessages] = useState(location.state?.messages || []);
  const [newMessage, setNewMessage] = useState("");
  const monProfil = JSON.parse(localStorage.getItem("monProfil"));

  const [monProfilId] = useState(monProfil?._id || null);
  const [profilCible, setProfilCible] = useState(
    location.state?.profilCible || null,
  );
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
  const [modal, setModal] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [playingVideoId, setPlayingVideoId] = useState(null);
  const [playingModalVideoId, setPlayingModalVideoId] = useState(null);
  const [showControls, setShowControls] = useState({});
  const [showModalControls, setShowModalControls] = useState({});
  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState(null);
  const [audioUrl, setAudioUrl] = useState("");
  const [playingAudioId, setPlayingAudioId] = useState(null);
  const [modalMessage, setModalMessage] = useState(null);

  const [audioProgress, setAudioProgress] = useState({});
  const [audioCurrentTime, setAudioCurrentTime] = useState({});
  const [draggingAudioId, setDraggingAudioId] = useState(null);

  const [notification, setNotification] = useState("");
  const [messageRepondu, setMessageRepondu] = useState(null);
  const [swipeOffsets, setSwipeOffsets] = useState({});
  const [recordingTime, setRecordingTime] = useState(0);
  const [audioDuration, setAudioDuration] = useState(0);
  const [isPreviewPlaying, setIsPreviewPlaying] = useState(false);
  const [previewProgress, setPreviewProgress] = useState(0);
  const [previewCurrentTime, setPreviewCurrentTime] = useState(0);
  const [draggingPreview, setDraggingPreview] = useState(false);
  const [calling, setCalling] = useState(false);
  const [incomingCall, setIncomingCall] = useState(null);

  // swipe pour messages

  const finSwipeReponse = (e, msg) => {
    const distance = e.changedTouches[0].clientX - touchStartX.current;

    if (distance > 80) {
      setMessageRepondu(msg);

      if (navigator.vibrate) {
        navigator.vibrate(50);
      }
    }

    setSwipeOffsets((prev) => ({
      ...prev,
      [msg._id]: 0,
    }));
  };

  const moveSwipeReponse = (e, msgId) => {
    const distance = e.touches[0].clientX - touchStartX.current;

    if (distance > 0) {
      setSwipeOffsets((prev) => ({
        ...prev,
        [msgId]: Math.min(distance, 120),
      }));
    }
  };

  const debutSwipeMouse = (e) => {
    mouseStartX.current = e.clientX;
  };

  const finSwipeMouse = (e, msg) => {
    const distance = e.clientX - mouseStartX.current;

    if (distance > 80) {
      setMessageRepondu(msg);
    }
  };

  const debutSwipeReponse = (e) => {
    touchStartX.current = e.touches[0].clientX;
  };

  // notification

  const afficherNotification = (message) => {
    setNotification(message);

    setTimeout(() => {
      setNotification("");
    }, 2000);
  };

  // modal message

  const ouvrirModalMessage = (msg) => {
    const index = messages.findIndex((m) => m._id === msg._id);
    if (index === -1) return;
    setModalMessage(messages[index]);
  };

  const fermerModalMessage = () => {
    setModalMessage(null);
  };

  const debutAppuiLong = (msg) => {
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current);
    }

    longPressTimer.current = setTimeout(() => {
      ouvrirModalMessage(msg);
    }, 400);
  };

  const annulerAppuiLong = () => {
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current);
      longPressTimer.current = null;
    }
  };
  // fin modal message

  //appelles//

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

  // finAPPelle

  // audio

  const seekPreviewAudio = (e) => {
    const audio = previewAudioRef.current;

    if (!audio) return;

    const rect = e.currentTarget.getBoundingClientRect();

    const clickX = e.clientX - rect.left;

    const percentage = clickX / rect.width;

    audio.currentTime = percentage * audio.duration;
  };

  const togglePreviewAudio = () => {
    const audio = previewAudioRef.current;

    if (!audio) return;

    if (audio.paused) {
      audio.play();
      setIsPreviewPlaying(true);
    } else {
      audio.pause();
      setIsPreviewPlaying(false);
    }
  };

  const supprimerPreviewAudio = () => {
    if (previewAudioRef.current) {
      previewAudioRef.current.pause();
    }

    if (audioUrl) {
      URL.revokeObjectURL(audioUrl);
    }

    setIsPreviewPlaying(false);
    setAudioBlob(null);
    setAudioUrl("");
    setAudioDuration(0);
  };

  const formatRecordingTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;

    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  useEffect(() => {
    if (!isRecording) {
      setRecordingTime(0);
      return;
    }

    const interval = setInterval(() => {
      setRecordingTime((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [isRecording]);

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (draggingPreview) {
        const progressBar = previewProgressRef.current;

        if (!progressBar) return;

        const rect = progressBar.getBoundingClientRect();

        const x = e.clientX - rect.left;

        const percentage = Math.min(Math.max(x / rect.width, 0), 1);

        const audio = previewAudioRef.current;

        if (!audio) return;

        audio.currentTime = percentage * audio.duration;

        return;
      }
      if (!draggingAudioId) return;

      const progressBar = progressRefs.current[draggingAudioId];

      if (!progressBar) return;

      const rect = progressBar.getBoundingClientRect();

      const x = e.clientX - rect.left;

      const percentage = Math.min(Math.max(x / rect.width, 0), 1);

      const audio = audioRefs.current[draggingAudioId];

      if (!audio) return;

      audio.currentTime = percentage * audio.duration;
    };

    const handleMouseUp = () => {
      setDraggingAudioId(null);
      setDraggingPreview(false);
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [draggingAudioId]);

  const seekAudio = (e, messageId) => {
    const audio = audioRefs.current[messageId];

    if (!audio) return;

    const rect = e.currentTarget.getBoundingClientRect();

    const clickX = e.clientX - rect.left;

    const percentage = clickX / rect.width;

    audio.currentTime = percentage * audio.duration;
  };

  const startRecording = async () => {
    if (isRecording) return;
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
      });

      const mimeTypes = [
        "audio/webm;codecs=opus",
        "audio/webm",
        "audio/mp4",
        "audio/aac",
      ];

      const mimeType =
        mimeTypes.find((type) => MediaRecorder.isTypeSupported(type)) || "";
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType,
      });

      mediaRecorderRef.current = mediaRecorder;

      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, {
          type: mimeType,
        });

        const duration = Math.max(
          1,
          Math.round((Date.now() - recordingStartRef.current) / 1000),
        );

        stream.getTracks().forEach((track) => track.stop());

        setAudioBlob(audioBlob);
        setAudioUrl(URL.createObjectURL(audioBlob));

        // (optionnel mais conseillé)
        setAudioDuration?.(duration);

        setIsRecording(false);
      };

      recordingStartRef.current = Date.now();
      mediaRecorder.start();

      setIsRecording(true);
    } catch (error) {
      console.error("Erreur micro :", error);
    }
  };

  const stopRecording = () => {
    const recorder = mediaRecorderRef.current;

    if (!recorder) return;

    if (recorder.state !== "inactive") {
      recorder.stop();
    }

    setIsRecording(false);
  };

  useEffect(() => {
    return () => {
      const recorder = mediaRecorderRef.current;

      if (recorder && recorder.state !== "inactive") {
        recorder.stop();
      }
    };
  }, []);

  const sendAudioMessage = async (audioBlob, duration) => {
    setSending(true);

    const tempId = "temp-" + Date.now();

    const tempMessage = {
      _id: tempId,
      conversationId: id,
      expediteur: monProfilId,
      destinataire: id,

      contenu: "",
      type: "audio",

      media: {
        url: URL.createObjectURL(audioBlob),
        mimetype: audioBlob.type,
        duration,
      },

      statut: "sent",
      createdAt: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, tempMessage]);

    try {
      const formData = new FormData();

      formData.append("media", audioBlob, "voice.webm");
      formData.append("duration", duration);

      const data = await envoyerMessageApi(id, token, formData);

      setMessages((prev) =>
        prev.map((msg) => (msg._id === tempId ? data.nouveauMessage : msg)),
      );

      socket.emit("sendMessage", data.nouveauMessage);
    } catch (error) {
      console.error(error);

      setMessages((prev) =>
        prev.map((msg) =>
          msg._id === tempId ? { ...msg, statut: "error" } : msg,
        ),
      );
    } finally {
      setSending(false);
    }
  };

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

  // fin audio

  // modal zone

  const toggleVideo = (id) => {
    const currentVideo = videoRefs.current[id];

    if (!currentVideo) return;

    Object.entries(videoRefs.current).forEach(([videoId, video]) => {
      if (videoId !== id && !video.paused) {
        video.pause();
      }
    });

    if (currentVideo.paused) {
      currentVideo.play();

      setShowControls((prev) => ({
        ...prev,
        [id]: true,
      }));

      // ✅ IMPORTANT
      clearTimeout(controlsTimeoutRef.current[id]);

      controlsTimeoutRef.current[id] = setTimeout(() => {
        setShowControls((prev) => ({
          ...prev,
          [id]: false,
        }));
      }, 1000);
    } else {
      currentVideo.pause();

      setShowControls((prev) => ({
        ...prev,
        [id]: true,
      }));
    }
  };

  const toggleAudio = (id) => {
    const currentAudio = audioRefs.current[id];

    if (!currentAudio) return;

    Object.entries(audioRefs.current).forEach(([audioId, audio]) => {
      if (audioId !== id && !audio.paused) {
        audio.pause();
      }
    });

    if (currentAudio.paused) {
      currentAudio.play();
      setPlayingAudioId(id);
    } else {
      currentAudio.pause();
      setPlayingAudioId(null);
    }
  };

  const toggleModalVideo = (id) => {
    const currentVideo = modalVideoRefs.current[id];

    if (!currentVideo) return;

    // pause autres vidéos
    Object.entries(modalVideoRefs.current).forEach(([videoId, video]) => {
      if (videoId !== id && !video.paused) {
        video.pause();
      }
    });

    if (currentVideo.paused) {
      currentVideo.play();

      // affiche pause
      setShowModalControls((prev) => ({
        ...prev,
        [id]: true,
      }));

      // cache après 1 seconde
      setTimeout(() => {
        setShowModalControls((prev) => ({
          ...prev,
          [id]: false,
        }));
      }, 1000);
    } else {
      currentVideo.pause();

      // affiche play
      setShowModalControls((prev) => ({
        ...prev,
        [id]: true,
      }));
    }
  };

  const ouvrirmodal = (msg) => {
    const index = medias.findIndex((m) => m._id === msg._id);
    setCurrentIndex(index);

    setModal(true);
  };

  const fermermodal = () => {
    setModal(false);
  };

  const medias = messages.filter(
    (m) => m.type === "image" || m.type === "video",
  );

  const handleTouchStart = (e) => {
    moved.current = false;
    startX.current = e.touches[0].clientX;
    startY.current = e.touches[0].clientY;
  };

  const handleTouchMove = (e) => {
    const moveX = e.touches[0].clientX;
    const moveY = e.touches[0].clientY;

    if (
      Math.abs(moveX - startX.current) > 10 ||
      Math.abs(moveY - startY.current) > 10
    ) {
      moved.current = true;
    }
  };

  const handleTouchEnd = (e) => {
    const endX = e.changedTouches[0].clientX;
    const endY = e.changedTouches[0].clientY;

    const diffX = startX.current - endX;
    const diffY = startY.current - endY;

    // 👉 swipe vertical = fermer
    if (Math.abs(diffY) > Math.abs(diffX) && diffY < -100) {
      fermermodal();
      return;
    }

    // 👉 swipe horizontal
    if (Math.abs(diffX) > 80) {
      if (diffX > 0 && currentIndex < medias.length - 1) {
        setCurrentIndex((prev) => prev + 1);
      } else if (diffX < 0 && currentIndex > 0) {
        setCurrentIndex((prev) => prev - 1);
      }
    }
  };

  const handleMouseDown = (e) => {
    isDragging.current = true;
    moved.current = false;
    startX.current = e.clientX;
  };

  const handleMouseMove = (e) => {
    if (!isDragging.current) return;

    if (Math.abs(e.clientX - startX.current) > 10) {
      moved.current = true;
    }
  };

  const handleMouseUp = (e) => {
    if (!isDragging.current) return;

    const diff = startX.current - e.clientX;

    if (Math.abs(diff) > 80) {
      if (diff > 0 && currentIndex < medias.length - 1) {
        setCurrentIndex((prev) => prev + 1);
      } else if (diff < 0 && currentIndex > 0) {
        setCurrentIndex((prev) => prev - 1);
      }
    }

    isDragging.current = false;
  };
  // fin modal

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
      setMessages(JSON.parse(cachedMessages));
      setLoading(false);
    }
  }, [id]);

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatAudioDuration = (seconds) => {
    seconds = Math.floor(Number(seconds) || 0);

    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;

    return `${mins}:${secs.toString().padStart(2, "0")}`;
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
    if (loadingMore || !hasMore) return;
    shouldAutoScrollRef.current = false;

    setLoadingMore(true);

    try {
      const container = containerRef.current;

      if (!container) return;

      const prevHeight = container.scrollHeight;

      const nextPage = page + 1;

      const moreMessages = await getMessagesConversation(id, token, nextPage);

      if (!Array.isArray(moreMessages) || moreMessages.length === 0) {
        setHasMore(false);
        return;
      }

      loadingOlderMessagesRef.current = true;

      setMessages((prev) => {
        const ids = new Set(prev.map((m) => m._id));

        const uniques = moreMessages.filter((m) => !ids.has(m._id));

        return [...uniques, ...prev];
      });
      setPage(nextPage);

      requestAnimationFrame(() => {
        const container = containerRef.current;

        if (!container) return;

        const newHeight = container.scrollHeight;
        container.scrollTop = newHeight - prevHeight;
      });
    } catch (error) {
      console.error(error);
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

        const [profilData, messagesData] = await Promise.all([
          getProfilCible(id),
          getMessagesConversation(id, token),
        ]);

        setProfilCible(profilData);
        console.log("API messages :", messagesData.length);
        setMessages(messagesData);
        requestAnimationFrame(() => {
          messagesEndRef.current?.scrollIntoView({
            behavior: "auto",
            block: "end",
          });

          firstLoadRef.current = false;
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
      if (msg.expediteur === monProfilId) return;

      socket.emit("messageDelivered", {
        messageId: msg._id,
        expediteurId: msg.expediteur,
      });

      socket.emit("messagesRead", {
        expediteurId: msg.expediteur,
        idsMessagesLus: [msg._id],
      });
    };

    socket.on("receiveMessage", handleReceiveMessage);

    return () => {
      socket.off("receiveMessage", handleReceiveMessage);
    };
  }, [monProfilId]);

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

    if (file.type.startsWith("video")) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      return;
    }

    try {
      const options = {
        maxSizeMB: 0.5,
        maxWidthOrHeight: 1024,
        useWebWorker: true,
      };

      const compressedFile = await imageCompression(file, options);

      setSelectedFile(compressedFile);
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
    if (!newMessage.trim() && !selectedFile && !audioBlob) return;
    shouldAutoScrollRef.current = true;
    setSending(true);
    const tempId = "temp-" + Date.now();

    const file = selectedFile;
    const messageText = newMessage;

    const tempMessage = {
      _id: tempId,
      conversationId: id,
      expediteur: monProfilId,
      destinataire: id,
      reponseA: messageRepondu,
      contenu: messageText,
      type: audioBlob
        ? "audio"
        : file
          ? file.type.startsWith("video")
            ? "video"
            : "image"
          : "text",

      media: audioBlob
        ? {
            url: audioUrl,
            mimetype: "audio/webm",
          }
        : file
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
    shouldAutoScrollRef.current = true;
    // ⚡ reset UI
    setNewMessage("");
    setSelectedFile(null);
    setAudioBlob(null);
    setAudioUrl("");
    setPreviewUrl("");
    setMessageRepondu(null);

    try {
      const formData = new FormData();
      formData.append("contenu", messageText);
      if (messageRepondu) {
        formData.append("reponseA", messageRepondu._id);
      }
      if (audioBlob) {
        formData.append("media", audioBlob, "voice.webm");
      }
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
    } finally {
      setSending(false);
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

  // supprimer messages
  const supprimemoi = async (messageId) => {
    try {
      const res = await fetch(`${API_URL}/api/tchat/supprimemoi/${messageId}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();

      if (!res.ok) {
        alert(data.message);
        return;
      }
      setMessages((prev) => prev.filter((msg) => msg._id !== messageId));
    } catch (error) {
      console.error(error.message);
    }
  };

  const supprimetous = async (messageId) => {
    try {
      const res = await fetch(
        `${API_URL}/api/tchat/supprimetous/${messageId}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      const data = await res.json();

      if (!res.ok) {
        alert(data.message);
        return;
      }
      setMessages((prev) =>
        prev.map((msg) =>
          msg._id === messageId
            ? {
                ...msg,
                contenu: "↩ Message supprimé",
                type: "system",
                media: {},
              }
            : msg,
        ),
      );

      socket.emit("messageDeleted", {
        messageId,
      });
    } catch (error) {
      console.error(error.message);
    }
  };

  // fin supprimer messages
  useLayoutEffect(() => {
    if (firstLoadRef.current) return;

    if (loadingOlderMessagesRef.current) {
      loadingOlderMessagesRef.current = false;
      return;
    }

    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "end",
    });
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
      {incomingCall && (
        <CallModal>
          <CallBox>
            <h3>📞 Appel entrant</h3>

            <p>{profilCible?.pseudo} vous appelle</p>

            {profilCible?.avatar && (
              <Avatar
                src={profilCible.avatar.url}
                alt={profilCible.pseudo}
                style={{ width: "50px", height: "50px", borderRadius: "50%" }}
              />
            )}

            <CallActions>
              <DeclineButton onClick={rejectCall}>Refuser</DeclineButton>

              <AcceptButton onClick={acceptCall}>Accepter</AcceptButton>
            </CallActions>
          </CallBox>
        </CallModal>
      )}

      {calling && (
        <CallingBanner>
          <CallerSection>
            <IoCall color="#22c55e" size={22} />
            <CallAvatar>
              {profilCible?.avatar ? (
                <img src={profilCible.avatar.url} alt={profilCible.pseudo} />
              ) : (
                <FaUserCircle size={56} color="#9ca3af" />
              )}
            </CallAvatar>

            <CallerText>
              <strong>{profilCible?.pseudo}</strong>

              <small>📞 Appel audio...</small>
            </CallerText>
          </CallerSection>

          <EndCallButton onClick={cancelCall}>
            <FaPhoneSlash />
          </EndCallButton>
        </CallingBanner>
      )}
      <Header>
        <BackButton onClick={() => navigate(-1)}>
          <FaArrowLeft />
        </BackButton>

        <Avatarplaceholder>
          {profilCible?.avatar ? (
            <Avatar
              src={profilCible.avatar?.url}
              alt="Profil"
              onClick={() => navigate(`/Profilpublic/${profilCible._id}`)}
            />
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
        <HeaderActions>
          <CallButton onClick={startCall}>
            <FaPhoneAlt />
          </CallButton>
        </HeaderActions>
      </Header>

      <MessagesContainer
        ref={containerRef}
        onScroll={() => {
          if (containerRef.current.scrollTop < 50 && !loadingMore && hasMore) {
            loadMoreMessages();
          }
        }}
      >
        {loadingMore && (
          <LoadingMoreContainer>
            <LoadingSpinner />
          </LoadingMoreContainer>
        )}

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
                <SwipeContainer>
                  <ReplyIconVisible
                    $visible={(swipeOffsets[msg._id] || 0) > 40}
                  >
                    ↩
                  </ReplyIconVisible>
                  <MessageBubble
                    $mine={isMine}
                    style={{
                      transform: `translateX(${swipeOffsets[msg._id] || 0}px)`,
                      transition: "transform .15s ease",
                    }}
                    onTouchStart={(e) => {
                      debutAppuiLong(msg);
                      debutSwipeReponse(e);
                    }}
                    onTouchEnd={(e) => {
                      annulerAppuiLong();
                      finSwipeReponse(e, msg);
                    }}
                    onMouseDown={(e) => {
                      debutSwipeMouse(e);
                      debutAppuiLong(msg);
                    }}
                    onMouseUp={(e) => {
                      annulerAppuiLong();
                      finSwipeMouse(e, msg);
                    }}
                    onTouchMove={(e) => moveSwipeReponse(e, msg._id)}
                  >
                    {msg.type === "image" && msg.media?.url && (
                      <MessageImage
                        src={msg.media.url}
                        alt="message"
                        onClick={() => ouvrirmodal(msg)}
                      />
                    )}

                    {msg.type === "video" && msg.media?.url && (
                      <VideoWrapper>
                        <MessageVideo
                          ref={(el) => {
                            if (el) {
                              videoRefs.current[msg._id] = el;
                            }
                          }}
                          preload="metadata"
                          playsInline
                          poster={msg.media.thumbnail}
                          onClick={() => toggleVideo(msg._id)}
                          onPlay={() => setPlayingVideoId(msg._id)}
                          onPause={() => setPlayingVideoId(null)}
                          onEnded={() => setPlayingVideoId(null)}
                        >
                          <source
                            src={msg.media.url}
                            type={msg.media.mimetype}
                          />
                        </MessageVideo>

                        {(showControls[msg._id] ||
                          playingVideoId !== msg._id) && (
                          <PlayIcon
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleVideo(msg._id);
                            }}
                          >
                            {videoRefs.current[msg._id]?.paused ? (
                              <FaPlay />
                            ) : (
                              <FaPause />
                            )}
                          </PlayIcon>
                        )}

                        <ExpandButton
                          onClick={(e) => {
                            e.stopPropagation();
                            ouvrirmodal(msg);
                          }}
                        >
                          <FaExpand />
                        </ExpandButton>
                      </VideoWrapper>
                    )}

                    {msg.type === "audio" && msg.media?.url && (
                      <>
                        <audio
                          ref={(el) => {
                            if (el) {
                              audioRefs.current[msg._id] = el;
                            }
                          }}
                          onEnded={() => {
                            setPlayingAudioId(null);

                            setAudioProgress((prev) => ({
                              ...prev,
                              [msg._id]: 0,
                            }));

                            setAudioCurrentTime((prev) => ({
                              ...prev,
                              [msg._id]: 0,
                            }));

                            const audio = audioRefs.current[msg._id];

                            if (audio) {
                              audio.currentTime = 0;
                            }
                          }}
                          onTimeUpdate={(e) => {
                            const audio = e.target;

                            const progress =
                              (audio.currentTime / audio.duration) * 100;

                            const progressTime = Math.floor(audio.currentTime);

                            setAudioCurrentTime((prev) => ({
                              ...prev,
                              [msg._id]: progressTime,
                            }));

                            setAudioProgress((prev) => ({
                              ...prev,
                              [msg._id]: progress,
                            }));
                          }}
                          style={{
                            position: "absolute",
                            opacity: 0,
                            pointerEvents: "none",
                            width: 1,
                            height: 1,
                          }}
                        >
                          <source
                            src={msg.media.url}
                            type={msg.media.mimetype}
                          />
                        </audio>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "10px",
                            width: "100%",
                          }}
                        >
                          <button
                            onClick={() => toggleAudio(msg._id)}
                            style={{
                              width: "36px",
                              height: "36px",
                              borderRadius: "50%",
                              border: "none",
                              cursor: "pointer",

                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",

                              background: "#007BFF",
                              color: "white",

                              flexShrink: 0,
                            }}
                          >
                            {playingAudioId === msg._id ? (
                              <FaPause />
                            ) : (
                              <FaPlay />
                            )}
                          </button>

                          <ProgressBar
                            ref={(el) => {
                              if (el) {
                                progressRefs.current[msg._id] = el;
                              }
                            }}
                            onClick={(e) => {
                              seekAudio(e, msg._id);
                            }}
                          >
                            <ProgressFill
                              $progress={audioProgress[msg._id] || 0}
                            >
                              <ProgressThumb
                                onMouseDown={() => {
                                  setDraggingAudioId(msg._id);
                                }}
                              />
                            </ProgressFill>
                          </ProgressBar>

                          <span
                            style={{
                              fontSize: "15px",
                              whiteSpace: "nowrap",

                              flexShrink: 0,
                            }}
                          >
                            {formatAudioDuration(
                              audioCurrentTime[msg._id] || 0,
                            )}
                            {" / "}
                            {formatAudioDuration(
                              Math.floor(msg.media.duration || 0),
                            )}
                          </span>
                        </div>
                      </>
                    )}

                    {msg.reponseA && (
                      <ReplyMessageContainer>
                        <ReplyMessageText>
                          {msg.reponseA.contenu ||
                            (msg.reponseA.type === "image"
                              ? "📷 Image"
                              : msg.reponseA.type === "video"
                                ? "🎥 Vidéo"
                                : msg.reponseA.type === "audio"
                                  ? "🎤 Message vocal"
                                  : "Message")}
                        </ReplyMessageText>
                      </ReplyMessageContainer>
                    )}

                    {msg.type === "call" && (
                      <CallMessage>
                        <CallIcon $status={msg.call?.status}>
                          {msg.call?.status === "cancelled" && <FaPhoneSlash />}

                          {msg.call?.status === "rejected" && <FaPhoneSlash />}

                          {msg.call?.status === "missed" && <MdCallReceived />}

                          {msg.call?.status === "accepted" && <MdCallMade />}

                          {msg.call?.status === "ended" && <FaPhoneAlt />}
                        </CallIcon>

                        <CallInfos>
                          <CallTitle>
                            {msg.call?.status === "cancelled" && "Appel annulé"}

                            {msg.call?.status === "rejected" && "Appel refusé"}

                            {msg.call?.status === "missed" && "Appel manqué"}

                            {msg.call?.status === "accepted" && "Appel accepté"}

                            {msg.call?.status === "ended" && "Appel terminé"}
                          </CallTitle>

                          {msg.call?.duration > 0 && (
                            <CallDuration>
                              {formatRecordingTime(msg.call.duration)}
                            </CallDuration>
                          )}
                        </CallInfos>
                      </CallMessage>
                    )}
                    {msg.contenu && (
                      <MessageText $supprime>{msg.contenu} </MessageText>
                    )}

                    <MessageTime>
                      {msg.createdAt ? formatTime(msg.createdAt) : ""}
                      {isMine && (
                        <StatusWrapper>
                          {getStatutIcon(msg.statut)}
                        </StatusWrapper>
                      )}
                    </MessageTime>
                  </MessageBubble>
                </SwipeContainer>
              </MessageRow>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </MessagesContainer>

      {modal && (
        <MOdalcontain
          onClick={() => {
            if (!moved.current) {
              fermermodal();
            }
          }}
        >
          <Slider
            style={{
              transform: `translateX(-${currentIndex * 100}%)`,
            }}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
          >
            {medias.map((media) => (
              <Slide key={media._id}>
                {media.type === "image" ? (
                  <ModalImage src={media.media.url} />
                ) : (
                  <VideoWrapper onClick={(e) => e.stopPropagation()}>
                    <MessageVideo
                      ref={(el) => {
                        if (el) {
                          modalVideoRefs.current[media._id] = el;
                        }
                      }}
                      playsInline
                      preload="metadata"
                      poster={media.media.thumbnail}
                      onEnded={() => setPlayingModalVideoId(null)}
                    >
                      <source
                        src={media.media.url}
                        type={media.media.mimetype}
                      />
                    </MessageVideo>

                    {(showModalControls[media._id] ||
                      playingModalVideoId !== media._id) && (
                      <PlayIcon
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleModalVideo(media._id);
                        }}
                      >
                        {modalVideoRefs.current[media._id]?.paused ? (
                          <FaPlay />
                        ) : (
                          <FaPause />
                        )}
                      </PlayIcon>
                    )}
                  </VideoWrapper>
                )}
              </Slide>
            ))}
          </Slider>
        </MOdalcontain>
      )}

      {previewUrl && (
        <PreviewBox>
          <PreviewImageWrapper>
            {selectedFile?.type.startsWith("video") ? (
              <MessageVideo controls src={previewUrl} />
            ) : (
              <PreviewImage src={previewUrl} alt="preview" />
            )}
            <RemovePreview onClick={removeSelectedFile}>
              <FaTimes />
            </RemovePreview>
          </PreviewImageWrapper>
        </PreviewBox>
      )}

      {modalMessage && (
        <ModalOverlay onClick={fermerModalMessage}>
          <ModalBox onClick={(e) => e.stopPropagation()}>
            <ModalTitle>Actions du message</ModalTitle>

            <SelectedMessagePreview>
              {modalMessage.type === "text" || modalMessage.contenu
                ? modalMessage.contenu
                : modalMessage.type === "image"
                  ? "📷 Image"
                  : modalMessage.type === "video"
                    ? "🎥 Vidéo"
                    : modalMessage.type === "audio"
                      ? "🎤 Message vocal"
                      : "Message"}
            </SelectedMessagePreview>

            <ModalAction
              onClick={() => {
                navigator.clipboard.writeText(modalMessage.contenu || "");

                afficherNotification("Message copié");

                fermerModalMessage();
              }}
            >
              Copier
            </ModalAction>

            <ModalAction
              onClick={() => {
                supprimemoi(modalMessage._id);
                fermerModalMessage();
              }}
            >
              Supprimer pour moi
            </ModalAction>

            {modalMessage.expediteur === monProfilId && (
              <ModalAction
                onClick={() => {
                  supprimetous(modalMessage._id);
                  fermerModalMessage();
                }}
              >
                Supprimer pour tout le monde
              </ModalAction>
            )}

            <ModalCancel onClick={fermerModalMessage}>Annuler</ModalCancel>
          </ModalBox>
        </ModalOverlay>
      )}

      {messageRepondu && (
        <ReplyPreview>
          <ReplyContent>
            <ReplyLabel>
              Réponse à{" "}
              {messageRepondu.expediteur === monProfilId
                ? "vous"
                : profilCible?.pseudo || "lui/elle"}
            </ReplyLabel>

            <ReplyText>
              {messageRepondu.contenu ||
                (messageRepondu.type === "image"
                  ? "📷 Image"
                  : messageRepondu.type === "video"
                    ? "🎥 Vidéo"
                    : messageRepondu.type === "audio"
                      ? "🎤 Message vocal"
                      : "")}
            </ReplyText>
          </ReplyContent>

          <ReplyClose onClick={() => setMessageRepondu(null)}>
            <FaTimes />
          </ReplyClose>
        </ReplyPreview>
      )}

      {notification && <NotificationToast>{notification}</NotificationToast>}

      {isRecording && (
        <RecordingModal>
          <>
            <RecordingDot />

            <strong>REC • {formatRecordingTime(recordingTime)}</strong>

            <RecordingWave>
              {[...Array(12)].map((_, i) => (
                <WaveBar key={i} $delay={i * 0.08} />
              ))}
            </RecordingWave>

            <span>Relâchez pour envoyer</span>
          </>
        </RecordingModal>
      )}
      <InputContainer>
        {audioBlob ? (
          <>
            <audio
              ref={previewAudioRef}
              onTimeUpdate={(e) => {
                const audio = e.target;

                setPreviewCurrentTime(Math.floor(audio.currentTime));

                setPreviewProgress(
                  (audio.currentTime / audio.duration) * 100 || 0,
                );
              }}
              onEnded={() => {
                setIsPreviewPlaying(false);
                setPreviewCurrentTime(0);
                setPreviewProgress(0);
              }}
            >
              <source src={audioUrl} type="audio/webm" />
            </audio>
            <PreviewActions>
              <CircleAction $variant="delete" onClick={supprimerPreviewAudio}>
                <FaTrash />
              </CircleAction>

              <CircleAction $variant="play" onClick={togglePreviewAudio}>
                {isPreviewPlaying ? <FaPause /> : <FaPlay />}
              </CircleAction>

              <>
                <ProgressBar
                  ref={previewProgressRef}
                  onClick={seekPreviewAudio}
                >
                  <ProgressFill $progress={previewProgress}>
                    <ProgressThumb
                      onMouseDown={() => setDraggingPreview(true)}
                    />
                  </ProgressFill>
                </ProgressBar>

                <span>
                  {formatRecordingTime(previewCurrentTime)}
                  {" / "}
                  {formatRecordingTime(audioDuration)}
                </span>
              </>

              <CircleAction
                $variant="send"
                onClick={() => sendAudioMessage(audioBlob, audioDuration)}
              >
                <FaPaperPlane />
              </CircleAction>
            </PreviewActions>
          </>
        ) : (
          <>
            <IconButton htmlFor="file-upload">
              <FaImage />
            </IconButton>

            <FileInput
              id="file-upload"
              type="file"
              accept="image/*,video/*"
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
                  socket.emit("stopTyping", { to: id });
                }, 2000);
              }}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            />

            {newMessage.trim() || selectedFile ? (
              <SendButton onClick={sendMessage} disabled={sending}>
                <FaPaperPlane />
              </SendButton>
            ) : (
              <SendButton
                onPointerDown={startRecording}
                onPointerUp={stopRecording}
                onPointerLeave={stopRecording}
                onPointerCancel={stopRecording}
              >
                <FaMicrophone />
              </SendButton>
            )}
          </>
        )}
      </InputContainer>
    </Wrapper>
  );
}
export default Tchat;
