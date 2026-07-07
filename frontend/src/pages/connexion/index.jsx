import styled from "styled-components";
import { Link } from "react-router-dom";

const Page = styled.div`
  min-height: 100vh;
  font-family: "Poppins", sans-serif;
  background: #fafafa;
`;

const Hero = styled.section`
  min-height: 100vh;
  background: linear-gradient(135deg,#ff4d94,#7a5cff,#4b9cff);
  color: white;
  display:flex;
  align-items:center;
  justify-content:center;
  padding:40px;
`;

const HeroContent = styled.div`
  max-width:1200px;
  display:grid;
  grid-template-columns:1fr 1fr;
  gap:60px;

  @media(max-width:900px){
    grid-template-columns:1fr;
    text-align:center;
  }
`;

const Left = styled.div`
display:flex;
flex-direction:column;
justify-content:center;
`;

const Title = styled.h1`
font-size:56px;
line-height:1.1;
margin-bottom:20px;
`;

const Subtitle = styled.p`
font-size:20px;
opacity:.95;
margin-bottom:40px;
`;

const Buttons = styled.div`
display:flex;
gap:20px;

@media(max-width:900px){
justify-content:center;
}
`;

const Button = styled(Link)`
padding:18px 35px;
border-radius:50px;
text-decoration:none;
font-weight:600;
background:white;
color:#7a5cff;
transition:.3s;

&:hover{
transform:translateY(-3px);
}
`;

const SecondaryButton = styled(Link)`
padding:18px 35px;
border-radius:50px;
text-decoration:none;
font-weight:600;
border:2px solid white;
color:white;

&:hover{
background:white;
color:#7a5cff;
}
`;

const Gallery = styled.div`
display:grid;
grid-template-columns:repeat(2,1fr);
gap:20px;
`;

const Photo = styled.img`
width:100%;
height:280px;
object-fit:cover;
border-radius:20px;
box-shadow:0 15px 40px rgba(0,0,0,.25);
`;

const Section = styled.section`
padding:80px 10%;
`;

const SectionTitle = styled.h2`
text-align:center;
font-size:42px;
margin-bottom:50px;
`;

const Cards = styled.div`
display:grid;
grid-template-columns:repeat(auto-fit,minmax(280px,1fr));
gap:30px;
`;

const Card = styled.div`
background:white;
padding:30px;
border-radius:20px;
box-shadow:0 10px 30px rgba(0,0,0,.08);
`;

const Video = styled.video`
width:100%;
border-radius:20px;
`;

const Reviews = styled.div`
display:grid;
grid-template-columns:repeat(auto-fit,minmax(300px,1fr));
gap:25px;
`;

const Review = styled.div`
background:white;
padding:25px;
border-radius:18px;
box-shadow:0 8px 25px rgba(0,0,0,.08);
`;

const CTA = styled.section`
padding:100px 20px;
background:linear-gradient(135deg,#ff4d94,#7a5cff);
text-align:center;
color:white;
`;

export default function LandingPage() {
  return (
    <Page>

      <Hero>

        <HeroContent>

          <Left>

            <Title>
              Trouvez votre âme sœur à Abidjan ❤️
            </Title>

            <Subtitle>
              Des milliers de célibataires vous attendent.
              Discutez, rencontrez et créez une véritable histoire.
            </Subtitle>

            <Buttons>

              <Button to="/inscription">
                Commencer gratuitement
              </Button>

              <SecondaryButton to="/connexion">
                Se connecter
              </SecondaryButton>

            </Buttons>

          </Left>

          <Gallery>

            <Photo src="" />
            <Photo src="/images/user2.jpg" />
            <Photo src="/images/user3.jpg" />
            <Photo src="/images/user4.jpg" />

          </Gallery>

        </HeroContent>

      </Hero>

      <Section>

        <SectionTitle>
          Pourquoi choisir BabiTendre ?
        </SectionTitle>

        <Cards>

          <Card>
            <h3>💖 Matching intelligent</h3>
            <p>
              Rencontrez des personnes compatibles selon vos centres d'intérêt.
            </p>
          </Card>

          <Card>
            <h3>🔒 Sécurité</h3>
            <p>
              Profils vérifiés et conversations sécurisées.
            </p>
          </Card>

          <Card>
            <h3>📍 Près de chez vous</h3>
            <p>
              Découvrez des célibataires proches de votre localisation.
            </p>
          </Card>

        </Cards>

      </Section>

      <Section>

        <SectionTitle>
          Découvrez BabiTendre en vidéo
        </SectionTitle>

        <Video controls>
          <source src="/videos/presentation.mp4" type="video/mp4"/>
        </Video>

      </Section>

      <Section>

        <SectionTitle>
          Ils ont trouvé l'amour
        </SectionTitle>

        <Reviews>

          <Review>
            ⭐⭐⭐⭐⭐
            <p>
              "Nous nous sommes rencontrés grâce à BabiTendre et aujourd'hui
              nous vivons ensemble."
            </p>
            <strong>— Awa & Jean</strong>
          </Review>

          <Review>
            ⭐⭐⭐⭐⭐
            <p>
              "Une application simple, moderne et très agréable à utiliser."
            </p>
            <strong>— Mariam</strong>
          </Review>

          <Review>
            ⭐⭐⭐⭐⭐
            <p>
              "J'ai rencontré quelqu'un après seulement quelques semaines."
            </p>
            <strong>— Kevin</strong>
          </Review>

        </Reviews>

      </Section>

      <CTA>

        <h2 style={{fontSize:"48px"}}>
          Rejoignez plus de 50 000 célibataires
        </h2>

        <p style={{margin:"20px 0 40px"}}>
          Votre histoire commence aujourd'hui.
        </p>

        <Button
          to="/inscription"
          style={{
            display:"inline-block",
            background:"white"
          }}
        >
          Créer mon compte gratuitement
        </Button>

      </CTA>

    </Page>
  );
}