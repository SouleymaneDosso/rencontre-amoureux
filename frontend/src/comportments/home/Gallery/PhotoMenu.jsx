import { FaEllipsisH, FaTrash, FaEye } from "react-icons/fa";
import {
  MenuButton,
  Menu,
  Item,
} from "./PhotoMenu.style";

export default function PhotoMenu({
  open,
  setOpen,
  image,
  onDelete,
  onView,
}) {
  return (
    <>
      <MenuButton
        onClick={(e) => {
          e.stopPropagation();
          setOpen(open ? null : image.public_id);
        }}
      >
        <FaEllipsisH />
      </MenuButton>

      <Menu open={open === image.public_id}>

        <Item
          onClick={(e) => {
            e.stopPropagation();
            onView();
            setOpen(null);
          }}
        >
          <FaEye />
          Voir
        </Item>

        <Item
          danger
          onClick={(e) => {
            e.stopPropagation();
            onDelete(image.public_id);
            setOpen(null);
          }}
        >
          <FaTrash />
          Supprimer
        </Item>

      </Menu>
    </>
  );
}