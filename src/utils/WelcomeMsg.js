import { Avatar, Card, CardContent, Stack, Typography } from '@mui/material';
import { styled } from '@mui/system';
import { useEffect, useState } from 'react';

const GradientCard = styled(Card)(({ theme }) => ({
  background: 'linear-gradient(135deg, #6A11CB, #2575FC)', // Updated colors
  color: '#fff',
  borderRadius: '12px',
  boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.2)',
  padding: '5px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  minWidth: '150px'
}));

const WelcomeMessage = () => {
  const [greeting, setGreeting] = useState('Good Morning');
  const [icon, setIcon] = useState(null);

  useEffect(() => {
    const getGreeting = () => {
      const hours = new Date().getHours();
      if (hours >= 5 && hours < 12) {
        setIcon(<img src={'https://cdn-icons-png.flaticon.com/128/2402/2402907.png'} width={35} height={35} />); // Morning - Sun icon
        return 'Good Morning';
      } else if (hours >= 12 && hours < 17) {
        setIcon(<img src={'https://cdn-icons-png.flaticon.com/128/11175/11175472.png'} width={35} height={35} />); // Afternoon - Cloud icon
        return 'Good Afternoon';
      } else if (hours >= 17 && hours < 21) {
        setIcon(<img src={'https://cdn-icons-png.flaticon.com/128/11804/11804281.png'} width={35} height={35} />); // Evening - Cloudy icon
        return 'Good Evening';
      } else {
        setIcon(<img src={'https://cdn-icons-png.flaticon.com/128/4163/4163566.png'} width={35} height={35} />); // Night - Moon icon
        return 'Good Night';
      }
    };

    setGreeting(getGreeting());
  }, []);

  return (
    <GradientCard>
      <CardContent>
        <Stack direction="row" alignItems="center" spacing={1}>
          <Avatar sx={{ bgcolor: '#fff', color: '#FF6B6B', fontSize: 20, width: 50, height: 50 }}>
            {localStorage.getItem('userName')?.charAt(0) || 'U'}
          </Avatar>
          <Stack>
            <Typography variant="h5" sx={{ fontWeight: 600, color: '#ffffff' }}>
              {greeting}, {icon}
            </Typography>
            <Stack direction="row" alignItems="center" spacing={1}>
              <Typography variant="h6" sx={{ fontWeight: 400, color: '#ffffff' }}>
                {localStorage.getItem('userName') || 'User'}
              </Typography>
              {/* Display the icon here */}
            </Stack>
            <Typography variant="body2" sx={{ opacity: 0.8, color: '#ffffff' }}>
              {localStorage.getItem('userType') || 'User'}
            </Typography>
          </Stack>
        </Stack>
      </CardContent>
    </GradientCard>
  );
};

export default WelcomeMessage;
