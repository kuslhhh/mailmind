import { Router } from "express";
import { getEmailContent, listInbox } from "../services/gmailService";

const router = Router()

router.get("/inbox", async (req, res) => {
   const token = req.headers.authorization?.replace("Bearer ", "")
   if (!token) {
      return res.status(400).json({ error: "No token" })
   }

   try {
      const messages = await listInbox(token);
      res.json(messages)
   } catch (err: any) {
      res.status(500).json({ error: err.message })
   }
})

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