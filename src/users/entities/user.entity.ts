import { ApiProperty } from '@nestjs/swagger';
import * as bcrypt from 'bcrypt';
import { FileEntity } from 'src/files/entities/file.entity';
import { BaseEntity, BeforeInsert, Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

@Entity('users')
export class UserEntity extends BaseEntity {
    //Id
    @ApiProperty({ description: 'Primary key as User ID', example: 1 })
    @PrimaryGeneratedColumn()
    id: number;

    //Email
    @ApiProperty({
        description: 'User email address',
        example: 'jhon.doe@gmail.com',
    })
    @Column({
        unique: true,
    })
    email: string;

    //Password
    @ApiProperty({ description: 'Hashed user password' })
    @Column()
    password: string;

    //FullName
    @ApiProperty({ description: 'userName user' })
    @Column()
    userName: string;

    @ApiProperty({ description: 'Files Users' })
    @OneToMany(() => FileEntity, file => file.user)
    files: FileEntity[]


    @ApiProperty({ description: 'When user was created' })
    @CreateDateColumn()
    createdAt: Date;

    @ApiProperty({ description: 'When user was updated' })
    @UpdateDateColumn()
    updatedAt: Date;

    @BeforeInsert()
    async setPassword(password: string) {
        const salt = await bcrypt.genSalt()
        this.password = await bcrypt.hash(password || this.password, salt)
    }
}