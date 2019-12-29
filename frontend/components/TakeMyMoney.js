import React from 'react';
import StripeCheckout from 'react-stripe-checkout';
import { useMutation } from 'react-apollo-hooks';
import Router from 'next/router';
import NProgress from 'nprogress';
import calcTotalPrice from '../lib/calcTotalPrice';
import User from './User';
import { CURRENT_USER_QUERY } from './queries';
import { CREATE_ORDER_MUTATION } from './mutations';

const TakeMyMoney = ({ children }) => {
  const [createOrder] = useMutation(CREATE_ORDER_MUTATION, {
    refetchQueries: [{ query: CURRENT_USER_QUERY }]
  });
  const totalItems = (cart) => {
    return cart.reduce((tally, cartItem) => (tally + cartItem.quantity), 0)
  }

  const onToken = async (res) => {
    NProgress.start();
    // manually call the mutation once we have the stripe token
    const order = await createOrder({
      variables: {
        token: res.id
      }
    }).catch(err => {
      console.log(err.message)
    });
    Router.push({
      pathname: '/order',
      query: { id: order.data.createOrder.id }
    })
  }
  return (
    <div>
      <User>
        {({ me }) => (
          <StripeCheckout
            amount={calcTotalPrice(me.cart)}
            name="Fick-sits"
            description={`Order of ${totalItems(me.cart)} item${me.cart > 1 ? 's' : ''}!`}
            image={me.cart.length && me.cart[0].item && me.cart[0].item.image}
            stripeKey="pk_test_cX0sVa0EtS0Zu9hqxDw47fx4"
            currency="AUD"
            email={me.email}
            token={res => onToken(res)}
          >
            {children}
          </StripeCheckout>
        )}
      </User>
    </div>
  );
}

export default TakeMyMoney;
