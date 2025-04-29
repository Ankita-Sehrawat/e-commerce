import { useCart } from '@/app/context/CartContext';
import React from 'react';

export default async function ProductDetail({ params }) {
    const { id } = await params;
    const product = await fetch(`https://fakestoreapi.com/products/${id}`).then(res => res.json());

    // const { addToCart } = useCart()

    return (
        <div className="text-white p-6 max-w-4xl mx-auto max-h-[calc(100vh-62px)] ">
            <h1 className="text-3xl font-bold mb-6">{product.title}</h1>
            <div className="flex flex-col items-center md:flex-row gap-6">
                <div className="md:w-1/2">
                    <img
                        src={product.image}
                        alt="img"
                        className="w-full h-auto object-contain"
                    />
                </div>
                <div className="md:w-1/2 ">
                    <p className="mb-4 text-lg">{product.description}</p>
                    <p className="text-2xl font-bold">${product.price}</p>
                    <button
                        // onClick={() => addToCart(product)}
                        className="mt-5 hover:bg-blue-600 text-white px-4 py-2 rounded bg-cyan-700 transition cursor-pointer">Add to Cart</button>
                </div>
            </div>
        </div>
    );
}
