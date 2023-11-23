const SESSION_KEY = 'session_key';

export class SessionService {
    public setSession = (accessToken: string) => {
        sessionStorage.setItem(SESSION_KEY, accessToken);
    };
    public deleteSession = () => {
        sessionStorage.removeItem(SESSION_KEY);
    };
}
