import { FaPlus, FaTrash, FaEllipsisH } from "react-icons/fa";

import {
  Section,
  Header,
  Title,
  AddPhotoButton,
  Grid,
  Card,
  Image,
  MenuButton,
  Menu,
  Item,
} from "./Gallery.style";


export default function Gallery({

  profil,

  uploadMultiple,

  ouvririmage,

  suppression,

  modaldelete,

  setmodalDelete,

}) {

  return (

    <Section>

      <Header>

        <Title>

          Mes photos

        </Title>

        <AddPhotoButton htmlFor="photosInput">

          <FaPlus/>

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

        {

          profil.photos?.map((photo,index)=>(

            <Card

              key={photo.public_id}

            >

              <Image

                src={photo.url}

                onClick={()=>ouvririmage(index)}

              />

              <MenuButton

                onClick={(e)=>{

                  e.stopPropagation();

                  setmodalDelete(

                    modaldelete===photo.public_id

                    ?null

                    :photo.public_id

                  );

                }}

              >

                <FaEllipsisH/>

              </MenuButton>

              <Menu

                open={modaldelete===photo.public_id}

              >

                <Item

                  onClick={()=>{

                    suppression(photo.public_id);

                    setmodalDelete(null);

                  }}

                >

                  <FaTrash/>

                  {" "}Supprimer

                </Item>

              </Menu>

            </Card>

          ))

        }

      </Grid>

    </Section>

  );

}