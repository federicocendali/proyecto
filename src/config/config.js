import dotenv from 'dotenv';
dotenv.config({
  path: './src/.env',
  override: true,
});
export const configVarEntorno = {
  PORT: process.env.PORT || 3001,
};
export const configEntornoClusterMDB = {
  CLUSTER: process.env.MONGODB,
};
