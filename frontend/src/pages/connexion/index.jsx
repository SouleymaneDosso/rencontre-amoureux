import styled from "styled-components";
import { useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
const Page = styled.div`
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background:
    linear-gradient(rgba(10, 10, 30, 0.65), rgba(10, 10, 30, 0.65)),
    url("https://images.unsplash.com/photo-1503264116251-35a269479413?auto=format&fit=crop&w=1600&q=80");

  background-size: cover;
  background-position: center;
  font-family: "Poppins", sans-serif;
`;

const LoginBox = styled.div`
  background: rgba(255, 255, 255, 0.12);
  backdrop-filter: blur(14px);
  -webkit-backdrop-filter: blur(14px);
  padding: 40px 30px;
  border-radius: 22px;
  width: 360px;
  color: white;
  text-align: center;
  box-shadow: 0 10px 35px rgba(0, 0, 0, 0.35);
  border: 1px solid rgba(255, 255, 255, 0.18);
`;

const Hh = styled.h2`
  text-align: center;
  margin-bottom: 10px;
  color: white;
  font-size: 30px;
  font-weight: 700;
`;

const Subtitle = styled.p`
  color: rgba(255, 255, 255, 0.8);
  margin-bottom: 25px;
  font-size: 14px;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const Input = styled.input`
  width: 100%;
  padding: 14px 16px;
  border: none;
  border-radius: 12px;
  outline: none;
  font-size: 15px;
  background: rgba(255, 255, 255, 0.9);
  box-sizing: border-box;
  transition: 0.3s ease;

  &:focus {
    transform: scale(1.02);
    box-shadow: 0 0 0 3px rgba(79, 172, 254, 0.35);
  }

  &::placeholder {
    color: #666;
  }
`;

const Button = styled.button`
  width: 100%;
  padding: 14px;
  background: linear-gradient(135deg, #4facfe, #00c6ff);
  border: none;
  border-radius: 12px;
  color: white;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
  transition: 0.3s ease;
  margin-top: 8px;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 20px rgba(0, 198, 255, 0.35);
  }

  &:active {
    transform: scale(0.98);
  }
`;

const FooterText = styled.p`
  margin-top: 18px;
  font-size: 13px;
  color: rgba(255, 255, 255, 0.75);

  span {
    color: #4facfe;
    cursor: pointer;
    font-weight: bold;
  }
`;
const MonLien = styled(Link)`
  text-decoration: none;
  color: white;
  background: #4fb6ff;
  padding: 10px 16px;
  border-radius: 12px;
  font-weight: 600;

  &:hover {
    background: white;
  }
`;


function Connexion() {
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
const navigate = useNavigate()
  const connexion = async (e) => {
    e.preventDefault();

    try {
      const elements = await fetch(`${import.meta.env.VITE_API_URL}/api/connexion`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, code }),
      });

      const data = await elements.json();
      if(!elements.ok){
        throw new Error(data.message || "Erreur de connexion");
      }
      localStorage.setItem("token", data.token);
      localStorage.setItem("userId", data.userId)

      if(data.profilCree){
        navigate("/home")
      }
      else{
        navigate("/profil")
      }
  }  catch (error) {  
      alert(error.message);
    }
  };

  return (
    <Page>
      <LoginBox>
        <Hh>Connexion</Hh>
        <Subtitle>Bienvenue 👋 Connecte-toi à ton espace</Subtitle>

        <Form onSubmit={connexion}>
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

          <Button type="submit">Se connecter</Button>
        </Form>

        <FooterText>
          Pas encore de compte ? <MonLien to="/inscription">S'inscrire</MonLien>
        </FooterText>
      </LoginBox>
    </Page>
  );
}

export default Connexion;