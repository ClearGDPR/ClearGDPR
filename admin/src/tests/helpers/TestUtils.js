/**
 * Flush all pending resolved promise handlers.
 */
export const flushPromises = () => new Promise(resolve => setImmediate(resolve));
