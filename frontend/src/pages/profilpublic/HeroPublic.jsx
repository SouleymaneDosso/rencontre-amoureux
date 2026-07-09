import {
  FaMapMarkerAlt,
  FaCheckCircle,
  FaCircle,
  FaHeart,
  FaLock,
} from "react-icons/fa";

import {
  Hero,
  AvatarWrapper,
  Avatar,
  AvatarPlaceholder,
  Infos,
  Name,
  Location,
  StatusRow,
  Badge,
  InfoMatch,
} from "./Profilpublic.style";

export default function HeroPublic({
  profil,
  isMatch,
  checkingMatch,
  setModal,
}) {
  return (
    <Hero>
      <AvatarWrapper>
        {profil.avatar?.url ? (
          <Avatar
            src={profil.avatar.url}
            alt={profil.pseudo}
            onClick={() => setModal(true)}
          />
        ) : (
          <AvatarPlaceholder>
            <FaCircle />
          </AvatarPlaceholder>
        )}
      </AvatarWrapper>

      <Infos>
        <Name>
          {profil.pseudo}, {profil.age} ans
        </Name>

        <Location>
          <FaMapMarkerAlt />
          {profil.ville}, {profil.pays}
        </Location>

        <StatusRow>
          <Badge type="online">
            <FaCircle />
            {profil.enLigne ? "En ligne" : "Hors ligne"}
          </Badge>

          {profil.verifie && (
            <Badge type="verified">
              <FaCheckCircle />
              Profil vérifié
            </Badge>
          )}

          <Badge>
            <FaHeart />
            {profil.recherche || "Rencontre"}
          </Badge>
        </StatusRow>

        {!checkingMatch && !isMatch && (
          <InfoMatch>
            <FaLock style={{ marginRight: 8 }} />
            Tu pourras envoyer un message uniquement après un match.
          </InfoMatch>
        )}
      </Infos>
    </Hero>
  );
}