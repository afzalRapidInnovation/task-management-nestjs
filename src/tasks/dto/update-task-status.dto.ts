import { IsEnum } from "class-validator";
// import { TaskStatus } from "../task.model";
import { TaskStatus } from "../task-status.enum";


export class UpdateTaskStatusDto {
    @IsEnum(TaskStatus)
    status: TaskStatus;
}