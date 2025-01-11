import React from "react";
import { Link } from "react-router-dom";
import atb from "../assets/images/logos/atb.png";

const Logo = () => {
  return (
      <Link to="/">
          <img src={atb} width="45" alt="logo ATB"/>
      </Link>
  );
};

export default Logo;
