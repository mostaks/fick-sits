import styled from 'styled-components';

const AnimationStyles = styled.span`
  position: relative;
  .count {
    display: block;
    position: relative;
    transition: all 0.2s;
    backface-visibility: hidden;
  }
  .count-enter {
    transform: scale(4) rotateX(0.5turn);
  }
  .count-enter-active {
    transform: rotateX(0);
  }
  .count-exit {
    top: 0;
    position: absolute;
    transform: rotateX(0);
  }
  .count-exit-active {
    transform: scale(4) rotateX(0.5turn);
  }
`;

export default AnimationStyles;