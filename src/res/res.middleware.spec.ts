import { ResMiddleware } from './res.middleware';

describe('ResMiddleware', () => {
  it('should be defined', () => {
    expect(new ResMiddleware()).toBeDefined();
  });
});
