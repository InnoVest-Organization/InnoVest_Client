import React, { createContext, useState, useEffect, useContext, useCallback } from 'react';
import keycloak, { initKeycloak, login, logout, isAuthenticated } from '../services/keycloak';

const KeycloakContext = createContext(null);

export const KeycloakProvider = React.memo(({ children }) => {
    const [authenticated, setAuthenticated] = useState(false);
    const [initialized, setInitialized] = useState(false);

    const initializeKeycloak = useCallback(async () => {
        try {
            const auth = await initKeycloak();
            setAuthenticated(auth);
            setInitialized(true);
        } catch (error) {
            console.error('Keycloak initialization failed:', error);
        }
    }, []);

    useEffect(() => {
        if (!initialized) {
            initializeKeycloak();
        }
    }, [initialized, initializeKeycloak]);

    const value = React.useMemo(() => ({
        authenticated,
        login,
        logout,
        keycloak
    }), [authenticated]);

    return (
        <KeycloakContext.Provider value={value}>
            {children}
        </KeycloakContext.Provider>
    );
});

export const useKeycloak = () => {
    const context = useContext(KeycloakContext);
    if (!context) {
        throw new Error('useKeycloak must be used within a KeycloakProvider');
    }
    return context;
}; 