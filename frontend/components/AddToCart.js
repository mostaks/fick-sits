import React from 'react';
import { useMutation } from 'react-apollo-hooks';
import gql from 'graphql-tag';
import { CURRENT_USER_QUERY } from './User';

const ADD_TO_CART_MUTATION = gql`
  mutation addToCart($id: ID!) {
    addToCart(id: $id) {
      id
      quantity
    }
  }
`;
const AddToCart = ({ id }) => {
  const [addToCart, {loading}] = useMutation(ADD_TO_CART_MUTATION, {
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

export default AddToCart