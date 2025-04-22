import React from 'react';
import { useKeycloak } from '../context/KeycloakContext';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import '../index.css'

const AppBarComponent = ({ position, children }) => {
    const { keycloak,authenticated, login, logout } = useKeycloak();
    console.log(keycloak.tokenParsed);
    const handleAuthClick = () => {
        if (authenticated) {
            logout();
        } else {
            login();
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
