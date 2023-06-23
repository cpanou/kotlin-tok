interface State {
    userInfo: UserInfo,
    authenticated: boolean,
    groups?: Group[],
    validUntil?: Date,
}

interface StorageAPI {
    read(): State | undefined,

    update(state: State): void,
}

const STATE: string = "state";
const EXPIRES_MINUTES: number = 500 * 60000;

const Storage = {
    update(state: State): void {
        state.validUntil = new Date(new Date().getTime() + EXPIRES_MINUTES);
        localStorage.setItem(STATE, JSON.stringify(state))
    },
    clear(): void {
        localStorage.removeItem(STATE)
    },
    read(): State | undefined {
        let state = localStorage.getItem(STATE);
        if (!!state) {
            let parsed = JSON.parse(state)
            let now = new Date()
            if (parsed.validUntil && new Date(parsed.validUntil) > now)
                return parsed
            else {
                localStorage.removeItem(STATE)
                return undefined
            }
        } else {
            return undefined
        }
    }
}

export default Storage;
