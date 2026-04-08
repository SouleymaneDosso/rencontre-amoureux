import { useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import styled from "styled-components";
import {
  FaHeart,
  FaBars,
  FaTimes,
  FaUser,
  FaCompass,
  FaComments,
  FaFire,
} from "react-icons/fa";

const HeaderShell = styled.header`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 1200;
  padding: 14px 18px;
  display: flex;
  justify-content: center;

  @media (max-width: 640px) {
    padding: 12px;
  }
`;

const Nav = styled.nav`
  width: 100%;
  max-width: 1380px;
  min-height: 78px;
  border-radius: 28px;
  padding: 0 22px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: relative;
  overflow: hidden;

  background: rgba(255, 255, 255, 0.78);
  backdrop-filter: blur(18px);
  -webkit-backdrop-filter: blur(18px);
  border: 1px solid rgba(255, 255, 255, 0.55);

  box-shadow:
    0 10px 35px rgba(79, 108, 255, 0.10),
    0 6px 18px rgba(31, 42, 68, 0.06);

  @media (max-width: 768px) {
    min-height: 72px;
    border-radius: 24px;
    padding: 0 16px;
  }
`;

const Glow = styled.div`
  position: absolute;
  width: 180px;
  height: 180px;
  border-radius: 50%;
  filter: blur(70px);
  opacity: 0.22;
  pointer-events: none;
  z-index: 0;
`;

const GlowLeft = styled(Glow)`
  top: -70px;
  left: -50px;
  background: #8b5cf6;
`;

const GlowRight = styled(Glow)`
  bottom: -90px;
  right: -60px;
  background: #ec4899;
`;

const LogoArea = styled.div`
  position: relative;
  z-index: 2;
  flex-shrink: 0;
`;

const LogoLink = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 10px;
  text-decoration: none;
  transition: transform 0.25s ease;

  &:hover {
    transform: translateY(-1px) scale(1.01);
  }
`;

const LogoIcon = styled.div`
  width: 42px;
  height: 42px;
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 1rem;
  background: linear-gradient(135deg, #ff5ea8, #8b5cf6);
  box-shadow: 0 10px 24px rgba(236, 72, 153, 0.28);
`;

const LogoText = styled.span`
  font-size: 1.45rem;
  font-weight: 800;
  letter-spacing: -0.5px;
  background: linear-gradient(90deg, #4f6cff, #7c3aed, #ec4899);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;

  @media (max-width: 480px) {
    font-size: 1.15rem;
  }
`;

const DesktopMenu = styled.ul`
  list-style: none;
  display: flex;
  align-items: center;
  gap: 12px;
  margin: 0;
  padding: 0;
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  z-index: 2;

  @media (max-width: 1080px) {
    display: none;
  }
`;

const MenuItem = styled(Link)`
  text-decoration: none;
  color: ${({ $active }) => ($active ? "#4f6cff" : "#475569")};
  background: ${({ $active }) =>
    $active ? "rgba(79, 108, 255, 0.12)" : "transparent"};
  padding: 12px 18px;
  border-radius: 999px;
  font-size: 0.96rem;
  font-weight: 700;
  transition: all 0.25s ease;
  display: inline-flex;
  align-items: center;
  gap: 8px;

  &:hover {
    color: #4f6cff;
    background: rgba(79, 108, 255, 0.08);
    transform: translateY(-1px);
  }
`;

const DesktopActions = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  z-index: 2;

  @media (max-width: 1080px) {
    display: none;
  }
`;

const GhostButton = styled.button`
  border: 1px solid rgba(79, 108, 255, 0.16);
  background: rgba(255, 255, 255, 0.7);
  color: #4f6cff;
  padding: 12px 18px;
  border-radius: 999px;
  font-size: 0.95rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.25s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 10px 24px rgba(79, 108, 255, 0.12);
  }
`;

const PrimaryButton = styled.button`
  border: none;
  background: linear-gradient(135deg, #4f6cff, #8b5cf6, #ec4899);
  color: white;
  padding: 12px 18px;
  border-radius: 999px;
  font-size: 0.95rem;
  font-weight: 700;
  cursor: pointer;
  box-shadow: 0 12px 28px rgba(79, 108, 255, 0.25);
  transition: all 0.25s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 16px 34px rgba(79, 108, 255, 0.32);
  }
`;

const BurgerButton = styled.button`
  z-index: 2;
  display: none;
  width: 52px;
  height: 52px;
  border: none;
  border-radius: 18px;
  background: rgba(255, 255, 255, 0.72);
  cursor: pointer;
  box-shadow: 0 8px 20px rgba(31, 42, 68, 0.08);
  color: #334155;
  font-size: 1.15rem;
  transition: all 0.25s ease;

  &:hover {
    transform: scale(1.03);
  }

  @media (max-width: 1080px) {
    display: flex;
    align-items: center;
    justify-content: center;
  }
`;

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(15, 23, 42, 0.45);
  backdrop-filter: blur(4px);
  opacity: ${({ $open }) => ($open ? 1 : 0)};
  visibility: ${({ $open }) => ($open ? "visible" : "hidden")};
  pointer-events: ${({ $open }) => ($open ? "auto" : "none")};
  transition: all 0.3s ease;
  z-index: 1198;
`;

const MobileMenu = styled.aside`
  position: fixed;
  top: 14px;
  right: 14px;
  width: min(92vw, 380px);
  height: calc(100vh - 28px);
  z-index: 1199;
  border-radius: 28px;
  padding: 24px 20px;
  background: rgba(255, 255, 255, 0.88);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.55);
  box-shadow: 0 24px 60px rgba(15, 23, 42, 0.22);

  display: flex;
  flex-direction: column;
  justify-content: space-between;

  transform: ${({ $open }) =>
    $open ? "translateX(0)" : "translateX(110%)"};
  opacity: ${({ $open }) => ($open ? 1 : 0)};
  transition: all 0.35s ease;

  @media (min-width: 1081px) {
    display: none;
  }

  @media (max-width: 640px) {
    width: calc(100vw - 24px);
    height: calc(100vh - 24px);
    top: 12px;
    right: 12px;
    border-radius: 24px;
  }
`;

const MobileTop = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const MobileBrand = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const CloseMobile = styled.button`
  width: 46px;
  height: 46px;
  border: none;
  border-radius: 16px;
  background: rgba(15, 23, 42, 0.06);
  font-size: 1.1rem;
  cursor: pointer;
  transition: 0.25s ease;

  &:hover {
    transform: rotate(90deg);
  }
`;

const MobileLinks = styled.div`
  display: flex;
  flex-direction: column;
  gap: 14px;
  margin-top: 20px;
  flex: 1;
  justify-content: center;
`;

const MobileLink = styled(Link)`
  text-decoration: none;
  color: ${({ $active }) => ($active ? "#4f6cff" : "#334155")};
  background: ${({ $active }) =>
    $active ? "rgba(79, 108, 255, 0.08)" : "rgba(255,255,255,0.6)"};
  padding: 16px 18px;
  border-radius: 18px;
  font-size: 1.08rem;
  font-weight: 700;
  display: flex;
  align-items: center;
  gap: 12px;
  transition: all 0.25s ease;

  &:hover {
    transform: translateX(4px);
    color: #4f6cff;
    background: rgba(79, 108, 255, 0.08);
  }
`;

const MobileActions = styled.div`
  display: flex;
  flex-direction: column;
  gap: 14px;
`;

const MobileActionButton = styled.button`
  width: 100%;
  border: ${({ $variant }) =>
    $variant === "ghost" ? "1px solid rgba(79, 108, 255, 0.16)" : "none"};
  background: ${({ $variant }) =>
    $variant === "ghost"
      ? "rgba(255,255,255,0.7)"
      : "linear-gradient(135deg, #4f6cff, #8b5cf6, #ec4899)"};
  color: ${({ $variant }) => ($variant === "ghost" ? "#4f6cff" : "white")};
  padding: 14px 18px;
  border-radius: 18px;
  font-size: 0.98rem;
  font-weight: 700;
  cursor: pointer;
  box-shadow: ${({ $variant }) =>
    $variant === "ghost"
      ? "none"
      : "0 12px 28px rgba(79, 108, 255, 0.24)"};
  transition: all 0.25s ease;

  &:hover {
    transform: translateY(-2px);
  }
`;

function Header() {
  const [isOpen, setOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const deconnexion = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    navigate("/connexion");
  };

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "auto";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isOpen]);

  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

  const isActive = (path) => {
    if (path === "/") return location.pathname === "/";
    return location.pathname.startsWith(path);
  };

  return (
    <>
      <HeaderShell>
        <Nav>
          <GlowLeft />
          <GlowRight />

          <LogoArea>
            <LogoLink to="/">
              <LogoIcon>
                <FaHeart />
              </LogoIcon>
              <LogoText>BabiTendre</LogoText>
            </LogoLink>
          </LogoArea>

          <DesktopMenu>
            <li>
              <MenuItem to="/profil" $active={isActive("/profil")}>
                <FaUser />
                Profil
              </MenuItem>
            </li>
            <li>
              <MenuItem to="/decouverte" $active={isActive("/decouverte")}>
                <FaCompass />
                Découverte
              </MenuItem>
            </li>
            <li>
              <MenuItem
                to="/conversations"
                $active={isActive("/conversations")}
              >
                <FaComments />
                Messages
              </MenuItem>
            </li>
            <li>
              <MenuItem to="/matchs" $active={isActive("/matchs")}>
                <FaFire />
                Matchs
              </MenuItem>
            </li>
          </DesktopMenu>

          <DesktopActions>
            <GhostButton onClick={() => navigate("/profil")}>
              Mon espace
            </GhostButton>
            <PrimaryButton onClick={deconnexion}>
              Déconnexion
            </PrimaryButton>
          </DesktopActions>

          <BurgerButton onClick={() => setOpen((prev) => !prev)}>
            {isOpen ? <FaTimes /> : <FaBars />}
          </BurgerButton>
        </Nav>
      </HeaderShell>

      <Overlay $open={isOpen} onClick={() => setOpen(false)} />

      <MobileMenu $open={isOpen}>
        <div>
          <MobileTop>
            <MobileBrand>
              <LogoIcon>
                <FaHeart />
              </LogoIcon>
              <LogoText>BabiTendre</LogoText>
            </MobileBrand>

            <CloseMobile onClick={() => setOpen(false)}>
              <FaTimes />
            </CloseMobile>
          </MobileTop>

          <MobileLinks>
            <MobileLink to="/profil" $active={isActive("/profil")}>
              <FaUser />
              Profil
            </MobileLink>

            <MobileLink to="/decouverte" $active={isActive("/decouverte")}>
              <FaCompass />
              Découverte
            </MobileLink>

            <MobileLink
              to="/conversations"
              $active={isActive("/conversations")}
            >
              <FaComments />
              Messages
            </MobileLink>

            <MobileLink to="/matchs" $active={isActive("/matchs")}>
              <FaFire />
              Matchs
            </MobileLink>
          </MobileLinks>
        </div>

        <MobileActions>
          <MobileActionButton
            $variant="ghost"
            onClick={() => navigate("/profil")}
          >
            Mon espace
          </MobileActionButton>

          <MobileActionButton onClick={deconnexion}>
            Déconnexion
          </MobileActionButton>
        </MobileActions>
      </MobileMenu>
    </>
  );
}

export default Header;