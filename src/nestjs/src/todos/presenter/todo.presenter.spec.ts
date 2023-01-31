import { TodoCollectionPresenter, TodoPresenter } from './todo.presenter';
import { instanceToPlain } from 'class-transformer';
import { PaginationPresenter } from '../../@shared/presenters/pagination.presenter';

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

describe('TodoCollectionPresenter Unit Tests', () => {
  describe('constructor', () => {
    it('should set values', () => {
      const todoProps = {
        id: '22c7bbc8-b798-481e-b9fd-5bacd3c235c6',
        title: 'Supermarket',
        priority: 1,
        description: 'buy fruits',
        is_scratched: false,
        created_at: new Date(),
      };

      const presenter = new TodoCollectionPresenter({
        items: [todoProps],
        current_page: 1,
        per_page: 2,
        last_page: 3,
        total: 4,
      });

      expect(presenter.meta).toBeInstanceOf(PaginationPresenter);
      expect(presenter.meta).toEqual(
        new PaginationPresenter({
          current_page: 1,
          per_page: 2,
          last_page: 3,
          total: 4,
        }),
      );
      expect(presenter.data).toStrictEqual([new TodoPresenter(todoProps)]);
    });
  });

  it('should present data', () => {
    const todoProps = {
      id: '22c7bbc8-b798-481e-b9fd-5bacd3c235c6',
      title: 'Supermarket',
      priority: 1,
      description: 'buy fruits',
      is_scratched: false,
      created_at: new Date(),
    };

    let presenter = new TodoCollectionPresenter({
      items: [todoProps],
      current_page: 1,
      per_page: 2,
      last_page: 3,
      total: 4,
    });

    expect(instanceToPlain(presenter)).toStrictEqual({
      meta: {
        current_page: 1,
        per_page: 2,
        last_page: 3,
        total: 4,
      },
      data: [
        {
          id: todoProps.id,
          title: todoProps.title,
          priority: todoProps.priority,
          description: todoProps.description,
          is_scratched: todoProps.is_scratched,
          created_at: todoProps.created_at.toISOString(),
        },
      ],
    });

    presenter = new TodoCollectionPresenter({
      items: [todoProps],
      current_page: '1' as any,
      per_page: '2' as any,
      last_page: '3' as any,
      total: '4' as any,
    });

    expect(instanceToPlain(presenter)).toStrictEqual({
      meta: {
        current_page: 1,
        per_page: 2,
        last_page: 3,
        total: 4,
      },
      data: [
        {
          id: todoProps.id,
          title: todoProps.title,
          priority: todoProps.priority,
          description: todoProps.description,
          is_scratched: todoProps.is_scratched,
          created_at: todoProps.created_at.toISOString(),
        },
      ],
    });
  });
});
