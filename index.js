import express from "express";
import https from "https";

const app = express();
const port = 3000;
const site = "https://time.com";

app.get("/getTimeStories", (req, res) => {
  https.get(site, (resp) => {
    let page = "";

    resp.on("data", (chunk) => (page += chunk));

    resp.on("end", () => {
      const regex =/<a[^>]+href="(https?:\/\/time\.com\/\d+[^"]*)"[^>]*>(.*?)<\/a>/gi;
      let news = [];
      let match;
      while ((match = regex.exec(page)) && news.length < 6) {
        const url = match[1];
        const title = match[2].replace(/<[^>]+>/g, "").trim(); 
        if (title && title.length > 5) {
          news.push({ title, url });
        }
      }
      res.json(news);
    });
  }).on("error", (err) => {
    res.status(500).json({ error: "Fetch failed", detail: String(err) });
  });
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/getTimeStories`);
});
