/**
 * Feature flags & third-party integration config, all driven by env vars.
 * Everything is optional and safely disabled when the relevant value is blank.
 */

export const analyticsConfig = {
  gaMeasurementId: process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || "",
  gscVerification: process.env.NEXT_PUBLIC_GSC_VERIFICATION || "",
  clarityProjectId: process.env.NEXT_PUBLIC_CLARITY_PROJECT_ID || "",
} as const;

export const adsConfig = {
  enabled: process.env.NEXT_PUBLIC_ADS_ENABLED === "true",
  adsenseClientId: process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID || "",
} as const;

export const isAnalyticsEnabled =
  !!analyticsConfig.gaMeasurementId || !!analyticsConfig.clarityProjectId;
