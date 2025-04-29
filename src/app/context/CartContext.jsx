// context/CartContext.jsx
'use client' // This directive is crucial

import { createContext, useContext, useEffect, useState } from 'react'

export const CartContext = createContext(null)

export function CartProvider({ children }) {
  const [cart, setCart] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  // Load from localStorage on client-side only
  useEffect(() => {
    const savedCart = localStorage.getItem('cart')
    if (savedCart) {
      try {
        setCart(JSON.parse(savedCart))
      } catch (err) {
        console.error('Error parsing cart data:', err)
        localStorage.removeItem('cart')
      }
    }
  }, [])

  // Save to localStorage when cart changes
  useEffect(() => {
    if (cart.length > 0) {
      localStorage.setItem('cart', JSON.stringify(cart))
    }
  }, [cart])

  const syncCartWithAPI = async (cartItems) => {
    try {
      setLoading(true)
      const response = await fetch('https://fakestoreapi.com/carts', {
        method: "POST",
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          userId: 1, // Replace with actual user ID from auth
          date: new Date().toISOString(),
          products: cartItems.map(item => ({
            productId: item.id,
            quantity: item.quantity
          }))
        })
      })
      return await response.json()
    } catch (err) {
      console.error('Error syncing cart:', err)
      setError(err.message)
      throw err
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
    return syncCartWithAPI(newCart)
  }

  const removeFromCart = async (productId) => {
    const newCart = cart.filter(item => item.id !== productId)
    setCart(newCart)
    return syncCartWithAPI(newCart)
  }

  const updateQuantity = async (productId, quantity) => {
    if (quantity <= 0) {
      return removeFromCart(productId)
    }

    const newCart = cart.map(item =>
      item.id === productId
        ? { ...item, quantity }
        : item
    )

    setCart(newCart)
    return syncCartWithAPI(newCart)
  }

  const getCartFromAPI = async (userId) => {
    try {
      setLoading(true)
      const response = await fetch(`https://fakestoreapi.com/carts/user/${userId}`)
      const data = await response.json()

      if (data && data.length > 0) {
        const latestCart = data.reduce((prev, current) =>
          new Date(prev.date) > new Date(current.date) ? prev : current
        )

        const formattedCart = latestCart.products.map(item => ({
          ...item,
          id: item.productId
        }))

        setCart(formattedCart)
        return formattedCart
      }
      return []
    } catch (err) {
      console.error('Error fetching cart:', err)
      setError(err.message)
      throw err
    } finally {
      setLoading(false)
    }
  }

  const clearCart = () => {
    setCart([])
    localStorage.removeItem('cart')
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
        getCartFromAPI,
        clearCart
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
}