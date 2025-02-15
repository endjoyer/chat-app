import * as React from 'react';

export const ChevronLeft = ({
  height = '1em',
  fill = 'currentColor',
  focusable = 'false',
  ...props
}: Omit<React.SVGProps<SVGSVGElement>, 'children'>) => (
  <svg
    role="img"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    height={height}
    focusable={focusable}
    {...props}
  >
    <path
      fill={fill}
      d="M12.707 17.293L8.414 13H18v-2H8.414l4.293-4.293l-1.414-1.414L4.586 12l6.707 6.707z"
    />
  </svg>
);

export const ChevronRight = ({
  height = '1em',
  fill = 'currentColor',
  focusable = 'false',
  ...props
}: Omit<React.SVGProps<SVGSVGElement>, 'children'>) => (
  <svg
    role="img"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    height={height}
    focusable={focusable}
    {...props}
  >
    <path
      fill={fill}
      d="m11.293 17.293l1.414 1.414L19.414 12l-6.707-6.707l-1.414 1.414L15.586 11H6v2h9.586z"
    />
  </svg>
);

export const ArrowDown: React.FC = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 15.5a1 1 0 01-.71-.29l-4-4a1 1 0 111.42-1.42L12 13.1l3.29-3.3a1 1 0 111.42 1.42l-4 4a1 1 0 01-.71.29z" />
  </svg>
);
