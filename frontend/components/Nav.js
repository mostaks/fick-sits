import Link from 'next/link';
import { useMutation } from 'react-apollo-hooks';
import { NavStyles } from './styles/NavStyles';
import User from './User';
import Signout from './Signout';
import CartCount from './CartCount';
import { TOGGLE_CART_MUTATION } from './mutations/Mutations';

const Nav = () => {
  const [toggleCart] = useMutation(TOGGLE_CART_MUTATION);
  return (
    <User>
      {({ me }) => (
        <NavStyles>
          <Link href="/items">
            <a>Shop</a>
          </Link>
          {me && (
            <>
              <Link href="/sell">
                <a>Sell</a>
              </Link>
              <Link href="/orders">
                <a>Orders</a>
              </Link>
              <Link href="/me">
                <a>Account</a>
              </Link>
              <Signout />
              <button onClick={toggleCart}>
                My Cart
                <CartCount 
                  count={me.cart.reduce(
                    (tally, cartItem) => (tally + cartItem.quantity), 0)
                  } 
                />
              </button>
            </>
          )}
          {!me && (
            <Link href="/signup">
              <a>Signin</a>
            </Link>
          )}
        </NavStyles>
      )}
    </User>
  );
}
export default Nav