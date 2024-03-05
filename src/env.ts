import { config } from 'dotenv';
import { envsafe, port, str } from 'envsafe';

// Load env variables from .env
config();

// Validate and type env variables
const env = envsafe({
  PORT: port(),
  FILLOUT_API_KEY: str(),
});

export default env;
