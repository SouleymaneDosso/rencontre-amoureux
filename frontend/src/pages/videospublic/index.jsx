import styled from "styled-components";
import { useState, useEffect } from "react";
const API_URL = import.meta.env.VITE_API_URL;


const Page = styled.div`
  width: 100%;
  height: 100vh;
  overflow-y: scroll;
  scroll-snap-type: y mandatory;
  background: black;
  margin-bottom: 57px;
`;

const VideoContainer = styled.div`
  position: relative;
  width: 100%;
  height: 100vh;
  scroll-snap-align: start;
  display: flex;
  justify-content: center;
  align-items: center;
  
`;

const Video = styled.video`
  width: 100%;
  height: 100%;
  object-fit: cover;
  
`;

const Overlay = styled.div`
  position: absolute;
  bottom: 20px;
  left: 15px;
  color: white;
  z-index: 2;
`;

const RightPanel = styled.div`
  position: absolute;
  right: 10px;
  bottom: 80px;
  display: flex;
  flex-direction: column;
  gap: 20px;
  z-index: 2;
`;

const Button = styled.div`
  background: rgba(0,0,0,0.5);
  padding: 10px;
  border-radius: 50%;
  text-align: center;
`;


function Videopublic() {
  const [videos, setvideos] = useState([]);

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
      } catch (error) {
        alert(error.message);
      }
    };

    getdeopublic();
  }, []);

  return (
    <Page>
      {videos.map((deo, index) => (
        <VideoContainer key={index}>
          
          <Video
            src={deo.url}
            autoPlay
            muted
            loop
            playsInline
          />

          {/* Texte bas gauche */}
          <Overlay>
            <p>@user_{index}</p>
            <p>Description de la vidéo 🔥</p>
          </Overlay>

          {/* Boutons droite */}
          <RightPanel>
            <Button>❤️</Button>
            <Button>💬</Button>
            <Button>↗️</Button>
          </RightPanel>

        </VideoContainer>
      ))}
    </Page>
  );
}
export default Videopublic;
