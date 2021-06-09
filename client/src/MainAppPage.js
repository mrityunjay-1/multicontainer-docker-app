import React, { useState, useEffect } from 'react';
import axios from 'axios';

const MainAppPage = () => {
  const [index, setIndex] = useState();
  const [calculatedData, setCalculatedData] = useState({});

  const submitForm = async (event) => {
    console.log("response");

    event.preventDefault();

    let response = await axios.post("/api/values", { index });
    console.log(response);
  };

  useEffect(() => {
    const fetch_data = async () => {
      console.log("Called");
      const seenValues = await axios.get("/api/values/all");

      // fetching current values from redis-server
      const currentValues = await axios.get("/api/values/current");
      setCalculatedData(currentValues.data);

    }
    fetch_data();

    return (
      console.log("great useEffect work has been done here. because this component lifecycle has benn ended")
    );

  }, []);

  return (
    <>
      {/* form */}
      <div style={{ display: 'flex', justifyContent: "center" }}>
        <form onSubmit={submitForm} >
          Enter a  value - <input type="number" min="1" max="25" required onChange={(e) => setIndex(e.target.value)} />
          <input type="submit" value="submit" />
        </form>
      </div>

      <center> <h1> indexes i have Seen </h1> </center>
      <div style={{ display: 'flex', justifyContent: "center" }}>
        {
          Object.keys(calculatedData).map((data) => {
            return (
              <p> { data}, </p>
            );
          })
        }
      </div>


      <center> <h1> values i have calculated </h1> </center>


      {
        Object.values(calculatedData).map((data, index) => {
          let key1 = Object.keys(calculatedData);
          return (
            <div>
              <h3 style={{ textAlign: "center" }}  > {key1[index]} - {data} </h3>
            </div>
          );
        })
      }

    </>
  );
};

export default MainAppPage;