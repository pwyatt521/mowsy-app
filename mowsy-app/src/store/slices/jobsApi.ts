import { api } from './api';

export interface UserPublicProfile {
  id: number;
  first_name: string;
  last_name: string;
  address: string;
  rating: number;
  review_count: number;
}

export interface Job {
  id: number;
  title: string;
  description: string;
  special_notes: string;
  category: string;
  fixed_price: number;
  estimated_hours: number;
  address: string;
  zip_code: string;
  elementary_school_district_name: string;
  visibility: string;
  status: 'open' | 'in-progress' | 'completed';
  scheduled_date?: string | null;
  created_at: string;
  updated_at: string;
  completion_image_urls: string[];
  user: UserPublicProfile;
}

export interface CreateJobRequest {
  title: string;
  description: string;
  price: number;
  category: string;
  scheduledDate?: string;
}

export interface UpdateJobRequest {
  title: string;
  description: string;
  special_notes: string;
  category: string;
  fixed_price: number;
  estimated_hours: number;
  address: string;
  visibility: string;
  scheduled_date?: string | null;
}

export interface JobApplication {
  id: number;
  job_id: number;
  user_id: number;
  message: string;
  applied_at: string;
  status: 'pending' | 'accepted' | 'rejected';
  job?: Job;
  user?: UserPublicProfile;
}

export interface CreateJobApplicationRequest {
  message: string;
}

export const jobsApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getJobs: builder.query<Job[], { category?: string; location?: string }>({
      query: (params) => ({
        url: '/v1/jobs',
        params: {
          ...params,
          filter: 'true',
        },
      }),
      providesTags: ['Job'],
    }),
    getJobById: builder.query<Job, string>({
      query: (id) => `/v1/jobs/${id}`,
      providesTags: (result, error, id) => [{ type: 'Job', id }],
    }),
    createJob: builder.mutation<Job, CreateJobRequest>({
      query: (jobData) => ({
        url: '/v1/jobs',
        method: 'POST',
        body: jobData,
      }),
      invalidatesTags: ['Job'],
    }),
    updateJob: builder.mutation<Job, { id: string; data: UpdateJobRequest }>({
      query: ({ id, data }) => ({
        url: `/v1/jobs/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Job', id }],
    }),
    deleteJob: builder.mutation<void, string>({
      query: (id) => ({
        url: `/v1/jobs/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Job'],
    }),
    getUserJobs: builder.query<Job[], void>({
      query: () => '/v1/jobs/my',
      providesTags: ['Job'],
    }),
    applyToJob: builder.mutation<JobApplication, { id: string; data: CreateJobApplicationRequest }>({
      query: ({ id, data }) => ({
        url: `/v1/jobs/${id}/apply`,
        method: 'POST',
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Job', id }],
    }),
  }),
});

export const {
  useGetJobsQuery,
  useGetJobByIdQuery,
  useCreateJobMutation,
  useUpdateJobMutation,
  useDeleteJobMutation,
  useGetUserJobsQuery,
  useApplyToJobMutation,
} = jobsApi;