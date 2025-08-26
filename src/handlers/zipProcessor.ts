import "reflect-metadata";
import { S3Client } from "@aws-sdk/client-s3";
import Container from "typedi";
import { loadFreshEnv } from "config/env";

let documentService: AnyType | null; // used any type because of DocumentService will load env before refresh from aws secrets

const initializeDocumentService = async () => {
  const DocumentService = await import("api/documents/documents.service");
  if (!documentService) {
    const s3Client = new S3Client({});
    Container.set(S3Client, s3Client);
    documentService = Container.get(DocumentService.default);
  }

  return documentService;
};

export interface ProcessZipEvent {
  files: string[];
  zipKey: string;
  folderName: string;
  expirationDays: number;
}

export const processZip = async (event: ProcessZipEvent): Promise<void> => {
  try {
    // Ensure environment is loaded before using it
    await loadFreshEnv();

    console.log("[ZIP] Starting zip processing for:", { event });
    const service = await initializeDocumentService();
    await service.processZipInBackground(
      event.files,
      event.zipKey,
      event.folderName,
      event.expirationDays,
    );
    console.info(`Completed zip processing for: ${event.zipKey}`);
  } catch (error) {
    console.error(`Failed to process zip: ${event.zipKey}`, {
      error: JSON.stringify(error, null, 2),
    });
    throw error;
  }
};
