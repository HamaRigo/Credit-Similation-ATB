import React from "react";
import {
  Navbar,
  Collapse,
  Nav,
  NavbarBrand,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  Dropdown,
  Button,
} from "reactstrap";
import Logo from "./Logo";
// @ts-ignore
import { ReactComponent as LogoWhite } from "../assets/images/logos/materialprowhite.svg";
// @ts-ignore
import user1 from "../assets/images/users/user4.jpg";
import { useKeycloak } from "@react-keycloak/web";

const Header = () => {
  const { keycloak } = useKeycloak();

  const [isOpen, setIsOpen] = React.useState(false);

  const [dropdownOpen, setDropdownOpen] = React.useState(false);

  const toggle = () => setDropdownOpen((prevState) => !prevState);
  const Handletoggle = () => {
    setIsOpen(!isOpen);
  };
  const showMobilemenu = () => {
    // @ts-ignore
    document.getElementById("sidebarArea").classList.toggle("showSidebar");
  };
  return (
    <Navbar color="primary" dark expand="md" className="fix-header">
      <div className="d-flex align-items-center">
        <div className="d-lg-block d-none me-5 pe-3">
          <Logo />
        </div>
        <NavbarBrand href="/">
          <LogoWhite className=" d-lg-none" />
        </NavbarBrand>
        <Button
          color="primary"
          className=" d-lg-none"
          onClick={() => showMobilemenu()}
        >
          <i className="bi bi-list"></i>
        </Button>
      </div>
      <div className="hstack gap-2">
        <Button
          color="primary"
          size="sm"
          className="d-sm-block d-md-none"
          onClick={Handletoggle}
        >
          {isOpen ? (
            <i className="bi bi-x"></i>
          ) : (
            <i className="bi bi-three-dots-vertical"></i>
          )}
        </Button>
      </div>
      {!keycloak.authenticated && (
          <DropdownToggle color="transparent">
            <DropdownItem style={{color: "white"}} onClick={() => keycloak.login()}>Login</DropdownItem>
          </DropdownToggle>
      )}
      {!!keycloak.authenticated && (
          <Collapse navbar isOpen={isOpen}>
            <Nav className="me-auto" navbar></Nav>
            <Dropdown isOpen={dropdownOpen} toggle={toggle}>
              <DropdownToggle color="transparent">
                <img
                    src={user1}
                    alt="profile"
                    className="rounded-circle"
                    width="30"
                ></img>
              </DropdownToggle>

              <DropdownMenu>
                <DropdownItem header>Info</DropdownItem>
                <DropdownItem>My Account</DropdownItem>
                <DropdownItem divider />
                <DropdownItem onClick={() => keycloak.logout()}>Logout ({keycloak.tokenParsed?.preferred_username})</DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </Collapse>

      )}
    </Navbar>
  );
};

export default Header;
