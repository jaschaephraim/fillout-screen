import env from 'env';
import express from 'express';
import errorHandler from 'middleware/errorHandler';
import getFilteredResponses from 'routes/getFilteredResponses';

const app = express();

// GET paginated and filtered responses by formId
app.get('/:formId/filteredResponses', getFilteredResponses);

// Custom error handler to ensure response bodies are JSON
app.use(errorHandler);

app.listen(env.PORT, () =>
  // eslint-disable-next-line no-console
  console.log(`server listening on port :${env.PORT}`)
);
