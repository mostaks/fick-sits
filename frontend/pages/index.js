import Items from '../components/Items';

const Home = props => {
  return (
    <>
      <Items page={Number(props.query.page) || 1} />
    </>
  );
};

export default Home
