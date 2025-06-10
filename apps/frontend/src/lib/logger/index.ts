import { logger } from "./base";

export const initLogger = (prefix?: string) => {
    return logger.child({ module: prefix });
}