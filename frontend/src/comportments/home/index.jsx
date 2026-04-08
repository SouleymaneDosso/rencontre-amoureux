import { useEffect, useState } from "react";
import styled from "styled-components";
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

const Page = styled.div`
  width: 100%;
  background: linear-gradient(135deg, #f8f9ff, #e6ecff);
  display: flex;
  justify-content: center;
  padding: 20px;
  margin-bottom: 80px;
`;

const Header = styled.div`
  text-align: center;
  background: white;
  padding: 40px 30px;
  border-radius: 28px;
  box-shadow: 0 10px 35px rgba(79, 108, 255, 0.08);
  position: relative;
  overflow: hidden;
`;

const Name = styled.h1`
  font-size: 32px;
  margin-top: 20px;
  margin-bottom: 8px;
  color: #1f2a44;
  font-weight: 800;
`;

const AvatarWrapper = styled.div`
  position: relative;
  width: 170px;
  height: 170px;
  margin: 0 auto;
  border-radius: 50%;
  padding: 6px;
  background: linear-gradient(135deg, #4f6cff, #8ea2ff);
  box-shadow: 0 12px 30px rgba(79, 108, 255, 0.25);
`;

const Avatar = styled.img`
  width: 100%;
  height: 100%;
  border-radius: 50%;
  object-fit: cover;
  border: 4px solid white;
`;
const CameraButton = styled.label`
  position: absolute;
  bottom: 8px;
  right: 8px;
  background: #4f6cff;
  color: white;
  padding: 10px;
  border-radius: 50%;
  cursor: pointer;
`;

const InfoGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 15px;
  margin-top: 30px;
`;

const InfoBox = styled.div`
  background: #f9fbff;
  padding: 18px;
  border-radius: 18px;
  display: flex;
  align-items: center;
  gap: 12px;
  font-weight: 600;
  font-size: 14px;
  color: #2b3551;
  border: 1px solid #edf1ff;
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease;

  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 10px 20px rgba(79, 108, 255, 0.08);
  }
`;

const PhotosSection = styled.div`
  margin-top: 40px;
`;

const PhotoGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
  gap: 15px;
  margin-top: 20px;
`;

const ImageWrapper = styled.div`
  position: relative;
  overflow: hidden;
  height: 300px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f1f4ff;
  border-radius: 22px;
  border: 1px solid #edf1ff;
  transition:
    transform 0.25s ease,
    box-shadow 0.25s ease;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 16px 30px rgba(31, 42, 68, 0.1);
  }
`;

const Image = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;

  ${ImageWrapper}:hover & {
    transform: scale(1.04);
  }
`;
// boutonsupprimer de la photo

const Boutton = styled.button`
  display: flex;
  position: absolute;
  border: none;
  background: rgba(0, 0, 0, 0.35);
  backdrop-filter: blur(6px);
  top: 12px;
  right: 12px;
  font-size: 16px;
  color: white;
  cursor: pointer;
  transition: 0.25s ease;
  width: 38px;
  height: 38px;
  border-radius: 50%;
  align-items: center;
  justify-content: center;

  &:hover {
    background: rgba(0, 0, 0, 0.5);
  }
`;

const MoalImages = styled.ul`
  display: flex;
  flex-direction: column;
  z-index: 10;
  position: absolute;
  top: 40px;
  right: 10px;
  background: white;
  min-width: 130px;
  color: black;
  list-style: none;
  padding: 8px 0;
  margin: 0;
  border-radius: 10px;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);

  opacity: ${({ open }) => (open ? 1 : 0)};
  transform: ${({ open }) => (open ? "translateY(0)" : "translateY(-8px)")};
  visibility: ${({ open }) => (open ? "visible" : "hidden")};
  pointer-events: ${({ open }) => (open ? "auto" : "none")};
  transition:
    opacity 0.25s ease,
    transform 0.25s ease,
    visibility 0.25s ease;
`;

const ItemBoutton = styled.li`
  padding: 10px 14px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  color: red;
  font-weight: 600;

  &:hover {
    background: #f8f8f8;
  }
`;

// fin

const AddPhotoButton = styled.label`
  display: inline-flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  color: white;
  background: linear-gradient(135deg, #4f6cff, #6f88ff);
  width: 52px;
  height: 52px;
  border-radius: 16px;
  font-size: 20px;
  box-shadow: 0 10px 24px rgba(79, 108, 255, 0.22);
  transition: all 0.25s ease;

  &:hover {
    transform: translateY(-2px);
  }
`;

const MessageAvatar = styled.div`
  width: 100%;
  height: 100%;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 14px;
  font-weight: 600;
  font-size: 14px;
  color: #4f6cff;
  background: white;
  border: 4px solid white;
`;

const BioBox = styled.section`
  margin-top: 18px;
  max-width: 620px;
  margin-left: auto;
  margin-right: auto;
  color: #5f6b85;
  font-size: 15px;
  line-height: 1.7;
`;
const InterestsWrapper = styled.div`
  margin-top: 25px;
`;

const SectionTitle = styled.h3`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const ChipsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 12px;
`;

const Chip = styled.span`
  padding: 10px 16px;
  border-radius: 999px;
  border: 1px solid #dce4ff;
  background: ${({ active }) => (active ? "#eef2ff" : "white")};
  color: #4f6cff;
  font-size: 13px;
  font-weight: 600;
`;

const Modification = styled.p`
  padding-top: 14px;
`;
const Boutonmodifier = styled.button`
  border: none;
  background: linear-gradient(135deg, #4f6cff, #6f88ff);
  color: white;
  padding: 14px 22px;
  border-radius: 16px;
  font-weight: 700;
  font-size: 15px;
  cursor: pointer;
  box-shadow: 0 10px 24px rgba(79, 108, 255, 0.22);
  transition: all 0.25s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 14px 30px rgba(79, 108, 255, 0.28);
  }
`;
const Span = styled.span``;

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.85);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  padding: 20px;
`;
const Main = styled.main`
  width: 100%;
  max-width: 1100px;
  display: flex;
  flex-direction: column;
  gap: 28px;
`;

const ModalImage = styled.img`
  max-width: 90%;
  max-height: 90vh;
  border-radius: 18px;
  object-fit: contain;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.4);
`;

const CloseButton = styled.button`
  position: absolute;
  top: 25px;
  right: 25px;
  background: rgba(255, 255, 255, 0.15);
  color: white;
  border: none;
  font-size: 28px;
  width: 45px;
  height: 45px;
  border-radius: 50%;
  cursor: pointer;
`;
const Conteneur = styled.section`
  margin-top: 30px;
  width: 100%;
  max-width: 650px;
  margin-left: auto;
  margin-right: auto;
  background: #f8faff;
  border: 1px solid #edf1ff;
  border-radius: 22px;
  padding: 24px;
  font-family: Arial, sans-serif;
`;
const Topbarre = styled.div`
  width: 100%;
  background: #e6ebff;
  border-radius: 999px;
  margin-top: 12px;
  height: 16px;
  overflow: hidden;
`;
const Interrieur = styled.div`
  height: 100%;
  width: ${({ progress }) => progress}%;
  background: ${({ progress }) =>
    progress < 50
      ? "linear-gradient(90deg, #ff6b6b, #ff8e8e)"
      : progress < 80
        ? "linear-gradient(90deg, #ffb347, #ffd166)"
        : "linear-gradient(90deg, #2ecc71, #7bed9f)"};
  transition: width 0.5s ease;
  border-radius: 999px;
`;
const ProgressTitle = styled.h3`
  font-size: 18px;
  font-weight: 700;
  color: #1f2a44;
  margin: 0;
`;

const ProgressText = styled.p`
  margin-top: 10px;
  font-size: 14px;
  color: #6b7280;
  line-height: 1.6;
`;
const Card = styled.section`
  background: white;
  border-radius: 24px;
  padding: 28px;
  box-shadow: 0 10px 30px rgba(31, 42, 68, 0.06);
`;

const SuccessTitle = styled.h3`
  margin: 0;
  font-size: 20px;
  font-weight: 800;
  color: #1f7a4d;
`;

const SuccessText = styled.p`
  margin-top: 10px;
  font-size: 14px;
  color: #4b6b58;
  line-height: 1.6;
`;
const Container = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-bottom: 50px;
`;

const Deconnexion = styled.button`
  background: red;
  color: white;
  border: none;
  padding: 10px 20px;
`;

function Home() {
  const [profil, setProfil] = useState(null);
  const [interet, setInteret] = useState([]);
  const [modal, setModal] = useState(false);
  const [imageActive, setImageActive] = useState(null);
  const [modaldelete, setmodalDelete] = useState(null);
  const [progress, setProgress] = useState(0);
  const [afficher, setAfficher] = useState(false)
  const navigate = useNavigate();

  const token = localStorage.getItem("token");
  useEffect(() => {
  if (!token) {
    navigate("/connexion");
  }
}, [token, navigate]);

  const ouvririmage = (image) => {
    setImageActive(image);
    setModal(true);
  };

const deconnexion = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("userId");
  navigate("/connexion");
};

  const fermerimage = () => {
    setImageActive(null);
    setModal(false);
  };

 const suppression = async (public_id) => {
  try {
    const res = await fetch(
      `${import.meta.env.VITE_API_URL}/api/mesInfos/photo/${profil._id}/${encodeURIComponent(public_id)}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const data = await res.json();
    if (!res.ok) throw new Error(data.message);

    setProfil((prev) => ({
      ...prev,
      photos: prev.photos.filter((photo) => photo.public_id !== public_id),
      avatar: prev.avatar?.public_id === public_id ? null : prev.avatar,
    }));
  } catch (err) {
    console.error(err.message);
  }
};

 const fetchAvatar = async (e) => {
  const file = e.target.files[0];
  if (!file || !profil) return;

  const formdata = new FormData();
  formdata.append("avatar", file);

  try {
    const res = await fetch(`${import.meta.env.VITE_API_URL}/api/mesInfos/avatar/${profil._id}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formdata,
    });

    const data = await res.json();

    if (!res.ok) throw new Error(data.message);

    setProfil(data);
  } catch (error) {
    console.error(error.message);
  }

  e.target.value = "";
};

const uploadMultiple = async (e) => {
  const files = e.target.files;
  if (!files.length || !profil) return;

  const formdata = new FormData();
  for (let i = 0; i < files.length; i++) {
    formdata.append("photos", files[i]);
  }

  try {
    const res = await fetch(`${import.meta.env.VITE_API_URL}/api/mesInfos/${profil._id}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formdata,
    });

    const data = await res.json();

    if (!res.ok) throw new Error(data.message);

    setProfil(data);
  } catch (error) {
    console.error(error.message);
  }

  e.target.value = "";
};

   useEffect(() => {
    const fetchProfil = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/mesInfos/me`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.message || "Erreur chargement profil");
        }

        setProfil(data);
        setInteret(data.centresInteret || []);
      } catch (error) {
        console.error(error.message);
      }
    };

    if (token) {
      fetchProfil();
    }
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
  }, [profil]);





  useEffect(()=>{

    if(progress === 100){
      setAfficher(true)

      const temps = setTimeout(()=>{
        setAfficher(false)
      }, 5000);
      return ()=>clearInterval(temps)
    }
  }, [progress])



  if(!profil) return <Page>Chargement avez vous la connexion...</Page>;
  const messageProgress =
    progress < 50
      ? "Ton profil a encore besoin de quelques infos pour attirer l’attention."
      : progress < 80
        ? "Beau début. Encore quelques détails pour le rendre plus complet."
        : "Excellent profil. Tu es prêt à te démarquer.";
  return (
    <Page>
      
      <Main>
        <Header>
       <Container>
  <Deconnexion onClick={ deconnexion }>Déconnexion</Deconnexion>
   <br/>
  
</Container>
          <AvatarWrapper>
            {profil.avatar ? (
              <Avatar src={profil.avatar.url} alt="avatar" />
            ) : (
              <MessageAvatar>Ajouter une photo</MessageAvatar>
            )}
            <CameraButton htmlFor="avatarInput">
              <FaCamera />
            </CameraButton>
            <input
              type="file"
              id="avatarInput"
              style={{ display: "none" }}
              onChange={fetchAvatar}
            />
          </AvatarWrapper>

          <BioBox>
            <span>{profil.bio || "Pas encore de bio"}</span>
          </BioBox>

          {progress < 100 && (
            <Conteneur>
              <ProgressTitle>Complétude du profil : {progress}%</ProgressTitle>
              <ProgressText>{messageProgress}</ProgressText>

              <Topbarre>
                <Interrieur progress={progress} />
              </Topbarre>
            </Conteneur>
          )}

          {afficher && (
            <Conteneur>
              <SuccessTitle>🎉 Profil complété à 100%</SuccessTitle>
              <SuccessText>Ton profil est prêt et bien optimisé.</SuccessText>
            </Conteneur>

          )}


          <section>
            <Modification>
              <Boutonmodifier onClick={() => navigate(`/modifier/${profil._id}`)}>
                Compléter mon profil
                <Span></Span>
              </Boutonmodifier>
            </Modification>
          </section>

          <Name>
            {profil.prenom} {profil.nom}
          </Name>
        </Header>
        <Card>
          <SectionTitle>Informations personnelles</SectionTitle>
          <InfoGrid>
            <InfoBox>
              <FaBirthdayCake /> {profil.age} ans
            </InfoBox>
            <InfoBox>
              <FaHeart /> recherche: {profil.recherche}
            </InfoBox>
            <InfoBox>
              <FaGlobe />
              pays: {profil.pays}
            </InfoBox>
            <InfoBox>
              <FaMapMarkerAlt />
              ville: {profil.ville}
            </InfoBox>
          </InfoGrid>
        </Card>

        {/* Affichage des centres d’intérêt */}
        <Card>
          <InterestsWrapper>
            <SectionTitle>Centres d’intérêt</SectionTitle>

            {interet.length > 0 ? (
              <ChipsContainer>
                {interet.map((aime) => (
                  <Chip key={aime} active>
                    {aime}
                  </Chip>
                ))}
              </ChipsContainer>
            ) : (
              <p style={{ fontSize: "13px", color: "#666" }}>
                Aucun centre d’intérêt.
              </p>
            )}
          </InterestsWrapper>
        </Card>
        <Card>
          <PhotosSection>
            <h2>Photos</h2>
            <AddPhotoButton htmlFor="photosInput">
              <FaPlus />
            </AddPhotoButton>
            <PhotoGrid>
              <input
                type="file"
                id="photosInput"
                multiple
                style={{ display: "none" }}
                onChange={uploadMultiple}
              />

              {modal && imageActive && (
                <Overlay onClick={fermerimage}>
                  <CloseButton onClick={fermerimage}>x</CloseButton>
                  <ModalImage
                    src={imageActive.url}
                    alt="image grandie"
                    onClick={(e) => {
                      e.stopPropagation();
                    }}
                  />
                </Overlay>
              )}

              {profil.photos &&
                profil.photos.map((image) => (
                  <ImageWrapper key={image.public_id}>
                    <Image
                      src={image.url}
                      alt={profil.nom}
                      onClick={() => ouvririmage(image)}
                      style={{ cursor: "pointer" }}
                    />
                    <Boutton
                      onClick={(e) => {
                        e.stopPropagation();
                        setmodalDelete(
                          modaldelete === image.public_id
                            ? null
                            : image.public_id,
                        );
                      }}
                    >
                      <FaEllipsisH />
                    </Boutton>
                    <MoalImages open={modaldelete === image.public_id}>
                      <ItemBoutton
                        onClick={(e) => {
                          e.stopPropagation();
                          suppression(image.public_id);
                          setmodalDelete(null);
                        }}
                      >
                        supprimer <FaTrash />
                      </ItemBoutton>
                    </MoalImages>
                  </ImageWrapper>
                ))}
            </PhotoGrid>
          </PhotosSection>
        </Card>
      </Main>
    </Page>
  );
}
export default Home;
