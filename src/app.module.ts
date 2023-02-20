import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { PlayersModule } from './players/players.module';

@Module({
  imports: [
    ConfigModule.forRoot({ envFilePath: ['.env'] }),
    MongooseModule.forRoot(process.env.DATABASE_URL),
    PlayersModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
