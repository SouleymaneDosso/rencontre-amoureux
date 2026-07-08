import { motion } from "framer-motion";
import styled from "styled-components";
import { FaHeart, FaMapMarkerAlt, FaCheckCircle } from "react-icons/fa";

const Container = styled.div`
  position: relative;
  width: 100%;
  height: 520px;

  @media (max-width: 900px) {
    display: none;
  }
`;

const Card = styled(motion.div)`
  position: absolute;
  width: 220px;
  border-radius: 24px;
  overflow: hidden;

  background: rgba(255,255,255,.15);
  backdrop-filter: blur(15px);

  border: 1px solid rgba(255,255,255,.15);

  box-shadow: 0 15px 35px rgba(0,0,0,.25);
`;

const Photo = styled.img`
  width: 100%;
  height: 260px;
  object-fit: cover;
`;

const Content = styled.div`
  padding: 18px;
  color: white;
`;

const Name = styled.h3`
  margin: 0;
`;

const City = styled.p`
  margin: 8px 0;
  opacity: .85;
`;

const Badge = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  color: #00ff99;
  font-size: 14px;
`;

const Like = styled.div`
  position: absolute;
  top: 15px;
  right: 15px;

  width: 45px;
  height: 45px;

  border-radius: 50%;

  display: flex;
  justify-content: center;
  align-items: center;

  background: rgba(255,255,255,.95);

  color: #ff3b7f;
`;

const users = [
  {
    id: 1,
    name: "Sarah",
    age: 25,
    city: "Cocody",
    image:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=700",
    left: "0%",
    top: "30px",
  },

  {
    id: 2,
    name: "Mariam",
    age: 23,
    city: "Marcory",
    image:
      "https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?w=700",
    left: "230px",
    top: "180px",
  },

  {
    id: 3,
    name: "Kevin",
    age: 29,
    city: "Yopougon",
    image:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=700",
    left: "470px",
    top: "60px",
  },
];

export default function FloatingProfiles() {
  return (
    <Container>
      {users.map((user, index) => (
        <Card
          key={user.id}
          style={{
            left: user.left,
            top: user.top,
          }}
          animate={{
            y: [0, -18, 0],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            delay: index * 0.5,
          }}
        >
          <Photo src={user.image} alt={user.name} />

          <Like>
            <FaHeart />
          </Like>

          <Content>
            <Name>
              {user.name}, {user.age}
            </Name>

            <City>
              <FaMapMarkerAlt /> {user.city}
            </City>

            <Badge>
              <FaCheckCircle />
              Profil vérifié
            </Badge>
          </Content>
        </Card>
      ))}
    </Container>
  );
}