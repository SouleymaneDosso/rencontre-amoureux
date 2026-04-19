import styled from "styled-components";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
/* ================== STYLES ================== */

const Container = styled.div`
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: linear-gradient(135deg, #6a11cb, #2575fc);
  padding: 20px;
  font-family: "Inter", sans-serif;
  margin-bottom: 80px;
`;

const Card = styled.div`
  background: white;
  width: 100%;
  max-width: 550px;
  padding: 40px;
  border-radius: 20px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
  @media (max-width: 480px) {
    padding: 24px 16px;
  }
`;

const Title = styled.h2`
  text-align: center;
  margin-bottom: 30px;
  font-size: 28px;
  font-weight: 800;
  background: linear-gradient(90deg, #6a11cb, #2575fc);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 15px;
`;

const Input = styled.input`
  padding: 12px;
  border-radius: 10px;
  border: 1px solid #ddd;
  font-size: 16px;

  &:focus {
    outline: none;
    border-color: #2575fc;
  }
`;

const Select = styled.select`
  padding: 12px;
  border-radius: 10px;
  border: 1px solid #ddd;
  font-size: 16px;
  background: white;

  &:focus {
    outline: none;
    border-color: #2575fc;
  }
`;

const Button = styled.button`
  padding: 14px;
  border-radius: 12px;
  border: none;
  background: linear-gradient(90deg, #6a11cb, #2575fc);
  color: white;
  font-weight: 600;
  cursor: pointer;
  transition: 0.3s;

  &:hover {
    transform: translateY(-2px);
    opacity: 0.9;
  }
`;
/* ================== DATA ================== */

// Liste des principales villes de Côte d'Ivoire
const villesCI = [
  "Abidjan",
  "Bouaké",
  "Daloa",
  "Yamoussoukro",
  "San-Pédro",
  "Korhogo",
  "Man",
  "Gagnoa",
  "Divo",
  "Abengourou",
  "Anyama",
  "Grand-Bassam",
  "Soubré",
  "Ferkessédougou",
  "Bondoukou",
  "Odienné",
  "Séguéla",
  "Daoukro",
  "Aboisso",
  "Issia",
];

/* ================== COMPONENT ================== */

function Profil() {
  const navigate = useNavigate();
  const [info, setInfo] = useState({
    nom: "",
    prenom: "",
    age: "",
    ville: "",
    pays: "Côte d'Ivoire",
    recherche: "",
    genre: "",
    pseudo: "",
  });

  const valeurs = (e) => {
    setInfo({ ...info, [e.target.name]: e.target.value });
  };

  const token = localStorage.getItem("token");

  const valeurEnvoyer = async (e) => {
    e.preventDefault();

    try {
      const creation = await fetch(
        `${import.meta.env.VITE_API_URL}/api/mesInfos`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(info),
        },
      );

      const data = await creation.json();

      if (!creation.ok) {
        throw new Error(data.message);
      }
      setInfo({
        nom: "",
        prenom: "",
        age: "",
        ville: "",
        pays: "Côte d'Ivoire",
        recherche: "",
        genre: "",
        pseudo: "",
      });
      navigate("/home");
    } catch (error) {
      console.log("❌ " + error.message);
    }
  };

  return (
    <Container>
      <Card>
        <Title>Créer votre profil</Title>

        <Form onSubmit={valeurEnvoyer}>
          <Input
            name="nom"
            placeholder="Nom"
            value={info.nom}
            onChange={valeurs}
            required
          />
          <Input
            name="prenom"
            placeholder="Prénom"
            value={info.prenom}
            onChange={valeurs}
            required
          />
          <Input
            name="pseudo"
            placeholder="Pseudo"
            value={info.pseudo}
            onChange={valeurs}
            required
          />

          {/* AGE SELECT 18 - 70 */}
          <Select name="age" value={info.age} onChange={valeurs} required>
            <option value="">Sélectionner votre âge</option>
            {[...Array(53)].map((_, i) => {
              const age = i + 18;
              return (
                <option key={age} value={age}>
                  {age} ans
                </option>
              );
            })}
          </Select>

          {/* VILLES CÔTE D'IVOIRE */}
          <Select name="ville" value={info.ville} onChange={valeurs} required>
            <option value="">Sélectionner votre ville</option>
            {villesCI.map((ville) => (
              <option key={ville} value={ville}>
                {ville}
              </option>
            ))}
          </Select>

          <Input value="Côte d'Ivoire" disabled />

          <Select name="genre" value={info.genre} onChange={valeurs} required>
            <option value="">Genre</option>
            <option value="homme">Homme</option>
            <option value="femme">Femme</option>
            <option value="autre">Autre</option>
          </Select>

          <Select
            name="recherche"
            value={info.recherche}
            onChange={valeurs}
            required
          >
            <option value="">Je recherche</option>
            <option value="homme">Homme</option>
            <option value="femme">Femme</option>
            <option value="tous">Tous</option>
          </Select>

          <Button type="submit">S'inscrire</Button>
        </Form>
      </Card>
    </Container>
  );
}

export default Profil;
