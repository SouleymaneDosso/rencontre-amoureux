import styled from "styled-components";
import { useState, useEffect } from "react";
const API_URL = import.meta.env.VITE_API_URL;
import { FaHeart, FaCommentDots, FaShare } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const Page = styled.div`
  position: fixed;
  top: 0;
  left: 0;

  width: 100vw;
  height: 100svh;

  overflow-y: scroll;

  scroll-snap-type: y mandatory;
  scroll-behavior: smooth;

  overscroll-behavior-y: contain;

  background: black;

  scrollbar-width: none;
  &::-webkit-scrollbar {
    display: none;
  }
`;

const VideoContainer = styled.div`
  position: relative;
  width: 100%;
  height: 100svh;
  scroll-snap-align: start;
  scroll-snap-stop: always;
  overflow: hidden;
`;

const Video = styled.video`
  width: 100%;
  height: 100%;
  object-fit: cover;
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
  const [likes, setLikes] = useState([]);

  const navigate = useNavigate();

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
        setLikes(new Array(data.length).fill(0));
      } catch (error) {
        alert(error.message);
      }
    };

    getdeopublic();
  }, []);

  const handleLike = (index) => {
    setLikes((prev) => {
      const updated = [...prev];
      updated[index] += 1;
      return updated;
    });
  };

  return (
    <Page>
      {videos.map((deo, index) => (
        <VideoContainer key={index}>
          <Video src={deo.url} autoPlay muted loop playsInline />
          <Boutonretour onClick={() => navigate(-1)}>Retour</Boutonretour>
          {/* Texte bas gauche */}
          <Overlay>
            <p>@user_{index}</p>
            <p>Description de la vidéo 🔥</p>
          </Overlay>

          {/* Boutons droite */}
          <RightPanel>
            <ActionButton>
              <FaHeart onClick={() => handleLike(index)} />
              <span>{likes[index]}</span>
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
