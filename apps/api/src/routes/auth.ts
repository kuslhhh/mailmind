import { Router } from "express";
import { getAuthUrl, getTokens, revokeToken } from "../services/authService";
import { google } from "googleapis";
import { CLIENT_ID, CLIENT_SECRET, REDIRECT_URI, SCOPES } from "../utils/setupId";
import type { StringLike } from "bun";

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
      scope: SCOPES
   })

   res.redirect(url)
})

router.get("/callback", async (req, res) => {

   const code = req.query.code as string;
   if (!code) {
      res.status(400).json({ error: "Missing Code" })
   }

   try {
      const tokens = await getTokens(code)
      res.json(tokens)
   } catch (err: any) {
      res.status(500).json({ error: err.message })
   }

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

