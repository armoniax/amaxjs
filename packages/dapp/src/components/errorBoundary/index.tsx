import React from 'react';
import styles from './index.scss';

require(`@/assets/svgs`);
require(`@/assets/iconfont/iconfont.css`);

function ErrorBoundaryHOC(WrappedComponent) {
  interface ErrorBoundary {
    state: {
      hasError: boolean;
      error: any;
      info: any;
    };
    props: {
      children: any;
    };
  }
  class ErrorBoundary extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        hasError: false,
        error: {},
        info: {},
      };
    }

    componentDidCatch(error, info) {
      this.setState({
        hasError: true,
        error,
        info,
      });
    }

    render() {
      const { hasError, error, info } = this.state;
      if (hasError) {
        return (
          <div className={styles.error}>
            <h1>组件内部错误</h1>
            <p>{JSON.stringify(error)}</p>
            <p>{JSON.stringify(info)}</p>
          </div>
        );
      }
      return <WrappedComponent {...this.props} />;
    }
  }
  return ErrorBoundary;
}

export default ErrorBoundaryHOC;
