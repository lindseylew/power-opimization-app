import { Container, Typography, Box, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const LandingPage = () => {
    const navigate = useNavigate();

    const handleLoginRedirect = () => {
        navigate('/login');
    };

    return (
        <Container maxWidth='sm'>
            <Box
                sx={{
                    textAlign: 'center',
                    padding: 4, 
                    borderRadius: 2,
                    boxShadow: 3,
                    marginTop: 10,
                    backgroundColor: '#f5f5f5'
                }}
                >
                    <Typography variant='h3' component='h1' gutterBottom>
                        Welcome to the Energy Optimization App
                    </Typography>
                    <Typography variant="h6" paragraph>
                        Your solution for optimizing energy costs across energy assets.
                    </Typography>
                    <Button
                        variant='contained'
                        color='primary'
                        onClick={handleLoginRedirect}
                        size='large'
                        sx={{ padding: '10px 20px', fontSize: '16' }}
                    >
                        Go to Login
                    </Button>
                </Box>
        </Container>
    );
};

export default LandingPage;