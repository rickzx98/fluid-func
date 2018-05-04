export const logError = (createLog, chain, error) => {
    return createLog(chain, error.message, error);
};