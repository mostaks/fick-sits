import React from 'react';
import { TransitionGroup, CSSTransition} from 'react-transition-group';
import AnimationStyles from './styles/AnimationStyles';
import Dot from './styles/DotStyles';

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
