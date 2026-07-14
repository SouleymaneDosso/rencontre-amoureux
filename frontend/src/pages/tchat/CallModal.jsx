import {
  FaPhone,
  FaPhoneSlash,
  FaUserCircle,
  FaMicrophone,
  FaMicrophoneSlash,
} from "react-icons/fa";
import { FaMinus } from "react-icons/fa";
import styled from "styled-components";

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
     if ($type === "default") return "#334155";
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
const MiniCallBar = styled.div`
  position: fixed;

  top: 12px;
  left: 50%;

  transform: ${({ $show }) =>
    $show ? "translate(-50%,0)" : "translate(-50%,-40px)"};

  opacity: ${({ $show }) => ($show ? 1 : 0)};

  pointer-events: ${({ $show }) => ($show ? "auto" : "none")};

  transition: all 0.28s ease;

  width: 340px;
  max-width: calc(100vw - 20px);

  background: rgba(15, 23, 42, 0.95);
  backdrop-filter: blur(14px);

  border-radius: 18px;

  padding: 12px 16px;

  display: flex;
  align-items: center;
  justify-content: space-between;

  color: white;

  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.35);

  cursor: pointer;

  z-index: 999999;
`;
const MiniDuration = styled.div`
  font-size: 18px;
  font-weight: 700;

  color: #22c55e;

  min-width: 56px;

  text-align: right;
`;
const MiniRight = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;
const MinimizeButton = styled.button`
  position: absolute;
  top: 18px;
  right: 18px;

  width: 42px;
  height: 42px;

  border: none;
  border-radius: 50%;

  background: rgba(255, 255, 255, 0.08);
  backdrop-filter: blur(10px);

  color: white;

  display: flex;
  align-items: center;
  justify-content: center;

  cursor: pointer;

  transition: 0.25s;

  &:hover {
    background: rgba(255, 255, 255, 0.18);
    transform: scale(1.08);
  }
`;

const MiniLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const MiniAvatar = styled(CallModalAvatar)`
  width: 42px;
  height: 42px;

  svg {
    font-size: 42px;
  }
`;

const MiniInfos = styled.div`
  display: flex;
  flex-direction: column;
`;
const MiniEndButton = styled.button`
  width: 42px;
  height: 42px;

  border: none;
  border-radius: 50%;

  background: #ef4444;
  color: white;

  display: flex;
  align-items: center;
  justify-content: center;

  cursor: pointer;

  transition: 0.2s;

  &:hover {
    transform: scale(1.08);
    background: #dc2626;
  }

  &:active {
    transform: scale(0.95);
  }
`;
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

  transition: 0.28s ease;

  opacity: ${({ $minimized }) => ($minimized ? 0 : 1)};

  transform: ${({ $minimized }) => ($minimized ? "scale(.92)" : "scale(1)")};

  pointer-events: ${({ $minimized }) => ($minimized ? "none" : "auto")};
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
  callDuration,
  isMinimized,
  minimizeCall,
  maximizeCall,
  isMuted,
  toggleMute,
}) {
  if (!open) return null;
  const minutes = String(Math.floor(callDuration / 60)).padStart(2, "0");

  const seconds = String(callDuration % 60).padStart(2, "0");

  const formattedDuration = `${minutes}:${seconds}`;

  return (
    <>
      <MiniCallBar $show={isMinimized} onClick={maximizeCall}>
        <MiniLeft>
          <MiniAvatar>
            {profilCible?.avatar ? (
              <img src={profilCible.avatar.url} alt={profilCible.pseudo} />
            ) : (
              <FaUserCircle />
            )}
          </MiniAvatar>

          <MiniInfos>
            <strong>{profilCible?.pseudo}</strong>
            <small>Appel en cours</small>
          </MiniInfos>
        </MiniLeft>

        <MiniRight>
          <MiniDuration>{formattedDuration}</MiniDuration>

          <MiniEndButton
            onClick={(e) => {
              e.stopPropagation();
              onCancel();
            }}
          >
            <FaPhoneSlash />
          </MiniEndButton>
        </MiniRight>
      </MiniCallBar>

      <CallModalOverlay $minimized={isMinimized}>
        <MinimizeButton onClick={minimizeCall}>
          <FaMinus size={14} />
        </MinimizeButton>
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
              ? `${formattedDuration}`
              : "📞 Appel audio..."}
        </CallModalStatus>

        <CallModalActions>
          {incoming ? (
            <>
              <CallActionButton $type="reject" onClick={onReject}>
                <FaPhoneSlash />
              </CallActionButton>

              <CallActionButton $type="accept" onClick={onAccept}>
                <FaPhone />
              </CallActionButton>
            </>
          ) : (
               <>
      {inCall && (
        <CallActionButton $type="default" onClick={toggleMute}>
          {isMuted ? <FaMicrophoneSlash /> : <FaMicrophone />}
        </CallActionButton>
      )}
            <CallActionButton $type="reject" onClick={onCancel}>
              <FaPhoneSlash />
            </CallActionButton>
            </>
          )}
        </CallModalActions>
      </CallModalOverlay>
    </>
  );
}

export default CallModal;
