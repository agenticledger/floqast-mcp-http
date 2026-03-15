const REGIONS: Record<string, string> = {
  us: 'https://fq-api.floqast.app',
  eu: 'https://fq-api.eu.floqast.app',
  au: 'https://fq-api.au.floqast.app',
};

export class FloQastClient {
  private apiKey: string;
  private baseUrl: string;

  constructor(apiKey: string, region: string = 'us') {
    this.apiKey = apiKey;
    this.baseUrl = REGIONS[region] || REGIONS.us;
  }

  private async request<T>(
    endpoint: string,
    options: {
      method?: string;
      body?: any;
      params?: Record<string, string | number | boolean | undefined>;
    } = {}
  ): Promise<T> {
    const { method = 'GET', body, params } = options;
    const url = new URL(`${this.baseUrl}${endpoint}`);

    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          url.searchParams.append(key, String(value));
        }
      });
    }

    const headers: Record<string, string> = {
      'x-api-key': this.apiKey,
      'Accept': 'application/json',
    };

    if (body) {
      headers['Content-Type'] = 'application/json';
    }

    const response = await fetch(url.toString(), {
      method,
      headers,
      ...(body ? { body: JSON.stringify(body) } : {}),
    });

    if (response.status === 204) return {} as T;

    if (response.status === 303) {
      const location = response.headers.get('location');
      return { redirect: true, location } as T;
    }

    if (!response.ok) {
      const text = await response.text();
      throw new Error(`API Error ${response.status}: ${text}`);
    }

    return response.json();
  }

  // ── Audit Trail ──

  async listAuditTrail(opts?: {
    startDate?: string;
    endDate?: string;
    userApiKeyId?: string;
    pageSize?: number;
    pageCursor?: string;
  }) {
    return this.request<any>('/api/v1/audit-trail', {
      params: {
        'filter[startDate]': opts?.startDate,
        'filter[endDate]': opts?.endDate,
        'filter[userApiKey._id]': opts?.userApiKeyId,
        'page[size]': opts?.pageSize,
        'page[cursor]': opts?.pageCursor,
      },
    });
  }

  // ── Chart of Accounts ──

  async listChartOfAccounts(opts?: { entityIds?: string }) {
    return this.request<any>('/api/v1/chart-of-accounts', {
      params: { 'filter[entityIds]': opts?.entityIds },
    });
  }

  async uploadChartOfAccounts(data: any) {
    return this.request<any>('/api/v1/chart-of-accounts/upload', {
      method: 'PUT',
      body: data,
    });
  }

  // ── Checklists ──

  async createChecklist(data: any) {
    return this.request<any>('/api/v1/checklists', {
      method: 'POST',
      body: data,
    });
  }

  async listChecklists(opts: {
    month: string;
    year: number;
    templateId?: string;
    description?: string;
    entityId?: string;
    pageSize?: number;
    pageCursor?: string;
  }) {
    return this.request<any>('/api/v1/checklists', {
      params: {
        'filter[month]': opts.month,
        'filter[year]': opts.year,
        'filter[templateId]': opts.templateId,
        'filter[description]': opts.description,
        'filter[entityId]': opts.entityId,
        'page[size]': opts.pageSize,
        'page[cursor]': opts.pageCursor,
      },
    });
  }

  async updateChecklist(checklistId: string, data: any) {
    return this.request<any>(`/api/v1/checklists/${encodeURIComponent(checklistId)}`, {
      method: 'PUT',
      body: data,
    });
  }

  async signChecklist(checklistId: string, data: any) {
    return this.request<any>(`/api/v1/checklists/${encodeURIComponent(checklistId)}/sign`, {
      method: 'POST',
      body: data,
    });
  }

  // ── Checklist Analytics ──

  async getChecklistAnalytics(opts?: {
    month?: string;
    year?: number;
    modifiedBefore?: string;
    modifiedSince?: string;
    entityIds?: string;
    workflowIds?: string;
    pageSize?: number;
    pageCursor?: string;
  }) {
    return this.request<any>('/api/v1/analytics/checklists', {
      params: {
        'filter[month]': opts?.month,
        'filter[year]': opts?.year,
        'filter[modifiedBefore]': opts?.modifiedBefore,
        'filter[modifiedSince]': opts?.modifiedSince,
        'filter[entityIds]': opts?.entityIds,
        'filter[workflowIds]': opts?.workflowIds,
        'page[size]': opts?.pageSize,
        'page[cursor]': opts?.pageCursor,
      },
    });
  }

  // ── Entities ──

  async listEntities(opts?: {
    name?: string;
    pageSize?: number;
    pageNumber?: number;
  }) {
    return this.request<any>('/api/v1/entities', {
      params: {
        'filter[name]': opts?.name,
        'page[size]': opts?.pageSize,
        'page[number]': opts?.pageNumber,
      },
    });
  }

  async getEntity(id: string) {
    return this.request<any>(`/api/v1/entities/${encodeURIComponent(id)}`);
  }

  // ── Info ──

  async getMe() {
    return this.request<any>('/api/v1/me');
  }

  // ── Reconciliations ──

  async listReconciliations(opts?: {
    month?: string;
    year?: number;
    modifiedBefore?: string;
    modifiedSince?: string;
    entityIds?: string;
    workflowIds?: string;
    folderIds?: string;
    journalSource?: string;
    internalIds?: string;
    autoRecType?: string;
    pageSize?: number;
    pageCursor?: string;
  }) {
    return this.request<any>('/api/v1/reconciliations', {
      params: {
        'filter[month]': opts?.month,
        'filter[year]': opts?.year,
        'filter[modifiedBefore]': opts?.modifiedBefore,
        'filter[modifiedSince]': opts?.modifiedSince,
        'filter[entityIds]': opts?.entityIds,
        'filter[workflowIds]': opts?.workflowIds,
        'filter[folderIds]': opts?.folderIds,
        'filter[journalSource]': opts?.journalSource,
        'filter[internalIds]': opts?.internalIds,
        'filter[autoRecType]': opts?.autoRecType,
        'page[size]': opts?.pageSize,
        'page[cursor]': opts?.pageCursor,
      },
    });
  }

  async signoffReconciliation(reconciliationId: string, data: any) {
    return this.request<any>(
      `/api/v1/reconciliations/${encodeURIComponent(reconciliationId)}/signoff`,
      { method: 'POST', body: data }
    );
  }

  // ── Reconciliation Analytics ──

  async getReconciliationAnalytics(opts?: {
    month?: string;
    year?: number;
    modifiedBefore?: string;
    modifiedSince?: string;
    entityIds?: string;
    journalSource?: string;
    internalIds?: string;
    workflowIds?: string;
    pageSize?: number;
    pageCursor?: string;
  }) {
    return this.request<any>('/api/v1/analytics/reconciliations', {
      params: {
        'filter[month]': opts?.month,
        'filter[year]': opts?.year,
        'filter[modifiedBefore]': opts?.modifiedBefore,
        'filter[modifiedSince]': opts?.modifiedSince,
        'filter[entityIds]': opts?.entityIds,
        'filter[journalSource]': opts?.journalSource,
        'filter[internalIds]': opts?.internalIds,
        'filter[workflowIds]': opts?.workflowIds,
        'page[size]': opts?.pageSize,
        'page[cursor]': opts?.pageCursor,
      },
    });
  }

  // ── Transactions ──

  async uploadSubledgers(data: any) {
    return this.request<any>('/api/v1/transactions/subledgers', {
      method: 'PUT',
      body: data,
    });
  }

  async uploadTransactions(data: any, version: string = 'v1') {
    return this.request<any>(`/api/${encodeURIComponent(version)}/transactions`, {
      method: 'PUT',
      body: data,
    });
  }

  async deleteTransactions(reconciliationId: string) {
    return this.request<any>(
      `/api/v1/transactions/${encodeURIComponent(reconciliationId)}`,
      { method: 'DELETE' }
    );
  }

  async getTransactionStatus(statusId: string) {
    return this.request<any>(
      `/api/v1/transactions/status/${encodeURIComponent(statusId)}`
    );
  }

  // ── Trial Balance ──

  async uploadTrialBalance(data: any) {
    return this.request<any>('/api/v1/trial-balance/upload', {
      method: 'PUT',
      body: data,
    });
  }

  // ── Tags ──

  async listTags() {
    return this.request<any>('/api/v1/tags');
  }

  async attachTags(data: any) {
    return this.request<any>('/api/v1/tags/attachments', {
      method: 'PUT',
      body: data,
    });
  }

  // ── Users ──

  async listUsers(opts?: { pageSize?: number; pageCursor?: string }) {
    return this.request<any>('/api/v1/users', {
      params: {
        'page[size]': opts?.pageSize,
        'page[cursor]': opts?.pageCursor,
      },
    });
  }

  // ── User Groups ──

  async listUserGroups(opts?: { pageNumber?: number; pageSize?: number }) {
    return this.request<any>('/api/v1/user-groups', {
      params: {
        'page[number]': opts?.pageNumber,
        'page[size]': opts?.pageSize,
      },
    });
  }

  // ── Folders ──

  async getFolder(folderId: string) {
    return this.request<any>(`/api/v1/folders/${encodeURIComponent(folderId)}`);
  }

  async lockFolder(folderId: string, unlock?: boolean) {
    return this.request<any>(
      `/api/v1/folders/${encodeURIComponent(folderId)}/locking`,
      {
        method: 'PUT',
        params: unlock !== undefined ? { unlock: String(unlock) } : undefined,
      }
    );
  }

  // ── Controls ──

  async listControls(opts?: {
    month?: string;
    year?: string;
    active?: string;
    programId?: string;
    controlId?: string;
    include?: string;
  }) {
    return this.request<any>('/api/v1/controls', {
      params: {
        'filter[month]': opts?.month,
        'filter[year]': opts?.year,
        'filter[active]': opts?.active,
        'filter[programId]': opts?.programId,
        'filter[controlId]': opts?.controlId,
        include: opts?.include,
      },
    });
  }

  async createControls(data: any[]) {
    return this.request<any>('/api/v1/controls', {
      method: 'POST',
      body: data,
    });
  }

  async getControl(id: string, include?: string) {
    return this.request<any>(`/api/v1/controls/${encodeURIComponent(id)}`, {
      params: include ? { include } : undefined,
    });
  }

  async updateControl(id: string, data: any) {
    return this.request<any>(`/api/v1/controls/${encodeURIComponent(id)}`, {
      method: 'PATCH',
      body: data,
    });
  }

  async deleteControl(id: string) {
    return this.request<any>(`/api/v1/controls/${encodeURIComponent(id)}`, {
      method: 'DELETE',
    });
  }

  async signControl(id: string, signatureId: string, setIsSigned: boolean) {
    return this.request<any>(
      `/api/v1/controls/${encodeURIComponent(id)}/sign/${encodeURIComponent(signatureId)}`,
      { method: 'PATCH', body: { setIsSigned } }
    );
  }

  async getControlUploadUrl(id: string, period: string) {
    return this.request<any>(
      `/api/v1/controls/${encodeURIComponent(id)}/upload-url/${encodeURIComponent(period)}`
    );
  }

  async addControlDocument(id: string, data: any) {
    return this.request<any>(
      `/api/v1/controls/${encodeURIComponent(id)}/documents`,
      { method: 'POST', body: data }
    );
  }

  async lockControl(id: string, period: string, data: any) {
    return this.request<any>(
      `/api/v1/controls/${encodeURIComponent(id)}/lock/${encodeURIComponent(period)}`,
      { method: 'PATCH', body: data }
    );
  }

  async deactivateControl(id: string) {
    return this.request<any>(
      `/api/v1/controls/${encodeURIComponent(id)}/deactivate`,
      { method: 'PUT' }
    );
  }

  async reactivateControl(id: string) {
    return this.request<any>(
      `/api/v1/controls/${encodeURIComponent(id)}/reactivate`,
      { method: 'PUT' }
    );
  }

  // ── Programs ──

  async listPrograms(opts?: {
    include?: string;
    pageSize?: number;
    pageCursor?: string;
  }) {
    return this.request<any>('/api/v1/programs', {
      params: {
        include: opts?.include,
        'page[size]': opts?.pageSize,
        'page[cursor]': opts?.pageCursor,
      },
    });
  }

  // ── Processes ──

  async listProcesses() {
    return this.request<any>('/api/v1/processes');
  }

  // ── Guest Users ──

  async listGuestUsers() {
    return this.request<any>('/api/v1/guest-users');
  }
}
