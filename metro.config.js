const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require("nativewind/metro");
const path = require("path");

// Create the default Metro config
const config = getDefaultConfig(__dirname);

// Add resolver to handle dynamic imports
config.resolver = {
  ...config.resolver,
  sourceExts: [...(config.resolver.sourceExts || []), "mjs", "cjs", "svg"],
  assetExts: config.resolver.assetExts.filter((ext) => ext !== "svg"),
  unstable_enablePackageExports: true,
  unstable_conditionNames: ["require", "import", "node", "default"],
  resolverMainFields: ["react-native", "browser", "main"],
  disableHierarchicalLookup: false,
  nodeModulesPaths: [path.resolve(__dirname, "node_modules")],
};

// Add transformer options to handle dynamic imports
config.transformer = {
  ...config.transformer,
  unstable_allowRequireContext: true,
  getTransformOptions: async () => ({
    transform: {
      experimentalImportSupport: true,
      inlineRequires: true,
    },
  }),
  babelTransformerPath: require.resolve("react-native-svg-transformer"),
};

// Add watchFolders to include node_modules
config.watchFolders = [path.resolve(__dirname, "node_modules")];

// Ensure we're not using a regex that's too restrictive
config.resolver.blockList = false;

// Export the config with NativeWind
module.exports = withNativeWind(config, { input: "./global.css" });
