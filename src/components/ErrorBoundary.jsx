import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#0D0D0D] text-white flex flex-col items-center justify-center p-4 text-center">
          <h1 className="font-luxury text-4xl text-[#1A1A1A] mb-4">Something went wrong.</h1>
          <p className="text-[#1A1A1A]/60 mb-8 max-w-md">The luxury experience encountered an unexpected error. Please try refreshing the page.</p>
          <button 
            onClick={() => window.location.reload()}
            className="btn-gold px-8 py-3"
          >
            Refresh Page
          </button>
          <div className="mt-8 p-4 bg-red-900/20 border border-red-500/30 rounded-xl text-left text-xs overflow-auto max-w-full">
            <p className="text-red-400 font-bold mb-2">Error Details:</p>
            <pre className="whitespace-pre-wrap">
              {this.state.error?.stack || this.state.error?.toString()}
            </pre>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
