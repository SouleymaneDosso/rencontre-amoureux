import { FaImages } from "react-icons/fa";

import {
  PhotosSection,
  SectionTitle,
  PhotosGrid,
  PhotoCard,
  Photo,
  EmptyPhotos,
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

      {photos.length ? (
        <PhotosGrid>
          {photos.map((photo, index) => (
            <PhotoCard
              key={photo.public_id || index}
              onClick={() => openModal(index)}
            >
              <Photo src={photo.url} alt="" />
            </PhotoCard>
          ))}
        </PhotosGrid>
      ) : (
        <EmptyPhotos>
          Aucune photo disponible
        </EmptyPhotos>
      )}
    </PhotosSection>
  );
}