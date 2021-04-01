import React, { useState, useEffect, useCallback } from "react";

import IngredientForm from "./IngredientForm";
import IngredientList from "./IngredientList";
import Search from "./Search";

const Ingredients = () => {
  const [userIngredient, setUserIngredients] = useState([]);

  // this is rendered whenever this component is rerendered
  // after and for every render cycle

  // the second argument is the depenencies
  // when using an empty array like this [] as a second argument, useEffect() acts like componentDidMount()
  // it runs ONLY ONCE (after the first render)
  // if we doesn't pass a second argument with [] it will acts like componetDidUpdate()
  // and will get into infinite loop with the request you are sending

  // you could use multiple use effect as many as you want in your component
  // as we don't speciefiy a second argument here this will loged 2 times as we rendering this component twice
  // when we use setUserIngredients
  useEffect(() => {
    console.log("RENDERING INGREDINETS", userIngredient);
  }, [userIngredient]);

  // when using useCallbake function you pass first the function and the second argument
  // is the dependencies of this function & this function has no dependecies so we will pass []
  const filterIngredientHandler = useCallback((fileterIngredients) => {
    setUserIngredients(fileterIngredients);
  }, []);

  const addIngredientHandler = (ingredient) => {
    fetch(
      "https://react-hooks-18607-default-rtdb.firebaseio.com/ingredients.json",
      {
        method: "POST",
        body: JSON.stringify(ingredient),
        headers: { "Content-Type": "application/json" },
      }
    )
      .then((response) => {
        return response.json();
      })
      .then((resData) => {
        setUserIngredients((prevIngredients) => [
          ...prevIngredients,
          { id: resData.name, ...ingredient },
        ]);
      });
  };
  return (
    <div className="App">
      <IngredientForm onAddIngredient={addIngredientHandler} />

      <section>
        <Search onLoadIngredients={filterIngredientHandler} />
        <IngredientList ingredients={userIngredient} onRemoveItem={() => {}} />
      </section>
    </div>
  );
};

export default Ingredients;
