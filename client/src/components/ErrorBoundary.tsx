import { Component, ErrorInfo, ReactNode } from 'react';
import { Button } from './ui/button';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: undefined });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-[400px] flex items-center justify-center p-6">
          <div className="max-w-md w-full">
            <div className="bg-gradient-to-br from-[#122046] to-[#0a1628] border-2 border-red-500/30 rounded-2xl p-8 text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-500/20 flex items-center justify-center">
                <AlertTriangle className="h-8 w-8 text-red-500" />
              </div>
              
              <h2 className="text-2xl font-display font-bold text-white mb-3">
                Oops! Something went wrong
              </h2>
              
              <p className="text-zinc-400 mb-6">
                Don't worry! This happens sometimes. Let's try refreshing and starting fresh.
              </p>
              
              {this.state.error && process.env.NODE_ENV === 'development' && (
                <div className="mb-6 p-4 bg-black/30 rounded-lg text-left">
                  <p className="text-xs text-red-400 font-mono break-all">
                    {this.state.error.message}
                  </p>
                </div>
              )}
              
              <div className="flex gap-3 justify-center">
                <Button
                  onClick={this.handleReset}
                  className="gap-2 bg-gradient-to-r from-[#6DFF9C] to-[#4BCC7A] text-[#0a1628] font-semibold"
                >
                  <RefreshCw className="h-4 w-4" />
                  Try Again
                </Button>
                
                <Button
                  onClick={() => window.location.href = '/'}
                  variant="secondary"
                >
                  Go Home
                </Button>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
