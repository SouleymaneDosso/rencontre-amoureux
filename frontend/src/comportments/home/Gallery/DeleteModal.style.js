import styled from "styled-components";

export const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,.55);
  backdrop-filter: blur(8px);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
`;

export const Box = styled.div`
  width: 360px;
  max-width: 92%;
  background: white;
  border-radius: 22px;
  padding: 28px;
  text-align: center;
  box-shadow: 0 20px 50px rgba(0,0,0,.18);
`;

export const Title = styled.h3`
  margin: 0;
  font-size: 22px;
  color: #222;
`;

export const Text = styled.p`
  margin: 18px 0 28px;
  color: #666;
  line-height: 1.5;
`;

export const Buttons = styled.div`
  display: flex;
  gap: 12px;
`;

export const Cancel = styled.button`
  flex: 1;
  border: none;
  padding: 14px;
  border-radius: 14px;
  background: #ececec;
  cursor: pointer;
  font-weight: 600;

  &:hover {
    background: #dddddd;
  }
`;

export const Delete = styled.button`
  flex: 1;
  border: none;
  padding: 14px;
  border-radius: 14px;
  background: #ff4d6d;
  color: white;
  cursor: pointer;
  font-weight: 700;

  &:hover {
    background: #e6395d;
  }
`;