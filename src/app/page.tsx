
"use client"

import { useAuth } from "@/hooks/use-auth";
import { ContactPage } from "@/components/contact-page";
import { LoaderCircle } from "lucide-react";

export default function Home() {
  const { user, isLoading } = useAuth();

  if (isLoading || !user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoaderCircle className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }
  
  return (
    <main className="min-h-screen bg-background text-foreground">
      <ContactPage />
    </main>
  );
}
