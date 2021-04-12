import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router';
import { parse } from 'qs';

export function Success() {
  const location = useLocation();

  const [customer, setCustomer] = useState<any>(null);

  async function handleCustomerReview(sessionId: string) {
    const response = await fetch('http://localhost:3000/order/review', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ sessionId }),
    });

    const data = await response.json();

    setCustomer(data.customer);
  }

  useEffect(() => {
    const query = location.search;
    if (!query) {
      return;
    }
    const qsub = query.substring(1);
    const qs = parse(qsub);

    const sessionId = qs?.session_id;

    if (!sessionId) {
      return;
    }

    handleCustomerReview(sessionId as string);
  }, []);

  return (
    <div className="container p-4 mx-auto my-8">
      <h1 className="text-4xl font-bold text-center">Thank you!</h1>
      <div className="flex items-center justify-center">
        <img
          src="/images/roxy_thanks.jpg"
          className="w-1/3 m-4 border-4 border-black"
        />
      </div>
      {customer?.name && (
        <p className="text-center">
          Hey <b>{customer.name}</b>, Roxy appreciates your support!
        </p>
      )}
      {customer?.email && !customer?.name && (
        <p className="text-center">
          Hey <b>{customer.email}</b>, Roxy appreciates your support!
        </p>
      )}
      {!customer?.name && (
        <p className="text-center">Roxy appreciates your support!</p>
      )}
      <div className="flex items-center justify-center my-2">
        <a
          href="/"
          className="block p-2 text-gray-100 bg-blue-500 rounded hover:bg-blue-700 hover:text-white"
        >
          ← Go back home
        </a>
      </div>
    </div>
  );
}
