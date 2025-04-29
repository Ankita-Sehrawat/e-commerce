// context/CartContext.jsx
'use client'

import { createContext, useContext, useEffect, useState } from 'react'

export const CartContext = createContext()

export function CartProvider({ children }) {
  const [cart, setCart] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  // Load from localStorage and sync with API
  useEffect(() => {
    const savedCart = localStorage.getItem('cart')
    if (savedCart) {
      setCart(JSON.parse(savedCart))
      
      // Optional: Sync with FakeStore API
      syncCartWithAPI(JSON.parse(savedCart))
    }
  }, [])

  // Save to localStorage when cart changes
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart))
  }, [cart])

  const syncCartWithAPI = async (cartItems) => {
    try {
      setLoading(true)
      // Using FakeStore API's cart endpoint
      const response = await fetch('https://fakestoreapi.com/carts', {
        method: "POST",
        body: JSON.stringify({
          userId: 1, // You can replace with actual user ID from auth
          date: new Date().toISOString(),
          products: cartItems.map(item => ({
            productId: item.id,
            quantity: item.quantity
          }))
        })
      })
      const data = await response.json()
      console.log('Cart synced with API:', data)
    } catch (err) {
      console.error('Error syncing cart:', err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const addToCart = async (product) => {
    const newCart = [...cart]
    const existingItem = newCart.find(item => item.id === product.id)

    if (existingItem) {
      existingItem.quantity += 1
    } else {
      newCart.push({
        ...product,
        quantity: 1
      })
    }

    setCart(newCart)
    await syncCartWithAPI(newCart)
  }

  const removeFromCart = async (productId) => {
    const newCart = cart.filter(item => item.id !== productId)
    setCart(newCart)
    await syncCartWithAPI(newCart)
  }

  const updateQuantity = async (productId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(productId)
      return
    }

    const newCart = cart.map(item => 
      item.id === productId 
        ? { ...item, quantity } 
        : item
    )
    
    setCart(newCart)
    await syncCartWithAPI(newCart)
  }

  const getCartFromAPI = async (userId) => {
    try {
      setLoading(true)
      const response = await fetch(`https://fakestoreapi.com/carts/user/${userId}`)
      const data = await response.json()
      
      if (data && data.length > 0) {
        // Get the most recent cart
        const latestCart = data.reduce((prev, current) => 
          new Date(prev.date) > new Date(current.date) ? prev : current
        )
        
        setCart(latestCart.products.map(item => ({
          ...item,
          id: item.productId // Map productId to id for consistency
        })))
      }
    } catch (err) {
      console.error('Error fetching cart:', err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <CartContext.Provider 
      value={{ 
        cart, 
        loading, 
        error,
        addToCart, 
        removeFromCart, 
        updateQuantity,
        getCartFromAPI
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (!context) throw new Error('useCart must be used within CartProvider')
  return context
}