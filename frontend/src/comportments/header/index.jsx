import "../header.css";
import { Link } from "react-router-dom";
import { useState } from "react";

function Header() {
  const [isopen, setOpen] = useState(false);
  return (
    <header className="header">
      <nav>
        <ul className={`menu ${isopen ? "ouvert" : ""}`}>
          <li className="close">
            <button className="fermer" onClick={() => setOpen(false)}> 
              ✕
            </button>
          </li>
          <li onClick={() => setOpen(prev => !prev)}>
            <Link to="/">Home</Link>
          </li>
        </ul>
        <button className="bouton" onClick={() => setOpen(prev => !prev)}>
          <svg
            width="15"
            height="15"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <rect y="4" width="24" height="2" fill="currentColor" />
            <rect y="11" width="24" height="2" fill="currentColor" />
            <rect y="18" width="24" height="2" fill="currentColor" />
          </svg>
        </button>
      </nav>
    </header>
  );
}
export default Header;
