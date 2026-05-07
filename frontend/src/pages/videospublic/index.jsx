import styled from "styled-components";
import { useState, useEffect } from "react";
const API_URL = import.meta.env.VITE_API_URL;
import { FaHeart, FaCommentDots, FaShare } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const Page = styled.div`
  position: fixed;
  inset: 0;

  width: 100vw;
  height: calc(var(--vh) * 100);

  overflow-y: scroll;
  scroll-snap-type: y mandatory;

  background: black;
`;

const VideoContainer = styled.div`
  width: 100%;
  height: 100vh;
  position: relative;
  overflow: hidden;
`;

const Video = styled.video`
  width: 100%;
  height: 100%;
  object-fit: cover;

  /* 🔥 évite les bugs d'affichage */
  display: block;

  /* 🔥 force rendu GPU (important mobile) */
  transform: translateZ(0);
`;

const Overlay = styled.div`
  position: absolute;
  bottom: calc(7px + env(safe-area-inset-bottom));
  left: 15px;
  color: white;
  z-index: 2;
`;

const RightPanel = styled.div`
  position: absolute;
  right: 10px;
  bottom: calc(100px + env(safe-area-inset-bottom));
  display: flex;
  flex-direction: column;
  gap: 25px;
  z-index: 2;
`;

const ActionButton = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  color: white;
  cursor: pointer;

  svg {
    font-size: 28px;
    background: rgba(0, 0, 0, 0.4);
    padding: 12px;
    border-radius: 50%;
    transition: all 0.2s ease;
  }

  &:hover svg {
    transform: scale(1.15);
    background: rgba(255, 255, 255, 0.2);
  }

  span {
    font-size: 12px;
    margin-top: 5px;
  }
`;

const Boutonretour = styled.button`
  display: flex;
  text-align: center;
  z-index: 2;
  position: absolute;
  left: 5px;
  top: 13px;
  border: none;
  background: none;
  color: white;
  font-size: 15px;
`;

function Videopublic() {
  const [videos, setvideos] = useState([]);

  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  useEffect(() => {
    const getdeopublic = async () => {
      try {
        const res = await fetch(`${API_URL}/api/clients/videos/public`);
        const data = await res.json();

        if (!res.ok) {
          alert(data.message);
          return;
        }

        setvideos(data || []);
        console.log("VIDEOS BACKEND :", data);
      } catch (error) {
        alert(error.message);
      }
    };

    getdeopublic();
  }, []);

  const handleLike = async (videoId) => {
    try {
      const res = await fetch(`${API_URL}/api/clients/likes/${videoId}`, {
        method: "PUT",
        headers: {
          authorization: `bearer ${token}`,
        },
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message);
        return;
      }
      setvideos((prev) =>
        prev.map((v) =>
          v._id === videoId
            ? {
                ...v,
                likes: Array(data.totalLikes).fill(0),
              }
            : v,
        ),
      );
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <Page>
      {videos.map((deo, index) => (
        <VideoContainer key={index}>
          <Video src={deo.url} muted loop playsInline autoPlay controls />
          <Boutonretour onClick={() => navigate(-1)}>Retour</Boutonretour>
        
          <Overlay>
            <p>@user_{index}</p>
            <p>Description de la vidéo 🔥</p>
          </Overlay>
          <RightPanel>
            <ActionButton>
              <FaHeart onClick={() => handleLike(deo._id, index)} />

              <span>{deo.likes?.length || 0}</span>
            </ActionButton>

            <ActionButton>
              <FaCommentDots />
              <span>320</span>
            </ActionButton>

            <ActionButton>
              <FaShare />
              <span>Partager</span>
            </ActionButton>
          </RightPanel>
        </VideoContainer>
      ))}
    </Page>
  );
}
export default Videopublic;
