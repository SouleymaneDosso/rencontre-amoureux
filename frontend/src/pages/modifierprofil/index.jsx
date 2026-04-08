import styled from "styled-components";
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  FaMusic,
  FaRunning,
  FaGamepad,
  FaBook,
  FaPaintBrush,
  FaSpa,
  FaPlane,
  FaArrowLeft,
  FaCheckCircle,
  FaUserEdit,
} from "react-icons/fa";

const Page = styled.main`
  min-height: 100vh;
  width: 100%;
  background: linear-gradient(135deg, #f5f7ff 0%, #eef2ff 45%, #e3ebff 100%);
  display: flex;
  justify-content: center;
  align-items: flex-start;
  padding: 40px 20px;
  margin-bottom: 80px;
`;

const Card = styled.section`
  width: 100%;
  max-width: 760px;
  background: rgba(255, 255, 255, 0.75);
  backdrop-filter: blur(14px);
  border: 1px solid rgba(255, 255, 255, 0.5);
  border-radius: 28px;
  padding: 34px;
  box-shadow: 0 18px 45px rgba(79, 108, 255, 0.12);

  @media (max-width: 768px) {
    padding: 24px 18px;
    border-radius: 22px;
  }
`;

const TopBar = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 28px;
  gap: 10px;
`;

const BackButton = styled.button`
  border: none;
  background: white;
  color: #4f6cff;
  width: 46px;
  height: 46px;
  border-radius: 50%;
  font-size: 18px;
  cursor: pointer;
  box-shadow: 0 10px 25px rgba(79, 108, 255, 0.12);
  transition: 0.25s ease;

  &:hover {
    transform: translateY(-2px);
    background: #4f6cff;
    color: white;
  }
`;

const Badge = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: #eef2ff;
  color: #4f6cff;
  padding: 10px 16px;
  border-radius: 999px;
  font-size: 14px;
  font-weight: 600;
`;

const H2 = styled.h2`
  text-align: center;
  margin: 10px 0 8px;
  font-size: 32px;
  font-weight: 800;
  color: #1f2a44;
`;

const P = styled.p`
  text-align: center;
  color: #6b7280;
  font-size: 15px;
  margin-bottom: 28px;
`;

const Formulaire = styled.form`
  display: flex;
  flex-direction: column;
  gap: 26px;
`;

const Block = styled.div`
  background: rgba(255, 255, 255, 0.78);
  border: 1px solid #edf1ff;
  border-radius: 22px;
  padding: 22px;
  box-shadow: 0 10px 30px rgba(79, 108, 255, 0.06);
`;

const Bioh3 = styled.h3`
  margin: 0 0 14px;
  color: #1f2a44;
  font-size: 18px;
  font-weight: 700;
`;

const Label = styled.p`
  font-size: 14px;
  color: #6b7280;
  margin-bottom: 14px;
`;

const Input = styled.textarea`
  width: 100%;
  border: 1.5px solid #d8e0ff;
  border-radius: 18px;
  padding: 16px;
  min-height: 140px;
  resize: none;
  font-size: 15px;
  line-height: 1.6;
  color: #1f2a44;
  background: #fbfcff;
  outline: none;
  transition: 0.25s ease;
  box-sizing: border-box;

  &:focus {
    border-color: #4f6cff;
    box-shadow: 0 0 0 4px rgba(79, 108, 255, 0.12);
    background: white;
  }

  &::placeholder {
    color: #a0a7bd;
  }
`;

const Counter = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-top: 10px;
  font-size: 13px;
  color: ${({ danger }) => (danger ? "#e63946" : "#7b849d")};
`;

const ChipsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-top: 12px;
`;

const Chip = styled.button`
  border: 1.5px solid ${({ active }) => (active ? "#4f6cff" : "#d9e1ff")};
  background: ${({ active }) =>
    active
      ? "linear-gradient(135deg, #4f6cff, #6f86ff)"
      : "rgba(255,255,255,0.92)"};
  color: ${({ active }) => (active ? "white" : "#4f6cff")};
  border-radius: 999px;
  padding: 12px 18px;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 10px;
  font-weight: 600;
  font-size: 14px;
  transition: 0.25s ease;
  box-shadow: ${({ active }) =>
    active ? "0 10px 22px rgba(79,108,255,0.22)" : "none"};

  &:hover {
    transform: translateY(-2px) scale(1.02);
  }
`;

const FooterActions = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 14px;
  flex-wrap: wrap;
`;

const SecondaryButton = styled.button`
  border: none;
  background: white;
  color: #4f6cff;
  padding: 14px 22px;
  border-radius: 16px;
  font-weight: 700;
  cursor: pointer;
  box-shadow: 0 10px 25px rgba(79, 108, 255, 0.08);
  transition: 0.25s ease;

  &:hover {
    transform: translateY(-2px);
  }
`;

const SubmitButton = styled.button`
  border: none;
  background: linear-gradient(135deg, #4f6cff, #6f86ff);
  color: white;
  padding: 15px 28px;
  border-radius: 18px;
  font-weight: 800;
  font-size: 15px;
  cursor: pointer;
  box-shadow: 0 14px 30px rgba(79, 108, 255, 0.28);
  transition: 0.25s ease;
  min-width: 180px;

  &:hover {
    transform: translateY(-2px) scale(1.01);
  }

  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
    transform: none;
  }
`;

const Message = styled.div`
  margin-top: 18px;
  padding: 14px 18px;
  border-radius: 16px;
  font-size: 14px;
  font-weight: 600;
  background: ${({ type }) =>
    type === "error" ? "#ffe9ec" : "#eaf8ef"};
  color: ${({ type }) =>
    type === "error" ? "#d7263d" : "#1f8f4e"};
  border: 1px solid
    ${({ type }) => (type === "error" ? "#ffc7cf" : "#ccefd8")};
`;

const LoadingBox = styled.div`
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: linear-gradient(135deg, #f5f7ff, #eef2ff);
  color: #4f6cff;
  font-size: 18px;
  font-weight: 700;
`;

function Modifier() {
  const [bio, setBio] = useState("");
  const [interet, setInteret] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });

  const { id } = useParams();
  const navigate = useNavigate();

  const token = localStorage.getItem("token");

  const categories = [
    { label: "musique", icon: <FaMusic /> },
    { label: "sport", icon: <FaRunning /> },
    { label: "jeux-video", icon: <FaGamepad /> },
    { label: "lecture", icon: <FaBook /> },
    { label: "dessin", icon: <FaPaintBrush /> },
    { label: "yoga", icon: <FaSpa /> },
    { label: "voyage", icon: <FaPlane /> },
  ];

  useEffect(() => {
    const fetchProfil = async () => {
      try {
        setLoading(true);
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/mesInfos/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();

        if (res.ok) {
          setBio(data.bio || "");
          setInteret(data.centresInteret || []);
        } else {
          setMessage({
            text: data.message || "Impossible de charger le profil.",
            type: "error",
          });
        }
      } catch (error) {
        setMessage({
          text: "Erreur réseau lors du chargement." + error.message,
          type: "error",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchProfil();
  }, [id, token]);

  const toggleInteret = (label) => {
    setInteret((prev) =>
      prev.includes(label)
        ? prev.filter((item) => item !== label)
        : [...prev, label]
    );
  };

  const publierInfos = async (e) => {
    e.preventDefault();
    setMessage({ text: "", type: "" });

    if (!bio.trim() && interet.length === 0) {
      setMessage({
        text: "Ajoute au moins une bio ou un centre d’intérêt.",
        type: "error",
      });
      return;
    }

    try {
      setSaving(true);

      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/mesInfos/edit/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          bio: bio.trim(),
          centresInteret: interet,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage({
          text: "Profil mis à jour avec succès.",
          type: "success",
        });

        setTimeout(() => {
          navigate(`/${id}`);
        }, 900);
      } else {
        setMessage({
          text: data.message || "La mise à jour a échoué.",
          type: "error",
        });
      }
    } catch (error) {
      setMessage({
        text: "Erreur réseau lors de l’enregistrement." + error.message,
        type: "error",
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <LoadingBox>Chargement de votre profil...</LoadingBox>;
  }

  return (
    <Page>
      <Card>
        <TopBar>
          <BackButton type="button" onClick={() => navigate(`/${id}`)}>
            <FaArrowLeft />
          </BackButton>

          <Badge>
            <FaUserEdit />
            Modifier mon profil
          </Badge>
        </TopBar>

        <H2>Personnalise ton profil</H2>
        <P>
          Ajoute une bio sympa et choisis ce que tu aimes pour rendre ton profil
          plus vivant.
        </P>

        <Formulaire onSubmit={publierInfos}>
          <Block>
            <Bioh3>Ta bio</Bioh3>
            <Label>
              Écris quelques lignes sur toi, ton style, ton énergie ou ce que tu
              recherches.
            </Label>

            <Input
              maxLength={220}
              placeholder="Exemple : J’aime les discussions profondes, les voyages, la bonne musique et les personnes sincères..."
              value={bio}
              onChange={(e) => setBio(e.target.value)}
            />

            <Counter danger={bio.length > 200}>{bio.length}/220</Counter>
          </Block>

          <Block>
            <Bioh3>Centres d’intérêt</Bioh3>
            <Label>
              Sélectionne ce qui te représente le mieux.
            </Label>

            <ChipsContainer>
              {categories.map((item) => (
                <Chip
                  key={item.label}
                  type="button"
                  active={interet.includes(item.label)}
                  onClick={() => toggleInteret(item.label)}
                >
                  {item.icon} {item.label}
                </Chip>
              ))}
            </ChipsContainer>
          </Block>

          <FooterActions>
            <SecondaryButton type="button" onClick={() => navigate(`/${id}`)}>
              Annuler
            </SecondaryButton>

            <SubmitButton type="submit" disabled={saving}>
              {saving ? "Enregistrement..." : "Mettre mon profil à jour"}
            </SubmitButton>
          </FooterActions>

          {message.text && (
            <Message type={message.type}>
              {message.type === "success" && <FaCheckCircle />} {message.text}
            </Message>
          )}
        </Formulaire>
      </Card>
    </Page>
  );
}

export default Modifier;