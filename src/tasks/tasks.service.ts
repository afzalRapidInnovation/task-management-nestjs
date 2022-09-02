import { Injectable, NotFoundException } from '@nestjs/common';
// import { Task, TaskStatus } from './task.model'
import { TaskStatus } from './task-status.enum';
// import { v4  as uuid } from 'uuid';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { TasksRepository } from './tasks.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { Task } from './task.entity';
import { title } from 'process';
import { User } from 'src/auth/user.entity';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(TasksRepository)
    private tasksRepository: TasksRepository,
  ) {}

  getTasks(filterDto: GetTasksFilterDto, user: User): Promise<Task[]> {
    //
    return this.tasksRepository.getTasks(filterDto, user);
  }
  // private tasks: Task[] = [];

  // getAllTasks(): Task[] {
  //     return this.tasks;
  // }

  // getTasksWithFilters( filterDto: GetTasksFilterDto): Task[] {
  //     const { status, search } = filterDto;

  //     //define a temporary array to hold the result
  //     let tasks = this.getAllTasks();

  //     // do something with status
  //     if(status){
  //         //...
  //         tasks = tasks.filter((task) => task.status === status);
  //     }

  //     //do something with search
  //     if(search) {
  //         //...
  //         tasks = tasks.filter((task) => {
  //             if(task.title.includes(search) || task.description.includes(search)){
  //                 return true;
  //             }
  //              return false;
  //         })
  //     }

  //     //return final result
  //     return tasks;
  // }

  // async createTask(createTaskDto: CreateTaskDto): Promise<Task> {
  createTask(createTaskDto: CreateTaskDto, user: User): Promise<Task> {
    return this.tasksRepository.createTask(createTaskDto, user);
    // const { title, description } = createTaskDto;

    // const task = this.tasksRepository.create({
    //     title,
    //     description,
    //     status: TaskStatus.OPEN
    // });

    // await this.tasksRepository.save(task);
    // return task;
  }

  // // createTask(title: string, description: string): Task {
  //     createTask(createTaskDto: CreateTaskDto): Task {
  //     const {title, description} = createTaskDto

  //     const task: Task = {
  //         id: uuid(),
  //         title,
  //         description,
  //         status: TaskStatus.OPEN,
  //     };
  //     this.tasks.push(task);

  //     return task;
  // }

  async getTaskById(id: string, user: User): Promise<Task> {
    // const found = await this.tasksRepository.findOne(id);
    const found = await this.tasksRepository.findOne({ where: { id, user } });

    if (!found) {
      throw new NotFoundException(`Task with Id "${id}" not found!`);
    }
    return found;
  }

  // getTaskById(id: string): Task {

  //     //try to get task
  //     const found =  this.tasks.find((task) => task.id === id)

  //     //if not found , throw an error (404 not found)
  //     if(!found) {
  //         throw new NotFoundException(`Task with ${id} not found`);
  //     }

  //     //otherwise, return the found task
  //     return found;

  //     // return this.tasks.find((task) => task.id === id)
  // }

  // // deletTaskById(id: string): Task {
  // //     return this.tasks.find((task) => {
  // //         task.id === id
  // //     })
  // // }

  async deleteTask(id: string, user: User): Promise<void> {
    const result = await this.tasksRepository.delete({ id, user });
    if (result.affected === 0) {
      throw new NotFoundException(`Task with id "${id}" not found!`);
    }
    console.log(result);
  }

  // deleteTask(id: string): void {
  //     const found = this.getTaskById(id)
  //     this.tasks = this.tasks.filter((task) => task.id !== id)
  // }

  async updateTaskStatus(
    id: string,
    status: TaskStatus,
    user: User,
  ): Promise<Task> {
    const task = await this.getTaskById(id, user);
    task.status = status;

    await this.tasksRepository.save(task);
    return task;
  }

  // updateTaskStatus(id: string , status: TaskStatus){
  //     const task = this.getTaskById(id)
  //     task.status = status;
  //     return task;
  // }
}
