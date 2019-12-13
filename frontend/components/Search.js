import React, { useState, useCallback } from 'react';
import Downshift from 'downshift';
import Router from 'next/router';
import { useApolloClient } from 'react-apollo-hooks';
import gql from 'graphql-tag';
import debounce from 'lodash.debounce';
import { DropDown, SearchStyles, DropDownItem } from './styles/DropDown';

const SEARCH_ITEMS_QUERY = gql`
  query SEARCH_ITEMS_QUERY($searchTerm: String!) {
    items(where: {
      OR: [
        {title_contains: $searchTerm},
        {description_contains: $searchTerm}
      ]
    }) {
      id
      image
      title
    }
  }
`;


const AutoComplete = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);

  const client = useApolloClient();

  const debounced = useCallback(debounce(async (val) => {
    setLoading(true);
    const res = await client.query({
      query: SEARCH_ITEMS_QUERY,
      variables: { searchTerm: val }
    }, 2000)
    console.log('res', res)
    console.log('val', val)
    setItems(res.data.items);
    setLoading(false);
  }, 350), []);

  // manually query apollo client
  const handleChange = async e => {
    e.persist();
    debounced(e.target.value);
  };

  return (
    <SearchStyles>
      <div>
        <input type="search" onChange={handleChange}/>
        <DropDown>
          <p>Items will go here</p>
          {items.map(item => (
            <DropDownItem key={item.id}>
              <img width="50" src={item.image} alt={item.title}/>
              {item.title}
            </DropDownItem>
          ))}
        </DropDown>
      </div>
    </SearchStyles>
  );
}

export default AutoComplete;
