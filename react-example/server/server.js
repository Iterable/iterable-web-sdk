/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable consistent-return */
/* eslint-disable camelcase */
/* eslint-disable @typescript-eslint/no-var-requires */
const express = require('express');
const { exec } = require('child_process');
const cors = require('cors');

const app = express();
const port = 3000;

app.use(cors({ origin: '*' }));
app.use(express.json());

app.post('/generate', (req, res) => {
  const { jwt_secret, userId, email, exp_minutes } = req.body;
  const emailIdentifier = email !== undefined ? email : '';
  const userIdentifier = userId !== undefined ? userId : '';
  const currentTimeInSeconds = Math.floor(new Date().getTime() / 1000);
  const expirationTimeInSeconds = currentTimeInSeconds + exp_minutes * 60;

  const command = `python3 server/generate.py "${jwt_secret}" "${userIdentifier}" "${emailIdentifier}" "${currentTimeInSeconds}" "${expirationTimeInSeconds}"`;
  exec(command, (error, stdout, stderr) => {
    if (error) {
      return res.status(500).json({ message: `Error: ${stderr}` });
    }
    res.json({ token: stdout });
  });
});

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
