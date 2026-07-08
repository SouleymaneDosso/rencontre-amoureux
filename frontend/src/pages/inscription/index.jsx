import styled from "styled-components";

import Hero from "../../components/Hero";
import RegisterCard from "../../components/RegisterCard";
import FloatingProfiles from "../../components/FloatingProfiles";
import Stats from "../../components/Stats";
import ReviewCard from "../../components/ReviewCard";

const Page = styled.div`
  min-height: 100vh;

  background:
  radial-gradient(circle at top left,#8b5cf6 0%,transparent 35%),
  radial-gradient(circle at bottom right,#ff4d94 0%,transparent 35%),
  linear-gradient(135deg,#141E30,#243B55);

  overflow:hidden;
`;

const HeroSection = styled.section`
  max-width:1400px;

  margin:auto;

  min-height:100vh;

  display:grid;

  grid-template-columns:1.1fr .9fr;

  gap:60px;

  align-items:center;

  padding:60px;

  @media(max-width:1000px){

    grid-template-columns:1fr;

    padding:30px;

  }
`;

const Right = styled.div`
  position:relative;

  display:flex;

  justify-content:center;

  align-items:center;
`;

const BottomSection = styled.section`
  max-width:1400px;

  margin:auto;

  padding:30px 60px 100px;

  @media(max-width:1000px){

    padding:20px;

  }
`;

const Footer = styled.footer`
  text-align:center;

  color:white;

  padding:40px;

  opacity:.75;

  font-size:14px;
`;

export default function Inscription() {

  return (

    <Page>

      <HeroSection>

        <Hero />

        <Right>

          <FloatingProfiles />

          <RegisterCard />

        </Right>

      </HeroSection>

      <BottomSection>

        <Stats />

        <ReviewCard />

      </BottomSection>

      <Footer>

        © 2026 BabiTendre • Trouvez l'amour près de chez vous ❤️

      </Footer>

    </Page>

  );

}