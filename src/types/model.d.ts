import 'next-auth';


declare module 'next-auth' {
    interface User {
        _id: string;
        isVerified: boolean;
        isAcceptingMessages: boolean;
        username?: string;
    }
    interface Session {
        user : {
            _id: string;
            isVerified: boolean;
            isAcceptingMessages: boolean;
            username?: string;
        }& DefaultSession['user'];
        // taken default session because we want to keep the default user object
    }
}

declare module 'next-auth/jwt' {
    interface JWT {
        _id: string;
        isVerified: boolean;
        isAcceptingMessages: boolean;
        username?: string;
    }
}
// we can also declare in this way .