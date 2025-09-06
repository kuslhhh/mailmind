import axios from "axios";
import { createOauthClient } from "../utils/googleClient";
import { SCOPES } from "../utils/setupId";


export const getAuthUrl = () => {
   const oAuth2Client = createOauthClient()
   return oAuth2Client.generateAuthUrl({
      access_type: "offline",
      scope: SCOPES
   })
}

export const getTokens = async (code: string) => {
   const oAuth2Client = createOauthClient();
   const { tokens } = await oAuth2Client.getToken(code)
   return tokens;
}


export const revokeToken = async (token: string) => {
   await axios.post("https://oauth2.googleapis.com/revoke", null, {
      params: { token },
      headers: { "Content-type": "application/x-www-form-urlencoded" },
   });
}