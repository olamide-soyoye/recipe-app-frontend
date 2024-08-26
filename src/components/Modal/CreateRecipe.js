import React, { useState } from "react";
import { Button, Modal, Form, Row, Col } from "react-bootstrap";
import TextField from "../inputs/Textbox"; // Assuming this works well for other inputs
import axiosInstance from "../../hooks/axiosInstance";
import { toast } from "react-toastify";
import { Dimmer, Loader } from "semantic-ui-react";

const CreateRecipe = ({ show, closeModal, refreshPage }) => {
  const [formState, setFormState] = useState({
    title: "",
    instruction: "",
    ingredients: [{ ingredient: "" }],
    image: null,
  });
  const [loading, setLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [preview, setPreview] = useState(null);

  const addIngredient = () => {
    setFormState((prevState) => ({
      ...prevState,
      ingredients: [...prevState.ingredients, { ingredient: "" }],
    }));
  };

  const resetForm = () => {
    setFormState({
      title: "",
      instruction: "",
      ingredients: [{ ingredient: "" }],
      image: null,
    });
  };

  const removeIngredient = (index) => {
    setFormState((prevState) => ({
      ...prevState,
      ingredients: prevState.ingredients.filter((_, i) => i !== index),
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

  const handleIngredientChange = (index, value) => {
    setFormState((prevState) => {
      const newIngredients = [...prevState.ingredients];
      newIngredients[index].ingredient = value;
      return {
        ...prevState,
        ingredients: newIngredients,
      };
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    setLoading(true);

    let data = new FormData();
    const ingredientsArray = formState.ingredients.map(
      (ingredientObj) => ingredientObj.ingredient
    );

    // Corrected value access
    data.append("title", formState.title);
    data.append("instructions", formState.instruction);
    data.append("ingredients", JSON.stringify(ingredientsArray));

    if (formState.image) {
      data.append("image", formState.image);
    }

    try {
      const response = await axiosInstance.post(`/api/recipes`, data);
      toast.success(response.data.message);
      closeModal();
      refreshPage();
      resetForm();
    } catch (error) {
      toast.error(error.response.data.message);
      console.error("Error submitting recipes:", error);
    }
    setIsLoading(false);
    setLoading(false);
  };

  return (
    <>
      <Dimmer active={loading} inverted>
        <Loader>Loading</Loader>
      </Dimmer>
      <Modal show={show} onHide={closeModal} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Create Recipe</Modal.Title>
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
                      style={{ maxWidth: "100%", height: "auto" }}
                    />
                  </div>
                )}
                {/* Use Form.Control directly for file input */}
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
                  {formState.ingredients.map((ingredient, index) => (
                    <Row key={index} className="mb-3 mt-3">
                      <Col lg={10} md={10}>
                        <TextField
                          title={`Ingredient ${index + 1}`}
                          name={`ingredient-${index}`}
                          required
                          value={ingredient.ingredient}
                          onValueChange={(value) =>
                            handleIngredientChange(index, value)
                          }
                        />
                      </Col>
                      <Col lg={2} md={2} className="d-flex align-items-center">
                        {formState.ingredients.length > 1 && index > 0 && (
                          <Button
                            variant="outline-danger"
                            onClick={() => removeIngredient(index)}
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
              <Button variant="secondary" onClick={closeModal} type="button">
                Close
              </Button>
              <Button variant="success" type="submit" disabled={isLoading}>
                {isLoading ? "Creating..." : "Create"}
              </Button>
            </Modal.Footer>
          </Form>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default CreateRecipe;
