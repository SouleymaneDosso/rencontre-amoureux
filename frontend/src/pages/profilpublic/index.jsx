import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import styled from "styled-components";
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
} from "react-icons/fa";

const Page = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #fff7fb, #eef2ff);
  padding: 30px 20px 100px;
`;

const Container = styled.div`
  max-width: 1000px;
  margin: 0 auto;
`;

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

const Card = styled.section`
  background: white;
  border-radius: 32px;
  overflow: hidden;
  box-shadow: 0 18px 40px rgba(31, 42, 68, 0.08);
  border: 1px solid #edf1ff;
`;

const Hero = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0;

  @media (max-width: 850px) {
    grid-template-columns: 1fr;
  }
`;

const AvatarWrapper = styled.div`
  width: 100%;
  height: 480px;
  background: #f1f4ff;
`;

const Avatar = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const AvatarPlaceholder = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 120px;
  color: #c084fc;
  background: linear-gradient(135deg, #f5e8ff, #eef2ff);
`;

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

const PhotosSection = styled.div`
  padding: 32px;
  border-top: 1px solid #f1f5f9;
`;

const PhotosGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 18px;
`;

const PhotoCard = styled.div`
  border-radius: 24px;
  overflow: hidden;
  background: #f8fafc;
  height: 260px;
  box-shadow: 0 8px 24px rgba(31, 42, 68, 0.05);
`;

const Photo = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const EmptyPhotos = styled.div`
  padding: 24px;
  border-radius: 20px;
  background: #f8fafc;
  color: #6b7280;
  text-align: center;
`;

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

function Profilpublic() {
  const [profil, setProfil] = useState(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [isMatch, setIsMatch] = useState(false);
  const [checkingMatch, setCheckingMatch] = useState(true);

  const { id } = useParams();
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const like = async () => {
    try {
      const res = await fetch(
        `http://localhost:3000/api/mesInfos/like/${id}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "Erreur lors du like");
        return;
      }

      alert(data.message);

      // si le like crée un match, on active immédiatement le bouton message
      if (data.match) {
        setIsMatch(true);
      }
    } catch (error) {
      alert("Erreur : " + error.message);
    }
  };

  useEffect(() => {
    const infospublic = async () => {
      try {
        setLoading(true);
        setMessage("");

        const res = await fetch(`http://localhost:3000/api/mesInfos/${id}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        const data = await res.json();

        if (!res.ok) {
          setMessage("Erreur lors du fetch : " + data.message);
          return;
        }

        setProfil(data);
      } catch (error) {
        setMessage(
          "Erreur lors de la récupération des données publiques : " +
            error.message
        );
      } finally {
        setLoading(false);
      }
    };

    infospublic();
  }, [id]);

  useEffect(() => {
    const verifierMatch = async () => {
      try {
        if (!token) {
          setIsMatch(false);
          return;
        }

        setCheckingMatch(true);

        const res = await fetch(
          `http://localhost:3000/api/mesInfos/verifier-match/${id}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await res.json();

        if (!res.ok) {
          console.error(data.message);
          setIsMatch(false);
          return;
        }

        setIsMatch(data.match);
      } catch (error) {
        console.error("Erreur vérification match :", error.message);
        setIsMatch(false);
      } finally {
        setCheckingMatch(false);
      }
    };

    verifierMatch();
  }, [id, token]);

  if (loading) {
    return <CenterText>Chargement du profil...</CenterText>;
  }

  if (message) {
    return <CenterText error>{message}</CenterText>;
  }

  if (!profil) {
    return <CenterText error>Profil introuvable</CenterText>;
  }

  return (
    <Page>
      <Container>
        <BackButton onClick={() => navigate(-1)}>
          <FaArrowLeft />
          Retour
        </BackButton>

        <Card>
          <Hero>
            <AvatarWrapper>
              {profil.avatar?.url ? (
                <Avatar src={profil.avatar.url} alt={profil.pseudo} />
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
                  Tu pourras envoyer un message uniquement après un match
                  réciproque.
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
                  <PhotoCard key={index}>
                    <Photo src={photo.url} alt={`photo-${index}`} />
                  </PhotoCard>
                ))}
              </PhotosGrid>
            ) : (
              <EmptyPhotos>Aucune photo disponible.</EmptyPhotos>
            )}
          </PhotosSection>

          <Actions>
            {isMatch ? (
              <ActionButton
                className="message"
                onClick={() => navigate(`/tchat/${profil._id}`)}
              >
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
    </Page>
  );
}

export default Profilpublic;