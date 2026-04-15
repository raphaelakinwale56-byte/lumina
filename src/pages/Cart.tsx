import React from 'react';
import { motion } from 'motion/react';
import { ShoppingBag, Trash2, ArrowRight, CreditCard, ShieldCheck } from 'lucide-react';
import { useCart } from '../lib/useCart';
import { useOrders } from '../lib/useCart';
import { useAuth } from '../lib/AuthContext';
import { Link, useNavigate } from 'react-router-dom';

export default function Cart() {
  const { cart, removeFromCart, total, clearCart } = useCart();
  const { placeOrder } = useOrders();
  const { user, signIn } = useAuth();
  const navigate = useNavigate();
  const [isCheckingOut, setIsCheckingOut] = React.useState(false);

  const handleCheckout = async () => {
    if (!user) {
      signIn();
      return;
    }
    
    setIsCheckingOut(true);
    try {
      await placeOrder(cart.map(item => item.id), total);
      clearCart();
      navigate('/library');
    } catch (error) {
      console.error('Checkout failed:', error);
    } finally {
      setIsCheckingOut(false);
    }
  };

  if (cart.length === 0) {
    return (
      <div className="min-h-screen pt-20 flex flex-col items-center justify-center px-4 text-center">
        <div className="w-24 h-24 bg-brand-200 rounded-full flex items-center justify-center mb-8">
          <ShoppingBag className="w-12 h-12 text-brand-500" />
        </div>
        <h1 className="text-4xl font-serif font-bold text-brand-900 mb-4">Your cart is empty</h1>
        <p className="text-brand-500 mb-8 max-w-md">Looks like you haven't discovered any stories to take home yet.</p>
        <Link to="/" className="px-8 py-4 bg-brand-800 text-white rounded-full font-bold hover:bg-sky-600 transition-all shadow-xl">
          Start Exploring
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-32 pb-20 px-4 max-w-7xl mx-auto">
      <h1 className="text-5xl font-serif font-bold text-brand-900 mb-12">Your Selection</h1>
      
      <div className="grid lg:grid-cols-3 gap-12">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-6">
          {cart.map((item) => (
            <motion.div
              layout
              key={item.id}
              className="flex items-center space-x-6 p-6 glass-card rounded-3xl border border-brand-200"
            >
              <img 
                src={item.coverImage} 
                alt={item.title} 
                className="w-24 h-36 object-cover rounded-xl shadow-md"
                referrerPolicy="no-referrer"
              />
              <div className="flex-1">
                <h3 className="text-xl font-serif font-bold text-brand-900">{item.title}</h3>
                <p className="text-sm text-brand-500 font-medium mb-4">{item.author}</p>
                <div className="flex items-center justify-between">
                  <span className="text-lg font-bold text-brand-800">${item.price}</span>
                  <button 
                    onClick={() => removeFromCart(item.id)}
                    className="p-2 text-brand-300 hover:text-red-500 transition-colors"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Summary */}
        <div className="lg:col-span-1">
          <div className="glass-card rounded-[2.5rem] p-8 border border-brand-200 sticky top-32">
            <h2 className="text-2xl font-serif font-bold text-brand-900 mb-8">Order Summary</h2>
            <div className="space-y-4 mb-8">
              <div className="flex justify-between text-brand-500">
                <span>Subtotal</span>
                <span>${total.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-brand-500">
                <span>Shipping</span>
                <span className="text-green-600 font-medium">Free</span>
              </div>
              <div className="h-px bg-brand-200 my-4" />
              <div className="flex justify-between text-xl font-bold text-brand-900">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>

            <button
              onClick={handleCheckout}
              disabled={isCheckingOut}
              className="w-full py-5 bg-brand-800 text-white rounded-2xl font-bold text-lg hover:bg-emerald-600 transition-all shadow-xl active:scale-95 disabled:opacity-50 flex items-center justify-center space-x-3"
            >
              {isCheckingOut ? (
                <span>Processing...</span>
              ) : (
                <>
                  <span>Complete Purchase</span>
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>

            <div className="mt-8 space-y-4">
              <div className="flex items-center space-x-3 text-xs text-brand-400 font-medium uppercase tracking-wider">
                <ShieldCheck className="w-4 h-4" />
                <span>Secure Global Checkout</span>
              </div>
              <div className="flex items-center space-x-3 text-xs text-brand-400 font-medium uppercase tracking-wider">
                <CreditCard className="w-4 h-4" />
                <span>All Major Payments Supported</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
