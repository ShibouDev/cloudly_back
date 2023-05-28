import { ForbiddenException, Injectable, BadRequestException, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { UserEntity } from '../users/entities/user.entity';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
    constructor(
        private usersService: UsersService,
        private jwtService: JwtService,
    ) { }

    async validateUser(email: string, password: string): Promise<any> {
        const user = await this.usersService.findByEmail(email);
        if(!user) throw new BadRequestException()

        if(!(await bcrypt.compare(password, user.password))){
            throw new UnauthorizedException()
        }
        return user;
    }

    async register(dto: CreateUserDto) {
        try {
            const userData = await this.usersService.create(dto);
            return {
                token: this.jwtService.sign({ id: userData.id }),
            };
        } catch (err) {
            console.log(err);
            throw new ForbiddenException('Ошибка при регистрации');
        }
    }

    async login(user: UserEntity) {
        return {
            token: this.jwtService.sign({ id: user.id }),
        };
    }
}