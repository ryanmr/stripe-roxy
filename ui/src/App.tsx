import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { loadStripe } from '@stripe/stripe-js';
import { Success } from './Success';

const stripePublishableKey =
  'pk_test_51If5PQDzSiFRfg6pasdtySm8uWxtJJeXlBmcja1QSdn7RhoXHB5oFedKCdGA5V6Mo2ZPchMnpCN6vCuGBbQq6hTa00tdhYSfA3';

function App() {
  return (
    <div>
      <Router>
        <nav className="flex items-center justify-center p-4 border-b border-gray-200 min-h-20">
          <a
            href="/"
            className="p-2 text-3xl font-extrabold text-white transform bg-orange-500 border-b-2 border-orange-600 shadow hover:bg-orange-600 hover:border-orange-700 -rotate-2"
          >
            Sponsor Roxy
          </a>
        </nav>

        <Switch>
          <Route path="/" exact>
            <Home />
          </Route>

          <Route path="/checkout/success">
            <Success />
          </Route>

          <Route path="/checkout/cancel">Cancel</Route>

          <Route path="/support/:type"></Route>
        </Switch>
      </Router>
    </div>
  );
}

const data = [
  {
    name: 'Treats',
    type: 'treat',
    desc:
      'Share special treats, anything from homemade whipped cream to tasty bones!',
    image: '/images/roxy_treat.jpg',

    // this could be a meta value instead
    // if you wanted to hide this productId
    productId: 'prod_JHez7JndbhNwp7',
    // these will get looked up by value cent value on the api
    // which correspond to the prices preset in the stripe dashboard
    // this makes it so someone can't cheat on the pricing
    // if they changed it to 001 it would not work
    tiers: [
      { value: 100, name: '$1' },
      { value: 200, name: '$2' },
      { value: 500, name: '$5' },
      { value: 1000, name: '$10' },
    ],
  },
  {
    name: 'Adventure',
    type: 'adventure',
    desc:
      'Travel together with Roxy on adventures to far away castles and mysterious forests',
    image: '/images/roxy_adventure.jpg',
  },
  {
    name: 'Toys',
    type: 'toy',
    desc:
      "Soft squishy toys with secret squeakers inside? Roxy's favorite toy!",
    image: '/images/roxy_toy2.jpg',
  },
];

const stripePromise = loadStripe(stripePublishableKey);

function Home() {
  async function handleClick(
    event: any,
    product: Record<string, any>,
    tier: Record<string, any>,
  ) {
    event.preventDefault();

    const currentUrl = new URL(window.location.href);

    const stripe = await stripePromise;

    const payload = {
      itemType: product.type,
      itemValue: tier.value,
    };

    // Call your backend to create the Checkout Session
    const response = await fetch(
      'http://localhost:3000/create-checkout-session',
      {
        body: JSON.stringify(payload),
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      },
    );

    const session = await response.json();

    // When the customer clicks on the button, redirect them to Checkout.
    const result = await stripe?.redirectToCheckout({
      sessionId: session.id,
    });

    if (result?.error) {
      // If `redirectToCheckout` fails due to a browser or network
      // error, display the localized error message to your customer
      // using `result.error.message`.
      alert('it failed, sorry');
    }
  }

  return (
    <div>
      <div className="flex items-center justify-center p-4 text-center text-white bg-black">
        <div>
          <h1 className="text-3xl">Sponsor Roxy</h1>
          <p className="text-lg">Roxy is the best dog in the world</p>
          <p className="text-lg">Sponsor her treats, adventures and toys</p>
        </div>
      </div>

      <div className="container flex flex-wrap justify-center p-4 mx-auto space-y-4 divide-x-0 sm:divide-x-2 sm:space-y-0">
        {data.map((product, i) => {
          return (
            <div key={i} className="w-full p-2 sm:w-1/3 ">
              <div className="ml-1 text-lg text-center">{product.name}</div>
              <img src={product.image} alt="roxy adventure" className="p-2" />
              <p className="px-2 mt-1 text-sm text-gray-800 ">{product.desc}</p>
              <div className="flex items-center justify-center my-2">
                {product.tiers ? (
                  <div>
                    <p className="my-2 text-sm font-bold text-center text-gray-400 uppercase">
                      Support with
                    </p>
                    <div className="flex flex-wrap space-x-1">
                      {product.tiers?.map((tier) => (
                        <button
                          key={tier.name}
                          type="button"
                          className="block p-2 text-gray-100 bg-blue-500 rounded hover:bg-blue-700 hover:text-white"
                          onClick={(event) => handleClick(event, product, tier)}
                        >
                          {tier.name}
                        </button>
                      ))}
                    </div>
                  </div>
                ) : null}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default App;
