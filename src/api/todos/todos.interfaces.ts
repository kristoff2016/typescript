export interface CreateTodoRequest {
  title: string;
  status: 'complete' | 'incomplete';
}
