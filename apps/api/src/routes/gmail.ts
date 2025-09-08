import { Router } from "express";
import { getEmailContent, listInbox } from "../services/gmailService";
import { getValidAccessTokenByEmail } from "src/services/tokenService";

const router = Router()

router.get("/inbox", async (req, res) => {
  try {
    const email = req.query.email as string | undefined;
    const authHeader = req.headers.authorization?.replace("Bearer ", "");

    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({ 
        success: false,
        error: "Invalid email format" 
      });
    }

    let accessToken: string | null = null;

    if (authHeader) {
      accessToken = authHeader;
    } else if (email) {
      try {
        accessToken = await getValidAccessTokenByEmail(email);
      } catch (tokenError) {
        return res.status(401).json({ 
          success: false,
          error: `Authentication failed: ${tokenError instanceof Error ? tokenError.message : 'Unknown error'}`,
          errorType: 'TOKEN_ERROR'
        });
      }
    }

    if (!accessToken) {
      return res.status(401).json({ 
        success: false,
        error: "No token or email provided. Please provide either an Authorization header or email parameter.",
        errorType: 'MISSING_AUTH'
      });
    }

    const messages = await listInbox(accessToken);
    
    res.json({
      success: true,
      data: messages,
      metadata: {
        totalMessages: messages.length,
        query: "is:unread",
        email: email || "from_token"
      }
    });
  } catch (err: any) {
    let errorType = 'UNKNOWN_ERROR';
    let statusCode = 500;
    
    if (err.message?.includes('invalid_grant') || err.message?.includes('invalid_token')) {
      errorType = 'TOKEN_INVALID';
      statusCode = 401;
    } else if (err.message?.includes('insufficient permissions') || err.message?.includes('scope')) {
      errorType = 'INSUFFICIENT_PERMISSIONS';
      statusCode = 403;
    } else if (err.message?.includes('quota') || err.message?.includes('rate')) {
      errorType = 'RATE_LIMITED';
      statusCode = 429;
    }
    
    res.status(statusCode).json({ 
      success: false,
      error: err.message,
      errorType,
      timestamp: new Date().toISOString()
    });
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