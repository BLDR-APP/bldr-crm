import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { SMTPClient } from "https://deno.land/x/denomailer@1.6.0/mod.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface EmailRequest {
  to: string | string[];
  subject: string;
  html: string;
  text?: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const smtpHost = Deno.env.get("SMTP_HOST");
    const smtpPort = Deno.env.get("SMTP_PORT");
    const smtpUser = Deno.env.get("SMTP_USER");
    const smtpPass = Deno.env.get("SMTP_PASS");

    if (!smtpHost || !smtpPort || !smtpUser || !smtpPass) {
      console.error("Missing SMTP configuration:", {
        hasHost: !!smtpHost,
        hasPort: !!smtpPort,
        hasUser: !!smtpUser,
        hasPass: !!smtpPass,
      });
      throw new Error("SMTP configuration is incomplete. Please check your secrets.");
    }

    const { to, subject, html, text }: EmailRequest = await req.json();

    if (!to || !subject || !html) {
      throw new Error("Missing required fields: to, subject, and html are required");
    }

    console.log(`Attempting to send email to: ${Array.isArray(to) ? to.join(", ") : to}`);

    const port = parseInt(smtpPort, 10);
    
    // Create SMTP client with SSL/TLS configuration
    const client = new SMTPClient({
      connection: {
        hostname: smtpHost,
        port: port,
        tls: port === 465, // SSL for port 465
        auth: {
          username: smtpUser,
          password: smtpPass,
        },
      },
    });

    console.log("SMTP client created, attempting to send...");

    // Send email
    const recipients = Array.isArray(to) ? to : [to];
    
    await client.send({
      from: smtpUser,
      to: recipients,
      subject: subject,
      content: text || html.replace(/<[^>]*>/g, ""),
      html: html,
    });

    console.log("Email sent successfully");

    // Close connection
    await client.close();

    return new Response(
      JSON.stringify({
        success: true,
        message: "Email sent successfully",
        recipients: recipients,
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  } catch (error: any) {
    console.error("Error sending email:", error);
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message,
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
