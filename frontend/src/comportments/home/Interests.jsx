import { FaHeart } from "react-icons/fa";
import {
  Card,
  Title,
  Container,
  Chip,
  Empty,
} from "./Interests.style";

export default function Interests({ interets }) {
  return (
    <Card>

      <Title>
        <FaHeart />
        Centres d'intérêt
      </Title>

      {interets.length > 0 ? (
        <Container>
          {interets.map((item) => (
            <Chip key={item}>
              {item}
            </Chip>
          ))}
        </Container>
      ) : (
        <Empty>
          Aucun centre d'intérêt renseigné.
        </Empty>
      )}

    </Card>
  );
}