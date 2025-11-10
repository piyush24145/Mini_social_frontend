import React from "react";
import { Navbar, Container, Nav, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

export default function NavBar() {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <Navbar bg="primary" variant="dark" expand="lg" className="py-3 shadow-sm">
      <Container>

        <Navbar.Brand
          style={{ cursor: "pointer", fontWeight: "700", fontSize: "1.4rem" }}
          onClick={() => navigate("/feed")}
        >
          Mini Social App
        </Navbar.Brand>

        <Nav className="ms-auto d-flex align-items-center gap-3">
          <Button
            variant="outline-light"
            size="sm"
            className="px-3 py-1"
            onClick={() => navigate("/profile")}
          >
            Profile
          </Button>

          <Button
            variant="outline-light"
            size="sm"
            className="px-3 py-1"
            onClick={logout}
          >
            Logout
          </Button>
        </Nav>
      </Container>
    </Navbar>
  );
}
