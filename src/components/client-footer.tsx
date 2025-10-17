"use client";

import { useState, useEffect } from "react";

export default function ClientFooter() {
  const [year, setYear] = useState<number | null>(null);

  useEffect(() => {
    setYear(new Date().getFullYear());
  }, []);

  return (
    <footer className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 text-center text-muted-foreground">
      {year && <p>&copy; {year} SecureTranscrypt. All Rights Reserved.</p>}
    </footer>
  );
}
