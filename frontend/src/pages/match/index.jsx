import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styled, { keyframes } from "styled-components";
import {
  FaMapMarkerAlt,
  FaHeart,
  FaComments,
  FaEye,
  FaUserCircle,
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
// Layout
const Page = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #fff7fb, #eef2ff);
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
`;

const Subtitle = styled.p`
  color: #6b7280;
  font-size: 16px;
  max-width: 600px;
  margin: 0 auto;
`;

const Chargement = styled.h3`
  text-align: center;
  margin-top: 100px;
  font-size: 24px;
  color: #333;
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

// Full image wrapper
const ImageWrapper = styled.div`
  width: 100%;
  background: #f1f4ff;
  cursor: pointer;
`;

const Images = styled.img`
  width: 100%;
  height: auto;
  display: block;
`;

// Placeholder
const Placeholder = styled.div`
  width: 100%;
  height: 320px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 90px;
  color: #ec4899;
  background: linear-gradient(135deg, #ffe4f1, #f3e8ff);
`;

// Content
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
  background: #ffe4f1;
  color: #db2777;
  padding: 8px 14px;
  border-radius: 999px;
  font-size: 13px;
  font-weight: 600;
`;

const Actions = styled.div`
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
`;

const ActionButton = styled.button`
  flex: 1;
  min-width: 140px;
  padding: 12px 16px;
  border: none;
  border-radius: 16px;
  font-size: 14px;
  font-weight: 700;
  cursor: pointer;
  transition: 0.25s ease;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 8px;

  &:hover {
    transform: translateY(-2px);
  }

  &.profil {
    background: #eef2ff;
    color: #4f46e5;
  }

  &.message {
    background: linear-gradient(135deg, #ec4899, #f472b6);
    color: white;
    box-shadow: 0 10px 24px rgba(236, 72, 153, 0.22);
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

// ======================================
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
  overflow: auto;
  border-radius: 20px;
  position: relative;
`;

const ModalImage = styled.img`
  width: 100%;
  height: auto;
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

// ======================================
// Composant Matchs
function Matchs() {
  const [matchs, setMatchs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [topBar, setTopBar] = useState(null);
  const [modalPhoto, setModalPhoto] = useState(null);

  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchMatchs = async () => {
      try {
        setLoading(true);
        setMessage("");

        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/mesInfos/matchs`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();

        if (!res.ok) {
          setMessage(data.message || "Impossible de charger les matchs.");
          setTopBar({ type: "error", text: data.message || "Impossible de charger les matchs." });
          setTimeout(() => setTopBar(null), 4000);
          return;
        }

        setMatchs(data);
      } catch (error) {
        setMessage("Erreur : " + error.message);
        setTopBar({ type: "error", text: "Erreur : " + error.message });
        setTimeout(() => setTopBar(null), 4000);
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchMatchs();
    } else {
      setMessage("Utilisateur non connecté.");
      setTopBar({ type: "error", text: "Utilisateur non connecté." });
      setLoading(false);
    }
  }, [token]);

  if (loading) return <Chargement>Chargement des matchs...</Chargement>;
  if (message && matchs.length === 0) return <Message>{message}</Message>;

  return (
    <Page>
      {topBar && <TopBar type={topBar.type}>{topBar.text}</TopBar>}
      <Header>
        <Title>❤️ Mes Matchs</Title>
        <Subtitle>Voici les personnes avec qui le feeling est réciproque.</Subtitle>
      </Header>

      <Section>
        {matchs.length === 0 ? (
          <Empty>
            Aucun match pour le moment 💔
            <br />
            Continue à découvrir des profils pour augmenter tes chances.
          </Empty>
        ) : (
          matchs.map((profil) => (
            <Card key={profil._id}>
              <ImageWrapper onClick={() => setModalPhoto(profil.avatar?.url || profil.photos?.[0]?.url)}>
                {profil.avatar?.url || profil.photos?.[0]?.url ? (
                  <Images src={profil.avatar?.url || profil.photos?.[0]?.url} alt={profil.pseudo} />
                ) : (
                  <Placeholder>
                    <FaUserCircle />
                  </Placeholder>
                )}
              </ImageWrapper>

              <Content>
                <H2>
                  {profil.pseudo}, {profil.age} ans
                </H2>

                <Ville>
                  <FaMapMarkerAlt />
                  {profil.ville}, {profil.pays}
                </Ville>

                <Bio>{profil.bio || "Aucune bio pour le moment."}</Bio>

                <FooterCard>
                  <TopInfos>
                    <MiniBadge>
                      <FaHeart />
                      Match confirmé
                    </MiniBadge>
                  </TopInfos>

                  <Actions>
                    <ActionButton
                      className="profil"
                      onClick={() => navigate(`/profilpublic/${profil._id}`)}
                    >
                      <FaEye />
                      Voir profil
                    </ActionButton>

                    <ActionButton
                      className="message"
                      onClick={() => navigate(`/tchat/${profil._id}`)}
                    >
                      <FaComments />
                      Écrire
                    </ActionButton>
                  </Actions>
                </FooterCard>
              </Content>
            </Card>
          ))
        )}
      </Section>

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

export default Matchs;