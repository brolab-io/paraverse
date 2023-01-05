import { IsArray, IsNumber, IsOptional, IsString, MinLength } from 'class-validator';

export class CreateSpaceDto {
  @IsString()
  @MinLength(2)
  name: string;

  @IsString()
  @MinLength(4)
  slug: string;

  @IsArray()
  entities: any;

  @IsNumber()
  template: number;
}

export class UpdateSpaceDto {
  @IsOptional()
  @IsString()
  @MinLength(2)
  name?: string;

  @IsOptional()
  @IsString()
  previewImage?: string;

  @IsArray()
  entities: any;
}
