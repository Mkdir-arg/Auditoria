export default {
  expo: {
    name: "Auditoria Nutricional",
    slug: "auditoria",
    owner: "mkdir1997s-organization",
    version: "1.0.0",
    orientation: "portrait",
    userInterfaceStyle: "light",
    assetBundlePatterns: ["**/*"],
    ios: {
      supportsTablet: true,
      bundleIdentifier: "com.auditoria.nutricional"
    },
    android: {
      package: "com.auditoria.nutricional",
      versionCode: 1,
      permissions: ["INTERNET", "ACCESS_NETWORK_STATE"],
      adaptiveIcon: {
        backgroundColor: "#ffffff"
      }
    },
    plugins: [],
    extra: {
      eas: {
        projectId: "0938f308-633d-4b12-bea3-7508fefbf5a7"
      }
    }
  }
};