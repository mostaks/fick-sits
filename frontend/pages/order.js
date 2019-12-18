import PleaseSignin from '../components/PleaseSignIn';
import Order from '../components/Order';

const OrderPage = props => {
  return (
    <>
      <PleaseSignin>
        <Order id={props.query.id} />
      </PleaseSignin>
    </>
  )
}

export default OrderPage;
