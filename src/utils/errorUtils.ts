
export const getErrorMessage = (err: any, fallback = 'Ocorreu um erro. Tente novamente.'): string => {
  const data = err?.response?.data;

  if (data) {
    if (typeof data === 'string') return data;
    if (typeof data.message === 'string') return data.message;
    if (typeof data.error === 'string') return data.error;
    if (typeof data.msg === 'string') return data.msg;
    if (typeof data.detail === 'string') return data.detail;

    if (Array.isArray(data.errors) && data.errors[0]?.message) {
      return data.errors[0].message;
    }
    if (Array.isArray(data) && data[0]?.message) {
      return data[0].message;
    }
  }

  if (err?.code === 'ERR_NETWORK') return 'Sem conexão com o servidor.';
  if (err?.code === 'ECONNABORTED') return 'Tempo de resposta esgotado.';

  if (typeof err?.message === 'string' && !err.message.includes('status code')) {
    return err.message;
  }

  return fallback;
};
