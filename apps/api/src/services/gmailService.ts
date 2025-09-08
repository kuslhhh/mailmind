import { google } from "googleapis";
import { getGoogleClient } from "../utils/googleClient";

export const listInbox = async (token: string, maxResults = 10) => {
  const gmail = getGoogleClient(token);

  const res = await gmail.users.messages.list({
    userId: "me",
    maxResults,
    q: "is:unread",
  });

  return res.data.messages || [];
};

export const listReadMessages = async (accessToken: string, maxResults = 10) => {
  const gmail = getGoogleClient(accessToken);

  const res = await gmail.users.messages.list({
    userId: "me",
    maxResults,
    q: "is:read",
  });

  return res.data.messages || [];
};

export const getEmailContent = async (accessToken: string, messageId: string) => {
   const oauth2Client = new google.auth.OAuth2();

   oauth2Client.setCredentials({ access_token: accessToken })

   const gmail = google.gmail({
      version: "v1",
      auth: oauth2Client
   });

   const res = await gmail.users.messages.get({
      userId: "me",
      id: messageId,
      format: "full"
   });

   const body = res.data.payload?.parts?.[0]?.body?.data;
   const decodedBody = body ? Buffer.from(body, "base64").toString("utf-8") : "";

   return {
      id: res.data.id,
      threadId: res.data.threadId,
      snippet: res.data.snippet,
      body: decodedBody
   }
}