import 'reflect-metadata';

import { app as appConfig } from './config';
import { server } from './lib/application';
/**
 * Start application
 */
(async function init() {
  const { port } = appConfig;

  await global.sequelize.authenticate();
  // await global.sequelize.sync({ force: true });

  server.listen(port, () => console.log(`Server is running on port ${port}`));
})().catch(e => {
  console.error(e);
  process.exit(1);
});
