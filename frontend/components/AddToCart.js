import React from 'react';
import { useMutation } from 'react-apollo-hooks';
import { CURRENT_USER_QUERY } from './queries';
import { ADD_TO_CART_MUTATION } from './mutations';

const AddToCart = ({ id }) => {
  const [addToCart, { loading }] = useMutation(ADD_TO_CART_MUTATION, {
    variables: {
      id
    },
    refetchQueries: [{ query: CURRENT_USER_QUERY }]
  });
  return (
    <button disabled={loading} onClick={addToCart}>
      Add{loading && 'ing'} to cart 🛒
    </button>
  )
}

export default AddToCart;