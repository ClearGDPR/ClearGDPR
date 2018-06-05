import nielsenIMG from '../assets/images/processors/nielsen.svg';
import liverampIMG from '../assets/images/processors/liveramp.svg';
import experianIMG from '../assets/images/processors/experian.svg';

let lorem =
  'Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolorum placeat neque, pariatur ipsa qui facere nobis error iste consectetur quo exercitationem!';

export const processors = [
  {
    name: 'Nielsen',
    img: nielsenIMG,
    consented: 72,
    description: lorem,
    scope: ['Full Name', 'Email', 'Phone Number']
  },
  {
    name: 'Live Ramp',
    img: liverampIMG,
    consented: 64,
    description: lorem,
    scope: ['Email']
  },
  {
    name: 'Experian',
    img: experianIMG,
    consented: 25,
    description: lorem,
    scope: ['Full Name', 'Phone Number']
  }
];

export const users = [
  {
    title: 'Active Users',
    number: 12.676,
    change: 14
  },
  {
    title: 'Erased Users',
    number: 1.164,
    change: -10
  }
];
