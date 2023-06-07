import React from 'react'
import { createContext, useState } from 'react'

const UserContext = createContext({ userState: { isAuth: false, token: null,tokenExpiry:null,email:''}, setUserState: () => { } })

export function UserContextProvider({ children }) {
    const [userState, setUserState] = useState({ isAuth: false, token: null,tokenExpiry:null,email:''})

    const context = { userState, setUserState }

    return (
        <UserContext.Provider value={context}>
            {children}
        </UserContext.Provider>)
}

export default UserContext