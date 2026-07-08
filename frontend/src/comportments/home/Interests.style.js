import styled from "styled-components";

export const Card = styled.section`
  background: white;
  border-radius: 24px;
  padding: 28px;
  box-shadow: 0 10px 30px rgba(31,42,68,.06);
`;

export const Title = styled.h2`
  display:flex;
  align-items:center;
  gap:10px;

  margin-bottom:22px;

  color:#202842;

  svg{
      color:#ff4d94;
  }
`;

export const Container = styled.div`
  display:flex;
  flex-wrap:wrap;
  gap:12px;
`;

export const Chip = styled.div`
  padding:12px 18px;

  border-radius:30px;

  background:linear-gradient(
      135deg,
      #ff4d94,
      #7a5cff
  );

  color:white;

  font-weight:600;

  transition:.3s;

  cursor:pointer;

  &:hover{
      transform:translateY(-3px) scale(1.05);
  }
`;

export const Empty = styled.p`
  color:#777;
`;