import { createContext, useContext, useEffect, useState } from "react";

export const AuthContext = createContext();

export const Authprovider = ({ children }) => {

    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [username, setusername] = useState(null);
    const [email, setemail] = useState(null);

    useEffect(() => {
        const LoginState = async () => {
            try {
                const res = await fetch("http://localhost:5000/verify-user", {
                    method: 'GET',
                    credentials: 'include',
                })
                if (res.ok) {
                    const data = await res.json();
                    setIsLoggedIn(true);
                    setusername(data.name);
                    setemail(data.email);
                }
            }
            catch (error) {
                console.error("Context Error: ", error)
            }
        }
        LoginState();
    }, [])

    const login = (userdata) => {
        setemail(userdata.email);
        setusername(userdata.name)
        setIsLoggedIn(true);
    }

    const logout = async () => {
        try {
            const res = await fetch("http://localhost:5000/logout", {
                method: "POST",
                credentials: "include",
            });

            if (res.ok) {

                console.log("Logout successful");
            } else {
                console.log("Logout failed");
            }
        } catch (err) {
            console.error("Error during logout:", err);
        } finally {
            setIsLoggedIn(false);
            setusername(null);
        }
    };


    return (
        <AuthContext.Provider value={{ isLoggedIn, username, email, login , logout }}>
            {children}
        </AuthContext.Provider>
    );
};
