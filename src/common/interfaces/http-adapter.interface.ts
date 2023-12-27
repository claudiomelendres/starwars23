/* eslint-disable prettier/prettier */
export interface HttpAdapter {
  get<T>(url: string): Promise<T>;
}
