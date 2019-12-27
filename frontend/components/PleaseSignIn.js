import { useQuery } from 'react-apollo-hooks';
import { CURRENT_USER_QUERY } from './queries/Queries';
import Signin from './Signin';

const PleaseSignin = ({ children }) => {
  const { data, loading } = useQuery(CURRENT_USER_QUERY);
  
  if (loading) return <p>loading</p>;

  if (!data.me) {
    return (
      <>
        <p>Please sign in before continuing</p>
        <Signin /> 
      </>
    )
  }

  return children
};

export default PleaseSignin;