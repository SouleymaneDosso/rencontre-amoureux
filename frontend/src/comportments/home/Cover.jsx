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

      {profil.cover?.url ? (
        <Image
          src={profil.cover.url}
          alt="Couverture"
        />
      ) : (
        <>
          <Gradient />
          <Overlay />
        </>
      )}

      <EditButton onClick={onAvatar}>
        <FaCamera />
        Changer la couverture
      </EditButton>

    </Container>
  );
}