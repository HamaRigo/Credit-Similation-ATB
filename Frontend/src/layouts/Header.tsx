import React, { useState } from "react";
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
import profile from "../assets/images/users/profile.png";
import atb from "../assets/images/logos/atb.png";
import { useAuth } from "../AuthProvider";

const Header = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [dropdownOpen, setDropdownOpen] = useState(false);
  const { isAuthenticated, login, logout } = useAuth();

    const toggle = () => setDropdownOpen((prevState) => !prevState);
    const Handletoggle = () => {
        setIsOpen(!isOpen);
    };
    const showMobilemenu = () => {
        document.getElementById("sidebarArea")?.classList.toggle("showSidebar");
    };
    return (
        <Navbar color="secondary" dark expand="md" className="fix-header">
          <div className="d-flex align-items-center">
            <div className="d-lg-block d-none me-5 pe-3">
              <Logo />
            </div>
            <NavbarBrand href="/">
              <img src={atb} width="35" alt="logo ATB" className=" d-lg-none"/>
            </NavbarBrand>
            <Button
                color="secondary"
                className=" d-lg-none"
              onClick={() => showMobilemenu()}
            >
              <i className="bi bi-list"></i>
            </Button>
          </div>
          <div className="hstack gap-2">
            <Button
              color="secondary"
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
            <Collapse navbar isOpen={isOpen}>
                    <Nav className="me-auto" navbar></Nav>
                    <Dropdown isOpen={dropdownOpen} toggle={toggle}>
                      <DropdownToggle color="transparent">
                        <img
                          src={profile}
                          alt="profile"
                          className="rounded-circle"
                          width="30"
                        ></img>
                      </DropdownToggle>
                      <DropdownMenu>
                          <DropdownItem header>Info</DropdownItem>
                          {isAuthenticated ? (
                            <>
                              <DropdownItem>My Account</DropdownItem>
                              <DropdownItem divider />
                              <DropdownItem onClick={logout}>Logout</DropdownItem>
                            </>
                          ) : (
                            <DropdownItem onClick={login}>Login</DropdownItem>
                          )}
                     </DropdownMenu>
                    </Dropdown>
              </Collapse>
        </Navbar>
    );
};

export default Header;
