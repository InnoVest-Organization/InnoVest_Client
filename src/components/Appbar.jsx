import React from 'react';
import { useKeycloak } from '../context/KeycloakContext';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import '../index.css'

const AppBarComponent = ({ position, children }) => {
    const { keycloak, authenticated, login, logout } = useKeycloak();
    console.log(keycloak.tokenParsed);

    const registerUser = async () => {
        try {
            const userData = {
                firstName: keycloak.tokenParsed?.given_name,
                lastName: keycloak.tokenParsed?.family_name,
                email: keycloak.tokenParsed?.email,
                birthday: keycloak.tokenParsed?.birthday,
                gender: keycloak.tokenParsed?.gender
            };

            const response = await fetch('http://localhost:6000/api/innovator/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
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
            if (keycloak.tokenParsed) {
                await registerUser();
            }
        }
    };

    return (
        <Box sx={{ flexGrow: 1 }}>
            <AppBar position="static" sx={{ backgroundColor: 'grey.700', borderRadius: '12px', width: '99%', margin: '5px auto', padding: '0 20px' }}>
                <Toolbar>
                    <Box sx={{ flexGrow: 1 }} />
                    <Typography variant="h5" component="div" sx={{ textAlign: 'center', fontWeight: 'bold' }}>
                        InnoVest
                    </Typography>
                    <Box sx={{ flexGrow: 1, display: 'flex', justifyContent: 'flex-end' }}>
                        <Button 
                            color="inherit" 
                            sx={{ border: '1px solid white' }}
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
