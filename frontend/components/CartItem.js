import React from 'react';
import PropTypes from 'prop-types';
import formatMoney from '../lib/formatMoney';
import RemoveFromCart from './RemoveFromCart';
import CartItemStyles from './styles/CartItemStyles';

const CartItem = ({ cartItem }) => {
  // first check if that item exists
  if (!cartItem.item) {
    return (
      <CartItemStyles>
        This item has been removed
        <RemoveFromCart id={cartItem.id} />
      </CartItemStyles>
    )
  }
  return (
    <CartItemStyles>
      <img width="100" src={cartItem.item.image} alt={cartItem.item.title} />
      <div className="cart-item-details">
        <h3>{cartItem.item.title}</h3>
        <p>
          {formatMoney(cartItem.item.price * cartItem.quantity)}
          {' - '}
          <em>
            {cartItem.quantity} &times; {formatMoney(cartItem.item.price)} each
          </em>
        </p>
      </div>
      <RemoveFromCart id={cartItem.id} />
    </CartItemStyles>
  );
}

CartItem.propTypes = {
  cartItem: PropTypes.object.isRequired
};

export default CartItem;
