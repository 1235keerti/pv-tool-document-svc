import { getOsEnvOptional } from "lib/env/util";
import { config } from "dotenv";
import { loadAwsSecrets } from "./env.aws-secret";
import { EnvConfig } from "./env.interfaces";

config();

const secretName = getOsEnvOptional("AWS_SECRET_NAME");

class EnvironmentManager {
  private static instance: EnvironmentManager | null = null;

  private envConfig: EnvConfig | null = null;

  private loadingPromise: Promise<EnvConfig> | null = null;

  private isLoaded = false;

  public static getInstance(): EnvironmentManager {
    if (!EnvironmentManager.instance) {
      EnvironmentManager.instance = new EnvironmentManager();
    }

    return EnvironmentManager.instance;
  }

  private async loadEnvironment(): Promise<EnvConfig> {
    if (secretName) {
      await loadAwsSecrets(secretName);
    }

    // Lazy import here because of env file direct load with validations
    const { getEnvFile } = await import("./env.file");

    return getEnvFile();
  }

  public async initialize(): Promise<EnvConfig> {
    this.loadingPromise = this.loadEnvironment();

    try {
      this.envConfig = await this.loadingPromise;
      this.isLoaded = true;

      return this.envConfig;
    } catch (error) {
      this.loadingPromise = null;
      throw error;
    }
  }

  public getConfig(): EnvConfig {
    if (!this.isLoaded || !this.envConfig) {
      throw new Error(
        "Environment configuration not loaded. Call loadFreshEnv() or initialize() first.",
      );
    }

    return this.envConfig;
  }

  public isEnvironmentLoaded(): boolean {
    return this.isLoaded;
  }
}

const envManager = EnvironmentManager.getInstance();

// Create a proxy that provides direct access to config properties
const envProxy = new Proxy({} as EnvConfig, {
  get(_target, prop: keyof EnvConfig) {
    const conf = envManager.getConfig();

    return conf[prop];
  },
});

// Export the proxy as default for backward compatibility
export default envProxy;

// Export async functions for explicit async handling
export async function loadFreshEnv(): Promise<EnvConfig> {
  return envManager.initialize();
}

export async function getEnvConfig(): Promise<EnvConfig> {
  return envManager.getConfig();
}

// Export a function to check if env is loaded
export function isEnvLoaded(): boolean {
  return envManager.isEnvironmentLoaded();
}
