import PleaseSignin from '../components/PleaseSignIn';
import Permissions from '../components/Permissions';

const PermissionsPage = props => (
  <>
    <PleaseSignin>
      <Permissions /> 
    </PleaseSignin>
  </>
)

export default PermissionsPage;