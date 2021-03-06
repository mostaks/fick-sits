import React from 'react';
import { useQuery, useMutation } from 'react-apollo-hooks';
import calcTotalPrice from '../lib/calcTotalPrice';
import formatMoney from '../lib/formatMoney';
import User from './User';
import CartStyles from './styles/CartStyles';
import Supreme from './styles/Supreme';
import CloseButton from './styles/CloseButton';
import SickButton from './styles/SickButton';
import CartItem from './CartItem';
import TakeMyMoney from './TakeMyMoney';
import { TOGGLE_CART_MUTATION } from './mutations';
import { LOCAL_STATE_QUERY } from './queries';

const Cart = () => {
  const { data } = useQuery(LOCAL_STATE_QUERY);
  const [toggleCart] = useMutation(TOGGLE_CART_MUTATION);
  return (
    <User>{({ me }) => {
      if (!me) {
        return null;
      }
      return (
        <CartStyles open={data.cartOpen}>
          <header>
            <CloseButton onClick={toggleCart} title="close">&times;</CloseButton>
            <Supreme>{me.name}'s Cart</Supreme>
            <p>You have {me.cart.length} item{me.cart.length > 1 && 's'} in your cart</p>
          </header>
          <ul>
            {me.cart.map(item => <CartItem key={item.id} cartItem={item} />)}
          </ul>
          <footer>
            <p>{formatMoney(calcTotalPrice(me.cart))}</p>
            {me.cart.length && (
              <TakeMyMoney>
                <SickButton>Checkout</SickButton>
              </TakeMyMoney>
            )}
          </footer>
        </CartStyles>
      );
    }}</User>
  );
};

export default Cart;

export { LOCAL_STATE_QUERY, TOGGLE_CART_MUTATION };

