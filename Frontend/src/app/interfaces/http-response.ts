export interface HttpResponse {
    headers: any;
    ok: boolean;
    status: number;
    statusText: string;
    url: any;
  
    body?: any;
    type?: number;
  
    error?: any;
    message?: string;
    name?: string;
  }
