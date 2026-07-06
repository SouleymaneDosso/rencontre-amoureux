import styled from "styled-components";
import { useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

const Page = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  font-family: "Poppins", sans-serif;
  background-color: #f5f5f5;
`;

const Input = styled.input`
  width: 50%;
  padding: 10px;
  margin-bottom: 10px;
  border: 1px solid #4f6cff;
  border-radius: 4px;
  font-size: 16px;
  font-family: "Poppins", sans-serif;

  @media (max-width: 768px) {
    font-size: 16px;
  }
`;

const Bienvenue = styled.h2`
  margin-bottom: 20px;
  padding: 10px;
  text-align: center;
  font-size: 24px;
  font-weight: bold;
  font-family: "Poppins", sans-serif;
  background-color: #b41870;
  overflow: hidden;
  color: white;
  border-radius: 8px;

  @media (max-width: 768px) {
    font-size: 20px;
  }
`;
const Logo = styled.img`
  width: 250px;
  height: auto;
  margin-bottom: 20px;
  border-radius: 70px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease-in-out;
  &:hover {
    transform: scale(1.05);
    transition: transform 0.3s ease-in-out;
  }
`;

const Conteneurimage = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 20px;
`;

function Connexion() {
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const [avatar, setAvatar] = useState(null);


 const fetchAvatar = async (e) => {
    const file = e.target.files[0];

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



  const connexion = async (e) => {
    e.preventDefault();

    try {
      const elements = await fetch(
        `${import.meta.env.VITE_API_URL}/api/connexion`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, code }),
        },
      );

      const data = await elements.json();
      if (!elements.ok) {
        throw new Error(data.message || "Erreur de connexion");
      }
      localStorage.setItem("token", data.token);
      localStorage.setItem("userId", data.userId);

      if (data.profilCree) {
        navigate("/home");
      } else {
        navigate("/profil");
      }
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <Page>
      <main>
        <Bienvenue>
          Bienvenue sur votre application de rencontre BabiTendre
        </Bienvenue>

        <Conteneurimage>
          <Logo src="logoBabiTendre.png" alt="logo Babitendre" />
        </Conteneurimage>

        <section>
          <p>Trouvez votre âme sœur avec BabiTendre</p>
        </section>

        <form onSubmit={connexion}>
          <Input
            type="email"
            placeholder="Entrer votre email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <Input
            type="password"
            placeholder="Entrer votre mot de passe"
            value={code}
            onChange={(e) => setCode(e.target.value)}
          />

          <button type="submit">Se connecter</button>
        </form>

        <div>
          Pas encore de compte ? <Link to="/inscription">S'inscrire</Link>
        </div>
      </main>
    </Page>
  );
}

export default Connexion;
