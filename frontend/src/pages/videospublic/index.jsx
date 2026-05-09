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
  height: calc(var(--vh) * 100);

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

  ...
  opacity: ${(props) => (props.show ? 1 : 0)};
  transition: opacity 0.3s ease;
`;

const RightPanel = styled.div`
  position: absolute;
  right: 10px;
  bottom: calc(100px + env(safe-area-inset-bottom));
  display: flex;
  flex-direction: column;
  gap: 25px;
  z-index: 2;
  opacity: ${(props) => (props.show ? 1 : 0)};
  transition: opacity 0.3s ease;
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
const CommentBox = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;

  background: rgba(0, 0, 0, 0.9);
  backdrop-filter: blur(10px);

  padding: 15px;
  z-index: 10;

  display: flex;
  gap: 10px;
`;
const CommentInput = styled.input`
  flex: 1;
  padding: 10px;
  border-radius: 20px;
  border: none;
  outline: none;

  background: rgba(255, 255, 255, 0.1);
  color: white;
`;
const SendButton = styled.button`
  padding: 10px 15px;
  border-radius: 20px;
  border: none;

  background: #ff0050;
  color: white;
  cursor: pointer;
`;
const ModalOverlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  justify-content: center;
  align-items: flex-end;
  z-index: 999;
`;

const ModalBox = styled.div`
  width: 100%;
  max-height: 80%;
  background: #111;
  border-radius: 20px 20px 0 0;
  padding: 15px;
  display: flex;
  flex-direction: column;
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  color: white;
  margin-bottom: 10px;
`;

const CloseBtn = styled.button`
  background: none;
  border: none;
  color: white;
  font-size: 20px;
`;

const CommentList = styled.div`
  flex: 1;
  overflow-y: auto;
  color: white;
`;

const CommentItem = styled.div`
  display: flex;
  gap: 10px;
  padding: 10px 0;
  border-bottom: 1px solid #222;
  position: relative;

  transform: translateX(${(props) => props.offset || 0}px);
  transition: transform 0.15s ease;
`;

const SwipeBackground = styled.div`
  position: absolute;
  inset: 0;
  background: #ff3b30;
  display: flex;
  align-items: center;
  padding-left: 20px;
  color: white;
  font-weight: bold;
  z-index: 0;
`;

const CommentAvatar = styled.img`
  width: 35px;
  height: 35px;
  border-radius: 50%;
  object-fit: cover;
`;

const CommentContent = styled.div`
  flex: 1;
`;

const CommentPseudo = styled.p`
  font-size: 13px;
  font-weight: bold;
  margin: 0;
`;

const CommentText = styled.p`
  font-size: 14px;
  margin: 2px 0;
  color: #ddd;
`;

const CommentInputBox = styled.div`
  display: flex;
  gap: 10px;
  margin-top: 10px;

  input {
    flex: 1;
    padding: 10px;
    border-radius: 10px;
    border: none;
    font-size: 16px;
  }

  button {
    padding: 10px;
    border-radius: 10px;
    border: none;
    background: #ff0050;
    color: white;
  }
`;
const Img = styled.img`
  width: 60px;
  height: 60px;
  border-radius: 50%;
  object-fit: cover;
  margin-bottom: 10px;
`;
const ProgressBarContainer = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 4px;
  background: rgba(255, 255, 255, 0.2);

  touch-action: none; /* 🔥 IMPORTANT */
  opacity: ${(props) => (props.show ? 1 : 0)};
  transition: opacity 0.3s ease;
`;
const Button = styled.button`
  background: none;
  border: none;
`;
const VideoInfo = styled.small`
  opacity: 0.7;
  font-size: 12px;
  display: block;
  margin-top: 5px;
`;

const ProgressBar = styled.div`
  height: 100%;
  background: #ff0050;
  width: ${(props) => props.width || 0}%;
  transition: width 0.1s linear;
`;
const Tooltip = styled.div`
  position: absolute;
  bottom: 12px;
  left: ${(props) => props.left || 0}%;

  transform: translateX(-50%);
  background: black;
  color: white;
  font-size: 11px;
  padding: 4px 6px;
  border-radius: 5px;
  pointer-events: none;
  white-space: nowrap;
`;

const Loader = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 6;

  width: 40px;
  height: 40px;
  border: 3px solid rgba(255, 255, 255, 0.3);
  border-top: 3px solid white;
  border-radius: 50%;

  animation: spin 1s linear infinite;

  @keyframes spin {
    to {
      transform: translate(-50%, -50%) rotate(360deg);
    }
  }
`;

const ReplyList = styled.div`
  margin-left: 35px;
  margin-top: 10px;
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const ReplyItem = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 8px;
`;

const ReplyAvatarBtn = styled.button`
  background: none;
  border: none;
  padding: 0;
  cursor: pointer;
`;

const ReplyAvatar = styled.img`
  width: 28px;
  height: 28px;
  border-radius: 50%;
  object-fit: cover;
`;

const ReplyContent = styled.div`
  display: flex;
  flex-direction: column;
`;

const ReplyPseudo = styled.p`
  font-size: 12px;
  font-weight: 600;
  margin: 0;
  color: #fff;
`;

const ReplyText = styled.p`
  font-size: 13px;
  margin: 2px 0 0 0;
  color: #bbb;
  line-height: 1.3;
`;
const ReplyWrapper = styled.div`
  margin-left: 30px;
  padding-left: 10px;
  border-left: 1px solid #222;
`;

function Videopublic() {
  const [videos, setvideos] = useState([]);
  const [hasInteracted, setHasInteracted] = useState(false);
  const [userPaused, setUserPaused] = useState({});
  const [showIcon, setShowIcon] = useState(null);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [activeVideo, setActiveVideo] = useState(null);
  const [comments, setComments] = useState([]);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const videoRefs = useRef([]);
  const userId = localStorage.getItem("userId");
  const [hasMore, setHasMore] = useState(true);
  const [progress, setProgress] = useState({});
  const [durations, setDurations] = useState({});
  const [isDragging, setIsDragging] = useState(false);
  const [hoverTime, setHoverTime] = useState(null);
  const [hoverPosition, setHoverPosition] = useState(0);
  const [loadingMap, setLoadingMap] = useState({});
  const [showUI, setShowUI] = useState(true);
  const [replyTo, setReplyTo] = useState(null);
  const [touchStartX, setTouchStartX] = useState(0);
  const [touchStartY, setTouchStartY] = useState(0);
  const [swipingId, setSwipingId] = useState(null);
  const [swipeX, setSwipeX] = useState(0);

  const hideTimeout = useRef(null);
  const pageRef = useRef(null);
  const inputRef = useRef(null);

  const handleReply = async (commentId) => {
    try {
      const res = await fetch(
        `${API_URL}/api/clients/reply/${activeVideo}/${commentId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ texte: commentText }),
        },
      );

      const data = await res.json();

      if (!res.ok) {
        alert(data.message);
        return;
      }
      setReplyTo(null);
      setComments(data);
      setCommentText("");
    } catch (error) {
      alert(error.message);
    }
  };

  const triggerUI = () => {
    setShowUI(true);

    if (hideTimeout.current) {
      clearTimeout(hideTimeout.current);
    }

    hideTimeout.current = setTimeout(() => {
      setShowUI(false);
    }, 2500);
  };

  const formatTime = (sec = 0) => {
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60);
    return `${m}:${s < 10 ? "0" : ""}${s}`;
  };

  const handleHover = (e, videoId) => {
    const video = videoRefs.current[videoId];
    if (!video || !video.duration) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.touches ? e.touches[0].clientX : e.clientX) - rect.left;

    const percent = Math.min(Math.max(x / rect.width, 0), 1);
    const time = percent * video.duration;

    setHoverTime(time);
    setHoverPosition(percent * 100);
  };
  const handleLeave = () => {
    setHoverTime(null);
  };

  const setLoadin = (id, value) => {
    setLoadingMap((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const handleTimeUpdate = (e, id) => {
    const video = e.target;

    setProgress((prev) => ({
      ...prev,
      [id]: (video.currentTime / video.duration) * 100,
    }));
  };
  const seekToPercent = (video, percent) => {
    if (video && video.duration) {
      video.currentTime = percent * video.duration;
    }
  };
  const handleDragStart = () => {
    setIsDragging(true);
  };

  const handleDragMove = (e, videoId) => {
    if (!isDragging) return;

    e.preventDefault();

    const video = videoRefs.current[videoId];
    if (!video) return;

    const bar = e.currentTarget;
    const rect = bar.getBoundingClientRect();

    const x = (e.touches ? e.touches[0].clientX : e.clientX) - rect.left;
    const percent = Math.min(Math.max(x / rect.width, 0), 1);

    seekToPercent(video, percent);
  };

  const handleDragEnd = () => {
    setIsDragging(false);
  };

  const handleLoadedMetadata = (e, id) => {
    const video = e.target;

    setDurations((prev) => ({
      ...prev,
      [id]: video.duration,
    }));
  };
  const openComments = (video) => {
    setActiveVideo(video._id);
    setComments(video.comments || []);
    setCommentText("");
  };

  useEffect(() => {
    userPausedRef.current = userPaused;
  }, [userPaused]);

  useEffect(() => {
    const unlock = () => {
      setHasInteracted(true);
      window.removeEventListener("click", unlock);
    };

    window.addEventListener("click", unlock);

    return () => window.removeEventListener("click", unlock);
  }, []);

  const handleComment = async () => {
    try {
      const res = await fetch(
        `${API_URL}/api/clients/commente/${activeVideo}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ texte: commentText }),
        },
      );

      const data = await res.json();

      if (!res.ok) {
        alert(data.message);
        return;
      }

      setComments(data);

      setvideos((prev) =>
        prev.map((v) => (v._id === activeVideo ? { ...v, comments: data } : v)),
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
            if (!userPausedRef.current[id]) {
              video.play();
            }
          } else {
            video.pause();
          }
        });
      },
      { threshold: 0.6 },
    );

    Object.values(videoRefs.current)
      .filter(Boolean)
      .forEach((video) => observer.observe(video));

    return () => {
      Object.values(videoRefs.current)
        .filter(Boolean)
        .forEach((video) => observer.unobserve(video));
      observer.disconnect();
    };
  }, [videos]);

  const userPausedRef = useRef(userPaused);

  const handleToggle = (video, id) => {
    triggerUI();

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
    const getdeopublic = async () => {
      if (loading) return;

      setLoading(true);

      try {
        const res = await fetch(
          `${API_URL}/api/clients/videos/public?page=${page}`,
        );
        const data = await res.json();

        if (!res.ok) {
          alert(data.message);
          return;
        }

        setvideos((prev) => {
          const newVideos = data.filter(
            (v) => !prev.some((p) => p._id === v._id),
          );
          return [...prev, ...newVideos];
        });
        if (data.length === 0) setHasMore(false);
      } catch (error) {
        alert(error.message);
      }

      setLoading(false);
    };

    getdeopublic();
  }, [page]);

  useEffect(() => {
    const container = pageRef.current;
    if (!container) return;

    const handleScroll = () => {
      if (loading || !hasMore) return;

      if (
        container.scrollTop + container.clientHeight >=
        container.scrollHeight - 100
      ) {
        setPage((prev) => prev + 1);
      }
    };

    container.addEventListener("scroll", handleScroll);

    return () => container.removeEventListener("scroll", handleScroll);
  }, [loading, hasMore]);

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
    <Page ref={pageRef}>
      {videos.map((deo, index) => (
        <VideoContainer key={deo._id}>
          <Video
            data-id={deo._id}
            ref={(el) => {
              if (el) videoRefs.current[deo._id] = el;
            }}
            src={deo.url}
            muted={!hasInteracted}
            preload="metadata"
            loop
            playsInline
            onClick={(e) => handleToggle(e.target, deo._id)}
            onTimeUpdate={(e) => handleTimeUpdate(e, deo._id)}
            onLoadedMetadata={(e) => handleLoadedMetadata(e, deo._id)}
            onWaiting={() => setLoadin(deo._id, true)}
            onPlaying={() => setLoadin(deo._id, false)}
            onCanPlay={() => setLoadin(deo._id, false)}
            onTouchStart={triggerUI}
            onMouseMove={triggerUI}
          />
          {loadingMap[deo._id] && <Loader />}

          {showIcon?.id === deo._id && (
            <CenterIcon>
              {showIcon.type === "play" ? <FaPlay /> : <FaPause />}
            </CenterIcon>
          )}
          <Boutonretour onClick={() => navigate(-1)}> ← Retour</Boutonretour>

          {showUI && (
            <Overlay show={showUI}>
              <p style={{ fontWeight: "bold" }}>
                @{deo.user?.pseudo || `${deo.user?.nom}-${deo.user?.prenom}`}
              </p>

              <p>{deo?.description || "Pas de description"}</p>

              <small style={{ opacity: 0.7 }}></small>
              <small>{formatTime(deo.duree)}</small>
            </Overlay>
          )}

          {/* {modal} */}

          {showUI && (
            <RightPanel show={showUI}>
              <Button onClick={() => navigate(`/profilpublic/${deo.user._id}`)}>
                <Img src={deo.user?.avatar?.url} alt={deo.user?.pseudo} />
              </Button>
              <ActionButton
                dejaLike={deo.likes?.some((id) => id.toString() === userId)}
              >
                <FaHeart onClick={() => handleLike(deo._id, index)} />

                <span>{deo.likes?.length || 0}</span>
              </ActionButton>

              <ActionButton onClick={() => openComments(deo)}>
                <FaCommentDots />
                <span>{deo.comments?.length || 0}</span>
              </ActionButton>

              {/* <ActionButton>
              <FaShare />
              <span>Partager</span>
            </ActionButton> */}
            </RightPanel>
          )}

          {showUI && (
            <ProgressBarContainer
              onMouseDown={(e) => {
                triggerUI();
                handleDragStart(e);
              }}
              onMouseMove={(e) => {
                handleDragMove(e, deo._id);
                handleHover(e, deo._id);
              }}
              onMouseUp={handleDragEnd}
              onMouseLeave={() => {
                handleDragEnd();
                handleLeave();
              }}
              onTouchStart={(e) => {
                triggerUI();
                handleDragStart(e);
              }}
              onTouchMove={(e) => {
                handleDragMove(e, deo._id);
                handleHover(e, deo._id);
              }}
              onTouchEnd={() => {
                handleDragEnd();
                handleLeave();
              }}
              show={showUI}
            >
              <ProgressBar width={progress[deo._id] || 0} />

              {hoverTime !== null && (
                <Tooltip left={hoverPosition}>
                  {formatTime(hoverTime)} /{" "}
                  {formatTime(durations[deo._id] || 0)}
                </Tooltip>
              )}
            </ProgressBarContainer>
          )}
        </VideoContainer>
      ))}

      {activeVideo && (
        <ModalOverlay>
          <ModalBox>
            <ModalHeader>
              <h3>Commentaires</h3>
              <CloseBtn
                onClick={() => {
                  setActiveVideo(null);
                  setReplyTo(null);
                  setCommentText("");
                }}
              >
                ✕
              </CloseBtn>
            </ModalHeader>

            <CommentList>
              {comments.length === 0 ? (
                <p>Aucun commentaire</p>
              ) : (
                comments.map((c, i) => (
                  <CommentItem
                    key={c._id}
                    offset={swipingId === c._id ? swipeX : 0}
                    onTouchStart={(e) => {
                      setSwipingId(c._id);
                      setSwipeX(0);

                      setTouchStartX(e.touches[0].clientX);
                      setTouchStartY(e.touches[0].clientY);
                    }}
                    onTouchMove={(e) => {
                      if (swipingId !== c._id) return;

                      const currentX = e.touches[0].clientX;
                      const diffX = currentX - touchStartX;

                      if (diffX > 0) {
                        setSwipeX(Math.min(diffX, 100)); // effet visuel
                      }
                    }}
                    onTouchEnd={(e) => {
                      const touchEndX = e.changedTouches[0].clientX;
                      const diffX = touchEndX - touchStartX;

                      setSwipingId(null);
                      setSwipeX(0);

                      if (diffX > 80) {
                        setReplyTo({
                          commentId: c._id,
                          pseudo: c.user?.pseudo,
                        });

                        setCommentText(`@${c.user?.pseudo} `);

                        setTimeout(() => {
                          inputRef.current?.focus();
                        }, 100);
                      }
                    }}
                  >
                    <Button
                      onClick={() => navigate(`/profilpublic/${c.user._id}`)}
                    >
                      <CommentAvatar
                        src={c.user?.avatar?.url || "/default-avatar.png"}
                      />
                    </Button>

                    <CommentContent>
                      <CommentPseudo>
                        @{c.user?.pseudo || "utilisateur"}
                      </CommentPseudo>

                      <CommentText>{c.texte}</CommentText>
                      <ReplyWrapper>
                        {c.replies?.map((r, index) => (
                          <ReplyItem key={index}>
                            <ReplyAvatarBtn
                              onClick={() =>
                                navigate(`/profilpublic/${r.user?._id}`)
                              }
                            >
                              <ReplyAvatar
                                src={
                                  r.user?.avatar?.url || "/default-avatar.png"
                                }
                              />
                            </ReplyAvatarBtn>

                            <ReplyContent>
                              <ReplyPseudo>
                                @{r.user?.pseudo || "user"}
                              </ReplyPseudo>

                              <ReplyText>{r.texte}</ReplyText>
                            </ReplyContent>
                          </ReplyItem>
                        ))}
                      </ReplyWrapper>
                    </CommentContent>
                  </CommentItem>
                ))
              )}
            </CommentList>

            {/* INPUT */}
            {replyTo && (
              <p style={{ color: "#aaa", fontSize: "13px" }}>
                Réponse à @{replyTo.pseudo}
              </p>
            )}
            <CommentInputBox>
              <input
                ref={inputRef}
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder="Écris un commentaire..."
              />

              <button
                onClick={() => {
                  if (replyTo) {
                    handleReply(replyTo.commentId);
                  } else {
                    handleComment(activeVideo);
                  }
                }}
              >
                Envoyer
              </button>
            </CommentInputBox>
          </ModalBox>
        </ModalOverlay>
      )}
    </Page>
  );
}
export default Videopublic;
