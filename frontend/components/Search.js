import React, { useState, useCallback } from 'react';
import Downshift, { resetIdCounter } from 'downshift';
import Router from 'next/router';
import { useApolloClient } from 'react-apollo-hooks';
import debounce from 'lodash.debounce';
import { DropDown, SearchStyles, DropDownItem } from './styles/DropDown';
import { SEARCH_ITEMS_QUERY } from './queries';

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
    setItems(res.data.items);
    setLoading(false);
  }, 350), []);

  // manually query apollo client
  const handleChange = async e => {
    e.persist();
    debounced(e.target.value);
  };

  const routeToItem = (item) => {
    Router.push({
      pathname: '/item',
      query: {
        id: item.id
      }
    })
  };

  resetIdCounter();

  return (
    <SearchStyles>
      <Downshift
        onChange={routeToItem}
        itemToString={item => (item === null ? '' : item.title)}
      >
        {({ getInputProps, getItemProps, isOpen, inputValue, highlightedIndex }) => (
          <div>
            <input
              type="search"
              {...getInputProps({
                type: 'search',
                placeholder: 'Search for an item',
                id: 'search',
                className: loading ? 'loading' : '',
                onChange: e => {
                  handleChange(e);
                }
              })}
            />
            {isOpen && (
              <DropDown>
                <p>Items will go here</p>
                {items.map((item, i) => (
                  <DropDownItem
                    {...getItemProps({ item })}
                    highlighted={i === highlightedIndex}
                    key={item.id}
                  >
                    <img width="50" src={item.image} alt={item.title} />
                    {item.title}
                  </DropDownItem>
                ))}
                {!items.length && !loading && (
                  <DropDownItem>
                    Nothing found for "{inputValue}"
                  </DropDownItem>
                )}
              </DropDown>
            )}
          </div>
        )}
      </Downshift>
    </SearchStyles>
  );
}

export default AutoComplete;
