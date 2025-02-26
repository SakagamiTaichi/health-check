import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { RootState } from '../../../share/store';

export interface HealthCheckItem {
  id: string;
  name: string;
  endpoint: string;
  status: 'success' | 'failure' | 'pending' | 'idle';
  lastCheckedAt: string | null;
  message: string | null;
}

interface HealthCheckState {
  items: HealthCheckItem[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: HealthCheckState = {
  items: [
    {
      id: 'api-health',
      name: 'APIヘルスチェック',
      endpoint: 'https://ai-app-backend-zr75.onrender.com/api/v1/health_check/',
      status: 'idle',
      lastCheckedAt: null,
      message: null,
    },
    {
      id: 'dns-resolution',
      name: '名前解決チェック',
      endpoint: 'ai-app-backend-zr75.onrender.com',
      status: 'idle',
      lastCheckedAt: null,
      message: null,
    },
  ],
  status: 'idle',
  error: null,
};

// API Health Check thunk
export const performApiHealthCheck = createAsyncThunk(
  'healthCheck/performApiHealthCheck',
  async (id: string, { getState }) => {
    const state = getState() as RootState;
    const item = state.healthCheck.items.find((item) => item.id === id);

    if (!item) {
      throw new Error('Health check item not found');
    }

    try {
      const response = await axios.get(item.endpoint, { timeout: 10000 });
      return {
        id,
        status: 'success' as const,
        lastCheckedAt: new Date().toISOString(),
        message: `Status ${response.status}: ${response.statusText}`,
      };
    } catch (error) {
      let message = 'Unknown error occurred';
      if (axios.isAxiosError(error)) {
        message = error.message;
      } else if (error instanceof Error) {
        message = error.message;
      }

      return {
        id,
        status: 'failure' as const,
        lastCheckedAt: new Date().toISOString(),
        message,
      };
    }
  }
);

// DNS Resolution Check thunk - Using Google DNS over HTTPS API
export const performDnsResolutionCheck = createAsyncThunk(
  'healthCheck/performDnsResolutionCheck',
  async (id: string, { getState }) => {
    const state = getState() as RootState;
    const item = state.healthCheck.items.find((item) => item.id === id);

    if (!item) {
      throw new Error('Health check item not found');
    }

    try {
      // Extract domain from endpoint
      const domain = item.endpoint.replace(/^https?:\/\//, '').split('/')[0];

      // Use Google's DNS over HTTPS API
      const response = await axios.get(
        `https://dns.google/resolve?name=${encodeURIComponent(domain)}&type=A`,
        { timeout: 5000 }
      );

      const data = response.data;

      // Check if the DNS resolution was successful
      if (
        data.Status === 0 &&
        Array.isArray(data.Answer) &&
        data.Answer.length > 0
      ) {
        // Successfully resolved
        const ipAddresses = data.Answer.filter(
          (record: { type: number }) => record.type === 1
        ) // Type 1 is A record (IPv4)
          .map((record: { data: unknown }) => record.data)
          .join(', ');

        return {
          id,
          status: 'success' as const,
          lastCheckedAt: new Date().toISOString(),
          message: `Successfully resolved ${domain} to ${
            ipAddresses || 'IP addresses'
          }`,
        };
      } else {
        // DNS resolution failed or returned no records
        return {
          id,
          status: 'failure' as const,
          lastCheckedAt: new Date().toISOString(),
          message: `DNS resolution failed for ${domain}: ${
            data.Comment || 'No DNS records found'
          }`,
        };
      }
    } catch (error) {
      let message = 'DNS resolution check failed';
      if (axios.isAxiosError(error)) {
        message = `DNS resolution check error: ${error.message}`;
      } else if (error instanceof Error) {
        message = error.message;
      }

      return {
        id,
        status: 'failure' as const,
        lastCheckedAt: new Date().toISOString(),
        message,
      };
    }
  }
);

// Check all services at once
export const checkAllServices = createAsyncThunk(
  'healthCheck/checkAllServices',
  async (_, { dispatch, getState }) => {
    const state = getState() as RootState;
    const items = state.healthCheck.items;

    const promises = items.map((item) => {
      if (item.id === 'api-health') {
        return dispatch(performApiHealthCheck(item.id));
      } else if (item.id === 'dns-resolution') {
        return dispatch(performDnsResolutionCheck(item.id));
      }
      return Promise.resolve();
    });

    await Promise.all(promises);
    return true;
  }
);

const healthCheckSlice = createSlice({
  name: 'healthCheck',
  initialState,
  reducers: {
    resetHealthChecks: (state) => {
      state.items = state.items.map((item) => ({
        ...item,
        status: 'idle',
        lastCheckedAt: null,
        message: null,
      }));
    },
  },
  extraReducers: (builder) => {
    builder
      // API Health Check
      .addCase(performApiHealthCheck.pending, (state, action) => {
        const itemIndex = state.items.findIndex(
          (item) => item.id === action.meta.arg
        );
        if (itemIndex !== -1) {
          state.items[itemIndex].status = 'pending';
        }
      })
      .addCase(performApiHealthCheck.fulfilled, (state, action) => {
        const { id, status, lastCheckedAt, message } = action.payload;
        const itemIndex = state.items.findIndex((item) => item.id === id);
        if (itemIndex !== -1) {
          state.items[itemIndex].status = status;
          state.items[itemIndex].lastCheckedAt = lastCheckedAt;
          state.items[itemIndex].message = message;
        }
      })
      .addCase(performApiHealthCheck.rejected, (state, action) => {
        const itemIndex = state.items.findIndex(
          (item) => item.id === action.meta.arg
        );
        if (itemIndex !== -1) {
          state.items[itemIndex].status = 'failure';
          state.items[itemIndex].lastCheckedAt = new Date().toISOString();
          state.items[itemIndex].message =
            action.error.message || 'Failed to perform health check';
        }
      })

      // DNS Resolution Check
      .addCase(performDnsResolutionCheck.pending, (state, action) => {
        const itemIndex = state.items.findIndex(
          (item) => item.id === action.meta.arg
        );
        if (itemIndex !== -1) {
          state.items[itemIndex].status = 'pending';
        }
      })
      .addCase(performDnsResolutionCheck.fulfilled, (state, action) => {
        const { id, status, lastCheckedAt, message } = action.payload;
        const itemIndex = state.items.findIndex((item) => item.id === id);
        if (itemIndex !== -1) {
          state.items[itemIndex].status = status;
          state.items[itemIndex].lastCheckedAt = lastCheckedAt;
          state.items[itemIndex].message = message;
        }
      })
      .addCase(performDnsResolutionCheck.rejected, (state, action) => {
        const itemIndex = state.items.findIndex(
          (item) => item.id === action.meta.arg
        );
        if (itemIndex !== -1) {
          state.items[itemIndex].status = 'failure';
          state.items[itemIndex].lastCheckedAt = new Date().toISOString();
          state.items[itemIndex].message =
            action.error.message || 'Failed to perform DNS resolution check';
        }
      });
  },
});

export const { resetHealthChecks } = healthCheckSlice.actions;
export default healthCheckSlice.reducer;
