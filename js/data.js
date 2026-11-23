'use strict';
/* Eleven Green — site content. Taken from eleven-green.com (Nov 2026). Prices in AED. */

const EG = {
  orderUrl: 'https://www.eleven-green.com/order',
  email: 'info@eleven-green.com',
  social: {
    instagram: 'https://www.instagram.com/elevengreen.uae',
    tiktok: 'https://www.tiktok.com/@elevengreen.uae',
    facebook: 'https://www.facebook.com/elevengreenburgerbistro',
  },
  legal: {
    privacy: 'https://www.eleven-green.com/legal/privacy',
    terms: 'https://www.eleven-green.com/legal/terms',
  },
};

const MENU = [
  { id: 'specials', name: 'Specials', items: [
    { name: 'Bull Burger', price: 67, desc: 'Wagyu beef, American cheese, Bull sauce, onions, beef bacon jam, Hokkaido milk bun', tag: 'The one that won' },
    { name: 'El Reno', price: 63, desc: 'Double wagyu beef, American cheese, jalapeño, sliced grilled onions, 11G sauce, sesame bun' },
    { name: 'AA Cheeseburger', price: 61, desc: 'Wagyu beef, two slices of American cheese, diced onions, pickles, 11G sauce, sesame bun' },
  ]},
  { id: 'classics', name: 'Classics', items: [
    { name: 'The Unoriginal', price: 61, desc: 'Wagyu beef, American cheese, red onion, pickles, tomato, iceberg, Unoriginal sauce, Hokkaido milk bun' },
    { name: '11G Cheeseburger', price: 45, desc: 'Wagyu beef, American cheese, pickles, onions, 11G sauce, potato bun' },
    { name: 'Royale with Cheese', price: 57, desc: '160 g wagyu beef, American cheese, diced onion, diced pickles, mayonnaise, ketchup, mustard, milk bun' },
  ]},
  { id: 'limited', name: 'Limited', items: [
    { name: '11G Hotdog', price: 49, desc: 'All-natural beef hot dog, ketchup, mustard, pickled pepper, spicy chips, milk roll' },
    { name: '11G Patty Melt', price: 57, desc: 'Double wagyu beef, grilled jalapeño, American & Swiss cheese, caramelized onion, mustard, toast bread' },
    { name: 'Classic Chicken', price: 49, desc: 'All-natural crispy chicken, 11G sauce, pickles, iceberg, potato bun' },
    { name: 'Angry Chicken', price: 51, desc: 'All-natural spicy chicken, tangy sauce, jalapeño, iceberg, potato bun' },
  ]},
  { id: 'sides', name: 'Sides', items: [
    { name: '11G Nuggets', price: 37, desc: '7 pcs crispy nuggets served with tangy sauce' },
    { name: 'Regular Fries', price: 25, desc: 'Skin-on original fries' },
    { name: 'Angry Fries', price: 27, desc: 'Seasoned skin-on spicy fries' },
    { name: 'Coleslaw', price: 25, desc: 'Chopped cabbage & carrots in a creamy dressing' },
    { name: 'Messy Fries', price: 37, desc: '' },
  ]},
  { id: 'extras', name: 'Extras', items: [
    { name: 'Bull Sauce', price: 5, desc: 'Sweet and smokey' },
    { name: '11G Sauce', price: 5, desc: 'Rich and tangy' },
    { name: 'Extra Pickled Jalapeño', price: 3, desc: '' },
  ]},
  { id: 'sweet', name: 'Sweet stuff', items: [
    { name: '11G Cookie', price: 17, desc: 'Our version of a classic' },
  ]},
  { id: 'drinks', name: 'Drinks', items: [
    { name: 'Vanilla Milkshake', price: 35, desc: '' },
    { name: 'Double Chocolate Milkshake', price: 35, desc: '' },
    { name: 'Strawberry Milkshake', price: 35, desc: '' },
    { name: 'Peanut Butter Pretzel Milkshake', price: 35, desc: '' },
    { name: 'Vintage Lemonade', price: 25, desc: '' },
    { name: 'Ginger Ale', price: 23, desc: '' },
    { name: 'San Pellegrino', price: 17, desc: '' },
    { name: 'Aqua Panna', price: 15, desc: '' },
    { name: 'Coke / Coke Zero / Coke Light', price: 15, desc: 'Sleek can' },
    { name: 'Fanta / Sprite', price: 15, desc: 'Sleek can' },
  ]},
];

/* Hours: [Mon, Tue, Wed, Thu, Fri, Sat, Sun], "HH:MM-HH:MM", closing past midnight allowed. */
const BRANCHES = [
  { id: 'umm-suqeim', name: 'Umm Suqeim', city: 'Dubai', tz: 'Asia/Dubai',
    address: 'Al Thanya St, Umm Suqeim 2, Mayan Mall, Store #5, Ground Floor, Dubai',
    hours: ['12:30-00:00', '12:30-00:00', '12:30-00:00', '12:30-00:00', '12:00-01:00', '12:30-01:00', '12:30-00:00'] },
  { id: 'khawaneej', name: 'Khawaneej', city: 'Dubai', tz: 'Asia/Dubai',
    address: 'Academic City Rd, Wadi Al Amardi, Main Caravan, Store #5, Ground Floor, Dubai',
    hours: ['12:30-01:00', '12:30-01:00', '12:30-01:00', '12:30-01:00', '12:30-02:00', '12:30-02:00', '12:30-01:00'] },
  { id: 'khalifa-city', name: 'Khalifa City', city: 'Abu Dhabi', tz: 'Asia/Dubai',
    address: 'Al Mireef St, Khalifa City, Abu Dhabi, United Arab Emirates',
    hours: ['12:30-02:00', '12:30-02:00', '12:30-02:00', '12:30-02:00', '12:30-02:00', '12:30-02:00', '12:30-02:00'] },
  { id: 'al-mamsha', name: 'Al Mamsha', city: 'Sharjah', tz: 'Asia/Dubai',
    address: 'Sharjah city center, second road, Sharjah',
    hours: ['12:30-03:00', '12:30-01:00', '12:30-03:00', '12:30-03:00', '12:30-03:00', '12:30-03:00', '12:30-01:00'] },
  { id: 'the-pearl', name: 'The Pearl', city: 'Doha', tz: 'Asia/Qatar', dineInOnly: true,
    address: 'Alhambra Street, The Pearl, Doha, Qatar',
    hours: ['16:00-01:00', '16:00-01:00', '16:00-01:00', '13:00-01:00', '13:00-01:00', '13:00-01:00', '16:00-01:00'] },
  { id: 'lagoon-stop', name: 'Lagoon Stop', city: 'Ras Al Khaimah', tz: 'Asia/Dubai',
    address: 'Lagoon Food Truck Stop, Awafi Ave, Ras Al Khaimah, United Arab Emirates',
    hours: ['17:00-02:00', '17:00-02:00', '17:00-02:00', '17:00-02:00', '14:00-02:00', '17:00-02:00', '17:00-02:00'] },
];

const KEYS = [
  'Simple is king', 'High quality beef cuts', 'Daily freshly ground beef', 'Cheese that melts',
  'Not fussy or messy', 'Just enough sauce', 'Onions always', 'Super easy to eat',
  'The right size bun', 'Salt & salt only', 'Hand-pressed with care',
];

const VALUES = [
  { t: 'Simple is king', d: 'No gimmicks, no over-the-top toppings, just high-quality ingredients prepared with care. We let the flavours speak for themselves.' },
  { t: 'Freshness is everything', d: 'We don’t have freezers because we don’t need them. Ingredients are sourced daily and we run out of everything by the end of the day. Less waste, more quality.' },
  { t: 'Every detail matters', d: 'Our burgers aren’t smashed. They’re delicately pressed to create the perfect bite.' },
  { t: 'Sustainability is who we are', d: 'Our packaging is eco-friendly because we care about the planet as much as we care about great food.' },
  { t: 'We give back', d: 'Local events, community fundraisers, collaborations: we love being part of something bigger than our restaurant.' },
  { t: 'Creativity drives us', d: 'Sultan creates the burgers, Kinda handles the desserts, and together they craft limited-time specials that push boundaries without losing the core.' },
];

const STORY = [
  { year: '2019', t: 'The beginning', d: 'Before Eleven Green, our story began with a supper club: an underground dining experience that had nothing to do with burgers and everything to do with our love for great food.' },
  { year: '2022', t: 'The Bull', d: 'That passion led us to create The Bull, a burger crafted for Battle of the Burgers, where it won first place in the UAE. At the World Food Championships in Dallas it placed third on the global stage.' },
  { year: '2023', t: 'Eleven Green', d: 'Fuelled by the win, we opened Eleven Green, bringing simple, high-quality burgers to life. A few months later came the drive-thru: fresh ingredients, zero shortcuts.' },
];

const MILESTONES = [
  { date: 'February 2025', t: 'Time Out Dubai Best Burger', d: 'Time Out Dubai’s Highly Commended.' },
  { date: 'March 2024', t: 'Best Burger Bar', d: 'Won Time Out Dubai’s “Best Burger Bar”.' },
  { date: 'December 2023', t: 'Drive-thru launch', d: 'Opened our drive-thru location.' },
  { date: 'May 2023', t: 'First restaurant', d: 'Opened our first restaurant.' },
  { date: 'November 2022', t: 'World Food Championships', d: 'The Bull took third place in Dallas.' },
  { date: 'April 2022', t: 'The Bull is born', d: 'Won Battle of the Burgers, the search for the UAE’s best burger.' },
  { date: 'January 2019', t: 'Where it all began', d: 'Launched our supper club from home.' },
];

const NEWS = [
  { date: 'March 26, 2024', t: 'From Grill to Greatness', outlet: 'Entrepreneur Middle East',
    d: 'Featured as one of the UAE’s rising F&B stories: the journey, what drives us, and why this one means so much.',
    url: 'https://www.eleven-green.com/blog/from-grill-to-greatness' },
  { date: 'March 26, 2024', t: 'Best Burgers in Dubai', outlet: 'The National',
    d: 'A full review of Eleven Green, from the lines outside to the crunch of the Bull Burger.',
    url: 'https://www.eleven-green.com/blog/best-burgers-in-dubai' },
  { date: 'September 4, 2023', t: 'A Burger Worth the Buzz', outlet: 'GQ Middle East',
    d: 'Listed among the UAE’s favourite home-grown burger spots.',
    url: 'https://www.eleven-green.com/blog/a-burger-worth-the-buzz' },
  { date: 'July 3, 2023', t: 'From Supper Club to Sold-Out Burger Joint', outlet: 'The National',
    d: 'An early feature on what has been an incredible start to Eleven Green.',
    url: 'https://www.eleven-green.com/blog/from-supper-club-to-sold-out-burger-joint' },
];
