import os from 'os';

export const cpusInfo = () => {
  const coef = os.arch() === 'arm64' ? 10 : 1000;
  const info = os.cpus().map(cpu => ({
    model: cpu.model,
    clockRate: `${cpu.speed / coef} GHz`,
  }));
  return info;
};
