import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import styled, { keyframes } from "styled-components";
import {
  FaMapMarkerAlt,
  FaCheckCircle,
  FaCircle,
  FaArrowLeft,
  FaImages,
  FaUserCircle,
  FaComments,
  FaHeart,
  FaLock,
  FaTimes,
} from "react-icons/fa";

// ======================================
// Topbar animations
const slideDown = keyframes`
  from { transform: translateY(-100%); opacity: 0;}
  to { transform: translateY(0); opacity: 1;}
`;

const TopBar = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  padding: 16px;
  background: ${({ type }) => (type === "error" ? "#dc2626" : "#16a34a")};
  color: white;
  font-weight: 600;
  text-align: center;
  z-index: 9999;
  animation: ${slideDown} 0.4s ease forwards;
`;

// ======================================
// Page layout
const Page = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #fff7fb, #eef2ff);
  padding: 30px 20px 100px;
`;

const Container = styled.div`
  max-width: 1000px;
  margin: 0 auto;
`;

// Back button
const BackButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: #eef2ff;
  color: #4f46e5;
  border: none;
  border-radius: 14px;
  padding: 12px 18px;
  font-size: 14px;
  font-weight: 700;
  cursor: pointer;
  margin-bottom: 24px;
  transition: 0.25s ease;

  &:hover {
    transform: translateY(-2px);
    background: #e0e7ff;
  }
`;

// Card
const Card = styled.section`
  background: white;
  border-radius: 32px;
  overflow: hidden;
  box-shadow: 0 18px 40px rgba(31, 42, 68, 0.08);
  border: 1px solid #edf1ff;
`;

// Hero (Avatar + Infos)
const Hero = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;

  @media (max-width: 850px) {
    grid-template-columns: 1fr;
  }
`;

const AvatarWrapper = styled.div`
  width: 100%;
  aspect-ratio: 1 / 1;
  background: #f1f4ff;
  border-radius: 24px;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Avatar = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  cursor: pointer;
  transition: transform 0.3s ease;
  &:hover {
    transform: scale(1.05);
  }
`;

const AvatarPlaceholder = styled.div`
  font-size: 120px;
  color: #c084fc;
  background: linear-gradient(135deg, #f5e8ff, #eef2ff);
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
`;

// Infos
const Infos = styled.div`
  padding: 32px;
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

const Name = styled.h1`
  margin: 0;
  font-size: 36px;
  color: #1f2a44;
`;

const Location = styled.p`
  margin-top: 14px;
  color: #5f6b85;
  font-size: 16px;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const StatusRow = styled.div`
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
  margin-top: 20px;
`;

const Badge = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 10px 14px;
  border-radius: 999px;
  font-size: 14px;
  font-weight: 700;
  background: ${({ type }) =>
    type === "online"
      ? "#dcfce7"
      : type === "verified"
      ? "#eef2ff"
      : "#ffe4f1"};
  color: ${({ type }) =>
    type === "online"
      ? "#15803d"
      : type === "verified"
      ? "#4f46e5"
      : "#db2777"};
`;

// Bio
const BioSection = styled.div`
  padding: 32px;
  border-top: 1px solid #f1f5f9;
`;

const SectionTitle = styled.h2`
  margin: 0 0 16px 0;
  font-size: 24px;
  color: #1f2a44;
  display: flex;
  align-items: center;
  gap: 10px;
`;

const BioText = styled.p`
  margin: 0;
  font-size: 16px;
  line-height: 1.8;
  color: #6b7280;
`;

// Photos
const PhotosSection = styled.div`
  padding: 32px;
  border-top: 1px solid #f1f5f9;
`;

const PhotosGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 16px;

  @media (max-width: 600px) {
    grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  }
`;

const PhotoCard = styled.div`
  width: 100%;
  aspect-ratio: 1 / 1;
  border-radius: 16px;
  overflow: hidden;
  background: #f8fafc;
  cursor: pointer;
  transition: transform 0.3s ease;
  &:hover {
    transform: scale(1.05);
  }
`;

const Photo = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

// Modal
const ModalOverlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.65);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 10000;
`;

const ModalContent = styled.div`
  max-width: 90%;
  max-height: 90%;
  overflow: hidden;
  border-radius: 20px;
  position: relative;
`;

const ModalImage = styled.img`
  width: 100%;
  height: auto;
  max-height: 90vh;
  display: block;
  border-radius: 20px;
`;

const CloseButton = styled.button`
  position: absolute;
  top: 14px;
  right: 14px;
  background: rgba(255, 255, 255, 0.85);
  border: none;
  border-radius: 50%;
  padding: 8px;
  font-size: 18px;
  cursor: pointer;
  z-index: 10;

  &:hover {
    background: rgba(255, 255, 255, 1);
  }
`;

// Actions
const Actions = styled.div`
  padding: 32px;
  border-top: 1px solid #f1f5f9;
  display: flex;
  gap: 14px;
  flex-wrap: wrap;
`;

const ActionButton = styled.button`
  flex: 1;
  min-width: 180px;
  padding: 14px 18px;
  border: none;
  border-radius: 18px;
  font-size: 15px;
  font-weight: 700;
  cursor: pointer;
  transition: 0.25s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;

  &:hover {
    transform: translateY(-2px);
  }

  &.message {
    background: linear-gradient(135deg, #4f46e5, #7c3aed);
    color: white;
    box-shadow: 0 10px 24px rgba(79, 70, 229, 0.22);
  }

  &.like {
    background: linear-gradient(135deg, #ec4899, #f472b6);
    color: white;
    box-shadow: 0 10px 24px rgba(236, 72, 153, 0.22);
  }

  &.disabled {
    background: #e5e7eb;
    color: #6b7280;
    cursor: not-allowed;
    box-shadow: none;
  }

  &.disabled:hover {
    transform: none;
  }
`;

const InfoMatch = styled.p`
  margin-top: 18px;
  color: #6b7280;
  font-size: 14px;
  line-height: 1.6;
`;

const CenterText = styled.h3`
  text-align: center;
  margin-top: 80px;
  color: ${({ error }) => (error ? "#dc2626" : "#374151")};
`;


// ======================================
// Composant Profilpublic
function Profilpublic() {
  const [profil, setProfil] = useState(null);
  const [message, setMessage] = useState("");
  const [topBar, setTopBar] = useState(null); // { type: 'error' | 'success', text: '...' }
  const [loading, setLoading] = useState(true);
  const [isMatch, setIsMatch] = useState(false);
  const [checkingMatch, setCheckingMatch] = useState(true);
  const [modalPhoto, setModalPhoto] = useState(null);

  const { id } = useParams();
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  // ------------------ Like
  const like = async () => {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/mesInfos/like/${id}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await res.json();

      if (!res.ok) {
        setTopBar({ type: "error", text: data.message || "Erreur lors du like" });
        return;
      }

      setTopBar({ type: "success", text: data.message });

      if (data.match) setIsMatch(true);
    } catch (error) {
      setTopBar({ type: "error", text: error.message });
    } finally {
      setTimeout(() => setTopBar(null), 4000);
    }
  };

  // ------------------ Fetch profil public
  useEffect(() => {
    const infospublic = async () => {
      try {
        setLoading(true);
        setMessage("");

        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/mesInfos/${id}`, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });

        const data = await res.json();

        if (!res.ok) {
          setMessage("Erreur lors du fetch : " + data.message);
          return;
        }

        setProfil(data);
      } catch (error) {
        setMessage("Erreur récupération profil : " + error.message);
      } finally {
        setLoading(false);
      }
    };

    infospublic();
  }, [id]);

  // ------------------ Vérification match
  useEffect(() => {
    const verifierMatch = async () => {
      try {
        if (!token) {
          setIsMatch(false);
          return;
        }

        setCheckingMatch(true);

        const res = await fetch(
          `${import.meta.env.VITE_API_URL}/api/mesInfos/verifier-match/${id}`,
          {
            method: "GET",
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        const data = await res.json();

        if (!res.ok) {
          setIsMatch(false);
          return;
        }

        setIsMatch(data.match);
      } catch (error) {
        console.log("Erreur vérification match : " + error.message);
        setIsMatch(false);
      } finally {
        setCheckingMatch(false);
      }
    };

    verifierMatch();
  }, [id, token]);

  // ------------------ Rendering
  if (loading) return <CenterText>Chargement du profil...</CenterText>;
  if (message) return <CenterText error>{message}</CenterText>;
  if (!profil) return <CenterText error>Profil introuvable</CenterText>;

  return (
    <Page>
      {topBar && <TopBar type={topBar.type}>{topBar.text}</TopBar>}
      <Container>
        <BackButton onClick={() => navigate(-1)}>
          <FaArrowLeft />
          Retour
        </BackButton>

        <Card>
          <Hero>
            <AvatarWrapper>
              {profil.avatar?.url ? (
                <Avatar src={profil.avatar.url} alt={profil.pseudo} onClick={() => setModalPhoto(profil.avatar.url)} />
              ) : (
                <AvatarPlaceholder>
                  <FaUserCircle />
                </AvatarPlaceholder>
              )}
            </AvatarWrapper>

            <Infos>
              <Name>
                {profil.pseudo}, {profil.age} ans
              </Name>

              <Location>
                <FaMapMarkerAlt />
                {profil.ville}, {profil.pays}
              </Location>

              <StatusRow>
                <Badge type="online">
                  <FaCircle />
                  {profil.enLigne ? "En ligne" : "Hors ligne"}
                </Badge>

                {profil.verifie && (
                  <Badge type="verified">
                    <FaCheckCircle />
                    Profil vérifié
                  </Badge>
                )}

                <Badge>
                  <FaHeart />
                  {profil.recherche || "Rencontre"}
                </Badge>
              </StatusRow>

              {!checkingMatch && !isMatch && (
                <InfoMatch>
                  <FaLock style={{ marginRight: "8px" }} />
                  Tu pourras envoyer un message uniquement après un match réciproque.
                </InfoMatch>
              )}
            </Infos>
          </Hero>

          <BioSection>
            <SectionTitle>À propos</SectionTitle>
            <BioText>{profil.bio || "Aucune bio pour le moment."}</BioText>
          </BioSection>

          <PhotosSection>
            <SectionTitle>
              <FaImages />
              Photos
            </SectionTitle>

            {profil.photos && profil.photos.length > 0 ? (
              <PhotosGrid>
                {profil.photos.map((photo, index) => (
                  <PhotoCard key={index} onClick={() => setModalPhoto(photo.url)}>
                    <Photo src={photo.url} alt={`photo-${index}`} />
                  </PhotoCard>
                ))}
              </PhotosGrid>
            ) : (
              <CenterText>Aucune photo disponible.</CenterText>
            )}
          </PhotosSection>

          <Actions>
            {isMatch ? (
              <ActionButton className="message" onClick={() => navigate(`/tchat/${profil._id}`)}>
                <FaComments />
                Envoyer un message
              </ActionButton>
            ) : (
              <ActionButton className="disabled" disabled>
                <FaLock />
                Message verrouillé
              </ActionButton>
            )}

            <ActionButton className="like" onClick={like}>
              <FaHeart />
              Liker ce profil
            </ActionButton>
          </Actions>
        </Card>
      </Container>

      {modalPhoto && (
        <ModalOverlay onClick={() => setModalPhoto(null)}>
          <ModalContent onClick={(e) => e.stopPropagation()}>
            <CloseButton onClick={() => setModalPhoto(null)}>
              <FaTimes />
            </CloseButton>
            <ModalImage src={modalPhoto} alt="agrandi" />
          </ModalContent>
        </ModalOverlay>
      )}
    </Page>
  );
}

export default Profilpublic;