import {
  Overlay,
  Container,
  Close,
  ArrowLeft,
  ArrowRight,
  Image,
} from "./ImageModal.style";

export default function ImageModal({
  photos,
  index,
  setIndex,
  close,
}) {
  if (!photos.length) return null;

  const next = () => {
    setIndex((prev) => (prev + 1) % photos.length);
  };

  const prev = () => {
    setIndex((prev) =>
      prev === 0 ? photos.length - 1 : prev - 1
    );
  };

  return (
    <Overlay onClick={close}>

      <Container onClick={(e) => e.stopPropagation()}>

        <Close onClick={close}>
          ✕
        </Close>

        {photos.length > 1 && (
          <ArrowLeft onClick={prev}>
            ❮
          </ArrowLeft>
        )}

        <Image
          src={photos[index]?.url}
          alt=""
        />

        {photos.length > 1 && (
          <ArrowRight onClick={next}>
            ❯
          </ArrowRight>
        )}

      </Container>

    </Overlay>
  );
}