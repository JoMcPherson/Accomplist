import React from 'react';
import Slider from '../Components/Slider';

const slideData = [
  {
    index: 0,
    headline: 'Welcome to Accomplist!',
    subtext: 'blah blah',
    src: 'https://i.imgur.com/YbVXdEF.jpg'
  },
  {
    index: 1,
    headline: 'Get inspired',
    // subtext: 'Take that first step and start adding some goals, and maybe find some you never knew you wanted.',
    src: 'https://i.imgur.com/ECHTbKh.jpg'
  },
  {
    index: 2,
    headline: 'Create a gameplan',
    // subtext: 'Listen to stories, advice, and resources who have been down the road you want to go down',
    src: 'https://i.imgur.com/4txdQ8n.jpg'
  },
  {
    index: 3,
    headline: 'Achieve together',
    // subtext: 'Plan with your peers to crush goals, set up events, and make life long friendships along the way',
    src: 'https://s3-us-west-2.amazonaws.com/s.cdpn.io/225363/typewriter.jpg'
  },
  {
    index: 4,
    headline: 'No task too small',
    // subtext: 'Whether its learning to playing "Chopsticks" or "Flight of the Bumblebee", the important part is you get started!',
    src: 'https://i.imgur.com/IuI0RPr.jpg'
  }
];

const Home = () => {
  return (
    <>
    {/* <h1>just incase</h1> */}
    <div className='d-flex justify-content-center align-items-center vh-100'>
      <Slider slides={slideData} heading="Slider Heading" />
    </div>
    </>
  );
};

export default Home;
