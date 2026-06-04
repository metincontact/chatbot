import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ChatInput } from "../components/ChatInput";

describe("ChatInput", () => {
  it("renders the textarea and send button", () => {
    render(<ChatInput loading={false} onSend={vi.fn()} />);
    expect(screen.getByRole("textbox")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /send message/i })).toBeInTheDocument();
  });

  it("disables send button when input is empty", () => {
    render(<ChatInput loading={false} onSend={vi.fn()} />);
    expect(screen.getByRole("button", { name: /send message/i })).toBeDisabled();
  });

  it("disables send button when loading", () => {
    render(<ChatInput loading={true} onSend={vi.fn()} />);
    expect(screen.getByRole("button")).toBeDisabled();
  });

  it("enables send button when input has text", async () => {
    const user = userEvent.setup();
    render(<ChatInput loading={false} onSend={vi.fn()} />);

    await user.type(screen.getByRole("textbox"), "Hello");
    expect(screen.getByRole("button", { name: /send message/i })).not.toBeDisabled();
  });

  it("calls onSend with input text when send button is clicked", async () => {
    const onSend = vi.fn();
    const user = userEvent.setup();
    render(<ChatInput loading={false} onSend={onSend} />);

    await user.type(screen.getByRole("textbox"), "Hello world");
    await user.click(screen.getByRole("button", { name: /send message/i }));

    expect(onSend).toHaveBeenCalledWith("Hello world");
  });

  it("clears the input after sending", async () => {
    const user = userEvent.setup();
    render(<ChatInput loading={false} onSend={vi.fn()} />);

    const textarea = screen.getByRole("textbox");
    await user.type(textarea, "Hello");
    await user.click(screen.getByRole("button", { name: /send message/i }));

    expect(textarea).toHaveValue("");
  });

  it("submits on Enter key", async () => {
    const onSend = vi.fn();
    const user = userEvent.setup();
    render(<ChatInput loading={false} onSend={onSend} />);

    await user.type(screen.getByRole("textbox"), "Hello{Enter}");
    expect(onSend).toHaveBeenCalledWith("Hello");
  });

  it("does not submit on Shift+Enter", async () => {
    const onSend = vi.fn();
    const user = userEvent.setup();
    render(<ChatInput loading={false} onSend={onSend} />);

    await user.type(screen.getByRole("textbox"), "Hello{Shift>}{Enter}{/Shift}");
    expect(onSend).not.toHaveBeenCalled();
  });

  it("does not call onSend for whitespace-only input", async () => {
    const onSend = vi.fn();
    const user = userEvent.setup();
    render(<ChatInput loading={false} onSend={onSend} />);

    await user.type(screen.getByRole("textbox"), "   {Enter}");
    expect(onSend).not.toHaveBeenCalled();
  });
});
