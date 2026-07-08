import { motion } from "framer-motion";
import styled from "styled-components";
import { FaStar } from "react-icons/fa";

const Section = styled.section`
  margin: 100px 0;
`;

const Title = styled.h2`
  color: white;
  text-align: center;
  font-size: 42px;
  margin-bottom: 50px;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 25px;
`;

const Card = styled(motion.div)`
  background: rgba(255,255,255,.10);
  backdrop-filter: blur(18px);

  border: 1px solid rgba(255,255,255,.15);

  border-radius: 22px;

  padding: 30px;

  color: white;
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  gap: 15px;
`;

const Avatar = styled.img`
  width: 70px;
  height: 70px;
  border-radius: 50%;
  object-fit: cover;
`;

const Name = styled.h3`
  margin: 0;
`;

const City = styled.small`
  opacity: .8;
`;

const Stars = styled.div`
  margin: 20px 0;
  color: #FFD166;
`;

const Text = styled.p`
  line-height: 1.8;
  opacity: .9;
`;

const reviews = [
  {
    name: "Awa",
    city: "Abidjan",
    image:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=500",
    text:
      "Une très belle expérience. J'ai rencontré quelqu'un avec qui je partage beaucoup de choses."
  },

  {
    name: "Kevin",
    city: "Bouaké",
    image:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=500",
    text:
      "Application très simple à utiliser. Les profils sont sérieux et les échanges agréables."
  },

  {
    name: "Mariam",
    city: "Yamoussoukro",
    image:
      "https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?w=500",
    text:
      "J'adore le design de l'application. Tout est fluide et moderne."
  }
];

export default function ReviewCard() {
  return (
    <Section>

      <Title>
        ❤️ Ils parlent de BabiTendre
      </Title>

      <Grid>

        {reviews.map((review, index) => (

          <Card
            key={index}
            initial={{
              opacity: 0,
              y: 40
            }}
            whileInView={{
              opacity: 1,
              y: 0
            }}
            transition={{
              duration: .6,
              delay: index * .2
            }}
            viewport={{
              once: true
            }}
          >

            <Header>

              <Avatar
                src={review.image}
                alt={review.name}
              />

              <div>

                <Name>
                  {review.name}
                </Name>

                <City>
                  {review.city}
                </City>

              </div>

            </Header>

            <Stars>

              <FaStar />
              <FaStar />
              <FaStar />
              <FaStar />
              <FaStar />

            </Stars>

            <Text>

              {review.text}

            </Text>

          </Card>

        ))}

      </Grid>

    </Section>
  );
}