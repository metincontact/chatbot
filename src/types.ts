export interface Message {
  id: string;
  message: string;
  sender: "user" | "robot";
  timestamp: string;
}
