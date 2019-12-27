import React from 'react';
import { useMutation } from 'react-apollo-hooks';
import { CURRENT_USER_QUERY } from './queries/Queries';
import {SIGN_OUT_MUTATION} from './mutations/Mutations';

const Signout = () => {
  const [signout] = useMutation(SIGN_OUT_MUTATION, {
    refetchQueries: [{ query: CURRENT_USER_QUERY }]
  });
  return (
    <button onClick={signout}>Signout</button>
  );
}

export default Signout;
