// TODO: Use https://github.com/marak/Faker.js/

import nielsenIMG from 'assets/images/processors/nielsen.svg';
import liverampIMG from 'assets/images/processors/liveramp.svg';
import experianIMG from 'assets/images/processors/experian.svg';

let lorem =
  'Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolorum placeat neque, pariatur ipsa qui facere nobis error iste consectetur quo exercitationem!';

export const processors = [
  {
    name: 'Nielsen',
    logoUrl: nielsenIMG,
    consented: 72,
    description: lorem,
    scopes: ['Full Name', 'Email', 'Phone Number']
  },
  {
    name: 'Live Ramp',
    logoUrl: liverampIMG,
    consented: 64,
    description: lorem,
    scopes: ['Email']
  },
  {
    name: 'Experian',
    logoUrl: experianIMG,
    consented: 25,
    description: lorem,
    scopes: ['Full Name', 'Phone Number']
  }
];

export const getAll = () => processors;
