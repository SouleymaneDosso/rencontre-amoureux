import styled from "styled-components";

export const Card = styled.div`
  background: white;
  border-radius: 25px;
  padding: 25px;
  box-shadow: 0 15px 40px rgba(0,0,0,.08);
`;

export const Header = styled.div`
  display:flex;
  align-items:center;
  gap:18px;
`;

export const Avatar = styled.img`
  width:90px;
  height:90px;
  border-radius:50%;
  object-fit:cover;
`;

export const Infos = styled.div`
  flex:1;
`;

export const Name = styled.h2`
  margin:0;
`;

export const Age = styled.p`
  color:#666;
  margin:6px 0;
`;

export const Badge = styled.span`
  background:#e8fff1;
  color:#10b981;
  padding:6px 14px;
  border-radius:50px;
  font-size:13px;
  font-weight:600;
`;

export const Bio = styled.p`
  margin:25px 0;
  color:#555;
  line-height:1.7;
`;

export const Tags = styled.div`
  display:flex;
  flex-wrap:wrap;
  gap:10px;
`;

export const Tag = styled.div`
  padding:10px 18px;
  border-radius:30px;
  background:#eef2ff;
  color:#4f6cff;
  font-weight:600;
`;

export const Footer = styled.div`
  margin-top:25px;
`;

export const Button = styled.button`
  width:100%;
  border:none;
  padding:15px;
  border-radius:15px;
  cursor:pointer;
  color:white;
  font-weight:bold;
  background:linear-gradient(135deg,#ff4d94,#7a5cff);
`;