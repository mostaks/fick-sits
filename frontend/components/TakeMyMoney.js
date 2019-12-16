import React from 'react';
import StripeCheckout from 'react-stripe-checkout';
import { useMutation } from 'react-apollo-hooks';
import Router from 'next/router';
import NProgress from 'nprogress';
import PropTypes from 'prop-types';
import gql from 'graphql-tag';
import calcTotalPrice from '../lib/calcTotalPrice';
import Error from './ErrorMessage';
import User, { CURRENT_USER_QUERY } from './User';

const CREATE_ORDER_MUTATION = gql`
  mutation createOrder($token: String!) {
    createOrder(token: $token) {
      id
      charge
      total
      items {
        id
        title
      }
    }
  }
`;

const TakeMyMoney = ({ children }) => {
  const [createOrder, { data, error, loading }] = useMutation(CREATE_ORDER_MUTATION, {
    refetchQueries: [{ query: CURRENT_USER_QUERY }]
  });
  const totalItems = (cart) => {
    return cart.reduce((tally, cartItem) => (tally + cartItem.quantity), 0)
  }

  const onToken = (res) => {
    console.log('res', res);
    // manually call the mutation once we have the stripe token
    createOrder({
      variables: {
        token: res.id
      }
    });
  }
  return (
    <div>
      <User>
        {({ me }) => (
          <StripeCheckout
            amount={calcTotalPrice(me.cart)}
            name="Fick-sits"
            description={`Order of ${totalItems(me.cart)} item${me.cart > 1 ? 's' : ''}!`}
            image={me.cart[0].item && me.cart[0].item.image}
            stripeKey="pk_test_cX0sVa0EtS0Zu9hqxDw47fx4"
            currency="AUD"
            email={me.email}
            token={res => onToken(res)}
          >
            { children }
          </StripeCheckout>
        )}
      </User>
    </div>
  );
}

export default TakeMyMoney;
