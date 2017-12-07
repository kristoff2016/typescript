import * as _ from 'lodash';
import { Service } from 'typedi';

@Service()
export class TodosService {
  private todos: Todo[] = [
    {
      id: 1,
      title: 'Learn Redux',
      status: 'incomplete'
    },
    {
      id: 2,
      title: 'Learn Mobx',
      status: 'incomplete'
    }
  ];

  async create(title: string, status: 'complete' | 'incomplete') {
    const [ lastTodo ] = this.todos.reverse();
    const newId = lastTodo.id + 1;
    this.todos.push({ id: newId, title, status });
    return this.findOneById(newId);
  }

  async findAll(queryOptions: { limit: number; offset: number } = { limit: 10, offset: 0 }) {
    const todosCopy = this.todos;
    const todos = _.take(todosCopy.slice(queryOptions.offset), queryOptions.limit);
    return Promise.resolve(todos);
  }

  async findOneById(id: number) {
    return Promise.resolve(this.todos.find(t => t.id === id));
  }
}

interface Todo {
  id: number;
  title: string;
  status: 'complete' | 'incomplete';
}
