import {
  FaComments,
  FaHeart,
  FaLock,
  FaBolt, FaStar 
} from "react-icons/fa";

import {
  Actions,
  ActionButton,
} from "./Profilpublic.style";

export default function MatchActions({
  profil,
  isMatch,
  like,
  navigate,
}) {
return (
  <Actions>
    {isMatch ? (
      <ActionButton
        className="message"
        onClick={() => navigate(`/tchat/${profil._id}`)}
      >
        <FaComments />
        Envoyer un message
      </ActionButton>
    ) : (
      <ActionButton className="disabled" disabled>
        <FaLock />
        Message verrouillé
      </ActionButton>
    )}

    <ActionButton
      className="like"
      onClick={like}
    >
      <FaHeart />
      Liker ce profil
    </ActionButton>

    <ActionButton className="super">
      <FaBolt />
      Super Like
    </ActionButton>

    <ActionButton className="favorite">
      <FaStar />
      Ajouter aux favoris
    </ActionButton>
  </Actions>
);
}