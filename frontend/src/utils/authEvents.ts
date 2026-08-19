export const USER_UPDATED_EVENT = 'user-updated';

export const emitUserUpdated = (user: any) => {
    localStorage.setItem('user', JSON.stringify(user));
    window.dispatchEvent(new CustomEvent(USER_UPDATED_EVENT, { detail: user }));
};