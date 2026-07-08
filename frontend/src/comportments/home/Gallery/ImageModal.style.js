import styled from "styled-components";

export const Overlay = styled.div`
position:fixed;
inset:0;
background:rgba(0,0,0,.92);
z-index:99999;

display:flex;
justify-content:center;
align-items:center;

animation:fade .25s;

@keyframes fade{
from{opacity:0;}
to{opacity:1;}
}
`;

export const Container = styled.div`
position:relative;

width:100%;
height:100%;

display:flex;
justify-content:center;
align-items:center;
`;

export const Image = styled.img`
max-width:92%;
max-height:92%;

border-radius:18px;

object-fit:contain;

box-shadow:0 20px 60px rgba(0,0,0,.45);
`;

export const Close = styled.button`
position:absolute;

top:35px;
right:35px;

width:50px;
height:50px;

border:none;

border-radius:50%;

background:rgba(255,255,255,.15);

color:white;

font-size:22px;

cursor:pointer;

backdrop-filter:blur(10px);

transition:.25s;

&:hover{
transform:scale(1.1);
}
`;

export const ArrowLeft = styled.button`
position:absolute;

left:35px;

width:60px;
height:60px;

border:none;

border-radius:50%;

background:rgba(255,255,255,.15);

color:white;

font-size:34px;

cursor:pointer;

backdrop-filter:blur(10px);

transition:.25s;

&:hover{
transform:scale(1.1);
}
`;

export const ArrowRight = styled(ArrowLeft)`
left:auto;
right:35px;
`;