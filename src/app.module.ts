import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PlayersModule } from './players/players.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRoot(
      `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@${process.env.DB_CLUSTER}.exhza.mongodb.net/?retryWrites=true&w=majority&appName=${process.env.DB_NAME}`,
    ),
    PlayersModule,
  ],

  controllers: [],
  providers: [],
})
export class AppModule {}
