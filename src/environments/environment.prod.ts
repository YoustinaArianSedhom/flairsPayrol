import { RecoursesServerConfig, STSServerConfig } from "@core/config/APIs.config";

export const environment = {
  production: true,
  apiUrl: RecoursesServerConfig.PRODUCTION_APIs_URL,
  stsUrl: STSServerConfig.PRODUCTION_URL,
  absoluteLogoPath: true,
  disableLogs: true,
  isProd: true
};
