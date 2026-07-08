import { useEffect, useState, useRef } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import ProfileHero from "../../comportments/home/ProfileHero";
import Gallery from "./Gallery";
import InfoCard from "./InfoCard";

const Page = styled.div`
  width: 100%;
  background: linear-gradient(135deg, #f8f9ff, #e6ecff);
  display: flex;
  justify-content: center;
  margin-bottom: 100px;
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

const Main = styled.main`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 28px;
  @media (max-width: 480px) {
    padding: 0;
  }
`;

const Card = styled.section`
  background: white;
  border-radius: 24px;
  padding: 28px;
  box-shadow: 0 10px 30px rgba(31, 42, 68, 0.06);
`;

function Home() {
  const [profil, setProfil] = useState(null);
  const [interet, setInteret] = useState([]);

  const [progress, setProgress] = useState(0);
  const [afficher, setAfficher] = useState(false);
  const [modal, setModal] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(1);
  const [noTransition, setNoTransition] = useState(false);
  const navigate = useNavigate();
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  const token = localStorage.getItem("token");

  const photos = [
    ...(profil?.avatar ? [profil.avatar] : []),
    ...(profil?.photos || []),
  ];

  const loopedPhotos = [photos[photos.length - 1], ...photos, photos[0]];

  useEffect(() => {
    if (modal) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  }, [modal]);

  useEffect(() => {
    if (!token) {
      navigate("/connexion");
    }
  }, [token, navigate]);

  const ouvririmage = (index) => {
    setCurrentIndex(index + 1);
    setModal(true);
  };

  const next = () => {
    setCurrentIndex((prev) => prev + 1);
  };

  const prev = () => {
    setCurrentIndex((prev) => prev - 1);
  };

  useEffect(() => {
    if (!photos.length) return;

    // fin (clone de la première)
    if (currentIndex === loopedPhotos.length - 1) {
      setTimeout(() => {
        setNoTransition(true);
        setCurrentIndex(1); // vrai premier
      }, 350);
    }

    // début (clone de la dernière)
    if (currentIndex === 0) {
      setTimeout(() => {
        setNoTransition(true);
        setCurrentIndex(loopedPhotos.length - 2); // vrai dernier
      }, 350);
    }

    // réactiver animation
    setTimeout(() => {
      setNoTransition(false);
    }, 360);
  }, [currentIndex, loopedPhotos.length]);

  const suppression = async (public_id) => {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/mesInfos/photo/${profil._id}/${encodeURIComponent(public_id)}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
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
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/mesInfos/avatar/${profil._id}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formdata,
        },
      );

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
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/mesInfos/${profil._id}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formdata,
        },
      );

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

    afficherMessage();
  }, [profil]);

  const afficherMessage = () => {
    const dejaMontre = localStorage.getItem("message100");

    if (progress === 100 && !dejaMontre) {
      setAfficher(true);
      localStorage.setItem("message100", "oui");

      const timer = setTimeout(() => {
        setAfficher(false);
      }, 5000);

      return () => clearTimeout(timer);
    }
  };

  if (!profil) return <Page>Chargement avez vous la connexion...</Page>;
  const messageProgress =
    progress < 50
      ? "Ton profil a encore besoin de quelques infos pour attirer l’attention."
      : progress < 80
        ? "Beau début. Encore quelques détails pour le rendre plus complet."
        : "Excellent profil. Tu es prêt à te démarquer.";

  return (
    <Page>
      <Main>
        <ProfileHero
          profil={profil}
          navigate={navigate}
          fetchAvatar={fetchAvatar}
        />

        <InfoCard profil={profil} />

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
        <Gallery
          profil={profil}
          uploadMultiple={uploadMultiple}
          suppression={suppression}
        />
      </Main>
    </Page>
  );
}
export default Home;
