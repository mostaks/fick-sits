import React from 'react';
import { useQuery } from 'react-apollo-hooks';
import { CURRENT_USER_QUERY } from './queries/Queries';
import Error from './ErrorMessage';
import ItemStyles from './styles/ItemStyles';

const Me = () => {
  const { data, error, loading } = useQuery(CURRENT_USER_QUERY)

  if (loading) {
    return <p>loading</p>
  }

  if (error) {
    return <Error error={error} />
  }

  return (
    <ItemStyles>
      <p>Username: {data.me.name}</p>
      <p>email: {data.me.email}</p>
    </ItemStyles>
  );
}

export default Me;
