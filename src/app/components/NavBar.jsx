import React from 'react'

const NavBar = () => {
  return (
    <div>
      <nav className="bg-cyan-700 border-y border-y-white p-4">
        <div className="container mx-auto ">
        
          <ul className="flex gap-4 justify-end max-sm:justify-between ">
            <li><a href="/dashboard" className="text-white strokeHover ">Home</a></li>
            <li><a href="/products" className="text-white strokeHover ">Products</a></li>
            <li><a href="/cart" className="text-white strokeHover ">Cart</a></li>
            <li><a href="/account" className="text-white strokeHover ">Account</a></li>
          </ul>
        </div>
      </nav>
    </div>
  )
}

export default NavBar
