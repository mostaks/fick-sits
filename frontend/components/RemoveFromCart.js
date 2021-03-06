import React from 'react';
import { useMutation } from 'react-apollo-hooks';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { CURRENT_USER_QUERY } from './queries';
import { REMOVE_FROM_CART_MUTATION } from './mutations';

const BigButton = styled.button`
  font-size: 3rem;
  background: none;
  border: 0;
  &:hover {
    color: ${({ theme }) => theme.red};
    cursor: pointer;
  }
`;

const RemoveFromCart = ({ id }) => {
  const [removeFromCart, { loading }] = useMutation(REMOVE_FROM_CART_MUTATION, {
    variables: {
      id
    },
    // this gets called as soon as we get a response back
    // from the server after a mutation has been performed
    update(cache, { data: { removeFromCart } }) {
      // first read the cache
      const data = cache.readQuery({
        query: CURRENT_USER_QUERY
      });
      // remove that item from the cart
      const { id } = removeFromCart;
      data.me.cart = data.me.cart.filter(cartItem => cartItem.id !== id);
      // write it back to the cache
      cache.writeQuery({ query: CURRENT_USER_QUERY, data });
    },
    optimisticResponse: {
      __typename: 'Mutation',
      removeFromCart: {
        __typename: 'CartItem',
        id
      }
    }
  });

  return (
    <BigButton
      title="Delete Item"
      disabled={loading}
      onClick={() => {
        removeFromCart().catch(err => alert(err.message));
      }}
    >
      &times;
    </BigButton>
  );
}

RemoveFromCart.propTypes = {
  id: PropTypes.string.isRequired
};

export default RemoveFromCart;
