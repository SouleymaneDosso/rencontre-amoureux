import styled from "styled-components";

export const Card = styled.div`
  width: 440px;
  padding: 40px;
  border-radius: 28px;

  background: rgba(255,255,255,.12);
  backdrop-filter: blur(18px);

  border: 1px solid rgba(255,255,255,.18);

  box-shadow: 0 20px 40px rgba(0,0,0,.25);

  @media(max-width:900px){
    width:100%;
    padding:30px;
  }
`;

export const Header = styled.div`
  margin-bottom:30px;
`;

export const Title = styled.h2`
  color:white;
  font-size:34px;
  margin-bottom:8px;
`;

export const Subtitle = styled.p`
  color:rgba(255,255,255,.8);
`;

export const Form = styled.form`
  display:flex;
  flex-direction:column;
  gap:22px;
`;

export const Group = styled.div`
  display:flex;
  flex-direction:column;
`;

export const Label = styled.label`
  color:white;
  margin-bottom:8px;
  font-weight:600;
`;

export const InputBox = styled.div`
  display:flex;
  align-items:center;

  background:white;

  border-radius:15px;

  padding:0 18px;

  transition:.3s;

  &:focus-within{

      box-shadow:0 0 0 4px rgba(255,255,255,.25);

      transform:translateY(-2px);

  }

`;

export const Icon = styled.div`
color:#999;
`;

export const Input = styled.input`
flex:1;

padding:17px;

border:none;

outline:none;

font-size:16px;

background:transparent;
`;

export const EyeButton = styled.button`

border:none;

background:none;

cursor:pointer;

font-size:18px;

color:#888;

`;

export const Button = styled.button`

margin-top:10px;

padding:17px;

border:none;

border-radius:15px;

font-size:17px;

font-weight:bold;

cursor:pointer;

background:linear-gradient(135deg,#ff4d94,#6c63ff);

color:white;

transition:.35s;

&:hover{

transform:translateY(-3px);

box-shadow:0 15px 25px rgba(0,0,0,.25);

}

&:disabled{

opacity:.6;

cursor:not-allowed;

}

`;

export const Bottom = styled.div`

margin-top:25px;

text-align:center;

color:white;

a{

color:#FFD166;

font-weight:bold;

text-decoration:none;

}

`;

export const Error = styled.p`

margin-top:10px;

color:#ffd4d4;

font-size:15px;

`;