import React from 'react';
import { Box, Typography } from '@mui/material';

const FancyLoader = ({ open = true, text = 'Processing...' }) => {
  if (!open) return null;

  return (
    <Box
      sx={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
        zIndex: 1300,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
      }}
    >
      <div className="coin-wrapper">
        <div className="coin-shine"></div>
        <div className="coin-face">$</div>
      </div>

      <Typography
        variant="subtitle1"
        sx={{ mt: 2, fontWeight: 500, color: '#000' }}
      >
        {text}
      </Typography>

      <style>{`
        .coin-wrapper {
          width: 100px;
          height: 100px;
          border-radius: 50%;
          background: radial-gradient(circle at 30% 30%, #ffffff, #bbbbbb); /* grayscale */
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          animation: rotateCoin 1.4s infinite linear;
          box-shadow:
            inset -2px -2px 5px rgba(255, 255, 255, 0.6),
            inset 2px 2px 6px rgba(0, 0, 0, 0.2),
            0 4px 10px rgba(0, 0, 0, 0.25);
          transform-style: preserve-3d;
        }

        .coin-face {
          font-size: 40px;
          font-weight: bold;
          color: #000; /* black text */
          text-shadow: 0 1px 2px rgba(255,255,255,0.2);
        }

        .coin-shine {
          position: absolute;
          width: 100%;
          height: 100%;
          border-radius: 50%;
          background: linear-gradient(
            120deg,
            rgba(255, 255, 255, 0.4) 0%,
            rgba(255, 255, 255, 0) 60%
          );
          animation: shineEffect 2.5s infinite;
        }

        @keyframes rotateCoin {
          0% { transform: rotateY(0deg); }
          50% { transform: rotateY(180deg); }
          100% { transform: rotateY(360deg); }
        }

        @keyframes shineEffect {
          0% {
            transform: rotate(45deg) translate(-120%, -120%);
            opacity: 0;
          }
          50% {
            transform: rotate(45deg) translate(20%, 20%);
            opacity: 1;
          }
          100% {
            transform: rotate(45deg) translate(120%, 120%);
            opacity: 0;
          }
        }
      `}</style>
    </Box>
  );
};

export default FancyLoader;
