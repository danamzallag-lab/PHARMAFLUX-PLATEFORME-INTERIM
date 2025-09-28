import { Button } from './ui/button';

export function DebugQuickAccess({ onNavigate }: { onNavigate: (page: string) => void }) {
  // Only show in development mode
  if (import.meta.env.PROD) {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <Button
        onClick={() => onNavigate('debug-env')}
        className="bg-red-500 hover:bg-red-600 text-white shadow-lg"
        size="sm"
      >
        🔧 Debug ENV
      </Button>
    </div>
  );
}