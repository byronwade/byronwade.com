import localFont from 'next/font/local';

export const customFont = localFont({
  src: [
    {
      path: '../public/fonts/Modelistasignature-ownAV.otf',
      weight: '400',
      style: 'normal',
    },
  ],
  display: 'swap',
}); 