import styled from "styled-components";

export const Wrapper = styled.section`
  position: relative;
  margin-top: -90px;
  z-index: 5;

  display: flex;
  flex-direction: column;
  align-items: center;

  padding: 0 20px;
`;

export const AvatarWrapper = styled.div`
  position: relative;
`;

export const Avatar = styled.img`
  width: 180px;
  height: 180px;

  border-radius: 50%;
  object-fit: cover;

  border: 6px solid white;

  box-shadow: 0 20px 45px rgba(0,0,0,.20);

  @media(max-width:768px){
    width:150px;
    height:150px;
  }
`;

export const Online = styled.div`
  position: absolute;
  right: 10px;
  bottom: 18px;

  width: 22px;
  height: 22px;

  border-radius: 50%;

  background: #00d26a;

  border: 4px solid white;
`;

export const CameraButton = styled.label`
  position:absolute;

  bottom:8px;
  left:8px;

  width:48px;
  height:48px;

  border-radius:50%;

  background:#7a5cff;

  color:white;

  display:flex;
  justify-content:center;
  align-items:center;

  cursor:pointer;

  transition:.3s;

  &:hover{
    transform:scale(1.08);
  }
`;

export const Name = styled.h1`
  margin-top:25px;
  margin-bottom:10px;

  font-size:38px;

  color:#20233a;

  font-weight:800;
`;

export const City = styled.p`
  color:#6d7393;

  font-size:17px;

  margin:0;
`;

export const Bio = styled.p`
  max-width:700px;

  margin-top:25px;

  text-align:center;

  line-height:1.8;

  color:#555;
`;

export const Buttons = styled.div`
  display:flex;

  gap:20px;

  margin-top:35px;

  flex-wrap:wrap;

  justify-content:center;
`;

export const Button = styled.button`
  padding:16px 28px;

  border:none;

  border-radius:18px;

  cursor:pointer;

  font-size:15px;

  font-weight:700;

  color:white;

  background:linear-gradient(
      135deg,
      #ff4d94,
      #7a5cff
  );

  transition:.3s;

  &:hover{
    transform:translateY(-3px);
  }
`;

export const OutlineButton = styled(Button)`
  background:white;
  color:#7a5cff;

  border:2px solid #7a5cff;
`;
