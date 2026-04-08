import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import {
  FaMapMarkerAlt,
  FaHeart,
  FaTimes,
  FaEye,
  FaUserCircle,
  FaCompass,
} from "react-icons/fa";

const Page = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #f8f9ff, #e6ecff);
  padding: 30px 20px 100px;
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: 40px;
`;

const Title = styled.h1`
  font-size: 34px;
  color: #1f2a44;
  margin-bottom: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 12px;
`;

const Subtitle = styled.p`
  color: #6b7280;
  font-size: 16px;
  max-width: 600px;
  margin: 0 auto;
`;

const TopButton = styled.button`
  margin-top: 20px;
  padding: 12px 18px;
  background: white;
  border: 1px solid #dbe4ff;
  border-radius: 16px;
  color: #1f2a44;
  font-size: 14px;
  font-weight: 700;
  cursor: pointer;
  transition: 0.25s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 10px 22px rgba(31, 42, 68, 0.08);
  }
`;

const Chargement = styled.h3`
  text-align: center;
  margin-top: 100px;
  font-size: 24px;
  color: #333;
`;

const Message = styled.h3`
  text-align: center;
  margin-top: 100px;
  font-size: 20px;
  color: #dc2626;
`;

const Section = styled.section`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 28px;
  max-width: 1200px;
  margin: 0 auto;
`;

const Card = styled.div`
  background: white;
  border-radius: 28px;
  overflow: hidden;
  box-shadow: 0 12px 30px rgba(31, 42, 68, 0.08);
  transition: all 0.25s ease;
  border: 1px solid #edf1ff;

  &:hover {
    transform: translateY(-6px);
    box-shadow: 0 18px 35px rgba(31, 42, 68, 0.12);
  }
`;

const ImageWrapper = styled.div`
  width: 100%;
  height: 320px;
  background: #f1f4ff;
  overflow: hidden;
`;

const Images = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const Placeholder = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 90px;
  color: #4f6cff;
  background: linear-gradient(135deg, #eef2ff, #dde5ff);
`;

const Content = styled.div`
  padding: 22px;
`;

const H2 = styled.h2`
  margin: 0;
  font-size: 24px;
  color: #1f2a44;
`;

const Ville = styled.p`
  margin-top: 10px;
  color: #5f6b85;
  font-size: 15px;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const Bio = styled.p`
  margin-top: 14px;
  font-size: 14px;
  color: #6b7280;
  line-height: 1.6;
  min-height: 52px;
`;

const FooterCard = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-top: 20px;
`;

const TopInfos = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const MiniBadge = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: #eef2ff;
  color: #4f6cff;
  padding: 8px 14px;
  border-radius: 999px;
  font-size: 13px;
  font-weight: 600;
`;

const VoirProfilButton = styled.button`
  padding: 11px 16px;
  background: linear-gradient(135deg, #4f6cff, #6f88ff);
  border: none;
  border-radius: 16px;
  color: white;
  font-size: 14px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.25s ease;
  box-shadow: 0 10px 24px rgba(79, 108, 255, 0.22);
  display: flex;
  align-items: center;
  gap: 8px;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 14px 28px rgba(79, 108, 255, 0.28);
  }
`;

const Actions = styled.div`
  display: flex;
  justify-content: center;
  gap: 18px;
`;

const ActionButton = styled.button`
  width: 56px;
  height: 56px;
  border: none;
  border-radius: 50%;
  cursor: pointer;
  font-size: 22px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: 0.25s ease;
  box-shadow: 0 10px 20px rgba(31, 42, 68, 0.12);

  &:hover {
    transform: translateY(-3px) scale(1.05);
  }

  &.like {
    background: #ffe4ea;
    color: #e11d48;
  }

  &.dislike {
    background: #eef2ff;
    color: #4f46e5;
  }
`;

const Empty = styled.div`
  text-align: center;
  padding: 80px 20px;
  color: #6b7280;
  font-size: 18px;
  background: white;
  border-radius: 24px;
  max-width: 700px;
  margin: 0 auto;
  box-shadow: 0 10px 30px rgba(31, 42, 68, 0.06);
`;

function Decouverte() {
  const [profils, setProfils] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [actionLoading, setActionLoading] = useState(null);

  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const handleLike = async (profilId) => {
    try {
      setActionLoading(profilId);

      const res = await fetch(
        `http://localhost:3000/api/mesInfos/like/${profilId}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await res.json();

      if (!res.ok) throw new Error(data.message);

      setProfils((prev) => prev.filter((p) => p._id !== profilId));

      if (data.match) {
        alert("🔥 Match ! Cette personne t'a liké aussi.");
      }
    } catch (error) {
      console.error("Erreur like :", error.message);
      alert(error.message);
    } finally {
      setActionLoading(null);
    }
  };

  const handleDislike = async (profilId) => {
    try {
      setActionLoading(profilId);

      const res = await fetch(
        `http://localhost:3000/api/mesInfos/dislike/${profilId}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await res.json();

      if (!res.ok) throw new Error(data.message);

      setProfils((prev) => prev.filter((p) => p._id !== profilId));
    } catch (error) {
      console.error("Erreur dislike :", error.message);
      alert(error.message);
    } finally {
      setActionLoading(null);
    }
  };

  useEffect(() => {
    const fetchSuggestions = async () => {
      try {
        setLoading(true);
        setMessage("");

        const res = await fetch(
          "http://localhost:3000/api/mesInfos/suggestions",
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await res.json();

        if (!res.ok) {
          setMessage(data.message || "Impossible de charger les suggestions.");
          return;
        }

        setProfils(data);
      } catch (error) {
        setMessage("Erreur : " + error.message);
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchSuggestions();
    } else {
      setMessage("Utilisateur non connecté.");
      setLoading(false);
    }
  }, [token]);

  if (loading) {
    return <Chargement>Chargement des suggestions...</Chargement>;
  }

  if (message) {
    return <Message>{message}</Message>;
  }

  return (
    <Page>
      <Header>
        <Title>
          <FaCompass />
          Découvrir des profils
        </Title>
        <Subtitle>
          Explore des profils compatibles et découvre de nouvelles personnes.
        </Subtitle>

        <TopButton onClick={() => navigate("/home")}>
          Retour à mon compte
        </TopButton>
      </Header>

      <Section>
        {profils.length === 0 ? (
          <Empty>
            🎉 Tu as déjà parcouru toutes tes suggestions pour le moment.
            <br />
            Reviens plus tard pour découvrir de nouveaux profils.
          </Empty>
        ) : (
          profils.map((photo) => (
            <Card key={photo._id}>
              <ImageWrapper>
                {photo.avatar?.url || photo.photos?.[0]?.url ? (
                  <Images
                    src={photo.avatar?.url || photo.photos?.[0]?.url}
                    alt={photo.pseudo}
                  />
                ) : (
                  <Placeholder>
                    <FaUserCircle />
                  </Placeholder>
                )}
              </ImageWrapper>

              <Content>
                <H2>
                  {photo.pseudo}, {photo.age} ans
                </H2>

                <Ville>
                  <FaMapMarkerAlt />
                  {photo.ville}, {photo.pays}
                </Ville>

                <Bio>{photo.bio || "Aucune bio pour le moment."}</Bio>

                <FooterCard>
                  <TopInfos>
                    <MiniBadge>
                      <FaHeart />
                      {photo.recherche}
                    </MiniBadge>

                    <VoirProfilButton
                      onClick={() => navigate(`/profilpublic/${photo._id}`)}
                    >
                      <FaEye />
                      Voir profil
                    </VoirProfilButton>
                  </TopInfos>

                  <Actions>
                    <ActionButton
                      className="dislike"
                      onClick={() => handleDislike(photo._id)}
                      disabled={actionLoading === photo._id}
                      title="Passer ce profil"
                    >
                      <FaTimes />
                    </ActionButton>

                    <ActionButton
                      className="like"
                      onClick={() => handleLike(photo._id)}
                      disabled={actionLoading === photo._id}
                      title="Liker ce profil"
                    >
                      <FaHeart />
                    </ActionButton>
                  </Actions>
                </FooterCard>
              </Content>
            </Card>
          ))
        )}
      </Section>
    </Page>
  );
}

export default Decouverte;