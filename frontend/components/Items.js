import React from 'react'
import { useQuery } from 'react-apollo-hooks';
import styled from 'styled-components';
import Item from './Item';
import Pagination from './Pagination';
import { perPage } from '../config';
import { ALL_ITEMS_QUERY } from './queries';

const Center = styled.div`
  text-align: center;
`;

const ItemsList = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-gap: 60px;
  max-width: ${({theme}) => theme.maxWidth};
  margin: 0 auto;
`;

const Items = ({ page }) => {
  const { loading, data, error } = useQuery(
    ALL_ITEMS_QUERY, { 
      variables: {
        skip: page * perPage - perPage
      }
    }
  );

  const renderAllItems = () => {
    if (loading) return <p>loading</p>
    if (error) return <p>Error: {error.message}</p>
    return (
      <ItemsList>
        {data.items.map(item => <Item item={item} key={item.id} />)}
      </ItemsList>
    )
  }
  return (
    <Center>
      <Pagination page={page} />
      {renderAllItems()}
      <Pagination page={page} />
    </Center>
  );
};

export default Items;
export { ALL_ITEMS_QUERY };