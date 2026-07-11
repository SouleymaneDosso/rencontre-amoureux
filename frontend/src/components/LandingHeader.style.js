import styled from "styled-components";
import { Link } from "react-router-dom";

export const Header = styled.header`
position:fixed;
top:0;
left:0;
right:0;
height:70px;

display:flex;
justify-content:center;

padding:0 15px;

z-index:1000;

background:rgba(8,8,8,.55);
backdrop-filter:blur(18px);

border-bottom:1px solid rgba(255,255,255,.08);
`;

export const HeaderContent = styled.div`
width:100%;
max-width:1400px;

display:flex;
align-items:center;
justify-content:space-between;

gap:15px;
`;

export const Logo = styled(Link)`
display:flex;
align-items:center;
gap:8px;

text-decoration:none;

font-size:26px;
font-weight:900;

color:white;

white-space:nowrap;

svg{
font-size:30px;
color:#ff2d75;
}

@media(max-width:768px){

font-size:20px;

svg{
font-size:24px;
}

}
`;


export const Nav = styled.nav`
display:flex;
gap:35px;

a{
color:white;
text-decoration:none;
font-weight:600;
}

@media(max-width:900px){
display:none;
}
`;

export const Actions = styled.div`
display:flex;
align-items:center;
gap:10px;

flex-shrink:0;
`;

export const Login = styled(Link)`
padding:10px 18px;

border-radius:999px;

text-decoration:none;

color:white;

border:1px solid rgba(255,255,255,.15);

font-size:14px;

white-space:nowrap;

@media(max-width:768px){
display:none;
}
`;

export const Register = styled(Link)`
padding:10px 18px;

border-radius:999px;

text-decoration:none;

background:linear-gradient(135deg,#ff2d75,#8b5cf6);

color:white;

font-weight:700;

font-size:14px;

white-space:nowrap;

@media(max-width:768px){

padding:10px 14px;

font-size:13px;

}
`;