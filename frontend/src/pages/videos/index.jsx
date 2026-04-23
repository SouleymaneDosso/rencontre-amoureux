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
  box-shadow: 0 0 20px rgba(106, 17, 203, 0.6),
              0 0 40px rgba(37, 117, 252, 0.4);

  transition: all 0.3s ease;

  &:hover {
    transform: scale(1.1) rotate(5deg);
    box-shadow: 0 0 30px rgba(106, 17, 203, 0.9),
                0 0 60px rgba(37, 117, 252, 0.7);
  }
`;

const Pagewrapper = styled.div`
  min-height: 100vh;
 
  margin-bottom: 70px;
  color: white;
`;
const Titre = styled.h3`
text-align: center;
padding: 15px;
 background: linear-gradient(90deg, #6a11cb, #2575fc);
 -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
`;
const Conteneurvideo = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 20px;
  padding: 20px;
`;
const CardVideo = styled.div`
  background: rgba(255, 255, 255, 0.05);
  border-radius: 20px;
  padding: 15px;
  backdrop-filter: blur(10px);
  box-shadow: 0 0 20px rgba(0,0,0,0.5);

  transition: 0.3s;

  &:hover {
    transform: translateY(-5px) scale(1.02);
    box-shadow: 0 0 30px rgba(106, 17, 203, 0.6);
  }

  video {
    width: 100%;
    border-radius: 12px;
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

  const uploadeMultiple = (e) => {
    const files = Array.from(e.target.files);

    const newfile = files.map((file) => ({
      file,
      url: URL.createObjectURL(file),
    }));
    setVideos((prev) => [...prev, ...newfile]);
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
        body: formdata,
      });
      const data = await res.json();

      if (!res.ok) {
        alert("sauvegarde échoué" + data.message);
      }
      setVideos([]);
      alert("sauvegarde réussie");
      setLoading(false);
    } catch (error) {
      alert("sauvegrde impossible" + error.message);
    }
  };


useEffect(()=>{
    const getvideos = async ()=>{
    try{
const res = await fetch(`${API_URL}/api/clients/mesvideos`,{
method: "GET",
})

const data = await res.json()
if(!res.ok){
  alert(data.message)
  return;
}
setMesdeos(data)
    }
    catch(error){
      alert(error.message)
    }
  }
  getvideos();
},[])

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

          <Conteneurvideo>
          {videos.map((video, index) => (
            < CardVideo  key={index}>
              <video src={video.url} controls width="320" />
              <Bouton onClick={sauvegardedb} disabled={videos.length === 0}>
                {loading ? "Envoi..." : "Ajouter"}
              </Bouton>
            </ CardVideo >
          ))}
          </Conteneurvideo>

          <Conteneurvideo>  
          {mesdeos.map((video, index)=>(
            < CardVideo  key={index}>
                <video src={video.url} controls width="320" />
            </CardVideo>
          ))}
          </Conteneurvideo>
        </section>
      </main>
    </Pagewrapper>
  );
}
export default Video;
