import styled from "styled-components";

export const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,.75);
  backdrop-filter: blur(10px);
  display:flex;
  justify-content:center;
  align-items:center;
  z-index:9999;
`;

export const Container = styled.div`
  width:420px;
  max-width:95%;
  background:white;
  border-radius:24px;
  padding:25px;
  position:relative;
`;

export const Close = styled.button`
  position:absolute;
  top:15px;
  right:15px;
  border:none;
  background:none;
  font-size:26px;
  cursor:pointer;
`;

export const Avatar = styled.img`
  width:100%;
  aspect-ratio:1;
  border-radius:20px;
  object-fit:cover;
`;

export const Actions = styled.div`
  margin-top:20px;
  display:flex;
  gap:12px;
`;

export const Button = styled.button`
  flex:1;
  border:none;
  padding:15px;
  border-radius:14px;
  background:#5b6cff;
  color:white;
  font-weight:700;
  cursor:pointer;
`;

export const Danger = styled(Button)`
  background:#ff4d6d;
`;