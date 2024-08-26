import { Link } from "react-router-dom";
import { Card, Button, Container } from "react-bootstrap";
import EditRecipe from "./Modal/EditRecipe";
import React, { useState } from "react";
import withReactContent from "sweetalert2-react-content";
import Swal from "sweetalert2";
import axiosInstance from "../hooks/axiosInstance";
import { toast } from "react-toastify";

import "./Recipe.css";

const RecipeCard = ({ recipe, refreshPage }) => {
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const MySwal = withReactContent(Swal);
  const handleDelete = async (id) => {
    const result = await MySwal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    });

    if (result.isConfirmed) {
      try {
        await axiosInstance.delete(`/api/recipes/${id}`);
        refreshPage();
        toast.success("Recipe removed successfully!");
      } catch (error) {
        toast("Error deleting recipe:", error);
      }
    }
  };
  return (
    <>
      <Container className="container">
        <Card className="recipe-card">
          {recipe.image ? (
            <Card.Img
              variant="top"
              src={recipe.image}
              alt={recipe.title}
              className="card-img-top"
            />
          ) : (
            <Card.Img
              variant="top"
              src="https://via.placeholder.com/50x50?text=1x1"
              alt={recipe.title}
              className="card-img-top"
              style={{ height: "200px", width: "325px", objectFit: "cover" }}
            />
          )}
          <Card.Body>
            <Card.Title>
              <h3>{recipe.title}</h3>
            </Card.Title>
            
            <Link variant="primary" to={`/recipe/${recipe.id}`}>
              View
            </Link>
            <Button
              variant="outline-success"
              className="mx-3"
              onClick={handleShow}
            >
              Edit
            </Button>
            <Button
              variant="outline-danger"
              onClick={() => handleDelete(recipe.id)}
            >
              Delete
            </Button>{" "}
          </Card.Body>
        </Card>
      </Container>
      <EditRecipe
        show={show}
        closeModal={handleClose}
        recipe={recipe}
        refreshPage={refreshPage}
      />
    </>
  );
};

export default RecipeCard;
