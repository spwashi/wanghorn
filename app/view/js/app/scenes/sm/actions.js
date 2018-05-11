export const CONTEXT_RESOLVED = 'CONTEXT_RESOLVED';

export const markContextResolved = context => ({
    type: CONTEXT_RESOLVED,
    context
});