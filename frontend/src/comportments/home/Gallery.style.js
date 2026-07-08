import styled from "styled-components";

export const Section = styled.section`
  margin-top: 40px;
`;

export const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 25px;
`;

export const Title = styled.h2`
  font-size: 28px;
  font-weight: 800;
  color: #222;
`;

export const AddPhotoButton = styled.label`
  width: 60px;
  height: 60px;

  border-radius: 18px;

  display: flex;
  justify-content: center;
  align-items: center;

  cursor: pointer;

  color: white;

  font-size: 22px;

  background: linear-gradient(135deg,#ff4d94,#7a5cff);

  box-shadow:0 15px 35px rgba(122,92,255,.25);

  transition:.3s;

  &:hover{
    transform:translateY(-4px);
  }
`;

export const Grid = styled.div`
  display:grid;

  grid-template-columns:repeat(auto-fill,minmax(220px,1fr));

  gap:22px;
`;

export const Card = styled.div`
  position:relative;

  height:320px;

  overflow:hidden;

  border-radius:24px;

  cursor:pointer;

  box-shadow:0 15px 35px rgba(0,0,0,.08);

  transition:.35s;

  &:hover{

    transform:translateY(-8px);

  }

  &:hover img{

    transform:scale(1.08);

  }
`;

export const Image = styled.img`
  width:100%;

  height:100%;

  object-fit:cover;

  transition:.4s;
`;

export const MenuButton = styled.button`
  position:absolute;

  top:15px;
  right:15px;

  width:42px;
  height:42px;

  border:none;

  border-radius:50%;

  background:rgba(0,0,0,.45);

  color:white;

  cursor:pointer;

  backdrop-filter:blur(12px);
`;

export const Menu = styled.ul`
  position:absolute;

  top:65px;
  right:15px;

  list-style:none;

  padding:10px 0;

  width:150px;

  border-radius:16px;

  background:white;

  box-shadow:0 15px 35px rgba(0,0,0,.12);

  opacity:${({open})=>open?1:0};

  visibility:${({open})=>open?"visible":"hidden"};

  transition:.25s;
`;

export const Item = styled.li`
  padding:14px 18px;

  color:#ff3d5a;

  font-weight:700;

  cursor:pointer;

  &:hover{

    background:#f7f7f7;

  }
`;