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
  width: 100%;
  aspect-ratio: 1 / 1;
  background: #f1f4ff;
  border-radius: 24px;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const Avatar = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  cursor: pointer;
  transition: transform 0.3s ease;
  &:hover {
    transform: scale(1.05);
  }
`;

export const AvatarPlaceholder = styled.div`
  font-size: 120px;
  color: #c084fc;
  background: linear-gradient(135deg, #f5e8ff, #eef2ff);
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
`;

// Infos
export const Infos = styled.div`
  padding: 32px;
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

export const Name = styled.h1`
  margin: 0;
  font-size: 36px;
  color: #1f2a44;
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
  gap: 12px;
  flex-wrap: wrap;
  margin-top: 20px;
`;

export const Badge = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 10px 14px;
  border-radius: 999px;
  font-size: 14px;
  font-weight: 700;
  background: ${({ type }) =>
    type === "online"
      ? "#dcfce7"
      : type === "verified"
        ? "#eef2ff"
        : "#ffe4f1"};
  color: ${({ type }) =>
    type === "online"
      ? "#15803d"
      : type === "verified"
        ? "#4f46e5"
        : "#db2777"};
`;
export const InfoMatch = styled.p`
  margin-top: 18px;
  color: #6b7280;
  font-size: 14px;
  line-height: 1.6;
`;

export const PhotosSection = styled.div`
  padding: 32px;
  border-top: 1px solid #f1f5f9;
`;

export const PhotosGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 16px;

  @media (max-width: 600px) {
    grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  }
`;

export const PhotoCard = styled.div`
  width: 100%;
  aspect-ratio: 1 / 1;
  border-radius: 16px;
  overflow: hidden;
  background: #f8fafc;
  cursor: pointer;
  transition: transform 0.3s ease;
  &:hover {
    transform: scale(1.05);
  }
`;

export const Photo = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
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