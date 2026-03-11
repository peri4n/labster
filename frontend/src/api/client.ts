import type { Collection } from "@models/collection";
import type { Sequence } from "@models/sequence";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

class ApiClient {
  private async request<T>(path: string, options?: RequestInit): Promise<T> {
    const response = await fetch(`${BASE_URL}${path}`, options);
    return response.json();
  }

  // Sequences

  async getSequences(page: number, perPage: number): Promise<Sequence[]> {
    return this.request(`/sequences?page=${page}&per_page=${perPage}`);
  }

  async getSequence(id: string): Promise<Sequence> {
    return this.request(`/sequences/${id}`);
  }

  async createSequence(data: {
    identifier: string;
    description: string;
    sequence: string;
    alphabet: string;
  }): Promise<void> {
    await this.request("/sequences", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
  }

  async deleteSequence(id: number): Promise<void> {
    await this.request(`/sequences/${id}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
    });
  }

  // Collections

  async getCollections(page: number, perPage: number): Promise<Collection[]> {
    return this.request(`/collections?page=${page}&per_page=${perPage}`);
  }

  async getCollection(id: string): Promise<Collection> {
    return this.request(`/collections/${id}`);
  }

  async getCollectionSequences(
    collectionId: number,
    page: number,
    perPage: number,
  ): Promise<Sequence[]> {
    return this.request(`/collections/${collectionId}/sequences?page=${page}&per_page=${perPage}`);
  }

  async deleteCollection(id: number): Promise<void> {
    await this.request(`/collections/${id}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
    });
  }
}

export const apiClient = new ApiClient();
