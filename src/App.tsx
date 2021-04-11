import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

function App() {
  return (
    <div>
      <Router>
        <nav className="flex items-center justify-center p-4 border-b border-gray-200 min-h-20">
          <div className="p-2 text-3xl font-extrabold text-white transform bg-orange-500 border-b-2 border-orange-600 shadow hover:bg-orange-600 hover:border-orange-700 -rotate-2">
            Sponsor Roxy
          </div>
        </nav>

        <Switch>
          <Route path="/" exact>
            <Home />
          </Route>
        </Switch>
      </Router>
    </div>
  );
}

const data = [
  {
    name: 'Treats',
    desc:
      'Share special treats, anything from homemade whipped cream to tasty bones!',
    image: '/images/roxy_treat.jpg',
  },
  {
    name: 'Adventure',
    desc:
      'Travel together with Roxy on adventures to far away castles and mysterious forests',
    image: '/images/roxy_adventure.jpg',
  },
  {
    name: 'Toys',
    desc:
      "Soft squishy toys with secret squeakers inside? Roxy's favorite toy!",
    image: '/images/roxy_toy2.jpg',
  },
];

function Home() {
  return (
    <div>
      <div className="flex items-center justify-center p-4 text-center text-white bg-black">
        <div>
          <h1 className="text-3xl">Sponsor Roxy</h1>
          <p className="text-lg">Roxy is the best dog in the world</p>
          <p className="text-lg">Sponsor her treats, adventures and toys</p>
        </div>
      </div>

      <div className="container flex flex-wrap justify-center p-4 mx-auto">
        {data.map((entry, i) => {
          return (
            <div key={i} className="w-1/4 p-2">
              <div className="ml-1 text-lg text-center">{entry.name}</div>
              <img src={entry.image} alt="roxy adventure" className="p-2" />
              <p className="px-2 mt-1 text-sm text-gray-800 ">{entry.desc}</p>
              <div className="flex justify-center my-2">
                <button className="p-2 text-gray-100 bg-blue-500 rounded hover:bg-blue-700 hover:text-white">
                  Support
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default App;
