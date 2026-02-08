import React, { Component, ReactNode } from 'react';
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

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('GlobalErrorBoundary caught an error:', error, errorInfo);
  }

  componentDidMount() {
    // Capture unhandled promise rejections
    window.addEventListener('unhandledrejection', this.handleUnhandledRejection);
    // Capture runtime errors
    window.addEventListener('error', this.handleError);
  }

  componentWillUnmount() {
    window.removeEventListener('unhandledrejection', this.handleUnhandledRejection);
    window.removeEventListener('error', this.handleError);
  }

  handleUnhandledRejection = (event: PromiseRejectionEvent) => {
    console.error('Unhandled promise rejection:', event.reason);
    const error = event.reason instanceof Error ? event.reason : new Error(String(event.reason));
    this.setState({ hasError: true, error });
    event.preventDefault();
  };

  handleError = (event: ErrorEvent) => {
    console.error('Runtime error:', event.error);
    this.setState({ hasError: true, error: event.error });
    event.preventDefault();
  };

  resetError = () => {
    this.setState({ hasError: false, error: undefined });
  };

  render() {
    if (this.state.hasError) {
      return <UnexpectedRuntimeErrorScreen error={this.state.error} resetError={this.resetError} />;
    }

    return this.props.children;
  }
}
