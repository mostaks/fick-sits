import React, { useState } from 'react';
import { useQuery, useMutation } from 'react-apollo-hooks';
import Form from './styles/Form';
import ErrorMessage from './ErrorMessage';
import { SINGLE_ITEM_QUERY } from './queries/Queries';
import { UPDATE_ITEM_MUTATION } from './mutations/Mutations';

const UpdateItem = ({ id }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState(0);

  const [updateItem, { loading, error }] = useMutation(UPDATE_ITEM_MUTATION);
  const { data, loading: loadingItem } = useQuery(SINGLE_ITEM_QUERY, {
    variables: {
      id: id
    }
  });

  const handleChange = (e, setProp) => {
    const { type, value } = e.target;
    const val = type === "number" ? Number(value) : value;
    setProp(val);
  };

  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    const itemVars = { title, description, price };

    Object.keys(itemVars).forEach(key => {
      if (!itemVars[key]) delete itemVars[key];
    });

    const res = await updateItem({
      variables: {
        id: id,
        ...itemVars
      }
    })

    console.log('res', res)
  }

  if (loadingItem) {
    return (
      <p>Loading</p>
    )
  }

  if (!data.item) {
    return (
      <p>No Item Found for ID: {id}</p>
    )
  }

  return (
    <Form
      onSubmit={e => handleUpdateSubmit(e)}
    >
      <ErrorMessage error={error} />
      <fieldset disabled={loading} aria-busy={loading}>
        <label htmlFor="title">
          Title
          <input
            type="text"
            id="title"
            name="title"
            placeholder="Title"
            required
            defaultValue={data.item.title}
            onChange={e => handleChange(e, setTitle)}
          />
        </label>
        <label htmlFor="price">
          Price
          <input
            type="number"
            id="price"
            name="price"
            placeholder="Price"
            required
            defaultValue={data.item.price}
            onChange={e => handleChange(e, setPrice)}
          />
        </label>
        <label htmlFor="Description">
          Description
          <textarea
            type="text"
            id="description"
            name="description"
            placeholder="Description"
            required
            defaultValue={data.item.description}
            onChange={e => handleChange(e, setDescription)}
          />
          <button type="submit">Sav{loading ? 'ing' : 'e'} Changes</button>
        </label>
      </fieldset>
    </Form>
  );
};

export default UpdateItem;

export { UPDATE_ITEM_MUTATION };
