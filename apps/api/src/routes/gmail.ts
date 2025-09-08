import { Router } from "express";
import { getEmailContent, listInbox } from "../services/gmailService";
import { getValidAccessTokenByEmail } from "src/services/tokenService";

const router = Router()

router.get("/inbox", async (req, res) => {
  try {
    const email = req.query.email as string | undefined;
    const authHeader = req.headers.authorization?.replace("Bearer ", "");
    const accessToken = authHeader ?? (email ? await getValidAccessTokenByEmail(email) : null);

    console.log(email);
    console.log(accessToken);

    if (!accessToken) return res.status(401).json({ error: "No token or email provided" });

    const messages = await listInbox(accessToken);
    res.json(messages);
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});


router.get("/messages/:id", async (req, res) => {
   const token = req.headers.authorization?.replace("Bearer ", "");

   if (!token) {
      return res.status(401).json({ error: "Missing access token" })
   }

   try {
      const message = await getEmailContent(token, req.params.id)
      res.json(message)
   } catch (err: any) {
      res.status(500).json({ error: err.message })
   }
})


export default router;