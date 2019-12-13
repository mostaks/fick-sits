import React from 'react';
import { useQuery } from 'react-apollo-hooks';
import gql from 'graphql-tag';
import Error from './ErrorMessage';
import styled from 'styled-components';
import Head from 'next/head';

const SingleItemStyles = styled.div`
  max-width: 1200px;
  margin: 2rem auto;
  box-shadow: ${({theme}) => theme.bs};
  display: grid;
  grid-auto-columns: 1fr;
  grid-auto-flow: column;
  min-height: 800px; 
  img {
    width: 100%;
    height: 100%;
    object-fit: contain;
  }

  .details {
    margin: 3rem;
    font-size: 2rem;
  }
`;

const SINGLE_ITEM_QUERY = gql`
  query SINGLE_ITEM_QUERY($id: ID!) {
    item(where: {id: $id}) {
      id 
      title
      description
      largeImage
    }
  }
`;

const SingleItem = ({ id }) => {
  const {data, error, loading} = useQuery(SINGLE_ITEM_QUERY, {
    variables: {
      id
    }
  })

  if (error) {
    return <Error error={error}/>
  }

  if (loading) {
    return <p>Loading!</p>
  }

  if (!data.item) {
    return <p>No item found for {id}</p>
  }

  const {title, largeImage, description} = data.item;

  return (
    <SingleItemStyles>
      <Head>
        <title>Sick Fits | {title}</title>
      </Head>
      <img src={largeImage} alt={title} />
      <div className="details">
        <h2>Viewing {title}</h2>
        <p>{description}</p>
      </div>
    </SingleItemStyles>
  );
}

export default SingleItem;
