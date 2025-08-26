/* eslint-disable max-classes-per-file */
import {
  IsArray,
  IsNotEmpty,
  IsOptional,
  IsNumber,
  IsEnum,
  IsObject,
  IsString,
  ValidateNested,
} from "class-validator";
import { Transform } from "class-transformer";
import { ObjectKeyDto } from "types/app.dto";
import { ObjectAcl } from "constants/enum";

export class AbortMultipartDto extends ObjectKeyDto {
  @IsNotEmpty()
  @IsString()
  uploadId!: string;
}

export class PreSignDto extends ObjectKeyDto {
  @IsNotEmpty()
  @IsString()
  uploadId!: string;

  @IsNotEmpty()
  @IsNumber()
  totalParts!: number;
}

class MultipartUploadPartDto {
  @IsNotEmpty()
  @IsString()
  ETag!: string;

  @IsNotEmpty()
  @IsNumber()
  PartNumber!: number;
}

export class CompleteMultipartDto extends ObjectKeyDto {
  @IsNotEmpty()
  @IsString()
  uploadId!: string;

  @IsNotEmpty()
  @IsArray()
  @ValidateNested({ each: true })
  parts!: MultipartUploadPartDto[];
}

export class InitiateMultipartDto extends ObjectKeyDto {
  @IsNotEmpty()
  @IsString()
  contentType!: string;

  @IsOptional()
  @IsString()
  contentDisposition?: string;

  @IsOptional()
  @IsEnum(ObjectAcl)
  accessControl?: ObjectAcl;

  @IsOptional()
  @IsObject()
  metadata?: Record<string, string>;
}

export class ListMultipartDto extends ObjectKeyDto {
  @IsNotEmpty()
  @IsString()
  uploadId!: string;

  @IsOptional()
  @IsString()
  partNumberMarker?: string;

  @IsOptional()
  @Transform(({ value }) => +value)
  @IsNumber()
  maxParts?: number;
}
