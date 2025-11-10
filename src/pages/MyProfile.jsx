import React, { useEffect, useState } from "react";
import { Container, Card, Spinner, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import API from "../api/api";

export default function MyProfile() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return setLoading(false);

        const res = await API.get("/auth/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(res.data.user);
      } catch (err) {
        console.error("Error fetching profile:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  if (loading)
    return (
      <Container className="mt-5 text-center">
        <Spinner animation="border" />
      </Container>
    );

  if (!user)
    return (
      <Container className="mt-5 text-center">
        <p>Please login to view your profile.</p>
        <Button variant="primary" onClick={() => navigate("/login")}>
          Go to Login
        </Button>
      </Container>
    );

  return (
    <Container className="mt-5" style={{ maxWidth: "500px" }}>
      <Card className="shadow-sm" style={{ borderRadius: "12px" }}>
        <Card.Body>
          <Card.Title style={{ fontWeight: "600", fontSize: "1.2rem" }}>
            My Profile
          </Card.Title>

          <div className="mt-3">
            <p>
              <strong>Name: </strong> {user.username}
            </p>
            <p>
              <strong>Email: </strong> {user.email}
            </p>
          </div>

          <div className="d-flex justify-content-between mt-4">
            <Button variant="secondary" onClick={() => navigate("/feed")}>
              Back to Feed
            </Button>
            <Button variant="danger" onClick={handleLogout}>
              Logout
            </Button>
          </div>
        </Card.Body>
      </Card>
    </Container>
  );
}
