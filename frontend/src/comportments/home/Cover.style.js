import styled from "styled-components";

export const Container = styled.div`
  position: relative;
  width: 100%;
  height: 380px;
  overflow: hidden;
  border-radius: 0 0 35px 35px;

  @media (max-width:768px){
    height:280px;
  }
`;

export const Image = styled.img`
  width:100%;
  height:100%;
  object-fit:cover;
`;

export const Overlay = styled.div`
  position:absolute;
  inset:0;

  background:
    linear-gradient(
      to bottom,
      rgba(0,0,0,.15),
      rgba(0,0,0,.55)
    );
`;

export const Gradient = styled.div`
  position:absolute;
  inset:0;

  background:
    radial-gradient(circle at top right,#ff4d94 0%,transparent 35%),
    radial-gradient(circle at bottom left,#6c63ff 0%,transparent 40%);
`;

export const EditButton = styled.button`
  position:absolute;
  right:25px;
  bottom:25px;

  border:none;

  padding:14px 22px;

  border-radius:16px;

  cursor:pointer;

  background:white;

  font-weight:700;

  transition:.3s;

  &:hover{
    transform:translateY(-3px);
  }
`;