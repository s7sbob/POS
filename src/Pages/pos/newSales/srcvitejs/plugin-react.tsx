import React, { useCallback } from 'react';

export interface ReactPluginOptions {
  enableHMR?: boolean;
  enableDevTools?: boolean;
  strictMode?: boolean;
  debug?: boolean;
}

export interface ReactComponentOptions {
  displayName?: string;
  propTypes?: any;
  defaultProps?: any;
}

/**
 * React plugin utility for enhancing React components with additional functionality
 * @param Component - The React component to enhance
 * @param options - Plugin options for React-specific enhancements
 * @returns Enhanced React component with plugin functionality
 */
export function react<T extends React.ComponentType<any>>(
  Component: T,
  options: ReactPluginOptions & ReactComponentOptions = {}
): React.ComponentType<React.ComponentProps<T>> {
  const {
    enableHMR = true,
    enableDevTools = process.env.NODE_ENV === 'development',
    strictMode = false,
    debug = false,
    displayName,
    propTypes,
    defaultProps,
  } = options;

  const EnhancedComponent = React.forwardRef<any, React.ComponentProps<T>>(
    (props, ref) => {
      // Debug logging in development
      if (debug && enableDevTools) {
        console.log(`[React Plugin] Rendering ${displayName || Component.name}:`, props);
      }

      // Error boundary for development
      if (enableDevTools) {
        try {
          const element = React.createElement(Component, { ...props, ref });
          return strictMode ? React.createElement(React.StrictMode, {}, element) : element;
        } catch (error) {
          console.error(`[React Plugin] Error in ${displayName || Component.name}:`, error);
          return React.createElement(
            'div',
            { style: { color: 'red', padding: '10px', border: '1px solid red' } },
            `Error: ${error instanceof Error ? error.message : 'Unknown error'}`
          );
        }
      }

      const element = React.createElement(Component, { ...props, ref });
      return strictMode ? React.createElement(React.StrictMode, {}, element) : element;
    }
  );

  // Set component metadata
  EnhancedComponent.displayName = displayName || `ReactPlugin(${Component.displayName || Component.name || 'Component'})`;
  
  if (propTypes) {
    (EnhancedComponent as any).propTypes = propTypes;
  }
  
  if (defaultProps) {
    (EnhancedComponent as any).defaultProps = defaultProps;
  }

  // Hot module replacement support
  if (enableHMR && enableDevTools && (module as any).hot) {
    (module as any).hot.accept();
  }

  return EnhancedComponent;
}

/**
 * Higher-order component for React plugin enhancements
 * @param options - Plugin options
 * @returns HOC function that wraps components with React plugin functionality
 */
export const withReactPlugin = (options: ReactPluginOptions & ReactComponentOptions = {}) => {
  return <T extends React.ComponentType<any>>(Component: T) => {
    return react(Component, options);
  };
};

/**
 * Hook for React plugin utilities
 * @param options - Plugin options
 * @returns Object with React plugin utilities
 */
export const useReactPlugin = (options: ReactPluginOptions = {}) => {
  const { enableDevTools = process.env.NODE_ENV === 'development', debug = false } = options;
  
  const logRender = React.useCallback((componentName: string, props?: any) => {
    if (debug && enableDevTools) {
      console.log(`[React Plugin] ${componentName} rendered:`, props);
    }
  }, [debug, enableDevTools]);

  const measurePerformance = React.useCallback((name: string, fn: () => void) => {
    if (enableDevTools) {
      const start = performance.now();
      fn();
      const end = performance.now();
      console.log(`[React Plugin] ${name} took ${end - start} milliseconds`);
    } else {
      fn();
    }
  }, [enableDevTools]);

  return {
    logRender,
    measurePerformance,
    isDevMode: enableDevTools,
  };
};

export default react;