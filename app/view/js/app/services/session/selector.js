export const selectActiveUser = state => (state.session || {}).activeUser || false;