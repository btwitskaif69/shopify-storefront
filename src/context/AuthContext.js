import React, { createContext, useContext, useState, useEffect } from 'react';
import { useMutation, useLazyQuery, gql } from '@apollo/client';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

// --- All the GraphQL operations for customer accounts ---
const CUSTOMER_CREATE = gql`
  mutation customerCreate($input: CustomerCreateInput!) {
    customerCreate(input: $input) {
      customer { id firstName lastName email phone }
      customerUserErrors { code field message }
    }
  }
`;

const LOGIN = gql`
  mutation customerAccessTokenCreate($input: CustomerAccessTokenCreateInput!) {
    customerAccessTokenCreate(input: $input) {
      customerAccessToken { accessToken expiresAt }
      customerUserErrors { code field message }
    }
  }
`;

const GET_CUSTOMER = gql`
  query getCustomer($customerAccessToken: String!) {
    customer(customerAccessToken: $customerAccessToken) {
      id
      firstName
      lastName
      email
      phone
    }
  }
`;

const LOGOUT = gql`
    mutation customerAccessTokenDelete($customerAccessToken: String!) {
        customerAccessTokenDelete(customerAccessToken: $customerAccessToken) {
            deletedAccessToken
            deletedCustomerAccessTokenId
            userErrors {
                field
                message
            }
        }
    }
`;

export const AuthProvider = ({ children }) => {
  const [customer, setCustomer] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('customer_access_token'));
  const [authChecked, setAuthChecked] = useState(false); // ✅ 1. Add the authChecked state

  // ✅ 2. Add callbacks to set authChecked=true after the query finishes
  const [getCustomer, { data: customerData }] = useLazyQuery(GET_CUSTOMER, {
    onCompleted: () => setAuthChecked(true),
    onError: () => setAuthChecked(true)
  });

  const [loginMutation] = useMutation(LOGIN);
  const [signupMutation] = useMutation(CUSTOMER_CREATE);
  const [logoutMutation] = useMutation(LOGOUT);
  
  useEffect(() => {
    if (token) {
      getCustomer({ variables: { customerAccessToken: token } });
    } else {
      // ✅ 3. If there's no token, the check is done immediately
      setAuthChecked(true);
    }
  }, [token, getCustomer]);

  useEffect(() => {
    if (customerData?.customer) {
      setCustomer(customerData.customer);
    } else if (customerData) {
      // If the query ran but found no customer (invalid token), log them out
      localStorage.removeItem('customer_access_token');
      setCustomer(null);
      setToken(null);
    }
  }, [customerData]);

  const signup = async (firstName, lastName, email, phone, password) => {
    const { data } = await signupMutation({
      variables: { input: { firstName, lastName, email, phone, password } }
    });
    
    if (data.customerCreate.customerUserErrors.length > 0) {
      throw new Error(data.customerCreate.customerUserErrors[0].message);
    }
    return login(email, password);
  };

  const login = async (email, password) => {
    const { data } = await loginMutation({
      variables: { input: { email, password } }
    });

    if (data.customerAccessTokenCreate.customerUserErrors.length > 0) {
      throw new Error(data.customerAccessTokenCreate.customerUserErrors[0].message);
    }

    const newAccessToken = data.customerAccessTokenCreate.customerAccessToken.accessToken;
    localStorage.setItem('customer_access_token', newAccessToken);
    setToken(newAccessToken);
  };

  const logout = async () => {
    if(token){
      await logoutMutation({ variables: { customerAccessToken: token } });
    }
    localStorage.removeItem('customer_access_token');
    setCustomer(null);
    setToken(null);
    window.location.href = '/account/login';
  };

  // ✅ 4. Add isLoggedIn and authChecked to the context value
  const value = { 
    customer, 
    customerAccessToken: token,
    isLoggedIn: !!customer,
    authChecked,
    signup, 
    login, 
    logout 
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};