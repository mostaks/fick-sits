import React from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useQuery } from 'react-apollo-hooks';
import { PaginationStyles } from './styles/PaginationStyles';
import { perPage } from '../config';
import Error from './ErrorMessage';
import { PAGINATION_QUERY } from './queries';

const Pagination = ({ page }) => {
  const { data, loading, error } = useQuery(PAGINATION_QUERY);

  if (loading) {
    return <p>loading...</p>
  }

  if (error) {
    return <Error error={error} />
  }

  const count = data.itemsConnection.aggregate.count;
  const pages = Math.ceil(count / perPage);


  return (
    <PaginationStyles>
      <Head>
        <title>
          Sick Fits! | Page {page} of {pages}
        </title>
      </Head>
      <Link
        href={{
          pathname: "items",
          query: { page: page - 1 }
        }}
      >
        <a className="prev" aria-disabled={page <= 1}>
          Prev
        </a>
      </Link>
      <p>
        You are on page {page} of {pages}
      </p>
      <p>{count} items total</p>
      <Link
        href={{
          pathname: "items",
          query: { page: page + 1 }
        }}
      >
        <a className="next" aria-disabled={page >= pages}>
          Prev
        </a>
      </Link>
    </PaginationStyles>
  );
}

export default Pagination;
