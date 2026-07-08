import {
  FaBirthdayCake,
  FaHeart,
  FaGlobe,
  FaMapMarkerAlt,
} from "react-icons/fa";

import { Card, Title, Grid, Box } from "./InfoCard.style";

export default function InfoCard({ profil }) {
  return (
    <Card>
      <Title>Informations personnelles</Title>

      <Grid>
        <Box>
          <FaBirthdayCake />
          {profil.age} ans
        </Box>

        <Box>
          <FaHeart />
          {profil.recherche}
        </Box>

        <Box>
          <FaGlobe />
          {profil.pays}
        </Box>

        <Box>
          <FaMapMarkerAlt />
          {profil.ville}
        </Box>
      </Grid>
    </Card>
  );
}
