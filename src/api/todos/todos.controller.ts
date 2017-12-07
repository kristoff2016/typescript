import { Context } from 'koa';
import {
  Body,
  Controller,
  Ctx,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  Put,
  QueryParam,
  UseAfter,
  UseBefore
} from 'routing-controllers';

import { CreateTodoRequest } from './todos.interfaces';
import { emitCreateTodo, validateCreateTodo } from './todos.middleware';
import { TodosService } from './todos.service';

@Controller('/todos')
export class TodosController {
  constructor(private todosService: TodosService) {}

  @Post()
  @UseBefore(validateCreateTodo)
  @UseAfter(emitCreateTodo)
  @HttpCode(201)
  async create(@Body() body: CreateTodoRequest, @Ctx() ctx: Context) {
    const todo = (ctx.state.todo = await this.todosService.create(body.title, body.status));
    return todo;
  }

  @Get()
  async read(@QueryParam('limit') limit: number = 20, @QueryParam('offset') offset: number = 0) {
    return this.todosService.findAll({ limit, offset });
  }

  @Get('/:id')
  async readOne(@Param('id') id: number) {
    return this.todosService.findOneById(id);
  }

  @Put('/:id')
  update(@Param('id') id: number) {
    return `Update Todo #${id} is of type ${typeof id}`;
  }

  @Delete('/:id')
  delete(@Param('id') id: number) {}
}
