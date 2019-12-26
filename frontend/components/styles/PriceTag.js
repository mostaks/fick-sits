import styled from 'styled-components';
import media from '../../lib/media';

const PriceTag = styled.span`
  background: ${props => props.theme.red};
  transform: rotate(3deg);
  color: white;
  font-weight: 600;
  padding: 5px;
  line-height: 1;
  font-size: 1rem;
  display: inline-block;
  position: absolute;
  top: -3px;
  right: -3px;
  ${media.smUp`
    font-size: 3rem;
  `}
`;

export default PriceTag;
