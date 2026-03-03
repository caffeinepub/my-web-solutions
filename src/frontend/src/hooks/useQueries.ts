import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type {
  BlogPost,
  Lead,
  LeadStatus,
  Role,
  ServiceRequest,
  ServiceRequestStatus,
  User,
} from "../backend.d";
import { useActor } from "./useActor";

export function useGetLeads() {
  const { actor, isFetching } = useActor();
  return useQuery<Lead[]>({
    queryKey: ["leads"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getLeads();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useListUsers() {
  const { actor, isFetching } = useActor();
  return useQuery<User[]>({
    queryKey: ["users"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.listUsers();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useSubmitLead() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      name,
      phone,
      service,
      message,
    }: {
      name: string;
      phone: string;
      service: string;
      message: string;
    }) => {
      if (!actor) throw new Error("Not connected");
      return actor.submitLead(name, phone, service, message);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["leads"] });
    },
  });
}

export function useUpdateLeadStatus() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, status }: { id: bigint; status: LeadStatus }) => {
      if (!actor) throw new Error("Not connected");
      return actor.updateLeadStatus(id, status);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["leads"] });
    },
  });
}

export function useToggleUserActive() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (userId: bigint) => {
      if (!actor) throw new Error("Not connected");
      return actor.toggleUserActive(userId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });
}

export function useCreateUser() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      username,
      passwordHash,
      role,
    }: {
      username: string;
      passwordHash: string;
      role: Role;
    }) => {
      if (!actor) throw new Error("Not connected");
      return actor.createUser(username, passwordHash, role);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });
}

export function useLogin() {
  const { actor } = useActor();
  return useMutation({
    mutationFn: async ({
      username,
      passwordHash,
    }: {
      username: string;
      passwordHash: string;
    }) => {
      if (!actor) throw new Error("Not connected");
      return actor.login(username, passwordHash);
    },
  });
}

export function useInitAdmin() {
  const { actor } = useActor();
  return useMutation({
    mutationFn: async (): Promise<boolean> => {
      if (!actor) throw new Error("Not connected");
      // initAdmin is a shared function not in the generated types — cast to any
      return (actor as any).initAdmin() as Promise<boolean>;
    },
  });
}

// ─── Blog ─────────────────────────────────────────────────────────────────────

export function useListBlogPosts() {
  const { actor, isFetching } = useActor();
  return useQuery<BlogPost[]>({
    queryKey: ["blog-posts-public"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.listBlogPosts();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useListAllBlogPosts() {
  const { actor, isFetching } = useActor();
  return useQuery<BlogPost[]>({
    queryKey: ["blog-posts-all"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.listAllBlogPosts();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetBlogPost(id: bigint | null) {
  const { actor, isFetching } = useActor();
  return useQuery<BlogPost | null>({
    queryKey: ["blog-post", id?.toString()],
    queryFn: async () => {
      if (!actor || id === null) return null;
      return actor.getBlogPost(id);
    },
    enabled: !!actor && !isFetching && id !== null,
  });
}

export function useCreateBlogPost() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      title,
      content,
      excerpt,
      authorName,
    }: {
      title: string;
      content: string;
      excerpt: string;
      authorName: string;
    }) => {
      if (!actor) throw new Error("Not connected");
      return actor.createBlogPost(title, content, excerpt, authorName);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["blog-posts-all"] });
      queryClient.invalidateQueries({ queryKey: ["blog-posts-public"] });
    },
  });
}

export function useUpdateBlogPost() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      id,
      title,
      content,
      excerpt,
      isPublished,
    }: {
      id: bigint;
      title: string;
      content: string;
      excerpt: string;
      isPublished: boolean;
    }) => {
      if (!actor) throw new Error("Not connected");
      return actor.updateBlogPost(id, title, content, excerpt, isPublished);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["blog-posts-all"] });
      queryClient.invalidateQueries({ queryKey: ["blog-posts-public"] });
    },
  });
}

export function useDeleteBlogPost() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error("Not connected");
      return actor.deleteBlogPost(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["blog-posts-all"] });
      queryClient.invalidateQueries({ queryKey: ["blog-posts-public"] });
    },
  });
}

// ─── Service Requests ─────────────────────────────────────────────────────────

export function useListAllServiceRequests() {
  const { actor, isFetching } = useActor();
  return useQuery<ServiceRequest[]>({
    queryKey: ["service-requests-all"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.listAllServiceRequests();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetClientServiceRequests(clientUserId: bigint | null) {
  const { actor, isFetching } = useActor();
  return useQuery<ServiceRequest[]>({
    queryKey: ["service-requests-client", clientUserId?.toString()],
    queryFn: async () => {
      if (!actor || clientUserId === null) return [];
      return actor.getClientServiceRequests(clientUserId);
    },
    enabled: !!actor && !isFetching && clientUserId !== null,
  });
}

export function useCreateServiceRequest() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      clientUserId,
      clientName,
      serviceType,
      description,
    }: {
      clientUserId: bigint;
      clientName: string;
      serviceType: string;
      description: string;
    }) => {
      if (!actor) throw new Error("Not connected");
      return actor.createServiceRequest(
        clientUserId,
        clientName,
        serviceType,
        description,
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["service-requests-client"] });
      queryClient.invalidateQueries({ queryKey: ["service-requests-all"] });
    },
  });
}

export function useUpdateServiceRequestStatus() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      id,
      status,
    }: {
      id: bigint;
      status: ServiceRequestStatus;
    }) => {
      if (!actor) throw new Error("Not connected");
      return actor.updateServiceRequestStatus(id, status);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["service-requests-all"] });
      queryClient.invalidateQueries({ queryKey: ["service-requests-client"] });
    },
  });
}

export function useDeleteServiceRequest() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error("Not connected");
      return actor.deleteServiceRequest(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["service-requests-all"] });
    },
  });
}
