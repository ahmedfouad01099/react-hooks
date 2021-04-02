import React, { useState, useEffect, useRef } from "react";

import Card from "../UI/Card";
import "./Search.css";

const Search = React.memo((props) => {
  const { onLoadIngredients } = props;
  const [enteredFilter, setEnteredFilter] = useState("");

  const inputRef = useRef();
  useEffect(() => {
    const timer = setTimeout(() => {
      if (enteredFilter === inputRef.current.value) {
        const qurey =
          enteredFilter.length === 0
            ? ""
            : `?orderBy="title"&equalTo="${enteredFilter}"`;
        fetch(
          "https://react-hooks-18607-default-rtdb.firebaseio.com/ingredients.json" +
            qurey
        )
          .then((res) => res.json())
          .then((resData) => {
            let loadedIngredients = [];
            for (const key in resData) {
              loadedIngredients.push({
                id: key,
                title: resData[key].title,
                amount: resData[key].amount,
              });
            }
            // props.onLoadIngredients(loadedIngredients);
            onLoadIngredients(loadedIngredients); // as we do object destructure
          });
      }
    }, 500);
    return () => {
      clearTimeout(timer);
    };
  }, [enteredFilter, onLoadIngredients]);

  return (
    <section className="search">
      <Card>
        <div className="search-input">
          <label>Filter by Title</label>
          <input
            ref={inputRef}
            type="text"
            value={enteredFilter}
            onChange={(e) => setEnteredFilter(e.target.value)}
          />
        </div>
      </Card>
    </section>
  );
});

export default Search;
