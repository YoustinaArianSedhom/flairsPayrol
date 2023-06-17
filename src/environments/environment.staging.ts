import { RecoursesServerConfig, STSServerConfig } from '@core/config/APIs.config';

export const environment = {
  production: true,
  apiUrl: RecoursesServerConfig.STAGING_APIs_URL,
  stsUrl: STSServerConfig.STAGING_URL,
  version: 'Payroll-0.0.1',
  absoluteLogoPath: false,
  disableLogs: false,
  isProd: false
};
