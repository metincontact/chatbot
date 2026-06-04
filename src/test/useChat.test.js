import { renderHook, act, waitFor } from "@testing-library/react";
import { useChat } from "../hooks/useChat";

const MOCK_REPLY = "Hello from AI";

function mockFetchSuccess(text = MOCK_REPLY) {
  global.fetch = vi.fn().mockResolvedValue({
    ok: true,
    status: 200,
    json: () =>
      Promise.resolve({
        candidates: [{ content: { parts: [{ text }] } }],
      }),
  });
}

function mockFetchError(status = 500) {
  global.fetch = vi.fn().mockResolvedValue({
    ok: false,
    status,
    json: () => Promise.resolve({}),
  });
}

beforeEach(() => {
  localStorage.clear();
  vi.restoreAllMocks();
});

describe("useChat", () => {
  it("starts with empty messages and not loading", () => {
    const { result } = renderHook(() => useChat());
    expect(result.current.messages).toEqual([]);
    expect(result.current.loading).toBe(false);
  });

  it("adds user message immediately on sendMessage", async () => {
    mockFetchSuccess();
    const { result } = renderHook(() => useChat());

    act(() => {
      result.current.sendMessage("Hi");
    });

    expect(result.current.messages[0]).toMatchObject({
      message: "Hi",
      sender: "user",
    });
  });

  it("adds bot reply after API responds", async () => {
    mockFetchSuccess("Hello from AI");
    const { result } = renderHook(() => useChat());

    act(() => {
      result.current.sendMessage("Hi");
    });

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.messages[1]).toMatchObject({
      message: "Hello from AI",
      sender: "robot",
    });
  });

  it("sets loading to true while waiting for response", async () => {
    mockFetchSuccess();
    const { result } = renderHook(() => useChat());

    act(() => {
      result.current.sendMessage("Hi");
    });

    expect(result.current.loading).toBe(true);
    await waitFor(() => expect(result.current.loading).toBe(false));
  });

  it("adds error message when API call fails", async () => {
    mockFetchError(500);
    const { result } = renderHook(() => useChat());

    act(() => {
      result.current.sendMessage("Hi");
    });

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.messages[1]).toMatchObject({
      message: "Something went wrong. Please try again.",
      sender: "robot",
    });
  });

  it("ignores empty or whitespace-only messages", () => {
    const { result } = renderHook(() => useChat());

    act(() => {
      result.current.sendMessage("   ");
    });

    expect(result.current.messages).toHaveLength(0);
  });

  it("clears all messages on clearChat", async () => {
    mockFetchSuccess();
    const { result } = renderHook(() => useChat());

    act(() => {
      result.current.sendMessage("Hi");
    });
    await waitFor(() => expect(result.current.loading).toBe(false));

    act(() => {
      result.current.clearChat();
    });

    expect(result.current.messages).toHaveLength(0);
  });

  it("persists messages to localStorage", async () => {
    mockFetchSuccess();
    const { result } = renderHook(() => useChat());

    act(() => {
      result.current.sendMessage("Persist me");
    });

    await waitFor(() => expect(result.current.loading).toBe(false));

    const stored = JSON.parse(localStorage.getItem("chat_messages"));
    expect(stored).toHaveLength(2);
    expect(stored[0].message).toBe("Persist me");
  });

  it("loads persisted messages from localStorage on init", () => {
    const saved = [
      { id: "1", message: "Saved message", sender: "user", timestamp: new Date().toISOString() },
    ];
    localStorage.setItem("chat_messages", JSON.stringify(saved));

    const { result } = renderHook(() => useChat());
    expect(result.current.messages).toHaveLength(1);
    expect(result.current.messages[0].message).toBe("Saved message");
  });

  it("clears localStorage on clearChat", async () => {
    mockFetchSuccess();
    const { result } = renderHook(() => useChat());

    act(() => {
      result.current.sendMessage("Hi");
    });
    await waitFor(() => expect(result.current.loading).toBe(false));

    act(() => {
      result.current.clearChat();
    });

    expect(localStorage.getItem("chat_messages")).toBeNull();
  });
});
