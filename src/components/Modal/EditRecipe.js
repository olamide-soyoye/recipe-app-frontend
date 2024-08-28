import React, { useState, useEffect } from "react";
import { Button, Modal, Form, Row, Col } from "react-bootstrap";
import TextField from "../inputs/Textbox"; 
import axiosInstance from "../../hooks/axiosInstance";
import { toast } from "react-toastify";

const EditRecipe = ({ show, closeModal, recipe, refreshPage }) => {
  const [formState, setFormState] = useState({
    id: "",
    title: "",
    instruction: "",
    image: "",
    ingredients: [{ id: Date.now(), ingredient: "" }]
  });
  const [isLoading, setIsLoading] = useState(false);
  const [preview, setPreview] = useState(null);

  useEffect(() => {
    if (recipe) {
      let parsedIngredients = [];
      if (typeof recipe.ingredients === "string") {
        try {
          parsedIngredients = JSON.parse(recipe.ingredients);
        } catch (error) {
          console.error("Error parsing ingredients JSON:", error);
          parsedIngredients = [];
        }
      } else if (Array.isArray(recipe.ingredients)) {
        parsedIngredients = recipe.ingredients;
      }
      setFormState({
        id: recipe._id || "",
        title: recipe.title || "",
        instruction: recipe.instructions || "",
        image: recipe?.image,
        ingredients: parsedIngredients.map((ingredient) => ({
          id: Date.now() + Math.random(), 
          ingredient,
        })),
      });
    }
  }, [recipe]);

  const addIngredient = () => {
    setFormState((prevState) => ({
      ...prevState,
      ingredients: [
        ...prevState.ingredients,
        { id: Date.now() + Math.random(), ingredient: "" }, 
      ],
    }));
  };

  const removeIngredient = (id) => {
    setFormState((prevState) => ({
      ...prevState,
      ingredients: prevState.ingredients.filter((ingredient) => ingredient.id !== id),
    }));
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setFormState((prevState) => ({
        ...prevState,
        image: file,
      }));
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleValueChange = (value, name) => {
    setFormState((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleCloseModal = () => {
    closeModal();
    setPreview('');
  };

  const handleIngredientChange = (id, value) => {
    setFormState((prevState) => {
      const newIngredients = prevState.ingredients.map((ingredient) =>
        ingredient.id === id ? { ...ingredient, ingredient: value } : ingredient
      );
      return {
        ...prevState,
        ingredients: newIngredients,
      };
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setIsLoading(true);

    const data = new FormData();
    data.append("title", formState.title);
    data.append("instructions", formState.instruction);
    data.append(
      "ingredients",
      JSON.stringify(
        formState.ingredients.map((ingredientObj) => ingredientObj.ingredient)
      )
    );
    if (formState.image) {
      data.append("image", formState.image);
    }

    try {
      console.log(formState)
      const response = await axiosInstance.put(
        `/api/recipes/${formState.id}`,
        data
      );
      toast.success(response.data.message);
      handleCloseModal();
      refreshPage();
    } catch (error) {
      toast.error(error.response.data.message);
      console.error("Error submitting recipes:", error);
    }
    setIsLoading(false);
  };

  return (
    <Modal show={show} onHide={handleCloseModal} size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Edit Recipe</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <Row>
            <Col lg={12} md={12} className="mb-3">
              {preview && (
                <div className="mb-3">
                  <img
                    src={preview}
                    alt="Selected"
                    className="resize_image"
                  />
                </div>
              )}
              <Form.Group>
                <Form.Control
                  type="file"
                  onChange={handleFileChange}
                  accept="image/*"
                />
              </Form.Group>
            </Col>
            <Col lg={12} md={12} className="mb-3">
              <TextField
                title="Recipe Title"
                name="title"
                required
                value={formState.title}
                onValueChange={(value) => handleValueChange(value, "title")}
              />
            </Col>
            <Col lg={12} md={12} className="mb-3">
              <TextField
                title="Instruction"
                name="instruction"
                required
                rows={5}
                value={formState.instruction}
                onValueChange={(value) =>
                  handleValueChange(value, "instruction")
                }
              />
            </Col>
            <Col lg={12} md={12}>
              <fieldset className="border p-3">
                <legend className="w-auto">Ingredients:</legend>
                <div className="d-flex justify-content-end mt-4">
                  {formState.ingredients.length < 5 && (
                    <Button
                      variant="outline-success"
                      onClick={addIngredient}
                      className="mb-3"
                    >
                      + Add Ingredient
                    </Button>
                  )}
                </div>
                {formState.ingredients.map((ingredient) => (
                  <Row key={ingredient.id} className="mb-3 mt-3">
                    <Col lg={10} md={10}>
                      <TextField
                        title={`Ingredient ${formState.ingredients.indexOf(ingredient) + 1}`}
                        name={`ingredient-${ingredient.id}`}
                        required
                        value={ingredient.ingredient}
                        onValueChange={(value) =>
                          handleIngredientChange(ingredient.id, value)
                        }
                      />
                    </Col>
                    <Col lg={2} md={2} className="d-flex align-items-center">
                      {formState.ingredients.length > 1 && (
                        <Button
                          variant="outline-danger"
                          onClick={() => removeIngredient(ingredient.id)}
                        >
                          X Remove
                        </Button>
                      )}
                    </Col>
                  </Row>
                ))}
              </fieldset>
            </Col>
          </Row>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseModal} type="button">
              Close
            </Button>
            <Button variant="success" type="submit" disabled={isLoading}>
              {isLoading ? "Updating..." : "Update"}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default EditRecipe;
