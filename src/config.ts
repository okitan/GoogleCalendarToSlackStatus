const defaultConfig = {
  absentIcon: ":palm_tree:",
  awayIcon: ":no_entry:",
  secretIcon: ":lock:",
  secretText: "ヒミツだよ",
  focusIcon: ":mute:",
  scheduleIcon: ":calendar:",
  freeIcon: "",
  freeText: "",
};
export { defaultConfig };
export type Config = typeof defaultConfig;

export function _getUserProperties() {
  const properties = PropertiesService.getUserProperties();

  const keys = Object.keys(defaultConfig) as (keyof Config)[];
  return keys.reduce<Partial<Config>>((acc, key) => {
    const value = properties.getProperty(key);

    if (value !== null) acc[key] = value;
    return acc;
  }, {});
}

export function _getConfig(): Config {
  return Object.assign({}, defaultConfig, _getUserProperties());
}
