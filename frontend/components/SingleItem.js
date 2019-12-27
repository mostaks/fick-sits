import React from 'react';
import { useQuery } from 'react-apollo-hooks';
import Error from './ErrorMessage';
import Head from 'next/head';
import SingleItemStyles from './styles/SingleItemStyles';
import { SINGLE_ITEM_QUERY } from './queries/Queries';

const SingleItem = ({ id }) => {
  const { data, error, loading } = useQuery(SINGLE_ITEM_QUERY, {
    variables: {
      id
    }
  })

  if (error) {
    return <Error error={error} />
  }

  if (loading) {
    return <p>Loading!</p>
  }

  if (!data.item) {
    return <p>No item found for {id}</p>
  }

  const { title, largeImage, description } = data.item;

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
