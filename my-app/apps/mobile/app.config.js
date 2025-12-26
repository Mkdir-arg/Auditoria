export default {
  expo: {
    name: "Auditoria Nutricional",
    slug: "auditoria-android-test",
    owner: "pablocao",
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
        projectId: "fb537f63-3779-4b02-b433-bd8fc79047f4"
      }
    }
  }
};
