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
export type Config = typeof defaultConfig;

export function _getUserProperties() {
  const properties = PropertiesService.getUserProperties();

  return Object.keys(defaultConfig).reduce<Partial<Config>>((acc, key) => {
    const value = properties.getProperty(key);
    // FIXME: as
    if (value !== null) acc[key as keyof typeof defaultConfig] = value;
    return acc;
  }, {});
}

export function _getConfig(): Config {
  return Object.assign({}, defaultConfig, _getUserProperties());
}
