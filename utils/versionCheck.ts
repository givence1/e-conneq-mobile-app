import { compareVersions } from "compare-versions";
import Constants from "expo-constants";

const INSTALLED_VERSION =
  Constants.expoConfig?.version || "0.0.0";

export const LATEST_VERSION = "1.1.7";
export const EXPIRY_DATE = new Date("2030-11-26");

function calculateDaysRemaining() {
  const today = new Date();
  const diff = EXPIRY_DATE.getTime() - today.getTime();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

export function getVersionStatus() {
  const now = new Date();
  const expired = now > EXPIRY_DATE;

  const comparison = compareVersions(LATEST_VERSION, INSTALLED_VERSION);
  const updateAvailable = comparison === 1; // newer version exists
  const sameVersion = comparison === 0; // exactly same version

  return {
    installed: INSTALLED_VERSION,
    latest: LATEST_VERSION,
    expired,
    updateAvailable,
    sameVersion,
    daysRemaining: calculateDaysRemaining(),
  };
}
