import { callBackendApi } from './db/backendApi';

export function startPortal() {
  (window as any).callBackendApi = callBackendApi;

  // Polyfill google.script.run so any legacy snippet works
  (window as any).google = {
    script: {
      run: {
        withSuccessHandler(onSuccess: (data: any) => void) {
          return {
            withFailureHandler(onFailure: (err: any) => void) {
              return new Proxy({}, {
                get(_, prop) {
                  return async (...args: any[]) => {
                    try {
                      const res = await callBackendApi(String(prop), ...args);
                      if (res && res.ok) {
                        onSuccess(res.data);
                      } else {
                        const err = new Error(res?.message || 'Kesalahan server');
                        (err as any).code = res?.code || '';
                        onFailure(err);
                      }
                    } catch (e) {
                      onFailure(e);
                    }
                  };
                },
              });
            },
          };
        },
      },
    },
  };
}
