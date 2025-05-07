import { Injectable } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class AxiosService {
  constructor() {}

  async sendGetRequest<T>(url: string): Promise<T | null> {
    const response = await axios.get(url);
    return response.data || null;
  }

  async sendPostRequest<T, U>(url: string, body: U): Promise<T | null> {
    const response = await axios.post(url, body);
    return response.data || null;
  }
}
