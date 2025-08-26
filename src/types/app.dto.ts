import { IsNotEmpty, IsString, IsArray, IsOptional } from "class-validator";

export class ObjectKeyDto {
  @IsNotEmpty()
  @IsString()
  key!: string;
}

export class ZipDocumentsDto {
  @IsArray()
  @IsString({ each: true })
  @IsNotEmpty({ each: true })
  files!: string[];

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  zipPath?: string;
}

export class CheckZipStatusDto {
  @IsString()
  @IsNotEmpty()
  zipPath!: string;
}
