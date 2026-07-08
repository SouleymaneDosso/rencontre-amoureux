import styled from "styled-components";

export const HeroContainer = styled.section`
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 30px;
  color: white;
`;

export const Badge = styled.div`
  width: fit-content;
  padding: 10px 18px;
  border-radius: 999px;
  background: rgba(255,255,255,.12);
  border: 1px solid rgba(255,255,255,.2);
  backdrop-filter: blur(12px);
  font-weight: 600;
`;

export const Title = styled.h1`
  font-size: clamp(42px, 5vw, 70px);
  line-height: 1.1;
  margin: 0;
`;

export const Gradient = styled.span`
  background: linear-gradient(90deg, #ff7eb3, #ffd166);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
`;

export const Description = styled.p`
  max-width: 600px;
  font-size: 20px;
  color: rgba(255,255,255,.85);
`;

export const Stats = styled.div`
  display: flex;
  gap: 40px;
  flex-wrap: wrap;
`;

export const Stat = styled.div`
  display: flex;
  flex-direction: column;

  strong {
    font-size: 28px;
  }

  span {
    opacity: .8;
  }
`;

export const Cards = styled.div`
  display: flex;
  gap: 20px;
  flex-wrap: wrap;
  margin-top: 20px;
`;

export const UserCard = styled.div`
  width: 170px;
  background: rgba(255,255,255,.12);
  backdrop-filter: blur(18px);
  border-radius: 20px;
  overflow: hidden;
  border: 1px solid rgba(255,255,255,.15);
  transition: .4s;

  &:hover{
    transform: translateY(-8px);
  }
`;

export const Avatar = styled.img`
  width: 100%;
  height: 180px;
  object-fit: cover;
`;

export const CardBody = styled.div`
  padding: 15px;
`;

export const Name = styled.h3`
  margin: 0;
  font-size: 18px;
`;

export const City = styled.p`
  margin: 8px 0;
  opacity: .8;
`;

export const Verified = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  color: #00ff9d;
  font-size: 14px;
  font-weight: 600;
`;