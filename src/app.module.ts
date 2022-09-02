import { Module } from '@nestjs/common';
import { TasksModule } from './tasks/tasks.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Task } from './tasks/task.entity';
import { AuthModule } from './auth/auth.module';
import { User } from './auth/user.entity';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { async } from 'rxjs';
import { configValidationSchema } from './config.schema';
// console.log("check app.module.ts 27th line");

// const STAGE = process.env.STAGE;
console.log(process.env.MODE);

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: [`${process.env.MODE}.env`],
      validationSchema: configValidationSchema,
    }),
    TasksModule,
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        return {
          type: 'postgres',
          host: configService.get('DB_HOST', { infer: true }),
          port: configService.get('DB_PORT', { infer: true }),
          username: configService.get('DB_USERNAME', { infer: true }),
          password: configService.get('DB_PASSWORD', { infer: true }),
          database: configService.get('DB_DATABASE', { infer: true }),
          entities: [Task, User],
          autoLoadEntities: true,
          synchronize: true,
        };
      },
    }),
    // TypeOrmModule.forRoot({
    //   type: 'postgres',
    //   host: 'localhost',
    //   port: 5432,
    //   username: 'postgres',
    //   password: 'kyahaipassword',
    //   database: 'task-management',
    //   entities: [Task, User],
    //   autoLoadEntities: true,
    //   synchronize: true,
    // }),
    AuthModule,
  ],
})
export class AppModule {}
