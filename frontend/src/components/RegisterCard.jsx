import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaEnvelope, FaLock, FaEye, FaEyeSlash } from "react-icons/fa";

import {
  Card,
  Header,
  Title,
  Subtitle,
  Form,
  Group,
  Label,
  InputBox,
  Input,
  Icon,
  EyeButton,
  Button,
  Bottom,
  Error,
} from "./RegisterCard.style";

import PasswordStrength from "./PasswordStrength";

export default function RegisterCard() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");

  async function inscription(e) {
    e.preventDefault();

    setLoading(true);

    setError("");

    try {
      const formData = {
        email,
        password,
      };

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/inscription`,
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            email: formData.email,

            code: formData.password,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Erreur d'inscription");
      }

      localStorage.setItem("token", data.token);

      localStorage.setItem("userId", data.userId);

      if (data.profilCree) {
        navigate("/home");
      } else {
        navigate("/profil");
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card>
      <Header>
        <Title>Créer un compte ❤️</Title>

        <Subtitle>
          Rejoignez gratuitement la plus grande communauté de célibataires.
        </Subtitle>
      </Header>

      <Form onSubmit={inscription}>
        <Group>
          <Label>Email</Label>

          <InputBox>
            <Icon>
              <FaEnvelope />
            </Icon>

            <Input
              type="email"
              placeholder="Votre adresse email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </InputBox>
        </Group>

        <Group>
          <Label>Mot de passe</Label>

          <InputBox>
            <Icon>
              <FaLock />
            </Icon>

            <Input
              type={showPassword ? "text" : "password"}
              placeholder="Votre mot de passe"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <EyeButton
              type="button"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </EyeButton>
          </InputBox>

          <PasswordStrength password={password} />
        </Group>

        <Button type="submit" disabled={loading}>
          {loading ? "Création du compte..." : "Créer mon compte"}
        </Button>

        {error && <Error>{error}</Error>}
      </Form>

      <Bottom>
        Vous avez déjà un compte ?{" "}
        <Link to="/connexion">Se connecter</Link>
      </Bottom>
    </Card>
  );
}