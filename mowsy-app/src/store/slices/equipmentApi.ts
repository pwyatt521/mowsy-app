import { api } from './api';

export interface UserPublicProfile {
  id: number;
  first_name: string;
  last_name: string;
  address: string;
  rating: number;
  review_count: number;
}

export interface Equipment {
  id: number;
  user_id: number;
  name: string;
  make: string;
  model: string;
  category: string;
  fuel_type?: string;
  power_type?: string;
  daily_rental_price: number;
  description: string;
  image_urls: string[];
  is_available: boolean;
  address: string;
  latitude?: number | null;
  longitude?: number | null;
  zip_code: string;
  elementary_school_district_name: string;
  visibility: string;
  created_at: string;
  updated_at: string;
  user: UserPublicProfile;
}

export interface CreateEquipmentRequest {
  title: string;
  description: string;
  category: string;
  dailyRate: number;
  specs: string[];
}

export interface UpdateEquipmentRequest {
  name: string;
  make: string;
  model: string;
  category: string;
  fuel_type?: string | null;
  power_type?: string | null;
  daily_rental_price: number;
  description: string;
  image_urls: string[];
  address: string;
  visibility: string;
  is_available: boolean;
}

export interface RentalRequest {
  id: string;
  equipmentId: string;
  userId: string;
  startDate: string;
  endDate: string;
  status: 'pending' | 'approved' | 'rejected' | 'active' | 'completed';
  totalCost: number;
  createdAt: string;
}

export interface CreateRentalRequest {
  equipmentId: string;
  startDate: string;
  endDate: string;
}

export const equipmentApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getEquipment: builder.query<Equipment[], { category?: string; available?: boolean }>({
      query: (params) => ({
        url: '/v1/equipment',
        params: {
          ...params,
          filter: 'true',
        },
      }),
      providesTags: ['Equipment'],
    }),
    getEquipmentById: builder.query<Equipment, string>({
      query: (id) => `/v1/equipment/${id}`,
      providesTags: (result, error, id) => [{ type: 'Equipment', id }],
    }),
    createEquipment: builder.mutation<Equipment, CreateEquipmentRequest>({
      query: (equipmentData) => ({
        url: '/v1/equipment',
        method: 'POST',
        body: equipmentData,
      }),
      invalidatesTags: ['Equipment'],
    }),
    updateEquipment: builder.mutation<Equipment, { id: string; data: UpdateEquipmentRequest }>({
      query: ({ id, data }) => ({
        url: `/v1/equipment/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Equipment', id }],
    }),
    deleteEquipment: builder.mutation<void, string>({
      query: (id) => ({
        url: `/v1/equipment/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Equipment'],
    }),
    getUserEquipment: builder.query<Equipment[], void>({
      query: () => '/v1/equipment/my',
      providesTags: ['Equipment'],
    }),
    createRentalRequest: builder.mutation<RentalRequest, CreateRentalRequest>({
      query: (rentalData) => ({
        url: '/v1/equipment/rental-requests',
        method: 'POST',
        body: rentalData,
      }),
      invalidatesTags: ['Rental'],
    }),
    getRentalRequests: builder.query<RentalRequest[], void>({
      query: () => '/v1/equipment/rental-requests',
      providesTags: ['Rental'],
    }),
    updateRentalRequest: builder.mutation<RentalRequest, { id: string; status: string }>({
      query: ({ id, status }) => ({
        url: `/v1/equipment/rental-requests/${id}`,
        method: 'PUT',
        body: { status },
      }),
      invalidatesTags: ['Rental'],
    }),
  }),
});

export const {
  useGetEquipmentQuery,
  useGetEquipmentByIdQuery,
  useCreateEquipmentMutation,
  useUpdateEquipmentMutation,
  useDeleteEquipmentMutation,
  useGetUserEquipmentQuery,
  useCreateRentalRequestMutation,
  useGetRentalRequestsQuery,
  useUpdateRentalRequestMutation,
} = equipmentApi;