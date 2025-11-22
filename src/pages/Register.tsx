import React, { useState } from 'react';
import { CheckCircle, Download, CreditCard } from 'lucide-react';

const Register: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    destination: 'Taj Mahal, Agra',
    date: '',
    guests: 1,
    paymentMethod: 'card'
  });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate API call
    setTimeout(() => {
      setSubmitted(true);
      window.scrollTo(0, 0);
    }, 1000);
  };

  if (submitted) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center px-4">
        <div className="bg-white p-8 rounded-2xl shadow-xl border border-stone-100 max-w-md w-full text-center">
          <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle size={32} />
          </div>
          <h2 className="text-2xl font-serif font-bold text-stone-800 mb-2">Booking Confirmed!</h2>
          <p className="text-stone-600 mb-6">Thank you, {formData.name}. Your trip to {formData.destination} is set.</p>
          
          <div className="bg-stone-50 p-4 rounded-lg text-left text-sm text-stone-600 mb-6 space-y-2 border border-stone-200">
            <div className="flex justify-between"><span>Date:</span> <span className="font-semibold">{formData.date}</span></div>
            <div className="flex justify-between"><span>Guests:</span> <span className="font-semibold">{formData.guests}</span></div>
            <div className="flex justify-between"><span>Booking ID:</span> <span className="font-mono font-semibold text-orange-600">#DS-{Math.floor(Math.random()*10000)}</span></div>
          </div>

          <button className="w-full bg-teal-700 text-white py-3 rounded-xl font-semibold hover:bg-teal-800 transition flex items-center justify-center gap-2">
            <Download size={18} /> Download Trip Slip
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-serif font-bold text-stone-800 mb-4">Book Your Journey</h1>
        <p className="text-stone-600">Fill in your details to start your adventure.</p>
      </div>

      <div className="bg-white p-8 rounded-2xl shadow-lg border border-stone-100">
        <form onSubmit={handleSubmit} className="space-y-6">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-stone-700">Full Name</label>
              <input required name="name" type="text" onChange={handleChange} className="w-full px-4 py-2 rounded-lg border border-stone-300 focus:ring-2 focus:ring-orange-500 outline-none" placeholder="John Doe" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-stone-700">Email Address</label>
              <input required name="email" type="email" onChange={handleChange} className="w-full px-4 py-2 rounded-lg border border-stone-300 focus:ring-2 focus:ring-orange-500 outline-none" placeholder="john@example.com" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-stone-700">Phone Number</label>
              <input required name="phone" type="tel" onChange={handleChange} className="w-full px-4 py-2 rounded-lg border border-stone-300 focus:ring-2 focus:ring-orange-500 outline-none" placeholder="+91 98765 43210" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-stone-700">Trip Date</label>
              <input required name="date" type="date" onChange={handleChange} className="w-full px-4 py-2 rounded-lg border border-stone-300 focus:ring-2 focus:ring-orange-500 outline-none" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-stone-700">Destination</label>
              <select name="destination" onChange={handleChange} className="w-full px-4 py-2 rounded-lg border border-stone-300 focus:ring-2 focus:ring-orange-500 outline-none">
                <option>Taj Mahal, Agra</option>
                <option>Varanasi Ghats</option>
                <option>Kerala Backwaters</option>
                <option>Jaipur Palaces</option>
                <option>Goa Beaches</option>
                <option>Ladakh Mountains</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-stone-700">Number of Guests</label>
              <input required name="guests" type="number" min="1" defaultValue="1" onChange={handleChange} className="w-full px-4 py-2 rounded-lg border border-stone-300 focus:ring-2 focus:ring-orange-500 outline-none" />
            </div>
          </div>

          <div className="space-y-4 pt-4 border-t border-stone-100">
            <label className="text-sm font-medium text-stone-700 block">Payment Method</label>
            <div className="grid grid-cols-3 gap-4">
              {['card', 'upi', 'netbanking'].map((method) => (
                <label key={method} className={`border rounded-lg p-4 flex items-center justify-center cursor-pointer transition ${formData.paymentMethod === method ? 'border-orange-500 bg-orange-50 text-orange-700' : 'border-stone-200 hover:border-stone-300'}`}>
                  <input type="radio" name="paymentMethod" value={method} checked={formData.paymentMethod === method} onChange={handleChange} className="hidden" />
                  <span className="capitalize font-medium flex items-center gap-2">
                    <CreditCard size={16} /> {method}
                  </span>
                </label>
              ))}
            </div>
          </div>

          <button type="submit" className="w-full bg-orange-600 text-white py-4 rounded-xl font-bold text-lg hover:bg-orange-700 transition shadow-lg mt-6">
            Confirm Booking
          </button>

        </form>
      </div>
    </div>
  );
};

export default Register;