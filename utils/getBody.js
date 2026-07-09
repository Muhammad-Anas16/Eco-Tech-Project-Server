import { getAuth } from "./getAuth.js";

const authentication = getAuth();

export const getTrend = () => {
  const params = new URLSearchParams();

  params.append("authentication", authentication);

  return params;
};

export const getTrendData = ({ instance }) => {
  const params = new URLSearchParams();

  params.append("authentication", authentication);
  params.append("host", "80000");
  params.append("instance", instance);
  params.append("startDate", "01/01/2025");
  params.append("endDate", "31/12/2050");
  params.append("startTime", "00:00");
  params.append("endTime", "23:59");

  return params;
};

export const getEnergy = () => {
  const params = new URLSearchParams();

  params.append("authentication", authentication);

  return params;
};

export const getEnergyData = ({ instance, parameter }) => {
  const params = new URLSearchParams();

  params.append("authentication", authentication);
  params.append("host", "80000");
  params.append("instance", instance);
  params.append("parameter", parameter);
  params.append("startDate", "01/01/2025");
  params.append("endDate", "31/12/2050");
  params.append("startTime", "00:00");
  params.append("endTime", "23:59");

  return params;
};

export const getUsers = (id = null) => {
  const params = new URLSearchParams();

  params.append("authentication", authentication);

  if (id !== null) {
    params.append("id", id);
  }

  return params;
};

export const getGroups = (id = null) => {
  const params = new URLSearchParams();

  params.append("authentication", authentication);

  if (id !== null) {
    params.append("id", id);
  }

  return params;
};
