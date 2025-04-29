"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function ProductList() {
  const [products, setProducts] = useState([]);
  const router = useRouter();

  useEffect(() => {
    async function fetchProducts() {
      const res = await fetch('https://fakestoreapi.com/products');
      const data = await res.json();
      setProducts(data);
    }
    fetchProducts();
  }, []);

  return (
    <div className="text-white">
      <h1 className="text-3xl font-bold my-4">Products</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 ">
        {products.map(product => (
          <div
            key={product.id}
            onClick={() => router.push(`/products/${product.id}`)}
            className="border border-gray-600 p-4 rounded shadow-white hover:shadow-[1px_1px_8px_rgba(255,255,255,.2)] group cursor-pointer"
          >
            <div className="overflow-hidden">
              <img
                src={product.image}
                alt="img"
                className="w-full h-80 object-cover object-top group-hover:scale-[1.2] transition"
              />
            </div>
            <div className="flex flex-col justify-between min-h-[calc(550px-320px)]">
              <h2 className="text-lg font-semibold mt-4 leading-[25px]">{product.title}</h2>
              <p className="text-sm font-normal mt-3 line-clamp-3">{product.description}</p>
              <p className="text-xl font-bold mt-3">${product.price}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
