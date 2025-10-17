// web/src/services/__tests__/users.service.test.ts
import * as Users from "@/services/users.service";
import { apiRequest } from "@/lib/auth";
import { USERS_ENDPOINTS } from "@/lib/config/api";
import type { User } from "@/types/user";
import { Gender } from "@/types/auth";

jest.mock("@/lib/auth", () => ({ apiRequest: jest.fn() }));

describe("users.service", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("getUser: GET user by id", async () => {
    const mockUser: User = {
      id: "user1",
      email: "test@example.com",
      nickname: "testuser",
      gender: Gender.MALE,
      createdAt: "2023-01-01T00:00:00Z",
      updatedAt: "2023-01-01T00:00:00Z",
    };

    (apiRequest as jest.Mock).mockResolvedValueOnce(mockUser);
    const result = await Users.getUser("user1");

    expect(apiRequest).toHaveBeenCalledWith(USERS_ENDPOINTS.profile("user1"), {
      method: "GET",
    });
    expect(result).toEqual(mockUser);
  });

  it("updateUser: PATCH with partial user data", async () => {
    const mockUser: User = {
      id: "user1",
      email: "updated@example.com",
      nickname: "updateduser",
      gender: Gender.MALE,
      createdAt: "2023-01-01T00:00:00Z",
      updatedAt: "2023-01-01T00:00:00Z",
    };

    const updateData: Partial<User> = { nickname: "updateduser" };

    (apiRequest as jest.Mock).mockResolvedValueOnce(mockUser);
    const result = await Users.updateUser("user1", updateData);

    expect(apiRequest).toHaveBeenCalledWith(
      USERS_ENDPOINTS.updateProfile("user1"),
      {
        method: "PATCH",
        body: JSON.stringify(updateData),
      },
    );
    expect(result).toEqual(mockUser);
  });

  it("uploadAvatar: POST FormData with file", async () => {
    const mockFile = new File(["content"], "avatar.jpg", {
      type: "image/jpeg",
    });
    const mockResponse = {
      filename: "avatar.jpg",
      path: "/uploads/avatar.jpg",
    };

    (apiRequest as jest.Mock).mockResolvedValueOnce(mockResponse);
    const result = await Users.uploadAvatar(mockFile);

    expect(apiRequest).toHaveBeenCalledWith(USERS_ENDPOINTS.uploadAvatar, {
      method: "POST",
      body: expect.any(FormData),
    });
    expect(result).toEqual(mockResponse);
  });

  it("followUser: POST follow request", async () => {
    (apiRequest as jest.Mock).mockResolvedValueOnce(undefined);
    await Users.followUser("user1");

    expect(apiRequest).toHaveBeenCalledWith(USERS_ENDPOINTS.follow("user1"), {
      method: "POST",
    });
  });

  it("unfollowUser: DELETE unfollow request", async () => {
    (apiRequest as jest.Mock).mockResolvedValueOnce(undefined);
    await Users.unfollowUser("user1");

    expect(apiRequest).toHaveBeenCalledWith(USERS_ENDPOINTS.unfollow("user1"), {
      method: "DELETE",
    });
  });

  it("getFollowers: GET followers list", async () => {
    const mockFollowers: User[] = [
      {
        id: "follower1",
        email: "follower1@example.com",
        nickname: "follower1",
        gender: Gender.FEMALE,
        createdAt: "2023-01-01T00:00:00Z",
        updatedAt: "2023-01-01T00:00:00Z",
      },
    ];

    (apiRequest as jest.Mock).mockResolvedValueOnce(mockFollowers);
    const result = await Users.getFollowers("user1");

    expect(apiRequest).toHaveBeenCalledWith(
      USERS_ENDPOINTS.followers("user1"),
      { method: "GET" },
    );
    expect(result).toEqual(mockFollowers);
  });

  it("getFollowing: GET following list", async () => {
    const mockFollowing: User[] = [
      {
        id: "following1",
        email: "following1@example.com",
        nickname: "following1",
        gender: Gender.OTHER,
        createdAt: "2023-01-01T00:00:00Z",
        updatedAt: "2023-01-01T00:00:00Z",
      },
    ];

    (apiRequest as jest.Mock).mockResolvedValueOnce(mockFollowing);
    const result = await Users.getFollowing("user1");

    expect(apiRequest).toHaveBeenCalledWith(
      USERS_ENDPOINTS.following("user1"),
      { method: "GET" },
    );
    expect(result).toEqual(mockFollowing);
  });
});
