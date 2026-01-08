import { Component, type ErrorInfo, type ReactNode } from 'react';

interface Props {
    children: ReactNode;
}

interface State {
    hasError: boolean;
    error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
    public state: State = {
        hasError: false,
        error: null
    };

    public static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error };
    }

    public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error('Uncaught error:', error, errorInfo);
    }

    public render() {
        if (this.state.hasError) {
            return (
                <div className="min-h-screen bg-[#0a0b0d] flex items-center justify-center p-6 text-center">
                    <div className="max-w-md w-full">
                        <div className="w-20 h-20 bg-red-500/10 border border-red-500/20 rounded-full flex items-center justify-center mx-auto mb-8 animate-pulse">
                            <span className="text-3xl">⚠️</span>
                        </div>
                        <h1 className="display-font text-3xl text-white uppercase italic tracking-tighter mb-4">
                            Pitch Disruption
                        </h1>
                        <p className="text-[#667788] text-sm leading-relaxed mb-10">
                            Something went wrong on the field. Our tactical team has been notified.
                            <br />
                            <span className="text-[10px] mt-4 block opacity-50 font-mono italic">
                                {this.state.error?.message}
                            </span>
                        </p>
                        <button
                            onClick={() => window.location.reload()}
                            className="px-8 py-3 bg-white text-black text-[11px] font-black uppercase tracking-widest rounded hover:bg-kickr hover:text-white transition-all transform hover:-translate-y-px"
                        >
                            Restart Session
                        </button>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}
