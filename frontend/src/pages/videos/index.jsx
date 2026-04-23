import styled from "styled-components";
import { useState } from "react";
import { HiVideoCamera } from "react-icons/hi";
const API_URL = import.meta.env.VITE_API_URL;
/* ================== STYLES ================== */
const H1 = styled.h1`
  text-align: center;
  margin-top: 50px;
  font-size: 32px;
  font-weight: 800;
  background: linear-gradient(90deg, #6a11cb, #2575fc);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
`;

function Video() {
  const [videos, setVideos] = useState([]);

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
      const formdata = new FormData()
      videos.forEach((video)=>{
        formdata.append("video", video.file)
      }
      )
  
      const res = await fetch(`${API_URL}/api/clients/videos`, {
        method: "POST",
        body: formdata,
      });
      const data = await res.json()

      if(!res.ok){
        alert("sauvegarde échoué")
      }
      console.log(data)
    } catch (error) {
      alert("sauvegrde impossible" + error.message);
    }
  };

  return (
    <div>
      <main>
        <H1>Video</H1>

        <section>
          <label htmlFor="masque">
            <HiVideoCamera size={30} />
            <input
            id="masque"
              type="file"
              accept="video/*"
              multiple
              onChange={uploadeMultiple}
              hidden
            />
          </label>
          <button onClick={sauvegardedb} >Ajouter</button>
        </section>

        <section>
          <h3>Mes videos</h3>

          {videos.map((video, index) => (
            <div key={index}>
              <video src={video.url} controls width="320" />

              <p>{video.file.name}</p>
            </div>
          ))}
        </section>
      </main>
    </div>
  );
}
export default Video;
