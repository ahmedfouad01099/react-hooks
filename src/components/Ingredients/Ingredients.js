import React, { useReducer, useEffect, useCallback, useMemo } from "react";

import IngredientForm from "./IngredientForm";
import IngredientList from "./IngredientList";
import ErrorModal from "../UI/ErrorModal";
import Search from "./Search";
import useHttp from "../../hooks/http";

// useReducer we define it outside the component
// as it's recreated whenever the component rerendered w

const ingredientReducer = (currentIngredients, action) => {
  switch (action.type) {
    case "SET":
      return action.ingredients;
    case "ADD":
      return [...currentIngredients, action.ingredient];
    case "DELETE":
      return currentIngredients.filter((ing) => ing.id !== action.id);
    default:
      throw new Error("Should not get there!");
  }
};

const Ingredients = () => {
  const [userIngredients, dispatch] = useReducer(ingredientReducer, []);
  const {
    isLoading,
    error,
    data,
    sendRequest,
    reqExtra,
    reqIdentifier,
  } = useHttp();
  // another senario of using useReducer when you have conected state like isLoading & error

  // const [isLoading, setIsLoading] = useState(false);
  // const [error, setError] = useState();
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
    if (!isLoading && !error && reqIdentifier === "REMOVE_INGREDIENT")
      if (reqExtra) {
        dispatch({ type: "DELETE", id: reqExtra });
      } else if (!isLoading && !error && reqIdentifier === "ADD_INGREDIENT") {
        dispatch({ type: "ADD", ingredient: { id: data.name, ...reqExtra } });
      }
  }, [data, reqExtra, reqIdentifier, isLoading, error]);

  // when using useCallbake function you pass first the function and the second argument
  // is the dependencies of this function & this function has no dependecies so we will pass []
  const filterIngredientHandler = useCallback((fileterIngredients) => {
    // setUserIngredients(fileterIngredients);
    dispatch({ type: "SET", ingredients: fileterIngredients });
  }, []);

  const addIngredientHandler = useCallback(
    (ingredient) => {
      sendRequest(
        "https://react-hooks-18607-default-rtdb.firebaseio.com/ingredients.json",
        "POST",
        JSON.stringify(ingredient),
        ingredient,
        "ADD_INGREDIENT"
      );
      // dispatchHttp({ type: "SEND" });
      // fetch(
      //   "https://react-hooks-18607-default-rtdb.firebaseio.com/ingredients.json",
      //   {
      //     method: "POST",
      //     body: JSON.stringify(ingredient),
      //     headers: { "Content-Type": "application/json" },
      //   }
      // )
      //   .then((response) => {
      //     dispatchHttp({ type: "RESPONSE" });
      //     return response.json();
      //   })
      //   .then((resData) => {
      //     // setUserIngredients((prevIngredients) => [
      //     //   ...prevIngredients,
      //     //   { id: resData.name, ...ingredient },
      //     // ]);
      //     dispatch({
      //       type: "ADD",
      //       ingredient: { id: resData.name, ...ingredient },
      //     });
      //   });
    },
    [sendRequest]
  );

  const removeIngredientHandler = useCallback(
    (ingredientId) => {
      // setIsLoading(true);
      sendRequest(
        `https://react-hooks-18607-default-rtdb.firebaseio.com/ingredients/${ingredientId}.json`,
        "DELETE",
        null,
        ingredientId,
        "REMOVE_INGREDIENT"
      );
    },
    [sendRequest]
  );

  const clearError = () => {
    // setError(null);
    // dispatchHttp({ type: "CLEAR" });
  };

  const ingredientList = useMemo(() => {
    return (
      <IngredientList
        ingredients={userIngredients}
        onRemoveItem={removeIngredientHandler}
      />
    );
  }, [userIngredients, removeIngredientHandler]);
  return (
    <div className="App">
      {error && <ErrorModal onClose={clearError}>{error}</ErrorModal>}
      <IngredientForm
        onAddIngredient={addIngredientHandler}
        loading={isLoading}
      />

      <section>
        <Search onLoadIngredients={filterIngredientHandler} />
        {ingredientList}
      </section>
    </div>
  );
};

export default Ingredients;
