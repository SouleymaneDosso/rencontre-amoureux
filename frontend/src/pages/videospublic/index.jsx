import styled from "styled-components";
import { useState, useEffect } from "react";
const API_URL = import.meta.env.VITE_API_URL;
import { FaHeart, FaCommentDots, FaShare } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useRef } from "react";
import { FaPlay, FaPause } from "react-icons/fa";

const Page = styled.div`
  position: fixed;
  inset: 0;

  width: 100vw;
  height: height: 100vh;

  overflow-y: scroll;
  scroll-snap-type: y mandatory;

  background: black;
`;

const VideoContainer = styled.div`
  position: relative;
  width: 100%;
  height: calc(var(--vh) * 100);

  scroll-snap-align: start;
  overflow: hidden;
`;

const Video = styled.video`
  position: absolute;
  top: 0;
  left: 0;

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
    background: none;
    padding: 12px;
    transition: all 0.2s ease;
    color: ${(props) => (props.dejaLike ? "red" : "white")};
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

const CenterIcon = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 5;

  font-size: 70px;
  color: white;

  opacity: 0.85;

  pointer-events: none;

  animation: fade 0.8s ease;

  @keyframes fade {
    0% {
      opacity: 0;
      transform: translate(-50%, -50%) scale(0.8);
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

function Videopublic() {
  const [videos, setvideos] = useState([]);
  const [hasInteracted, setHasInteracted] = useState(false);
  const [userPaused, setUserPaused] = useState({});
  const [showIcon, setShowIcon] = useState(null);
  const [infos, setInfos] = useState("");

  const [commentText, setCommentText] = useState("");
  const [activeVideo, setActiveVideo] = useState(null);

  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const videoRefs = useRef([]);
  const userId = localStorage.getItem("userId");

  useEffect(() => {
    const unlock = () => {
      setHasInteracted(true);
      window.removeEventListener("click", unlock);
    };

    window.addEventListener("click", unlock);

    return () => window.removeEventListener("click", unlock);
  }, []);

  const handleComment = async (videoId) => {
    try {
      const res = await fetch(`${API_URL}/api/clients/commente/${videoId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          texte: commentText,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message);
        return;
      }

      setvideos((prev) =>
        prev.map((v) => (v._id === videoId ? { ...v, comments: data } : v)),
      );

      setCommentText("");
    } catch (error) {
      alert(error.message);
    }
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const video = entry.target;
          const id = video.dataset.id;

          if (entry.isIntersecting) {
            if (!userPaused[id]) {
              video.play();
            }
          } else {
            video.pause();
          }
        });
      },
      {
        threshold: 0.6,
      },
    );

    videoRefs.current.forEach((video) => {
      if (video) observer.observe(video);
    });

    return () => observer.disconnect();
  }, [videos, userPaused]);

  const handleToggle = (video, id) => {
    let type;

    if (video.paused) {
      video.play();
      setUserPaused((prev) => ({ ...prev, [id]: false }));
      type = "play";
    } else {
      video.pause();
      setUserPaused((prev) => ({ ...prev, [id]: true }));
      type = "pause";
    }

    setShowIcon({ id, type });

    setTimeout(() => {
      setShowIcon(null);
    }, 800);
  };

  useEffect(() => {
    const fetchProfil = async () => {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_API_URL}/api/mesInfos/me`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.message || "Erreur chargement profil");
        }

        setInfos(data);
      } catch (error) {
        console.error(error.message);
      }
    };
    fetchProfil();
  }, []);

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

  useEffect(() => {
    const setVh = () => {
      document.documentElement.style.setProperty(
        "--vh",
        `${window.innerHeight * 0.01}px`,
      );
    };

    setVh();
    window.addEventListener("resize", setVh);

    return () => window.removeEventListener("resize", setVh);
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
                likes: data.likes,
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
        <VideoContainer key={deo._id}>
          <Video
            data-id={deo._id}
            ref={(el) => (videoRefs.current[index] = el)}
            src={deo.url}
            muted={!hasInteracted}
            loop
            playsInline
            onClick={(e) => handleToggle(e.target, deo._id)}
          />

          {showIcon?.id === deo._id && (
            <CenterIcon>
              {showIcon.type === "play" ? <FaPlay /> : <FaPause />}
            </CenterIcon>
          )}
          <Boutonretour onClick={() => navigate(-1)}>Retour</Boutonretour>

          <Overlay>
            <p>
              @{infos?.nom}-{infos?.prenom}{" "}
            </p>
            <p>{deo?.description || "Pas de description"}</p>
          </Overlay>

          {/* {modal} */}

          {activeVideo === deo._id && (
            <div style={{ marginTop: "10px" }}>
              <input
                type="text"
                placeholder="Écris un commentaire..."
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                style={{
                  padding: "8px",
                  borderRadius: "10px",
                  border: "none",
                  width: "200px",
                }}
              />

              <button
                onClick={() => handleComment(deo._id)}
                style={{
                  marginLeft: "5px",
                  padding: "8px",
                  borderRadius: "10px",
                  border: "none",
                  cursor: "pointer",
                }}
              >
                Envoyer
              </button>
            </div>
          )}
          <RightPanel>
            <ActionButton
              dejaLike={deo.likes?.some((id) => id.toString() === userId)}
            >
              <FaHeart onClick={() => handleLike(deo._id, index)} />

              <span>{deo.likes?.length || 0}</span>
            </ActionButton>

            <ActionButton onClick={() => setActiveVideo(deo._id)}>
              <FaCommentDots />
              <span>{deo.comments?.length || 0}</span>
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
