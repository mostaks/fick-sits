import React from 'react';
import { useQuery } from 'react-apollo-hooks';
import { formatDistance } from 'date-fns';
import Link from 'next/link';
import styled from 'styled-components';
import formatMoney from '../lib/formatMoney';
import OrderItemStyles from './styles/OrderItemStyles';
import Error from './ErrorMessage';
import { USER_ORDERS_QUERY } from './queries';

const OrderUlStyled = styled.ul`
  display: grid;
  grid-gap: 4rem;
  grid-template-columns: repeat(auto-fit, minmax(40%, 1fr));
`;

const OrderList = () => {
  const { loading, error, data } = useQuery(USER_ORDERS_QUERY);

  if (loading) {
    return <p>loading</p>
  };

  if (error) {
    return <Error error={error}></Error>
  }

  const date = new Date();
  console.log('date', date)

  console.log('data.orders', new Date(data.orders[0].createdAt))
  return (
    <div>
      <h2>You have {data.orders.length} orders</h2>
      <OrderUlStyled>
        {data.orders.map(order => (
          <OrderItemStyles key={order.id}>
            <Link
              href={{
                pathname: '/order',
                query: { id: order.id }
              }}
            >
              <a>
                <div className="order-meta">
                  <p>{order.items.reduce((a, b) => a + b.quantity, 0)}</p>
                  <p>{order.items.length} Products</p>
                  <p>{formatDistance(new Date(order.createdAt), new Date())}</p>
                  <p>{formatMoney(order.total)}</p>
                </div>
                <div className="images">
                  {order.items.map(item => (
                    <img key={item.id} src={item.image} alt={item.title} />
                  ))}
                </div>
              </a>
            </Link>
          </OrderItemStyles>
        ))}
      </OrderUlStyled>
    </div>
  );
}

export default OrderList;
