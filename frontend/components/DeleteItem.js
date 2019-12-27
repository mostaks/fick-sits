import React from 'react';
import { useMutation } from 'react-apollo-hooks';
import { ALL_ITEMS_QUERY } from './queries';
import { DELETE_ITEM_MUTATION } from './mutations';

const DeleteItem = ({ children, id }) => {
  const [deleteItem] = useMutation(DELETE_ITEM_MUTATION, {
    update (cache, payload) {
      // manually update the cache on the client, so is matches the server
      // 1. read the cache for the items that we want
      const data = cache.readQuery({ query: ALL_ITEMS_QUERY });
      // 2. filter the deleted item out of the data.items object
      data.items = data.items.filter(item => item.id !== payload.data.deleteItem.id);
      // 3. put the items back in
      cache.writeQuery({ query: ALL_ITEMS_QUERY, data }) 
    }
  });

  return <button onClick={() => {
    if(confirm('Are you sure you would like to delete this item?')) {
      deleteItem({variables: {id: id}}).catch(err => {
        alert(err.message)
      });
    }
  }}>{children}</button>;
};

export default DeleteItem;