import React, { useState } from 'react';
import { useMutation } from 'react-apollo-hooks';
import Router from 'next/router';
import Form from './styles/Form';
import ErrorMessage from './ErrorMessage';
import { CREATE_ITEM_MUTATION } from './mutations';

const CreateItem = (props) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState('');
  const [largeImage, setLargeImage] = useState('');
  const [price, setPrice] = useState(0);

  const [createItem, { loading, error }] = useMutation(CREATE_ITEM_MUTATION);

  const handleChange = (e, setProp) => {
    const { type, value } = e.target;
    const val = type === 'number' ? Number(value) : value;
    setProp(val);
  }

  const uploadFile = async (e) => {
    console.log('uploading file');
    const files = e.target.files;
    const data = new FormData();
    data.append('file',files[0]);
    data.append('upload_preset', 'ficksits');

    const res = await fetch("https://api.cloudinary.com/v1_1/dl1c18kic/image/upload", {
      method: 'POST',
      body: data
    });
    const file = await res.json();
    console.log('file', file);
    setImage(file.secure_url);
    setLargeImage(file.eager[0].secure_url);
  }

  return (
    <Form onSubmit={async e => {
      e.preventDefault();
      const state = {title, description, image, largeImage, price};
      const res = await createItem({variables: state});
      Router.push({
        pathname: '/item',
        query: {id: res.data.createItem.id}
      })
    }}>
      <ErrorMessage error={error} />
      <fieldset disabled={loading} aria-busy={loading}>
        <label htmlFor="file">
          Image
          <input
            type="file"
            id="file"
            name="file"
            placeholder="Upload an image"
            required
            onChange={e => uploadFile(e, setImage)}
          />
          {image && <img width="300" src={image} alt="alt preview" />}
        </label>
        <label htmlFor="title">
          Title
          <input
            type="text"
            id="title"
            name="title"
            placeholder="Title"
            required
            value={title}
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
            value={price}
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
            value={description}
            onChange={e => handleChange(e, setDescription)}
          />
          <button type="submit">Submit</button>
        </label>
      </fieldset>
    </Form>
  );
};

export default CreateItem;

export { CREATE_ITEM_MUTATION };