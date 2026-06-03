import config from './config.json' with { type: 'json' };

export function greet(name) {
  return `${config.greeting}, ${name}!`;
}

console.log(greet('agent learner'));
