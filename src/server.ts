import {
  AngularNodeAppEngine,
  createNodeRequestHandler,
  isMainModule,
  writeResponseToNodeResponse,
} from '@angular/ssr/node';
import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import products from '../api/routes/products';
import inventories from '../api/routes/inventories';
import stores from '../api/routes/stores';
import sales from '../api/routes/sales';
import units from '../api/routes/units';
// import categories from '../api/routes/categories';
import suppliers from '../api/routes/suppliers';
import requests from '../api/routes/requests';
import purchases from '../api/routes/purchases';
import users from '../api/routes/user';
import expired from '../api/routes/expired';
const serverDistFolder = dirname(fileURLToPath(import.meta.url));
const browserDistFolder = resolve(serverDistFolder, '../browser');
dotenv.config();
const app = express();
const angularApp = new AngularNodeAppEngine();

/**
 * Example Express Rest API endpoints can be defined here.
 * Uncomment and define endpoints as necessary.
 *
 * Example:
 * ```ts
 * app.get('/api/**', (req, res) => {
 *   // Handle API request
 * });
 * ```
 */

/**
 * Serve static files from /browser
 */
app.use(
  express.static(browserDistFolder, {
    maxAge: '1y',
    index: false,
    redirect: false,
  })
);
app.use((req, res, next) => {
  res.append('Access-Control-Allow-Origin', ['*']);
  res.append('Access-Control-Allow-Headers', ['*']);
  res.append('Access-Control-Allow-Methods', [
    'PUT',
    'GET',
    'HEAD',
    'POST',
    'DELETE',
    'OPTIONS',
  ]);

  next();
});
app.use(express.json());
app.use('/api/products', products);
app.use('/api/stores', stores);
app.use('/api/inventories', inventories);
app.use('/api/sales', sales);
app.use('/api/units', units);
// app.use('/api/categories', categories);
app.use('/api/requests', requests);
app.use('/api/purchases', purchases);
app.use('/api/suppliers', suppliers);
app.use('/api/users', users);
app.use('/api/expired', expired);

/**
 * Handle all other requests by rendering the Angular application.
 */
app.use('/**', (req, res, next) => {
  angularApp
    .handle(req)
    .then((response) =>
      response ? writeResponseToNodeResponse(response, res) : next()
    )
    .catch(next);
});

/**
 * Start the server if this module is the main entry point.
 * The server listens on the port defined by the `PORT` environment variable, or defaults to 4000.
 */
if (isMainModule(import.meta.url)) {
  const port = process.env['PORT'] || 4000;

  app.listen(port, () => {
    console.log(`Node Express server listening on http://localhost:${port}`);

    const DATABASE_URL = (process.env['DATABASE_URL'] as string) || '';
    mongoose
      .connect(DATABASE_URL)
      .then(() => {
        console.log(`database ${DATABASE_URL} connected successfully`);
      })
      .catch((err) => {
        console.log(err.message);
      });
  });
}

/**
 * Request handler used by the Angular CLI (for dev-server and during build) or Firebase Cloud Functions.
 */
export const reqHandler = createNodeRequestHandler(app);
