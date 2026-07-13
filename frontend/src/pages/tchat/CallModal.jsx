import { FaPhone, FaPhoneSlash, FaUserCircle } from "react-icons/fa";

import styled from "styled-components";

const CallModalOverlay = styled.div`
  position: fixed;
  inset: 0;
  z-index: 999999;

  background: linear-gradient(180deg, #0f172a, #1e293b);

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  color: white;
`;

const CallModalAvatar = styled.div`
  width: 140px;
  height: 140px;

  border-radius: 50%;
  overflow: hidden;

  background: rgba(255, 255, 255, 0.08);

  display: flex;
  align-items: center;
  justify-content: center;

  box-shadow: 0 15px 45px rgba(0, 0, 0, 0.35);

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  svg {
    font-size: 120px;
    color: #cbd5e1;
  }
`;

const CallModalName = styled.h2`
  margin-top: 24px;
  margin-bottom: 8px;

  font-size: 28px;
  font-weight: 700;
`;

const CallModalStatus = styled.p`
  margin: 0;

  color: #cbd5e1;
  font-size: 17px;
`;

const CallModalActions = styled.div`
  margin-top: 60px;

  display: flex;
  align-items: center;
  gap: 28px;
`;

const CallActionButton = styled.button`
  width: 72px;
  height: 72px;

  border: none;
  border-radius: 50%;

  cursor: pointer;

  display: flex;
  align-items: center;
  justify-content: center;

  font-size: 26px;

  color: white;

  background: ${({ $type }) => {
    if ($type === "accept") return "#22c55e";
    if ($type === "reject") return "#ef4444";
    return "#3b82f6";
  }};

  transition: 0.2s;

  &:hover {
    transform: scale(1.08);
  }

  &:active {
    transform: scale(0.95);
  }
`;

const CallPulse = styled.div`
  position: absolute;

  width: 180px;
  height: 180px;

  border-radius: 50%;

  border: 2px solid rgba(255, 255, 255, 0.12);

  animation: pulse 2s infinite;

  @keyframes pulse {
    from {
      transform: scale(0.9);
      opacity: 1;
    }

    to {
      transform: scale(1.4);
      opacity: 0;
    }
  }
`;

const CallAvatarWrapper = styled.div`
  position: relative;

  display: flex;
  align-items: center;
  justify-content: center;
`;

function CallModal({
  open,
  incoming,
  calling,
  inCall,
  profilCible,
  onAccept,
  onReject,
  onCancel,
}) {
  if (!open) return null;

  return (
    <CallModalOverlay>
      <CallAvatarWrapper>
        <CallPulse />

        <CallModalAvatar>
          {profilCible?.avatar ? (
            <img src={profilCible.avatar.url} alt={profilCible.pseudo} />
          ) : (
            <FaUserCircle />
          )}
        </CallModalAvatar>
      </CallAvatarWrapper>

      <CallModalName>{profilCible?.pseudo}</CallModalName>

      <CallModalStatus>
        {incoming
          ? "📞 Appel entrant..."
          : inCall
            ? "🟢 Appel en cours"
            : "📞 Appel audio..."}
      </CallModalStatus>

      <CallModalActions>
        {incoming ? (
  <>
    <CallActionButton
      $type="reject"
      onClick={onReject}
    >
      <FaPhoneSlash />
    </CallActionButton>

    <CallActionButton
      $type="accept"
      onClick={onAccept}
    >
      <FaPhone />
    </CallActionButton>
  </>
) : (
  <CallActionButton
    $type="reject"
    onClick={onCancel}
  >
    <FaPhoneSlash />
  </CallActionButton>
)}
      </CallModalActions>
    </CallModalOverlay>
  );
}

export default CallModal;
