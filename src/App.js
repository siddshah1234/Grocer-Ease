import React, { useEffect, useState } from 'react';

function App() {
  const [data, setData] = useState(null);

  useEffect(() => {
    fetch('/api/data')
      .then(response => response.json())
      .then(data => setData(data.message));
  }, []);

  return (
    <div className = "App">
      <h1>{data ? data : "Loading..."}</h1>
      <form action="/action_page.php">
        <label for="fname">First name:</label>
        <input type="text" id="fname" name="fname"></input><br></br>
        <label for="lname">Last name:</label>
        <input type="text" id="lname" name="lname"></input><br></br>
        <input type="submit" value="Submit"></input>
      </form>
    </div>
  )




}

export default App;