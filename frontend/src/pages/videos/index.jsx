import styled from "styled-components";
import { useState, useEffect } from "react";
import { HiVideoCamera } from "react-icons/hi";

const API_URL = import.meta.env.VITE_API_URL;
/* ================== STYLES ================== */
const H1 = styled.h1`
  text-align: center;
  padding: 10px;
  font-size: 32px;
  font-weight: 800;
  background: linear-gradient(90deg, #6a11cb, #2575fc);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
`;

const Labelstyle = styled.label`
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 30px auto;
  width: 80px;
  height: 80px;
  border-radius: 50%;
  cursor: pointer;

  background: linear-gradient(135deg, #6a11cb, #2575fc);
  box-shadow:
    0 0 20px rgba(106, 17, 203, 0.6),
    0 0 40px rgba(37, 117, 252, 0.4);

  transition: all 0.3s ease;

  &:hover {
    transform: scale(1.1) rotate(5deg);
    box-shadow:
      0 0 30px rgba(106, 17, 203, 0.9),
      0 0 60px rgba(37, 117, 252, 0.7);
  }
`;

const Pagewrapper = styled.div`
  height: 100vh;
  color: white;
  margin-bottom: 200px;
`;

const Titre = styled.h3`
  text-align: center;
  padding: 15px;
  background: linear-gradient(90deg, #6a11cb, #2575fc);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
`;
const Conteneurvideo = styled.div`
  height: 100vh;
  overflow-y: scroll;
  scroll-snap-type: y mandatory;
  &::-webkit-scrollbar {
    display: none;
  }
`;

const CardVideo = styled.div`
  height: 100vh;
  scroll-snap-align: start;
  display: flex;
  justify-content: center;
  align-items: center;
  

  video {
    height: 100%;
    width: 100%;
    object-fit: cover;
  }
`;

const Bouton = styled.button`
  margin-top: 10px;
  width: 100%;
  padding: 10px;
  border-radius: 12px;
  border: none;

  font-weight: bold;
  cursor: pointer;

  background: linear-gradient(90deg, #ff6ec4, #7873f5);
  color: white;

  box-shadow: 0 0 15px rgba(255, 110, 196, 0.5);

  transition: 0.3s;

  &:hover {
    transform: scale(1.05);
    box-shadow: 0 0 25px rgba(255, 110, 196, 0.9);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

function Video() {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [mesdeos, setMesdeos] = useState([]);
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) {
      alert("Reconnecte-toi");
    }
  }, []);

  const uploadeMultiple = (e) => {
    const files = Array.from(e.target.files);

    const newfile = files.map((file) => ({
      file,
      url: URL.createObjectURL(file),
    }));
    setVideos((prev) => [...prev, ...newfile]);
  };

  const supprimerurl = () => {
    videos.forEach((deo) => URL.revokeObjectURL(deo.url));
    setVideos([]);
  };

  const sauvegardedb = async () => {
    try {
      setLoading(true);
      const formdata = new FormData();
      videos.forEach((video) => {
        formdata.append("video", video.file);
      });

      const res = await fetch(`${API_URL}/api/clients/videos`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formdata,
      });
      const data = await res.json();

      if (!res.ok) {
        alert("sauvegarde échoué" + data.message);
      }
      setVideos([]);
      await getvideos();

      alert("sauvegarde réussie");
      setLoading(false);
    } catch (error) {
      alert("sauvegrde impossible" + error.message);
    }
  };

  const getvideos = async () => {
    try {
      const res = await fetch(`${API_URL}/api/clients/mesvideos`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message);
        return;
      }

      setMesdeos(data);
    } catch (error) {
      alert(error.message);
    }
  };

  useEffect(() => {
    getvideos();
  }, []);

  return (
    <Pagewrapper>
      <main>
        <H1>Moments chill</H1>

        <section>
          <Labelstyle htmlFor="masque">
            <HiVideoCamera size={30} />
            <input
              id="masque"
              type="file"
              accept="video/*"
              multiple
              onChange={uploadeMultiple}
              hidden
            />
          </Labelstyle>
        </section>

        <section>
          <Titre>Mes videos</Titre>

          {videos.length > 0 && (
            <Conteneurvideo>
              {videos.map((video, index) => (
                <CardVideo key={index}>
                  <video src={video.url} autoPlay muted loop />
                </CardVideo>
              ))}
            </Conteneurvideo>
          )}

          {videos.length > 0 && (
            <div>
              <Bouton onClick={sauvegardedb} disabled={loading}>
                {loading ? "Envoi..." : "Ajouter"}
              </Bouton>
              <Bouton onClick={supprimerurl}>Annuller</Bouton>
            </div>
          )}

          <Conteneurvideo>
            {mesdeos.map((video, index) => (
              <CardVideo key={index}>
                <video src={video.url} autoPlay  controls />
              </CardVideo>
            ))}
          </Conteneurvideo>
        </section>
      </main>
    </Pagewrapper>
  );
}
export default Video;
