import { useState } from 'react';
import PropTypes from 'prop-types';
import gql from 'graphql-tag';
import { useMutation } from 'react-apollo-hooks';
import Table from './styles/Table';
import Error from './ErrorMessage';
import SickButton from './styles/SickButton';
import { possiblePermissions } from '../data/data';

const propTypes = {
  user: PropTypes.shape({
    name: PropTypes.string,
    email: PropTypes.string,
    id: PropTypes.string,
    permissions: PropTypes.array
  }).isRequired
}

const UPDATE_PERMISSIONS_MUTATION = gql`
  mutation updatePermission(
    $permissions: [Permission], 
    $userId: ID!
  ) {
    updatePermissions(permissions: $permissions, userId: $userId) {
      id
      permissions
      name
      email
    }
  }
`;

const UserPermissions = ({ user }) => {
  const [permissions, setPermissions] = useState(user.permissions);

  const [updatePermissions, { loading, error }] = useMutation(
    UPDATE_PERMISSIONS_MUTATION, {
    variables: {
      permissions: permissions,
      userId: user.id
    }
  });

  const handlePermissionChange = (e) => {
    const checkbox = e.target;
    let updatedPermissions = [...permissions];
    if (checkbox.checked) {
      updatedPermissions.push(checkbox.value);
    } else {
      updatedPermissions = updatedPermissions.filter(permission => permission !== checkbox.value);
    }
    setPermissions(updatedPermissions);
  }
  return (
    <>
      {error && (
        <tr><td colspan="8"><Error error={error} /></td></tr>
      )}
      <tr>
        <td>{user.name}</td>
        <td>{user.email}</td>
        {possiblePermissions.map(permission => (
          <td key={permission}>
            <label htmlFor={`${user.id}-permission-${permission}`}>
              <input
                id={`${user.id}-permission-${permission}`}
                type="checkbox"
                value={permission}
                checked={permissions.includes(permission)}
                onChange={handlePermissionChange}
              />
            </label>
          </td>
        ))}
        <td>
          <SickButton
            type="button"
            disabled={loading}
            onClick={updatePermissions}
          >
            Updat{loading ? 'ing' : 'e'}
          </SickButton>
        </td>
      </tr>
    </>
  )
}

UserPermissions.propTypes = propTypes;

export default UserPermissions;