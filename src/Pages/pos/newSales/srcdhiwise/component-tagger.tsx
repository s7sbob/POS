import React, { useMemo } from 'react';

export interface TaggedComponentProps {
  tag?: string;
  id?: string;
  className?: string;
  'data-testid'?: string;
  children?: React.ReactNode;
}

export interface TaggerOptions {
  tag?: string;
  id?: string;
  className?: string;
  testId?: string;
  debug?: boolean;
}

/**
 * Component tagger utility for adding metadata and testing attributes to React components
 * @param Component - The React component to wrap
 * @param options - Tagging options including tag, id, className, testId, and debug
 * @returns Tagged React component with additional props
 */
export function tagger<T extends React.ComponentType<any>>(
  Component: T,
  options: TaggerOptions = {}
): React.ComponentType<React.ComponentProps<T> & TaggedComponentProps> {
  const { tag, id, className, testId, debug = false } = options;

  const TaggedComponent = React.forwardRef<any, React.ComponentProps<T> & TaggedComponentProps>(
    (props, ref) => {
      const enhancedProps = {
        ...props,
        ...(tag && { 'data-tag': tag }),
        ...(id && { id }),
        ...(className && { className: `${props.className || ''} ${className}`.trim() }),
        ...(testId && { 'data-testid': testId }),
        ref,
      };

      if (debug) {
        console.log('Tagged component props:', enhancedProps);
      }

      return React.createElement(Component, enhancedProps);
    }
  );

  TaggedComponent.displayName = `Tagged(${Component.displayName || Component.name || 'Component'})`;

  return TaggedComponent as React.ComponentType<React.ComponentProps<T> & TaggedComponentProps>;
}

/**
 * Higher-order component for tagging components with metadata
 * @param options - Tagging options
 * @returns HOC function that wraps components with tagging functionality
 */
export const withTagger = (options: TaggerOptions = {}) => {
  return <T extends React.ComponentType<any>>(Component: T) => {
    return tagger(Component, options);
  };
};

/**
 * Hook for creating tagged element props
 * @param options - Tagging options
 * @returns Object with tagged props
 */
export const useTaggedProps = (options: TaggerOptions = {}) => {
  const { tag, id, className, testId } = options;
  
  return React.useMemo(() => ({
    ...(tag && { 'data-tag': tag }),
    ...(id && { id }),
    ...(className && { className }),
    ...(testId && { 'data-testid': testId }),
  }), [tag, id, className, testId]);
};

export default tagger;