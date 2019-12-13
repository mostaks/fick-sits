import SingleItem from '../components/SingleItem';

const Item = ({ query }) => {
  return (
    <>
      <SingleItem id={query.id} />
    </>
  );
};

export default Item;
