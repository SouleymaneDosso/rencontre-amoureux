import styled from "styled-components";

const Container = styled.div`
margin-top:12px;
`;

const Bar = styled.div`

height:8px;

border-radius:50px;

background:rgba(255,255,255,.2);

overflow:hidden;

`;

const Fill = styled.div`

height:100%;

transition:.4s;

width:${props=>props.width}%;

background:${props=>props.color};

`;

const Text = styled.small`

display:block;

margin-top:8px;

color:white;

`;

export default function PasswordStrength({password}){

let score=0;

if(password.length>=8) score++;

if(/[A-Z]/.test(password)) score++;

if(/[0-9]/.test(password)) score++;

if(/[!@#$%^&*]/.test(password)) score++;

let width=10;

let color="#ff3b30";

let text="Très faible";

if(score===1){

width=30;

color="#ff9500";

text="Faible";

}

if(score===2){

width=55;

color="#ffd60a";

text="Moyen";

}

if(score===3){

width=80;

color="#30d158";

text="Bon";

}

if(score===4){

width=100;

color="#00c853";

text="Excellent";

}

return(

<Container>

<Bar>

<Fill

width={width}

color={color}

/>

</Bar>

<Text>

Sécurité : {text}

</Text>

</Container>

)

}