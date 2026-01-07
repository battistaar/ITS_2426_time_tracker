import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { TimeEntryModule } from './time-entry/time-entry.module';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost/time-tracker'),
    TimeEntryModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
