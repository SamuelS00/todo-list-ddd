import { TodoPresenter } from './todo.presenter';
import { instanceToPlain } from 'class-transformer';

describe('TodoPresenter Unit Tests', () => {
  describe('constructor', () => {
    it('should set values', () => {
      const created_at = new Date();
      const presenter = new TodoPresenter({
        id: '22c7bbc8-b798-481e-b9fd-5bacd3c235c6',
        title: 'supermarket',
        priority: 3,
        description: 'go to the central market',
        is_scratched: false,
        created_at,
      });

      expect(presenter.id).toBe('22c7bbc8-b798-481e-b9fd-5bacd3c235c6');
      expect(presenter.title).toBe('supermarket');
      expect(presenter.priority).toBe(3);
      expect(presenter.description).toBe('go to the central market');
      expect(presenter.is_scratched).toBe(false);
      expect(presenter.created_at).toBe(created_at);
    });
  });

  it('should presenter data', () => {
    const created_at = new Date();
    const presenter = new TodoPresenter({
      id: '22c7bbc8-b798-481e-b9fd-5bacd3c235c6',
      title: 'supermarket',
      priority: 3,
      description: 'go to the central market',
      is_scratched: false,
      created_at,
    });

    const data = instanceToPlain(presenter);
    expect(data).toStrictEqual({
      id: '22c7bbc8-b798-481e-b9fd-5bacd3c235c6',
      title: 'supermarket',
      priority: 3,
      description: 'go to the central market',
      is_scratched: false,
      created_at: created_at.toISOString(),
    });
  });
});
