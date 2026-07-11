import { Link } from "react-router-dom";
import { HiHeart } from "react-icons/hi";

import {
  Header,
  HeaderContent,
  Logo,
  Nav,
  Actions,
  Login,
  Register,
} from "../LandingHeader.style";

export default function LandingHeader() {
  return (
    <Header>
      <HeaderContent>
        <Logo to="/">
          <HiHeart />
          BabiTendre
        </Logo>

        <Nav>
          <Link to="/">Accueil</Link>
          <Link to="/">Découvrir</Link>
          <Link to="/">Communauté</Link>
          <Link to="/">Sécurité</Link>
        </Nav>

        <Actions>
          <Login to="/">Connexion</Login>

          <Register to="/inscription">
            Créer un compte
          </Register>
        </Actions>
      </HeaderContent>
    </Header>
  );
}