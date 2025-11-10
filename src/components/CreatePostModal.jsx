import React, { useState } from "react";
import { Modal, Button, Form, Spinner } from "react-bootstrap";
import API from "../api/api";

export default function CreatePostModal({ show, handleClose, onPostCreated }) {
  const [text, setText] = useState("");
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!text && !image) return alert("Add text or image to post!");

    try {
      setLoading(true);
      const formData = new FormData();
      if (text) formData.append("text", text);
      if (image) formData.append("image", image);

      const token = localStorage.getItem("token");
      if (!token) throw new Error("Please login first");

      const res = await API.post("/posts/create", formData, {
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "multipart/form-data" },
      });

      onPostCreated(res.data); 
      setText("");
      setImage(null);
      handleClose();
    } catch (err) {
      console.error("Create post error:", err);
      alert(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Create Post</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Control
              as="textarea"
              rows={3}
              placeholder="What's on your mind?"
              value={text}
              onChange={(e) => setText(e.target.value)}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Upload Image (optional)</Form.Label>
            <Form.Control
              type="file"
              accept="image/*"
              onChange={(e) => setImage(e.target.files[0])}
            />
          </Form.Group>

          <Button type="submit" className="w-100" disabled={loading}>
            {loading ? <><Spinner animation="border" size="sm" className="me-2" />Posting...</> : "Post"}
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
}
