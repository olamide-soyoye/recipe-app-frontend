import React, { useState } from "react";
import TextField from "@mui/material/TextField";

const MyTextbox = (props) => {
  const [textValue, setTextValue] = useState(props.value);
  const [showValidationError, setShowValidationError] = useState(false);
  const [showAccNoValidationError, setShowAccNoValidationError] =
    useState(false);
  const [showProgramCodeError, setShowProgramCodeError] = useState(false);
  const [showEmailValidationError, setShowEmailValidationError] =
    useState(false);

  const handleTextChange = (event) => {
    const value = event.target.value;

    const validateProgramCode = () => {
      setShowProgramCodeError(true);
      const newValue = value.slice(0, 4);
      setTextValue(newValue);
      props.onValueChange(newValue);
      if (value.length === 4) {
        setShowProgramCodeError(false);
      }
    };

    const validateAccountNumber = () => {
      setShowAccNoValidationError(true);
      const newValue = value.slice(0, 10);
      setTextValue(newValue);
      props.onValueChange(newValue);
      if (value.length === 10) {
        setShowAccNoValidationError(false);
      }
    };

    const validatePhoneNumber = () => {
      setShowValidationError(true);
      const newValue = value.slice(0, 11);
      setTextValue(newValue);
      props.onValueChange(newValue);
      if (value.length === 11) {
        setShowValidationError(false);
      }
    };

    const validateEmail = () => {
      setShowEmailValidationError(true);
      setTextValue(value);
      props.onValueChange(value);
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      if (emailPattern.test(value)) {
        setShowEmailValidationError(false);
      }
    };

    if (props.type === "tel") {
      validatePhoneNumber();
    } else if (props.type === "number") {
      validateAccountNumber();
    } else if (props.code === "code") {
      validateProgramCode();
    } else if (props.type === "email") {
      validateEmail();
    } else {
      setTextValue(value);
      props.onValueChange(value); // Pass the value directly
    }
  };

  return (
    <>
      <TextField
        name={props.name}
        label={props.title}
        type={props?.type === "tel" ? "number" : props.type || "text"}
        variant="outlined"
        value={textValue}
        style={{ width: "100%" }}
        onChange={handleTextChange}
        required={props.required ?? false}
        disabled={props.disabled ?? false}
        InputProps={props.InputProps ?? {}}
        sx={{
          "& .MuiInputLabel-root": {
            color: "#808080",
          },
          "& .MuiOutlinedInput-root": {
            "& fieldset": {
              borderColor: "#808080",
            },
            "&:hover fieldset": {
              borderColor: "#808080",
            },
            "&.Mui-focused": {
              "& fieldset": {
                borderColor: "#3c8dbc",
              },
              "& .MuiInputLabel-root": {
                color: "#3c8dbc",
              },
            },
          },
        }}
      />
      {showValidationError && (
        <p className="text-danger">
          <small>Phone number must be 11 digits</small>
        </p>
      )}
      {showAccNoValidationError && (
        <p className="text-danger">
          <small>Account number must be 10 digits</small>
        </p>
      )}
      {showEmailValidationError && (
        <p className="text-danger">
          <small>Email address must contain @ and .domain</small>
        </p>
      )}
      {showProgramCodeError && (
        <p className="text-danger">
          <small>Code cannot be more than 4 characters</small>
        </p>
      )}
    </>
  );
};

export default MyTextbox;
