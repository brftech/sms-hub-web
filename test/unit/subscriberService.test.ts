/**
 * Unit tests for SubscriberService
 */
/// <reference types="vitest/globals" />

import { describe, it, expect, beforeEach, vi } from "vitest";
import { SubscriberService, createSubscriberService } from "../../src/services/subscriberService";

// Mock Supabase client
const createMockSupabaseClient = () => {
  const mockSelect = vi.fn().mockReturnThis();
  const mockEq = vi.fn().mockReturnThis();
  const mockLimit = vi.fn();
  const mockInsert = vi.fn().mockReturnThis();
  const mockIn = vi.fn().mockReturnThis();

  const mockFrom = vi.fn(() => ({
    select: mockSelect,
    eq: mockEq,
    limit: mockLimit,
    insert: mockInsert,
    in: mockIn,
  }));

  return {
    from: mockFrom,
    _mocks: {
      from: mockFrom,
      select: mockSelect,
      eq: mockEq,
      limit: mockLimit,
      insert: mockInsert,
      in: mockIn,
    },
  };
};

describe("SubscriberService", () => {
  let mockSupabase: ReturnType<typeof createMockSupabaseClient>;
  let service: SubscriberService;

  beforeEach(() => {
    mockSupabase = createMockSupabaseClient();
    service = new SubscriberService(mockSupabase as any);
  });

  describe("getDefaultListId", () => {
    it("should return list ID for valid email list", async () => {
      mockSupabase._mocks.limit.mockResolvedValue({
        data: [{ id: "list-123" }],
        error: null,
      });

      const result = await service.getDefaultListId(1, "email");

      expect(result).toBe("list-123");
      expect(mockSupabase.from).toHaveBeenCalledWith("email_lists");
    });

    it("should return list ID for valid SMS list", async () => {
      mockSupabase._mocks.limit.mockResolvedValue({
        data: [{ id: "sms-456" }],
        error: null,
      });

      const result = await service.getDefaultListId(1, "sms");

      expect(result).toBe("sms-456");
      expect(mockSupabase.from).toHaveBeenCalledWith("sms_lists");
    });

    it("should return null when list not found", async () => {
      mockSupabase._mocks.limit.mockResolvedValue({
        data: [],
        error: null,
      });

      const result = await service.getDefaultListId(1, "email");

      expect(result).toBeNull();
    });

    it("should return null on database error", async () => {
      mockSupabase._mocks.limit.mockResolvedValue({
        data: null,
        error: { message: "Database error" },
      });

      const result = await service.getDefaultListId(1, "email");

      expect(result).toBeNull();
    });

    it("should handle exceptions gracefully", async () => {
      mockSupabase._mocks.limit.mockRejectedValue(new Error("Network error"));

      const result = await service.getDefaultListId(1, "email");

      expect(result).toBeNull();
    });

    it("should query with correct parameters", async () => {
      mockSupabase._mocks.limit.mockResolvedValue({
        data: [{ id: "list-123" }],
        error: null,
      });

      await service.getDefaultListId(2, "email");

      expect(mockSupabase._mocks.select).toHaveBeenCalledWith("id");
      expect(mockSupabase._mocks.eq).toHaveBeenCalledWith("hub_id", 2);
      expect(mockSupabase._mocks.eq).toHaveBeenCalledWith("list_type", "marketing");
      expect(mockSupabase._mocks.limit).toHaveBeenCalledWith(1);
    });
  });

  describe("addEmailSubscriber", () => {
    beforeEach(() => {
      // Setup default successful response
      mockSupabase._mocks.insert.mockReturnValue({
        select: vi.fn().mockResolvedValue({
          data: [{ id: "sub-123" }],
          error: null,
        }),
      });
    });

    it("should successfully add email subscriber", async () => {
      const result = await service.addEmailSubscriber({
        email: "test@example.com",
        listId: "list-123",
        fullName: "John Doe",
        hubId: 1,
      });

      expect(result.success).toBe(true);
      expect(result.data).toBeDefined();
    });

    it("should parse full name correctly", async () => {
      await service.addEmailSubscriber({
        email: "test@example.com",
        listId: "list-123",
        fullName: "Mary Jane Watson",
        hubId: 1,
      });

      const insertCall = mockSupabase._mocks.insert.mock.calls[0][0];
      expect(insertCall.first_name).toBe("Mary");
      expect(insertCall.last_name).toBe("Jane Watson");
    });

    it("should handle null name", async () => {
      await service.addEmailSubscriber({
        email: "test@example.com",
        listId: "list-123",
        fullName: null,
        hubId: 1,
      });

      const insertCall = mockSupabase._mocks.insert.mock.calls[0][0];
      expect(insertCall.first_name).toBeNull();
      expect(insertCall.last_name).toBeNull();
    });

    it("should include optional fields", async () => {
      await service.addEmailSubscriber({
        email: "test@example.com",
        listId: "list-123",
        fullName: "John Doe",
        hubId: 1,
        phone: "555-1234",
        company: "Acme Corp",
      });

      const insertCall = mockSupabase._mocks.insert.mock.calls[0][0];
      expect(insertCall.phone).toBe("555-1234");
      expect(insertCall.company_name).toBe("Acme Corp");
    });

    it("should set correct default values", async () => {
      await service.addEmailSubscriber({
        email: "test@example.com",
        listId: "list-123",
        fullName: "John Doe",
        hubId: 1,
      });

      const insertCall = mockSupabase._mocks.insert.mock.calls[0][0];
      expect(insertCall.source).toBe("website");
      expect(insertCall.status).toBe("active");
    });

    it("should return error on database failure", async () => {
      mockSupabase._mocks.insert.mockReturnValue({
        select: vi.fn().mockResolvedValue({
          data: null,
          error: { message: "Database constraint violation" },
        }),
      });

      const result = await service.addEmailSubscriber({
        email: "test@example.com",
        listId: "list-123",
        fullName: "John Doe",
        hubId: 1,
      });

      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });
  });

  describe("addSmsSubscriber", () => {
    beforeEach(() => {
      mockSupabase._mocks.insert.mockReturnValue({
        select: vi.fn().mockResolvedValue({
          data: [{ id: "sub-456" }],
          error: null,
        }),
      });
    });

    it("should successfully add SMS subscriber", async () => {
      const result = await service.addSmsSubscriber({
        phoneNumber: "555-1234",
        listId: "sms-123",
        fullName: "John Doe",
        hubId: 1,
      });

      expect(result.success).toBe(true);
      expect(result.data).toBeDefined();
    });

    it("should include email if provided", async () => {
      await service.addSmsSubscriber({
        phoneNumber: "555-1234",
        listId: "sms-123",
        fullName: "John Doe",
        hubId: 1,
        email: "test@example.com",
      });

      const insertCall = mockSupabase._mocks.insert.mock.calls[0][0];
      expect(insertCall.email).toBe("test@example.com");
    });

    it("should handle null email", async () => {
      await service.addSmsSubscriber({
        phoneNumber: "555-1234",
        listId: "sms-123",
        fullName: "John Doe",
        hubId: 1,
      });

      const insertCall = mockSupabase._mocks.insert.mock.calls[0][0];
      expect(insertCall.email).toBeNull();
    });
  });

  describe("isEmailSubscribed", () => {
    it("should return true when email is subscribed", async () => {
      mockSupabase._mocks.limit.mockResolvedValue({
        data: [{ id: "sub-123" }],
        error: null,
      });

      const result = await service.isEmailSubscribed("test@example.com", 1);

      expect(result).toBe(true);
    });

    it("should return false when email is not subscribed", async () => {
      mockSupabase._mocks.limit.mockResolvedValue({
        data: [],
        error: null,
      });

      const result = await service.isEmailSubscribed("test@example.com", 1);

      expect(result).toBe(false);
    });

    it("should return false on database error", async () => {
      mockSupabase._mocks.limit.mockResolvedValue({
        data: null,
        error: { message: "Database error" },
      });

      const result = await service.isEmailSubscribed("test@example.com", 1);

      expect(result).toBe(false);
    });
  });

  describe("isSmsSubscribed", () => {
    it("should return true when phone is subscribed", async () => {
      mockSupabase._mocks.limit.mockResolvedValue({
        data: [{ id: "sub-456" }],
        error: null,
      });

      const result = await service.isSmsSubscribed("555-1234", 1);

      expect(result).toBe(true);
    });

    it("should return false when phone is not subscribed", async () => {
      mockSupabase._mocks.limit.mockResolvedValue({
        data: [],
        error: null,
      });

      const result = await service.isSmsSubscribed("555-1234", 1);

      expect(result).toBe(false);
    });
  });

  describe("addLeadToEmailList", () => {
    it("should fetch list and add subscriber", async () => {
      // Mock getDefaultListId
      mockSupabase._mocks.limit.mockResolvedValueOnce({
        data: [{ id: "list-123" }],
        error: null,
      });

      // Mock addEmailSubscriber
      mockSupabase._mocks.insert.mockReturnValue({
        select: vi.fn().mockResolvedValue({
          data: [{ id: "sub-123" }],
          error: null,
        }),
      });

      const result = await service.addLeadToEmailList({
        email: "test@example.com",
        name: "John Doe",
        hubId: 1,
      });

      expect(result.success).toBe(true);
    });

    it("should return error when list not found", async () => {
      mockSupabase._mocks.limit.mockResolvedValue({
        data: [],
        error: null,
      });

      const result = await service.addLeadToEmailList({
        email: "test@example.com",
        name: "John Doe",
        hubId: 1,
      });

      expect(result.success).toBe(false);
      expect(result.error).toContain("No email list found");
    });
  });

  describe("addLeadToSmsList", () => {
    it("should fetch list and add subscriber", async () => {
      mockSupabase._mocks.limit.mockResolvedValueOnce({
        data: [{ id: "sms-123" }],
        error: null,
      });

      mockSupabase._mocks.insert.mockReturnValue({
        select: vi.fn().mockResolvedValue({
          data: [{ id: "sub-456" }],
          error: null,
        }),
      });

      const result = await service.addLeadToSmsList({
        phoneNumber: "555-1234",
        name: "John Doe",
        hubId: 1,
      });

      expect(result.success).toBe(true);
    });

    it("should return error when list not found", async () => {
      mockSupabase._mocks.limit.mockResolvedValue({
        data: [],
        error: null,
      });

      const result = await service.addLeadToSmsList({
        phoneNumber: "555-1234",
        name: "John Doe",
        hubId: 1,
      });

      expect(result.success).toBe(false);
      expect(result.error).toContain("No SMS list found");
    });
  });
});

describe("createSubscriberService", () => {
  it("should create a SubscriberService instance", () => {
    const mockSupabase = createMockSupabaseClient();
    const service = createSubscriberService(mockSupabase as any);

    expect(service).toBeInstanceOf(SubscriberService);
  });
});
