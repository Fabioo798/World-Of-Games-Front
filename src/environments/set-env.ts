/* eslint-disable @typescript-eslint/no-var-requires */

const setEnv = () => {
  const fs = require('fs/promises');
  const writeFile = fs.writeFile;
  // Configure Angular `environment.ts` file path
  const targetPath = './src/environments/environment.ts';
  // Load node modules

  require('dotenv').config({ path: 'src/environments/.env' });
  // `environment.ts` file structure
  const envConfigFile = `export const environment = {
  secret: '${require('process').env?.['SECRET']}',
  production: true,
    firebase: {
    apiKey: '${require('process').env?.['API_KEY']}',
    authDomain: "world-of-games-33c47.firebaseapp.com",
    projectId: "world-of-games-33c47",
    storageBucket: "world-of-games-33c47.appspot.com",
    messagingSenderId: "515632831705",
    appId: "1:515632831705:web:dee4e2f0a25d5cecf572c8"
  };
};
`;
  writeFile(targetPath, envConfigFile);
};

setEnv();
