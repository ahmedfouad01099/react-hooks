import React, { useState } from "react";

import Card from "../UI/Card";
import "./IngredientForm.css";
import LoadingIndicator from "../UI/LoadingIndicator";

const IngredientForm = React.memo((props) => {
  // const inputState = useState({ title: "", amount: "" });

  // Array destructuring
  const [enterdTitle, setEnteredTitle] = useState("");
  const [enterdAmount, setEnteredAmount] = useState("");
  const submitHandler = (event) => {
    event.preventDefault();
    props.onAddIngredient({ title: enterdTitle, amount: enterdAmount });
  };

  return (
    <section className="ingredient-form">
      <Card>
        <form onSubmit={submitHandler}>
          <div className="form-control">
            <label htmlFor="title">Name</label>
            <input
              type="text"
              id="title"
              value={enterdTitle}
              onChange={(e) => {
                setEnteredTitle(e.target.value);
              }}
            />
          </div>
          <div className="form-control">
            <label htmlFor="amount">Amount</label>
            <input
              type="number"
              id="amount"
              value={enterdAmount}
              onChange={(e) => {
                setEnteredAmount(e.target.value);
              }}
            />
          </div>
          <div className="ingredient-form__actions">
            <button type="submit">Add Ingredient</button>
            {props.loading ? <LoadingIndicator /> : null}
          </div>
        </form>
      </Card>
    </section>
  );
});

export default IngredientForm;
