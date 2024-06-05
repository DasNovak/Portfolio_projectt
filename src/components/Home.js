// Home.js
import React from "react";
import Items from "./Items";

const Home = ({ items, error }) => (
  <>
    <div>
      <button onClick={() => console.log("Profile")}>Profile</button>
    </div>
    {items.length > 0 && <Items items={items} />}
    {error && <p>Error: {error}</p>}
  </>
);

export default Home;
