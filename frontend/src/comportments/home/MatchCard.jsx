import {
  Card,
  Header,
  Avatar,
  Infos,
  Name,
  Age,
  Bio,
  Tags,
  Tag,
  Footer,
  Button,
  Badge,
} from "./MatchCard.style";

export default function MatchCard({ profil }) {
  if (!profil) return null;

  return (
    <Card>
      <Header>
        <Avatar
          src={
            profil.avatar?.url ||
            "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=500"
          }
        />

        <Infos>
          <Name>
            {profil.prenom} {profil.nom}
          </Name>

          <Age>{profil.age} ans</Age>

          <Badge>En ligne</Badge>
        </Infos>
      </Header>

      <Bio>
        {profil.bio || "Ajoutez une biographie pour attirer plus de personnes."}
      </Bio>

      <Tags>
        {profil.centresInteret?.map((item) => (
          <Tag key={item}>{item}</Tag>
        ))}
      </Tags>

      <Footer>
        <Button>Modifier</Button>
      </Footer>
    </Card>
  );
}