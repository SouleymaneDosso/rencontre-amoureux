import styled from "styled-components";

export const Hero = styled.div`

  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;

  @media (max-width: 850px) {
    grid-template-columns: 1fr;
  }
`;

export const AvatarWrapper = styled.div`
  position: relative;
  width: 100%;
  aspect-ratio: 1;

  border-radius: 32px;
  overflow: hidden;

  background: linear-gradient(135deg,#7c3aed,#ec4899,#60a5fa);
  padding: 4px;

  box-shadow:
    0 30px 60px rgba(124,58,237,.25);

  &::before{
    content:"";
    position:absolute;
    inset:-30%;
    background:radial-gradient(circle,rgba(255,255,255,.35),transparent 70%);
    animation: glow 6s linear infinite;
  }

  @keyframes glow{
    from{transform:rotate(0deg);}
    to{transform:rotate(360deg);}
  }
`;

export const Avatar = styled.img`
  position: relative;
  z-index: 2;

  width: 100%;
  height: 100%;

  object-fit: cover;

  border-radius: 28px;

  cursor: pointer;

  transition: .45s;

  &:hover{
    transform: scale(1.05);
  }
`;

export const AvatarPlaceholder = styled.div`
  position: relative;
  z-index: 2;

  width: 100%;
  height: 100%;

  border-radius: 28px;

  display:flex;
  justify-content:center;
  align-items:center;

  background:linear-gradient(135deg,#eef2ff,#fdf2f8);

  font-size:120px;
  color:#a78bfa;
`;

// Infos
export const Infos = styled.div`
  padding: 32px;
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

export const Name = styled.h1`
  margin:0;

  font-size:42px;
  font-weight:900;

  background:linear-gradient(90deg,#111827,#4f46e5);

  -webkit-background-clip:text;
  -webkit-text-fill-color:transparent;
`;

export const Location = styled.p`
  margin-top: 14px;
  color: #5f6b85;
  font-size: 16px;
  display: flex;
  align-items: center;
  gap: 8px;
`;

export const StatusRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 14px;
  margin-top: 24px;
`;

export const Badge = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 10px;

  padding: 12px 18px;

  border-radius: 999px;

  font-size: 14px;
  font-weight: 700;

  backdrop-filter: blur(12px);

  border: 1px solid rgba(255,255,255,.7);

  background: ${({ type }) =>
    type === "online"
      ? "linear-gradient(135deg,#dcfce7,#bbf7d0)"
      : type === "verified"
        ? "linear-gradient(135deg,#eef2ff,#dbeafe)"
        : "linear-gradient(135deg,#ffe4f1,#ffd6ec)"};

  color: ${({ type }) =>
    type === "online"
      ? "#15803d"
      : type === "verified"
        ? "#4f46e5"
        : "#db2777"};

  box-shadow: 0 10px 25px rgba(15,23,42,.08);

  transition: .25s;

  &:hover{
    transform: translateY(-3px) scale(1.03);
  }

  svg{
    font-size:15px;
  }
`;

export const InfoMatch = styled.div`
  margin-top: 24px;

  padding: 18px 20px;

  border-radius: 18px;

  background: linear-gradient(135deg,#fff7ed,#fffbeb);

  border: 1px solid #fde68a;

  color: #92400e;

  font-size: 14px;
  line-height: 1.7;

  display:flex;
  align-items:flex-start;
`;
export const PhotosSection = styled.div`
  padding: 32px;
  border-top: 1px solid #f1f5f9;
`;

export const PhotosGrid = styled.div`
  display:grid;

  grid-template-columns:repeat(auto-fill,minmax(180px,1fr));

  gap:18px;
`;

export const PhotoCard = styled.div`
  position:relative;

  overflow:hidden;

  border-radius:22px;

  aspect-ratio:1;

  cursor:pointer;

  background:#eef2ff;

  transition:.35s;

  box-shadow:0 10px 25px rgba(15,23,42,.08);

  &:hover{
    transform:translateY(-8px);
    box-shadow:0 25px 50px rgba(15,23,42,.15);
  }

  &::after{
    content:"";

    position:absolute;
    inset:0;

    background:linear-gradient(
      transparent 40%,
      rgba(0,0,0,.35)
    );

    opacity:0;

    transition:.35s;
  }

  &:hover::after{
    opacity:1;
  }
`;

export const Photo = styled.img`
  width:100%;
  height:100%;

  object-fit:cover;

  transition:.45s;

  ${PhotoCard}:hover &{
    transform:scale(1.08);
  }
`;

export const EmptyPhotos = styled.div`
  padding:40px;

  text-align:center;

  border-radius:22px;

  background:#f8fafc;

  color:#64748b;
`;

export const SectionTitle = styled.h2`
  margin: 0 0 16px 0;
  font-size: 24px;
  color: #1f2a44;
  display: flex;
  align-items: center;
  gap: 10px;
`;
export const BioSection = styled.div`
  padding: 32px;
  border-top: 1px solid #f1f5f9;
`;

export const BioText = styled.p`
  margin: 0;
  font-size: 16px;
  line-height: 1.8;
  color: #6b7280;
`;
export const CenterText = styled.h3`
  text-align: center;
  margin-top: 80px;
  color: ${({ error }) => (error ? "#dc2626" : "#374151")};
`;

export const Actions = styled.div`
  padding: 32px;
  border-top: 1px solid #f1f5f9;
  display: flex;
  gap: 14px;
  flex-wrap: wrap;
`;

export const ActionButton = styled.button`
  flex: 1;
  min-width: 180px;
  padding: 14px 18px;
  border: none;
  border-radius: 18px;
  font-size: 15px;
  font-weight: 700;
  cursor: pointer;
  transition: 0.25s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;

  &:hover {
    transform: translateY(-2px);
  }

  &.message {
    background: linear-gradient(135deg, #4f46e5, #7c3aed);
    color: white;
    box-shadow: 0 10px 24px rgba(79, 70, 229, 0.22);
  }

  &.like {
    background: linear-gradient(135deg, #ec4899, #f472b6);
    color: white;
    box-shadow: 0 10px 24px rgba(236, 72, 153, 0.22);
  }

  &.disabled {
    background: #e5e7eb;
    color: #6b7280;
    cursor: not-allowed;
    box-shadow: none;
  }

  &.disabled:hover {
    transform: none;
  }
    &.super {
  background: linear-gradient(135deg,#06b6d4,#3b82f6);
  color: white;
  box-shadow: 0 10px 24px rgba(59,130,246,.25);
}

&.favorite {
  background: linear-gradient(135deg,#f59e0b,#f97316);
  color: white;
  box-shadow: 0 10px 24px rgba(249,115,22,.25);
}
`;

export const Stats = styled.div`
  display: flex;
  gap: 18px;
  margin-top: 28px;
  flex-wrap: wrap;
`;

export const Stat = styled.div`
  flex: 1;
  min-width: 90px;

  padding: 18px;

  border-radius: 18px;

  background: rgba(255,255,255,.75);

  border: 1px solid #eef2ff;

  text-align: center;

  box-shadow: 0 10px 30px rgba(79,70,229,.06);
`;
export const Number = styled.div`
  font-size: 24px;
  font-weight: 800;
  color: #4f46e5;
`;

export const Label = styled.div`
  margin-top: 6px;
  font-size: 13px;
  color: #64748b;
`;

export const SubTitle = styled.h3`
  margin: 34px 0 18px;

  font-size: 18px;
  font-weight: 700;

  color: #1f2937;
`;

export const Tags = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 14px;
`;

export const Tag = styled.div`
  padding: 12px 18px;

  border-radius: 999px;

  background: linear-gradient(
    135deg,
    rgba(124,58,237,.08),
    rgba(236,72,153,.08)
  );

  border: 1px solid rgba(124,58,237,.12);

  color: #4f46e5;

  font-weight: 700;

  transition: .25s;

  cursor: default;

  &:hover{
    transform: translateY(-3px);
    box-shadow: 0 12px 25px rgba(124,58,237,.12);
  }
`;

export const Bio = styled.p`
  margin: 0;

  color: #475569;

  line-height: 2;

  font-size: 16px;
`;