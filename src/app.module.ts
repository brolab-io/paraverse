import { DashboardModule } from '@app/dashboard/dashboard.module';
import { SpaceModule } from '@app/spaces/space.module';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AuthModule } from './app/auth/auth.module';
import { UserModule } from './app/users/user.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
    }),
    MongooseModule.forRoot(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }),
    AuthModule,
    UserModule,
    DashboardModule,
    SpaceModule,
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
