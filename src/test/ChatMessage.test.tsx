import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { ChatMessage } from "../components/ChatMessage";

const TIMESTAMP = "2024-01-15T10:30:00.000Z";

describe("ChatMessage", () => {
  it("renders user message text", () => {
    render(<ChatMessage text="Hello!" sender="user" timestamp={TIMESTAMP} />);
    expect(screen.getByText("Hello!")).toBeInTheDocument();
  });

  it("renders bot message text", () => {
    render(<ChatMessage text="Hi there" sender="robot" timestamp={TIMESTAMP} />);
    expect(screen.getByText("Hi there")).toBeInTheDocument();
  });

  it("aligns user message to the right", () => {
    const { container } = render(
      <ChatMessage text="Hey" sender="user" timestamp={TIMESTAMP} />
    );
    expect(container.firstChild).toHaveClass("flex-row-reverse");
  });

  it("aligns bot message to the left", () => {
    const { container } = render(
      <ChatMessage text="Hey" sender="robot" timestamp={TIMESTAMP} />
    );
    expect(container.firstChild).toHaveClass("flex-row");
  });

  it("shows formatted timestamp", () => {
    render(<ChatMessage text="Hi" sender="user" timestamp={TIMESTAMP} />);
    const time = new Date(TIMESTAMP).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
    expect(screen.getByText(time)).toBeInTheDocument();
  });

  it("copies message text when copy button is clicked", async () => {
    const writeText = vi.fn().mockResolvedValue(undefined);
    Object.assign(navigator, { clipboard: { writeText } });

    render(<ChatMessage text="Copy me" sender="user" timestamp={TIMESTAMP} />);
    fireEvent.click(screen.getByRole("button", { name: /copy message/i }));

    await waitFor(() => expect(writeText).toHaveBeenCalledWith("Copy me"));
  });

  it("shows 'Copied' feedback after copying", async () => {
    Object.assign(navigator, {
      clipboard: { writeText: vi.fn().mockResolvedValue(undefined) },
    });

    render(<ChatMessage text="Copy me" sender="user" timestamp={TIMESTAMP} />);
    fireEvent.click(screen.getByRole("button", { name: /copy message/i }));

    await waitFor(() =>
      expect(screen.getByRole("button", { name: /copied/i })).toBeInTheDocument()
    );
  });
});
