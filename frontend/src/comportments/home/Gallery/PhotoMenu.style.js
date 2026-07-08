import styled from "styled-components";

export const MenuButton = styled.button`
  position: absolute;

  top: 12px;
  right: 12px;

  width: 42px;
  height: 42px;

  border: none;

  border-radius: 50%;

  background: rgba(0, 0, 0, 0.45);

  color: white;

  display: flex;
  align-items: center;
  justify-content: center;

  cursor: pointer;

  backdrop-filter: blur(8px);

  transition: 0.25s;

  &:hover {
    transform: scale(1.08);
  }
`;

export const Menu = styled.div`
  position: absolute;

  top: 60px;
  right: 12px;

  width: 170px;

  background: white;

  border-radius: 16px;

  overflow: hidden;

  box-shadow: 0 18px 40px rgba(0, 0, 0, 0.18);

  opacity: ${({ open }) => (open ? 1 : 0)};

  visibility: ${({ open }) => (open ? "visible" : "hidden")};

  transform: ${({ open }) => (open ? "translateY(0)" : "translateY(-10px)")};

  transition: 0.25s;

  z-index: 20;
`;

export const Item = styled.div`
  padding: 15px 18px;

  display: flex;

  align-items: center;

  gap: 12px;

  cursor: pointer;

  font-weight: 600;

  color: ${({ danger }) => (danger ? "#ff3b5c" : "#333")};

  transition: 0.2s;

  &:hover {
    background: #f7f7f7;
  }
`;
