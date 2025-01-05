
export const configuration = () => ({
    NODE_ENV: process.env.NODE_ENV,
    MONGO_URL: process.env.MONGO_URL,
    MONGO_HOST: process.env.MONGO_HOST,
    MONGO_PORT: process.env.MONGO_PORT,
    MONGO_USER: process.env.MONGO_USER,
    MONGO_PWD: process.env.MONGO_PWD,    
    MONGO_VIEW_DB: process.env.MONGO_VIEW_DB,
    MONGO_AGGR_DB: process.env.MONGO_AGGR_DB,
    
  });