import React from 'react';
import { useMutation } from 'react-apollo-hooks';
import gql from 'graphql-tag';
import { CURRENT_USER_QUERY } from './User';

const SIGN_OUT_MUTATION = gql`
  mutation SIGN_OUT_MUTATION {
    signout {
      message
    }
  }
`;

const Signout = (props) => {
  const [signout] = useMutation(SIGN_OUT_MUTATION, {
    refetchQueries: [{ query: CURRENT_USER_QUERY }]
  });
  return (
    <button onClick={signout}>Signout</button>
  );
}

export default Signout;
