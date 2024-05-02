import React, { useState } from 'react';
import { Box, TextField, Button, Typography, Paper } from '@mui/material';

function Chat() {
  const [inputValue, setInputValue] = useState('');

  const handleInputChange = (event) => {
    setInputValue(event.target.value);
  };

  const handleSubmit = () => {
    alert(`You said: ${inputValue}`);
    setInputValue(''); // Clear the input after submission
  };

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', padding: 3 }}>
      <Paper elevation={3} sx={{ width: '100%', maxWidth: 500, padding: 2 }}>
        <Typography variant="h4" component="h1" gutterBottom sx={{ textAlign: 'center' }}>
          AI Bro
        </Typography>
        <Box sx={{ marginY: 2 }}>
          <Typography variant="body1">Hello chatbot</Typography>
          <Typography variant="body1" sx={{ marginY: 2 }}>
            Hello User! How can I help you today?
          </Typography>
        </Box>
        <Box
          component="form"
          sx={{
            display: 'flex',
            alignItems: 'center',
            '& .MuiTextField-root': { marginRight: 1 },
          }}
          noValidate
          autoComplete="off"
        >
          <TextField
            fullWidth
            label="Your message"
            variant="outlined"
            value={inputValue}
            onChange={handleInputChange}
          />
          <Button variant="contained" onClick={handleSubmit}>Send</Button>
        </Box>
      </Paper>
    </Box>
  );
}

export default Chat;
