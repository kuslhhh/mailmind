import { google } from "googleapis";
import { CLIENT_ID, CLIENT_SECRET, REDIRECT_URI } from "./setupId";


export const createOauthClient = () => {
   return new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI)
}

export const getGoogleClient = (accessToken: string) => {
   const oAuthclient = new google.auth.OAuth2();
   oAuthclient.setCredentials({
      access_token: accessToken
   })
   return google.gmail({
      version: "v1",
      auth: oAuthclient
   })
}