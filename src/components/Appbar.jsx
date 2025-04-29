import React, { useEffect } from 'react';
import { useKeycloak } from '../context/KeycloakContext';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import '../index.css';
import logo from '../assets/Screenshot 2025-04-29 210859.png' ;

const AppBarComponent = ({ position, children }) => {
    const { keycloak, authenticated, login, logout } = useKeycloak();

    useEffect(() => {
        if (authenticated && keycloak?.tokenParsed) {
            registerUser();
        }
    }, [authenticated]);

    const registerUser = async () => {
        try {
            const userData = {
                firstName: keycloak.tokenParsed?.given_name,
                lastName: keycloak.tokenParsed?.family_name,
                email: keycloak.tokenParsed?.email,
                birthday: keycloak.tokenParsed?.birthday,
                gender: keycloak.tokenParsed?.gender
            };
            console.log(userData);
            const response = await fetch('http://localhost:9000/api/innovator/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${keycloak.token}`
                },
                body: JSON.stringify(userData)
            });

            if (!response.ok) {
                throw new Error('Registration failed');
            }

            const data = await response.json();
            console.log('Registration successful:', data);
        } catch (error) {
            console.error('Error registering user:', error);
        }
    };

    const handleAuthClick = async () => {
        if (authenticated) {
            logout();
        } else {
            await login();
        }
    };

    return (
        <Box sx={{ flexGrow: 1 }}>
            <AppBar position="static" sx={{ backgroundColor: 'grey.700', borderRadius: '12px', width: '99%', margin: '5px auto', padding: '0 20px' }}>
                <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <img src={logo} alt="Logo" style={{ height: 40, borderRadius: '12px' }} />

                    </Box>
                    <Typography variant="h5" component="div" sx={{ position: 'absolute', left: '50%', transform: 'translateX(-50%)', fontWeight: 'bold' }}>
                        InnoVest
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        {authenticated && (
                            <Button color="inherit" sx={{ border: '1px solid white', borderRadius: '12px' }}>
                                {keycloak.tokenParsed.given_name}
                            </Button>
                        )}
                        <Button
                            color="inherit"
                            sx={{ border: '1px solid white', borderRadius: '12px' }}
                            onClick={handleAuthClick}
                        >
                            {authenticated ? 'Logout' : 'Login'}
                        </Button>
                    </Box>
                </Toolbar>
            </AppBar>
        </Box>
    );
};

export default AppBarComponent;
