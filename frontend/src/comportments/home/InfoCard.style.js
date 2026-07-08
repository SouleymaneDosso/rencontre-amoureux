import styled from "styled-components";

export const Card = styled.section`
  background: white;
  border-radius: 24px;
  padding: 28px;
  box-shadow: 0 10px 30px rgba(31,42,68,.06);
`;

export const Title = styled.h2`
  margin-bottom:25px;
  font-size:22px;
  font-weight:700;
  color:#202842;
`;

export const Grid = styled.div`
  display:grid;
  grid-template-columns:repeat(auto-fit,minmax(220px,1fr));
  gap:18px;
`;

export const Box = styled.div`
  background:#f8faff;
  border-radius:18px;
  padding:18px;

  display:flex;
  align-items:center;
  gap:12px;

  font-weight:600;
  color:#374151;

  transition:.3s;

  svg{
      color:#ff4d94;
      font-size:20px;
  }

  &:hover{
      transform:translateY(-4px);
      box-shadow:0 12px 30px rgba(0,0,0,.08);
  }
`;