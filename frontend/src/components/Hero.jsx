import { motion } from "framer-motion";
import { FaMapMarkerAlt, FaUserCheck } from "react-icons/fa";

import {
  HeroContainer,
  Badge,
  Title,
  Gradient,
  Description,
  Stats,
  Stat,
  Cards,
  UserCard,
  Avatar,
  CardBody,
  Name,
  City,
  Verified
} from "./Hero.style";

const users = [
  {
    name: "Sarah",
    age: 24,
    city: "Cocody",
    photo:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=500",
  },
  {
    name: "Kevin",
    age: 29,
    city: "Marcory",
    photo:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=500",
  },
  {
    name: "Mariam",
    age: 26,
    city: "Yopougon",
    photo:
      "https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?w=500",
  },
];

export default function Hero() {
  return (
    <HeroContainer>
      <Badge>❤️ Plus de 54 000 célibataires</Badge>

      <Title>
        Trouvez votre moitié avec <Gradient>BabiTendre</Gradient>
      </Title>

      <Description>
        Discutez gratuitement avec des milliers de célibataires proches de chez
        vous et commencez une belle histoire.
      </Description>

      <Stats>
        <Stat>
          <strong>54K+</strong>
          <span>Membres</span>
        </Stat>

        <Stat>
          <strong>9K+</strong>
          <span>Couples</span>
        </Stat>

        <Stat>
          <strong>4.9★</strong>
          <span>Avis</span>
        </Stat>
      </Stats>

      <Cards>
        {users.map((user, index) => (
          <motion.div
            key={index}
            animate={{ y: [0, -12, 0] }}
            transition={{
              duration: 3,
              repeat: Infinity,
              delay: index * 0.4,
            }}
          >
            <UserCard>
              <Avatar src={user.photo} alt={user.name} />

              <CardBody>
                <Name>
                  {user.name}, {user.age}
                </Name>

                <City>
                  <FaMapMarkerAlt /> {user.city}
                </City>

                <Verified>
                  <FaUserCheck />
                  Profil vérifié
                </Verified>
              </CardBody>
            </UserCard>
          </motion.div>
        ))}
      </Cards>
    </HeroContainer>
  );
}