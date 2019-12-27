import styled from 'styled-components';
import media from '../../lib/media';


const DotStyles = styled.div`
  background: ${({ theme }) => theme.red};
  color: white;
  border-radius: 50%;
  padding: 0.5rem; 
  line-height: 0;
  min-width: 0;
  margin-left: 0;
  margin-right: 1rem;
  font-weight: 100;
  font-feature-settings: 'tnum';
  font-variant-numeric: tabular-nums;

  ${media.smUp`
    margin-left: 1rem;
    margin-right: 0;
    min-width: 3rem;
    line-height: 2rem;
  `}
`;

export default DotStyles;