import React, { useState, useEffect } from 'react';
import { useQuery, gql } from '@apollo/client';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; // Assuming you have an AuthContext
import './AccountPage.css';

const GET_CUSTOMER_ORDERS = gql`
  query getCustomerOrders($customerAccessToken: String!) {
    customer(customerAccessToken: $customerAccessToken) {
      firstName
      lastName
      orders(first: 20, sortKey: PROCESSED_AT, reverse: true) {
        edges {
          node {
            id
            orderNumber
            processedAt
            fulfillmentStatus
            totalPriceV2 {
              amount
              currencyCode
            }
            statusUrl
            lineItems(first: 10) {
              edges {
                node {
                  quantity
                  title
                  variant {
                    image {
                      url
                      altText
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
`;

const AccountPage = () => {
  const { customerAccessToken, isLoggedIn, authChecked } = useAuth();
  const navigate = useNavigate();
  const [expandedOrderId, setExpandedOrderId] = useState(null);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (authChecked && !isLoggedIn) {
      navigate('/account/login');
    }
  }, [isLoggedIn, authChecked, navigate]);

  const { loading, error, data } = useQuery(GET_CUSTOMER_ORDERS, {
    variables: { customerAccessToken },
    skip: !customerAccessToken, // Don't run the query if there's no token
  });

  if (loading || !authChecked) {
    return <p className="account-message">Loading your account...</p>;
  }
  if (error) {
    return <p className="account-message">Error loading your account details.</p>;
  }

  const customer = data?.customer;
  const orders = customer?.orders.edges || [];

  const toggleOrderDetails = (orderId) => {
    setExpandedOrderId(expandedOrderId === orderId ? null : orderId);
  };

  return (
    <div className="account-page">
      <h1>Welcome, {customer?.firstName}</h1>
      <p>Here you can view your order history and details.</p>
      
      <div className="order-history-section">
        <h2>Order History</h2>
        {orders.length > 0 ? (
          orders.map(({ node: order }) => (
            <div key={order.id} className="order-card">
              <div className="order-summary">
                <div>
                  <strong>Order:</strong> #{order.orderNumber}
                </div>
                <div>
                  <strong>Date:</strong> {new Date(order.processedAt).toLocaleDateString()}
                </div>
                <div>
                  <strong>Total:</strong> {order.totalPriceV2.amount} {order.totalPriceV2.currencyCode}
                </div>
                <div>
                  <strong>Status:</strong> <span className={`status-${order.fulfillmentStatus.toLowerCase()}`}>{order.fulfillmentStatus}</span>
                </div>
                <button 
                  className="order-details-toggle"
                  onClick={() => toggleOrderDetails(order.id)}
                >
                  {expandedOrderId === order.id ? 'Hide Details' : 'View Details'}
                </button>
              </div>

              {expandedOrderId === order.id && (
                <div className="order-details">
                  <h4>Items in this order:</h4>
                  <ul className="order-line-items">
                    {order.lineItems.edges.map(({ node: item }, index) => (
                      <li key={index} className="line-item">
                        <img 
                          src={item.variant?.image?.url} 
                          alt={item.variant?.image?.altText || item.title} 
                          className="line-item-image"
                        />
                        <div className="line-item-info">
                          <p className="line-item-title">{item.title}</p>
                          <p>Quantity: {item.quantity}</p>
                        </div>
                      </li>
                    ))}
                  </ul>
                  <a href={order.statusUrl} target="_blank" rel="noopener noreferrer" className="track-order-link">
                    Track Order
                  </a>
                </div>
              )}
            </div>
          ))
        ) : (
          <p>You have not placed any orders yet.</p>
        )}
      </div>
    </div>
  );
};


export default AccountPage;