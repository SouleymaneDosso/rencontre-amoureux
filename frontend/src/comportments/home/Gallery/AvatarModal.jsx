import {
  Overlay,
  Container,
  Close,
  Avatar,
  Actions,
  Button,
  Danger,
} from "./AvatarModal.style";

export default function AvatarModal({
  open,
  close,
  avatar,
  onChange,
  onDelete,
}) {
  if (!open) return null;

  return (
    <Overlay onClick={close}>
      <Container onClick={(e) => e.stopPropagation()}>
        <Close onClick={close}>✕</Close>

        <Avatar
          src={
            avatar?.url ||
            "https://via.placeholder.com/300x300?text=Avatar"
          }
        />

        <Actions>
          <Button as="label" htmlFor="avatarInput">
            Changer
          </Button>

          <input
            id="avatarInput"
            hidden
            type="file"
            accept="image/*"
            onChange={onChange}
          />

          <Danger onClick={onDelete}>
            Supprimer
          </Danger>
        </Actions>
      </Container>
    </Overlay>
  );
}