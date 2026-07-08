import { FaCamera } from "react-icons/fa";
import {
  Container,
  Image,
  Overlay,
  Gradient,
  EditButton,
} from "./Cover.style";

export default function Cover({ profil, onAvatar }) {
  return (
    <Container>

      <Image
        src={
          profil.avatar?.url ||
          "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=1400"
        }
        alt="cover"
      />

      <Overlay />

      <Gradient />

      <EditButton onClick={onAvatar}>
        <FaCamera /> Changer la photo
      </EditButton>

    </Container>
  );
}