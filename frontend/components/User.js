import React from 'react';
import { useQuery } from 'react-apollo-hooks';
import gql from 'graphql-tag';
import PropTypes from 'prop-types';

const CURRENT_USER_QUERY = gql`
  query {
    me {
      id
      email
      name
      permissions
      cart {
        id
        quantity
        item {
          id
          price
          image
          title
          description
        }
      }
    }
  }
`;

const User = (props) => {
  const { data, loading } = useQuery(CURRENT_USER_QUERY);

  if (loading) {
    return <p>loading</p>
  }

  return (
    <div {...props} >
      { props.children(data) }
    </div>
  );
};

User.propTypes = {
  children: PropTypes.func.isRequired
}

export default User;
export { CURRENT_USER_QUERY };
