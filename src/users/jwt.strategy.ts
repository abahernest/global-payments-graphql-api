import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { Injectable } from '@nestjs/common';
import { UsersService } from "./users.service";
import { AuthenticationError } from "@nestjs/apollo";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    private readonly userService: UsersService,
    private readonly configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET'),
    });
  }

  async validate(payload: CurrentUser): Promise<CurrentUser> {
    const user = await this.userService.findByEmail(payload.email);
    if (!user){
      throw new AuthenticationError("invalid authentication token")
    }
    return payload;
  }
}