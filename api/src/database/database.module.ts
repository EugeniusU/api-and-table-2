import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { TypeOrmModule } from '@nestjs/typeorm'

@Module({
    imports: [TypeOrmModule.forRootAsync({
        imports: [ConfigModule],
        useFactory: () => ({
            type: "postgres",
            host: "127.0.0.1",
            port: 5432,
            username: process.env.DATABASE_USER,
            password: process.env.DATABASE_PASSWORD,
            database: "application",
            entities: ['dist/entities/*.entity{ .ts,.js}'],
            synchronize: true,
            autoLoadEntities: true
        }),
        inject: [ConfigService]
    })]
})

export class DatabaseModule {}