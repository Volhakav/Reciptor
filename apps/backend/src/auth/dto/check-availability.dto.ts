import { IsEmail, IsString, IsOptional } from 'class-validator';

export class CheckAvailabilityDto {
  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  phone?: string;
}
