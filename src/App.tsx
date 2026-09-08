import { useEffect } from 'react'
import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { Home } from './pages/Home'
import { StorePage } from './pages/Store'
import { Checkout } from './pages/Checkout'
import { OrderTracking } from './pages/OrderTracking'
import { Orders } from './pages/Orders'
import { CartDrawer } from './components/CartDrawer'
import { ItemModal } from './components/ItemModal'

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo({ top: 0 })
  }, [pathname])
  return null
}

export default function App() {
  return (
    <>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/store/:id" element={<StorePage />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/track/:id" element={<OrderTracking />} />
        <Route path="/orders" element={<Orders />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <CartDrawer />
      <ItemModal />
    </>
  )
}
