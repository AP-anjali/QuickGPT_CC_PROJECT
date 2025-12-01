// /client/src/components/ThirdParty.jsx
import React, { useEffect, useState } from 'react';

const ThirdParty = () => {
  const [joke, setJoke] = useState(null);

  const fetchJoke = async () => {
    try 
    {
      const res = await fetch('https://official-joke-api.appspot.com/jokes/random');
      const data = await res.json();
      setJoke(`${data.setup} — ${data.punchline}`);
    } 
    catch (e) 
    {
      setJoke('Could not fetch joke.');
    }
  };

  useEffect(() => { fetchJoke(); }, []);

  return (
    <section aria-label="Third party API" className="p-2 mt-4">
      <h4 className="text-lg text-gray-500 dark:text-gray-300">Daily Joke</h4>
      <p className="text-md text-gray-700 dark:text-gray-200">{joke || 'Loading...'}</p>
      <button onClick={fetchJoke} className="mt-2 text-s underline">Another</button>
    </section>
  );
};

export default ThirdParty;
