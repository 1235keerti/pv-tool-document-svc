import { IsEnum, IsNotEmpty, IsOptional, IsString } from "class-validator";
import { ObjectAcl } from "constants/enum";

export class GetPresignUrlDto {
  @IsNotEmpty()
  @IsString()
  fileName!: string;

  @IsNotEmpty()
  @IsString()
  fileType!: string;

  @IsOptional()
  @IsEnum(ObjectAcl)
  accessControl?: ObjectAcl;

  @IsOptional()
  @IsString()
  metadata?: string;
}
