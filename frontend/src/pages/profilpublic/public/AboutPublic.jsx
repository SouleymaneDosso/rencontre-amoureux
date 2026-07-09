import {
  BioSection,
  SectionTitle,
  Bio,
  SubTitle,
  Tags,
  Tag,
} from "./Profilpublic.style";

export default function AboutPublic({ profil }) {
  return (
<BioSection>
  <SectionTitle>À propos</SectionTitle>

  <Bio>{profil.bio || "Aucune biographie pour le moment."}</Bio>

  {profil.centresInteret?.length > 0 && (
    <>
      <SubTitle>Centres d'intérêt</SubTitle>

      <Tags>
        {profil.centresInteret.map((item) => (
          <Tag key={item}>{item}</Tag>
        ))}
      </Tags>
    </>
  )}
</BioSection>
  );
}