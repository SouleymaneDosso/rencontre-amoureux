import { FaCamera, FaMapMarkerAlt } from "react-icons/fa";

import {
  Wrapper,
  AvatarWrapper,
  Avatar,
  CameraButton,
  Online,
  Name,
  City,
  Bio,
  Buttons,
  Button,
  OutlineButton,
} from "./ProfileHero.style";

export default function ProfileHero({
  profil,
  navigate,
  fetchAvatar,
  openAvatar,
}) {
  return (
    <Wrapper>
      <AvatarWrapper>
        <Avatar
          src={profil.avatar?.url || "https://i.pravatar.cc/300"}
          onClick={openAvatar}
        />

        <Online />

        <CameraButton onClick={openAvatar}>
          <FaCamera />
        </CameraButton>
      </AvatarWrapper>

      <Name>
        {profil.prenom} {profil.nom}, {profil.age}
      </Name>

      <City>
        <FaMapMarkerAlt /> {profil.ville}, {profil.pays}
      </City>

      <Bio>
        {profil.bio ||
          "Ajoutez une biographie pour que les autres puissent mieux vous connaître."}
      </Bio>

      <Buttons>
        <Button onClick={() => navigate(`/modifier/${profil._id}`)}>
          Modifier mon profil
        </Button>

        <OutlineButton>Partager mon profil</OutlineButton>
      </Buttons>
    </Wrapper>
  );
}
