import { ITodoItem } from '../../shared/types/todo-item.interface';

export const INITIAL_TODOS: ITodoItem[] = [
  {
    id: '1',
    text: 'Buy tea',
    description:
      'Ut qui veniam commodo ullamco excepteur cillum. Ex aliqua deserunt laboris pariatur tempor culpa consectetur ad reprehenderit consectetur ad Lorem quis. Lorem esse do anim fugiat elit.',
    status: 'InProgress',
  },
  {
    id: '2',
    text: 'Complete quest',
    description:
      'Ea aute incididunt esse minim adipisicing tempor commodo pariatur reprehenderit deserunt qui labore proident.',
    status: 'InProgress',
  },
  {
    id: '3',
    text: 'Create app',
    description:
      'Proident in fugiat est consectetur incididunt pariatur veniam deserunt proident. Nulla aliqua dolore eiusmod et exercitation ea in exercitation voluptate proident ex ut incididunt. Id pariatur ad veniam amet reprehenderit do officia aute non tempor eiusmod.',
    status: 'InProgress',
  },
  {
    id: '4',
    text: 'Get a cookie',
    description: 'Ex nostrud ea cillum nostrud.',
    status: 'Completed',
  },
];
