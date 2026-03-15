import { z } from 'zod';
import { FloQastClient } from './api-client.js';

interface ToolDef {
  name: string;
  description: string;
  inputSchema: z.ZodType<any>;
  handler: (client: FloQastClient, args: any) => Promise<any>;
}

export const tools: ToolDef[] = [
  // ── Audit Trail ──
  {
    name: 'audit_trail_list',
    description: 'List audit trail logs for API keys',
    inputSchema: z.object({
      start_date: z.string().optional().describe('start date YYYY-MM-DD'),
      end_date: z.string().optional().describe('end date YYYY-MM-DD'),
      user_api_key_id: z.string().optional().describe('API key ID filter'),
      page_size: z.number().optional().describe('items per page'),
      page_cursor: z.string().optional().describe('pagination cursor'),
    }),
    handler: async (client, args) =>
      client.listAuditTrail({
        startDate: args.start_date,
        endDate: args.end_date,
        userApiKeyId: args.user_api_key_id,
        pageSize: args.page_size,
        pageCursor: args.page_cursor,
      }),
  },

  // ── Chart of Accounts ──
  {
    name: 'chart_of_accounts_list',
    description: 'List chart of accounts',
    inputSchema: z.object({
      entity_ids: z.string().optional().describe('comma-separated entity IDs'),
    }),
    handler: async (client, args) =>
      client.listChartOfAccounts({ entityIds: args.entity_ids }),
  },
  {
    name: 'chart_of_accounts_upload',
    description: 'Upload chart of accounts data',
    inputSchema: z.object({
      data: z.string().describe('JSON with entityId and accounts array'),
    }),
    handler: async (client, args) =>
      client.uploadChartOfAccounts(JSON.parse(args.data)),
  },

  // ── Checklists ──
  {
    name: 'checklist_create',
    description: 'Create a new checklist item',
    inputSchema: z.object({
      data: z.string().describe('checklist item JSON'),
    }),
    handler: async (client, args) =>
      client.createChecklist(JSON.parse(args.data)),
  },
  {
    name: 'checklists_list',
    description: 'List checklists for a period',
    inputSchema: z.object({
      month: z.string().describe('month name e.g. January'),
      year: z.number().describe('four-digit year'),
      template_id: z.string().optional().describe('template ID filter'),
      description: z.string().optional().describe('description filter'),
      entity_id: z.string().optional().describe('entity ID filter'),
      page_size: z.number().optional().describe('items per page'),
      page_cursor: z.string().optional().describe('pagination cursor'),
    }),
    handler: async (client, args) =>
      client.listChecklists({
        month: args.month,
        year: args.year,
        templateId: args.template_id,
        description: args.description,
        entityId: args.entity_id,
        pageSize: args.page_size,
        pageCursor: args.page_cursor,
      }),
  },
  {
    name: 'checklist_update',
    description: 'Update a checklist item',
    inputSchema: z.object({
      checklist_id: z.string().describe('checklist ID'),
      data: z.string().describe('update data JSON'),
    }),
    handler: async (client, args) =>
      client.updateChecklist(args.checklist_id, JSON.parse(args.data)),
  },
  {
    name: 'checklist_sign',
    description: 'Update checklist signature status',
    inputSchema: z.object({
      checklist_id: z.string().describe('checklist ID'),
      data: z.string().describe('signature data JSON'),
    }),
    handler: async (client, args) =>
      client.signChecklist(args.checklist_id, JSON.parse(args.data)),
  },

  // ── Checklist Analytics ──
  {
    name: 'checklist_analytics',
    description: 'Get checklist analytics with TLC info',
    inputSchema: z.object({
      month: z.string().optional().describe('month name'),
      year: z.number().optional().describe('four-digit year'),
      modified_before: z.string().optional().describe('date YYYY-MM-DD'),
      modified_since: z.string().optional().describe('date YYYY-MM-DD'),
      entity_ids: z.string().optional().describe('comma-separated entity IDs'),
      workflow_ids: z.string().optional().describe('comma-separated workflow IDs'),
      page_size: z.number().optional().describe('items per page'),
      page_cursor: z.string().optional().describe('pagination cursor'),
    }),
    handler: async (client, args) =>
      client.getChecklistAnalytics({
        month: args.month,
        year: args.year,
        modifiedBefore: args.modified_before,
        modifiedSince: args.modified_since,
        entityIds: args.entity_ids,
        workflowIds: args.workflow_ids,
        pageSize: args.page_size,
        pageCursor: args.page_cursor,
      }),
  },

  // ── Entities ──
  {
    name: 'entities_list',
    description: 'List entities in tenant',
    inputSchema: z.object({
      name: z.string().optional().describe('entity name filter'),
      page_size: z.number().optional().describe('items per page'),
      page_number: z.number().optional().describe('page number'),
    }),
    handler: async (client, args) =>
      client.listEntities({
        name: args.name,
        pageSize: args.page_size,
        pageNumber: args.page_number,
      }),
  },
  {
    name: 'entity_get',
    description: 'Get entity by ID',
    inputSchema: z.object({
      id: z.string().describe('entity ID'),
    }),
    handler: async (client, args) => client.getEntity(args.id),
  },

  // ── Info ──
  {
    name: 'info_me',
    description: 'Get current user and token info',
    inputSchema: z.object({}),
    handler: async (client) => client.getMe(),
  },

  // ── Reconciliations ──
  {
    name: 'reconciliations_list',
    description: 'List reconciliations for a period',
    inputSchema: z.object({
      month: z.string().optional().describe('month name'),
      year: z.number().optional().describe('four-digit year'),
      modified_before: z.string().optional().describe('date YYYY-MM-DD'),
      modified_since: z.string().optional().describe('date YYYY-MM-DD'),
      entity_ids: z.string().optional().describe('comma-separated entity IDs'),
      workflow_ids: z.string().optional().describe('comma-separated workflow IDs'),
      folder_ids: z.string().optional().describe('comma-separated folder IDs'),
      journal_source: z.string().optional().describe('e.g. SUB_LEDGER'),
      internal_ids: z.string().optional().describe('comma-separated GL IDs'),
      auto_rec_type: z.enum(['NONE', 'AUTOREC_MATCHING', 'AUTOREC_AMORTIZATION', 'AUTOREC_ACCRUAL', 'AUTOREC_DEPRECIATION', 'AI_MATCHING']).optional().describe('auto-rec type'),
      page_size: z.number().optional().describe('items per page'),
      page_cursor: z.string().optional().describe('pagination cursor'),
    }),
    handler: async (client, args) =>
      client.listReconciliations({
        month: args.month,
        year: args.year,
        modifiedBefore: args.modified_before,
        modifiedSince: args.modified_since,
        entityIds: args.entity_ids,
        workflowIds: args.workflow_ids,
        folderIds: args.folder_ids,
        journalSource: args.journal_source,
        internalIds: args.internal_ids,
        autoRecType: args.auto_rec_type,
        pageSize: args.page_size,
        pageCursor: args.page_cursor,
      }),
  },
  {
    name: 'reconciliation_signoff',
    description: 'Sign off on a reconciliation',
    inputSchema: z.object({
      reconciliation_id: z.string().describe('reconciliation ID'),
      data: z.string().describe('signature data JSON'),
    }),
    handler: async (client, args) =>
      client.signoffReconciliation(args.reconciliation_id, JSON.parse(args.data)),
  },

  // ── Reconciliation Analytics ──
  {
    name: 'reconciliation_analytics',
    description: 'Get reconciliation analytics with TLC info',
    inputSchema: z.object({
      month: z.string().optional().describe('month name'),
      year: z.number().optional().describe('four-digit year'),
      modified_before: z.string().optional().describe('date YYYY-MM-DD'),
      modified_since: z.string().optional().describe('date YYYY-MM-DD'),
      entity_ids: z.string().optional().describe('comma-separated entity IDs'),
      journal_source: z.string().optional().describe('journal source filter'),
      internal_ids: z.string().optional().describe('comma-separated GL IDs'),
      workflow_ids: z.string().optional().describe('comma-separated workflow IDs'),
      page_size: z.number().optional().describe('items per page'),
      page_cursor: z.string().optional().describe('pagination cursor'),
    }),
    handler: async (client, args) =>
      client.getReconciliationAnalytics({
        month: args.month,
        year: args.year,
        modifiedBefore: args.modified_before,
        modifiedSince: args.modified_since,
        entityIds: args.entity_ids,
        journalSource: args.journal_source,
        internalIds: args.internal_ids,
        workflowIds: args.workflow_ids,
        pageSize: args.page_size,
        pageCursor: args.page_cursor,
      }),
  },

  // ── Transactions ──
  {
    name: 'transactions_upload_subledgers',
    description: 'Upload subledger balances',
    inputSchema: z.object({
      data: z.string().describe('subledger data JSON with reconciliationId'),
    }),
    handler: async (client, args) =>
      client.uploadSubledgers(JSON.parse(args.data)),
  },
  {
    name: 'transactions_upload',
    description: 'Upload GL or subledger transactions',
    inputSchema: z.object({
      data: z.string().describe('transaction data JSON'),
      version: z.enum(['v1', 'v2']).optional().describe('API version'),
    }),
    handler: async (client, args) =>
      client.uploadTransactions(JSON.parse(args.data), args.version),
  },
  {
    name: 'transactions_delete',
    description: 'Delete subledger transactions by recon ID',
    inputSchema: z.object({
      reconciliation_id: z.string().describe('reconciliation ID'),
    }),
    handler: async (client, args) =>
      client.deleteTransactions(args.reconciliation_id),
  },
  {
    name: 'transaction_status',
    description: 'Get transaction event status',
    inputSchema: z.object({
      status_id: z.string().describe('status ID from upload'),
    }),
    handler: async (client, args) =>
      client.getTransactionStatus(args.status_id),
  },

  // ── Trial Balance ──
  {
    name: 'trial_balance_upload',
    description: 'Upload trial balance data',
    inputSchema: z.object({
      data: z.string().describe('JSON array with entityId, period, accounts'),
    }),
    handler: async (client, args) =>
      client.uploadTrialBalance(JSON.parse(args.data)),
  },

  // ── Tags ──
  {
    name: 'tags_list',
    description: 'List tags under a TLC',
    inputSchema: z.object({}),
    handler: async (client) => client.listTags(),
  },
  {
    name: 'tags_attach',
    description: 'Attach or detach tags to reconciliations',
    inputSchema: z.object({
      data: z.string().describe('tag attachment data JSON'),
    }),
    handler: async (client, args) =>
      client.attachTags(JSON.parse(args.data)),
  },

  // ── Users ──
  {
    name: 'users_list',
    description: 'List users with workspace access',
    inputSchema: z.object({
      page_size: z.number().optional().describe('max 500'),
      page_cursor: z.string().optional().describe('pagination cursor'),
    }),
    handler: async (client, args) =>
      client.listUsers({ pageSize: args.page_size, pageCursor: args.page_cursor }),
  },

  // ── User Groups ──
  {
    name: 'user_groups_list',
    description: 'List user groups in tenant',
    inputSchema: z.object({
      page_number: z.number().optional().describe('page number (min 1)'),
      page_size: z.number().optional().describe('max 100, default 25'),
    }),
    handler: async (client, args) =>
      client.listUserGroups({ pageNumber: args.page_number, pageSize: args.page_size }),
  },

  // ── Folders ──
  {
    name: 'folder_get',
    description: 'Get folder metadata by ID',
    inputSchema: z.object({
      folder_id: z.string().describe('folder ID'),
    }),
    handler: async (client, args) => client.getFolder(args.folder_id),
  },
  {
    name: 'folder_lock',
    description: 'Lock or unlock a folder',
    inputSchema: z.object({
      folder_id: z.string().describe('folder ID'),
      unlock: z.boolean().optional().describe('true to unlock'),
    }),
    handler: async (client, args) =>
      client.lockFolder(args.folder_id, args.unlock),
  },

  // ── Controls ──
  {
    name: 'controls_list',
    description: 'List controls with optional filters',
    inputSchema: z.object({
      month: z.string().optional().describe('month name'),
      year: z.string().optional().describe('four-digit year'),
      active: z.string().optional().describe('active filter'),
      program_id: z.string().optional().describe('program ID'),
      control_id: z.string().optional().describe('control ID'),
      include: z.string().optional().describe('additional fields'),
    }),
    handler: async (client, args) =>
      client.listControls({
        month: args.month,
        year: args.year,
        active: args.active,
        programId: args.program_id,
        controlId: args.control_id,
        include: args.include,
      }),
  },
  {
    name: 'control_create',
    description: 'Create up to 20 controls',
    inputSchema: z.object({
      data: z.string().describe('JSON array of control objects (1-20)'),
    }),
    handler: async (client, args) =>
      client.createControls(JSON.parse(args.data)),
  },
  {
    name: 'control_get',
    description: 'Get control by ID',
    inputSchema: z.object({
      id: z.string().describe('control Mongo ID'),
      include: z.string().optional().describe('additional fields'),
    }),
    handler: async (client, args) =>
      client.getControl(args.id, args.include),
  },
  {
    name: 'control_update',
    description: 'Update control by ID',
    inputSchema: z.object({
      id: z.string().describe('control Mongo ID'),
      data: z.string().describe('update data JSON'),
    }),
    handler: async (client, args) =>
      client.updateControl(args.id, JSON.parse(args.data)),
  },
  {
    name: 'control_delete',
    description: 'Delete inactive control by ID',
    inputSchema: z.object({
      id: z.string().describe('control Mongo ID'),
    }),
    handler: async (client, args) => client.deleteControl(args.id),
  },
  {
    name: 'control_sign',
    description: 'Sign off on a control',
    inputSchema: z.object({
      id: z.string().describe('control Mongo ID'),
      signature_id: z.string().describe('signature ID'),
      set_is_signed: z.boolean().describe('true to sign, false to unsign'),
    }),
    handler: async (client, args) =>
      client.signControl(args.id, args.signature_id, args.set_is_signed),
  },
  {
    name: 'control_upload_url',
    description: 'Get signed URL for evidence upload',
    inputSchema: z.object({
      id: z.string().describe('control Mongo ID'),
      period: z.string().describe('period string'),
    }),
    handler: async (client, args) =>
      client.getControlUploadUrl(args.id, args.period),
  },
  {
    name: 'control_add_document',
    description: 'Add document to control after upload',
    inputSchema: z.object({
      id: z.string().describe('control Mongo ID'),
      data: z.string().describe('document metadata JSON'),
    }),
    handler: async (client, args) =>
      client.addControlDocument(args.id, JSON.parse(args.data)),
  },
  {
    name: 'control_lock',
    description: 'Lock or unlock a control period',
    inputSchema: z.object({
      id: z.string().describe('control Mongo ID'),
      period: z.string().describe('period string'),
      data: z.string().describe('lock data JSON'),
    }),
    handler: async (client, args) =>
      client.lockControl(args.id, args.period, JSON.parse(args.data)),
  },
  {
    name: 'control_deactivate',
    description: 'Deactivate control and unlink items',
    inputSchema: z.object({
      id: z.string().describe('control Mongo ID'),
    }),
    handler: async (client, args) => client.deactivateControl(args.id),
  },
  {
    name: 'control_reactivate',
    description: 'Reactivate control and relink tests',
    inputSchema: z.object({
      id: z.string().describe('control Mongo ID'),
    }),
    handler: async (client, args) => client.reactivateControl(args.id),
  },

  // ── Programs ──
  {
    name: 'programs_list',
    description: 'List compliance programs',
    inputSchema: z.object({
      include: z.string().optional().describe('fields: companyId,settings,etc'),
      page_size: z.number().optional().describe('1-50, default 50'),
      page_cursor: z.string().optional().describe('pagination cursor'),
    }),
    handler: async (client, args) =>
      client.listPrograms({
        include: args.include,
        pageSize: args.page_size,
        pageCursor: args.page_cursor,
      }),
  },

  // ── Processes ──
  {
    name: 'processes_list',
    description: 'List processes',
    inputSchema: z.object({}),
    handler: async (client) => client.listProcesses(),
  },

  // ── Guest Users ──
  {
    name: 'guest_users_list',
    description: 'List guest users',
    inputSchema: z.object({}),
    handler: async (client) => client.listGuestUsers(),
  },
];
