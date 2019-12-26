import { css } from 'styled-components';
const xs = 0;
const sm = 576;
const md = 768;
const lg = 992;
const xl = 1200;

const breakpoint = {
  xs: {
    min: `${xs}px`,
    max: `${sm - 1}px`
  },
  sm: {
    min: `${sm}px`,
    max: `${md - 1}px`
  },
  md: {
    min: `${md}px`,
    max: `${lg - 1}px`
  },
  lg: {
    min: `${lg}px`,
    max: `${xl - 1}px`
  },
  xl: {
    min: `${xl}px`
  }
};

const media = Object.keys(breakpoint).reduce((accumulator, label) => {
  const down = breakpoint[label].max;
  const up = breakpoint[label].min;

  // conditional to omit reduntant xlDown
  if (down) {
    accumulator[`${label}Down`] = (...args) => css`
      @media (max-width: ${down}) {
        ${css(...args)}
      }
    `;
  }

  // conditional to omit reduntant xsUp
  if (up) {
    accumulator[`${label}Up`] = (...args) => css`
      @media (min-width: ${up}) {
        ${css(...args)}
      }
    `;
  }

  if (down && up) {
    accumulator[`${label}`] = (...args) => css`
      @media (min-width: ${up}) and (max-width: ${down}) {
        ${css(...args)}
      }
    `;
  }

  return accumulator;
}, {});

export default media;