import React, { useState } from "react";
import { Card, Button, Form } from "react-bootstrap";
import API from "../api/api";

export default function PostCard({ post, currentUser, updatePostLocally }) {
  const [comment, setComment] = useState("");
  const [loadingLike, setLoadingLike] = useState(false);
  const [comments, setComments] = useState(post.comments || []);
  const [likes, setLikes] = useState(post.likes || []);

  const likedByCurrentUser = likes.some(
    (u) => (typeof u === "object" ? u._id : u) === currentUser?.id
  );

  const handleLike = async () => {
    try {
      setLoadingLike(true);
      const token = localStorage.getItem("token");
      if (!token) return;

      await API.post(`/posts/like/${post._id}`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const newLikes = likedByCurrentUser
        ? likes.filter((u) => (typeof u === "object" ? u._id : u) !== currentUser.id)
        : [...likes, currentUser.id];

      setLikes(newLikes);
      updatePostLocally(post._id, "like", newLikes);
    } catch (err) {
      console.error("Like error:", err);
    } finally {
      setLoadingLike(false);
    }
  };
  const handleComment = async (e) => {
    e.preventDefault();
    if (!comment.trim()) return;

    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const res = await API.post(
        `/posts/comment/${post._id}`,
        { text: comment },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const newComments = [res.data.comment, ...comments];
      setComments(newComments);
      setComment("");
      updatePostLocally(post._id, "comment", newComments);
    } catch (err) {
      console.error("Comment error:", err);
    }
  };

  const getTimeAgoWithFullDate = (dateString) => {
    const postDate = new Date(dateString);
    const now = new Date();
    const diff = Math.floor((now - postDate) / 1000);

    let timeAgo = "";
    if (diff < 60) timeAgo = "Just now";
    else if (diff < 3600) timeAgo = `${Math.floor(diff / 60)} minute${Math.floor(diff / 60) > 1 ? "s" : ""} ago`;
    else if (diff < 86400) timeAgo = `${Math.floor(diff / 3600)} hour${Math.floor(diff / 3600) > 1 ? "s" : ""} ago`;
    else if (diff < 172800) timeAgo = "Yesterday";
    else timeAgo = postDate.toLocaleDateString(undefined, { month: "short", day: "numeric" });

    const formattedDate = postDate.toLocaleString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    });

    return `${timeAgo} • ${formattedDate}`;
  };

  return (
    <Card className="mb-3 shadow-sm" style={{ borderRadius: "12px", overflow: "hidden" }}>
      <Card.Body>
        <Card.Title style={{ fontWeight: 600, fontSize: "1rem", marginBottom: "0.25rem" }}>
          {post.username}
        </Card.Title>
        <Card.Subtitle className="mb-2 text-muted" style={{ fontSize: "0.8rem" }}>
          {getTimeAgoWithFullDate(post.createdAt)}
        </Card.Subtitle>

        {post.text && <Card.Text style={{ fontSize: "0.95rem", color: "#333" }}>{post.text}</Card.Text>}
        {post.image && (
          <div style={{ maxHeight: "400px", overflow: "hidden", borderRadius: "10px", marginBottom: "10px" }}>
            <Card.Img
              src={post.image}
              alt="post"
              style={{ objectFit: "cover", width: "100%", maxHeight: "400px" }}
            />
          </div>
        )}

        <div className="d-flex gap-3 align-items-center mb-2">
          <Button
            size="sm"
            variant={likedByCurrentUser ? "primary" : "outline-primary"}
            onClick={handleLike}
            disabled={loadingLike}
          >
            👍 {likes.length}
          </Button>
          <span style={{ fontSize: "0.9rem" }}>💬 {comments.length}</span>
        </div>

        <Form onSubmit={handleComment}>
          <Form.Control
            size="sm"
            placeholder="Write a comment..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            style={{ borderRadius: "20px", padding: "6px 12px", fontSize: "0.9rem" }}
          />
        </Form>

        {comments.length > 0 && (
          <div className="mt-2" style={{ fontSize: "0.85rem" }}>
            {comments.slice(0, 2).map((c, idx) => (
              <p key={idx} className="mb-1">
                <strong>{c.username || "User"}:</strong> {c.text}
              </p>
            ))}
            {comments.length > 2 && <p className="text-muted mb-0">View more comments...</p>}
          </div>
        )}
      </Card.Body>
    </Card>
  );
}
