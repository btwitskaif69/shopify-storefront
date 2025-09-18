import React, { useState } from 'react';
import './TrackOrder.css';  
// --- Helper Components for UI ---
const SearchIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" 
    viewBox="0 0 24 24" fill="none" stroke="currentColor" 
    strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" 
    className="w-5 h-5 mr-2">
    <circle cx="11" cy="11" r="8"></circle>
    <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
  </svg>
);

const PackageIcon = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" 
    viewBox="0 0 24 24" fill="none" stroke="currentColor" 
    strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" 
    className={className}>
    <line x1="16.5" y1="9.4" x2="7.5" y2="4.21"></line>
    <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
    <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
    <line x1="12" y1="22.08" x2="12" y2="12"></line>
  </svg>
);

// --- MAIN COMPONENT ---
export default function TrackOrderPage() {
  const [orderNumber, setOrderNumber] = useState('');
  const [email, setEmail] = useState('');
  const [orderData, setOrderData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Shopify Config
  const storefrontApiAccessToken = '6862f3b769d30524d61e9891cc78f056';
  const shopifyApiUrl = 'https://delan1.myshopify.com/api/2025-07/graphql.json';

  const getOrderQuery = `
    query($orderNumber: String!, $customerEmail: String!) {
      orders(first: 1, query: "name:$orderNumber AND email:$customerEmail") {
        edges {
          node {
            id
            name
            processedAt
            totalPriceV2 { amount currencyCode }
            fulfillmentStatus
            shippingAddress {
              name address1 address2 city zip country
            }
            lineItems(first: 10) {
              edges {
                node {
                  title
                  quantity
                  variant {
                    image { url altText }
                    priceV2 { amount currencyCode }
                  }
                }
              }
            }
            fulfillments(first: 1) {
              edges {
                node {
                  trackingInfo(first: 1) { number url }
                }
              }
            }
          }
        }
      }
    }
  `;

  const handleTrackOrder = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setOrderData(null);

    const formattedOrderNumber = orderNumber.startsWith('#') ? orderNumber : `#${orderNumber}`;

    try {
      const response = await fetch(shopifyApiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Shopify-Storefront-Access-Token': storefrontApiAccessToken,
        },
        body: JSON.stringify({
          query: getOrderQuery,
          variables: { orderNumber: formattedOrderNumber, customerEmail: email },
        }),
      });

      const result = await response.json();

      if (result.errors) throw new Error(result.errors[0].message);

      const order = result.data?.orders?.edges[0]?.node;
      if (order) setOrderData(order);
      else setError("We couldn't find an order with that number and email.");
    } catch (err) {
      console.error("Error fetching order:", err);
      setError("Something went wrong while tracking your order. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString) =>
    new Date(dateString).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

  return (
    <div className="bg-gray-50 min-h-screen font-sans text-gray-800 p-4 sm:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold">Track Your Order</h1>
          <p className="mt-2 text-lg text-gray-600">Enter your order details below to see its status.</p>
        </div>

        {/* Form */}
        <div className="track-form-container">
        <form onSubmit={handleTrackOrder} className="track-form">
            {/* Order Number */}
            <div className="form-group">
            <label htmlFor="orderNumber">Order Number</label>
            <input
                type="text"
                id="orderNumber"
                value={orderNumber}
                onChange={(e) => setOrderNumber(e.target.value)}
                placeholder="#1001"
                required
            />
            </div>

            {/* Email */}
            <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
            />
            </div>

            {/* Button */}
            <div className="form-group">
            <button type="submit" disabled={isLoading} className="track-btn">
                {isLoading ? "Tracking..." : "Track"}
            </button>
            </div>
        </form>
        </div>



        {/* Errors */}
        {error && <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-lg">{error}</div>}

        {/* Order Data */}
        {orderData && (
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden animate-fade-in">
            <div className="p-6 bg-gray-50 border-b flex flex-col sm:flex-row justify-between">
              <div>
                <h2 className="text-2xl font-bold">Order {orderData.name}</h2>
                <p className="text-sm text-gray-500">Placed on {formatDate(orderData.processedAt)}</p>
              </div>
              <div className={`mt-4 sm:mt-0 px-3 py-1 text-sm font-medium rounded-full flex items-center ${
                orderData.fulfillmentStatus === 'FULFILLED' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
              }`}>
                <PackageIcon className="w-4 h-4 mr-2" />
                {orderData.fulfillmentStatus.replace('_', ' ')}
              </div>
            </div>
            <div className="p-6">
              {/* Tracking Info */}
              {orderData.fulfillments?.edges[0]?.node?.trackingInfo[0] && (
                <div className="mb-6 bg-indigo-50 p-4 rounded-lg">
                  <h3 className="font-bold text-indigo-800 mb-2">Tracking Information</h3>
                  <p>Number: {orderData.fulfillments.edges[0].node.trackingInfo[0].number}</p>
                  <a href={orderData.fulfillments.edges[0].node.trackingInfo[0].url} target="_blank" rel="noopener noreferrer"
                    className="inline-block mt-2 bg-indigo-600 text-white font-semibold py-2 px-4 rounded-lg text-sm hover:bg-indigo-700">
                    Track with Carrier
                  </a>
                </div>
              )}
              {/* Items */}
              <h3 className="text-lg font-bold mb-4">Items</h3>
              <ul className="divide-y divide-gray-200">
                {orderData.lineItems.edges.map(({ node: item }, idx) => (
                  <li key={idx} className="py-4 flex">
                    {item.variant.image?.url && (
                      <img src={item.variant.image.url} alt={item.variant.image.altText || item.title}
                        className="h-20 w-20 rounded-md object-cover mr-4"/>
                    )}
                    <div className="flex-1">
                      <p className="font-semibold">{item.title}</p>
                      <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                    </div>
                    <p className="font-semibold">
                      {new Intl.NumberFormat('en-US', { style: 'currency', currency: item.variant.priceV2.currencyCode })
                        .format(item.variant.priceV2.amount * item.quantity)}
                    </p>
                  </li>
                ))}
              </ul>
              {/* Shipping & Total */}
              <div className="mt-6 pt-6 border-t grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-bold mb-2">Shipping Address</h3>
                  <address className="not-italic text-gray-600">
                    {orderData.shippingAddress.name}<br />
                    {orderData.shippingAddress.address1}<br />
                    {orderData.shippingAddress.address2 && <>{orderData.shippingAddress.address2}<br /></>}
                    {orderData.shippingAddress.city}, {orderData.shippingAddress.zip}<br />
                    {orderData.shippingAddress.country}
                  </address>
                </div>
                <div className="text-left md:text-right">
                  <h3 className="text-lg font-bold mb-2">Order Total</h3>
                  <p className="text-2xl font-bold">
                    {new Intl.NumberFormat('en-US', { style: 'currency', currency: orderData.totalPriceV2.currencyCode })
                      .format(orderData.totalPriceV2.amount)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      <style>{`
        @keyframes fadeIn { from { opacity:0; transform:translateY(10px);} to { opacity:1; transform:translateY(0);} }
        .animate-fade-in { animation: fadeIn 0.5s ease-out forwards; }
      `}</style>
    </div>
  );
}
