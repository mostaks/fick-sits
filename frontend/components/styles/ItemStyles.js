import styled from 'styled-components';
import media from '../../lib/media';

const Item = styled.div`
  background: white;
  border: 1px solid ${props => props.theme.offWhite};
  box-shadow: ${props => props.theme.bs};
  position: relative;
  display: flex;
  flex-direction: column;
  img {
    width: 100%;
    height: 100px;
    object-fit: cover;
    ${media.smUp`
      height: 400px;
    `}
  }
  p {
    font-size: 12px;
    line-height: 2;
    font-weight: 300;
    padding: 0 3rem;
    font-size: 1.5rem;
    ${media.smUp`
      flex-grow: 1;
    `}
  }
  .buttonList {
    display: grid;
    width: 100%;
    border-top: 1px solid ${props => props.theme.lightgrey};
    grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
    grid-gap: 1px;
    background: ${props => props.theme.lightgrey};
    & > * {
      background: white;
      border: 0;
      font-size: 1rem;
      padding: 1rem;
    }
  }
`;

export default Item;
