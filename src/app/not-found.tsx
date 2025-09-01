import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { AlertTriangle } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background text-foreground">
      <div className="text-center p-8 rounded-xl bg-card shadow-sm max-w-md mx-auto">
        <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-destructive/10 mb-6">
          <AlertTriangle className="h-8 w-8 text-destructive" />
        </div>
        <h1 className="text-4xl font-bold tracking-tight text-destructive">
          404 - Page Not Found
        </h1>
        <p className="mt-4 text-muted-foreground">
          Oops! The page you are looking for does not exist. It might have been moved or deleted.
        </p>
        <Button asChild className="mt-8">
          <Link href="/">
            Go back to Homepage
          </Link>
        </Button>
      </div>
    </div>
  );
}
