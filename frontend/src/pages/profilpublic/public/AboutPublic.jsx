
import {
  BioSection,
  SectionTitle,
  BioText,
} from "./Profilpublic.style";

export default function AboutPublic({ profil }) {
  return (
    <BioSection>
      <SectionTitle>À propos</SectionTitle>

      <BioText>
        {profil.bio || "Aucune bio pour le moment."}
      </BioText>
    </BioSection>
  );
}