import express from "express";
import fetch from "node-fetch";
import cookieParser from "cookie-parser";

const app = express();
app.use(cookieParser());

const CLIENT_ID = "YOUR_CLIENT_ID";
const CLIENT_SECRET = "YOUR_CLIENT_SECRET";
const BOT_TOKEN = "YOUR_BOT_TOKEN";

const GUILD_ID = "YOUR_DISCORD_SERVER_ID";
const STAFF_ROLE_ID = "YOUR_STAFF_ROLE_ID";
const REDIRECT_URI = "http://localhost:3000/auth/callback";

app.get("/auth/discord", (req, res) => {
  const url =
    `https://discord.com/oauth2/authorize` +
    `?client_id=${CLIENT_ID}` +
    `&response_type=code` +
    `&scope=identify guilds guilds.members.read` +
    `&redirect_uri=${encodeURIComponent(REDIRECT_URI)}`;

  res.redirect(url);
});

app.get("/auth/callback", async (req, res) => {
  const code = req.query.code;

  const tokenRes = await fetch("https://discord.com/api/oauth2/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET,
      grant_type: "authorization_code",
      code,
      redirect_uri: REDIRECT_URI
    })
  });

  const tokenData = await tokenRes.json();
  const accessToken = tokenData.access_token;

  const memberRes = await fetch(
    `https://discord.com/api/users/@me/guilds/${GUILD_ID}/member`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    }
  );

  if (!memberRes.ok) {
    return res.redirect("/denied.html");
  }

  const member = await memberRes.json();
  const hasRole = member.roles.includes(STAFF_ROLE_ID);

  if (!hasRole) {
    return res.redirect("/denied.html");
  }

  res.cookie("staff_auth", "true", { httpOnly: true });
  res.redirect("/");
});

app.get("/check-auth", (req, res) => {
  res.json({ authorized: req.cookies.staff_auth === "true" });
});

app.listen(3000, () => console.log("Server running on http://localhost:3000"));
