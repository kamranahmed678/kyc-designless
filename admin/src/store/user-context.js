import React from 'react'
import { createContext, useState } from 'react'

const UserContext = createContext({ userState: { isAuth: false, token: null, userId: null, isAdmin: false }, setUserState: () => { } })

export function UserContextProvider({ children }) {
    const [userState, setUserState] = useState({ isAuth: false, token: null, userId: null, email: null, firstname: null, lastname: null })

    const context = { userState, setUserState }

    return (
        <UserContext.Provider value={context}>
            {children}
        </UserContext.Provider>)
}

export default UserContext