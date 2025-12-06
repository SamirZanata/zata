-- Criar o novo enum primeiro
CREATE TYPE "InvoiceStatus_new" AS ENUM ('DRAFT', 'PENDING', 'PROCESSING', 'AUTHORIZED', 'ERROR', 'CANCELED');

-- Remover o DEFAULT antes de alterar o tipo
ALTER TABLE "invoices" ALTER COLUMN "status" DROP DEFAULT;

-- Atualizar a coluna para usar o novo enum temporariamente (convertendo valores)
ALTER TABLE "invoices" ALTER COLUMN "status" TYPE "InvoiceStatus_new" 
  USING CASE 
    WHEN "status"::text = 'QUEUED' THEN 'PENDING'::"InvoiceStatus_new"
    WHEN "status"::text = 'REJECTED' THEN 'ERROR'::"InvoiceStatus_new"
    ELSE "status"::text::"InvoiceStatus_new"
  END;

-- Remover o enum antigo
DROP TYPE "InvoiceStatus";

-- Renomear o novo enum para o nome original
ALTER TYPE "InvoiceStatus_new" RENAME TO "InvoiceStatus";

-- Restaurar o DEFAULT após renomear
ALTER TABLE "invoices" ALTER COLUMN "status" SET DEFAULT 'DRAFT'::"InvoiceStatus";

-- Alterar campos do Invoice conforme especificação
-- Renomear issueDate para issuedAt e tornar opcional
ALTER TABLE "invoices" 
  ALTER COLUMN "issueDate" DROP NOT NULL,
  ALTER COLUMN "issueDate" DROP DEFAULT;

ALTER TABLE "invoices" RENAME COLUMN "issueDate" TO "issuedAt";

-- Renomear fiscalProviderId para externalId
ALTER TABLE "invoices" RENAME COLUMN "fiscalProviderId" TO "externalId";

-- Remover rejectionReason (não está na especificação)
ALTER TABLE "invoices" DROP COLUMN IF EXISTS "rejectionReason";
