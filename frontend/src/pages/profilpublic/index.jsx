import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import styled, { keyframes } from "styled-components";
import HeroPublic from "../profilpublic/public/HeroPublic.jsx";
import AboutPublic from "../profilpublic/public/AboutPublic.jsx";
import GalleryPublic from "../profilpublic/public/GalleryPublic.jsx";
import MatchActions from "../profilpublic/public/MatchActions";
import { FaArrowLeft, FaTimes } from "react-icons/fa";

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
  padding: 110px 20px 100px;
  position: relative;
  overflow: hidden;
  background:
    radial-gradient(circle at top left,#fde7f3 0%,transparent 35%),
    radial-gradient(circle at bottom right,#dbeafe 0%,transparent 40%),
    linear-gradient(135deg,#fdfbff,#eef4ff);
`;

const Container = styled.div`
  max-width: 1120px;
  margin: auto;
  position: relative;
  z-index: 2;
`;

// Back button
const BackButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 10px;

  margin-bottom: 28px;

  padding: 14px 20px;

  border: none;
  border-radius: 18px;

  background: rgba(255,255,255,.75);
  backdrop-filter: blur(15px);

  color: #4f46e5;

  font-weight: 700;
  cursor: pointer;

  transition: .25s;

  &:hover{
    transform: translateY(-3px);
    box-shadow:0 15px 30px rgba(79,70,229,.15);
  }
`;

// Card
const Card = styled.section`
  overflow: hidden;
  border-radius: 34px;

  background: rgba(255,255,255,.72);
  backdrop-filter: blur(24px);

  border: 1px solid rgba(255,255,255,.7);

  box-shadow:
    0 30px 80px rgba(31,42,68,.12),
    inset 0 1px 0 rgba(255,255,255,.8);
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

const CloseButton = styled.button`
  position: absolute;
  top: 95px;
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

const CenterText = styled.h3`
  text-align: center;
  margin-top: 80px;
  color: ${({ error }) => (error ? "#dc2626" : "#374151")};
`;

const SliderWrapper = styled.div`
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  position: relative;
`;

const Slider = styled.div`
  display: flex;
  height: 100%;
  width: 100%;

  transform: translateX(-${({ index }) => index * 100}%);
  transition: ${({ noTransition }) =>
    noTransition ? "none" : "transform 0.35s ease"};
`;

const SlideContainer = styled.div`
  width: 100vw;
  height: 100vh;
  flex-shrink: 0;
  position: relative;
  background: black;
`;

const SlideImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: contain;
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
  const [modal, setModal] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(1);
  const [noTransition, setNoTransition] = useState(false);

  const { id } = useParams();
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  const photos = profil?.photos || [];

  const loopedPhotos =
    photos.length > 0 ? [photos[photos.length - 1], ...photos, photos[0]] : [];

  const openModal = (index) => {
    setCurrentIndex(index + 1);
    setModal(true);
  };

  const next = () => setCurrentIndex((prev) => prev + 1);
  const prev = () => setCurrentIndex((prev) => prev - 1);

  useEffect(() => {
    if (!photos.length) return;

    if (currentIndex === loopedPhotos.length - 1) {
      setTimeout(() => {
        setNoTransition(true);
        setCurrentIndex(1);
      }, 300);
    }

    if (currentIndex === 0) {
      setTimeout(() => {
        setNoTransition(true);
        setCurrentIndex(loopedPhotos.length - 2);
      }, 300);
    }

    setTimeout(() => {
      setNoTransition(false);
    }, 310);
  }, [currentIndex, loopedPhotos.length]);

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
        },
      );

      const data = await res.json();

      if (!res.ok) {
        setTopBar({
          type: "error",
          text: data.message || "Erreur lors du like",
        });
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

  useEffect(() => {
    document.body.style.overflow = modal ? "hidden" : "auto";
  }, [modal]);

  // ------------------ Fetch profil public
  useEffect(() => {
  if (!id) return;

  // La clé est différente pour chaque profil public
  const cacheKey = `profilPublic-${id}`;

  // 1️⃣ Chercher le profil dans le cache
  const profilCache = localStorage.getItem(cacheKey);

  // 2️⃣ Si le profil existe déjà dans le cache,
  //    on l'affiche immédiatement
  if (profilCache) {
    try {
      const profilData = JSON.parse(profilCache);

      setProfil(profilData);

      // Important :
      // on enlève le loading immédiatement
      setLoading(false);
    } catch (error) {
      console.error(
        "Erreur lecture cache profil public :",
        error,
      );

      // Si le cache est invalide,
      // on le supprime
      localStorage.removeItem(cacheKey);
    }
  }

  // 3️⃣ Ensuite, on récupère toujours
  //    les données fraîches depuis l'API
  const infospublic = async () => {
    try {
      setMessage("");

      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/mesInfos/${id}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        },
      );

      const data = await res.json();

      if (!res.ok) {
        setMessage(
          "Erreur lors du fetch : " + data.message,
        );
        return;
      }

      // 4️⃣ Mettre à jour l'affichage
      setProfil(data);

      // 5️⃣ Sauvegarder les nouvelles données
      //    dans le cache correspondant à ce profil
      localStorage.setItem(
        cacheKey,
        JSON.stringify(data),
      );
    } catch (error) {
      setMessage(
        "Erreur récupération profil : " +
          error.message,
      );
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
          },
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
          <HeroPublic
            profil={profil}
            isMatch={isMatch}
            checkingMatch={checkingMatch}
            setModal={setModal}
          />

          <AboutPublic profil={profil} />

          <GalleryPublic photos={profil.photos || []} openModal={openModal} />

          <MatchActions
            profil={profil}
            isMatch={isMatch}
            like={like}
            navigate={navigate}
          />
        </Card>
      </Container>

      {modal && photos.length > 0 && (
        <ModalOverlay onClick={() => setModal(false)}>
          <SliderWrapper
            onClick={(e) => e.stopPropagation()}
            onTouchStart={(e) => {
              touchStartX.current = e.touches[0].clientX;
            }}
            onTouchMove={(e) => {
              touchEndX.current = e.touches[0].clientX;
            }}
            onTouchEnd={() => {
              const diff = touchStartX.current - touchEndX.current;

              if (diff > 50) next();
              else if (diff < -50) prev();
            }}
          >
            <Slider index={currentIndex} noTransition={noTransition}>
              {loopedPhotos.map((img, i) => (
                <SlideContainer key={i}>
                  <SlideImage src={img?.url} alt="" />

                  <CloseButton onClick={() => setModal(false)}>
                    <FaTimes />
                  </CloseButton>
                </SlideContainer>
              ))}
            </Slider>
          </SliderWrapper>
        </ModalOverlay>
      )}
    </Page>
  );
}

export default Profilpublic;
