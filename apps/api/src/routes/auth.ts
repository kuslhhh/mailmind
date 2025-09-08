import { Router } from "express";
import { getAuthUrl, getTokens, revokeToken } from "../services/authService";
import { google } from "googleapis";
import { CLIENT_ID, CLIENT_SECRET, REDIRECT_URI } from "../utils/setupId";
import { saveTokensForUser } from "src/services/tokenService";

const router = Router()

const oauth2Client = new google.auth.OAuth2(
   CLIENT_ID,
   CLIENT_SECRET,
   REDIRECT_URI
)

router.get("/url", (req, res) => {
   res.json({ url: getAuthUrl() })
});

router.get("/google", (req, res) => {
   const url = oauth2Client.generateAuthUrl({
      access_type: "offline",
      prompt: "consent",
      scope: [
         "openid",
         "https://www.googleapis.com/auth/userinfo.email",
         "https://www.googleapis.com/auth/gmail.readonly"
      ]
   })

   res.redirect(url)
})

router.get("/callback", async (req, res) => {

   const code = req.query.code as string;
   if (!code) {
      res.status(400).json({ error: "Missing Code" })
   }

   const { tokens } = await oauth2Client.getToken(code)
   oauth2Client.setCredentials(tokens)

   const oauth2 = google.oauth2({ auth: oauth2Client, version: "v2" })
   const me = await oauth2.userinfo.get()
   const email = me.data.email!;

   await saveTokensForUser(
      email,
      tokens.refresh_token!,
      tokens.access_token!,
      tokens.expiry_date as number,
      tokens.scope as string
   );
   res.redirect(`http://localhost:3000?email=${encodeURIComponent(email)}`)

})

router.post("/logout", async (req, res) => {
   const token = req.body.token;

   if (!token) {
      return res.status(400).json({ error: "Missing token" })
   }

   try {
      await revokeToken(token);
      res.json({ message: "Logged out successfully" })
   } catch (err: any) {
      res.status(500).json({ error: err.message })
   }

})

export default router;

