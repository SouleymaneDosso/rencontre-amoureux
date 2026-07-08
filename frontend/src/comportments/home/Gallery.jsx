import { FaPlus } from "react-icons/fa";
import PhotoMenu from "../../comportments/home/Gallery/PhotoMenu";
import ImageModal from "../../comportments/home/Gallery/ImageModal";

import {
  Section,
  Header,
  Title,
  AddPhotoButton,
  Grid,
  Card,
  Image,
} from "./Gallery.style";

export default function Gallery({
  profil,
  uploadMultiple,

  ouvririmage,

  suppression,

  modaldelete,
  setmodalDelete,

  modal,
  setModal,

  currentIndex,
  setCurrentIndex,
}) {
    return (
  <>
    <Section>
      <Header>
        <Title>Mes photos</Title>

        <AddPhotoButton htmlFor="photosInput">
          <FaPlus />
        </AddPhotoButton>
      </Header>

      <input
        id="photosInput"
        hidden
        multiple
        type="file"
        onChange={uploadMultiple}
      />

      <Grid>
        {profil.photos?.map((photo, index) => (
          <Card key={photo.public_id}>
            <Image
              src={photo.url}
              onClick={() => ouvririmage(index + 1)}
            />

            <PhotoMenu
              open={modaldelete}
              setOpen={setmodalDelete}
              image={photo}
              onDelete={suppression}
              onView={() => ouvririmage(index + 1)}
            />
          </Card>
        ))}
      </Grid>
    </Section>

    {modal && (
      <ImageModal
        photos={[
          ...(profil.avatar ? [profil.avatar] : []),
          ...(profil.photos || []),
        ]}
        index={currentIndex}
        setIndex={setCurrentIndex}
        close={() => setModal(false)}
      />
    )}
  </>
);
 
}
