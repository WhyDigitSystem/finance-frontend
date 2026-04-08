// import React from 'react';
// import { Box, Typography } from '@mui/material';
// import Efit from '../assets/images/Efit.png'
// const FancyLoader = ({ open = true, text = 'Processing...' }) => {
//   if (!open) return null;

//   return (
//     <Box
//       sx={{
//         position: 'fixed',
//         top: 0,
//         left: 0,
//         width: '100vw',
//         height: '100vh',
//         backgroundColor: 'rgba(255, 255, 255, 0.8)',
//         zIndex: 1300,
//         display: 'flex',
//         alignItems: 'center',
//         justifyContent: 'center',
//         flexDirection: 'column',
//       }}
//     >
//       <div className="coin-wrapper">
//         <div className="coin-shine"></div>
//         <div className="coin-face">$</div>
//       </div>
      
      

//       <Typography
//         variant="subtitle1"
//         sx={{ mt: 2, fontWeight: 500, color: '#000' }}
//       >
//         {text}
//       </Typography>

//       <style>{`
//         .coin-wrapper {
//           width: 100px;
//           height: 100px;
//           border-radius: 50%;
//           background: radial-gradient(circle at 30% 30%, #ffffff, #bbbbbb); /* grayscale */
//           display: flex;
//           align-items: center;
//           justify-content: center;
//           position: relative;
//           animation: rotateCoin 1.4s infinite linear;
//           box-shadow:
//             inset -2px -2px 5px rgba(255, 255, 255, 0.6),
//             inset 2px 2px 6px rgba(0, 0, 0, 0.2),
//             0 4px 10px rgba(0, 0, 0, 0.25);
//           transform-style: preserve-3d;
//         }

//         .coin-face {
//           font-size: 40px;
//           font-weight: bold;
//           color: #000; /* black text */
//           text-shadow: 0 1px 2px rgba(255,255,255,0.2);
//         }

//         .coin-shine {
//           position: absolute;
//           width: 100%;
//           height: 100%;
//           border-radius: 50%;
//           background: linear-gradient(
//             120deg,
//             rgba(255, 255, 255, 0.4) 0%,
//             rgba(255, 255, 255, 0) 60%
//           );
//           animation: shineEffect 2.5s infinite;
//         }

//         @keyframes rotateCoin {
//           0% { transform: rotateY(0deg); }
//           50% { transform: rotateY(180deg); }
//           100% { transform: rotateY(360deg); }
//         }

//         @keyframes shineEffect {
//           0% {
//             transform: rotate(45deg) translate(-120%, -120%);
//             opacity: 0;
//           }
//           50% {
//             transform: rotate(45deg) translate(20%, 20%);
//             opacity: 1;
//           }
//           100% {
//             transform: rotate(45deg) translate(120%, 120%);
//             opacity: 0;
//           }
//         }
//       `}</style>
//     </Box>
//   );
// };

// export default FancyLoader;


import React from 'react';
import { Box, Typography } from '@mui/material';
import Efit from '../assets/images/BIN_BEE.png';

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
        // background: 'linear-gradient(135deg, #0f172a, #1e293b)',
       backgroundColor: 'rgba(255, 255, 255, 0.8)',

        zIndex: 1300,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
      }}
    >
     
      {/* <div className="glow-ring"></div> */}

     
      <div className="coin-wrapper">
        <img src={Efit} alt="logo" className="coin-face" />
        <div className="coin-shine"></div>
      </div>

      <Typography
        variant="subtitle1"
        sx={{
          mt: 3,
          fontWeight: 500,
          // color: '#e2e8f0',
          color: '#000',
          letterSpacing: '1px',
        }}
      >
        {text}
      </Typography>

      <style>{`
        .coin-wrapper {
          width: 120px;
          height: 120px;
          border-radius: 50%;
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          
          // background: linear-gradient(145deg, #1e293b, #0f172a);
          
          border: 2px solid rgba(255,255,255,0.1);
          animation: float 2.5s ease-in-out infinite,
                     rotateCoin 3s infinite linear;
          
          box-shadow:
            0 0 20px rgba(59,130,246,0.4),
            inset 0 0 15px rgba(255,255,255,0.05);
        }

        .coin-face {
          width: 60%;
          height: 60%;
          object-fit: contain;
          z-index: 2;
          filter: drop-shadow(0 0 6px rgba(255,255,255,0.4));
        }

        .coin-shine {
          position: absolute;
          width: 140%;
          height: 140%;
          border-radius: 50%;
          background: linear-gradient(
            120deg,
            rgba(255,255,255,0.5) 0%,
            rgba(255,255,255,0) 60%
          );
          animation: shineEffect 2.5s infinite;
        }

        /* Outer Glow Ring */
        .glow-ring {
          position: absolute;
          width: 140px;
          height: 140px;
          border-radius: 50%;
          border: 3px solid transparent;
          background: linear-gradient(90deg, #3b82f6, #06b6d4, #3b82f6) border-box;
          -webkit-mask:
            linear-gradient(#fff 0 0) padding-box,
            linear-gradient(#fff 0 0);
          -webkit-mask-composite: xor;
          mask-composite: exclude;

          animation: rotateRing 2s linear infinite;
          filter: blur(2px);
        }

        @keyframes rotateCoin {
          0% { transform: rotateY(0deg); }
          100% { transform: rotateY(360deg); }
        }

        @keyframes rotateRing {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        @keyframes shineEffect {
          0% {
            transform: rotate(45deg) translate(-150%, -150%);
            opacity: 0;
          }
          50% {
            transform: rotate(45deg) translate(20%, 20%);
            opacity: 1;
          }
          100% {
            transform: rotate(45deg) translate(150%, 150%);
            opacity: 0;
          }
        }

        @keyframes float {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-10px);
          }
        }
      `}</style>
    </Box>
  );
};

export default FancyLoader;