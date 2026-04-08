import { useNavigate, useLocation } from "react-router-dom";
import styled from "styled-components";
import { FaHome, FaCompass, FaComments, FaUser } from "react-icons/fa";

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

function FooterNav() {
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path) => {
    if (path === "/") return location.pathname === "/";
    return location.pathname.startsWith(path);
  };

  return (
    <FooterContainer>
      <NavItem active={isActive("/matchs")} onClick={() => navigate("/matchs")}>
        <FaHome />
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
        onClick={() => navigate("/conversations")}
      >
        <FaComments />
        <span>Messages</span>
      </NavItem>

      <NavItem active={isActive("/")} onClick={() => navigate("/")}>
        <FaUser />
        <span>Profil</span>
      </NavItem>
    </FooterContainer>
  );
}

export default FooterNav;