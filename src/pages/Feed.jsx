import React, { useState, useEffect } from "react";
import {
  Container,
  Button,
  Row,
  Col,
  Card,
  Nav,
  Spinner,
  Fade,
} from "react-bootstrap";
import API from "../api/api";
import NavBar from "../components/Navbar";
import PostCard from "../components/PostCard";
import CreatePostModal from "../components/CreatePostModal";

export default function Feed({ currentUser }) {
  const [posts, setPosts] = useState([]);
  const [show, setShow] = useState(false);
  const [activeTab, setActiveTab] = useState("all");
  const [loading, setLoading] = useState(true);
  const [fade, setFade] = useState(true);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      if (!token) return;

      const res = await API.get("/posts", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPosts(res.data.posts || []);
    } catch (err) {
      console.error("Error fetching posts:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchMyPosts = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      if (!token) return;

      const res = await API.get("/posts/my-posts", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPosts(res.data.posts || []);
    } catch (err) {
      console.error("Error fetching my posts:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleTabChange = (tab) => {
    if (tab === activeTab) return;
    setFade(false);
    setTimeout(() => {
      setActiveTab(tab);
      setFade(true);
      if (tab === "mine") fetchMyPosts();
      else fetchPosts();
    }, 150);
  };

  const updatePostLocally = (postId, type, data) => {
    setPosts((prev) =>
      prev.map((p) => {
        if (p._id !== postId) return p;
        if (type === "like") return { ...p, likes: data };
        if (type === "comment") return { ...p, comments: data };
        return p;
      })
    );
  };

  return (
    <>
      <NavBar />

      <Container className="mt-4" style={{ maxWidth: "700px" }}>
        {/* Tabs */}
        <Nav variant="tabs" activeKey={activeTab} className="mb-3 shadow-sm rounded">
          <Nav.Item>
            <Nav.Link
              eventKey="all"
              onClick={() => handleTabChange("all")}
              style={{ fontWeight: activeTab === "all" ? "600" : "400" }}
            >
              🌍 All Posts
            </Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link
              eventKey="mine"
              onClick={() => handleTabChange("mine")}
              style={{ fontWeight: activeTab === "mine" ? "600" : "400" }}
            >
              👤 My Posts
            </Nav.Link>
          </Nav.Item>
        </Nav>

        <Card className="mb-4 shadow-sm" style={{ borderRadius: "12px" }}>
          <Card.Body className="d-flex justify-content-between align-items-center">
            <div>
              <strong>Create a new post</strong>
              <p className="text-muted mb-0" style={{ fontSize: "0.9rem" }}>
                Share your thoughts with the community
              </p>
            </div>
            <Button
              variant="primary"
              onClick={() => setShow(true)}
              style={{ borderRadius: "50px", padding: "0.5rem 1.5rem", fontWeight: "500" }}
            >
              + Post
            </Button>
          </Card.Body>
        </Card>

        {loading ? (
          <div className="text-center mt-5">
            <Spinner animation="border" variant="primary" />
            <p className="text-muted mt-2">Loading posts...</p>
          </div>
        ) : (
          <Fade in={fade}>
            <div>
              {posts.length > 0 ? (
                <Row>
                  {posts.map((post) => (
                    <Col key={post._id} xs={12} className="mb-3">
                      <PostCard
                        post={post}
                        currentUser={currentUser}
                        updatePostLocally={updatePostLocally} 
                      />
                    </Col>
                  ))}
                </Row>
              ) : (
                <Card className="text-center p-4 shadow-sm">
                  <p className="text-muted mb-0">
                    {activeTab === "mine"
                      ? "You haven’t created any posts yet."
                      : "No posts yet. Be the first to share!"}
                  </p>
                </Card>
              )}
            </div>
          </Fade>
        )}
      </Container>

     
      <CreatePostModal
        show={show}
        handleClose={() => setShow(false)}
        onPostCreated={activeTab === "mine" ? fetchMyPosts : fetchPosts}
      />
    </>
  );
}
