import { useNavigate, useLocation } from "react-router-dom";
import styled from "styled-components";
import { FaFire, FaCompass, FaComments, FaUser } from "react-icons/fa";
import { FaVideo } from "react-icons/fa";
import { useEffect, useState } from "react";
import { socket } from "../../socket";
const API_URL = import.meta.env.VITE_API_URL;
const FooterContainer = styled.footer`
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  background: rgba(255, 255, 255, 0.96);
  backdrop-filter: blur(12px);
  border-top: 1px solid #e5e7eb;
  display: flex;
  justify-content: space-around;
  align-items: center;
  padding: 12px 8px;
  z-index: 999;
  box-shadow: 0 -8px 24px rgba(31, 42, 68, 0.06);
`;

const NavItem = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  color: ${({ active }) => (active ? "#4f46e5" : "#6b7280")};
  font-size: 13px;
  font-weight: ${({ active }) => (active ? "700" : "500")};
  transition: 0.25s ease;
  padding: 8px 14px;
  border-radius: 16px;

  svg {
    font-size: 20px;
  }

  &:hover {
    transform: translateY(-2px);
    background: ${({ active }) =>
      active ? "rgba(79, 70, 229, 0.08)" : "rgba(0,0,0,0.03)"};
  }
`;

const MessageBadge = styled.span`
  position: absolute;
  top: -10px;
  right: -14px;

  min-width: 20px;
  height: 20px;

  padding: 0 5px;

  border-radius: 999px;

  display: flex;
  align-items: center;
  justify-content: center;

  background: #ef4444;
  color: white;

  font-size: 11px;
  font-weight: 700;

  border: 2px solid white;
`;
const MessageIconWrapper = styled.div`
  position: relative;
  display: flex;
`;

const UnreadBadge = styled.span`
  position: absolute;
  top: -8px;
  right: -10px;

  min-width: 18px;
  height: 18px;

  padding: 0 5px;

  border-radius: 999px;

  background: #ef4444;
  color: white;

  font-size: 11px;
  font-weight: 700;

  display: flex;
  align-items: center;
  justify-content: center;
`;

function FooterNav() {
  const navigate = useNavigate();
  const location = useLocation();
  const [unreadCount, setUnreadCount] = useState(0);
  const token = localStorage.getItem("token");

  const isActive = (path) => {
    if (path === "/") return location.pathname === "/";
    return location.pathname.startsWith(path);
  };

  useEffect(() => {
    const handleUnreadIncrement = ({ increment }) => {
      setUnreadCount((prev) => prev + increment);
    };

    socket.on("unreadMessageIncrement", handleUnreadIncrement);

    return () => {
      socket.off("unreadMessageIncrement", handleUnreadIncrement);
    };
  }, [socket]);
  useEffect(() => {
    const getUnreadCount = async () => {
      try {
        const res = await fetch(`${API_URL}/api/tchat/messages/non-lus/count`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();

        if (!res.ok) {
          console.error("❌ Erreur récupération compteur :", data.message);
          return;
        }

        setUnreadCount(data.count);
      } catch (error) {
        console.error("❌ Impossible de récupérer le compteur :", error);
      }
    };

    if (token) {
      getUnreadCount();
    }
  }, [token]);

  useEffect(() => {
    const handleNewMessage = (message) => {
      if (location.pathname.startsWith("/conversations")) {
        return;
      }

      setUnreadCount((prev) => prev + 1);
    };

    socket.on("newMessage", handleNewMessage);

    return () => {
      socket.off("newMessage", handleNewMessage);
    };
  }, [location.pathname]);
  return (
    <FooterContainer>
      <NavItem active={isActive("/matchs")} onClick={() => navigate("/matchs")}>
        <FaFire />
        <span>Matchs</span>
      </NavItem>

      <NavItem
        active={isActive("/decouverte")}
        onClick={() => navigate("/decouverte")}
      >
        <FaCompass />
        <span>Découverte</span>
      </NavItem>

      <NavItem
        active={isActive("/conversations")}
        onClick={() => {
          setUnreadCount(0);
          navigate("/conversations");
        }}
      >
        <MessageIconWrapper>
          <FaComments />

          {unreadCount > 0 && (
            <UnreadBadge>{unreadCount > 99 ? "99+" : unreadCount}</UnreadBadge>
          )}
        </MessageIconWrapper>

        <span>Messages</span>
      </NavItem>

      <NavItem
        active={isActive("/publicdeo")}
        onClick={() => navigate("/publicdeo")}
      >
        <FaVideo />
        <span>Vidéos</span>
      </NavItem>

      <NavItem active={isActive("/")} onClick={() => navigate("/")}>
        <FaUser />
        <span>Profil</span>
      </NavItem>
    </FooterContainer>
  );
}

export default FooterNav;
