import {
  Card,
  Circle,
  Number,
  Right,
  Title,
  Text,
  Button,
} from "./ProfileProgress.style";

export default function ProfileProgress({
  progress,
  message,
  navigate,
  profil,
}) {
  return (
    <Card>

      <Circle progress={progress}>
        <Number>{progress}%</Number>
      </Circle>

      <Right>

        <Title>Complétez votre profil</Title>

        <Text>{message}</Text>

        {progress < 100 && (
          <Button onClick={() => navigate(`/modifier/${profil._id}`)}>
            Compléter maintenant
          </Button>
        )}

      </Right>

    </Card>
  );
}