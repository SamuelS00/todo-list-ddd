import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { SharedModule } from './@shared/@shared.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TodosModule } from './todos/todos.module';
import { ConfigModule } from './config/config.module';
import { DatabaseModule } from './database/database.module';
import * as cors from 'cors';

@Module({
  controllers: [AppController],
  providers: [AppService],
  imports: [ConfigModule.forRoot(), TodosModule, DatabaseModule, SharedModule],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(cors({ origin: 'http://localhost:3001' })).forRoutes('*');
  }
}
