import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { Lead, LeadStatus, Role, User } from "../backend.d";
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
