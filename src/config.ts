const defaultConfig = {
  absentIcon: ":palm_tree:",
  awayIcon: ":no_entry:",
  secretIcon: ":lock:",
  secretText: "ヒミツだよ",
  focusIcon: ":mute:",
  defaultIcon: ":ghost:",
  freeIcon: "",
  freeText: "",
};
export { defaultConfig };

export function _getConfig(): typeof defaultConfig {
  const properties = PropertiesService.getUserProperties();

  return {
    absentIcon: properties.getProperty("absentIcon") ?? defaultConfig.absentIcon,
    awayIcon: properties.getProperty("awayIcon") ?? defaultConfig.awayIcon,
    secretIcon: properties.getProperty("secretIcon") ?? defaultConfig.secretIcon,
    secretText: properties.getProperty("secretText") ?? defaultConfig.secretText,
    focusIcon: properties.getProperty("focusIcon") ?? defaultConfig.focusIcon,
    defaultIcon: properties.getProperty("defaultIcon") ?? defaultConfig.defaultIcon,
    freeIcon: properties.getProperty("freeIcon") ?? defaultConfig.freeIcon,
    freeText: properties.getProperty("freeText") ?? defaultConfig.freeText,
  };
}
