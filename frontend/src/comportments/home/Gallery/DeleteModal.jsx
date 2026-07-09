import {
  Overlay,
  Box,
  Title,
  Text,
  Buttons,
  Cancel,
  Delete,
} from "./DeleteModal.style";

export default function DeleteModal({
  open,
  close,
  confirm,
}) {
  if (!open) return null;

  return (
    <Overlay onClick={close}>
      <Box onClick={(e) => e.stopPropagation()}>
        <Title>Supprimer cette photo ?</Title>

        <Text>
          Cette action est irréversible.
        </Text>

        <Buttons>
          <Cancel onClick={close}>
            Annuler
          </Cancel>

          <Delete onClick={confirm}>
            Supprimer
          </Delete>
        </Buttons>
      </Box>
    </Overlay>
  );
}