import PleaseSignin from '../components/PleaseSignIn';
import OrderList from '../components/OrderList';

const OrdersPage = props => {
  return (
    <>
      <PleaseSignin>
        <OrderList />
      </PleaseSignin>
    </>
  )
}

export default OrdersPage;
