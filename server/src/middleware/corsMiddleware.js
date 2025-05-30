import cors from 'cors';
import config from '../config/config.js';

const corsOptions = {
  origin: config.clientUrl,
  credentials: true
};

export default cors(corsOptions);
