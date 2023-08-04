import express from 'express';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const port = process.env.PORT || 9090;

app.get('/express_backend', (req, res) => {
  res.send({ express: 'EXPRESS BACKEND IS CONNECTED TO REACT' });
});
app.get('/download-laz', (req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header('Content-Type', 'application/octet-stream');
  res.header('Content-Disposition', 'attachment; filename="indoor.laz"');
  const filePath = "./indoor.laz"; // Or format the path using the `id` rest param
  const fileName = "indoor.laz"; // The default name the browser will use

  res.download(filePath, fileName);
});

app.listen(port, () => console.log(`Listening on port ${port}`));
