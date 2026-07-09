import { FaImages } from "react-icons/fa";

import {
  PhotosSection,
  SectionTitle,
  PhotosGrid,
  PhotoCard,
  Photo,
  CenterText,
} from "./Profilpublic.style";

export default function GalleryPublic({
  photos,
  openModal,
}) {
  return (
    <PhotosSection>
      <SectionTitle>
        <FaImages />
        Photos
      </SectionTitle>

      {photos.length > 0 ? (
        <PhotosGrid>
          {photos.map((photo, index) => (
            <PhotoCard
              key={photo.public_id || index}
              onClick={() => openModal(index)}
            >
              <Photo
                src={photo.url}
                alt=""
              />
            </PhotoCard>
          ))}
        </PhotosGrid>
      ) : (
        <CenterText>
          Aucune photo disponible.
        </CenterText>
      )}
    </PhotosSection>
  );
}