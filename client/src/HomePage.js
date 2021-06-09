import React from 'react';
import { NavLink } from 'react-router-dom';

const HomePage = () => {
  return (
    <>
      <p> HomePage </p>
      <NavLink to="/app"> Open App </NavLink>
      <NavLink to="/"> HomePage </NavLink>
    </>
  );
}

export default HomePage;