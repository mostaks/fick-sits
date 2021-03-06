import { useQuery } from 'react-apollo-hooks';
import Error from './ErrorMessage';
import Table from './styles/Table';
import UserPermissions from './UserPermissions';
import { possiblePermissions } from '../data/data';
import { ALL_USERS_QUERY } from './queries';

const Permissions = () => {
  const { data, loading, error } = useQuery(ALL_USERS_QUERY);

  if (error) {
    return <Error error={error} />
  }
  if (loading) {
    return <div>Loading</div>
  }

  return (
    <div>
      <h2>Manage Permissions</h2>
      <Table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            {possiblePermissions.map(permission => (
              <th key={permission}>{permission}</th>
            ))}
            <th>👇🏿</th>
          </tr>
        </thead>
        <tbody>
          {data.users.map(user => <UserPermissions key={user.id} user={user} />)}
        </tbody>
      </Table>
    </div>
  )
}

export default Permissions