import React from "react";

interface Email {
  id: string;
  threadId: string;
}

interface Props {
  emails: Email[];
}

export default function EmailList({ emails = [] }: Props) {
  if (emails.length === 0) return <p>No unread emails 🎉</p>;

  return (
    <ul className="space-y-2">
      {emails.map((email) => (
        <li
          key={email.id}
          className="p-3 border rounded hover:bg-gray-100 transition"
        >
          <p>ID: {email.id}</p>
          <p>Thread: {email.threadId}</p>
        </li>
      ))}
    </ul>
  );
}
