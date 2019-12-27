import React from 'react';
import { useQuery } from 'react-apollo-hooks';
import PropTypes from 'prop-types';
import { CURRENT_USER_QUERY } from './queries';

const User = (props) => {
  const { data, loading } = useQuery(CURRENT_USER_QUERY);

  if (loading) {
    return <p>loading</p>
  }

  return (
    <div {...props} >
      {props.children(data)}
    </div>
  );
};

User.propTypes = {
  children: PropTypes.func.isRequired
}

export default User;
