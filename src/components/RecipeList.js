import React, { useState, useEffect } from "react";
import RecipeCard from "./RecipeCard";
import { Container, Pagination, Button, Row, Col } from "react-bootstrap";
import TextField from "../components/inputs/Textbox";
import axiosInstance from "../hooks/axiosInstance";
import CreateRecipe from "./Modal/CreateRecipe";
import { toast } from "react-toastify";
import { Dimmer, Loader } from "semantic-ui-react";

const RecipeList = () => {
  const [recipes, setRecipes] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filterValue, setFilterValue] = useState("");
  const [show, setShow] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const [loading, setLoading] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  useEffect(() => {
    const fetchRecipes = async () => {
      setLoading(true);
      try {
        const response = await axiosInstance.get(
          `/api/recipes?page=${page}&limit=${20}`
        );

        // const sortedRecipes = response.data.data.sort((a, b) => b.id - a._id);
        const sortedRecipes = response.data.data.sort((a, b) => b._id.localeCompare(a._id));
        // console.log('sortedRecipes', sortedRecipes)
        setRecipes(sortedRecipes); 
        setTotalPages(response.data.pagination.totalPages);
      } catch (error) {
        toast.error("Opps something went wrong");
      }
      setLoading(false);
    };

    fetchRecipes();
  }, [page, refreshKey]); 

  const handleValueChange = (newValue) => {
    setFilterValue(newValue.toLowerCase());
  };

  const handleRefresh = () => {
    setRefreshKey((prevRefreshKey) => prevRefreshKey + 1);
  };

  const handlePageChange = (number) => {
    setLoading(true);
    setPage(number);
  };

  const filteredRecipes = recipes.filter((recipe) => {
    const title = recipe?.title ?? "";
    return title.toLowerCase().includes(filterValue);
  });

  let items = [];
  for (let number = 1; number <= totalPages; number++) {
    items.push(
      <Pagination.Item
        key={number}
        active={number === page}
        onClick={() => handlePageChange(number)}
      >
        {number}
      </Pagination.Item>
    );
  }

  return (
    <>
      <Container className="mt-4">
        {/* Loader Dimmer */}
        <Dimmer active={loading} inverted>
          <Loader>Loading</Loader>
        </Dimmer>

        <Row className="justify-content-md-center mb-3">
          <Col xs="12" lg="4" className="mb-2">
            <h2>Latest And Greatest</h2>
          </Col>
          <Col xs="8" lg="6" className="mb-2">
            <TextField
              title="Filter list"
              name="filter"
              onValueChange={handleValueChange}
              value={filterValue}
            />
          </Col>
          <Col xs="4" lg="2" className="mb-2">
            <Button variant="outline-success" onClick={handleShow}>
              Add Recipe
            </Button>
          </Col>
        </Row>

        <div className="recipe-list mt-4">
          <Row>
            {filteredRecipes.length > 0 ? (
              filteredRecipes.map((recipe) => (
                <Col lg="4" md="4" xs="12" sm="12" key={recipe.id}>
                  <RecipeCard recipe={recipe} refreshPage={handleRefresh} />
                </Col>
              ))
            ) : (
              <Col md={12}>
                <div className="alert alert-info text-center">
                  No recipes found.
                </div>
              </Col>
            )}
          </Row>
        </div>

        <div className="d-flex justify-content-center mt-4">
          <Pagination>{items}</Pagination>
        </div>
      </Container>
      <CreateRecipe
        show={show}
        closeModal={handleClose}
        refreshPage={handleRefresh}
      />
    </>
  );
};

export default RecipeList;
