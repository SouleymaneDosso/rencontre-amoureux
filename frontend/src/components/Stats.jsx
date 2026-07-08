import { motion } from "framer-motion";
import styled from "styled-components";
import { FaHeart, FaUsers, FaComments, FaStar } from "react-icons/fa";

const Section = styled.section`
  margin-top: 80px;

  display: grid;

  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));

  gap: 25px;
`;

const Card = styled(motion.div)`
  background: rgba(255,255,255,.08);

  backdrop-filter: blur(18px);

  border: 1px solid rgba(255,255,255,.12);

  border-radius: 22px;

  padding: 30px;

  text-align: center;

  color: white;

  transition: .3s;

  &:hover{

    transform: translateY(-8px);

  }
`;

const Icon = styled.div`
  font-size: 42px;

  color: #ff5a92;

  margin-bottom: 18px;
`;

const Number = styled.h2`
  font-size: 42px;

  margin: 0;
`;

const Label = styled.p`
  opacity: .8;

  margin-top: 10px;
`;

const stats = [

{

icon:<FaUsers/>,

number:"54 000+",

label:"Membres"

},

{

icon:<FaHeart/>,

number:"9 500+",

label:"Couples formés"

},

{

icon:<FaComments/>,

number:"120 000+",

label:"Messages échangés"

},

{

icon:<FaStar/>,

number:"4.9/5",

label:"Satisfaction"

}

];

export default function Stats(){

return(

<Section>

{

stats.map((item,index)=>(

<Card

key={index}

initial={{

opacity:0,

y:40

}}

whileInView={{

opacity:1,

y:0

}}

viewport={{

once:true

}}

transition={{

duration:.6,

delay:index*.15

}}

>

<Icon>

{item.icon}

</Icon>

<Number>

{item.number}

</Number>

<Label>

{item.label}

</Label>

</Card>

))

}

</Section>

)

}