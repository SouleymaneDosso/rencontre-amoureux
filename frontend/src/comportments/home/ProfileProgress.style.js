import styled from "styled-components";

export const Card = styled.section`
  background: white;
  border-radius: 24px;
  padding: 28px;
  box-shadow: 0 12px 35px rgba(0,0,0,.08);

  display:flex;
  align-items:center;
  gap:35px;

  margin-bottom:25px;

  @media(max-width:700px){
      flex-direction:column;
      text-align:center;
  }
`;

export const Circle = styled.div`
  width:130px;
  height:130px;
  border-radius:50%;

  display:flex;
  align-items:center;
  justify-content:center;

  background:
    conic-gradient(
      #ff4d94 ${({progress})=>progress*3.6}deg,
      #ececec 0deg
    );
`;

export const Number = styled.div`
  width:100px;
  height:100px;

  border-radius:50%;

  background:white;

  display:flex;
  justify-content:center;
  align-items:center;

  font-size:28px;
  font-weight:bold;
`;

export const Right = styled.div`
  flex:1;
`;

export const Title = styled.h2`
  margin-bottom:12px;
`;

export const Text = styled.p`
  color:#666;
  line-height:1.7;
`;

export const Button = styled.button`
  margin-top:20px;

  border:none;

  padding:15px 28px;

  border-radius:40px;

  cursor:pointer;

  color:white;

  font-weight:bold;

  background:linear-gradient(
      135deg,
      #ff4d94,
      #7a5cff
  );

  transition:.3s;

  &:hover{
      transform:translateY(-3px);
      box-shadow:0 15px 30px rgba(122,92,255,.35);
  }
`;