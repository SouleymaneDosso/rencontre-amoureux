import styled from "styled-components";

export const Container = styled.div`
  position: relative;
  width: 100%;
  height: 380px;
  overflow: hidden;
  border-radius: 0 0 35px 35px;

  background:
    linear-gradient(
      135deg,
      #ff4d94 0%,
      #7a5cff 45%,
      #2f80ed 100%
    );

  @media (max-width:768px){
    height:280px;
  }
`;

export const Gradient = styled.div`
  position:absolute;
  inset:0;

  background:

    radial-gradient(circle at 15% 20%,
    rgba(255,255,255,.18),
    transparent 30%),

    radial-gradient(circle at 80% 10%,
    rgba(255,255,255,.15),
    transparent 25%),

    radial-gradient(circle at 70% 80%,
    rgba(255,255,255,.12),
    transparent 30%);
`;

export const Overlay = styled.div`
  position:absolute;
  inset:0;

  background:

  linear-gradient(
    to bottom,
    rgba(0,0,0,.05),
    rgba(0,0,0,.35)
  );
`;

export const EditButton = styled.button`
  position:absolute;

  right:25px;
  bottom:25px;

  display:flex;
  align-items:center;
  gap:10px;

  padding:14px 22px;

  border:none;

  border-radius:18px;

  background:rgba(255,255,255,.18);

  color:white;

  backdrop-filter:blur(15px);

  font-weight:700;

  cursor:pointer;

  transition:.3s;

  &:hover{

    transform:translateY(-3px);

    background:rgba(255,255,255,.28);

  }
`;