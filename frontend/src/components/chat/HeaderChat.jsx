import styled from "styled-components";

import {
  FaArrowLeft,
  FaPhoneAlt,
  FaUserCircle,
  FaCircle,
} from "react-icons/fa";

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

  background: #22c55e;
  color: white;

  cursor: ${({ disabled }) => (disabled ? "not-allowed" : "pointer")};

  opacity: ${({ disabled }) => (disabled ? 0.5 : 1)};

  transition: 0.2s;

  &:hover {
    transform: ${({ disabled }) => (disabled ? "none" : "scale(1.08)")};
  }
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

function HeaderChat({
  navigate,
  profilCible,
  isTyping,
  isProfilCibleOnline,
  startCall,
  calling,
  incomingCall,
  inCall,
}) {
  return (
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
        <CallButton
          disabled={calling || incomingCall || inCall}
          onClick={startCall}
        >
          <FaPhoneAlt />
        </CallButton>
      </HeaderActions>
    </Header>
  );
}

export default HeaderChat;
