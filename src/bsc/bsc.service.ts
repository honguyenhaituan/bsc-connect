import { Injectable } from '@nestjs/common';
import axios, { Axios } from 'axios';
import * as FormData from 'form-data';
import { AppConfig } from 'src/config';
import { CreateOrderData, UpdateOrderData } from './dtos/order.dto';

@Injectable()
export class BscService {
  private client: Axios;
  private data: {
    refreshToken?: string;
    accountId?: string;
  } = {};

  constructor(private readonly config: AppConfig) {
    this.client = axios.create({});
    this.client.interceptors.response.use(
      (response) => response,
      async (error) => {
        const status = error.response ? error.response.status : null;
        if (status === 401) {
          const { accessToken, refreshToken } = await this.refreshToken();
          error.config.headers['Authorization'] = 'Bearer ' + accessToken;
          this.data.refreshToken = refreshToken;
          return this.client.request(error.config);
        }

        return Promise.reject(error);
      },
    );
  }

  async auth(code: string) {
    const body = new FormData();
    body.append('client_id', this.config.clientId);
    body.append('client_secret', this.config.clientSecret);
    body.append('grant_type', 'authorization_code');
    body.append('redirect_uri', 'http://localhost:5678/auth');
    body.append('code', code);

    const { data } = await this.client.post(
      this.config.ssoServer + '/oauth/token',
      body,
      {
        headers: body.getHeaders(),
      },
    );
    const { access_token: accessToken, refresh_token: refreshToken } = data;
    this.client.defaults.headers['Authorization'] = 'Bearer ' + accessToken;
    this.data.refreshToken = refreshToken;
    return { accessToken, refreshToken };
  }

  async refreshToken() {
    const body = new FormData();
    body.append('client_id', this.config.clientId);
    body.append('client_secret', this.config.clientSecret);
    body.append('grant_type', 'refresh_token');
    body.append('refresh_token', this.data.refreshToken);

    const { data } = await this.client.post(
      this.config.ssoServer + '/oauth/token',
      body,
      {
        headers: body.getHeaders(),
      },
    );
    const { access_token: accessToken, refresh_token: refreshToken } = data;
    return { accessToken, refreshToken };
  }

  async getConfig() {
    const { data } = await this.client.get(
      this.config.tradingServer + '/config',
    );
    return data;
  }

  async getAccountInfo() {
    const { data } = await this.client.get(this.config.ssoServer + '/api/info');
    this.data.accountId = data.custid;
    return data;
  }

  async getAccountBalance() {
    const { data } = await this.client.get(
      this.config.tradingServer + `/accounts/${this.data.accountId}/state`,
    );
    return data;
  }

  async getOrders() {
    const { data } = await this.client.get(
      this.config.tradingServer + `/accounts/${this.data.accountId}/orders`,
    );
    return data;
  }

  async getOrdersHistory() {
    const { data } = await this.client.get(
      this.config.tradingServer +
        `/accounts/${this.data.accountId}/ordersHistory`,
    );
    return data;
  }

  async createOrder(order: CreateOrderData) {
    const body = new FormData();
    body.append('instrument', order.instrument);
    body.append('qty', order.qty);
    body.append('side', order.side);
    body.append('type', order.type);
    body.append('limitPrice', order.limitPrice);
    body.append('durationDateTime', order.durationDateTime);
    body.append('digitalSignature', order.digitalSignature);

    const { data } = await this.client.post(
      this.config.tradingServer + `/accounts/${this.data.accountId}/orders}`,
      body,
      { headers: body.getHeaders() },
    );
    return data;
  }

  async getOrder(orderId: string) {
    const { data } = await this.client.get(
      this.config.tradingServer +
        `/accounts/${this.data.accountId}/orders/${orderId}`,
    );
    return data;
  }

  async updateOrder(orderId: string, order: UpdateOrderData) {
    const body = new FormData();
    body.append('qty', order.qty);
    body.append('limitPrice', order.limitPrice);
    body.append('stopPrice', order.stopPrice);
    body.append('stopLoss', order.stopLoss);
    body.append('takeProfit', order.takeProfit);
    body.append('digitalSignature', order.digitalSignature);

    const { data } = await this.client.put(
      this.config.tradingServer +
        `/accounts/${this.data.accountId}/orders/${orderId}`,
      body,
      { headers: body.getHeaders() },
    );
    return data;
  }

  async deleteOrder(orderId: string) {
    const { data } = await this.client.delete(
      this.config.tradingServer +
        `/accounts/${this.data.accountId}/orders/${orderId}`,
    );
    return data;
  }

  async getPositions() {
    const { data } = await this.client.get(
      this.config.tradingServer + `/accounts/${this.data.accountId}/positions`,
    );
    return data;
  }

  async getPosition(positionId: string) {
    const { data } = await this.client.get(
      this.config.tradingServer +
        `/accounts/${this.data.accountId}/positions/${positionId}`,
    );
    return data;
  }

  async deletePosition(positionId: string) {
    const { data } = await this.client.delete(
      this.config.tradingServer +
        `/accounts/${this.data.accountId}/positions/${positionId}`,
    );
    return data;
  }

  async getExecutions() {
    const { data } = await this.client.delete(
      this.config.tradingServer + `/accounts/${this.data.accountId}/executions`,
    );
    return data;
  }

  async getQuotes(symbols: string) {
    const { data } = await this.client.get(
      this.config.tradingServer + `/quotes?symbols=${symbols}`,
    );
    return data;
  }

  async getDepth(symbols: string) {
    const { data } = await this.client.get(
      this.config.tradingServer + `/depth?symbols=${symbols}`,
    );
    return data;
  }
}
