import React, { Component, ErrorInfo, ReactNode } from 'react';
import { UnexpectedRuntimeErrorScreen } from './UnexpectedRuntimeErrorScreen';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class GlobalErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('GlobalErrorBoundary caught error:', error, errorInfo);
  }

  componentDidMount() {
    window.addEventListener('unhandledrejection', this.handleUnhandledRejection);
  }

  componentWillUnmount() {
    window.removeEventListener('unhandledrejection', this.handleUnhandledRejection);
  }

  handleUnhandledRejection = (event: PromiseRejectionEvent) => {
    console.error('Unhandled promise rejection:', event.reason);
  };

  render() {
    if (this.state.hasError) {
      return <UnexpectedRuntimeErrorScreen error={this.state.error} />;
    }
    return this.props.children;
  }
}

export default GlobalErrorBoundary;
