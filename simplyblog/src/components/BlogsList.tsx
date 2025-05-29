import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "../api/axios";
import { Card, Button, Pagination } from "react-bootstrap";

interface blogs {
  id: number;
  title: string;
  body: string;
  publishedDate: string;
}

const BlogsList = () => {
  const [blogs, setBlogs] = useState<blogs[]>([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const pageSize = 6;

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const response = await axios.get(
          `/blogs/public?page=${page}&size=${pageSize}`
        );
        setBlogs(response.data.content);
        setTotalPages(response.data.totalPages);
      } catch (error) {
        console.error("Failed to fetch blogs", error);
      }
    };
    fetchBlogs();
  }, [page]);

  const handlePrev = () => {
    if (page > 0) setPage(page - 1);
  };

  const handleNext = () => {
    if (page + 1 < totalPages) setPage(page + 1);
  };

  return (
    <div className="container d-flex flex-wrap justify-content-center gap-3">
      {blogs.length === 0 ? (
        <p>No blogs available</p>
      ) : (
        blogs.map((blog) => (
          <Link
            to={`/blog/${blog.id}`}
            key={blog.id}
            style={{ textDecoration: "none", width: "50vw" }}
          >
            <Card bg="light" text="dark" className="mb-3">
              <Card.Body>
                <Card.Title>{blog.title}</Card.Title>
                <Card.Text>
                  {blog.body.length > 200
                    ? blog.body.substring(0, 200) + "..."
                    : blog.body}
                </Card.Text>
                <small className="text-muted">Published: {blog.publishedDate}</small>
              </Card.Body>
            </Card>
          </Link>
        ))
      )}

      {/* Pagination Controls */}
      <Pagination className="mt-3 w-100 justify-content-center">
        <Pagination.Prev onClick={handlePrev} disabled={page === 0} />
        <Pagination.Item active>{page + 1}</Pagination.Item>
        <Pagination.Next onClick={handleNext} disabled={page + 1 === totalPages} />
      </Pagination>
    </div>
  );
};

export default BlogsList;
