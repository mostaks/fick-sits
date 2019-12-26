import React from 'react';
import styled from 'styled-components';
import media from '../lib/media';
import { TransitionGroup, CSSTransition} from 'react-transition-group';

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

const Dot = styled.div`
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

const CartCount = ({ count }) => {
  return (
    <AnimationStyles>
      <TransitionGroup>
        <CSSTransition
          unmountOnExit
          className="count"
          classNames="count"
          key={count}
          timeout={{ enter: 100, exit: 100 }}
        >
          <Dot>
            {count}
          </Dot>
        </CSSTransition>
      </TransitionGroup>
    </AnimationStyles>
  );
}

export default CartCount;
