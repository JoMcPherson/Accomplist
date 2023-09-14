import React from 'react';
import Slider from '../Components/Slider';

const slideData = [
  {
    index: 0,
    headline: 'Welcome to Accomplist!',
    subtext: 'A website desgined to help you with crossing items off your bucket list!',
    src: 'https://i.imgur.com/Fkofnkx.jpg'
  },
  {
    index: 1,
    headline: 'Get inspired',
    subtext: 'Take that first step and start adding some goals, and maybe find a few you never knew you wanted.',
    src: 'https://i.imgur.com/QSoLMjF.jpg'
  },
  {
    index: 2,
    headline: 'Create a gameplan',
    subtext: 'Listen to stories, advice, and resources from people who went down the road you plan to',
    src: 'https://images.pexels.com/photos/5589432/pexels-photo-5589432.jpeg'
  },
  {
    index: 3,
    headline: 'Achieve together',
    subtext: 'Organize with your peers to crush goals, set up events, and make life long friendships along the way',
    src: 'https://images.pexels.com/photos/1647962/pexels-photo-1647962.jpeg'
  },
  {
    index: 4,
    headline: 'No goal too small',
    subtext: 'Whether its learning to play "Chopsticks" or "Flight of the Bumblebee", the important part is you get started!',
    src: 'https://i.imgur.com/IuI0RPr.jpg'
  }
];

const Home = () => {
  return (
    <div className='d-flex justify-content-center align-items-center vh-100'>
      <Slider slides={slideData} heading="Slider Heading" />
    </div>
  );
};

export default Home;
