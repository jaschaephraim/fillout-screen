import env from 'env';
import express from 'express';
import errorHandler from 'middleware/errorHandler';
import morgan from 'morgan';
import getFilteredResponses from 'routes/getFilteredResponses';

const app = express();

// Basic logging
app.use(morgan('tiny'));

// GET paginated and filtered responses by formId
app.get('/:formId/filteredResponses', getFilteredResponses);

// Custom error handler to ensure response bodies are JSON
app.use(errorHandler);

app.listen(env.PORT, () =>
  // eslint-disable-next-line no-console
  console.log(`server listening on port :${env.PORT}`)
);
