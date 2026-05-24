import styled from "styled-components";
import { useState, useEffect } from "react";
import { HiVideoCamera } from "react-icons/hi";
import { FaHeart, FaCommentDots } from "react-icons/fa";
import { useRef } from "react";
import { useNavigate } from "react-router-dom";
import { FaPlay, FaPause, FaVolumeMute, FaVolumeUp } from "react-icons/fa";
const API_URL = import.meta.env.VITE_API_URL;

/* ================== STYLES ================== */
const H1 = styled.h1`
  text-align: center;
  padding: 10px;
  font-size: 32px;
  font-weight: 800;
  background: linear-gradient(90deg, #6a11cb, #2575fc);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
`;

const Labelstyle = styled.label`
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 30px auto;
  width: 80px;
  height: 80px;
  border-radius: 50%;
  cursor: pointer;

  background: linear-gradient(135deg, #6a11cb, #2575fc);
  box-shadow:
    0 0 20px rgba(106, 17, 203, 0.6),
    0 0 40px rgba(37, 117, 252, 0.4);

  transition: all 0.3s ease;

  &:hover {
    transform: scale(1.1) rotate(5deg);
    box-shadow:
      0 0 30px rgba(106, 17, 203, 0.9),
      0 0 60px rgba(37, 117, 252, 0.7);
  }
`;

const Pagewrapper = styled.div`
  height: 100vh;
  color: white;
  margin-bottom: 400px;
`;

const Titre = styled.h3`
  text-align: center;
  padding: 15px;
  background: linear-gradient(90deg, #6a11cb, #2575fc);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
`;
const Conteneurvideo = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 20px;
`;

const Overlay = styled.div`
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  justify-content: space-between;

  padding: 15px;

  background: linear-gradient(
    to top,
    rgba(0, 0, 0, 0.8),
    rgba(0, 0, 0, 0.2),
    transparent
  );
`;

const CardVideo = styled.div`
  position: relative;
  width: 100%;
  height: 350px;
  border-radius: 20px;
  overflow: hidden;

  background: #111;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.6);

  transition: 0.3s;

  &:hover {
    transform: translateY(-5px) scale(1.02);
  }
`;

const Videos = styled.video`
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
  font-size: 13px;
  opacity: 0.9;
`;

const RightPanel = styled.div`
  position: absolute;
  right: 10px;
  bottom: 20px;

  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 15px;
`;

const IconBox = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  cursor: pointer;

  svg {
    font-size: 24px;
  }

  span {
    font-size: 12px;
  }
`;
const Badge = styled.div`
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  padding: 5px 10px;
  border-radius: 10px;
  font-size: 12px;
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
  color: blue;
  font-size: 15px;
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
const GradientOverlay = styled.div`
  position: absolute;
  inset: 0;

  background: linear-gradient(to top, rgba(0, 0, 0, 0.8), transparent 40%);

  z-index: 1;
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
      <Boutonretour onClick={() => navigate(-1)}>Retour</Boutonretour>
      <main>
        <H1>Vidéos et reactions</H1>

        <section>
          <Labelstyle htmlFor="masque">
            <HiVideoCamera size={30} />
          </Labelstyle>

          <input
            id="masque"
            type="file"
            accept="video/*"
            multiple
            onChange={uploadeMultiple}
            hidden
          />
        </section>
        <section>
          <Titre>Mes videos</Titre>

          {videos.length > 0 && (
            <Conteneurvideo>
              {videos.map((video, index) => (
                <CardVideo key={index}>
                  <Videos src={video.url} autoPlay muted loop />
                </CardVideo>
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

          <Conteneurvideo>
            {mesdeos.map((video) => (
              <CardVideo
                key={video._id}
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
              </CardVideo>
            ))}
          </Conteneurvideo>
        </section>
      </main>

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
            </ModalActions>
          </ModalContent>
        </ModalOverlay>
      )}
    </Pagewrapper>
  );
}
export default Video;
