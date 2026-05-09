import { useEffect, useState } from "react";
import styled, { keyframes, createGlobalStyle } from "styled-components";
import { useNavigate } from "react-router-dom";
import {
  FaCamera,
  FaMapMarkerAlt,
  FaGlobe,
  FaBirthdayCake,
  FaHeart,
  FaPlus,
  FaTrash,
  FaEllipsisH,
} from "react-icons/fa";

const GlobalStyle = createGlobalStyle`
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;600;700&family=DM+Sans:wght@300;400;500;600&display=swap');
`;

/* ────────── ANIMATIONS ────────── */
const fadeUp = keyframes`
  from { opacity: 0; transform: translateY(24px); }
  to   { opacity: 1; transform: translateY(0); }
`;

const shimmer = keyframes`
  0%   { background-position: -400px 0; }
  100% { background-position: 400px 0; }
`;

const pulse = keyframes`
  0%, 100% { box-shadow: 0 0 0 0 rgba(212, 175, 55, 0.35); }
  50%       { box-shadow: 0 0 0 12px rgba(212, 175, 55, 0); }
`;

const float = keyframes`
  0%, 100% { transform: translateY(0px); }
  50%       { transform: translateY(-6px); }
`;

/* ────────── LAYOUT ────────── */
const Page = styled.div`
  width: 100%;
  min-height: 100vh;
  background: #0d0d0f;
  background-image:
    radial-gradient(ellipse 80% 60% at 50% -20%, rgba(212,175,55,0.08) 0%, transparent 70%),
    radial-gradient(ellipse 40% 40% at 90% 80%, rgba(212,175,55,0.04) 0%, transparent 60%);
  display: flex;
  justify-content: center;
  font-family: 'DM Sans', sans-serif;
  margin-bottom: 80px;
`;

const Main = styled.main`
  width: 100%;
  max-width: 760px;
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

/* ────────── HERO ────────── */
const ProfileHero = styled.div`
  text-align: center;
  background: linear-gradient(160deg, #1a1a1f 0%, #141416 100%);
  border: 1px solid rgba(212, 175, 55, 0.18);
  border-radius: 32px;
  padding: 48px 32px 36px;
  position: relative;
  overflow: hidden;
  animation: ${fadeUp} 0.7s ease both;

  &::before {
    content: '';
    position: absolute;
    top: 0; left: 0; right: 0;
    height: 1px;
    background: linear-gradient(90deg, transparent, rgba(212,175,55,0.6), transparent);
  }
`;

const AvatarRing = styled.div`
  width: 128px;
  height: 128px;
  border-radius: 50%;
  margin: 0 auto 24px;
  padding: 3px;
  background: linear-gradient(135deg, #d4af37, #f5d060, #b8860b);
  animation: ${pulse} 3s ease infinite;
  position: relative;
  display: inline-block;
`;

const AvatarInner = styled.div`
  width: 100%;
  height: 100%;
  border-radius: 50%;
  overflow: hidden;
  background: #1f1f24;
  position: relative;
`;

const Avatar = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const CameraButton = styled.label`
  position: absolute;
  bottom: 4px;
  right: 4px;
  background: #d4af37;
  color: #0d0d0f;
  width: 34px;
  height: 34px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 14px;
  border: 2px solid #0d0d0f;
  transition: transform 0.2s ease, background 0.2s ease;

  &:hover {
    transform: scale(1.1);
    background: #f5d060;
  }
`;

const MessageAvatar = styled.div`
  width: 100%;
  height: 100%;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: 500;
  color: rgba(212, 175, 55, 0.5);
  letter-spacing: 0.04em;
`;

const Name = styled.h1`
  font-family: 'Cormorant Garamond', serif;
  font-size: 38px;
  font-weight: 700;
  color: #f0e8d0;
  margin: 0 0 6px;
  letter-spacing: -0.01em;
`;

const BioBox = styled.p`
  color: rgba(240, 232, 208, 0.5);
  font-size: 14px;
  font-weight: 300;
  line-height: 1.8;
  max-width: 440px;
  margin: 0 auto 28px;
  letter-spacing: 0.02em;
`;

const EditButton = styled.button`
  background: transparent;
  border: 1px solid rgba(212, 175, 55, 0.45);
  color: #d4af37;
  padding: 12px 28px;
  border-radius: 999px;
  font-family: 'DM Sans', sans-serif;
  font-size: 13px;
  font-weight: 500;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  cursor: pointer;
  transition: all 0.25s ease;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background: rgba(212, 175, 55, 0.08);
    opacity: 0;
    transition: opacity 0.25s ease;
  }

  &:hover {
    border-color: #d4af37;
    color: #f5d060;
    &::before { opacity: 1; }
  }
`;

/* ────────── PROGRESS ────────── */
const ProgressCard = styled.div`
  background: #141416;
  border: 1px solid rgba(212, 175, 55, 0.12);
  border-radius: 24px;
  padding: 24px 28px;
  animation: ${fadeUp} 0.7s 0.1s ease both;
`;

const ProgressHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
`;

const ProgressLabel = styled.span`
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: rgba(240, 232, 208, 0.4);
`;

const ProgressValue = styled.span`
  font-family: 'Cormorant Garamond', serif;
  font-size: 28px;
  font-weight: 700;
  color: #d4af37;
`;

const ProgressTrack = styled.div`
  width: 100%;
  height: 4px;
  background: rgba(255,255,255,0.05);
  border-radius: 999px;
  overflow: hidden;
`;

const ProgressFill = styled.div`
  height: 100%;
  width: ${({ progress }) => progress}%;
  background: linear-gradient(90deg, #b8860b, #d4af37, #f5d060);
  border-radius: 999px;
  transition: width 0.8s cubic-bezier(0.4,0,0.2,1);
  background-size: 200% auto;
  animation: ${shimmer} 2s linear infinite;
`;

const ProgressHint = styled.p`
  margin-top: 10px;
  font-size: 12px;
  color: rgba(240, 232, 208, 0.35);
  letter-spacing: 0.02em;
`;

const SuccessCard = styled.div`
  background: linear-gradient(135deg, rgba(212,175,55,0.08), rgba(212,175,55,0.03));
  border: 1px solid rgba(212, 175, 55, 0.3);
  border-radius: 24px;
  padding: 24px 28px;
  animation: ${fadeUp} 0.5s ease both;
`;

const SuccessTitle = styled.h3`
  font-family: 'Cormorant Garamond', serif;
  font-size: 22px;
  color: #d4af37;
  margin: 0 0 6px;
`;

const SuccessText = styled.p`
  font-size: 13px;
  color: rgba(212, 175, 55, 0.6);
  margin: 0;
`;

/* ────────── CARDS ────────── */
const Card = styled.section`
  background: #141416;
  border: 1px solid rgba(255,255,255,0.06);
  border-radius: 24px;
  padding: 28px;
  animation: ${fadeUp} 0.7s ease both;
  animation-delay: ${({ delay }) => delay || '0s'};

  &:hover {
    border-color: rgba(212,175,55,0.14);
    transition: border-color 0.3s ease;
  }
`;

const SectionLabel = styled.h3`
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: rgba(240, 232, 208, 0.3);
  margin: 0 0 20px;
`;

/* ────────── INFO GRID ────────── */
const InfoGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
  gap: 12px;
`;

const InfoBox = styled.div`
  background: rgba(255,255,255,0.03);
  border: 1px solid rgba(255,255,255,0.06);
  border-radius: 16px;
  padding: 16px;
  display: flex;
  align-items: center;
  gap: 12px;
  transition: all 0.25s ease;
  animation: ${float} 4s ease infinite;
  animation-delay: ${({ i }) => i * 0.4}s;

  &:hover {
    background: rgba(212, 175, 55, 0.05);
    border-color: rgba(212, 175, 55, 0.2);
    transform: translateY(-2px);
  }

  svg {
    color: #d4af37;
    font-size: 15px;
    flex-shrink: 0;
  }
`;

const InfoText = styled.div``;
const InfoKey = styled.div`
  font-size: 10px;
  font-weight: 600;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: rgba(240, 232, 208, 0.3);
  margin-bottom: 2px;
`;
const InfoVal = styled.div`
  font-size: 14px;
  font-weight: 500;
  color: rgba(240, 232, 208, 0.85);
`;

/* ────────── CHIPS ────────── */
const ChipsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
`;

const Chip = styled.span`
  padding: 8px 16px;
  border-radius: 999px;
  background: rgba(212, 175, 55, 0.07);
  border: 1px solid rgba(212, 175, 55, 0.2);
  color: rgba(212, 175, 55, 0.8);
  font-size: 12px;
  font-weight: 500;
  letter-spacing: 0.04em;
  transition: all 0.2s ease;

  &:hover {
    background: rgba(212, 175, 55, 0.14);
    border-color: rgba(212, 175, 55, 0.4);
    color: #d4af37;
  }
`;

/* ────────── PHOTOS ────────── */
const PhotosHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
`;

const AddPhotoButton = styled.label`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  cursor: pointer;
  color: #d4af37;
  background: rgba(212, 175, 55, 0.08);
  border: 1px solid rgba(212, 175, 55, 0.25);
  padding: 10px 18px;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  transition: all 0.25s ease;

  &:hover {
    background: rgba(212, 175, 55, 0.15);
    border-color: rgba(212, 175, 55, 0.5);
  }

  svg { font-size: 11px; }
`;

const PhotoGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
  gap: 12px;
`;

const ImageWrapper = styled.div`
  position: relative;
  overflow: hidden;
  height: 200px;
  border-radius: 18px;
  background: rgba(255,255,255,0.03);
  border: 1px solid rgba(255,255,255,0.06);
  transition: all 0.3s ease;

  &:hover {
    border-color: rgba(212,175,55,0.25);
    transform: translateY(-4px);
    box-shadow: 0 20px 40px rgba(0,0,0,0.4);
  }
`;

const PhotoImg = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.4s ease;

  ${ImageWrapper}:hover & {
    transform: scale(1.05);
  }
`;

const PhotoMenuBtn = styled.button`
  position: absolute;
  top: 10px;
  right: 10px;
  background: rgba(0,0,0,0.55);
  backdrop-filter: blur(8px);
  border: none;
  color: rgba(240,232,208,0.8);
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 13px;
  transition: all 0.2s ease;

  &:hover {
    background: rgba(0,0,0,0.75);
    color: #d4af37;
  }
`;

const PhotoDropdown = styled.ul`
  position: absolute;
  top: 46px;
  right: 10px;
  z-index: 10;
  background: #1e1e23;
  border: 1px solid rgba(255,255,255,0.1);
  border-radius: 12px;
  padding: 6px;
  margin: 0;
  list-style: none;
  min-width: 130px;
  box-shadow: 0 16px 40px rgba(0,0,0,0.5);
  opacity: ${({ open }) => (open ? 1 : 0)};
  transform: ${({ open }) => (open ? 'translateY(0)' : 'translateY(-8px)')};
  visibility: ${({ open }) => (open ? 'visible' : 'hidden')};
  pointer-events: ${({ open }) => (open ? 'auto' : 'none')};
  transition: all 0.2s ease;
`;

const DropdownItem = styled.li`
  padding: 9px 12px;
  display: flex;
  align-items: center;
  gap: 8px;
  color: #e05c5c;
  font-size: 13px;
  font-weight: 500;
  border-radius: 8px;
  cursor: pointer;
  transition: background 0.15s ease;

  &:hover {
    background: rgba(224, 92, 92, 0.1);
  }
`;

/* ────────── LIGHTBOX ────────── */
const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.92);
  backdrop-filter: blur(12px);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const LightboxImage = styled.img`
  max-width: 88%;
  max-height: 88vh;
  border-radius: 16px;
  object-fit: contain;
  box-shadow: 0 40px 80px rgba(0,0,0,0.8);
`;

const CloseButton = styled.button`
  position: absolute;
  top: 24px;
  right: 24px;
  background: rgba(255,255,255,0.08);
  border: 1px solid rgba(255,255,255,0.12);
  color: rgba(240,232,208,0.7);
  width: 42px;
  height: 42px;
  border-radius: 50%;
  font-size: 18px;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: rgba(255,255,255,0.14);
    color: white;
  }
`;

/* ────────── LOADING ────────── */
const LoadingPage = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #0d0d0f;
  color: rgba(212, 175, 55, 0.5);
  font-family: 'DM Sans', sans-serif;
  font-size: 14px;
  letter-spacing: 0.08em;
  text-transform: uppercase;
`;

const Divider = styled.div`
  height: 1px;
  background: linear-gradient(90deg, transparent, rgba(212,175,55,0.15), transparent);
  margin: 4px 0;
`;

/* ════════════════════════════════ COMPONENT ════════════════════════════════ */
function Home() {
  const [profil, setProfil] = useState(null);
  const [interet, setInteret] = useState([]);
  const [modal, setModal] = useState(false);
  const [imageActive, setImageActive] = useState(null);
  const [modaldelete, setmodalDelete] = useState(null);
  const [progress, setProgress] = useState(0);
  const [afficher, setAfficher] = useState(false);
  const navigate = useNavigate();

  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) navigate("/connexion");
  }, [token, navigate]);

  const ouvririmage = (image) => { setImageActive(image); setModal(true); };
  const fermerimage = () => { setImageActive(null); setModal(false); };

  const suppression = async (public_id) => {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/mesInfos/photo/${profil._id}/${encodeURIComponent(public_id)}`,
        { method: "DELETE", headers: { Authorization: `Bearer ${token}` } }
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      setProfil((prev) => ({
        ...prev,
        photos: prev.photos.filter((p) => p.public_id !== public_id),
        avatar: prev.avatar?.public_id === public_id ? null : prev.avatar,
      }));
    } catch (err) { console.error(err.message); }
  };

  const fetchAvatar = async (e) => {
    const file = e.target.files[0];
    if (!file || !profil) return;
    const formdata = new FormData();
    formdata.append("avatar", file);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/mesInfos/avatar/${profil._id}`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` },
        body: formdata,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      setProfil(data);
    } catch (error) { console.error(error.message); }
    e.target.value = "";
  };

  const uploadMultiple = async (e) => {
    const files = e.target.files;
    if (!files.length || !profil) return;
    const formdata = new FormData();
    for (let i = 0; i < files.length; i++) formdata.append("photos", files[i]);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/mesInfos/${profil._id}`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` },
        body: formdata,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      setProfil(data);
    } catch (error) { console.error(error.message); }
    e.target.value = "";
  };

  useEffect(() => {
    const fetchProfil = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/mesInfos/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || "Erreur chargement profil");
        setProfil(data);
        setInteret(data.centresInteret || []);
      } catch (error) { console.error(error.message); }
    };
    if (token) fetchProfil();
  }, [token]);

  useEffect(() => {
    if (!profil) return;
    let score = 0;
    if (profil.avatar) score += 20;
    if (profil.bio?.trim()) score += 20;
    if (profil.ville?.trim()) score += 10;
    if (profil.pays?.trim()) score += 10;
    if (profil.age) score += 10;
    if (profil.recherche?.trim()) score += 10;
    if (profil.centresInteret?.length > 0) score += 10;
    if (profil.photos?.length > 0) score += 10;
    setProgress(score);

    const dejaMontre = localStorage.getItem("message100");
    if (score === 100 && !dejaMontre) {
      setAfficher(true);
      localStorage.setItem("message100", "oui");
      const t = setTimeout(() => setAfficher(false), 5000);
      return () => clearTimeout(t);
    }
  }, [profil]);

  if (!profil) return <LoadingPage>Chargement du profil…</LoadingPage>;

  const messageProgress =
    progress < 50
      ? "Quelques infos manquent encore pour capter l'attention."
      : progress < 80
      ? "Beau début — affinez encore pour vous démarquer."
      : "Profil presque parfait. Peaufinez les derniers détails.";

  return (
    <>
      <GlobalStyle />
      <Page>
        <Main>

          {/* ── HERO ── */}
          <ProfileHero>
            <AvatarRing>
              <AvatarInner>
                {profil.avatar
                  ? <Avatar src={profil.avatar.url} alt="avatar" />
                  : <MessageAvatar>Photo</MessageAvatar>}
              </AvatarInner>
              <CameraButton htmlFor="avatarInput">
                <FaCamera />
              </CameraButton>
              <input type="file" id="avatarInput" style={{ display: "none" }} onChange={fetchAvatar} />
            </AvatarRing>

            <Name>{profil.prenom} {profil.nom}</Name>
            <BioBox>{profil.bio || "Pas encore de bio — ajoutez quelques mots sur vous."}</BioBox>

            <EditButton onClick={() => navigate(`/modifier/${profil._id}`)}>
              Compléter le profil
            </EditButton>
          </ProfileHero>

          {/* ── PROGRESS ── */}
          {progress < 100 && (
            <ProgressCard>
              <ProgressHeader>
                <ProgressLabel>Complétude du profil</ProgressLabel>
                <ProgressValue>{progress}%</ProgressValue>
              </ProgressHeader>
              <ProgressTrack>
                <ProgressFill progress={progress} />
              </ProgressTrack>
              <ProgressHint>{messageProgress}</ProgressHint>
            </ProgressCard>
          )}

          {afficher && (
            <SuccessCard>
              <SuccessTitle>✦ Profil complété à 100 %</SuccessTitle>
              <SuccessText>Votre profil est optimisé et prêt à briller.</SuccessText>
            </SuccessCard>
          )}

          {/* ── INFOS ── */}
          <Card delay="0.15s">
            <SectionLabel>Informations personnelles</SectionLabel>
            <InfoGrid>
              {[
                { icon: <FaBirthdayCake />, label: "Âge", val: `${profil.age} ans` },
                { icon: <FaHeart />,        label: "Recherche", val: profil.recherche },
                { icon: <FaGlobe />,        label: "Pays",  val: profil.pays },
                { icon: <FaMapMarkerAlt />, label: "Ville", val: profil.ville },
              ].map(({ icon, label, val }, i) => (
                <InfoBox key={label} i={i}>
                  {icon}
                  <InfoText>
                    <InfoKey>{label}</InfoKey>
                    <InfoVal>{val || "—"}</InfoVal>
                  </InfoText>
                </InfoBox>
              ))}
            </InfoGrid>
          </Card>

          {/* ── INTÉRÊTS ── */}
          <Card delay="0.2s">
            <SectionLabel>Centres d'intérêt</SectionLabel>
            {interet.length > 0
              ? <ChipsContainer>{interet.map((a) => <Chip key={a}>{a}</Chip>)}</ChipsContainer>
              : <p style={{ fontSize: 13, color: "rgba(240,232,208,0.25)", margin: 0 }}>Aucun centre d'intérêt renseigné.</p>
            }
          </Card>

          {/* ── PHOTOS ── */}
          <Card delay="0.25s">
            <PhotosHeader>
              <SectionLabel style={{ margin: 0 }}>Galerie photos</SectionLabel>
              <AddPhotoButton htmlFor="photosInput">
                <FaPlus /> Ajouter
              </AddPhotoButton>
              <input type="file" id="photosInput" multiple style={{ display: "none" }} onChange={uploadMultiple} />
            </PhotosHeader>

            <Divider />

            {modal && imageActive && (
              <Overlay onClick={fermerimage}>
                <CloseButton onClick={fermerimage}>✕</CloseButton>
                <LightboxImage src={imageActive.url} alt="agrandie" onClick={(e) => e.stopPropagation()} />
              </Overlay>
            )}

            <PhotoGrid style={{ marginTop: 16 }}>
              {profil.photos?.map((image) => (
                <ImageWrapper key={image.public_id}>
                  <PhotoImg src={image.url} alt={profil.nom} onClick={() => ouvririmage(image)} style={{ cursor: "pointer" }} />
                  <PhotoMenuBtn
                    onClick={(e) => {
                      e.stopPropagation();
                      setmodalDelete(modaldelete === image.public_id ? null : image.public_id);
                    }}
                  >
                    <FaEllipsisH />
                  </PhotoMenuBtn>
                  <PhotoDropdown open={modaldelete === image.public_id}>
                    <DropdownItem
                      onClick={(e) => {
                        e.stopPropagation();
                        suppression(image.public_id);
                        setmodalDelete(null);
                      }}
                    >
                      <FaTrash /> Supprimer
                    </DropdownItem>
                  </PhotoDropdown>
                </ImageWrapper>
              ))}

              {(!profil.photos || profil.photos.length === 0) && (
                <p style={{ fontSize: 13, color: "rgba(240,232,208,0.2)", margin: "16px 0 0", gridColumn: "1/-1" }}>
                  Aucune photo — ajoutez vos plus belles photos.
                </p>
              )}
            </PhotoGrid>
          </Card>

        </Main>
      </Page>
    </>
  );
}

export default Home;
