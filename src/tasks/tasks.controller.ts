import {
  Body,
  Controller,
  Delete,
  Get,
  Logger,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from '../auth/get-user.decorator';
import { User } from '../auth/user.entity';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { UpdateTaskStatusDto } from './dto/update-task-status.dto';
// import { Task, TaskStatus } from './task.model';
import { TaskStatus } from './task-status.enum';
import { Task } from './task.entity';
import { TasksService } from './tasks.service';

@Controller('tasks')
@UseGuards(AuthGuard())
export class TasksController {
  // tasksService: TasksService;
  private logger = new Logger('TasksController');
  constructor(
    private tasksService: TasksService,
    private configService: ConfigService,
  ) {
    // this.tasksService = TasksService;
    console.log(this.configService.get('TEST_VALUE', { infer: true }));
    // console.log(process.env.TEST_VALUE);
  }

  @Get()
  getTasks(
    @Query() filterDto: GetTasksFilterDto,
    @GetUser() user: User,
  ): Promise<Task[]> {
    this.logger.verbose(
      `User ${user.username} retrieving all tasks. Filters ${JSON.stringify(
        filterDto,
      )}`,
    );
    return this.tasksService.getTasks(filterDto, user);
  }

  // // helloWrold() {
  // //     // this.taskService.doSomething();
  // // }

  // @Get()
  // // getTasks():Task[] {
  //     getTasks(@Query() filterDto: GetTasksFilterDto):Task[] {
  //     //if we have any filters defined , call tasksService.getTaskWithFilter
  //     //otherwise, just get all tasks from

  //     if(Object.keys(filterDto).length) {
  //         //....
  //         return this.tasksService.getTasksWithFilters(filterDto)
  //     } else {
  //         return this.tasksService.getAllTasks();
  //     }

  //     // return this.tasksService.getAllTasks();
  // }

  @Get('/:id')
  getTaskById(@Param('id') id: string, @GetUser() user: User): Promise<Task> {
    return this.tasksService.getTaskById(id, user);
  }

  // //get task by id
  // @Get('/:id')
  // getTaskById(@Param('id') id:string):Task {
  //     return this.tasksService.getTaskById(id);
  // }

  @Post()
  createTask(
    @Body() createTaskDto: CreateTaskDto,
    @GetUser() user: User,
  ): Promise<Task> {
    this.logger.verbose(
      `User "${user.username}" created a new task. Data : ${JSON.stringify(
        createTaskDto,
      )}`,
    );
    // console.log('Title:', title)
    // console.log('Description',description)
    return this.tasksService.createTask(createTaskDto, user);
  }

  // @Post()
  // //1st approach
  // // createTask(@Body() body) {
  // //     console.log('Body :>',body)
  // // }
  // // createTask(@Body('title') title:string, @Body('description') description:string) : Task {
  //     createTask(@Body() createTaskDto: CreateTaskDto) : Task {
  //     // console.log('Title:', title)
  //     // console.log('Description',description)
  //     return this.tasksService.createTask(createTaskDto)
  // }

  // @Delete('/:id')
  // deleteTask(@Param('id') id:string) : void {
  //     return this.tasksService.deleteTask(id)
  // }
  @Delete('/:id')
  deleteTask(@Param('id') id: string, @GetUser() user: User): Promise<void> {
    return this.tasksService.deleteTask(id, user);
  }

  @Patch('/:id/status')
  updateTaskStatus(
    @Param('id') id: string,
    @Body() updateTaskStatusDto: UpdateTaskStatusDto,
    @GetUser() user: User,
  ): Promise<Task> {
    const { status } = updateTaskStatusDto;
    return this.tasksService.updateTaskStatus(id, status, user);
  }

  // @Patch('/:id/status')
  // // updateTaskStatus(@Param('id') id:string, @Body('status') status: TaskStatus) : Task {
  // updateTaskStatus(@Param('id') id:string, @Body() updateTaskStatusDto: UpdateTaskStatusDto) : Task {
  //     const { status } = updateTaskStatusDto
  //     return this.tasksService.updateTaskStatus(id, status)
  // }
}
