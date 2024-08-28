import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axiosInstance from "../hooks/axiosInstance";
import { Card, Container, Row, Col } from "react-bootstrap";
import { Dimmer, Loader } from "semantic-ui-react";


const RecipeDetailPage = () => {
  const { id } = useParams();
  const [recipe, setRecipe] = useState({
    id: 1,
    title: "pasta",
    instructions: "A delicious pasta thingsww...",
    ingredients: JSON.stringify(["pasta rice", "tomato sauce"]), 
    // image: "/assets/img/receipe_prepare.jpg",
  });
  const [loading, setLoading] = useState(false);


  useEffect(() => {
    setLoading(true);
    const fetchRecipe = async () => {
      try {
        const response = await axiosInstance.get(`/api/recipes/${id}`);
        const fetchedRecipe = response.data.data;
        setLoading(false);
        // if (typeof fetchedRecipe.ingredients === "string") {
          fetchedRecipe.ingredients = JSON.parse(fetchedRecipe.ingredients);
        // }
        console.log(fetchedRecipe);

        setRecipe(fetchedRecipe);
      } catch (error) {
        console.error("Error fetching recipe details:", error);
        setLoading(false);
      }
    };

    fetchRecipe();
  }, [id]);

  const handleBackClick = () => {
    window.history.back();
  }

  const ingredientsList = Array.isArray(recipe.ingredients)
    ? recipe.ingredients
    : [];

  return (
    <Container>
      <Dimmer active={loading} inverted>
          <Loader>Loading</Loader>
        </Dimmer>
      <Card className="mt-5 p-5 card_size">
        <Card.Title>
          <h3 className="">
            &nbsp;&nbsp;&nbsp;
            <span className="text-info text-capitalize">
              {recipe.title}
            </span>{" "}
            <span className="text-success">Recipe Information</span>
          </h3>
        </Card.Title>
        <Card.Body>
          <Row className="justify-content-md-center mb-3">
            <Col xs="12" lg="6" sm="12" className="mb-4">
            
                <Card.Img
                  variant="top"
                  src={recipe.image}
                  alt={recipe.title}
                  className="card-img-top resize_image" 
                />

            </Col>
            <Col xs="12" lg="6" sm="12" className="">
              <Card.Text>
                <h5>Instructions:</h5>
              </Card.Text>
              <p
                style={{
                  display: "-webkit-box",
                  WebkitLineClamp: "10",
                  WebkitBoxOrient: "vertical",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                {recipe.instructions}
              </p>
              <Card.Text>
                <h5>Ingredients:</h5>
              </Card.Text>
              <ul>
                {ingredientsList.map((ingredient, index) => (
                  <li key={index}>{ingredient}</li>
                ))}
              </ul>
              <button className="btn btn-secondary mt-5" onClick={handleBackClick}>Back</button>

            </Col>
          </Row>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default RecipeDetailPage;
