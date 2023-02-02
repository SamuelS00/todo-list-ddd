import { Module } from '@nestjs/common';
import { SharedModule } from './@shared/@shared.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TodosModule } from './todos/todos.module';
import { ConfigModule } from './config/config.module';
import { DatabaseModule } from './database/database.module';

@Module({
  controllers: [AppController],
  providers: [AppService],
  imports: [ConfigModule.forRoot(), TodosModule, DatabaseModule, SharedModule],
})
export class AppModule {}
