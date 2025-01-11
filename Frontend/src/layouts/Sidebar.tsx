import { Button, Nav, NavItem } from "reactstrap";
import { Link, useLocation } from "react-router-dom";
import profile from "../assets/images/users/profile.png";
import probg from "../assets/images/bg/bg_banking.avif";
import React from "react";

const navigation = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: "bi bi-speedometer2",
  },
  {
    title: "Clients",
    href: "/Clients",
    icon: "bi bi-people",
  },
  {
    title: "Comptes",
    href: "/Comptes",
    icon: "bi bi-archive",
  },
  {
    title: "Credits",
    href: "/Credits",
    icon: "bi bi-hdd",
  },
  {
    title: "OCR",
    href: "/Ocrs",
    icon: "bi bi-file-earmark-check",
  },
  {
    title: "Users",
    href: "/Users",
    icon: "bi bi-person-lock",
  },
  {
    title: "Roles",
    href: "/Roles",
    icon: "bi bi-shield-lock",
  },
];

const Sidebar = () => {
  const showMobilemenu = () => {
    document.getElementById("sidebarArea")?.classList.toggle("showSidebar");
  };
  let location = useLocation();

  return (
    <div>
      <div className="d-flex align-items-center"></div>
      <div
        className="profilebg"
        style={{ background: `url(${probg}) no-repeat` }}
      >
        <div className="p-3 d-flex">
          <img src={profile} style={{color: 'white'}} alt="user" width="50" className="rounded-circle" />
          <Button
            color="white"
            className="ms-auto text-white d-lg-none"
            onClick={() => showMobilemenu()}
          >
            <i className="bi bi-x"></i>
          </Button>
        </div>
        <div className="bg-dark text-white p-2 opacity-75">User X</div>
      </div>
      <div className="p-3 mt-2">
        <Nav vertical className="sidebarNav">
          {navigation.map((navi, index) => (
            <NavItem key={index} className="sidenav-bg">
              <Link
                to={navi.href}
                className={
                  location.pathname === navi.href
                    ? "active nav-link py-3"
                    : "nav-link text-secondary py-3"
                }
              >
                <i className={navi.icon}></i>
                <span className="ms-3 d-inline-block">{navi.title}</span>
              </Link>
            </NavItem>
          ))}
        </Nav>
      </div>
    </div>
  );
};

export default Sidebar;
