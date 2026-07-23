import styled from "styled-components";
import { useState, useEffect } from "react";
import { FaTrash } from "react-icons/fa";
import { FaHeart, FaCommentDots } from "react-icons/fa";
import { useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FaArrowLeft } from "react-icons/fa";
import { FaPlay, FaPause, FaVolumeMute, FaVolumeUp } from "react-icons/fa";
import { FaPlus } from "react-icons/fa";
const API_URL = import.meta.env.VITE_API_URL;

/* ================== STYLES ================== */

const Pagewrapper = styled.div`
  position: fixed;
  inset: 0;

  background: #000;

  overflow-y: auto;
  overflow-x: hidden;

  scroll-snap-type: y mandatory;

  scrollbar-width: none;

  &::-webkit-scrollbar {
    display: none;
  }
`;

const Header = styled.div`
  position: fixed;

  top: 0;
  left: 0;
  right: 0;

  height: 70px;

  display: flex;
  justify-content: space-between;
  align-items: center;

  padding: 0 25px;

  z-index: 500;

  background: linear-gradient(to bottom, rgba(0, 0, 0, 0.75), transparent);

  backdrop-filter: blur(15px);
`;

const LeftHeader = styled.div``;

const UploadButton = styled.label`
  position: fixed;

  top: 20px;
  right: 16px;

  width: 46px;
  height: 46px;

  border-radius: 50%;

  display: flex;
  justify-content: center;
  align-items: center;

  cursor: pointer;

  background: linear-gradient(135deg, #7c3aed, #ec4899);

  color: white;

  z-index: 1000;

  box-shadow: 0 10px 30px rgba(236, 72, 153, 0.4);

  svg {
    font-size: 22px;
  }
`;

const Feed = styled.div`
  width: 100%;
`;

const VideoSection = styled.div`
  position: relative;

  width: 100vw;

  height: 100vh;

  scroll-snap-align: start;

  background: black;

  overflow: hidden;
`;

const Overlay = styled.div`
  position: absolute;

  inset: 0;

  display: flex;

  justify-content: space-between;

  padding: 25px;

  background: linear-gradient(to top, rgba(0, 0, 0, 0.85), transparent 35%);
`;

const RightPanel = styled.div`
  position: absolute;

  right: 14px;

  bottom: 110px;

  display: flex;

  flex-direction: column;

  gap: 24px;

  z-index: 30;
`;

const Videos = styled.video`
  position: absolute;

  inset: 0;

  width: 100%;
  height: 100%;

  object-fit: cover;
`;

const Bouton = styled.button`
  margin-top: 10px;
  width: 100%;
  padding: 10px;
  border-radius: 12px;
  border: none;
  font-weight: bold;
  cursor: pointer;

  background: linear-gradient(90deg, #ff6ec4, #7873f5);
  color: white;

  box-shadow: 0 0 15px rgba(255, 110, 196, 0.5);

  transition: 0.3s;

  &:hover {
    transform: scale(1.05);
    box-shadow: 0 0 25px rgba(255, 110, 196, 0.9);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;
const TopInfo = styled.div`
  font-size: 14px;
  font-weight: bold;
`;

const Description = styled.p`
  font-size: 15px;

  line-height: 1.6;

  font-weight: 500;

  color: white;
`;

const IconBox = styled.div`
  display: flex;
  color: white;

  flex-direction: column;

  align-items: center;

  gap: 8px;

  svg {
    font-size: 28px;

    transition: 0.3s;
  }

  &:hover svg {
    transform: scale(1.25);

    color: #ec4899;
  }

  span {
    font-weight: 700;
  }
`;

const Badge = styled.div`
  display: inline-flex;

  padding: 8px 14px;

  border-radius: 999px;

  font-weight: 700;

  background: rgba(255, 255, 255, 0.15);

  backdrop-filter: blur(15px);

  margin-bottom: 18px;
`;

const BackButton = styled.button`
  position: fixed;

  top: 20px;
  left: 16px;

  width: 46px;
  height: 46px;

  border-radius: 50%;

  border: none;

  background: rgba(0, 0, 0, 0.35);

  backdrop-filter: blur(20px);

  color: white;

  z-index: 1000;
`;

const ModalOverlay = styled.div`
  position: fixed;
  inset: 0;
  background: black;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
`;

const ModalVideo = styled.video`
  position: absolute;
  inset: 0;

  width: 100%;
  height: 100%;

  object-fit: cover;
`;

const ModalInfo = styled.div`
  position: absolute;
  bottom: 30px;
  left: 15px;
  right: 15px;

  color: white;
  z-index: 2;
`;

const ModalActions = styled.div`
  position: absolute;
  right: 10px;
  bottom: 120px;

  display: flex;
  flex-direction: column;
  gap: 20px;
  align-items: center;

  z-index: 2;
`;

const Boutonfermer = styled.button`
  position: absolute;
  z-index: 1;
  display: flex;
  background: none;
  border: none;
  color: white;
  font-size: 24px;
  right: 0;
  padding: 12px;
`;

const CenterIcon = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 70px;
  color: white;
  z-index: 3;
  pointer-events: none;

  animation: fade 0.7s ease;

  @keyframes fade {
    0% {
      opacity: 0;
      transform: translate(-50%, -50%) scale(0.7);
    }
    50% {
      opacity: 1;
    }
    100% {
      opacity: 0;
      transform: translate(-50%, -50%) scale(1.2);
    }
  }
`;

const SoundButton = styled.div`
  position: absolute;
  top: 20px;
  right: 50px;
  z-index: 3;
  color: white;
  font-size: 22px;
  cursor: pointer;
`;
const InputDescription = styled.textarea`
  width: 100%;
  max-width: 600px;

  margin: 16px auto;
  display: block;

  padding: 14px 16px;
  border-radius: 16px;
  border: none;
  outline: none;

  resize: none;
  min-height: 100px;
  max-height: 180px;

  font-size: 16px;
  line-height: 1.5;

  background: rgba(255, 255, 255, 0.12);
  backdrop-filter: blur(8px);
  color: black;

  box-sizing: border-box;

  &::placeholder {
    color: rgba(0, 0, 0, 0.6);
  }

  @media (max-width: 480px) {
    width: 92%;
    margin: 12px auto;
    font-size: 16px;
    padding: 12px;
  }
`;

function Video() {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [mesdeos, setMesdeos] = useState([]);
  const [showIcon, setShowIcon] = useState(null);
  const [isMuted, setIsMuted] = useState(true);
  const [description, setDescription] = useState("");
  const [selectedVideo, setSelectedVideo] = useState(null);
  const modalVideoRef = useRef(null);

  const token = localStorage.getItem("token");
  const navigate = useNavigate();
  const MotionVideo = motion.create(VideoSection);
  const togglePlay = () => {
    const video = modalVideoRef.current;
    if (!video) return;

    let type;

    if (video.paused) {
      video.play();
      type = "play";
    } else {
      video.pause();
      type = "pause";
    }

    setShowIcon(type);

    setTimeout(() => {
      setShowIcon(null);
    }, 700);
  };

  const toggleSound = () => {
    const video = modalVideoRef.current;
    if (!video) return;

    video.muted = !video.muted;
    setIsMuted(video.muted);
  };

  useEffect(() => {
    if (!token) {
      alert("Reconnecte-toi");
    }
  }, []);

  const uploadeMultiple = (e) => {
    const files = Array.from(e.target.files);

    const newfile = files.map((file) => ({
      file,
      url: URL.createObjectURL(file),
    }));
    setVideos((prev) => [...prev, ...newfile]);
  };

  const supprimerurl = () => {
    videos.forEach((deo) => URL.revokeObjectURL(deo.url));
    setVideos([]);
  };

  const sauvegardedb = async () => {
    try {
      setLoading(true);

      const formdata = new FormData();

      videos.forEach((video) => {
        formdata.append("video", video.file);
      });

      formdata.append("description", description);

      const res = await fetch(`${API_URL}/api/clients/videos`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formdata,
      });

      const data = await res.json();

      if (!res.ok) {
        alert("sauvegarde échoué " + data.message);
        return;
      }

      setVideos([]);
      setDescription("");
      await getvideos();

      alert("sauvegarde réussie");
      setLoading(false);
    } catch (error) {
      alert("sauvegarde impossible " + error.message);
    }
  };

  const supprimerVideo = async (videoId) => {
    try {
      const res = await fetch(`${API_URL}/api/clients/videos/${videoId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "Suppression impossible");
        return;
      }

      // Supprime la vidéo de la liste affichée
      setMesdeos((prev) => prev.filter((video) => video._id !== videoId));

      // Ferme le modal si la vidéo supprimée était ouverte
      if (selectedVideo?._id === videoId) {
        setSelectedVideo(null);
      }

      alert("Vidéo supprimée avec succès");
    } catch (error) {
      console.error("❌ Erreur suppression vidéo :", error);
      alert("Suppression impossible");
    }
  };

  const getvideos = async () => {
    try {
      const res = await fetch(`${API_URL}/api/clients/mesvideos`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message);
        return;
      }

      setMesdeos(data);
    } catch (error) {
      alert(error.message);
    }
  };

  useEffect(() => {
    getvideos();
  }, []);

  return (
    <Pagewrapper>
      <BackButton onClick={() => navigate(-1)}>
        {" "}
        <FaArrowLeft />
      </BackButton>
      <Header>
        <LeftHeader />
        <UploadButton htmlFor="masque">
          <FaPlus />
        </UploadButton>
      </Header>

      <input
        id="masque"
        hidden
        type="file"
        accept="video/*"
        multiple
        onChange={uploadeMultiple}
      />
      {videos.length > 0 && (
        <Conteneurvideo>
          {videos.map((video, index) => (
            <VideoSection key={index}>
              <Videos src={video.url} autoPlay muted loop />
            </VideoSection>
          ))}
        </Conteneurvideo>
      )}

      {videos.length > 0 && (
        <div>
          <Bouton onClick={sauvegardedb} disabled={loading}>
            {loading ? "Envoi..." : "Ajouter"}
          </Bouton>
          <Bouton onClick={supprimerurl}>Annuller</Bouton>

          <InputDescription
            placeholder="Ajoute une description..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
      )}

      <Feed>
        {mesdeos.map((video) => (
          <MotionVideo
            key={video._id}
            initial={{
              opacity: 0,
              y: 80,
              scale: 0.96,
            }}
            whileInView={{
              opacity: 1,
              y: 0,
              scale: 1,
            }}
            transition={{
              duration: 0.45,
            }}
            viewport={{
              once: false,
              amount: 0.6,
            }}
            onClick={() => setSelectedVideo(video)}
          >
            <Videos src={video.url} muted loop />

            <Overlay>
              <TopInfo>
                <Badge>🎬 vidéo</Badge>
              </TopInfo>

              <div>
                <Description>
                  {video.description || "Pas de description"}
                </Description>

                <RightPanel>
                  <IconBox>
                    <FaHeart />
                    <span>{video.likes?.length || 0}</span>
                  </IconBox>

                  <IconBox>
                    <FaCommentDots />
                    <span>{video.comments?.length || 0}</span>
                  </IconBox>
                </RightPanel>
              </div>
            </Overlay>
          </MotionVideo>
        ))}
      </Feed>

      {selectedVideo && (
        <ModalOverlay onClick={() => setSelectedVideo(null)}>
          <ModalContent onClick={(e) => e.stopPropagation()}>
            <Boutonfermer onClick={() => setSelectedVideo(null)}>
              ✕
            </Boutonfermer>

            {/* VIDEO */}
            <ModalVideo
              ref={modalVideoRef}
              src={selectedVideo.url}
              autoPlay
              playsInline
              muted={isMuted}
              onClick={togglePlay}
            />

            {showIcon && (
              <CenterIcon>
                {showIcon === "play" ? <FaPlay /> : <FaPause />}
              </CenterIcon>
            )}

            {/* SON */}
            <SoundButton onClick={toggleSound}>
              {isMuted ? <FaVolumeMute /> : <FaVolumeUp />}
            </SoundButton>

            {/* INFOS */}
            <ModalInfo>
              <p>{selectedVideo.description || "Pas de description"}</p>
            </ModalInfo>

            {/* ACTIONS DROITE */}
            <ModalActions>
              <IconBox>
                <FaHeart />
                <span>{selectedVideo.likes?.length || 0}</span>
              </IconBox>

              <IconBox>
                <FaCommentDots />
                <span>{selectedVideo.comments?.length || 0}</span>
              </IconBox>
              <IconBox
                onClick={() => supprimerVideo(selectedVideo._id)}
                style={{ cursor: "pointer" }}
              >
                <FaTrash />
                <span>Supprimer</span>
              </IconBox>
            </ModalActions>
          </ModalContent>
        </ModalOverlay>
      )}
    </Pagewrapper>
  );
}
export default Video;
