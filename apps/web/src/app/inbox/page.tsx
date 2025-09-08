"use client";

import React, { useEffect, useState } from "react";
import { fetchInbox } from "../../lib/api";
import { useSearchParams } from "next/navigation";
import EmailList from "@/components/EmailList";

interface Email {
  id: string;
  threadId: string;
}

export default function InboxPage() {
  const searchParams = useSearchParams();
  const email = searchParams.get("email") || "";
  const [emails, setEmails] = useState<Email[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!email) {
      setError("No email found. Please login first.");
      setLoading(false);
      return;
    }

    fetchInbox(email)
      .then((data: any) => setEmails(data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [email]);

  if (loading) return <p className="p-4">Loading emails...</p>;
  if (error) return <p className="p-4 text-red-500">{error}</p>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Unread Emails for {email}</h1>
      <EmailList emails={emails} />
    </div>
  );
}
